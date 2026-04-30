import type { DayOfWeek } from '../types'

/**
 * Get the Monday (start of week) for a given date.
 * Uses ISO week standard (Monday = 0).
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  // ISO: Monday=1, Sunday=0. We need to go back to Monday.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const result = new Date(d.setDate(diff))
  return result
}

/**
 * Get all 7 days of the week starting from Monday.
 */
export function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
}

/**
 * Get the last day (Sunday) of the week.
 */
export function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart)
  d.setDate(d.getDate() + 6)
  return d
}

/**
 * Format a date to ISO string (YYYY-MM-DD).
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parse ISO date string to Date object.
 */
export function parseISODate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00Z')
}

/**
 * Get day of week (0-6) where 0=Sunday, 6=Saturday.
 */
export function getDayOfWeekIndex(date: Date): number {
  return date.getDay()
}

/**
 * Get day name from date (Monday, Tuesday, etc.).
 */
export function getDayName(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

/**
 * Format date as "27/4" (day/month).
 */
export function formatDateShort(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`
}

/**
 * Check if a date is in the past (before today).
 */
export function isDateInThePast(date: Date): boolean {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

/**
 * Check if a date is today.
 */
export function isDateToday(date: Date): boolean {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d.getTime() === today.getTime()
}

/**
 * Add days to a date.
 */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * Subtract days from a date.
 */
export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days)
}

/**
 * Convert time string (HH:MM or HH:MM:SS) to minutes since midnight.
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.slice(0, 5).split(':').map(Number)
  return h * 60 + m
}
