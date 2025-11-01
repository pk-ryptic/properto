import assert from "node:assert";
import AppError from "./AppError";
import { HttpStatusCode } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";

type AppAssertType = (
  condition: any,
  httpstatuscode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: AppAssertType = (
  condition,
  httpstatuscode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpstatuscode, message, appErrorCode));

export default appAssert;