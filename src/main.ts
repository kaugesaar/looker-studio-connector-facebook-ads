function getData(request: GoogleAppsScript.Data_Studio.Request<any>) {
  const accessToken = getOAuthService().getAccessToken();
  const fb = new FacebookClient(accessToken);
  fb.setRequest(request);
  return fb.getData();
}

function isAdminUser() {
  return false;
}
