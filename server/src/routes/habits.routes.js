import { Router } from "express";
import Habit from "../models/Habit.js";
import { validateFilterSort, filterAndSort } from "../utils/filterSort.js";

const router = Router();

// GET /api/habits - list all habits for the authenticated user
// Query params: status (all, completed, pending), sortBy (default, name, streak, lastCompleted)
router.get("/", async (req, res) => {
  try {
    const { status = 'all', sortBy = 'default' } = req.query;

    // Validate query parameters
    const validation = validateFilterSort({ status, sortBy });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Fetch all habits for the user (default sorted by createdAt desc)
    const habits = await Habit.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    // Apply filtering and sorting
    const filtered = filterAndSort(habits, { status, sortBy });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

// GET /api/habits/reminders - list habits with reminders for the current day
router.get("/reminders", async (req, res) => {
  try {
    const habits = await Habit.find({
      userId: req.userId,
      hasReminder: true,
    });

    const validDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayStr = validDays[new Date().getDay()];

    const todaysHabits = habits.filter(
      (habit) => habit.schedule && habit.schedule.includes(todayStr)
    );

    res.json(todaysHabits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

// POST /api/habits - create a new habit
router.post("/", async (req, res) => {
  try {
    const { name, schedule, goal, hasReminder, reminderTime } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const habit = await Habit.create({
      userId: req.userId,
      name: name.trim(),
      schedule: schedule || [],
      goal: goal?.trim() || "",
      hasReminder: hasReminder || false,
      reminderTime: reminderTime || "",
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

// PUT /api/habits/:id - update an existing habit
router.put("/:id", async (req, res) => {
  try {
    const { name, schedule, goal, hasReminder, reminderTime } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (schedule !== undefined) updates.schedule = schedule;
    if (goal !== undefined) updates.goal = goal.trim();
    if (hasReminder !== undefined) updates.hasReminder = hasReminder;
    if (reminderTime !== undefined) updates.reminderTime = reminderTime;

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

// DELETE /api/habits/:id - delete a habit
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

// PATCH /api/habits/:id/complete - toggle today's completion
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
