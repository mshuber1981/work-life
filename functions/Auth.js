// https://www.npmjs.com/package/dotenv
import * as dotenv from "dotenv";
dotenv.config();
// https://www.npmjs.com/package/axios
import axios from "axios";
// https://www.npmjs.com/package/axios-oauth-client
import oauth from "axios-oauth-client";

// Client Credentials grant - https://github.com/compwright/axios-oauth-client#client-credentials-grant
const getAuth = oauth.clientCredentials(
  axios.create(),
  // secret/spirit/urls/np/aad-oauth-url
  process.env.OAUTH_ENDPOINT,
  // secret/spirit/oauth/QandA-NP/client_id
  process.env.CLIENT_ID,
  // secret/spirit/oauth/QandA-NP/secret
  process.env.CLIENT_SECRET
);

const getProdAuth = oauth.clientCredentials(
  axios.create(),
  // secret/spirit/urls/np/aad-oauth-url
  process.env.OAUTH_ENDPOINT,
  // secret/spirit/oauth/QandA-NP/client_id
  process.env.PROD_CLIENT_ID,
  // secret/spirit/oauth/QandA-NP/secret
  process.env.PROD_CLIENT_SECRET
);

export async function getAuthToken(env = "np") {
  try {
    if (env.toUpperCase() === "NP") {
      const auth = await getAuth(`${process.env.CLIENT_ID}/.default`);

      return auth;
    } else if (env.toUpperCase() === "PROD") {
      const auth = await getProdAuth(`${process.env.PROD_CLIENT_ID}/.default`);

      return auth;
    } else {
      throw new Error(
        `${env} is not a valid argument, please use "NP" or "PROD".`
      );
    }
  } catch (error) {
    throw new Error(error.code);
  }
}
