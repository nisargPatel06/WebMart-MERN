const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong Mongodb ID error
  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not found! Invalid : ${err.path}`, 400);
  }

  // Wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler(`Json Web Token is invalid! - Try again`, 400);
  }

  // JWT Expire Error
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler(`Json Web Token is expired! - Try again`, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
