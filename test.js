import axios from "axios";
import { getAuthToken } from "./functions/Auth.js";

const authToken = await getAuthToken("NP");

const velocityApp = "Activity Plan";

const result = await axios.get(
  `https://questions-api.velocity-np.ag/questions-api/v3/velocityApp/${velocityApp}/questionCode`,
  {
    headers: { Authorization: `Bearer ${authToken.access_token}` },
  }
);

console.log(JSON.stringify(result.data));
