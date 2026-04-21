const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function getTodayKey(now = new Date()) {
  return formatDateKey(now);
}

export function formatDateKey(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

export function addDays(dateKey, amount) {
  const date = parseDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + amount);
  return formatDateKey(date);
}

export function getWeekdayName(dateKey) {
  return WEEKDAY_NAMES[parseDateKey(dateKey).getUTCDay()];
}

export function formatShortDate(dateKey) {
  return MONTH_DAY_FORMATTER.format(parseDateKey(dateKey));
}

export function formatLongDate(dateKey) {
  return FULL_DATE_FORMATTER.format(parseDateKey(dateKey));
}

export function formatRangeLabel(startKey, endKey) {
  if (!startKey || !endKey) {
    return "";
  }

  return `${formatShortDate(startKey)} -> ${formatShortDate(endKey)}`;
}

export function formatSchedule(schedule = []) {
  if (schedule.length === 0) {
    return "No schedule";
  }

  return schedule
    .slice()
    .sort((left, right) => WEEKDAY_ORDER.indexOf(left) - WEEKDAY_ORDER.indexOf(right))
    .join(" | ");
}

function getLastDayOfMonth(dateKey) {
  const date = parseDateKey(dateKey);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));

  return formatDateKey(lastDay);
}

export function listDateKeys(startKey, endKey) {
  if (!startKey || !endKey || startKey > endKey) {
    return [];
  }

  const dateKeys = [];
  let cursor = startKey;

  while (cursor <= endKey) {
    dateKeys.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return dateKeys;
}

export function resolveRange(rangeType, customStart, customEnd, todayKey = getTodayKey()) {
  if (rangeType === "week") {
    const today = parseDateKey(todayKey);
    const offsetFromMonday = (today.getUTCDay() + 6) % 7;
    const startKey = addDays(todayKey, -offsetFromMonday);
    const timelineEndKey = addDays(startKey, 6);

    return {
      key: "week",
      label: "This week",
      selectedStartKey: startKey,
      selectedEndKey: todayKey,
      effectiveStartKey: startKey,
      effectiveEndKey: todayKey,
      timelineStartKey: startKey,
      timelineEndKey,
      isIncomplete: false,
      hasPastWindow: true,
      hasFutureInTimeline: timelineEndKey > todayKey,
    };
  }

  if (rangeType === "month") {
    const startKey = `${todayKey.slice(0, 7)}-01`;
    const timelineEndKey = getLastDayOfMonth(todayKey);

    return {
      key: "month",
      label: "This month",
      selectedStartKey: startKey,
      selectedEndKey: todayKey,
      effectiveStartKey: startKey,
      effectiveEndKey: todayKey,
      timelineStartKey: startKey,
      timelineEndKey,
      isIncomplete: false,
      hasPastWindow: true,
      hasFutureInTimeline: timelineEndKey > todayKey,
    };
  }

  if (!customStart || !customEnd) {
    return {
      key: "custom",
      label: "Custom range",
      selectedStartKey: customStart || null,
      selectedEndKey: customEnd || null,
      effectiveStartKey: null,
      effectiveEndKey: null,
      timelineStartKey: customStart || null,
      timelineEndKey: customEnd || null,
      isIncomplete: true,
      hasPastWindow: false,
      hasFutureInTimeline: false,
    };
  }

  const sortedStart = customStart <= customEnd ? customStart : customEnd;
  const sortedEnd = customStart <= customEnd ? customEnd : customStart;
  const effectiveEndKey = sortedEnd > todayKey ? todayKey : sortedEnd;
  const hasPastWindow = sortedStart <= todayKey;

  return {
    key: "custom",
    label: "Custom range",
    selectedStartKey: sortedStart,
    selectedEndKey: sortedEnd,
    effectiveStartKey: hasPastWindow ? sortedStart : null,
    effectiveEndKey: hasPastWindow ? effectiveEndKey : null,
    timelineStartKey: sortedStart,
    timelineEndKey: sortedEnd,
    isIncomplete: false,
    hasPastWindow,
    hasFutureInTimeline: sortedEnd > todayKey,
  };
}

export function isScheduledOnDate(schedule = [], dateKey) {
  return schedule.includes(getWeekdayName(dateKey));
}

export function getPerformanceTone(percentage) {
  if (percentage === null) {
    return {
      textClass: "text-surface-400",
      barClass: "bg-surface-300",
      badgeClass: "border-surface-200 bg-surface-100 text-surface-500",
      label: "Not scheduled",
    };
  }

  if (percentage >= 75) {
    return {
      textClass: "text-success-600",
      barClass: "bg-success-500",
      badgeClass: "border-success-500/20 bg-success-500/10 text-success-600",
      label: "Strong",
    };
  }

  if (percentage >= 40) {
    return {
      textClass: "text-amber-600",
      barClass: "bg-amber-500",
      badgeClass: "border-amber-500/20 bg-amber-500/10 text-amber-600",
      label: "Moderate",
    };
  }

  return {
    textClass: "text-danger-600",
    barClass: "bg-danger-500",
    badgeClass: "border-danger-500/20 bg-danger-500/10 text-danger-600",
    label: "Needs attention",
  };
}

export function buildHabitAnalytics(habit, range, todayKey = getTodayKey()) {
  const schedule = habit.schedule || [];
  const completionSet = new Set((habit.completions || []).filter((dateKey) => dateKey <= todayKey));
  const effectiveDates = listDateKeys(range.effectiveStartKey, range.effectiveEndKey);
  const scheduledDates = effectiveDates.filter((dateKey) => isScheduledOnDate(schedule, dateKey));
  const completedScheduledDates = scheduledDates.filter((dateKey) => completionSet.has(dateKey));
  const completionPercentage = scheduledDates.length
    ? Math.round((completedScheduledDates.length / scheduledDates.length) * 100)
    : null;
  const timelineDates = listDateKeys(range.timelineStartKey, range.timelineEndKey);
  const tone = getPerformanceTone(completionPercentage);

  return {
    id: habit._id,
    name: habit.name,
    goal: habit.goal || "",
    schedule,
    scheduleLabel: formatSchedule(schedule),
    streak: getScheduledStreak(schedule, completionSet, todayKey),
    totalScheduledDays: scheduledDates.length,
    completedScheduledDays: completedScheduledDates.length,
    completionPercentage,
    tone,
    timeline: timelineDates.map((dateKey) => {
      const isScheduled = isScheduledOnDate(schedule, dateKey);
      const isCompleted = completionSet.has(dateKey);
      const isFuture = dateKey > todayKey;
      const isToday = dateKey === todayKey;

      return {
        dateKey,
        dayNumber: parseDateKey(dateKey).getUTCDate(),
        shortLabel: getWeekdayName(dateKey).slice(0, 2),
        weekdayLabel: getWeekdayName(dateKey),
        isScheduled,
        isCompleted,
        isFuture,
        isToday,
        isCounted:
          range.effectiveStartKey !== null &&
          range.effectiveEndKey !== null &&
          dateKey >= range.effectiveStartKey &&
          dateKey <= range.effectiveEndKey,
      };
    }),
  };
}

export function buildAnalyticsOverview(habits, range, todayKey = getTodayKey()) {
  const habitStats = habits.map((habit) => buildHabitAnalytics(habit, range, todayKey));
  const validHabits = habitStats.filter((habit) => habit.completionPercentage !== null);
  const totalCompletedDays = habitStats.reduce((sum, habit) => sum + habit.completedScheduledDays, 0);
  const totalScheduledDays = habitStats.reduce((sum, habit) => sum + habit.totalScheduledDays, 0);
  const overallCompletion = validHabits.length
    ? Math.round(
        validHabits.reduce((sum, habit) => sum + habit.completionPercentage, 0) /
          validHabits.length,
      )
    : null;
  const bestHabit = validHabits
    .slice()
    .sort(
      (left, right) =>
        right.completionPercentage - left.completionPercentage ||
        right.completedScheduledDays - left.completedScheduledDays,
    )[0] || null;
  const bestDay = getBestDayInsight(habits, range, todayKey);

  return {
    habits: habitStats,
    validHabitCount: validHabits.length,
    overallCompletion,
    totalCompletedDays,
    totalScheduledDays,
    bestHabit,
    bestDay,
  };
}

function getScheduledStreak(schedule, completionSet, todayKey) {
  if (!schedule || schedule.length === 0) {
    return 0;
  }

  let cursor = todayKey;
  let streak = 0;
  let inspectedScheduledDay = false;

  for (let step = 0; step < 366; step += 1) {
    if (isScheduledOnDate(schedule, cursor)) {
      inspectedScheduledDay = true;

      if (!completionSet.has(cursor)) {
        break;
      }

      streak += 1;
    }

    cursor = addDays(cursor, -1);
  }

  return inspectedScheduledDay ? streak : 0;
}

function getBestDayInsight(habits, range, todayKey) {
  const counts = WEEKDAY_ORDER.map((label) => ({
    label,
    completed: 0,
    scheduled: 0,
  }));
  const effectiveDates = listDateKeys(range.effectiveStartKey, range.effectiveEndKey);

  habits.forEach((habit) => {
    const completionSet = new Set((habit.completions || []).filter((dateKey) => dateKey <= todayKey));

    effectiveDates.forEach((dateKey) => {
      const weekday = getWeekdayName(dateKey);
      const bucket = counts.find((entry) => entry.label === weekday);

      if (!bucket || !isScheduledOnDate(habit.schedule || [], dateKey)) {
        return;
      }

      bucket.scheduled += 1;

      if (completionSet.has(dateKey)) {
        bucket.completed += 1;
      }
    });
  });

  const validDay = counts
    .filter((entry) => entry.scheduled > 0)
    .sort(
      (left, right) =>
        right.completed / right.scheduled - left.completed / left.scheduled ||
        right.completed - left.completed,
    )[0];

  if (!validDay) {
    return null;
  }

  return {
    label: validDay.label,
    percentage: Math.round((validDay.completed / validDay.scheduled) * 100),
    completed: validDay.completed,
    scheduled: validDay.scheduled,
  };
}
