// https://www.npmjs.com/package/dotenv
import * as dotenv from "dotenv";
dotenv.config();
// https://www.npmjs.com/package/axios
import axios from "axios";
// https://www.npmjs.com/package/axios-oauth-client
import oauth from "axios-oauth-client";
import { execPromise, isRequired } from "./General.js";

let npVault, prodVault;

// Get cleint IDs and secrets from vault
try {
  const npData = await execPromise(
    `vault read -format=json ${process.env.NP_SECRETS}`
  );
  const prodData = await execPromise(
    `vault read -format=json ${process.env.PROD_SECRETS}`
  );
  npVault = JSON.parse(npData);
  prodVault = JSON.parse(prodData);
} catch (error) {
  console.error(error.message);
}

// Client Credentials grant - https://github.com/compwright/axios-oauth-client#client-credentials-grant
const getAuth = oauth.clientCredentials(
  axios.create(),
  process.env.OAUTH_ENDPOINT,
  npVault.data.client_id,
  npVault.data.secret
);

const getProdAuth = oauth.clientCredentials(
  axios.create(),
  process.env.OAUTH_ENDPOINT,
  prodVault.data.client_id,
  prodVault.data.secret
);

export async function getAuthToken(env = isRequired("env (NP or PROD)")) {
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
}
