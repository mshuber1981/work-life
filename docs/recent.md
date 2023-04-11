# Answer Count Report

Problem - How many primary and secondary answers are there in each environment for a list of Question codes ([bigQuery.csv](https://github.com/mshuber1981/work-life/blob/main/present/bigQuery.csv))? What metadata is associated with those answers?

Solution ([Node.js](https://nodejs.org/en) + [BigQuery Client](https://cloud.google.com/nodejs/docs/reference/bigquery/latest)):

1. [getAnswerCounts](https://github.com/mshuber1981/work-life/blob/main/present/BigQuery.js#L14) - Get the primary and secondary answer counts from NP and Prod for each Question code, and a list of all the related QGIs.

2. [getQgiAnswerCounts](https://github.com/mshuber1981/work-life/blob/main/present/BigQuery.js#L128) - Get the answer counts and other useful metadata from NP and Prod for each QGI.

## Example usage

### [AnswerCountReport.js](https://github.com/mshuber1981/work-life/blob/main/present/AnswerCountReports.js)

```javascript linenums="1"
// Read CSV file of Question codes
const bQcsvData = fs.readFileSync(
  path.resolve("present", "bigQuery.csv"),
  "utf-8"
);
// Covert to Array
const bQcsvArray = CSVToArray(bQcsvData);

// Get Questions answer count report - getAnswerCounts(bQcsvArray, "Y") to export a csv file
const results = await getAnswerCounts(bQcsvArray);
const QGIs = results.QGIs;

console.log(util.inspect(results, false, null, true));

// Get QGI answer count report - getQgiAnswerCounts(QGIs, "Y") to export a csv file
const qgiResults = await getQgiAnswerCounts(QGIs);

console.log(util.inspect(qgiResults, false, null, true));
```

### getAnswerCounts results

```javascript linenums="1"
{
  csvData: [
    {
      questionCode: 'PBCH',
      np_primary_answer_count: 4,
      np_secondary_answer_count: 0,
      np_QGIs: [ 'C2959-I3' ],
      prod_primary_answer_count: 0,
      prod_secondary_answer_count: 0,
      prod_QGIs: []
    },
    {
      questionCode: 'DRYINDT',
      np_primary_answer_count: 0,
      np_secondary_answer_count: 0,
      np_QGIs: [],
      prod_primary_answer_count: 100,
      prod_secondary_answer_count: 0,
      prod_QGIs: [ 'C3595-I1' ]
    }
  ],
  QGIs: [ [ 'C2959-I3' ], [ 'C3595-I1' ] ]
}
```

[Example CSV output](https://github.com/mshuber1981/work-life/blob/main/present/Question_Answer_Counts.csv)

### getQgiAnswerCounts results

```javascript linenums="1"
[
  {
    QGI: "C2959-I3",
    is_deactivated: "false",
    primary_question: "PBCH",
    taxa: "Broccoli",
    np_answer_count: 4,
    np_answer_time: "2022-03-16T04:29:09.119Z",
    np_update_time: "2022-03-16T10:41:46.372Z",
    prod_answer_count: 0,
    prod_answer_time: "",
    prod_update_time: "",
  },
  {
    QGI: "C3595-I1",
    is_deactivated: "false",
    primary_question: "DRYINDT",
    taxa: "Corn",
    np_answer_count: 0,
    np_answer_time: "",
    np_update_time: "",
    prod_answer_count: 100,
    prod_answer_time: "2022-03-22T19:08:17.357Z",
    prod_update_time: "2022-03-22T20:05:01.180Z",
  },
];
```

[Example CSV output](https://github.com/mshuber1981/work-life/blob/main/present/QGI_Answer_Counts.csv)
