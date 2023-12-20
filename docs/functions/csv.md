# Comma Separated Values

CSV files are a big part of my work life.

"They aid with moving information from one application to another. Tabular spreadsheet data from one program is converted into a CSV file, which is then used to import the information into another program." [^1]

[^1]: What is a CSV File - [parse.ly](https://www.parse.ly/glossary/csv/#:~:text=They%20aid%20with%20moving%20information,the%20information%20into%20another%20program.)

1. Learning to read files with Node.js - [https://nodejs.dev/en/learn/reading-files-with-nodejs/](https://nodejs.dev/en/learn/reading-files-with-nodejs/)

2. Converting CSV file read data to an array - [csvToArray (csv.js line 18)](https://github.com/mshuber1981/work-life/blob/main/utils/csv.js#L18)

## Example usage

[Example CSV file (test.csv)](https://github.com/mshuber1981/work-life/blob/main/test.csv)

[index.js line 9](https://github.com/mshuber1981/work-life/blob/main/index.js#L9)

```javascript
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
```

## Example output

```bash
Reading test.csv
Converting test.csv to an array:
[ [ 'Stuff', 'Different stuff' ], [ 'test', 'test' ] ]
```
