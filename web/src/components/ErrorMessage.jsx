export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-400/10">
        <svg className="h-5 w-5 text-danger-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.25a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm.75 5.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-[13px] font-medium text-surface-700">{message || "Something went wrong."}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer text-[13px] font-medium text-accent-600 underline-offset-2 hover:underline"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
