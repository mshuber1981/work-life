import chalk from "chalk";
import { welcome, mainMenu, text } from "./src/mainMenus.mjs";
import { execPromise } from "./src/utils/general.mjs";

// This command will fail if you do not have the gcloud CLI installed
const command =
  'gcloud auth list --filter=status:ACTIVE --format="value(account)"';
let commandError = false;
let gcloud;

await welcome(text);
try {
  gcloud = await execPromise(command);
} catch (error) {
  commandError = true;
  console.log(error);
  console.log(`
  Part of this project uses the ${chalk.yellow(
    "gcloud CLI"
  )}. It must be installed and authorized with a user account to use the Google Cloud section.
  More info can be found here ${chalk.green(
    "https://cloud.google.com/sdk/docs/install#deb"
  )}
  and here ${chalk.green(
    "https://cloud.google.com/sdk/docs/authorizing#authorize_with_a_user_account"
  )}
  `);
}

console.log(`Active gcloud account: ${gcloud}`);
await mainMenu();
