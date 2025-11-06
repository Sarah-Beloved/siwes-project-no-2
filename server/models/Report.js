import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    submittedBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
