# Oauth2 Tokens

Most of the APIs I am interacting with are secured with OAuth2.

1. A great place to start - [The complete guide to protecting your APIs with OAuth2 (part 1)](https://stackoverflow.blog/2022/12/22/the-complete-guide-to-protecting-your-apis-with-oauth2/)

2. I love [Axios](https://axios-http.com/), and this is a great OAuth 2.0 client for Axios - [axios-oauth-client](https://github.com/compwright/axios-oauth-client)

   ```javascript linenums="1"
   import axios from "axios";
   import oauth from "axios-oauth-client";
   const getClientCredentials = oauth.clientCredentials(
     axios.create(),
     "https://oauth.com/2.0/token",
     "CLIENT_ID",
     "CLIENT_SECRET"
   );

   const auth = await getClientCredentials("OPTIONAL_SCOPES");
   // => { "access_token": "...", "expires_in": 900, ... }
   ```

## Example axios-oauth-client usage

[Auth.js line 30](https://github.com/mshuber1981/work-life/blob/main/present/functions/Auth.js#L30)

```javascript linenums="1"
// Client Credentials grant - https://github.com/compwright/axios-oauth-client#client-credentials-grant
const getAuth = oauth.clientCredentials(
  axios.create(),
  oauthEndpoint.data["aad-oauth-url"],
  npVault.data.client_id,
  npVault.data.secret
);

const getProdAuth = oauth.clientCredentials(
  axios.create(),
  oauthEndpoint.data["aad-oauth-url"],
  prodVault.data.client_id,
  prodVault.data.secret
);
```
