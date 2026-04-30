import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function TopNav() {
  const { user, signout } = useAuth();
  const { isDarkMode } = useTheme();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header style={{
      backgroundColor: isDarkMode ? 'rgba(15, 15, 26, 0.92)' : 'rgba(255,255,255,0.9)',
      borderBottom: `1px solid ${isDarkMode ? '#2d2d4e' : '#e5e7eb'}`,
    }} className="fixed top-0 left-[220px] right-0 h-14 backdrop-blur-md flex items-center justify-between px-6 z-10">
      <div />
      <div className="flex items-center gap-3">
        {user?.email && (
          <span style={{ color: isDarkMode ? '#94a3b8' : '#6b7280' }} className="text-[12px] hidden sm:block">
            {user.email}
          </span>
        )}
        <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-[12px] font-bold">
          {initials}
        </div>
        <button
          onClick={signout}
          style={{
            color: isDarkMode ? '#94a3b8' : '#6b7280',
            backgroundColor: 'transparent',
          }}
          className="cursor-pointer text-[12px] font-medium transition-colors px-2 py-1.5 rounded-md hover:bg-white/10"
          aria-label="Sign out"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}