import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Car, Users, Calendar, Droplets, ChevronRight, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS } from '../../utils/formatters'

const navItems = [
  { to: '/',           label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/vehicles',   label: 'Vehículos',       icon: Car },
  { to: '/employees',  label: 'Empleados',       icon: Users },
  { to: '/shifts',     label: 'Turnos',          icon: Calendar },
  { to: '/wash-types', label: 'Tipos de Lavado', icon: Droplets },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-full bg-navy-950 border-r border-navy-800">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-primary to-blue-glow flex items-center justify-center shadow-[0_0_16px_rgba(37,99,235,0.4)]">
            <Droplets size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-50 leading-none">Lavadero</p>
            <p className="text-xs text-navy-400 mt-0.5">Panel de gestión</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => clsx(
              'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-blue-primary/15 text-blue-glow border border-blue-primary/20 shadow-[0_0_12px_rgba(37,99,235,0.15)]'
                : 'text-navy-400 hover:text-navy-100 hover:bg-navy-800'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={clsx(
                  'transition-transform duration-200 group-hover:scale-110',
                  isActive ? 'text-blue-glow' : ''
                )} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-blue-primary opacity-70" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-navy-800 space-y-1">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-navy-800/50">
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563eb, #60a5fa)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-navy-100 truncate leading-none">{user.name}</p>
              <p className="text-[11px] text-navy-400 mt-0.5">{ROLE_LABELS[user.role] ?? user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-navy-400 hover:text-status-red hover:bg-status-red/10 transition-all duration-200 group"
        >
          <LogOut size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
