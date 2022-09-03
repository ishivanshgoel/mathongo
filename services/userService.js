const UserAccount = require("../models/userAccount");
const UserAccountOtpVerification = require("../models/userAccountOtpVerification");
const ForgetPasswordRequest = require("../models/forgetPasswordRequest");
const { ObjectID } = require("bson");
const bcrypt = require("bcrypt");

// to create new user account
async function createUserAccountService(
  emailId,
  password,
  firstName,
  lastName
) {
  // #region validations
  if (typeof emailId != "string" || emailId == null || emailId.length == 0) {
    throw new Error(`Invalid Email Id`);
  }

  if (typeof password != "string" || password == null || password.length == 0) {
    throw new Error(`Invalid Password`);
  }

  if (
    typeof firstName != "string" ||
    firstName == null ||
    firstName.length == 0
  ) {
    throw new Error(`Invalid First Name`);
  }

  if (typeof lastName != "string" || lastName == null || lastName.length == 0) {
    throw new Error(`Invalid Last Name`);
  }

  // check if any account exists with same emailId
  const exisit = await UserAccount.findOne({ emailId: emailId }).exec();
  if (exisit) {
    throw new Error(`Email Id: ${emailId} already registered`);
  }
  // #endregion validations

  // encrypt password
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  // create new account
  let userAccount = new UserAccount({
    emailId: emailId,
    password: encryptedPassword,
    firstName: firstName,
    lastName: lastName,
  });

  //save the account and send otp to the user
  await userAccount.save();
  generateAndSendOtp(emailId);
  return "Account Created.";
}

// service for resending otp to user, to be used when user misses account verification at the time of onboarding
async function resendOtpService(emailId) {
  // #region validations
  if (typeof emailId != "string" || emailId == null || emailId.length == 0) {
    throw new Error(`Invalid Email Id`);
  }

  // check if user account exists or not
  const exisit = await UserAccount.findOne({ emailId: emailId }).exec();
  if (!exisit) {
    throw new Error(`Email Id: ${emailId} is not registered!`);
  }

  // check if the account is already verified or not, if already verified throw an error
  if (exisit.verified) {
    throw new Error(`Email Id: ${emailId} is already verified`);
  }
  // #endregion validations
  await generateAndSendOtp(emailId);
  return "OTP Sent";
}

// service to generate and send the top
async function generateAndSendOtp(emailId) {
  // #region validations
  if (typeof emailId != "string" || emailId == null || emailId.length == 0) {
    throw new Error(`Invalid Email Id`);
  }
  // #endregion validations

  // check if there is any request associated with the same email beofre
  const exisit = await UserAccountOtpVerification.findOne({
    emailId: emailId,
  }).exec();

  // new otp generation
  const newOtp = Math.floor(1000 + Math.random() * 9000);

  if (exisit) {
    exisit.otp = newOtp;
    await exisit.save();
  } else {
    const en = new UserAccountOtpVerification({
      emailId: emailId,
      otp: newOtp,
    });
    await en.save();
  }

  return "OTP Sent";
}

// service to verify the otp sent by the client
async function verifyOtpService(emailId, otp) {
  // #region validations
  if (typeof emailId != "string" || emailId == null || emailId.length == 0) {
    throw new Error(`Invalid Email Id`);
  }
  // #endregion validations

  const userAccount = await UserAccount.findOne({ emailId: emailId }).exec();
  if (userAccount.verified) {
    throw new Error("Account already verified");
  }

  const userOtp = await UserAccountOtpVerification.findOne({
    emailId: emailId,
  }).exec();

  if (userOtp.otp != otp) {
    throw new Error("Invalid OTP");
  }

  userAccount.verified = true;
  await userAccount.save();
  return "OTP Verified";
}

// service to generate a new request for password reset, a email will be sent to the users email id
async function generateForgetPasswordRequestService(emailId) {
  // #region validations
  if (typeof emailId != "string" || emailId == null || emailId.length == 0) {
    throw new Error(`Invalid Email Id`);
  }

  // check if user account exists or not
  const exisit = await UserAccount.findOne({ emailId: emailId }).exec();
  if (!exisit) {
    throw new Error(`Email Id: ${emailId} is not registered!`);
  }
  // #endregion validations

  // incase any older request exists for the same email id
  await ForgetPasswordRequest.findOneAndDelete({ emailId: emailId }).exec();

  // generate a new request for resetting password
  const newOperation = new ForgetPasswordRequest({
    emailId: emailId,
  });
  await newOperation.save();

  // send operation id to the user via email to reset the password
  return { operationId: newOperation._id };
}

// service to reset the password
async function resetPasswordService(operationId, newPassword) {
  // #region validations
  if (!operationId instanceof ObjectID) {
    throw new Error("Invalid Operation ID");
  }
  if (newPassword == null || newPassword.length == 0) {
    throw new Error("Invalid New Password");
  }
  // #endregion validations

  // find the reset request operation
  const operation = await ForgetPasswordRequest.findOne({
    _id: operationId,
  }).exec();
  if (!operation) {
    throw new Error("Invalid Operation ID");
  }

  // if the password reset request has already been fulfilled
  if (operation.fulfilled) {
    throw new Error("Request Already Fulfilled");
  }

  await UserAccount.findOneAndUpdate(
    { email: operation.emailId },
    { password: newPassword }
  );

  operation.fulfilled = true;
  operation.save();
  return "Password RESET Successful";
}

// login user service
async function loginService(emailId, password) {
  // #region validations
  if (typeof emailId != "string" || emailId == null || emailId.length == 0) {
    throw new Error(`Invalid Email Id`);
  }

  if (typeof password != "string" || password == null || password.length == 0) {
    throw new Error(`Invalid Password`);
  }

  const exist = await UserAccount.findOne({ emailId: emailId }).exec();
  if (!exist) {
    throw new Error(`Invalid Email/ Password`);
  }

  if (!exist.verified) {
    throw new Error("Account Not Verified");
  }
  // #endregion validations

  if (await bcrypt.compare(password, exist.password)) {
    return {
      firstName: exist.firstName,
      lastName: exist.lastName
    };
  }
  return "Invalid Email/ Password";
}

module.exports = {
  createUserAccountService,
  resendOtpService,
  verifyOtpService,
  generateForgetPasswordRequestService,
  resetPasswordService,
  loginService,
};
