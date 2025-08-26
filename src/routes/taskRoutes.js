import express from "express";
import Task from "../models/Task.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = new Task({ title, description, userId: req.user.id });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Get one
router.get("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task);
});

// Update
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, { title, description, status }, { new: true });
  res.json(task);
});

// Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

export default router;
