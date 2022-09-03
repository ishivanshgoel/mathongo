const express = require("express");
const userRouter = express.Router();
const {
  createNewUserAccountController,
  resendOtpController,
  verifyOtpController,
  generateForgetPasswordRequestController,
  resetPasswordController,
  loginController,
} = require("../controllers/userController");

userRouter.get("/", (req, res, next) => {
  res.json("ok");
});

userRouter.post("/new", (req, res, next) =>
  createNewUserAccountController(req, res, next)
);

userRouter.post("/login", (req, res, next) => loginController(req, res, next));

userRouter.post("/verifyOtp", (req, res, next) =>
  verifyOtpController(req, res, next)
);

userRouter.post("/forgetPassword", (req, res, next) =>
  generateForgetPasswordRequestController(req, res, next)
);

userRouter.post("/resetPassword", (req, res, next) =>
  resetPasswordController(req, res, next)
);

userRouter.post("/resendOtp", (req, res, next) =>
  resendOtpController(req, res, next)
);

module.exports = userRouter;
