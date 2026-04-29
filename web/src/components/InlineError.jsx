export default function InlineError({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-2 rounded-xl border border-danger-400/20 bg-danger-400/10 px-3 py-2.5">
      <svg className="mt-0.5 h-4 w-4 shrink-0 text-danger-400" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm.75 5.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
      </svg>
      <p className="text-[13px] leading-5 text-danger-500">{message}</p>
    </div>
  );
}
