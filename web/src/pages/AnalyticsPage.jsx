import { useState } from "react";
import HabitAnalyticsCard from "../components/HabitAnalyticsCard";
import AnalyticsRangePicker from "../components/AnalyticsRangePicker";
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
  if (range.isIncomplete) {
    return "Pick a custom range to see how your habits are performing.";
  }

  if (!range.hasPastWindow) {
    return "This range only contains future dates, so no analytics are counted yet.";
  }

  if (overview.overallCompletion === null) {
    return "Analytics stays honest about what actually counted.";
  }

  return `You completed ${overview.overallCompletion}% of your scheduled habits ${range.label.toLowerCase()}.`;
}

function getSubcopy(range, overview) {
  if (range.isIncomplete) {
    return "Choose both a start date and an end date to calculate completion insights.";
  }

  if (!range.hasPastWindow) {
    return "Your selected range is entirely in the future, so there is nothing to measure yet.";
  }

  if (overview.totalScheduledDays === 0) {
    return "This range has no scheduled habit days, so each habit is marked as Not scheduled instead of 0%.";
  }

  return `${overview.totalCompletedDays} completed check-ins across ${overview.totalScheduledDays} scheduled opportunities.`;
}

export default function AnalyticsPage() {
  const { habits, isLoading, error, toggleCompletion } = useHabits();
  const { notes, isLoading: notesLoading, createNote, deleteNote } = useNotes();
  const todayKey = getTodayKey();
  const [rangeType, setRangeType] = useState("week");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const range = resolveRange(rangeType, customStart, customEnd, todayKey);
  const overview = buildAnalyticsOverview(
    habits,
    range.isIncomplete || !range.hasPastWindow
      ? {
          ...range,
          effectiveStartKey: null,
          effectiveEndKey: null,
        }
      : range,
    todayKey,
  );

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
      <section className="rounded-[24px] border border-surface-200 bg-white px-6 py-6 shadow-sm shadow-surface-200/70">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-500">
          Analytics
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[30px] font-bold tracking-tight text-surface-900">
              {getHeadline(range, overview)}
            </h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-surface-500">
              {getSubcopy(range, overview)}
            </p>
          </div>

          <div className="rounded-2xl bg-surface-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-400">
              Viewing
            </p>
            <p className="mt-1 text-[15px] font-semibold text-surface-800">
              {range.selectedStartKey && range.selectedEndKey
                ? formatRangeLabel(range.selectedStartKey, range.selectedEndKey)
                : "No range selected"}
            </p>
          </div>
        </div>
      </section>

      <AnalyticsRangePicker
        rangeType={rangeType}
        range={range}
        customStart={customStart}
        customEnd={customEnd}
        onRangeChange={handleRangeChange}
        onCustomStartChange={setCustomStart}
        onCustomEndChange={setCustomEnd}
      />

      {error && (
        <div className="rounded-2xl border border-danger-500/20 bg-danger-500/10 px-4 py-3 text-[13px] text-danger-600">
          {error}
        </div>
      )}

      {range.isIncomplete ? (
        <EmptyState
          title="Select a range to view analytics"
          description="Choose both a start date and an end date to calculate completion insights."
        />
      ) : habits.length === 0 ? (
        <EmptyState
          title="No habits found"
          description="Create your first habit to unlock completion analytics and consistency trends."
        />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              label="Overall completion"
              value={overview.overallCompletion === null ? "Not scheduled" : `${overview.overallCompletion}%`}
              helpText={
                overview.validHabitCount === 0
                  ? "Average is hidden until at least one habit is scheduled in this range."
                  : `${overview.validHabitCount} valid habit${overview.validHabitCount === 1 ? "" : "s"} included`
              }
            />
            <SummaryCard
              label="Completed vs possible"
              value={`${overview.totalCompletedDays}/${overview.totalScheduledDays}`}
              helpText="Counts only scheduled days up to today"
            />
            <SummaryCard
              label="Best day"
              value={overview.bestDay ? `${overview.bestDay.label} ${overview.bestDay.percentage}%` : "No data"}
              helpText={
                overview.bestDay
                  ? `${overview.bestDay.completed} of ${overview.bestDay.scheduled} scheduled check-ins completed`
                  : "No scheduled days in this range"
              }
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-surface-400">
                  Habit breakdown
                </p>
                <h2 className="mt-1 text-[20px] font-semibold text-surface-900">
                  Performance by habit
                </h2>
              </div>

              {overview.bestHabit && (
                <div className="hidden rounded-full border border-success-500/20 bg-success-500/10 px-3 py-1.5 text-[12px] font-medium text-success-600 md:inline-flex">
                  Best performer: {overview.bestHabit.name}
                </div>
              )}
            </div>

            {!range.hasPastWindow ? (
              <EmptyState
                title="No activity in this range"
                description="The selected custom range is entirely in the future, so there are no valid days to measure yet."
              />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {overview.habits.map((habit) => (
                  <HabitAnalyticsCard
                    key={habit.id}
                    habit={habit}
                    rangeType={rangeType}
                    onToggleToday={toggleCompletion}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
            <div className="rounded-[20px] border border-surface-200 bg-white p-5 shadow-sm shadow-surface-200/60">
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-surface-400">
                  Detail view
                </p>
                <h2 className="mt-1 text-[20px] font-semibold text-surface-900">
                  Supporting data
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-surface-100 text-surface-400">
                      <th className="pb-3 font-medium">Habit</th>
                      <th className="pb-3 font-medium">Schedule</th>
                      <th className="pb-3 font-medium">Completed</th>
                      <th className="pb-3 font-medium">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.habits.map((habit) => (
                      <tr key={habit.id} className="border-b border-surface-100 last:border-b-0">
                        <td className="py-3 pr-3 font-medium text-surface-700">{habit.name}</td>
                        <td className="py-3 pr-3 text-surface-500">{habit.scheduleLabel}</td>
                        <td className="py-3 pr-3 text-surface-500">
                          {habit.totalScheduledDays === 0
                            ? "Not scheduled"
                            : `${habit.completedScheduledDays}/${habit.totalScheduledDays}`}
                        </td>
                        <td className={`py-3 font-semibold ${habit.tone.textClass}`}>
                          {habit.completionPercentage === null
                            ? "Not scheduled"
                            : `${habit.completionPercentage}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <InsightCard
                title="Consistency insight"
                description={
                  overview.bestHabit
                    ? `${overview.bestHabit.name} is currently your most consistent habit in this range.`
                    : "Once a habit is scheduled in this range, its consistency insight will appear here."
                }
              />
              <NotesPanel
                notes={notes}
                isLoading={notesLoading}
                onCreate={createNote}
                onDelete={deleteNote}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, helpText }) {
  return (
    <div className="rounded-[20px] border border-surface-200 bg-white p-5 shadow-sm shadow-surface-200/60">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-surface-400">
        {label}
      </p>
      <div className="mt-3 text-[28px] font-bold tracking-tight text-surface-900">{value}</div>
      <p className="mt-2 text-[13px] leading-5 text-surface-500">{helpText}</p>
    </div>
  );
}

function InsightCard({ title, description }) {
  return (
    <div className="rounded-[20px] border border-surface-200 bg-white p-5 shadow-sm shadow-surface-200/60">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-500">
        Insight
      </p>
      <h3 className="mt-2 text-[18px] font-semibold text-surface-900">{title}</h3>
      <p className="mt-2 text-[13px] leading-6 text-surface-500">{description}</p>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-[20px] border border-dashed border-surface-300 bg-white px-6 py-14 text-center shadow-sm shadow-surface-200/40">
      <h2 className="text-[18px] font-semibold text-surface-800">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-[13px] leading-6 text-surface-500">
        {description}
      </p>
    </div>
  );
}
