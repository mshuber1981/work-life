import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { execPromise, sleep } from "./utils/general.mjs";
import ghMenu from "./github/ghMenu.mjs";
import bqMenu from "./bigQuery/bqMenu.mjs";

// Welcome title text
export const text = figlet.textSync("Work Life Tools");
// Welcome
export const welcome = async (text) => {
  // This command will fail if you do not have the gcloud CLI installed
  const command =
    'gcloud auth list --filter=status:ACTIVE --format="value(account)"';
  let gcloud;
  const animation = chalkAnimation.rainbow(text);
  await sleep();
  animation.stop();
  try {
    gcloud = await execPromise(command);
  } catch (error) {
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

  if (!["", null, undefined].includes(gcloud)) {
    console.log(`Active gcloud account: ${gcloud}`);
  } else {
    console.log(`
  ${chalk.yellow(
    "Warning!"
  )} You will need an active authorized Google Cloud account to use the BigQuery section.
  More info can be found here ${chalk.green(
    "https://cloud.google.com/sdk/docs/authorizing#authorize_with_a_user_account"
  )}
  `);
  }
};
// Main menu
export const mainMenu = async () => {
  console.log("");
  const answers = await inquirer.prompt({
    name: "menu",
    type: "list",
    message: "What section?",
    choices: ["GitHub API example", "Google BigQuery example", "Exit"],
  });

  return handleMainSelection(answers.menu);
};
// Main menu selection handler
const handleMainSelection = async (selection) => {
  switch (selection) {
    case "GitHub API example":
      console.clear();
      await ghMenu();

      break;
    case "Google BigQuery example":
      console.clear();
      await bqMenu();

      break;
    case "Exit":
      console.clear();
      const spinner = createSpinner("Exiting...").start();
      await sleep();
      spinner.stop();
      console.clear();
      process.exit(0);
    default:
      break;
  }
};
// Return to main menu or exit
export const stayOrGo = async () => {
  console.log("");
  const answers = await inquirer.prompt({
    name: "choice",
    type: "list",
    message: "What would you like to do next?",
    choices: ["Return to main menu", "Exit"],
  });

  return handleStayOrGo(answers.choice);
};
// Main menu selection handler
const handleStayOrGo = async (selection) => {
  switch (selection) {
    case "Return to main menu":
      console.clear();
      await welcome();
      await mainMenu();

      break;
    case "Exit":
      console.clear();
      const spinner = createSpinner("Exiting...").start();
      await sleep();
      spinner.stop();
      console.clear();
      process.exit(0);
    default:
      break;
  }
};
// Get Excel file path + name
export const excelFilePathName = async (file = "./test") => {
  const answer = await inquirer.prompt({
    name: "filePathName",
    type: "input",
    message: `What is the ${chalk.underline(
      "path"
    )} and Excel file ${chalk.underline("name")}? (Do ${chalk.red(
      "NOT"
    )} include the ${chalk.underline(".xlsx")} file extension)
  Type ${chalk.underline("exit")} to return to the previous menu.`,
    default() {
      return file;
    },
  });

  return answer.filePathName;
};
// Get username
export const userName = async () => {
  const answers = await inquirer.prompt({
    name: "user_name",
    type: "input",
    message: "What is your username?",
    default() {
      return "mshuber1981";
    },
  });

  return answers.user_name.trim().toLowerCase();
};

export default welcome;
