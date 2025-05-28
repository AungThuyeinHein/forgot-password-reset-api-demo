import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/customError.js";
import crypto from "crypto";
import sendEmail from "../utils/email.js";
import utli from "util";

export const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

export const signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);
  const { password: pass, __v, ...rest } = newUser._doc;

  res.status(201).json({
    statusCode: 201,
    status: "success",
    message: "User created successfully.",
    data: { user: rest, token },
  });
});

export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new CustomError(
      400,
      "Please provide correct Email ID & Password for login!"
    );
    return next(error);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new CustomError(400, "Incorrect email or password");
    return next(error);
  }

  const token = signToken(user._id);
  const {
    password: pass,
    __v,
    passwordResetToken,
    passwordResetTokenExpire,
    ...rest
  } = user._doc;

  res.status(200).json({
    code: 200,
    status: "success",
    message: "User successfully log in.",
    data: {
      user: rest,
      token,
    },
  });
});

export const protect = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  if (!token) {
    next(
      new CustomError(401, "You are not logged in! Authentication required")
    );
  }
  const decodedToken = await utli.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );
  const user = await User.findById(decodedToken.id);

  if (!user) {
    const error = new CustomError(401, "The User does not exist");
    next(error);
  }
  const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
  if (isPasswordChanged) {
    const error = new CustomError(
      401,
      "The password has been changed recently.Please login again"
    );
    return next(error);
  }
  //allow user to access route
  req.user = user;
  next();
});

export const restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(403, "Forbidden Access");
      return next(error);
    }
    next();
  };
};

export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //1.Get User Base on posted email
  const { email } = req.body;

  const user = await User.findOne({ email });

  console.log("user", user);

  if (!user) {
    return next(
      new CustomError(
        404,
        "We Could not find the user with given email on our server."
      )
    );
  }

  //2. generate a random token

  const resetToken = user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //3.Send the token back to user email
  const resetUrl = `${process.env.BACKEND_API_URL}api/v1/auth/reset-password/${resetToken}`;
  console.log(`resetUrl : ${resetUrl}`);
  const message = `We have recieved a password reset request.Please use the below link to reset password.
   \n\n ${resetUrl} \n\n
  This reset password link will be valid only for 10 min.
  Additional Note for Developer : If You want to integrate this API with your frontend application, you can use the resetUrl to redirect the user to the password reset page. You Should carry the resetToken as a query parameter in the URL.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password change request recieved",
      message: message,
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: `Password reset link has been sent to the user email : ${req.body.email}`,
    });
  } catch (err) {
    (user.passwordResetToken = undefined),
      (user.passwordResetTokenExpire = undefined);
    user.save({ validateBeforeSave: false });

    return next(
      new CustomError(
        500,
        "There was an error sending password reset email.please try again later"
      )
    );
  }
});

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    const error = new CustomError(400, "Token is invalid or has expired");
    return next(error);
  }

  user.password = req.body.password;
  console.log(`req.body.password : ${req.body.password}`);
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  const loginToken = signToken(user._id);

  res.status(200).json({
    code: 200,
    status: "success",
    message: `Password successfully reset for your account: ${user.email}`,
    token: loginToken,
  });
});
