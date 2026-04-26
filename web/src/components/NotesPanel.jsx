import { useState } from "react";

export default function NotesPanel({
  notes,
  isLoading,
  onCreate,
  onDelete,
  title = "Quick Notes",
  description = "",
  placeholder = "Jot something down...",
  emptyMessage = "No notes yet",
}) {
  const [input, setInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleAdd(event) {
    event.preventDefault();
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
    <div className="rounded-2xl border border-surface-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-[14px] font-semibold text-surface-800">
          <svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-[12px] leading-5 text-surface-400">{description}</p>
        ) : null}
      </div>

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-surface-200 px-3.5 py-2.5 text-[13px] text-surface-700 placeholder-surface-400 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
        />
        <button
          type="submit"
          disabled={isSaving || !input.trim()}
          className="cursor-pointer rounded-xl bg-accent-500 px-3.5 py-2.5 text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Add note"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-200 border-t-accent-500" />
        </div>
      ) : notes.length === 0 ? (
        <p className="py-8 text-center text-[12px] text-surface-400">{emptyMessage}</p>
      ) : (
        <div className="space-y-1">
          {notes.map((note) => (
            <div key={note._id} className="group -mx-2 flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-surface-50">
              <span className="mt-[7px] block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
              <span className="flex-1 break-words text-[13px] leading-relaxed text-surface-600">{note.text}</span>
              <button
                onClick={() => onDelete(note._id)}
                className="mt-0.5 shrink-0 rounded-md p-1 text-surface-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-danger-400/10 hover:text-danger-500"
                aria-label="Delete note"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
