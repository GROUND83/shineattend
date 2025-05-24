import mongoose, { Schema } from "mongoose";

const StudentSchema = new Schema(
  {
    name: String,
    studentPhone: { type: String, unique: true },
    parentPhone: String,
    isSent: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Student =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);
