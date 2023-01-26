// @see: https://developers.facebook.com/docs/marketing-api/insights/parameters
class Schema {
  request: GoogleAppsScript.Data_Studio.Request<any>;

  constructor(request: GoogleAppsScript.Data_Studio.Request<any>) {
    this.request = request;
  }

  getSchema() {
    return {
      schema: [
        // Actions
        this.actions("rsvp", "RSVP"),
        this.actions("video_view", "Video Views"),
        this.actions("landing_page_view", "Landing Page Views"),
        this.actions("comment", "Comments"),
        this.actions("like", "Likes"),
        this.actions("link_click", "Link Clicks"),
        this.actions("onsite_conversion.post_save", "Post saves"),
        this.actions(
          "offsite_conversion.fb_pixel_add_to_cart",
          "Website Adds to Cart Conversions"
        ),
        this.actions(
          "offsite_conversion.fb_pixel_initiate_checkout",
          "Website Checkout Initiated Conversions"
        ),
        this.actions(
          "offsite_conversion.fb_pixel_purchase",
          "Website Purchase Conversions"
        ),
        this.actions(
          "offsite_conversion.fb_pixel_view_content",
          "Website View Content Conversions"
        ),
        this.actions("post", "Post Shares"),

        // Action Values
        this.actionValues(
          "offsite_conversion.fb_pixel_add_to_cart",
          "Website Adds to Cart Conversion Value"
        ),
        this.actionValues(
          "offsite_conversion.fb_pixel_initiate_checkout",
          "Website Checkout Initiated Conversion Value"
        ),
        this.actionValues(
          "offsite_conversion.fb_pixel_purchase",
          "Website Purchase Conversion Value"
        ),
        this.actionValues(
          "offsite_conversion.fb_pixel_view_content",
          "Website View Content Conversion Value"
        ),
        this.actionValues(
          "omni_add_to_cart",
          "Omni Adds to Cart Converion Value"
        ),
        this.actionValues(
          "omni_initiated_checkout",
          "Omni Checkout Initiated Converion Value"
        ),
        this.actionValues("omni_purchase", "Omni Purchase Converion Value"),
        this.actionValues(
          "omni_view_content",
          "Omni View Content Converion Value"
        ),

        // Breakdown
        this.breakdown("ad_format_asset"),
        this.breakdown("age"),
        this.breakdown("body_asset"),
        this.breakdown("call_to_action_asset"),
        this.breakdown("country"),
        this.breakdown("description_asset"),
        this.breakdown("gender"),
        this.breakdown("image_asset"),
        this.breakdown("impression_device"),
        this.breakdown("link_url_asset"),
        this.breakdown("product_id"),
        this.breakdown("region"),
        this.breakdown("title_asset"),
        this.breakdown("video_asset"),
        this.breakdown("dma"),
        this.breakdown("frequency_value"),
        this.breakdown("hourly_stats_aggregated_by_advertiser_time_zone"),
        this.breakdown("hourly_stats_aggregated_by_audience_time_zone"),
        this.breakdown("place_page_id"),
        this.breakdown("publisher_platform"),
        this.breakdown("platform_position"),
        this.breakdown("device_platform"),

        // Date
        this.date("date", "YEAR_MONTH_DAY", "Date", true),

        // Dimensions
        this.dimension("ad_id"),
        this.dimension("ad_name"),
        this.dimension("adset_id"),
        this.dimension("adset_name"),
        this.dimension("buying_type"),
        this.dimension("campaign_id"),
        this.dimension("campaign_name"),
        this.dimension("conversion_rate_ranking"),
        this.dimension("engagement_rate_ranking"),
        this.dimension("objective"),
        this.dimension("quality_ranking"),

        // Costs
        this.aggregatedCost(
          "cost_per_estimated_ad_recallers",
          "Sum(cost__spend) / (Sum(metric__estimated_ad_recallers) / 1000)"
        ),
        this.aggregatedCost(
          "cost_per_inline_link_click",
          "Sum(cost__spend) / Sum(metric__inline_link_clicks)"
        ),
        this.aggregatedCost(
          "cost_per_inline_post_engagement",
          "Sum(cost__spend) / Sum(metric__inline_post_engagement)"
        ),
        this.aggregatedCost(
          "cost_per_unique_click",
          "Sum(cost__spend) / Sum(unique_clicks)"
        ),
        this.aggregatedCost(
          "cost_per_unique_inline_link_click",
          "Sum(cost__spend) / Sum(metric__cost_per_inline_link_click)"
        ),
        this.aggregatedCost(
          "cpc",
          "Sum(cost__spend) / Sum(metric__clicks)",
          "CPC"
        ),
        this.aggregatedCost(
          "cpm",
          "Sum(cost__spend) / (Sum(metric__impressions) / 1000)",
          "CPM"
        ),
        this.aggregatedCost(
          "cpp",
          "Sum(cost__spend) / (Sum(metric__reach / 1000)",
          "CPP"
        ),
        this.cost("social_spend"),
        this.cost("spend"),

        // Metrics
        this.metric("clicks"),
        this.metric("deeplink_clicks"),
        this.metric("estimated_ad_recall_rate"),
        this.metric("estimated_ad_recallers"),
        this.metric("full_view_impressions"),
        this.metric("full_view_reach"),
        this.metric("impressions"),
        this.metric("inline_link_clicks"),
        this.metric("inline_post_engagement"),
        this.metric("instant_experience_clicks_to_open"),
        this.metric("instant_experience_clicks_to_start"),
        this.metric("instant_experience_outbound_clicks"),
        this.metric("newsfeed_avg_position"),
        this.metric("newsfeed_clicks"),
        this.metric("newsfeed_impressions"),
        this.metric("reach"),
        this.metric("unique_clicks"),
        this.metric("unique_inline_link_clicks"),
        this.aggregatedMetric(
          "frequency",
          "Sum(metric__impressions)/ Sum(metric__reach)"
        ),

        // Percents
        this.percent(
          "inline_link_click_ctr",
          "Sum(metric__inline_link_clicks) / Sum(metric__impressions)"
        ),
        this.percent(
          "ctr",
          "Sum(metric__clicks) / Sum(metric__impressions)",
          "CTR"
        ),
        this.percent(
          "unique_ctr",
          "Sum(metric__unique_clicks) / Sum(metric__reach)"
        ),
        this.percent(
          "unique_inline_link_click_ctr",
          "Sum(metric__unique_inline_link_clicks) / Sum(metric__reach)"
        ),
        this.percent(
          "unique_link_clicks_ctr",
          "Sum(actions__link_click) / Sum(metric__reach)"
        ),
      ],
    };
  }

