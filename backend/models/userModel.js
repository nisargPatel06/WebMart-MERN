const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
    maxLength: [30, "Name is too long!"],
    minLength: [4, "Name is too short!"],
  },
  email: {
    type: String,
    required: [true, "Email required!"],
    unique: true,
    validate: [validator.isEmail, "Email is not valid!"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be empty!"],
    minLength: [8, "Minimum 8 characters required!"],
    select: false,
  },
  avatar: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
