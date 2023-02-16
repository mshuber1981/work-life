import fs from "fs";
import { CSVToArray } from "./functions/CSV.js";

// Set CSV file name
const csvFileName = "test";

try {
  // Read CSV file
  const csvData = fs.readFileSync(`./${csvFileName}.csv`, "utf-8");
  // Covert to Array
  const csvArray = CSVToArray(csvData, ",", true);

  console.log(csvArray);
} catch (error) {
  console.log(`${error.message} (check csvFilename - line 5)`);
}
