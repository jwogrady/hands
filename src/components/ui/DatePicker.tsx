import { useState, useEffect, useRef } from 'react'

interface DatePickerProps {
  value: string // ISO date string (YYYY-MM-DD)
  onChange: (value: string) => void
  id?: string
  name?: string
  required?: boolean
  disabled?: boolean
  min?: string // ISO date string
  max?: string // ISO date string
  placeholder?: string
  className?: string
  label?: string
  monthYearOnly?: boolean // If true, only select month/year (sets day to 1st)
}

// Helper functions
const formatDate = (date: Date, monthYearOnly?: boolean): string => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  if (monthYearOnly) {
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`
}

const formatDateISO = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null
  const date = new Date(dateString + 'T00:00:00')
  return isNaN(date.getTime()) ? null : date
}

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

const subMonths = (date: Date, months: number): Date => {
  return addMonths(date, -months)
}

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const eachDayOfInterval = (start: Date, end: Date): Date[] => {
  const days: Date[] = []
  const current = new Date(start)
  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return days
}

type ViewMode = 'month' | 'year' | 'decade'

export function DatePicker({
  value,
  onChange,
  id,
  name,
  required = false,
  disabled = false,
  min,
  max,
  placeholder = 'Select date',
  className = '',
  label,
  monthYearOnly = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const initialDate = value ? parseDate(value) : new Date()
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate || new Date())
  const [displayValue, setDisplayValue] = useState(
    value && initialDate ? formatDate(initialDate, monthYearOnly) : ''
  )
  const [viewMode, setViewMode] = useState<ViewMode>(monthYearOnly ? 'year' : 'month')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      const parsed = parseDate(value)
      if (parsed) {
        setDisplayValue(formatDate(parsed, monthYearOnly))
        setCurrentMonth(parsed)
      }
    } else {
      setDisplayValue('')
    }
  }, [value, monthYearOnly])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setViewMode('month')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleDateSelect = (date: Date) => {
    // For month/year only mode, set day to 1st
    const dateToUse = monthYearOnly ? new Date(date.getFullYear(), date.getMonth(), 1) : date
    const dateString = formatDateISO(dateToUse)
    onChange(dateString)
    setIsOpen(false)
    setViewMode(monthYearOnly ? 'year' : 'month') // Reset view
  }

  const handleMonthSelectInMonthYearMode = (month: number) => {
    const newDate = new Date(currentMonth.getFullYear(), month, 1)
    handleDateSelect(newDate)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  const handlePrevYear = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (viewMode === 'year') {
        newDate.setFullYear(newDate.getFullYear() - 1)
      } else {
        // decade view
        newDate.setFullYear(newDate.getFullYear() - 10)
      }
      return newDate
    })
  }

  const handleNextYear = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (viewMode === 'year') {
        newDate.setFullYear(newDate.getFullYear() + 1)
      } else {
        // decade view
        newDate.setFullYear(newDate.getFullYear() + 10)
      }
      return newDate
    })
  }

  const handleMonthClick = () => {
    setViewMode('year')
  }

  const handleYearClick = () => {
    setViewMode('decade')
  }

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentMonth)
    newDate.setFullYear(year)
    setCurrentMonth(newDate)
    setViewMode('month')
  }

  const handleMonthSelect = (month: number) => {
    if (monthYearOnly) {
      // In month/year only mode, selecting a month completes the selection
      handleMonthSelectInMonthYearMode(month)
    } else {
      const newDate = new Date(currentMonth)
      newDate.setMonth(month)
      setCurrentMonth(newDate)
      setViewMode('month')
    }
  }

  const getDecadeYears = (): number[] => {
    const year = currentMonth.getFullYear()
    const startYear = Math.floor(year / 10) * 10
    return Array.from({ length: 12 }, (_, i) => startYear + i - 1)
  }

  const handleToday = () => {
    const today = new Date()
    handleDateSelect(today)
  }

  const handleClear = () => {
    onChange('')
    setIsOpen(false)
    setViewMode('month') // Reset to month view
  }

  const getCalendarDays = (): Date[] => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)

    // Get the first day of the calendar view (might be from previous month)
    const firstDay = new Date(monthStart)
    const dayOfWeek = firstDay.getDay()
    firstDay.setDate(firstDay.getDate() - dayOfWeek)

    // Get the last day of the calendar view (might be from next month)
    const lastDay = new Date(monthEnd)
    const lastDayOfWeek = lastDay.getDay()
    lastDay.setDate(lastDay.getDate() + (6 - lastDayOfWeek))

    return eachDayOfInterval(firstDay, lastDay)
  }

  const isDateDisabled = (date: Date): boolean => {
    if (min) {
      const minDate = parseDate(min)
      if (minDate) {
        minDate.setHours(0, 0, 0, 0)
        const checkDate = new Date(date)
        checkDate.setHours(0, 0, 0, 0)
        if (checkDate < minDate) return true
      }
    }
    if (max) {
      const maxDate = parseDate(max)
      if (maxDate) {
        maxDate.setHours(23, 59, 59, 999)
        const checkDate = new Date(date)
        checkDate.setHours(23, 59, 59, 999)
        if (checkDate > maxDate) return true
      }
    }
    return false
  }

  const calendarDays = getCalendarDays()
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const selectedDate = value ? parseDate(value) : null
  const today = new Date()

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input type="hidden" id={id} name={name} value={value} required={required} />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-left rounded-md border border-gray-300 shadow-sm
            bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${value ? 'text-gray-900' : 'text-gray-500'}
          `}
        >
          <div className="flex items-center justify-between">
            <span>{displayValue || placeholder}</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={viewMode === 'month' ? handlePrevMonth : handlePrevYear}
                className="p-1.5 hover:bg-blue-100 rounded-md transition-colors cursor-pointer border border-transparent hover:border-blue-300"
                title={viewMode === 'month' ? 'Previous month' : 'Previous year'}
              >
                <svg
                  className="w-5 h-5 text-gray-700 hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                {viewMode === 'month' && (
                  <>
                    <button
                      type="button"
                      onClick={handleYearClick}
                      className="px-2 py-1 text-lg font-semibold text-gray-900 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                      title="Click to select year"
                    >
                      {currentMonth.getFullYear()}
                      <svg
                        className="inline-block w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleMonthClick}
                      className="px-2 py-1 text-lg font-semibold text-gray-900 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                      title="Click to select month"
                    >
                      {monthNames[currentMonth.getMonth()]}
                      <svg
                        className="inline-block w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </>
                )}
                {viewMode === 'year' && (
                  <button
                    type="button"
                    onClick={handleYearClick}
                    className="px-2 py-1 text-lg font-semibold text-gray-900 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                    title="Click to select year range"
                  >
                    {currentMonth.getFullYear()}
                    <svg
                      className="inline-block w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
                {viewMode === 'decade' && (
                  <div className="px-2 py-1 text-lg font-semibold text-gray-900">
                    {Math.floor(currentMonth.getFullYear() / 10) * 10} -{' '}
                    {Math.floor(currentMonth.getFullYear() / 10) * 10 + 9}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={viewMode === 'month' ? handleNextMonth : handleNextYear}
                className="p-1.5 hover:bg-blue-100 rounded-md transition-colors cursor-pointer border border-transparent hover:border-blue-300"
                title={viewMode === 'month' ? 'Next month' : 'Next year'}
              >
                <svg
                  className="w-5 h-5 text-gray-700 hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Month View */}
            {viewMode === 'month' && !monthYearOnly && (
              <>
                {/* Week day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const isTodayDate = isSameDay(day, today)
                    const disabled = isDateDisabled(day)

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => !disabled && handleDateSelect(day)}
                        disabled={disabled}
                        className={`
                          h-9 rounded-md text-sm transition-colors
                          ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                          ${isSelected ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-100'}
                          ${isTodayDate && !isSelected ? 'bg-blue-50 font-medium' : ''}
                          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {day.getDate()}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {/* Month View for month/year only mode - shows months directly */}
            {viewMode === 'month' && monthYearOnly && (
              <div className="grid grid-cols-3 gap-2">
                {monthNames.map((month, idx) => {
                  const isSelected =
                    selectedDate &&
                    selectedDate.getMonth() === idx &&
                    selectedDate.getFullYear() === currentMonth.getFullYear()

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleMonthSelectInMonthYearMode(idx)}
                      className={`
                        h-12 rounded-md text-sm font-medium transition-all cursor-pointer
                        ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-900 hover:bg-blue-100 hover:border-blue-300 border border-transparent'}
                      `}
                    >
                      {month.slice(0, 3)}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Year View - Show months */}
            {viewMode === 'year' && (
              <div className="grid grid-cols-3 gap-2">
                {monthNames.map((month, idx) => {
                  const isCurrentMonthView = idx === currentMonth.getMonth()
                  const isSelected =
                    selectedDate &&
                    selectedDate.getMonth() === idx &&
                    selectedDate.getFullYear() === currentMonth.getFullYear()

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleMonthSelect(idx)}
                      className={`
                        h-12 rounded-md text-sm font-medium transition-all cursor-pointer
                        ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-900 hover:bg-blue-100 hover:border-blue-300 border border-transparent'}
                        ${isCurrentMonthView ? 'ring-2 ring-blue-500' : ''}
                      `}
                    >
                      {month.slice(0, 3)}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Decade View - Show years */}
            {viewMode === 'decade' && (
              <div className="grid grid-cols-3 gap-2">
                {getDecadeYears().map(year => {
                  const isCurrentYear = year === currentMonth.getFullYear()
                  const isSelected = selectedDate && selectedDate.getFullYear() === year
                  const minYear = min ? parseDate(min)?.getFullYear() : null
                  const maxYear = max ? parseDate(max)?.getFullYear() : null
                  const isDisabled = !!(minYear && year < minYear) || !!(maxYear && year > maxYear)

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => !isDisabled && handleYearSelect(year)}
                      disabled={isDisabled}
                      className={`
                        h-12 rounded-md text-sm font-medium transition-all
                        ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-900 hover:bg-blue-100 hover:border-blue-300 border border-transparent'}
                        ${isCurrentYear ? 'ring-2 ring-blue-500' : ''}
                        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {year}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Footer buttons */}
            <div className="mt-4 flex justify-between gap-2 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={handleToday}
                className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Today
              </button>
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
