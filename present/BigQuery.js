import * as dotenv from "dotenv";
dotenv.config();
import axios from "axios";
// https://github.com/npkgz/cli-progress
import cliProgress from "cli-progress";
import isRequired from "./functions/General.js";
import getAuthToken from "./functions/Auth.js";
import { convertToCsv } from "./functions/CSV.js";
// https://cloud.google.com/nodejs/docs/reference/bigquery/latest
import { BigQuery } from "@google-cloud/bigquery";

const bigquery = new BigQuery();

// Get the primary and secondary answer counts from Field Answers NP and Prod for each Question code, and a list of all the related QGIs.
export async function getFieldAnswerCounts(
  arr = isRequired("Array of Question codes"),
  exp = "NO"
) {
  const returnData = { csvData: [], QGIs: [] };
  const csvOutData = [];
  const getQGIs = [];

  if (arr.length !== 0) {
    console.log("");
    console.log(
      `Searching for ${arr.length} Question codes(s) in Field Answers...`
    );
    console.log("");

    const answerCounts = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );

    answerCounts.start(arr.length, 0);

    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      const csvOutDataObj = {
        questionCode: element[0],
        uom: element[1],
        np_primary_answer_count: "",
        np_secondary_answer_count: "",
        np_QGIs: [],
        prod_primary_answer_count: "",
        prod_secondary_answer_count: "",
        prod_QGIs: [],
      };
      // NP query for primary and secondary answer counts
      const npQuery = `with primary as (select count(*) as primary_answer_count from ${process.env.CSW_FIELD_ANSWERS} where question_code="${element[0]}"), secondary as (select count(*) as secondary_answer_count from ${process.env.CSW_FIELD_ANSWERS} where (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)), QGIs as (select ARRAY_AGG(distinct instance_seq) as QGIs from ${process.env.CSW_FIELD_ANSWERS} where question_code="${element[0]}" or (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) select * from primary,secondary,QGIs`;
      // NP query for primary and secondary answer counts per uom
      const npUomQuery = `with primary as (select count(*) as primary_answer_count from ${process.env.CSW_FIELD_ANSWERS} where question_code="${element[0]}" and uom_code="${element[1]}"), secondary as (select count(*) as secondary_answer_count from ${process.env.CSW_FIELD_ANSWERS} where ((select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) and (select "${element[1]}" in unnest(secondary_answers.uom_code) as contains_value)), QGIs as (select ARRAY_AGG(distinct instance_seq) as QGIs from ${process.env.CSW_FIELD_ANSWERS} where question_code="${element[0]}" or (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) select * from primary,secondary,QGIs`;
      // Prod query for primary and secondary answer counts
      const prodQuery = `with primary as (select count(*) as primary_answer_count from ${process.env.PROD_CSW_FIELD_ANSWERS} where question_code="${element[0]}"), secondary as (select count(*) as secondary_answer_count from ${process.env.PROD_CSW_FIELD_ANSWERS} where (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)), QGIs as (select ARRAY_AGG(distinct instance_seq) as QGIs from ${process.env.PROD_CSW_FIELD_ANSWERS} where question_code="${element[0]}" or (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) select * from primary,secondary,QGIs`;
      // Prod query for primary and secondary answer counts per uom
      const prodUomQuery = `with primary as (select count(*) as primary_answer_count from ${process.env.PROD_CSW_FIELD_ANSWERS} where question_code="${element[0]}" and uom_code="${element[1]}"), secondary as (select count(*) as secondary_answer_count from ${process.env.PROD_CSW_FIELD_ANSWERS} where ((select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) and (select "${element[1]}" in unnest(secondary_answers.uom_code) as contains_value)), QGIs as (select ARRAY_AGG(distinct instance_seq) as QGIs from ${process.env.PROD_CSW_FIELD_ANSWERS} where question_code="${element[0]}" or (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) select * from primary,secondary,QGIs`;

      try {
        if (element[1]) {
          const [npJob] = await bigquery.createQueryJob(npUomQuery);
          const [prodJob] = await bigquery.createQueryJob(prodUomQuery);
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
          answerCounts.increment();
        } else {
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
          answerCounts.increment();
        }
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

    answerCounts.stop();

    if (exp.toUpperCase() === "YES" || exp.toUpperCase() === "Y") {
      // Export to CSV file
      await convertToCsv(csvOutData, "./", "Field_Question_Answer_Counts");

      console.log("");
      console.log(
        `Exported ${csvOutData.length} record(s) to Field_Question_Answer_Counts.csv`
      );
      console.log("");
    }

    console.log("");
    console.log(`Returning data for ${csvOutData.length} record(s).`);
    console.log("");
    getQGIs.forEach((element) => {
      returnData.QGIs.push([element]);
    });
    returnData.csvData = [...csvOutData];
    return returnData;
  } else {
    console.log("");
    console.log("No Questions found... ¯\\_(ツ)_/¯");
    console.log("");
  }
}

