import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
