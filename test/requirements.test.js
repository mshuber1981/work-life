import "dotenv/config";
import { execPromise } from "../src/utils/general.mjs";

describe("Environment and CLI checks", () => {
  // Check for Vault CLI
  test("Checking for Vault CLI...", async () => {
    try {
      const vCli = await execPromise("vault -v");
      expect(typeof vCli).toBe("string");
    } catch (error) {
      throw new Error("Vault CLI is not installed or not accessible.");
    }
  });
  // Check for Google Cloud CLI
  test("Checking for Google Cloud CLI...", async () => {
    try {
      const gCli = await execPromise("gcloud version");
      expect(typeof gCli).toBe("string");
    } catch (error) {
      throw new Error("Google Cloud CLI is not installed or not accessible.");
    }
  });
});
