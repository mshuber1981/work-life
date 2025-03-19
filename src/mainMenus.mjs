import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { sleep } from "./utils/general.mjs";
import ghMenu from "./github/ghMenu.mjs";
import bqMenu from "./bigQuery/bqMenu.mjs";

// Welcome title text
export const text = figlet.textSync("Work Life Tools");
// Welcome
export const welcome = async (text) => {
  const animation = chalkAnimation.rainbow(text);
  await sleep();
  animation.stop();
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
