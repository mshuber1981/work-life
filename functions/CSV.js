// https://www.npmjs.com/package/objects-to-csv
import ObjectsToCsv from "objects-to-csv";

export async function convertToCsv(csvData = isRequired("csvData Array")) {
  // Convert csvData object to a csv file - https://github.com/anton-bot/objects-to-csv#usage
  const csv = new ObjectsToCsv(csvData);
  // Save to file:
  await csv.toDisk("./Taxa_Info.csv");
  // Return the CSV file as string:
}

export function CSVToArray(data, delimiter = ",", omitFirstRow = false) {
  let tempData = data
    .slice(omitFirstRow ? data.indexOf("\n") + 1 : 0)
    .split("\n")
    .map((v) => v.replace(/\r?\n|\r/g, "").split(delimiter));
  tempData.pop();

  return tempData;
}
