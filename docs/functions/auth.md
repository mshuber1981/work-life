# Oauth2 Tokens

Most of the APIs I am interacting with are secured with OAuth2.

1. A great place to start - [The complete guide to protecting your APIs with OAuth2 (part 1)](https://stackoverflow.blog/2022/12/22/the-complete-guide-to-protecting-your-apis-with-oauth2/)

2. I love [Axios](https://axios-http.com/), and this is a great OAuth 2.0 client for Axios - [axios-oauth-client](https://github.com/compwright/axios-oauth-client)

   ```javascript
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

[vaultOAuthToken.mjs line 24](https://github.com/mshuber1981/work-life/blob/main/src/utils/vaultOAuthToken.mjs#L24)

```javascript
// Client Credentials grant - https://github.com/compwright/axios-oauth-client#client-credentials-grant
const getAuth = oauth.clientCredentials(
  axios.create(),
  url.data[oAuthKey],
  secrets.data[clientIdKey],
  secrets.data[secretKey]
);
auth = await getAuth(`${secrets.data[clientIdKey]}/.default`);
```
