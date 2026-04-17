import { useState } from "react";
import { useHabits } from "../hooks/useHabits";
import { useNotes } from "../hooks/useNotes";
import HabitCard from "../components/HabitCard";
import HabitModal from "../components/HabitModal";
import DeleteConfirm from "../components/DeleteConfirm";
import NotesPanel from "../components/NotesPanel";

export default function Habits() {
  const { habits, isLoading, error, createHabit, updateHabit, deleteHabit, toggleCompletion } =
    useHabits();
  const { notes, isLoading: notesLoading, createNote, deleteNote } = useNotes();

  const [modalHabit, setModalHabit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openCreate() { setModalHabit(null); setShowModal(true); }
  function openEdit(habit) { setModalHabit(habit); setShowModal(true); }
  function closeModal() { setShowModal(false); setModalHabit(null); }

  async function handleSave(data) {
    if (modalHabit) await updateHabit(modalHabit._id, data);
    else await createHabit(data);
  }

  async function handleToggleDay(habit, day) {
    const newSchedule = habit.schedule.includes(day)
      ? habit.schedule.filter((d) => d !== day)
      : [...habit.schedule, day];
    await updateHabit(habit._id, { schedule: newSchedule });
  }

  async function handleDelete() {
    await deleteHabit(deleteTarget._id);
    setDeleteTarget(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-accent-200 border-t-accent-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-surface-800">My Habits</h1>
          <p className="text-[13px] text-surface-400 mt-1">{habits.length} habit{habits.length !== 1 ? "s" : ""} tracked</p>
        </div>
        <button
          onClick={openCreate}
          className="cursor-pointer flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white text-[13px] font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-accent-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New habit
        </button>
      </div>

      {error && (
        <div className="mb-4 text-[13px] text-danger-500 bg-danger-400/10 border border-danger-400/20 rounded-xl px-4 py-2.5">{error}</div>
      )}

      <div className="flex gap-5">
        <div className="flex-[7] min-w-0">
          {habits.length === 0 ? (
            <EmptyHabits onAdd={openCreate} />
          ) : (
            <div className="grid gap-3">
              {habits.map((h) => (
                <HabitCard
                  key={h._id}
                  habit={h}
                  onToggleDay={handleToggleDay}
                  onToggleComplete={toggleCompletion}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex-[3] min-w-0">
          <NotesPanel notes={notes} isLoading={notesLoading} onCreate={createNote} onDelete={deleteNote} />
        </div>
      </div>

      {showModal && <HabitModal habit={modalHabit} onSave={handleSave} onClose={closeModal} />}
      {deleteTarget && <DeleteConfirm habitName={deleteTarget.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

function EmptyHabits({ onAdd }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
      <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <p className="text-[14px] text-surface-600 font-medium mb-1">No habits yet</p>
      <p className="text-[12px] text-surface-400 mb-4">Start building your routine by adding your first habit.</p>
      <button
        onClick={onAdd}
        className="cursor-pointer text-[13px] font-medium text-accent-600 hover:text-accent-700 transition-colors"
      >
        Create your first habit
      </button>
    </div>
  );
}
