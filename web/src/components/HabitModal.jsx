import { useState, useEffect } from "react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitModal({ habit, onSave, onClose }) {
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(habit);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setSchedule(habit.schedule || []);
      setGoal(habit.goal || "");
    }
  }, [habit]);

  function toggleDay(day) {
    setSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Name is required"); return; }
    setIsSaving(true);
    try {
      await onSave({ name: name.trim(), schedule, goal: goal.trim() });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl border border-surface-200 shadow-xl">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-surface-800">
            {isEditing ? "Edit Habit" : "New Habit"}
          </h2>
          <button onClick={onClose} className="cursor-pointer p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors" aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {error && (
            <p className="text-[13px] text-danger-500 bg-danger-400/10 border border-danger-400/20 rounded-xl px-3 py-2.5">{error}</p>
          )}

          <div>
            <label htmlFor="habit-name" className="block text-[13px] font-medium text-surface-600 mb-1.5">Habit name</label>
            <input id="habit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Morning run"
              className="w-full text-[13px] border border-surface-200 rounded-xl px-3.5 py-2.5 text-surface-800 placeholder-surface-400 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all" autoFocus />
          </div>

          <div>
            <span className="block text-[13px] font-medium text-surface-600 mb-2">Schedule</span>
            <div className="flex gap-1.5">
              {WEEKDAYS.map((day) => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={`cursor-pointer flex-1 text-[12px] py-1.5 rounded-lg transition-all ${
                    schedule.includes(day)
                      ? "bg-accent-500 text-white shadow-sm shadow-accent-200"
                      : "border border-surface-200 text-surface-500 hover:border-surface-300 hover:bg-surface-50"
                  }`}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="habit-goal" className="block text-[13px] font-medium text-surface-600 mb-1.5">
              Goal <span className="text-surface-400 font-normal">(optional)</span>
            </label>
            <textarea id="habit-goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Run 5km every session" rows={2}
              className="w-full text-[13px] border border-surface-200 rounded-xl px-3.5 py-2.5 text-surface-800 placeholder-surface-400 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all resize-none" />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button type="button" onClick={onClose} className="cursor-pointer text-[13px] px-4 py-2 rounded-xl border border-surface-200 text-surface-600 hover:bg-surface-50 transition-all">Cancel</button>
            <button type="submit" disabled={isSaving}
              className="cursor-pointer text-[13px] font-medium px-5 py-2 rounded-xl bg-accent-500 text-white shadow-sm shadow-accent-200 hover:bg-accent-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
