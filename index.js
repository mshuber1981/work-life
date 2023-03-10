import fs from "fs";
import { getAuthToken } from "./functions/Auth.js";
import { CSVToArray } from "./functions/CSV.js";
import { getQuestionUomValues } from "./functions/Questions.js";

// Set CSV file name
const csvFileName = "test";
// Get token
const authToken = await getAuthToken("NP");
let csvArray;

try {
  // Read CSV file
  console.log(`Reading ${csvFileName}.csv`);
  const csvData = fs.readFileSync(`./${csvFileName}.csv`, "utf-8");
  // Covert to Array
  csvArray = CSVToArray(csvData, ",", true);

  console.log(`Converting ${csvFileName}.csv to an array:`);
  console.log(csvArray);
} catch (error) {
  console.log(`${error.message} (check csvFilename - line 6)`);
}

for (let index = 0; index < csvArray.length; index++) {
  const element = csvArray[index];
  try {
    console.log(
      `Searching for answers to Question code ${element[0]} and UOM ${element[1]}...`
    );
    const response = await getQuestionUomValues(
      authToken,
      "NP",
      element[0],
      element[1]
    );
    console.log(`The first answer in the list is ${response[0].value}`);
  } catch (error) {
    console.log(error);
  }
}
