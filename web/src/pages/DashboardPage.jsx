import { useNavigate } from "react-router-dom";
import { useHabits } from "../hooks/useHabits";

export default function DashboardPage() {
  const { habits, isLoading } = useHabits();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => (h.completions || []).includes(today)).length;
  const completionPct = totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-surface-800">Dashboard</h1>
        <p className="text-[13px] text-surface-400 mt-1">Your habits at a glance</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Habits" value={totalHabits} icon={TotalIcon} />
        <StatCard label="Done Today" value={completedToday} icon={DoneIcon} />
        <StatCard label="Completion" value={`${completionPct}%`} icon={PctIcon} />
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-accent-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h2 className="text-[16px] font-semibold text-surface-800 mb-1">Ready to build your routine?</h2>
        <p className="text-[13px] text-surface-400 mb-5">Track your daily habits and build lasting consistency.</p>
        <button
          onClick={() => navigate("/habits")}
          className="cursor-pointer bg-accent-500 hover:bg-accent-600 text-white text-[13px] font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-accent-200"
        >
          Track my habits
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
        <Icon />
      </div>
      <div>
        <p className="text-[20px] font-bold text-surface-800 leading-tight">{value}</p>
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
