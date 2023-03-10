import fs from "fs";
import { getAuthToken } from "./functions/Auth.js";
import { CSVToArray } from "./functions/CSV.js";
import { getQuestionUomValues } from "./functions/Questions.js";

// Set CSV file name
const csvFileName = "test";
// Get token
const authToken = await getAuthToken("NP");

try {
  // Read CSV file
  const csvData = fs.readFileSync(`./${csvFileName}.csv`, "utf-8");
  // Covert to Array
  const csvArray = CSVToArray(csvData, ",", true);

  console.log(csvArray);
} catch (error) {
  console.log(`${error.message} (check csvFilename - line 6)`);
}

getQuestionUomValues(authToken, "NP").then((response) =>
  console.log(`The first answer in the list is ${response[0].value}`)
);