  date(key: string, semanticType: string, label?: string, isDefault?: boolean) {
    isDefault = isDefault || false;
    label = label || this.fromKeyToLabel(key);
    return {
      name: `date__${key}`,
      label,
      group: "Date",
      dataType: "STRING",
      isDefault,
      semantics: {
        conceptType: "DIMENSION",
        semanticType,
        semanticGroup: "DATETIME",
      },
    };
  }

  actionValues(key: string, label?: string) {
    label = label || this.fromKeyToLabel(key);
    return {
      name: `action_values__${key}`,
      label,
      group: "Action Values",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticType: this.request.configParams.currency_type,
        semanticGroup: "CURRENCY",
      },
    };
  }

  actions(key: string, label?: string) {
    label = label || this.fromKeyToLabel(key);
    return {
      name: `actions__${key}`,
      label,
      group: "Actions",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticType: "NUMBER",
      },
    };
  }

  breakdown(key: string, label?: string) {
    label = label || this.fromKeyToLabel(key);
    return {
      name: `breakdown__${key}`,
      label,
      group: "Breakdown",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT",
      },
    };
  }

  dimension(
    key: string,
    label?: string,
    group?: string,
    semanticType?: string
  ) {
    label = label || this.fromKeyToLabel(key);
    group = group || "Dimensions";
    semanticType = semanticType || "TEXT";
    return {
      name: `dimension__${key}`,
      label,
      group,
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType,
      },
    };
  }

  cost(key: string, label?: string, group?: string) {
    label = label || this.fromKeyToLabel(key);
    group = group || "Costs";
    return {
      name: `cost__${key}`,
      label,
      group,
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticType: this.request.configParams.currency_type,
        semanticGroup: "CURRENCY",
      },
    };
  }

  metric(key: string, label?: string, group?: string) {
    label = label || this.fromKeyToLabel(key);
    group = group || "Metrics";
    return {
      name: `metric__${key}`,
      label,
      group,
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticType: "NUMBER",
      },
    };
  }

  aggregatedMetric(
    key: string,
    formula: string,
    label?: string,
    group?: string
  ) {
    label = label || this.fromKeyToLabel(key);
    group = group || "Metrics";
    return {
      name: `aggregated_metric__${key}`,
      label,
      group,
      formula,
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticType: "NUMBER",
      },
    };
  }

  aggregatedCost(key: string, formula: string, label?: string, group?: string) {
    label = label || this.fromKeyToLabel(key);
    group = group || "Costs";
    return {
      name: `aggregated_cost__${key}`,
      label,
      group,
      formula,
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticType: this.request.configParams.currency_type,
        semanticGroup: "CURRENCY",
      },
    };
  }

  percent(key: string, formula: string, label?: string, group?: string) {
    label = label || this.fromKeyToLabel(key);
    group = group || "Metrics";
    return {
      name: `percent__${key}`,
      label,
      group,
      formula,
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticGroup: "NUMERIC",
        semanticType: "PERCENT",
      },
    };
  }

  fromKeyToLabel(key: string) {
    return Utils.toTitleCase(key.replace(/_/g, " "));
  }
}

function getSchema(request: GoogleAppsScript.Data_Studio.Request<any>) {
  return new Schema(request).getSchema();
}
