# Excel Files

Excel and CSV files are a big part of my work life, and [SheetJS](https://docs.sheetjs.com/) gives me JavaScript Excel super powers!

## Example usage

[ghRepos.mjs line 25](https://github.com/mshuber1981/work-life/blob/main/src/github/reports/ghRepos.mjs#L25)

```javascript
// Create workbook
const workbook = utils.book_new();
const data = [];
spinner
  .success()
  .info(
    `GitHub repos successfully fetched for ${ghUserName} at ${timeStamp()}`
  );
result.data.forEach((element) => {
  const tempObj = {};
  tempObj["Repo Name"] = element.name;
  tempObj["Description"] = element.description;
  tempObj["Homepage"] = element.homepage;
  data.push(tempObj);
});
// Create worksheet
const worksheet = utils.json_to_sheet(data);
// Add hyperlinks to worksheet
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
console.log(
  chalk.green(
    `Exporting results to ${ghUserName}_GitHub_repos.xlsx at ${timeStamp()}`
  )
);
writeFile(workbook, `${ghUserName}_GitHub_repos_${timeStamp()}.xlsx`);
```

## Example output

[My_GitHub_repos.xlsx](https://github.com/mshuber1981/work-life/blob/main/My_GitHub_repos.xlsx)
