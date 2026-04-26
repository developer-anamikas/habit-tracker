// Server-side filtering and sorting helpers — mirrors frontend logic

const getTodayName = () =>
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];

const getTodayISO = () => new Date().toISOString().split('T')[0];

export function isCompletedToday(habit) {
  return habit.completions?.includes(getTodayISO()) ?? false;
}

export function isPendingToday(habit) {
  return habit.schedule.includes(getTodayName()) && !isCompletedToday(habit);
}

// Streak = consecutive completed days backwards from yesterday
export function calcStreak(habit) {
  if (!habit.completions?.length) return 0;
  const sorted = [...habit.completions].sort().reverse();
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - 1); // start from yesterday
  let streak = 0;

  for (let i = 0; i < 90; i++) { // cap at 90 days lookback
    const dateStr = cursor.toISOString().split('T')[0];
    const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][cursor.getDay()];
    const wasScheduled = habit.schedule.includes(dayName);

    if (wasScheduled) {
      if (sorted.includes(dateStr)) streak++;
      else break; // missed a scheduled day — streak ends
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getLastCompleted(habit) {
  if (!habit.completions?.length) return null;
  return [...habit.completions].sort().reverse()[0]; // most recent ISO string
}

// Validate query parameters
export function validateFilterSort({ status, sortBy }) {
  const validStatus = ['all', 'completed', 'pending'];
  const validSort = ['default', 'name', 'streak', 'lastCompleted'];

  if (status && !validStatus.includes(status)) {
    return { valid: false, error: `Invalid status. Must be one of: ${validStatus.join(', ')}` };
  }

  if (sortBy && !validSort.includes(sortBy)) {
    return { valid: false, error: `Invalid sortBy. Must be one of: ${validSort.join(', ')}` };
  }

  return { valid: true };
}

// Master filter + sort function
export function filterAndSort(habits, { status = 'all', sortBy = 'default' }) {
  let result = [...habits];

  // Filter
  if (status === 'completed') result = result.filter(isCompletedToday);
  if (status === 'pending')   result = result.filter(isPendingToday);
  // status === 'all' → no filter

  // Sort
  if (sortBy === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'streak') {
    result.sort((a, b) => calcStreak(b) - calcStreak(a)); // highest first
  } else if (sortBy === 'lastCompleted') {
    result.sort((a, b) => {
      const aLast = getLastCompleted(a) ?? '0000-00-00';
      const bLast = getLastCompleted(b) ?? '0000-00-00';
      return bLast.localeCompare(aLast); // most recent first
    });
  }
  // sortBy === 'default' → keep server order (createdAt desc, already applied in route)

  return result;
}
