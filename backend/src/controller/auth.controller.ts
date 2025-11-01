import { CREATED } from "../constants/http";
import { createAccount } from "../services/auth.service";
import catchError from "../utils/catchError";
import { setAuthCookies } from "../utils/cookies";
import { registerHandlerSchema } from "../validators/zodSchemaValidations";



export const registerHandler = catchError(async (req, res) => {
  // validate the request 
  const request = registerHandlerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  // call the service
  const { user, accessToken, refreshToken } = await createAccount(request);

  // returns the response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});
