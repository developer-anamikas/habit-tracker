export default function ReminderAlert({ reminders, onClose, onCloseAll }) {
  return (
    <div className="fixed right-4 top-4 z-[100] w-80 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="mb-2 flex items-center justify-between rounded-xl border border-accent-200 bg-white px-3 py-2 shadow-lg shadow-accent-500/10">
        <span className="text-[12px] font-semibold text-surface-700">
          {reminders.length} reminder{reminders.length !== 1 ? "s" : ""}
        </span>
        <button
          type="button"
          onClick={onCloseAll}
          className="cursor-pointer rounded-lg px-2 py-1 text-[11px] font-medium text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {reminders.map((habit, index) => (
          <div
            key={habit._id}
            className="flex items-start gap-4 rounded-2xl border border-accent-200 bg-white p-4 shadow-xl shadow-accent-500/10"
            style={{ transform: `translateY(${index * 1}px)` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-surface-800">Time for your habit!</h3>
              <p className="mt-1 truncate text-sm text-surface-600">{habit.name}</p>
            </div>
            <button
              type="button"
              onClick={() => onClose(habit._id)}
              className="shrink-0 rounded-lg p-1 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
            >
              <span className="sr-only">Close {habit.name}</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
