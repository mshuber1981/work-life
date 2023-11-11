# Excel Files

Excel files are also a big part of my work life, and [SheetJS](https://docs.sheetjs.com/) gives me JavaScript Excel super powers!

## Example usage

[index.js line 25](https://github.com/mshuber1981/work-life/blob/main/index.js#L25)

```javascript
try {
  console.log("Fetching GitHub projects...");
  const result = await axios.get(process.env.API_URL);
  // Create workbook
  const workbook = utils.book_new();
  const data = [];
  result.data.forEach((element) => {
    const tempObj = {};
    tempObj["Repo Name"] = element.name;
    tempObj["Description"] = element.description;
    tempObj["Homepage"] = element.homepage;
    data.push(tempObj);
  });
  // Create worksheet
  const worksheet = utils.json_to_sheet(data);
  // Add NP hyperlinks to mappings worksheet
  for (let index = 0; index < result.data.length; index++) {
    const element = result.data[index];
    worksheet[`A${index + 2}`].l = {
      Target: element.html_url,
    };
    worksheet[`C${index + 2}`].l = {
      Target: element.homepage,
    };
  }
  // Append NP worksheets to workbook
  utils.book_append_sheet(workbook, worksheet, "Repos");
  // Export workbook
  console.log("Exporting results to My_GitHub_repos.xlsx");
  writeFile(workbook, "My_GitHub_repos.xlsx");
} catch (error) {
  console.log(error.code);
}
```

## Example output

[My_GitHub_repos.xlsx](https://github.com/mshuber1981/work-life/blob/main/My_GitHub_repos.xlsx)
