import fs from "fs";
import axios from "axios";
import chalk from "chalk";
import csvToArray from "./utils/csv.mjs";
import { BigQuery } from "@google-cloud/bigquery";
import { writeFile, utils, set_fs } from "xlsx";
set_fs(fs);

// Set CSV file name
const csvFileName = "test";
let csvArray;

try {
  // Read CSV file
  console.log(`Reading ${csvFileName}.csv`);
  const csvData = fs.readFileSync(`./${csvFileName}.csv`, "utf-8");
  // Covert to Array
  csvArray = csvToArray(csvData, ",", true);
  console.log(`Converting ${csvFileName}.csv to an array:`);
  console.log(csvArray);
} catch (error) {
  console.log(`${chalk.red(error.message)} (check csvFilename - line 5)`);
}

try {
  console.log("Fetching GitHub projects...");
  const result = await axios.get(
    "https://api.github.com/users/mshuber1981/repos"
  );
  // Create workbook
  const workbook = utils.book_new();
  const data = [];
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
  console.log(chalk.green("Exporting results to My_GitHub_repos.xlsx"));
  writeFile(workbook, "My_GitHub_repos.xlsx");
} catch (error) {
  console.log(chalk.red(error.code));
}

const bigquery = new BigQuery({
  projectId: process.env.PROJECT_ID,
});
const table = "`bigquery-public-data.country_codes.country_codes`";
const query = `SELECT country_name as Country, alpha_2_code as Two_Char_Code, alpha_3_code as Three_Char_Code FROM ${table};`;

try {
  let data;
  console.log("Querying ISO Country Codes...");
  const [job] = await bigquery.createQueryJob(query);
  const [result] = await job.getQueryResults();
  // Create workbook
  const workbook = utils.book_new();
  // Worksheet
  data = [...result];
  const worksheet = utils.json_to_sheet(data);
  // Add hyperlinks to worksheet
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    worksheet[`B${index + 2}`].l = {
      Target: `https://www.iso.org/obp/ui/#iso:code:3166:${element.Two_Char_Code}`,
    };
  }
  // Append NP worksheet to workbook
  utils.book_append_sheet(workbook, worksheet, "ISO Country Codes");
  // Export workbook
  console.log(chalk.green("Exporting results to ISO_Country_Codes.xlsx"));
  writeFile(workbook, "ISO_Country_Codes.xlsx");
} catch (error) {
  console.log(chalk.red(error));
}
