import * as fs from "fs";
import "dotenv/config";
import { execPromise } from "./utils/general.js";

// Check for .env file
test("Checking for .env file...", () => {
  expect(fs.existsSync(".env")).toBe(true);
});
// Check for Vault CLI
test("Checking for Vault CLI...", async () => {
  const vCli = await execPromise("vault -v");
  expect(typeof vCli).toBe("string");
});
// Check for Google Cloud CLI
test("Checking for Google Cloud CLI...", async () => {
  const gCli = await execPromise("gcloud version");
  expect(typeof gCli).toBe("string");
});
