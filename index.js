import * as fs from "fs";
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
