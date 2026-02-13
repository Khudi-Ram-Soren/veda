import mongoose, { Schema } from "mongoose";
import { availableCourseLevel, courseLevelEnum } from "../constants.js";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      maxLength: [100, "title cannot exceed 100 characters"],
    },
    subTitle: {
      type: String,
      required: true,
      trim: true,
      maxLength: [200, "subTitle cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "category is required"],
    },
    level: {
      type: String,
      enum: {
        values: availableCourseLevel,
        message: "please enter valid course level",
      },
      default: courseLevelEnum.BEGINEER,
    },
    price: {
      type: Number,
      required: [true, "course price is required"],
      default: 0,
    },
    thumbnail: {
      type: string,
      required: [true, "thumbnail is required"],
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: [true, "lecture is required"],
      },
    ],
    instrucotr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "instructor is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.pre("save", function (next) {
  if (this.lectures) {
    this.totalLectures = this.lectures.length;
  }

  next();
});

courseSchema.virtual("averageRatting").get(function () {
  return 0;
});

export const Course = mongoose.model("Course", courseSchema);
