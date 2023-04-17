# Examples

## Question Creation History Report

Problem - Read from a csv file of Question codes, get the short text and audit history creation date(s) for each code, and then output to a csv file.

Solution ([Node.js](https://nodejs.org/en) + [Axios](https://axios-http.com/)):

1. [QuestionCreationHistory.js line 50](https://github.com/mshuber1981/work-life/blob/main/present/QuestionCreationHistory.js#L50) - Use a GET endpoint to grab the audit history for each Question Code.

2. [QuestionCreationHistory.js line 79](https://github.com/mshuber1981/work-life/blob/main/present/QuestionCreationHistory.js#L79) - Use a GET endpoint to fetch the short text for each Question code.

### Get audit history example

```javascript linenums="1"
const result = await axios.post(process.env.QUESTIONS + `audit`, requestBody, {
  headers: { Authorization: `Bearer ${authToken.access_token}` },
});

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
```

### Get short text example

```javascript linenums="1"
const shortText = await axios.get(
  process.env.QUESTIONS + `question?questionCode=${element[0]}`,
  {
    headers: { Authorization: `Bearer ${authToken.access_token}` },
  }
);

tempData.Short_Text = shortText.data.questions[0].text;
```

### [Example CSV output](https://github.com/mshuber1981/work-life/blob/main/present/Question_Creation_History.csv)

<!-- ## Name

Problem - ?

Solution ([Node.js](https://nodejs.org/en) + [Axios](https://axios-http.com/)):

1. [Some file some line](github) - Use some endpoint to do something

### Example usage

#### [Some file](github)

```javascript linenums="1"

```

#### Results

```json linenums="1"

```

[Example output files](github link) -->

<!-- ## Name

Problem - ?

Solution ([Node.js](https://nodejs.org/en) + [Axios](https://axios-http.com/)):

1. [Some file some line](github) - Use some endpoint to do something

### Example usage

#### [Some file](github)

```javascript linenums="1"

```

#### Results

```json linenums="1"

```

[Example output files](github link) -->
