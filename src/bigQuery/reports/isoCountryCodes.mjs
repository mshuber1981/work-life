import fs from "fs";
import { BigQuery } from "@google-cloud/bigquery";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { reportsStayOrGo } from "./reportsMenu.mjs";
import { sleep, timeStamp } from "../../utils/general.mjs";
import { writeFile, utils, set_fs } from "xlsx";
set_fs(fs);

//
const isoCountryCodes = async () => {
  const bigquery = new BigQuery();
  const table = "`bigquery-public-data.country_codes.country_codes`";
  const query = `SELECT country_name as Country, alpha_2_code as Two_Char_Code, alpha_3_code as Three_Char_Code FROM ${table};`;
  const spinner = createSpinner(
    `Creating BigQuery job to select all ISO Country Codes from the ${table} table...`
  ).start();
  await sleep();
  try {
    let data;
    const [job] = await bigquery.createQueryJob(query);
    const [result] = await job.getQueryResults();
    console.log(result);
    spinner.success();
    // if (result.data.length !== 0) {
    //   // Create workbook
    //   const workbook = utils.book_new();
    //   const data = [];
    //   spinner.success();
    //   result.data.forEach((element) => {
    //     const tempObj = {};
    //     tempObj["Repo Name"] = element.name;
    //     tempObj["Description"] = element.description;
    //     tempObj["Homepage"] = element.homepage;
    //     data.push(tempObj);
    //   });
    //   // Create worksheet
    //   const worksheet = utils.json_to_sheet(data);
    //   // Add hyperlinks to worksheet
    //   for (let index = 0; index < result.data.length; index++) {
    //     const element = result.data[index];
    //     worksheet[`A${index + 2}`].l = {
    //       Target: element.html_url,
    //     };
    //     worksheet[`C${index + 2}`].l = {
    //       Target: element.homepage,
    //     };
    //   }
    //   // Append NP worksheets to workbook
    //   utils.book_append_sheet(workbook, worksheet, "Repos");
    //   // Export workbook
    //   console.log(
    //     chalk.green(`Exporting results to ${ghUserName}_GitHub_repos.xlsx`)
    //   );
    //   writeFile(workbook, `${ghUserName}_GitHub_repos_${timeStamp()}.xlsx`);
    // } else {
    //   spinner.success();
    //   console.log(`${ghUserName} doesn't have any public repositories yet. - ${chalk.underline("https://github.com/" + ghUserName)}`);
    // }
  } catch (error) {
    spinner.error();
    console.log(error);
    
    // console.log(
    //   `${chalk.red(error.response.status)}: ${error.response.statusText}`
    // );
  }
  await reportsStayOrGo();
};

export default isoCountryCodes;
