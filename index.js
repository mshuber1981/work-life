import { getAuthToken } from "./functions/Auth.js";

// Get token
const authToken = await getAuthToken();
console.log(authToken);
