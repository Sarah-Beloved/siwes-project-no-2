import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// POST: Register a student
router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res
      .status(201)
      .json({ message: "Student registered successfully", student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete a student by ID
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
