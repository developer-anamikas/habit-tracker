import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import HabitAnalyticsCard from "../components/HabitAnalyticsCard";
import AnalyticsRangePicker from "../components/AnalyticsRangePicker";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import NotesPanel from "../components/NotesPanel";
import { useHabits } from "../hooks/useHabits";
import { useNotes } from "../hooks/useNotes";
import {
  buildAnalyticsOverview,
  formatRangeLabel,
  getTodayKey,
  resolveRange,
} from "../utils/analytics";

function getHeadline(range, overview) {
  if (range.isIncomplete) return "Pick a custom range to see how your habits are performing.";
  if (!range.hasPastWindow) return "This range only contains future dates, so no analytics are counted yet.";
  if (overview.overallCompletion === null) return "Analytics stays honest about what actually counted.";
  return `You completed ${overview.overallCompletion}% of your scheduled habits ${range.label.toLowerCase()}.`;
}

function getSubcopy(range, overview) {
  if (range.isIncomplete) return "Choose both a start date and an end date to calculate completion insights.";
  if (!range.hasPastWindow) return "Your selected range is entirely in the future, so there is nothing to measure yet.";
  if (overview.totalScheduledDays === 0) return "This range has no scheduled habit days, so each habit is marked as Not scheduled instead of 0%.";
  return `${overview.totalCompletedDays} completed check-ins across ${overview.totalScheduledDays} scheduled opportunities.`;
}

function getInsightLine(range, overview) {
  if (range.isIncomplete) return "Select a complete time range and we will translate your history into clear consistency signals.";
  if (!range.hasPastWindow) return "Nothing has been scheduled in the past portion of this range yet, so we are waiting for real activity before scoring it.";
  if (overview.bestDay) return `You're most consistent on ${overview.bestDay.label}s with a ${overview.bestDay.percentage}% completion rate in this range.`;
  if (overview.totalScheduledDays > 0) return `You completed ${overview.totalCompletedDays} of ${overview.totalScheduledDays} scheduled habit check-ins in this range.`;
  return "No habits were scheduled here, so the dashboard avoids inventing a denominator.";
}

