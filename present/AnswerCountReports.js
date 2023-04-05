import fs from "fs";
import path from "path";
import util from "util";
import { CSVToArray } from "./functions/CSV.js";
import { getAnswerCounts, getQgiAnswerCounts } from "./BigQuery.js";

// Read CSV file of Question codes
const bQcsvData = fs.readFileSync(
  path.resolve("present", "bigQuery.csv"),
  "utf-8"
);
// Covert to Array
const bQcsvArray = CSVToArray(bQcsvData);

// Get Questions answer count report - getAnswerCounts(bQcsvArray, "Y") to export a csv file
const results = await getAnswerCounts(bQcsvArray);
const QGIs = results.QGIs;

console.log(util.inspect(results, false, null, true));

// Get QGI answer count report - getQgiAnswerCounts(QGIs, "Y") to export a csv file
const qgiResults = await getQgiAnswerCounts(QGIs);

console.log(util.inspect(qgiResults, false, null, true));
