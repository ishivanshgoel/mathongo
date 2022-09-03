const {
  createUserAccountService,
  resendOtpService,
  verifyOtpService,
  generateForgetPasswordRequestService,
  resetPasswordService,
  loginService,
} = require("../services/userService");

async function createNewUserAccountController(req, res, next) {
  try {
    const { email, password, firstName, lastName } = req.body;
    const response = await createUserAccountService(
      email,
      password,
      firstName,
      lastName
    );
    return res.json({
      message: "success",
      response: response,
    });
  } catch (err) {
    return res.json({
      message: "error",
      detail: err.message,
    });
  }
}

async function verifyOtpController(req, res, next) {
  try {
    const { emailId, otp } = req.body;
    const response = await verifyOtpService(emailId, otp);
    return res.json({
      message: "success",
      response: response,
    });
  } catch (err) {
    return res.json({
      message: "error",
      detail: err.message,
    });
  }
}

async function resendOtpController(req, res, next) {
  try {
    const { emailId } = req.body;
    const response = await resendOtpService(emailId);
    return res.json({
      message: "success",
      response: response,
    });
  } catch (err) {
    return res.json({
      message: "error",
      detail: err.message,
    });
  }
}

async function generateForgetPasswordRequestController(req, res, next) {
  try {
    const { emailId } = req.body;
    const response = await generateForgetPasswordRequestService(emailId);
    return res.json({
      message: "success",
      response: response,
    });
  } catch (err) {
    return res.json({
      message: "error",
      detail: err.message,
    });
  }
}

async function resetPasswordController(req, res, next) {
  try {
    const { operationId, newPassword } = req.body;
    const response = await resetPasswordService(operationId, newPassword);
    return res.json({
      message: "success",
      response: response,
    });
  } catch (err) {
    return res.json({
      message: "error",
      detail: err.message,
    });
  }
}

async function loginController(req, res, next) {
  try {
    const { emailId, password } = req.body;
    const response = await loginService(emailId, password);
    return res.json({
      message: "success",
      response: response,
    });
  } catch (err) {
    return res.json({
      message: "error",
      detail: err.message,
    });
  }
}

module.exports = {
  createNewUserAccountController,
  resendOtpController,
  verifyOtpController,
  generateForgetPasswordRequestController,
  resetPasswordController,
  loginController,
};
