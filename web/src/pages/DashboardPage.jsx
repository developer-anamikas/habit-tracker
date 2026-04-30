import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import { useHabits } from "../hooks/useHabits";
import { useTheme } from "../context/ThemeContext";

export default function DashboardPage() {
  const { habits, isLoading, error, fetchHabits } = useHabits();
  const { isDarkMode } = useTheme();

  const today = new Date().toISOString().split("T")[0];
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => (h.completions || []).includes(today)).length;
  const completionPct = totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0;

  const cardBg = isDarkMode ? '#1a1a2e' : 'white';
  const cardBorder = isDarkMode ? '#2d2d4e' : '#e5e7eb';
  const headingColor = isDarkMode ? '#e2e8f0' : '#1e293b';
  const subColor = isDarkMode ? '#64748b' : '#9ca3af';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-accent-200 border-t-accent-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }} className="rounded-2xl">
        <ErrorMessage
          title="Failed to load dashboard"
          description="Check your connection or try loading the dashboard again."
          type="network"
          onRetry={fetchHabits}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 style={{ color: headingColor }} className="text-xl font-bold">Dashboard</h1>
        <p style={{ color: subColor }} className="text-[13px] mt-1">Your habits at a glance</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Habits" value={totalHabits} icon={TotalIcon} cardBg={cardBg} cardBorder={cardBorder} headingColor={headingColor} />
        <StatCard label="Done Today" value={completedToday} icon={DoneIcon} cardBg={cardBg} cardBorder={cardBorder} headingColor={headingColor} />
        <StatCard label="Completion" value={`${completionPct}%`} icon={PctIcon} cardBg={cardBg} cardBorder={cardBorder} headingColor={headingColor} />
      </div>

      {habits.length === 0 ? (
        <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }} className="rounded-2xl">
          <EmptyState
            icon="habits"
            title="Ready to build your routine?"
            description="Track your daily habits and build lasting consistency."
            actionLabel="Track my habits"
            actionPath="/habits"
          />
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, cardBg, cardBorder, headingColor }) {
  return (
    <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }} className="rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
        <Icon />
      </div>
      <div>
        <p style={{ color: headingColor }} className="text-[20px] font-bold leading-tight">{value}</p>
        <p className="text-[11px] text-surface-400">{label}</p>
      </div>
    </div>
  );
}

function TotalIcon() {
  return (
    <svg className="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
    </svg>
  );
}

function DoneIcon() {
  return (
    <svg className="w-5 h-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function PctIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
    </svg>
  );
}