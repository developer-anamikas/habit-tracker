import mongoose from "mongoose";

const VALID_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    schedule: {
      type: [String],
      default: [],
      validate: {
        validator(days) {
          return days.every((d) => VALID_DAYS.includes(d));
        },
        message: "Schedule must contain valid weekday abbreviations",
      },
    },
    goal: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Goal cannot exceed 500 characters"],
    },
    completions: {
      type: [String],
      default: [],
    },
    hasReminder: {
      type: Boolean,
      default: false,
    },
    reminderTime: {
      type: String,
      default: "",
      validate: {
        validator: function(v) {
          if (!this.hasReminder) return true;
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: "Invalid time format, must be HH:MM",
      },
    },
    reminderTimezone: {
      type: String,
      trim: true,
      default: "UTC",
      maxlength: [100, "Reminder timezone cannot exceed 100 characters"],
    },
  },
  { timestamps: true }
);

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
