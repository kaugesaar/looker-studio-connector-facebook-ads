type SchemaObject = {
  name: string;
  dataType: string;
};

type InisghtsQueryResponse = {
  data: string[];
  paging: {
    next?: string;
  };
};

type ActionValuesResponse = {
  action_type: string;
  value: string;
  [key: string]: string;
};

class FacebookClient {
  baseUrl: string;
  accessToken: string;
  request?: GoogleAppsScript.Data_Studio.Request<any>;

  /**
   * Init FacebookClient
   *
   * @param accessToken the accessToken for facebook api
   * @param version optional - defaults to v15.0
   */
  constructor(accessToken: string, version = "v15.0") {
    this.accessToken = accessToken;
    this.baseUrl = `https://graph.facebook.com/${version}`;
  }

  /**
   * Sets the request object
   *
   * @param request The request object
   */
  setRequest(request: GoogleAppsScript.Data_Studio.Request<any>) {
    this.request = request;
  }

  /**
   * Returns the current request object
   *
   * @returns The request object
   */
  getRequest(): GoogleAppsScript.Data_Studio.Request<any> {
    if (!this.request) throw new Error("No request set");
    return this.request;
  }

  /**
   * Get the ad accounts current user has access to.
   *
   * @return The ad accounts.
   */
  getAdAccounts(): { name: string; id: string }[] {
    return this.get("/me/adaccounts/?fields=id,name");
  }

