import getAuthToken from "../functions/Auth.js";
import getQuestionUomValues from "../functions/Questions.js";
import getTaxaInfo from "../functions/Taxa.js";
import { convertToCsv } from "../functions/CSV.js";

/* Set Question Code, Unit Of Measure, and Environment */
const qCode = "Some code";
const uom = "Some unit of measure";
const env = "NP or PROD";

// Get token
const authToken = await getAuthToken(env);
// CSV Data
const csvData = [];
// Get answers
const answers = await getQuestionUomValues(authToken, env, qCode, uom);
// console.log(answers);
const taxaInfo = await getTaxaInfo(authToken, env, answers);

answers.forEach((element, index) => {
  const tempData = {
    Answer: element.value,
  };

  if (taxaInfo[index].taxa) {
    tempData.taxonId = taxaInfo[index].taxa[0].taxonId;
    taxaInfo[index].taxa[0].hasOwnProperty("eppoDetail")
      ? (tempData.eppoCode = taxaInfo[index].taxa[0].eppoDetail.code)
      : (tempData.eppoCode = "NO EPPO MATCH");
    tempData.qandaKey = element.key;
  } else {
    tempData.taxonId = "No response";
    tempData.eppoCode = "No response";
    tempData.qandaKey = element.key;
  }

  csvData.push(tempData);
});

// console.log(csvData);

convertToCsv(csvData, "./", `${env}_${qCode}_${uom}`);
