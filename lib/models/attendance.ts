import mongoose, { Schema } from "mongoose";

const AttendanceSchema = new Schema(
  {
    studentName: { type: String },
    sutdentPhone: { type: String },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    isAlrimtalkSend: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
