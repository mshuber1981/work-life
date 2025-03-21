// https://nodejs.org/dist/latest-v18.x/docs/api/child_process.html#child_processexeccommand-options-callback
import { exec } from "child_process";

// Return timestamp for reports
export const timeStamp = () => {
  const now = new Date();
  const month =
    now.getMonth() + 1 < 10
      ? `0${now.getMonth() + 1}`
      : `${now.getMonth() + 1}`;
  const day = now.getUTCDate() < 10 ? `0${now.getUTCDate()}` : now.getUTCDate();

  return `${month}${day}${now.getFullYear()}`;
};

// Run a terminal command and then wait for/return the output
export const execPromise = (command) => {
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
};

// Sleep/pause
export const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

export default timeStamp;
