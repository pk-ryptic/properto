import jwt from "jsonwebtoken";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import UserModel, { UserDocument } from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { oneYearFromNow } from "../utils/date";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";

interface CreateAccountParams {
  email: string;
  password: string;
  userAgent?: string | undefined;
}

export const createAccount = async (data: CreateAccountParams) => {
  // check it the user exists alredy
  const existingUser = await UserModel.exists({
    email: data.email,
  });
  appAssert(!existingUser, CONFLICT, "Email is already in use");
  // create the user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });
  // create the verification code
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });
  // send the verification code to user via mail
  // create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });
  // sign access and refresh jwt tokens
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );
  const accessToken = jwt.sign(
    {
      userId: user._id,
      sessionId: session._id,
    },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );
  // returns user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

interface loginParams{
  email: string;
  password: string;
  userAgent?: string | undefined;
}

export const loginUser = async (data: loginParams) => {
  // get the user by email and verify that they exist or not
  const user = await UserModel.findOne({
    email: data.email
  })
  appAssert(user, UNAUTHORIZED, "Invalid email or password")
  // validate the password the request
  const isPassValid  = await user.comparePassword(data.password)
  appAssert(isPassValid, UNAUTHORIZED, "Invalid email or password")
  
  // create a session 
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent
  })

  const sessionInfo = {
    sessionId: session._id
  }
  // sign access and refresh tokens
  const refreshToken = jwt.sign(
    sessionInfo,
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );
  const accessToken = jwt.sign(
    {
      ...sessionInfo,
      sessionId: session._id,
    },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );
  // return user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken
  }
}