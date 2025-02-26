import fs from "fs";
import axios from "axios";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { reportsStayOrGo } from "./reportsMenu.mjs";
import { sleep, timeStamp } from "../../utils/general.mjs";
import { userName } from "../../mainMenus.mjs";
import { writeFile, utils, set_fs } from "xlsx";
set_fs(fs);

let ghUserName;

// Get all the GH repos for a given username
const ghRepos = async () => {
  ghUserName = await userName();
  const spinner = createSpinner(
    `Fetching GitHub repos for ${ghUserName}...`
  ).start();
  await sleep();
  try {
    const result = await axios.get(
      `https://api.github.com/users/${ghUserName}/repos`
    );
    // console.log(result);
    if (result.data.length !== 0) {
      // Create workbook
      const workbook = utils.book_new();
      const data = [];
      spinner.success();
      result.data.forEach((element) => {
        const tempObj = {};
        tempObj["Repo Name"] = element.name;
        tempObj["Description"] = element.description;
        tempObj["Homepage"] = element.homepage;
        data.push(tempObj);
      });
      // Create worksheet
      const worksheet = utils.json_to_sheet(data);
      // Add hyperlinks to worksheet
      for (let index = 0; index < result.data.length; index++) {
        const element = result.data[index];
        worksheet[`A${index + 2}`].l = {
          Target: element.html_url,
        };
        worksheet[`C${index + 2}`].l = {
          Target: element.homepage,
        };
      }
      // Append NP worksheets to workbook
      utils.book_append_sheet(workbook, worksheet, "Repos");
      // Export workbook
      console.log(
        chalk.green(`Exporting results to ${ghUserName}_GitHub_repos.xlsx`)
      );
      writeFile(workbook, `${ghUserName}_GitHub_repos_${timeStamp()}.xlsx`);
    } else {
      spinner.success();
      console.log(`${ghUserName} doesn't have any public repositories yet. - ${chalk.underline("https://github.com/" + ghUserName)}`);
    }
  } catch (error) {
    spinner.error();
    console.log(`${chalk.red(error.response.status)}: ${error.response.statusText}`);
    console.log(`Are you sure ${chalk.yellow(ghUserName)} is a valid GitHub username? - ${chalk.underline("https://github.com/" + ghUserName)}`);
  }
  await reportsStayOrGo();
};

export default ghRepos;
