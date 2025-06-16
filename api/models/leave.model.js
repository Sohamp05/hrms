import mongoose from "mongoose";

const { Schema, model } = mongoose;

const leaveApplicationSchema = new Schema({
  fromDate: {
    type: String,
    required: true,
  },
  toDate: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  month: {
    type: String,
    required: true,
  },
  against_balance: {
    type: Number,
    default: 0,
  },
  empRef: {
    type: String,
    required: true,
  },
});

const Leave = model("Leave", leaveApplicationSchema);

export default Leave;
