# Looker Studio connector for Facebook Ads

Run your own Looker Studio connector for Facebook Ads.

## How to get started

Prerequisite:
- clasp
- gcp-project
- facebook app (with facebook login and marketing api)

I'll update the how-to but meanwhile, the short version:

- Download and push the source code to your script project
    - `clasp create --title your-title --type standalone`
    - `clasp push`
- Within the script project setting
    - Set the script properties `fb_client_id` and `fb_client_secret`
    - At the same page, set your GCP Project Number
- Open up https://console.cloud.google.com/apis/credentials/consent?project=*GCP_PROJECT_NUMBER*
- Add oauth config for the domain google.com
- Add your own email(s) to test users
- Open up https://lookerstudio.google.com/datasources/create?connectorId=*DEPLOYMENT_ID*
- Now you're good to go