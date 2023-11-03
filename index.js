import * as fs from "fs";
set_fs(fs);
import * as dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { writeFile, utils, set_fs } from "xlsx";
import csvToArray from "./utils/csv.js";

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
  console.log(`${error.message} (check csvFilename - line 5)`);
}

try {
  console.log("Fetching GitHub projects...");
  const result = await axios.get(process.env.API_URL);
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
  // Add NP hyperlinks to mappings worksheet
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
  console.log("Exporting results to My_GitHub_repos.xlsx");
  writeFile(workbook, "My_GitHub_repos.xlsx");
} catch (error) {
  console.log(error.code);
}
