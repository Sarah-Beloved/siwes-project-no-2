import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Old", "New"],
      required: true,
    },
    fullname: { type: String, required: true },
    age: { type: Number },
    className: { type: String, required: true },
    admissionNo: { type: String, required: true, unique: true },
    parentName: { type: String },
    contact: { type: String },
    address: { type: String },
    lastSchool: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
