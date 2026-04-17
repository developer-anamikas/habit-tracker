import { useAuth } from "../context/AuthContext";

export default function TopNav() {
  const { user, signout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="fixed top-0 left-[220px] right-0 h-14 bg-white/80 backdrop-blur-md border-b border-surface-200 flex items-center justify-between px-6 z-10">
      <div />
      <div className="flex items-center gap-3">
        {user?.email && (
          <span className="text-[12px] text-surface-400 hidden sm:block">{user.email}</span>
        )}
        <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-[12px] font-bold">
          {initials}
        </div>
        <button
          onClick={signout}
          className="cursor-pointer text-[12px] text-surface-400 hover:text-surface-600 transition-colors px-2 py-1.5 rounded-md hover:bg-surface-100"
          aria-label="Sign out"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
