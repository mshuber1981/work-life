import axios from "axios";
import { isRequired } from "./General.js";

// Get a list of valid answers for a Question and unit of measure
export async function getQuestionUomValues(
  authToken = isRequired("authToken"),
  env = isRequired("env (NP or PROD)"),
  qCode = isRequired("Question Code"),
  uom = isRequired("UOM")
) {
  try {
    if (env.toUpperCase() !== "NP" && env.toUpperCase() !== "PROD") {
      throw new Error(
        `${env} is not a valid argument, please use "NP" or "PROD".`
      );
    }

    const response = await axios.get(
      env === "NP"
        ? process.env.VALIDATION_ENDPOINT +
            `${qCode.toUpperCase()}/uom/${uom.toUpperCase()}`
        : process.env.PROD_VALIDATION_ENDPOINT +
            `${qCode.toUpperCase()}/uom/${uom.toUpperCase()}`,
      {
        headers: { Authorization: `Bearer ${authToken.access_token}` },
      }
    );
    if (response.status != 200) {
      throw new Error(
        `Status: ${response.status}, Status Text: ${response.statusText}`
      );
    } else {
      console.log(
        `${
          response.data.rule.values.length
        } answers found for Question code ${qCode.toUpperCase()} and UOM ${uom.toUpperCase()}.`
      );
      return response.data.rule.values;
    }
  } catch (error) {
    throw new Error(error);
  }
}
