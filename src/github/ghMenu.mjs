import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import { text, stayOrGo } from "../mainMenus.mjs";
import { mainMenu, welcome } from "../mainMenus.mjs";
import reportsMenu from "./reports/reportsMenu.mjs";
import { sleep } from "../utils/general.mjs";

// Main menu
const ghMainMenu = async () => {
  console.log("");
  const answers = await inquirer.prompt({
    name: "menu",
    type: "list",
    message: "Which section?",
    choices: ["GitHub Reports", "Return to main menu", "Exit"],
  });

  return handleMainSelection(answers.menu);
};
// Main menu selection handler
const handleMainSelection = async (selection) => {
  switch (selection) {
    case "GitHub Reports":
      console.clear();
      await reportsMenu();

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

const ghMenu = async () => {
  await ghMainMenu();
  await stayOrGo();
}

export default ghMenu;
