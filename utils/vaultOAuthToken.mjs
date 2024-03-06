import axios from "axios";
import oauth from "axios-oauth-client";
import isRequired from "./general.mjs";
import { execPromise } from "./general.mjs";

export const getToken = async (
  vaultOAuthEndpoint = isRequired("Vault path for OAuth endpoint"),
  vaultSecrets = isRequired("Vault path for clientID and Secret"),
  oAuthKey = "aad-oauth-url",
  clientIdKey = "client_id",
  secretKey = "secret"
) => {
  let secrets, url, auth;
  try {
    // Get cleint IDs and secrets from vault
    const vaultSecretData = await execPromise(
      `vault read -format=json ${vaultSecrets}`
    );
    const vaultOAuthUrlData = await execPromise(
      `vault read -format=json ${vaultOAuthEndpoint}`
    );
    secrets = JSON.parse(vaultSecretData);
    url = JSON.parse(vaultOAuthUrlData);
    const getAuth = oauth.clientCredentials(
      axios.create(),
      url.data[oAuthKey],
      secrets.data[clientIdKey],
      secrets.data[secretKey]
    );
    auth = await getAuth(`${secrets.data[clientIdKey]}/.default`);
  } catch (error) {
    throw new Error(error.message)
  }
  return auth;
};

export default getToken;
