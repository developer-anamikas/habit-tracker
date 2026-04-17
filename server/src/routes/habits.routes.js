import { Router } from "express";
import Habit from "../models/Habit.js";

const router = Router();

// GET /api/habits — list all habits for the authenticated user
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

// POST /api/habits — create a new habit
router.post("/", async (req, res) => {
  try {
    const { name, schedule, goal } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const habit = await Habit.create({
      userId: req.userId,
      name: name.trim(),
      schedule: schedule || [],
      goal: goal?.trim() || "",
    });

    res.status(201).json(habit);
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: "Failed to create habit" });
  }
});

// PUT /api/habits/:id — update an existing habit
router.put("/:id", async (req, res) => {
  try {
    const { name, schedule, goal } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (schedule !== undefined) updates.schedule = schedule;
    if (goal !== undefined) updates.goal = goal.trim();

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { returnDocument: "after", runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json(habit);
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: "Failed to update habit" });
  }
});

// DELETE /api/habits/:id — delete a habit
router.delete("/:id", async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete habit" });
  }
});

// PATCH /api/habits/:id/complete — toggle today's completion
router.patch("/:id/complete", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    const index = habit.completions.indexOf(today);
    if (index === -1) {
      habit.completions.push(today);
    } else {
      habit.completions.splice(index, 1);
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle completion" });
  }
});

export default router;
