import "dotenv/config";
import { execPromise } from "./utils/general.js";

// Check for .env API_URL variable
test("Checking for .env API_URL variable...", () => {
  expect(typeof process.env.API_URL).toBe("string");
});
// Check for Vault CLI
test("Checking for Vault CLI...", async () => {
  const vCli = await execPromise("vault -v");
  expect(typeof vCli).toBe("string");
});
// Check for .env OAuth related variables
test("Checking for .env OAuth related variables...", () => {
  expect(typeof process.env.NP_SECRETS).toBe("string");
  expect(typeof process.env.PROD_SECRETS).toBe("string");
  expect(typeof process.env.OAUTH_ENDPOINT).toBe("string");
});
// Check for Google Cloud CLI
test("Checking for Google Cloud CLI...", async () => {
  const gCli = await execPromise("gcloud version");
  expect(typeof gCli).toBe("string");
});
