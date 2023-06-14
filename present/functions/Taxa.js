import axios from "axios";
import isRequired from "./General.js";

export default async function getTaxaInfo(
  authToken = isRequired("authToken"),
  env = isRequired("env (NP or PROD)"),
  taxaAnswers = isRequired("taxaAnswers array")
) {
  const data = [];
  // Check Taxa api for answer
  for (let index = 0; index < taxaAnswers.length; index++) {
    data.push(
      axios
        .get(
          env === "NP"
            ? process.env.TAXA_ENDPOINT + taxaAnswers[index].value
            : process.env.PROD_TAXA_ENDPOINT + taxaAnswers[index].value,
          {
            headers: { Authorization: `Bearer ${authToken.access_token}` },
          }
        )
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
