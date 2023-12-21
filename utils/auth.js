// https://github.com/motdotla/dotenv
import "dotenv/config";
// https://github.com/axios/axios
import axios from "axios";
// https://github.com/compwright/axios-oauth-client
import oauth from "axios-oauth-client";
import isRequired from "./general.js";
import { execPromise } from "./general.js";

let npVault, prodVault, oauthEndpoint;

// Get cleint IDs and secrets from vault
try {
  const npData = await execPromise(
    `vault read -format=json ${process.env.NP_SECRETS}`
  );
  const prodData = await execPromise(
    `vault read -format=json ${process.env.PROD_SECRETS}`
  );
  const oauthData = await execPromise(
    `vault read -format=json ${process.env.OAUTH_ENDPOINT}`
  );
  npVault = JSON.parse(npData);
  prodVault = JSON.parse(prodData);
  oauthEndpoint = JSON.parse(oauthData);
} catch (error) {
  throw new Error(error.message);
}

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

const getAuthToken = async (env = isRequired("env (NP or PROD)")) => {
  try {
    if (env.toUpperCase() === "NP") {
      const auth = await getAuth(`${npVault.data.client_id}/.default`);
      return auth;
    } else if (env.toUpperCase() === "PROD") {
      const auth = await getProdAuth(`${prodVault.data.client_id}/.default`);
      return auth;
    } else {
      throw new Error(
        `${env} is not a valid argument, please use "NP" or "PROD".`
      );
    }
  } catch (error) {
    throw new Error(error.code);
  }
};

export default getAuthToken;
