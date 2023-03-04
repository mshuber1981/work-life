import fs from "fs";
import axios from "axios";
import { getAuthToken } from "../functions/Auth.js";

// Get token
const authToken = await getAuthToken();

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

// How many total formula-components?
console.log(`${list.length} total formula-components`);

const newList = [];

list.forEach((element) => {
  if (
    element.saveIdsFromComponent === null &&
    !(element.mobileType === "none" && element.autoCalculate === false)
  ) {
    newList.push(element);
  }
});

// How many formula-components where saveIdsFromComponent === null
console.log(
  `${newList.length} formula-components where saveIdsFromComponent === null &&
    !(element.mobileType === "none" && element.autoCalculate === false)`
);

const jsonList = JSON.stringify(newList);

// console.log(newList);

fs.writeFile("./saveIdsFromComponentNull.json", jsonList, (err) => {
  if (err) {
    console.error(err);
  }
});
