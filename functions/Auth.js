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

export async function getAuthToken() {
  try {
    const auth = await getAuth(`${process.env.CLIENT_ID}/.default`);
    return auth;
  } catch (error) {
    throw new Error(error.code);
  }
}
