import axios from "axios";
import { getAuthToken } from "../functions/Auth.js";
import { getQuestionUomValues } from "../functions/Questions.js";
import { convertToCsv } from "../functions/CSV.js";

async function getTaxaInfo(authToken, taxaAnswers) {
  const data = [];
  // Check Taxa api for EPPO Scientific name, otherwise check for provided name
  for (let index = 0; index < taxaAnswers.length; index++) {
    data.push(
      axios
        .get(process.env.TAXA_ENDPOINT + taxaAnswers[index].value, {
          headers: { Authorization: `Bearer ${authToken.access_token}` },
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return error.toJSON();
        })
    );
  }

  return Promise.all(data);
}

/* Set Question and UOM codes */
const qCode = "RESTRICTED";
const uom = "TEXT";

// Get token
const authToken = await getAuthToken("NP");
// CSV Data
const csvData = [];
// Get answers
const answers = await getQuestionUomValues(authToken, "NP", qCode, uom);
// console.log(answers);
const taxaInfo = await getTaxaInfo(authToken, answers);

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

convertToCsv(csvData, "./", qCode);
