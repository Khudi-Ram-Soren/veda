import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  userRoleEnum,
  availableUserRoll,
  USER_TEMPRORARY_TOKEN,
} from "../constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      maxLength: [50, "name cannot exceed 50 characters"],
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provie a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
      minLength: [8, "password must be at least 8 characters long"],
      select: true,
    },
    role: {
      type: String,
      enum: {
        values: availableUserRoll,
        message: "Please select a valid role",
      },
      default: userRoleEnum.STUDENT,
    },
    bio: {
      type: String,
      trim: true,
      maxLength: [200, "bio cannot exceed 200 characters"],
    },
    avatar: {
      type: String,
    },
    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    refreshToken: String,
    refreshTokenExpiry: Date,
    isEmailVarified: {
      type: Boolean,
      default: false,
    },
    emailVarificationToken: String,
    emailVarificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    virtuals: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordVarified = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

userSchema.methods.generateRefreshAndAccessToken = async function () {
  const accessToken = await jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );

  const refreshToken = await jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  return { accessToken, refreshToken };
};

userSchema.methods.generateTemproraryToken = async function () {
  const unhashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + USER_TEMPRORARY_TOKEN;

  return { unhashedToken, hashedToken, tokenExpiry };
};

userSchema.methods.updateLastActive = async function () {
  this.lastActive = Date.now();
  return this.save({ validateBeforeSave: false });
};

userSchema.virtual("totalEnrolledCourses").get(function () {
  return this.enrolledCourses.length;
});

export const User = mongoose.model("User", userSchema);
