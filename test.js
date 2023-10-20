import * as dotenv from "dotenv";
dotenv.config();
import { execPromise } from "./utils/general.js";

try {
  const envFile = process.env.API_URL;
  if (envFile === undefined) {
    console.log(
      "\x1b[33m%s\x1b[0m",
      "Warning, part of this project relies on at least one URL from a local .env file."
    );
  } else {
    console.log("Success, local .env file API_URL found.");
  }
  const vault = await execPromise("vault -v");
  console.log(vault);
} catch (error) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "Warning, part of this project relies on the Vault cli to access client ids and secrets."
  );
  console.log(error);
}