// Get the primary and secondary answer counts from Compliance Answers NP and Prod for each Question code, and a list of all the related QGIs.
export async function getComplianceAnswerCounts(
  arr = isRequired("Array of Question codes"),
  exp = "NO"
) {
  const returnData = { csvData: [], QGIs: [] };
  const csvOutData = [];
  const getQGIs = [];

  if (arr.length !== 0) {
    console.log("");
    console.log(
      `Searching for ${arr.length} Question codes(s) in Compliance Answers...`
    );
    console.log("");

    const answerCounts = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );

    answerCounts.start(arr.length, 0);

    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      const csvOutDataObj = {
        questionCode: element[0],
        uom: element[1],
        np_primary_answer_count: "",
        np_secondary_answer_count: "",
        np_QGIs: [],
        prod_primary_answer_count: "",
        prod_secondary_answer_count: "",
        prod_QGIs: [],
      };
      // NP query for primary and secondary answer counts
      const npQuery = `with primary as (select count(*) as primary_answer_count from ${process.env.CSW_COMPLIANCE_ANSWERS} where question_code="${element[0]}"), secondary as (select count(*) as secondary_answer_count from ${process.env.CSW_COMPLIANCE_ANSWERS} where (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)), QGIs as (select ARRAY_AGG(distinct question_group_instance) as QGIs from ${process.env.CSW_COMPLIANCE_ANSWERS} where question_code="${element[0]}" or (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) select * from primary,secondary,QGIs`;
      // NP query for primary and secondary answer counts per uom
      const npUomQuery = `with primary as (select count(*) as primary_answer_count from ${process.env.CSW_COMPLIANCE_ANSWERS} where question_code="${element[0]}" and uom_code="${element[1]}"), secondary as (select count(*) as secondary_answer_count from ${process.env.CSW_COMPLIANCE_ANSWERS} where ((select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) and (select "${element[1]}" in unnest(secondary_answers.uom_code) as contains_value)), QGIs as (select ARRAY_AGG(distinct question_group_instance) as QGIs from ${process.env.CSW_COMPLIANCE_ANSWERS} where question_code="${element[0]}" or (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) select * from primary,secondary,QGIs`;
      // Prod query for primary and secondary answer counts
      const prodQuery = `with primary as (select count(*) as primary_answer_count from ${process.env.PROD_CSW_COMPLIANCE_ANSWERS} where question_code="${element[0]}"), secondary as (select count(*) as secondary_answer_count from ${process.env.PROD_CSW_COMPLIANCE_ANSWERS} where (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)), QGIs as (select ARRAY_AGG(distinct question_group_instance) as QGIs from ${process.env.PROD_CSW_COMPLIANCE_ANSWERS} where question_code="${element[0]}" or (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) select * from primary,secondary,QGIs`;
      // Prod query for primary and secondary answer counts per uom
      const prodUomQuery = `with primary as (select count(*) as primary_answer_count from ${process.env.PROD_CSW_COMPLIANCE_ANSWERS} where question_code="${element[0]}" and uom_code="${element[1]}"), secondary as (select count(*) as secondary_answer_count from ${process.env.PROD_CSW_COMPLIANCE_ANSWERS} where ((select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) and (select "${element[1]}" in unnest(secondary_answers.uom_code) as contains_value)), QGIs as (select ARRAY_AGG(distinct question_group_instance) as QGIs from ${process.env.PROD_CSW_COMPLIANCE_ANSWERS} where question_code="${element[0]}" or (select "${element[0]}" in unnest(secondary_answers.question_code) as contains_value)) select * from primary,secondary,QGIs`;

      try {
        if (element[1]) {
          const [npJob] = await bigquery.createQueryJob(npUomQuery);
          const [prodJob] = await bigquery.createQueryJob(prodUomQuery);
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
          answerCounts.increment();
        } else {
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
          answerCounts.increment();
        }
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

    answerCounts.stop();

    if (exp.toUpperCase() === "YES" || exp.toUpperCase() === "Y") {
      // Export to CSV file
      await convertToCsv(csvOutData, "./", "Compliance_Question_Answer_Counts");

      console.log("");
      console.log(
        `Exported ${csvOutData.length} record(s) to Compliance_Question_Answer_Counts.csv`
      );
      console.log("");
    }

    console.log("");
    console.log(`Returning data for ${csvOutData.length} record(s).`);
    console.log("");
    getQGIs.forEach((element) => {
      returnData.QGIs.push([element]);
    });
    returnData.csvData = [...csvOutData];
    return returnData;
  } else {
    console.log("");
    console.log("No Questions found... ¯\\_(ツ)_/¯");
    console.log("");
  }
}

