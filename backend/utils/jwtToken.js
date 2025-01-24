// Creating token & saving in cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  const responseData = {
    success: true,
    user,
    token,
    isAuthenticated: statusCode === 200 || statusCode === 201, // isAuthenticated true if statusCode is 200 otherwise false
  };
  res.status(statusCode).cookie("token", token, options).json(responseData);
};

module.exports = sendToken;
