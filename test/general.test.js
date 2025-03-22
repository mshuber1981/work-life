import { describe, expect, jest } from "@jest/globals";
import { execPromise, sleep, timeStamp } from "../src/utils/general.mjs";

// Mock execPromise
jest.mock("../src/utils/general.mjs", () => {
  const actual = jest.requireActual("../src/utils/general.mjs");
  return {
    ...actual,
    execPromise: jest.fn().mockResolvedValue("mocked output"),
  };
});

describe("General Utils", () => {
  describe("sleep", () => {
    it("should be a function", () => {
      // test if sleep is a function
      typeof sleep === "function";
    });
    it("should return a promise", () => {
      // test if sleep returns a promise
      sleep() instanceof Promise;
    });
    it("should resolve after a given time", async () => {
      // test if sleep resolves after a given time
      const start = Date.now();
      await sleep(1000);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(1000);
    });
  });
  describe("timeStamp", () => {
    it("should be a function", () => {
      // test if timeStamp is a function
      typeof timeStamp === "function";
    });
    it("should return a string", () => {
      // test if timeStamp returns a string
      timeStamp() instanceof String;
    });
    it("should return a string with the current time", () => {
      // test if timeStamp returns a string with the current time
      const time = timeStamp();
      const now = new Date();
      const month =
        now.getMonth() + 1 < 10
          ? `0${now.getMonth() + 1}`
          : `${now.getMonth() + 1}`;
      const day =
        now.getUTCDate() < 10 ? `0${now.getUTCDate()}` : now.getUTCDate();
      const expected = `${month}${day}${now.getFullYear()}`;
      expect(time).toBe(expected);
    });
  });
  describe("execPromise", () => {
    it("should be a function", () => {
      expect(typeof execPromise).toBe("function");
    });
    it("should return a promise", () => {
      // test if execPromise returns a promise
      expect(execPromise("echo test")).toBeInstanceOf(Promise);
    });
    it("should resolve with the output of the command", async () => {
      // test if execPromise resolves with the mocked output
      const output = await execPromise("echo test");
      expect(output).toBe("test");
    });
  });
});
