import mongoose, { Schema } from "mongoose";
import {
  coursePurchaseStatusEnum,
  availableCoursePurchaseStatus,
} from "../constants.js";

const coursePurchaseSchema = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "course reference is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user reference is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      min: [0, "amount must be non-negative"],
    },
    currency: {
      type: String,
      required: [true, "currency is required"],
      uppercase: true,
      default: "USD",
    },
    status: {
      type: String,
      enum: {
        values: availableCoursePurchaseStatus,
        message: "Please select a valid status",
      },
      default: coursePurchaseStatusEnum.PENDING,
    },
    paymentMethod: {
      type: String,
      required: [true, "payment method is required"],
    },
    paymentId: {
      type: String,
      required: [true, "payment Id is required"],
    },
    orderId: {
      type: String,
      required: [true, "oreder Id is required"],
    },
    refundId: {
      type: String,
    },
    refundAmount: {
      type: Number,
      min: [0, "refund amount must be non-negative"],
    },
    refundReason: {
      type: String,
    },
    metaData: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

coursePurchaseSchema.index({ user: 1, course: 1 });
coursePurchaseSchema.index({ status: 1 });
coursePurchaseSchema.index({ createdAt: -1 });

coursePurchaseSchema.virtual("isRefundable").get(function () {
  if (this.status !== coursePurchaseStatusEnum.COMPLETED) {
    return false;
  }

  const thirtyDay = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.createdAt > thirtyDay;
});

coursePurchaseSchema.methods.processRefund = function (reason, amount) {
  this.status = coursePurchaseStatusEnum.REFUNDED;
  this.reason = reason;
  this.refundAmount = amount || this.amount;

  this.svae();
};

export const CoursePurchase = mongoose.model(
  "CoursePurchase",
  coursePurchaseSchema
);
