import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import { text, mainMenu, stayOrGo, welcome } from "../../mainMenus.mjs";
import bqMenu from "../bqMenu.mjs";
import { sleep } from "../../utils/general.mjs";
import isoCountryCodes from "./isoCountryCodes.mjs";

// Main menu
export const reportsMainMenu = async () => {
  console.log("");
  const answers = await inquirer.prompt({
    name: "menu",
    type: "list",
    message: "Which action?",
    choices: ["Get a list of all ISO Country Codes", "Return to previous menu", "Return to main menu", "Exit"],
  });

  return handleMainSelection(answers.menu);
};
// Main menu selection handler
const handleMainSelection = async (selection) => {
  switch (selection) {
    case "Get a list of all ISO Country Codes":
      console.clear();
      await isoCountryCodes();

      break;
    case "Return to previous menu":
      console.clear();
      await bqMenu();

      break;
    case "Return to main menu":
      console.clear();
      await welcome(text);
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
// Return to previous menu, main menu, or exit
export const reportsStayOrGo = async () => {
  console.log("");
  const answers = await inquirer.prompt({
    name: "choice",
    type: "list",
    message: "What would you like to do next?",
    choices: ["Return to previous menu", "Return to main menu", "Exit"],
  });

  return reportsHandleStayOrGo(answers.choice);
};
// Main menu selection handler
const reportsHandleStayOrGo = async (selection) => {
  switch (selection) {
    case "Return to previous menu":
      console.clear();
      await reportsMainMenu();

      break;
    case "Return to main menu":
      console.clear();
      await welcome(text);
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

const reportsMenu = async () => {
  await reportsMainMenu();
  await stayOrGo();
};

export default reportsMenu;
