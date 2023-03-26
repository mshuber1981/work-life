import * as dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { isRequired } from "../functions/General.js";
import { getAuthToken } from "../functions/Auth.js";
import { convertToCsv } from "../functions/CSV.js";
// https://cloud.google.com/nodejs/docs/reference/bigquery/latest
import { BigQuery } from "@google-cloud/bigquery";

const bigquery = new BigQuery();

// Get the primary and secondary answer count from NP and Prod for each Question code
export async function getAnswerCounts(
  arr = isRequired("Array of Question codes"),
  exp = "NO"
) {
  const returnData = { csvData: [], QGIs: [] };
  const csvOutData = [];
  const getQGIs = [];

  if (arr.length !== 0) {
    console.log(`Evaluating ${arr.length} Question codes(s)...`);

    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      const csvOutDataObj = {
        questionCode: element[0],
        np_primary_answer_count: "",
        np_secondary_answer_count: "",
        np_QGIs: [],
        prod_primary_answer_count: "",
        prod_secondary_answer_count: "",
        prod_QGIs: [],
      };
      // NP query for primary and secondary answer counts
      const npQuery = `with primary as (select count(*) as primary_answer_count from ${process.env.CSW_FIELD_ANSWERS} where question_code="${element[0]}"), secondary as (select count(*) as secondary_answer_count from ${process.env.CSW_FIELD_ANSWERS} where (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)), QGIs as (select ARRAY_AGG(distinct instance_seq) as QGIs from ${process.env.CSW_FIELD_ANSWERS} where question_code="${element[0]}" or (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) select * from primary,secondary,QGIs`;
      // Prod query for primary and secondary answer counts
      const prodQuery = `with primary as (select count(*) as primary_answer_count from ${process.env.PROD_CSW_FIELD_ANSWERS} where question_code="${element[0]}"), secondary as (select count(*) as secondary_answer_count from ${process.env.PROD_CSW_FIELD_ANSWERS} where (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)), QGIs as (select ARRAY_AGG(distinct instance_seq) as QGIs from ${process.env.PROD_CSW_FIELD_ANSWERS} where question_code="${element[0]}" or (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) select * from primary,secondary,QGIs`;

      try {
        const [npJob] = await bigquery.createQueryJob(npQuery);
        const [prodJob] = await bigquery.createQueryJob(prodQuery);
        const [npResult] = await npJob.getQueryResults();
        const [prodResult] = await prodJob.getQueryResults();

        // Build a distinct list of QGIs that have answers in NP or Prod
        if (
          npResult[0].primary_answer_count !== 0 ||
          npResult[0].secondary_answer_count !== 0 ||
          prodResult[0].primary_answer_count !== 0 ||
          prodResult[0].secondary_answer_count !== 0
        ) {
          npResult[0].QGIs.forEach((element) => {
            csvOutDataObj.np_QGIs.push(element);
            if (!getQGIs.includes(element)) {
              getQGIs.push(element);
            }
          });
          prodResult[0].QGIs.forEach((element) => {
            csvOutDataObj.prod_QGIs.push(element);
            if (!getQGIs.includes(element)) {
              getQGIs.push(element);
            }
          });
        }

        csvOutDataObj.np_primary_answer_count =
          npResult[0].primary_answer_count;
        csvOutDataObj.np_secondary_answer_count =
          npResult[0].secondary_answer_count;
        csvOutDataObj.prod_primary_answer_count =
          prodResult[0].primary_answer_count;
        csvOutDataObj.prod_secondary_answer_count =
          prodResult[0].secondary_answer_count;
        csvOutData.push(csvOutDataObj);
      } catch (error) {
        if (error.errors) {
          console.log(error.errors[0].message);
        } else {
          console.log(error);
        }
      }
    }

    // console.log(getQGIs);
    // console.log(csvOutData);

    if (exp.toUpperCase() === "YES" || exp.toUpperCase() === "Y") {
      // Export to CSV file
      await convertToCsv(csvOutData, "./", "Question_Answer_Counts");

      console.log(
        `Exported ${csvOutData.length} record(s) to Question_Answer_Counts.csv`
      );
    }

    console.log(`Returning data for ${csvOutData.length} record(s).`);
    getQGIs.forEach((element) => {
      returnData.QGIs.push([element]);
    });
    returnData.csvData = [...csvOutData];
    return returnData;
  } else {
    console.log("No Questions found... ¯\\_(ツ)_/¯");
  }
}

