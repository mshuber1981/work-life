import path from "path";
// https://www.npmjs.com/package/objects-to-csv
import ObjectsToCsv from "objects-to-csv";
import isRequired from "./general.mjs";

// Covert objects to CSV file
export const convertToCsv = async (
  csvData = isRequired("csvData Array"),
  pathName = isRequired('path (example - "directory/another_directory")'),
  fileName = isRequired("filename (do not include .csv)")
) => {
  // Convert csvData objects to a csv file - https://github.com/anton-bot/objects-to-csv#usage
  const csv = new ObjectsToCsv(csvData);
  // Save to file:
  await csv.toDisk(path.resolve(pathName, `${fileName}.csv`));
};

// Covert CSV data to an array
export const csvToArray = (
  data = isRequired("CSV data"),
  delimiter = ",",
  omitFirstRow = true
) => {
  let tempData = data
    .slice(omitFirstRow ? data.indexOf("\n") + 1 : 0)
    .split("\n")
    .map((v) => v.replace(/\r?\n|\r/g, "").split(delimiter));
  tempData.pop();
  return tempData;
};

export default csvToArray;
