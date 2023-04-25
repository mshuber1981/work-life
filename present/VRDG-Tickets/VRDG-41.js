import fs from "fs";
import path from "path";
import axios from "axios";
import { getAuthToken } from "../functions/Auth.js";
import { CSVToArray } from "../functions/CSV.js";

// Set environment - "NP" or "PROD"
const env = "NP";

// Declare url variables
let qgiPrefsUrl, qgiPatchUrl;
if (env.toUpperCase() === "NP") {
  qgiPrefsUrl = process.env.QGI_PREFS;
  qgiPatchUrl = process.env.QGI_META_PATCH;
} else if (env.toUpperCase() === "PROD") {
  qgiPrefsUrl = process.env.PROD_QGI_PREFS;
  qgiPatchUrl = process.env.PROD_QGI_META_PATCH;
} else {
  throw new Error(`${env} is not a valid argument, please use "NP" or "PROD".`);
}
// Get token
const authToken = await getAuthToken(env);
// Read CSV file
const csvData = fs.readFileSync(
  path.resolve("VRDG-Tickets", "VRDG-41.csv"),
  "utf-8"
);
// Covert to Array
const csvArray = CSVToArray(csvData, ",", true);
let count = csvArray.length;

console.log(`Evaluating ${count} records...`);

for (let index = 0; index < csvArray.length; index++) {
  const element = csvArray[index];

  // If yes, turn repetitions on
  if (element[2].toUpperCase() === "YES") {
    // Get all of the current preferences
    const prefs = await axios
      .get(qgiPrefsUrl + element[0], {
        headers: { Authorization: `Bearer ${authToken.access_token}` },
      })
      .then((response) => {
        if (response.status === 204) {
          console.log(`${element[0]} not found...`);
          return "ERROR";
        } else {
          return response.data[0].instances[0].preferences;
        }
      })
      .catch((error) => {
        console.log(error);
        return "ERROR";
      });

    // console.log(prefs);

    if (prefs === "ERROR") {
      count--;
      console.log(
        `Error attempting to get preferences for row ${index + 2} - ${
          element[0]
        }.`
      );
    } else {
      // Turn repetitions on for targeted Business Unit
      prefs[element[1]].repetitionNotAllowed = false;
      const allowReps = [
        {
          userId: "EHXFR",
          instances: [{}],
        },
      ];

      allowReps[0].classSeq = element[0].substring(0, 5);
      allowReps[0].instances[0].instanceSeq = element[0];
      allowReps[0].instances[0].preferences = prefs;

      // console.log(allowReps[0].instances[0]);

      await axios
        .patch(qgiPatchUrl, allowReps, {
          headers: { Authorization: `Bearer ${authToken.access_token}` },
        })
        .then(function () {
          console.log(
            `Enabling repetitions for row ${index + 2} - ${
              allowReps[0].instances[0].instanceSeq
            }.`
          );
        })
        .catch(function (error) {
          count--;
          console.log(
            `Error attempting to enable repetitions for row ${index + 2} - ${
              allowReps[0].instances[0].instanceSeq
            }: ${error}`
          );
        });
    } // If no, turn subsampling off
  } else if (element[2].toUpperCase() === "NO") {
    const prefs = await axios
      .get(qgiPrefsUrl + element[0], {
        headers: { Authorization: `Bearer ${authToken.access_token}` },
      })
      .then((response) => {
        if (response.status === 204) {
          console.log(`${element[0]} not found...`);
          return "ERROR";
        } else {
          return response.data[0].instances[0].preferences;
        }
      })
      .catch((error) => {
        console.log(error);
        return "ERROR";
      });

    // console.log(prefs);

    if (prefs === "ERROR") {
      count--;
      console.log(
        `Error attempting to get preferences for row ${index + 2} - ${
          element[0]
        }.`
      );
    } else {
      // Turn subsampling off for targeted business unit
      prefs[element[1]].subsamplesAllowed = false;
      const disableSub = [
        {
          userId: "EHXFR",
          instances: [{}],
        },
      ];

      disableSub[0].classSeq = element[0].substring(0, 5);
      disableSub[0].instances[0].instanceSeq = element[0];
      disableSub[0].instances[0].preferences = prefs;

      // console.log(disableSub[0].instances[0]);

      await axios
        .patch(qgiPatchUrl, disableSub, {
          headers: { Authorization: `Bearer ${authToken.access_token}` },
        })
        .then(function () {
          console.log(
            `Disabling subsampling for row ${index + 2} - ${
              disableSub[0].instances[0].instanceSeq
            }.`
          );
        })
        .catch(function (error) {
          count--;
          console.log(
            `Error attempting to disable subsamling for row ${index + 2} - ${
              disableSub[0].instances[0].instanceSeq
            }: ${error}`
          );
        });
    }
  } else {
    count--;
    console.log(
      `Missing valid input for column C on row ${index + 2} - ${element[0]}.`
    );
  }
}

console.log(`Updated ${count} of ${csvArray.length} records.`);
