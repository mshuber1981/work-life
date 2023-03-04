// https://nodejs.org/dist/latest-v18.x/docs/api/child_process.html#child_processexeccommand-options-callback
import { exec } from "child_process";

// Run a terminal command and then wait for/return the output
export function execPromise(command) {
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
