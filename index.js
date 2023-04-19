import fs from "fs";
import { getAuthToken } from "./present/functions/Auth.js";
import { CSVToArray } from "./present/functions/CSV.js";
import { getQuestionUomValues } from "./present/functions/Questions.js";

// Set CSV file name
const csvFileName = "test";
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

// Get token
const authToken = await getAuthToken("NP");

// Get a list of valid answers for each Question and UOM combination
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

    if (typeof response === "object") {
      console.log(`The first answer in the list is ${response[0].value}`);
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
}
