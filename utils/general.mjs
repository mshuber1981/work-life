// https://nodejs.org/dist/latest-v18.x/docs/api/child_process.html#child_processexeccommand-options-callback
import { exec } from "child_process";

// Require a parameter
export const isRequired = (param) => {
  throw new Error(`${param} is required!`);
}


// Run a terminal command and then wait for/return the output
export const execPromise = (command = isRequired("Terminal Command (string)")) => {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

export default isRequired;
