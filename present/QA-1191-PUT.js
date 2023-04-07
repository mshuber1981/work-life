import fs from "fs";
import path from "path";
import axios from "axios";
import { getAuthToken } from "./functions/Auth.js";
import { CSVToArray } from "./functions/CSV.js";

// Get token
const authToken = await getAuthToken("NP");
// Read CSV file
const csvData = fs.readFileSync(
  path.resolve("present", "QA-1191.csv"),
  "utf-8"
);
// Covert to Array
const csvArray = CSVToArray(csvData, ",", true);
const putData = [];
let count = csvArray.length;

console.log(`Evaluating ${count} record(s)...`);

// Get the current fourmula component for each ID
for (let index = 0; index < csvArray.length; index++) {
  const element = csvArray[index];

  await axios
    .get(
      process.env.CALCULATED_ANSWERS + "formula-components?id=" + element[0],
      {
        headers: { Authorization: `Bearer ${authToken.access_token}` },
      }
    )
    .then((response) => {
      // Update the saveIdsFromComponent key
      response.data[0].saveIdsFromComponent = element[1];
      // Delete the updatedDateTime key
      delete response.data[0].updatedDateTime;
      putData.push(response.data[0]);
    })
    .catch((error) => {
      count--;
      console.log(`Row ${index + 2} will not be updated!`);
      console.log(error.toJSON().message);
    });
}

// console.log(JSON.stringify(putData[0]));

console.log(`Attempting to update ${count} record(s)...`);

// Upate each formula component
for (let index = 0; index < putData.length; index++) {
  const element = putData[index];
  const tempData = [];

  tempData.push(element);
  await axios
    .put(process.env.CALCULATED_ANSWERS + "formula-components", tempData, {
      headers: { Authorization: `Bearer ${authToken.access_token}` },
    })
    .then(function () {
      console.log(`Updated ID ${element.id} successFully.`);
    })
    .catch(function (error) {
      count--;
      console.log(`Update for ID ${element.id} failed!`);
      console.log(error.toJSON().message);
    });
}

console.log(`Updated ${count} record(s) successFully.`);