// Get answer counts and other useful metadata from Field Answers NP and Prod for each QGI.
export async function getFieldQgiAnswerCounts(
  arr = isRequired("Array of QGIs"),
  exp = "NO"
) {
  const qgiCsvOutData = [];

  if (arr.length !== 0) {
    console.log("");
    console.log(`Searching for ${arr.length} QGI(s) in Field Answers...`);
    console.log("");

    const qgiAnswerCounts = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );

    qgiAnswerCounts.start(arr.length, 0);

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
        qgiAnswerCounts.increment();
      } catch (error) {
        if (error.errors) {
          console.log(error.errors[0].message);
        } else {
          console.log(error);
        }
      }
    }

    // console.log(qgiCsvOutData);

    qgiAnswerCounts.stop();

    if (exp.toUpperCase() === "YES" || exp.toUpperCase() === "Y") {
      // Export to CSV file
      await convertToCsv(qgiCsvOutData, "./", "Field_QGI_Answer_Counts");

      console.log("");
      console.log(
        `Exported ${qgiCsvOutData.length} record(s) to Field_QGI_Answer_Counts.csv`
      );
      console.log("");
    }

    console.log("");
    console.log(`Returning data for ${qgiCsvOutData.length} record(s).`);
    console.log("");
    return qgiCsvOutData;
  } else {
    console.log("");
    console.log("No QGIs found... ¯\\_(ツ)_/¯");
    console.log("");
  }
}

// Get answer counts and other useful metadata from Compliance Answers NP and Prod for each QGI.
export async function getComplianceQgiAnswerCounts(
  arr = isRequired("Array of QGIs"),
  exp = "NO"
) {
  const qgiCsvOutData = [];

  if (arr.length !== 0) {
    console.log("");
    console.log(`Searching for ${arr.length} QGI(s) in Compliance Answers...`);
    console.log("");

    const qgiAnswerCounts = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );

    qgiAnswerCounts.start(arr.length, 0);

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
      const npCountQuery = `select count(*) as np_answer_count from ${process.env.CSW_COMPLIANCE_ANSWERS} where question_group_instance="${element[0]}";`;
      // NP query for primary question code, answer and modified times
      const npMostRecentQuery = `select question_code, secondary_answers, answer_time, modified_answered_time from ${process.env.CSW_COMPLIANCE_ANSWERS} where question_group_instance="${element[0]}" order by modified_answered_time desc limit 1`;
      // Prod query for answer count
      const prodCountQuery = `select count(*) as prod_answer_count from ${process.env.PROD_CSW_COMPLIANCE_ANSWERS} where question_group_instance="${element[0]}";`;
      // Prod query for primary question code, answer and modified times
      const prodMostRecentQuery = `select question_code, secondary_answers, answer_time, modified_answered_time from ${process.env.PROD_CSW_COMPLIANCE_ANSWERS} where question_group_instance="${element[0]}" order by modified_answered_time desc limit 1`;

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
          csvOutDataObj.np_update_time =
            npResult2[0].modified_answered_time.value;
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
          csvOutDataObj.prod_update_time =
            prodResult2[0].modified_answered_time.value;
          secondaryAnswers.forEach((element) => {
            if (element.question_code === "TAXA") {
              csvOutDataObj.taxa = element.value;
            }
          });
        }

        qgiCsvOutData.push(csvOutDataObj);
        qgiAnswerCounts.increment();
      } catch (error) {
        if (error.errors) {
          console.log(error.errors[0].message);
        } else {
          console.log(error);
        }
      }
    }

    // console.log(qgiCsvOutData);

    qgiAnswerCounts.stop();

    if (exp.toUpperCase() === "YES" || exp.toUpperCase() === "Y") {
      // Export to CSV file
      await convertToCsv(qgiCsvOutData, "./", "Compliance_QGI_Answer_Counts");

      console.log("");
      console.log(
        `Exported ${qgiCsvOutData.length} record(s) to Compliance_QGI_Answer_Counts.csv`
      );
      console.log("");
    }

    console.log("");
    console.log(`Returning data for ${qgiCsvOutData.length} record(s).`);
    console.log("");
    return qgiCsvOutData;
  } else {
    console.log("");
    console.log("No QGIs found... ¯\\_(ツ)_/¯");
    console.log("");
  }
}
