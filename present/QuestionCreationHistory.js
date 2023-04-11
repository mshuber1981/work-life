import fs from "fs";
import path from "path";
import axios from "axios";
import { getAuthToken } from "./functions/Auth.js";
import { CSVToArray } from "./functions/CSV.js";
import cliProgress from "cli-progress";
import { convertToCsv } from "./functions/CSV.js";

// Get NP token
const authToken = await getAuthToken("NP");

// Read CSV file of Question codes
const questionCodesCsvData = fs.readFileSync(
  path.resolve("present", "QuestionCreationHistory.csv"),
  "utf-8"
);

// Covert to Array
const questionCodes = CSVToArray(questionCodesCsvData);

// console.log(questionCodes);

if (questionCodes.length !== 0) {
  const csvOutData = [];

  console.log("");
  console.log(`Evaluating ${questionCodes.length} Question codes(s)...`);
  console.log("");

  const multibar = new cliProgress.MultiBar(
    { hideCursor: true },
    cliProgress.Presets.shades_classic
  );

  const questionProgress = multibar.create(questionCodes.length, 0);

  // Get the audit history and short text for each Question code
  for (let index = 0; index < questionCodes.length; index++) {
    const element = questionCodes[index];
    const tempData = { Question_Code: element[0], Short_Text: "", History: "" };
    const tempHistory = [];
    const requestBody = {
      objects: {
        questions: [`${element[0].toUpperCase()}`],
      },
    };

    // Get the audit history for each Question Code
    try {
      const result = await axios.post(
        process.env.QUESTIONS + `audit`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${authToken.access_token}` },
        }
      );

      result.data.forEach((element) => {
        if (element.action === "CREATED") {
          tempHistory.push(`Created: ${element.timestamp}`);
        } else {
          if (element.action === "DELETED") {
            tempHistory.push(`Deleted: ${element.timestamp}`);
          }
        }
      });
      tempData.History = JSON.stringify(tempHistory);
    } catch (error) {
      multibar.log(
        JSON.stringify(error.message) +
          ` audit history for Question code - ${element[0]}\n`
      );
      multibar.log("\n");
      tempData.History = "Error!";
    }

    // Get the short text for each Question code
    try {
      const shortText = await axios.get(
        process.env.QUESTIONS + `question?questionCode=${element[0]}`,
        {
          headers: { Authorization: `Bearer ${authToken.access_token}` },
        }
      );

      tempData.Short_Text = shortText.data.questions[0].text;
    } catch (error) {
      multibar.log(
        JSON.stringify(error.message) +
          ` Question details for Question code - ${element[0]}\n`
      );
      multibar.log("\n");
      tempData.Short_Text = "Error!";
    }

    csvOutData.push(tempData);
    questionProgress.increment();
  }

  multibar.stop();

  // console.log(csvOutData);

  // Export to CSV file
  await convertToCsv(csvOutData, "./", "Question_Creation_History");

  console.log("");
  console.log(
    `Exported ${csvOutData.length} record(s) to Question_Creation_History.csv`
  );
  console.log("");
} else {
  console.log("");
  console.log("No Questions found... ¯\\_(ツ)_/¯");
  console.log("");
}