// Get answer counts and other useful metadata from NP and Prod for each QGI
export async function getQgiAnswerCounts(
  arr = isRequired("Array of QGIs"),
  exp = "NO"
) {
  const qgiCsvOutData = [];

  if (arr.length !== 0) {
    console.log(`Evaluating ${arr.length} QGI(s)...`);

    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      const csvOutDataObj = {
        QGI: element[0],
        is_deactivated: "",
        primary_question: "",
        taxa: "",
        np_answer_count: "",
        np_answer_time: "",
        np_update_time: "",
        prod_answer_count: "",
        prod_answer_time: "",
        prod_update_time: "",
      };
      // NP query for answer count
      const npCountQuery = `select count(*) as np_answer_count from ${process.env.CSW_FIELD_ANSWERS} where instance_seq="${element[0]}";`;
      // NP query for primary question code, answer and modified times
      const npMostRecentQuery = `select question_code, secondary_answers, answer_time, modified_time from ${process.env.CSW_FIELD_ANSWERS} where instance_seq="${element[0]}" order by modified_time desc limit 1`;
      // Prod query for answer count
      const prodCountQuery = `select count(*) as prod_answer_count from ${process.env.PROD_CSW_FIELD_ANSWERS} where instance_seq="${element[0]}";`;
      // Prod query for primary question code, answer and modified times
      const prodMostRecentQuery = `select question_code, secondary_answers, answer_time, modified_time from ${process.env.PROD_CSW_FIELD_ANSWERS} where instance_seq="${element[0]}" order by modified_time desc limit 1`;

      try {
        const [npJob] = await bigquery.createQueryJob(npCountQuery);
        const [npResult] = await npJob.getQueryResults();
        const [prodJob] = await bigquery.createQueryJob(prodCountQuery);
        const [prodResult] = await prodJob.getQueryResults();
        // Get NP token
        const authToken = await getAuthToken("NP");

        // Check to see if the QGI is deactivated
        await axios
          .get(
            process.env.QUESTION_GROUPS +
              `questionGroupInstance?instanceSeq=${element[0]}&answerSetsFormat=NONE`,
            {
              headers: { Authorization: `Bearer ${authToken.access_token}` },
            }
          )
          .then((response) => {
            if (response.data) {
              csvOutDataObj.is_deactivated = "false";
            } else {
              csvOutDataObj.is_deactivated = "true";
            }
          });

        csvOutDataObj.np_answer_count = npResult[0].np_answer_count;
        csvOutDataObj.prod_answer_count = prodResult[0].prod_answer_count;

        if (npResult[0].np_answer_count !== 0) {
          const [npJob2] = await bigquery.createQueryJob(npMostRecentQuery);
          const [npResult2] = await npJob2.getQueryResults();
          const secondaryAnswers = npResult2[0].secondary_answers;

          csvOutDataObj.primary_question = npResult2[0].question_code;
          csvOutDataObj.np_answer_time = npResult2[0].answer_time.value;
          csvOutDataObj.np_update_time = npResult2[0].modified_time.value;
          secondaryAnswers.forEach((element) => {
            if (element.question_code === "TAXA") {
              csvOutDataObj.taxa = element.value;
            }
          });
        }

        if (prodResult[0].prod_answer_count !== 0) {
          const [prodJob2] = await bigquery.createQueryJob(prodMostRecentQuery);
          const [prodResult2] = await prodJob2.getQueryResults();
          const secondaryAnswers = prodResult2[0].secondary_answers;

          csvOutDataObj.primary_question = prodResult2[0].question_code;
          csvOutDataObj.prod_answer_time = prodResult2[0].answer_time.value;
          csvOutDataObj.prod_update_time = prodResult2[0].modified_time.value;
          secondaryAnswers.forEach((element) => {
            if (element.question_code === "TAXA") {
              csvOutDataObj.taxa = element.value;
            }
          });
        }

        qgiCsvOutData.push(csvOutDataObj);
      } catch (error) {
        if (error.errors) {
          console.log(error.errors[0].message);
        } else {
          console.log(error);
        }
      }
    }

    // console.log(qgiCsvOutData);

    if (exp.toUpperCase() === "YES" || exp.toUpperCase() === "Y") {
      // Export to CSV file
      await convertToCsv(qgiCsvOutData, "./", "QGI_Answer_Counts");

      console.log(
        `Exported ${qgiCsvOutData.length} record(s) to QGI_Answer_Counts.csv`
      );
    }

    console.log(`Returning data for ${qgiCsvOutData.length} record(s).`);
    return qgiCsvOutData;
  } else {
    console.log("No QGIs found... ¯\\_(ツ)_/¯");
  }
}