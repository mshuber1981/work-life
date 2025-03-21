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
    spinner
      .success()
      .info(
        `ISO Country Codes successfully queried from ${table} table at ${timeStamp()}`
      );
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
    console.log(
      chalk.green(
        `Exporting results to ISO_Country_Codes.xlsx at ${timeStamp()}`
      )
    );
    writeFile(workbook, `ISO_Country_Codes_${timeStamp()}.xlsx`);
  } catch (error) {
    spinner.error();
    console.log(error);
  }
  await reportsStayOrGo();
};

export default isoCountryCodes;
