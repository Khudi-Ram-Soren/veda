import mongoose, { Schema } from "mongoose";

const lectureProgressSchema = new Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: [true, "Lecture reference is required"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  watchTime: {
    type: Date,
    default: 0,
  },
  lastWatched: {
    type: Date,
    default: Date.now,
  },
});

const courseProgressSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    lectureCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lectureProgress: [lectureProgressSchema],
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseProgressSchema.pre("save", function (next) {
  if (this.lectureProgress.length > 0) {
    const completedLecture = this.lectureProgress.filter(
      (lp) => lp.isCompleted
    ).length;

    this.lectureCompletionPercentage =
      Math.round(completedLecture / this.lectureProgress.length) * 100;

    this.isCompleted = this.lectureCompletionPercentage === 100;
  }

  next();
});

courseProgressSchema.methods.updateLastAccessed = function () {
  this.lastAccessed = Date.now();
  return this.save({ validateBeforeSave: false });
};

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
