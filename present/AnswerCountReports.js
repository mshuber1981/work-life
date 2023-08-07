import fs from "fs";
import path from "path";
import util from "util";
import CSVToArray from "./functions/CSV.js";
import {
  getFieldAnswerCounts,
  getFieldQgiAnswerCounts,
  getComplianceAnswerCounts,
  getComplianceQgiAnswerCounts,
} from "./BigQuery.js";

// Read CSV file of Question codes
const bQcsvData = fs.readFileSync(
  path.resolve("present", "bigQuery.csv"),
  "utf-8"
);
// Covert to Array
const bQcsvArray = CSVToArray(bQcsvData);

// Get Field Questions answer count report - getFieldAnswerCounts(bQcsvArray, "Y") to export a csv file
const fieldResults = await getFieldAnswerCounts(bQcsvArray);
const fieldQGIs = fieldResults.QGIs;

console.log(util.inspect(fieldResults, false, null, true));

// Get QGI answer count report - getFieldQgiAnswerCounts(QGIs, "Y") to export a csv file
const fieldQgiResults = await getFieldQgiAnswerCounts(fieldQGIs);

console.log(util.inspect(fieldQgiResults, false, null, true));

// Get Compliance Questions answer count report - getComplianceAnswerCounts(bQcsvArray, "Y") to export a csv file
const complianceResults = await getComplianceAnswerCounts(bQcsvArray);
const complianceQGIs = complianceResults.QGIs;

console.log(util.inspect(complianceResults, false, null, true));

// Get QGI answer count report - getFieldQgiAnswerCounts(QGIs, "Y") to export a csv file
const complianceQgiResults = await getComplianceQgiAnswerCounts(complianceQGIs);

console.log(util.inspect(complianceQgiResults, false, null, true));
