import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

/**
 * @route   POST /api/attendance
 * @desc    Save one or multiple attendance records
 * @access  Public (for now)
 */
router.post("/", async (req, res) => {
  try {
    console.log("Incoming attendance data:", req.body);

    // Handle both possible request shapes
    const records = Array.isArray(req.body) ? req.body : req.body.records;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: "No attendance records provided." });
    }

    // Basic validation (optional but good practice)
    const validRecords = records.filter(
      (r) =>
        r.name && r.status && ["Present", "Absent", "Late"].includes(r.status)
    );

    if (validRecords.length === 0) {
      return res.status(400).json({
        error: "No valid attendance records found (name and status required).",
      });
    }

    // Save all valid attendance records to MongoDB
    const savedRecords = await Attendance.insertMany(validRecords);

    res.status(201).json({
      message: "✅ Attendance saved successfully",
      count: savedRecords.length,
      records: savedRecords,
    });
  } catch (err) {
    console.error("❌ Error saving attendance:", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   GET /api/attendance
 * @desc    Fetch all attendance records
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/attendance/:date
 * @desc    Fetch attendance records by date
 * @access  Public
 */
router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const records = await Attendance.find({
      date: { $gte: start, $lt: end },
    }).sort({ name: 1 });

    if (records.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this date." });
    }

    res.json(records);
  } catch (err) {
    console.error("❌ Error fetching attendance by date:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
