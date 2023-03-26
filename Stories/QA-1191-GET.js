import fs from "fs";
import axios from "axios";
import { getAuthToken } from "../functions/Auth.js";

// Get token
const authToken = await getAuthToken("NP");

// Get a list of all the formula components
const list = await axios
  .get(process.env.FORMULA_COMPONENTS_ENDPOINT, {
    headers: { Authorization: `Bearer ${authToken.access_token}` },
  })
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    return error.toJSON();
  });

// Log how many total formula-components there are
console.log(`${list.length} total formula-components`);

const newList = [];

// Find formula-components where saveIdsFromComponent === null && !(mobileType === "none" && autoCalculate === false)
list.forEach((element) => {
  if (
    element.saveIdsFromComponent === null &&
    !(element.mobileType === "none" && element.autoCalculate === false)
  ) {
    newList.push(element);
  }
});

// Log how many results were found
console.log(
  `${newList.length} formula-components where saveIdsFromComponent === null &&
    !(mobileType === "none" && autoCalculate === false)`
);

const jsonList = JSON.stringify(newList);

// console.log(newList);

// Create a json file with the targeted formula components
fs.writeFile("./saveIdsFromComponentNull.json", jsonList, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(
    `Exported ${newList.length} record(s) to saveIdsFromComponentNull.json`
  );
});
