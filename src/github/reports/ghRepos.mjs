import { reportsStayOrGo } from "./reportsMenu.mjs";
import { sleep } from "../../utils/general.mjs";
import { userName } from "../../mainMenus.mjs";

let ghUserName;

// Get all the GH repos for a given username
const ghRepos = async () => {
  ghUserName = await userName();
  console.log(`Fetching GitHub repos for ${ghUserName}`);
  await sleep();
  await reportsStayOrGo();
};

export default ghRepos;