export default function AnalyticsPage() {
  const { habits, isLoading, error, fetchHabits } = useHabits();
  const { notes, isLoading: notesLoading, createNote, deleteNote } = useNotes();
  const { isDarkMode } = useTheme();
  const todayKey = getTodayKey();
  const [rangeType, setRangeType] = useState("week");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const range = resolveRange(rangeType, customStart, customEnd, todayKey);
  const overview = buildAnalyticsOverview(
    habits,
    range.isIncomplete || !range.hasPastWindow
      ? { ...range, effectiveStartKey: null, effectiveEndKey: null }
      : range,
    todayKey,
  );
  const motionKey = `${range.key}:${range.selectedStartKey || "none"}:${range.selectedEndKey || "none"}:${range.hasPastWindow}`;

  // Shared dark mode tokens
  const cardBg = isDarkMode ? '#1a1a2e' : 'white';
  const cardBorder = isDarkMode ? '#2d2d4e' : '#e5e7eb';
  const headingColor = isDarkMode ? '#e2e8f0' : '#1e293b';
  const subColor = isDarkMode ? '#94a3b8' : '#6b7280';
  const labelColor = isDarkMode ? '#64748b' : '#9ca3af';
  const innerBg = isDarkMode ? '#0f0f1a' : '#f7f7fb';
  const tableBorder = isDarkMode ? '#2d2d4e' : '#f1f5f9';
  const tableHover = isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc';

  function handleRangeChange(nextRange) {
    setRangeType(nextRange);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-accent-200 border-t-accent-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[980px] space-y-6">
      {/* TOP SECTION: Performance overview + range picker */}
      <section
        style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        className="space-y-4 rounded-[28px] p-4 shadow-[0_18px_40px_rgba(42,42,61,0.08)]"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_360px]">
          {/* Purple hero card — always gradient, no dark mode needed */}
          <div className="rounded-[28px] bg-gradient-to-br from-accent-600 via-accent-500 to-[#6f58ff] px-6 py-6 text-white shadow-[0_22px_42px_rgba(124,92,255,0.28)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
              Performance overview
            </p>
            <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-[32px] font-bold tracking-tight text-white">
                  {overview.overallCompletion === null ? "--" : `${overview.overallCompletion}%`}
                </h1>
                <p className="mt-2 text-[18px] font-semibold text-white">
                  {getHeadline(range, overview)}
                </p>
                <p className="mt-2 max-w-2xl text-[14px] leading-6 text-white/80">
                  {getSubcopy(range, overview)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Viewing</p>
                <p className="mt-1 text-[15px] font-semibold text-white">
                  {range.selectedStartKey && range.selectedEndKey
                    ? formatRangeLabel(range.selectedStartKey, range.selectedEndKey)
                    : "No range selected"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <HeroMetric label="Completed" value={`${overview.totalCompletedDays}`} />
              <HeroMetric label="Possible" value={`${overview.totalScheduledDays}`} />
              <HeroMetric label="Valid habits" value={`${overview.validHabitCount}`} />
            </div>
          </div>

          <AnalyticsRangePicker
            rangeType={rangeType}
            range={range}
            customStart={customStart}
            customEnd={customEnd}
            onRangeChange={handleRangeChange}
            onCustomStartChange={setCustomStart}
            onCustomEndChange={setCustomEnd}
          />
        </div>

        {!range.isIncomplete && habits.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              label="Overall completion"
              value={overview.overallCompletion === null ? "-- Not in range" : `${overview.overallCompletion}%`}
              helpText={
                overview.validHabitCount === 0
                  ? "Average is hidden until at least one habit is scheduled in this range."
                  : `${overview.validHabitCount} valid habit${overview.validHabitCount === 1 ? "" : "s"} included`
              }
              isDarkMode={isDarkMode}
              cardBg={cardBg}
              cardBorder={cardBorder}
              headingColor={headingColor}
              subColor={subColor}
            />
            <SummaryCard
              label="Completed vs possible"
              value={`${overview.totalCompletedDays}/${overview.totalScheduledDays}`}
              helpText="Counts only scheduled days up to today"
              isDarkMode={isDarkMode}
              cardBg={cardBg}
              cardBorder={cardBorder}
              headingColor={headingColor}
              subColor={subColor}
            />
            <SummaryCard
              label="Best day"
              value={overview.bestDay ? `${overview.bestDay.label} ${overview.bestDay.percentage}%` : "No data"}
              helpText={
                overview.bestDay
                  ? `${overview.bestDay.completed} of ${overview.bestDay.scheduled} scheduled check-ins completed`
                  : "No scheduled days in this range"
              }
              isDarkMode={isDarkMode}
              cardBg={cardBg}
              cardBorder={cardBorder}
              headingColor={headingColor}
              subColor={subColor}
            />
          </div>
        ) : null}
      </section>

      {error ? (
        <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }} className="rounded-2xl">
          <ErrorMessage
            title="Failed to load analytics"
            description="Check your connection or try loading your analytics again."
            type="network"
            onRetry={fetchHabits}
          />
        </div>
      ) : null}

      <div key={motionKey} className="animate-analytics-fade space-y-6">
        {range.isIncomplete ? (
          <EmptyState
            icon="analytics"
            title="Select a time range to view analytics"
            description="Choose both a start date and an end date to calculate completion insights."
          />
        ) : habits.length === 0 ? (
          <EmptyState
            icon="analytics"
            title="No habits to analyse"
            description="Create your first habit and this dashboard will start turning raw completion history into useful feedback."
            actionLabel="Go to My Habits"
            actionPath="/habits"
          />
        ) : (
          <>
            {/* Habit breakdown section */}
            <section
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              className="rounded-[24px] p-6 shadow-[0_14px_32px_rgba(42,42,61,0.08)]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p style={{ color: labelColor }} className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Habit breakdown
                  </p>
                  <h2 style={{ color: headingColor }} className="mt-1 text-[22px] font-semibold">
                    Behavior feedback, not just raw numbers
                  </h2>
                  <p style={{ color: subColor }} className="mt-2 text-[14px] leading-6">
                    {getInsightLine(range, overview)}
                  </p>
                  <HabitLegend isDarkMode={isDarkMode} subColor={subColor} innerBg={innerBg} />
                </div>

                {overview.bestHabit ? (
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-success-500/10 px-3.5 py-2 text-[12px] font-semibold text-success-600 shadow-sm shadow-success-500/10">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success-500 text-white">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21 12 18.75 15.75 21V4.5A2.25 2.25 0 0 0 13.5 2.25h-3A2.25 2.25 0 0 0 8.25 4.5V21Z" />
                      </svg>
                    </span>
                    <span>
                      Most consistent habit
                      <span className="block text-[13px] text-success-700">
                        {overview.bestHabit.name} ({overview.bestHabit.completionPercentage}%)
                      </span>
                    </span>
                  </div>
                ) : null}
              </div>

              {!range.hasPastWindow ? (
                <div className="mt-5">
                  <EmptyState
                    icon="analytics"
                    title="No past activity in this range"
                    description="Your selected range is entirely in the future."
                  />
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {overview.habits.map((habit) => (
                    <HabitAnalyticsCard key={habit.id} habit={habit} range={range} />
                  ))}
                </div>
              )}
            </section>

            {/* Optional details section */}
            <section
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              className="rounded-[24px] shadow-[0_14px_32px_rgba(42,42,61,0.08)]"
            >
              <button
                type="button"
                onClick={() => setIsDetailsOpen((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between p-6"
              >
                <div>
                  <p style={{ color: labelColor }} className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Optional details
                  </p>
                  <h2 style={{ color: headingColor }} className="mt-1 text-[18px] font-semibold">
                    {isDetailsOpen ? "Hide supporting data" : "View supporting data, insight, and notes"}
                  </h2>
                </div>
                <span
                  style={{ backgroundColor: isDarkMode ? '#2d2d4e' : 'white', color: subColor }}
                  className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${isDetailsOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>

              <div className={`grid overflow-hidden transition-all duration-300 ease-out ${isDetailsOpen ? "mt-0 max-h-[1200px] opacity-100 pb-6" : "mt-0 max-h-0 opacity-0"}`}>
                <div className="grid gap-4 px-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
                  {/* Table */}
                  <div style={{ backgroundColor: innerBg, border: `1px solid ${cardBorder}` }} className="rounded-[22px] p-5">
                    <div className="mb-4">
                      <p style={{ color: labelColor }} className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                        Supporting data
                      </p>
                      <h2 style={{ color: headingColor }} className="mt-1 text-[20px] font-semibold">
                        Range details by habit
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-[13px]">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${tableBorder}`, color: labelColor }}>
                            <th className="pb-3 font-medium">Habit</th>
                            <th className="pb-3 font-medium">Schedule</th>
                            <th className="pb-3 font-medium">Completed</th>
                            <th className="pb-3 font-medium">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overview.habits.map((habit) => (
                            <tr
                              key={habit.id}
                              style={{ borderBottom: `1px solid ${tableBorder}` }}
                              className={`transition-colors last:border-b-0 ${habit.completionPercentage === null ? "opacity-65" : ""}`}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = tableHover}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <td style={{ color: headingColor }} className="py-3 pr-3 font-medium">{habit.name}</td>
                              <td style={{ color: subColor }} className="py-3 pr-3">{habit.scheduleLabel}</td>
                              <td style={{ color: subColor }} className="py-3 pr-3">
                                {habit.totalScheduledDays === 0
                                  ? "-- Not in range"
                                  : `${habit.completedScheduledDays}/${habit.totalScheduledDays}`}
                              </td>
                              <td className={`py-3 font-semibold ${habit.tone.textClass}`}>
                                {habit.completionPercentage === null ? "-- Not in range" : `${habit.completionPercentage}%`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Insight + Notes */}
                  <div className="space-y-4">
                    <InsightCard
                      title={overview.bestDay ? `You're strongest on ${overview.bestDay.label}s` : "Consistency insight"}
                      metric={overview.bestDay ? `${overview.bestDay.percentage}% completion` : "Waiting for signal"}
                      description={
                        overview.bestHabit
                          ? `${overview.bestHabit.name} is leading your habits right now. Keep that momentum and try to repeat what is working on your strongest days.`
                          : "Once a habit is scheduled in this range, this panel will turn your patterns into an actionable takeaway."
                      }
                    />
                    <NotesPanel
                      notes={notes}
                      isLoading={notesLoading}
                      onCreate={createNote}
                      onDelete={deleteNote}
                      title={`Notes for ${range.label.toLowerCase()}`}
                      description="Capture what helped, what slipped, or what to try next."
                      placeholder="Add a note about this range..."
                      emptyMessage="No notes for this range yet"
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function HeroMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">{label}</p>
      <p className="mt-1 text-[20px] font-semibold text-white">{value}</p>
    </div>
  );
}

function SummaryCard({ label, value, helpText, isDarkMode, cardBg, cardBorder, headingColor, subColor }) {
  return (
    <div
      style={{ backgroundColor: isDarkMode ? '#0f0f1a' : 'white', border: `1px solid ${cardBorder}` }}
      className="rounded-[20px] p-5 shadow-[0_12px_28px_rgba(42,42,61,0.07)]"
    >
      <p style={{ color: isDarkMode ? '#64748b' : '#9ca3af' }} className="text-[11px] font-semibold uppercase tracking-[0.18em]">
        {label}
      </p>
      <div style={{ color: headingColor }} className="mt-3 text-[28px] font-bold tracking-tight">{value}</div>
      <p style={{ color: subColor }} className="mt-2 text-[13px] leading-5">{helpText}</p>
    </div>
  );
}

function InsightCard({ title, metric, description }) {
  return (
    <div className="rounded-[22px] bg-gradient-to-br from-accent-500 to-accent-700 p-5 text-white shadow-[0_18px_38px_rgba(124,92,255,0.22)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Insight</p>
      <div className="mt-3 flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v.01M8.25 9.75a3.75 3.75 0 1 1 7.5 0c0 1.298-.638 2.447-1.617 3.127-.57.396-.883 1.052-.883 1.746V15" />
          </svg>
        </span>
        <div>
          <h3 className="text-[20px] font-semibold text-white">{title}</h3>
          {metric ? <p className="mt-1 text-[15px] font-semibold text-white/90">{metric}</p> : null}
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-6 text-white/80">{description}</p>
    </div>
  );
}

function HabitLegend({ isDarkMode, subColor, innerBg }) {
  return (
    <div style={{ color: subColor }} className="mt-4 flex flex-wrap gap-3 text-[12px]">
      <LegendItem label="Completed" dotClass="border-accent-500 bg-accent-500" bg={innerBg} />
      <LegendItem label="Missed" dotClass="border-danger-400/50 bg-danger-400/10" bg={innerBg} />
      <LegendItem label="Future" dotClass="border-surface-300 bg-surface-200/50" bg={innerBg} />
    </div>
  );
}

function LegendItem({ label, dotClass, bg }) {
  return (
    <span style={{ backgroundColor: bg }} className="inline-flex items-center gap-2 rounded-full px-2.5 py-1">
      <span className={`h-2.5 w-2.5 rounded-full border ${dotClass}`} />
      {label}
    </span>
  );
}