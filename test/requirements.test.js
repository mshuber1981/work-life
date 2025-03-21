import "dotenv/config";
import { execPromise } from "../src/utils/general.mjs";

describe("Environment and CLI checks", () => {
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
