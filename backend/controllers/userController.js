const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("../utils/cloudinary");

// Register User
exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log("req.file:", req.file);
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file selected.." });
    }
    const avatarResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "E-commerce/user-avatars",
      width: 200,
      height: 200,
      crop: "scale",
    });
    const user = await userModel.create({
      name,
      email,
      password,
      avatar: {
        public_id: avatarResult.public_id,
        url: avatarResult.secure_url,
      },
    });
    sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
  }
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password!", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password!", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password!", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect!", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match!", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Update Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  let user = await userModel.findById(req.user.id);

  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
    if (req.file) {
      await cloudinary.uploader.destroy(user.avatar.public_id);

      const avatarResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "E-commerce/user-avatars",
        width: 200,
        height: 200,
        crop: "scale",
      });

      newUserData.avatar = {
        public_id: avatarResult.public_id,
        url: avatarResult.secure_url,
      };
    }

    user = await userModel.findByIdAndUpdate(req.user.id, newUserData);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

// All Users - Admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get One User Details - Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exists with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role - Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await userModel.findByIdAndUpdate(req.params.id, newUserData);

  res.status(200).json({
    success: true,
  });
});

// Remove User - Admin
exports.removeUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exists with Id: ${req.params.id}`, 404)
    );
  }
  if (user.avatar && user.avatar.public_id) {
    try {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    } catch (error) {
      return next(
        new ErrorHandler("Error removing user's avatar from Cloudinary", 500)
      );
    }
  }

  await userModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User Removed..",
  });
});
