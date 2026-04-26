const STATUS_OPTIONS = [
  { value: 'all',       label: 'All' },
  { value: 'completed', label: 'Completed today' },
  { value: 'pending',   label: 'Pending today' },
];

const SORT_OPTIONS = [
  { value: 'default',       label: 'Default (newest first)' },
  { value: 'name',          label: 'Name (A-Z)' },
  { value: 'streak',        label: 'Streak (longest first)' },
  { value: 'lastCompleted', label: 'Last completed (recent first)' },
];

export default function HabitFilterBar({ filters, onChange }) {
  const isFiltered = filters.status !== 'all' || filters.sortBy !== 'default';
  const selectedSortLabel = SORT_OPTIONS.find(o => o.value === filters.sortBy)?.label || 'Default';

  return (
    <div className="space-y-3 mb-5">
      {/* Control row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1 border border-gray-150">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, status: opt.value })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer
                ${filters.status === opt.value
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <select
            value={filters.sortBy}
            onChange={e => onChange({ ...filters, sortBy: e.target.value })}
            className="text-xs font-medium border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700
              bg-white cursor-pointer transition-all duration-200
              hover:border-gray-300 hover:shadow-sm hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 focus:border-transparent
              appearance-none pr-7"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.25rem',
              paddingRight: '2rem'
            }}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Clear filters button */}
        {isFiltered && (
          <button
            onClick={() => onChange({ status: 'all', sortBy: 'default' })}
            title="Reset all filters and sorting"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-600 transition-all duration-200 hover:bg-red-100 hover:border-red-300 hover:text-red-700 active:scale-95 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Status line - shows active filters */}
      {isFiltered && (
        <div className="text-xs text-gray-500 px-1 py-0.5 bg-blue-50 rounded border border-blue-100 inline-block">
          <span>Showing {filters.status === 'all' ? 'all habits' : `${filters.status} habits`}</span>
          {filters.sortBy !== 'default' && (
            <span> · Sorted by {selectedSortLabel.split(' (')[0]}</span>
          )}
        </div>
      )}
    </div>
  );
}
