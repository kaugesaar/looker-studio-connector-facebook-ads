# Looker Studio connector for Meta Ads

Run your own Looker Studio connector for Meta Ads.


### Prerequisite:

- [clasp](https://github.com/google/clasp)
- [gcp-project](https://console.cloud.google.com/)
- [facebook app](https://developers.facebook.com) (with facebook login and marketing api)

### How to get started

I'll update the how-to but meanwhile, the short version:

- Download and push the source code to your script project
    - `clasp create --title your-title --type standalone`
    - `clasp push`
- Within the script's project setting page (at script.google.com)
    - Set the script properties `fb_client_id` and `fb_client_secret`
    - At the same page, set your GCP Project Number
- Open up https://console.cloud.google.com/apis/credentials/consent?project=*GCP_PROJECT_NUMBER*
- Add oauth config for the domain google.com
- Add your own email(s) to test users
- Open up https://lookerstudio.google.com/datasources/create?connectorId=*DEPLOYMENT_ID*
- Now you're good to go
