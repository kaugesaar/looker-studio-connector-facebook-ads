/**
 * Builds the Community Connector config.
 * @see https://developers.google.com/apps-script/reference/data-studio/config*
 * @return The Config
 */
function getConfig() {
  const accessToken = getOAuthService().getAccessToken();
  const fb = new FacebookClient(accessToken);
  const accounts = fb.getAdAccounts();
  const data: { label: string; value: string }[] = [];

  for (let i = 0; i < accounts.length; i++) {
    data.push({
      label: accounts[i].name,
      value: accounts[i].id,
    });
  }

  const currencies: { label: string; value: string }[] = [];

  // Values taken from: https://developers.google.com/looker-studio/connector/reference#currency_semantic_types
  const currencyValues = [
    "CURRENCY_AED",
    "CURRENCY_ALL",
    "CURRENCY_ARS",
    "CURRENCY_AUD",
    "CURRENCY_BDT",
    "CURRENCY_BGN",
    "CURRENCY_BOB",
    "CURRENCY_BRL",
    "CURRENCY_CAD",
    "CURRENCY_CDF",
    "CURRENCY_CHF",
    "CURRENCY_CLP",
    "CURRENCY_CNY",
    "CURRENCY_COP",
    "CURRENCY_CRC",
    "CURRENCY_CZK",
    "CURRENCY_DKK",
    "CURRENCY_DOP",
    "CURRENCY_EGP",
    "CURRENCY_ETB",
    "CURRENCY_EUR",
    "CURRENCY_GBP",
    "CURRENCY_HKD",
    "CURRENCY_HRK",
    "CURRENCY_HUF",
    "CURRENCY_IDR",
    "CURRENCY_ILS",
    "CURRENCY_INR",
    "CURRENCY_IRR",
    "CURRENCY_ISK",
    "CURRENCY_JMD",
    "CURRENCY_JPY",
    "CURRENCY_KRW",
    "CURRENCY_LKR",
    "CURRENCY_LTL",
    "CURRENCY_MNT",
    "CURRENCY_MVR",
    "CURRENCY_MXN",
    "CURRENCY_MYR",
    "CURRENCY_NOK",
    "CURRENCY_NZD",
    "CURRENCY_PAB",
    "CURRENCY_PEN",
    "CURRENCY_PHP",
    "CURRENCY_PKR",
    "CURRENCY_PLN",
    "CURRENCY_RON",
    "CURRENCY_RSD",
    "CURRENCY_RUB",
    "CURRENCY_SAR",
    "CURRENCY_SEK",
    "CURRENCY_SGD",
    "CURRENCY_THB",
    "CURRENCY_TRY",
    "CURRENCY_TWD",
    "CURRENCY_TZS",
    "CURRENCY_UAH",
    "CURRENCY_USD",
    "CURRENCY_UYU",
    "CURRENCY_VEF",
    "CURRENCY_VND",
    "CURRENCY_YER",
    "CURRENCY_ZAR",
  ];

  for (let i = 0; i < currencyValues.length; i++) {
    currencies.push({
      value: currencyValues[i],
      label: currencyValues[i].replace("CURRENCY_", ""),
    });
  }

  return {
    configParams: [
      {
        type: "INFO",
        name: "connect",
        text: "Select Facebook Account and an attribution window, then click CONNECT (top-right corner) to get started.",
      },
      {
        type: "SELECT_SINGLE",
        name: "account",
        displayName: "Select Account",
        parameterControl: {
          allowOverride: true,
        },
        helpText: "Select account you want to retrieve data from.",
        options: data,
      },
      {
        type: "SELECT_SINGLE",
        name: "currency_type",
        displayName: "Select Currency",
        parameterControl: {
          allowOverride: true,
        },
        helpText: "Select which currency your Ads Account use.",
        options: currencies,
      },
      {
        type: "SELECT_SINGLE",
        name: "attribution_window",
        displayName: "Select Conversion Window",
        parameterControl: {
          allowOverride: true,
        },
        helpText: "Choose the conversion window you want to use.",
        options: [
          {
            label: "Default (7 day click / 1 day view)",
            value: "default",
          },
          {
            label: "1 day click",
            value: "1d_click",
          },
          {
            label: "7 day click",
            value: "7d_click",
          },
          {
            label: "28 day click",
            value: "28d_click",
          },
          {
            label: "1 day view",
            value: "1d_view",
          },
          {
            label: "7 day view",
            value: "7d_view",
          },
          {
            label: "1 day click / 1 day view",
            value: "1d_click,1d_view",
          },
          {
            label: "1 day click / 7 day view",
            value: "1d_click,7d_view",
          },
          {
            label: "7 day click / 1 day view",
            value: "7d_click,1d_view",
          },
          {
            label: "7 day click / 7 day view",
            value: "7d_click,7d_view",
          },
          {
            label: "28 day click / 1 day view",
            value: "28d_click,1d_view",
          },
          {
            label: "28 day click / 7 day view",
            value: "28d_click,7d_view",
          },
          {
            label: "DDA",
            value: "dda",
          },
        ],
      },
    ],
    dateRangeRequired: true,
  };
}
