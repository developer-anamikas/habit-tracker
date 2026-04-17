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
  },
  { timestamps: true }
);

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
