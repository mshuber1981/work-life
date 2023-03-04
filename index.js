import fs from "fs";
import { execPromise } from "./functions/General.js";
import { CSVToArray } from "./functions/CSV.js";

// Set CSV file name
const csvFileName = "test";

let npVault, prodVault;

// Get cleint IDs and secrets from vault
try {
  const npData = await execPromise(
    "vault read -format=json secret/spirit/oauth/QandA-NP/"
  );
  const prodData = await execPromise(
    "vault read -format=json secret/spirit/oauth/QandA-Prod/"
  );
  npVault = JSON.parse(npData);
  prodVault = JSON.parse(prodData);
} catch (error) {
  console.error(error.message);
}

console.log(npVault.data, prodVault.data);

try {
  // Read CSV file
  const csvData = fs.readFileSync(`./${csvFileName}.csv`, "utf-8");
  // Covert to Array
  const csvArray = CSVToArray(csvData, ",", true);

  console.log(csvArray);
} catch (error) {
  console.log(`${error.message} (check csvFilename - line 6)`);
}