  /**
   * Navigates through all pages in the api request and returns all data in a array.
   *
   * @param path The facebook api path
   * @return The response data.
   */
  get(path: string): any[] {
    let url = this.baseUrl + path;
    let next: boolean | string = true;
    let data: any[] = [];
    let response;
    do {
      try {
        response = UrlFetchApp.fetch(url, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
      } catch (error: any) {
        throw new Error(
          `DS_USER: Query to Facebook API has failed. Please try again later. URL: ${url}`
        );
      }
      const result: InisghtsQueryResponse = JSON.parse(
        response.getContentText()
      );
      data = data.concat(result.data);
      next = result.paging.next || false;
      url = result.paging.next ? result.paging.next : url;
      // @see: https://developers.facebook.com/docs/graph-api/overview/rate-limiting/
      // Calls within one hour = 60 + 400 * Number of Active ads - 0.001 * User Errors
      // Could also look at the "x-ad-account-usage" header
      Utilities.sleep(250);
    } while (next);

    return data;
  }

  /**
   * Maps the request object fields with the Looker Studio Schema.
   *
   * @param request The Looker Studio Request Object
   * @returns SchemaObject
   */
  getSchemaFromRequest(
    request: GoogleAppsScript.Data_Studio.Request<any>
  ): SchemaObject[] {
    const data: SchemaObject[] = [];
    const { schema } = new Schema(request).getSchema();
    for (let i = 0; i < request.fields.length; i++) {
      const field: SchemaObject = {
        name: request.fields[i].name,
        dataType: "",
      };
      for (let j = 0; j < schema.length; j++) {
        if (schema[j].name === request.fields[i].name) {
          field.dataType = schema[j].dataType;
          break;
        }
      }
      data.push(field);
    }
    return data;
  }

  /**
   * Parse through all facebook api values and pass it to an object array
   *
   * @param data Facebook Api Values
   * @param schema Array of SchemaObjects
   * @returns Formated values
   */
  getRowsFromData(data: string[], schema: SchemaObject[]) {
    const rows = [];
    for (let i = 0; i < data.length; i++) {
      const row: { values: string[] } = { values: [] };
      for (let j = 0; j < schema.length; j++) {
        row.values.push(this.mapSchemaValue(data[i], schema[j].name));
      }
      rows.push(row);
    }
    return rows;
  }

  /**
   * Maps Facebook data with the Looker Studio Schema
   *
   * @param data Facebook Data Array
   * @param schemaName Name of the schema field
   * @returns The value of the schema name
   */
  mapSchemaValue(data: any, schemaName: string) {
    let value: string;
    const [key, name] = schemaName.split("__");
    switch (key) {
      // Format the date value for Looker Studio
      case "date":
        value = data.date_start.replace(/-/g, "");
        break;
      // All action values is inside nested object
      // Also make sure actionType is not undefined
      case "action_values":
        value = this.getActionValue(name, data.action_values);
        break;
      case "actions":
        value = this.getActionValue(name, data.actions);
        break;
      default:
        value = data[name];
        break;
    }
    return value;
  }

  /**
   * Returns the value for the request object field
   *
   * @param actionType name of the actionType
   * @param actionValues the action value response object
   * @returns The fields value
   */
  getActionValue(
    actionType: string,
    actionValues: ActionValuesResponse[]
  ): string {
    const attributionWindows: string[] =
      this.request?.configParams.attribution_window.split(",");
    let sum = 0;
    for (let i = 0; i < actionValues.length; i++) {
      if (actionValues[i].action_type === actionType) {
        for (let j = 0; j < attributionWindows.length; j++) {
          if (attributionWindows[j] === "default") {
            sum += parseFloat(actionValues[i].value) || 0;
          } else {
            sum += parseFloat(actionValues[i][attributionWindows[j]]) || 0;
          }
        }
      }
    }
    return String(sum);
  }

  /**
   * Parses all fields in the request object and returns the list of breakdowns for the request.
   *
   * @param request The Looker Studio Request Object
   * @returns Breakdowns in string format seperated with comma
   */
  getBreakdownsFromRequest(request: GoogleAppsScript.Data_Studio.Request<any>) {
    const str = [];
    for (let i = 0; i < request.fields.length; i++) {
      const fbBreakdownName = this.getFbBreakdownName(request.fields[i].name);
      if (fbBreakdownName && str.indexOf(fbBreakdownName) === -1) {
        str.push(fbBreakdownName);
      }
    }
    return str.join(",");
  }

  /**
   * Parses all fields in the request object to get the best suited time_increment
   *
   * @param fields The Looker Studio Request Object
   * @returns timeIncrement value
   */
  getTimeIncrementFromFields(fields: string) {
    return fields.indexOf("date") > -1 ? 1 : "all_days";
  }

  /**
   * Parses all fields in the request object and returns the list of fields for the request.
   *
   * @param request The Looker Studio Request Object.
   * @returns Fields in string format seperated with comma.
   */
  getFieldsFromRequest(
    request: GoogleAppsScript.Data_Studio.Request<any>
  ): string {
    const str = [];
    for (let i = 0; i < request.fields.length; i++) {
      const fbFieldName = this.getFbFieldName(request.fields[i].name);
      if (fbFieldName && str.indexOf(fbFieldName) === -1) {
        str.push(fbFieldName);
      }
    }
    return str.join(",");
  }

  /**
   * Get the facebook friendly breakdown name
   *
   * @param fieldName The request object field name
   * @returns The facebook breakdown name
   */
  getFbBreakdownName(fieldName: string) {
    let name: string | boolean = "";
    const [key, value] = fieldName.split("__");
    switch (key) {
      case "breakdown":
        name = value;
        break;
      // Default to false
      default:
        name = false;
        break;
    }
    return name;
  }

  /**
   * Get the facebook friendly field name
   *
   * @param fieldName The request object field name
   * @returns The facebook field name or false
   */
  getFbFieldName(fieldName: string) {
    let name: string | boolean;
    const [key, value] = fieldName.split("__");
    switch (key) {
      // date shouldn't be sent as a field
      case "date":
        name = false;
        break;
      // breakdown shouldn't be sent as field
      case "breakdown":
        name = false;
        break;
      // actions lives inside a nested object
      // the correct field for FB api is "actions"
      case "actions":
        name = key;
        break;
      // actions values lives inside a nested object
      // the correct field for FB api is "actions"
      case "action_values":
        name = key;
        break;
      // per default just map the same name
      default:
        name = value;
        break;
    }
    return name;
  }

  /**
   * Returns the best suited report level based on the fields used.
   *
   * @param fields The facebook fields string
   * @returns
   */
  getLevel(fields: string) {
    const adLevel = ["ad_name", "ad_id"].join("|");
    const adSetLevel = ["adset_name", "adset_id"].join("|");
    const campaignLevel = ["campaign_name", "campaign_id"].join("|");
    if (fields.match(adLevel)) return "ad";
    if (fields.match(adSetLevel)) return "adset";
    if (fields.match(campaignLevel)) return "campaign";
    return "account";
  }

  /**
   * Get data from request parameters formated for Looker Studio.
   *
   * @return The formated data.
   */
  getData(): object {
    const request = this.getRequest();
    const adAccount = request.configParams.account;
    const fields = this.getFieldsFromRequest(request);
    const schema = this.getSchemaFromRequest(request);
    const params = {
      limit: 100,
      fields,
      breakdowns: this.getBreakdownsFromRequest(request),
      time_range: JSON.stringify({
        since: request.dateRange.startDate,
        until: request.dateRange.endDate,
      }),
      action_attribution_windows: String(
        request.configParams.attribution_window
      ),
      level: this.getLevel(fields),
      time_increment: this.getTimeIncrementFromFields(fields),
    };
    const url = `/${adAccount}/insights?${Utils.querystring(params)}`;
    const data = this.get(url);
    const rows = this.getRowsFromData(data, schema);
    return {
      schema,
      rows,
      filtersApplied: false,
    };
  }
}
