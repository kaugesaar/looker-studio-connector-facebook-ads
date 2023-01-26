/**
 * Gets the AuthType for the script.
 * @see https://developers.google.com/apps-script/reference/data-studio/get-auth-type-response
 * @return The Community Connector auth type response
 */
function getAuthType(): object {
  return { type: "OAUTH2" };
}

/**
 * Returns the configured OAuth Service.
 * @return OAuth2Service
 */
function getOAuthService(): GoogleAppsScriptOAuth2.OAuth2Service {
  // The client id and secret key is stored in script properties
  const scriptProperites = PropertiesService.getScriptProperties();
  const fbClientId = scriptProperites.getProperty("fb_client_id");
  const fbClientSecret = scriptProperites.getProperty("fb_client_secret");

  if (!fbClientId || !fbClientSecret) {
    throw new Error("Missing API-keys in Script Properties");
  }

  return OAuth2.createService("facebookApi")
    .setAuthorizationBaseUrl("https://www.facebook.com/dialog/oauth")
    .setTokenUrl("https://graph.facebook.com/v15.0/oauth/access_token")
    .setClientId(fbClientId)
    .setClientSecret(fbClientSecret)
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCallbackFunction("authCallback")
    .setScope("ads_read");
}

/**
 * Gets the 3P authorization URL.
 * @see https://developers.google.com/apps-script/reference/script/authorization-info
 * @return The authorization URL.
 */
function get3PAuthorizationUrls(): string {
  return getOAuthService().getAuthorizationUrl();
}

/**
 * The OAuth callback.
 * @param request The request data received from the OAuth flow.
 * @return The HTML output to show to the user.
 */
function authCallback(request: object): GoogleAppsScript.HTML.HtmlOutput {
  const authorized = getOAuthService().handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput("Success! You can close this tab.");
  }
  return HtmlService.createHtmlOutput("Denied. You can close this tab");
}

/**
 * Function to check if current user has access.
 * @return True if the auth service has access.
 */
function isAuthValid(): boolean {
  return getOAuthService().hasAccess();
}

/**
 * Resets the auth service.
 */
function resetAuth() {
  return getOAuthService().reset();
}
