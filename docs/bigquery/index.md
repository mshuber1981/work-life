# Getting Started

BigQuery is a fully managed enterprise data warehouse that helps you manage and analyze your data with built-in features like machine learning, geospatial analysis, and business intelligence. BigQuery's serverless architecture lets you use SQL queries to answer your organization's biggest questions with zero infrastructure management. BigQuery's scalable, distributed analysis engine lets you query terabytes in seconds and petabytes in minutes. [^1]

## BigQuery Basics for Data Analysts

This has been a great learning resource for me.

[cloudskillsboost.google](https://www.cloudskillsboost.google/quests/69?catalog_rank=%7B%22rank%22%3A7%2C%22num_filters%22%3A0%2C%22has_search%22%3Atrue%7D&search_id=23465553)

## Google BigQuery: Node.js Client

The BigQuery Node client lets me create query jobs, wait for the results, and then solve interesting business problems with JavaScript.

[https://cloud.google.com/nodejs/docs/reference/bigquery/](https://cloud.google.com/nodejs/docs/reference/bigquery/latest)

### Example usage

[isoCountryCodes.mjs line 12](https://github.com/mshuber1981/work-life/blob/main/src/bigQuery/reports/isoCountryCodes.mjs#L12)

```javascript
const bigquery = new BigQuery();
const table = "`bigquery-public-data.country_codes.country_codes`";
const query = `SELECT country_name as Country, alpha_2_code as Two_Char_Code, alpha_3_code as Three_Char_Code FROM ${table};`;
const spinner = createSpinner(
  `Creating BigQuery job to select all ISO Country Codes from the ${table} table...`
).start();
await sleep();
try {
  let data;
  const [job] = await bigquery.createQueryJob(query);
  const [result] = await job.getQueryResults();
  spinner
    .success()
    .info(
      `ISO Country Codes successfully queried from ${table} table at ${timeStamp()}`
    );
  // Create workbook
  const workbook = utils.book_new();
  // Worksheet
  data = [...result];
  const worksheet = utils.json_to_sheet(data);
  // Add hyperlinks to worksheet
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    worksheet[`B${index + 2}`].l = {
      Target: `https://www.iso.org/obp/ui/#iso:code:3166:${element.Two_Char_Code}`,
    };
  }
  // Append NP worksheet to workbook
  utils.book_append_sheet(workbook, worksheet, "ISO Country Codes");
  // Export workbook
  console.log(
    chalk.green(
      `Exporting results to ISO_Country_Codes.xlsx at ${timeStamp()}`
    )
  );
  writeFile(workbook, `ISO_Country_Codes_${timeStamp()}.xlsx`);
} catch (error) {
  spinner.error();
  console.log(error);
}
```

### Example output

[ISO_Country_Codes.xlsx](https://github.com/mshuber1981/work-life/blob/main/ISO_Country_Codes.xlsx)

[^1]: What is BigQuery? - [clould.gogle.com](hhttps://cloud.google.com/bigquery/docs/introduction)
