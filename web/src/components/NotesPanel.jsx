import { useState } from "react";

/**
 * NotesPanel — lightweight notes system with add/dismiss.
 */
export default function NotesPanel({ notes, isLoading, onCreate, onDelete }) {
  const [input, setInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setIsSaving(true);
    try {
      await onCreate(input.trim());
      setInput("");
    } catch {
      /* handled by hook */
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5">
      <h2 className="text-[14px] font-semibold text-surface-800 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        Quick Notes
      </h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Jot something down..."
          className="flex-1 text-[13px] border border-surface-200 rounded-xl px-3.5 py-2.5 text-surface-700 placeholder-surface-400 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all"
        />
        <button
          type="submit"
          disabled={isSaving || !input.trim()}
          className="cursor-pointer px-3.5 py-2.5 rounded-xl bg-accent-500 text-white hover:bg-accent-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Add note"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-200 border-t-accent-500" />
        </div>
      ) : notes.length === 0 ? (
        <p className="text-center text-[12px] text-surface-400 py-8">No notes yet</p>
      ) : (
        <div className="space-y-1">
          {notes.map((note) => (
            <div key={note._id} className="group flex items-start gap-2.5 py-2 px-2 -mx-2 rounded-lg hover:bg-surface-50 transition-colors">
              <span className="mt-[7px] block h-1.5 w-1.5 rounded-full bg-accent-400 shrink-0" />
              <span className="flex-1 text-[13px] text-surface-600 leading-relaxed break-words">{note.text}</span>
              <button
                onClick={() => onDelete(note._id)}
                className="cursor-pointer mt-0.5 p-1 rounded-md text-surface-300 hover:text-danger-500 hover:bg-danger-400/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                aria-label="Delete note"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
