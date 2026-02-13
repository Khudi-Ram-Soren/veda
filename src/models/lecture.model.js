import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      maxLength: [100, "title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
      maxLength: [200, "description cannot exceed 200 characters"],
    },
    videoUrl: {
      type: String,
      required: [true, "video URL is required"],
    },
    duration: {
      type: Number,
      default: 0,
    },
    publicId: {
      type: String,
      requird: [true, "Public Id is required for video management"],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: [true, "lecture order is required"],
    },
  },
  { timestamps: true }
);

lectureSchema.pre("save", function (next) {
  if (this.duration) {
    this.duration = Math.round(this.duration * 100) / 100;
  }

  next();
});

export const Lecture = mongoose.model("Lecture", lectureSchema);
