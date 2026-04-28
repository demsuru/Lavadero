import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DayOfWeek } from '../types'

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)

export const formatDate = (date: string) =>
  format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es })

export const formatTimeAgo = (date: string) =>
  formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })

export const formatTime = (time: string) => time.slice(0, 5)

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday:    'Lunes',
  tuesday:   'Martes',
  wednesday: 'Miércoles',
  thursday:  'Jueves',
  friday:    'Viernes',
  saturday:  'Sábado',
  sunday:    'Domingo',
}

export const DAYS_ORDER: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
]

export const ROLE_LABELS: Record<string, string> = {
  employee:   'Empleado',
  manager:    'Gerente',
  admin:      'Admin',
  superadmin: 'Superadmin',
}
