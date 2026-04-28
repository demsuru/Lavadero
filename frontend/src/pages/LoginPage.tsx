import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplets, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div
        className="absolute top-[-15%] left-[-10%] w-[45vw] h-[45vw] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[40vw] h-[40vw] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }}
      />

      {/* Card */}
      <div
        className="w-full max-w-sm relative rounded-2xl p-8 shadow-2xl"
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          boxShadow: '0 0 40px rgba(37, 99, 235, 0.08), 0 25px 50px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.4s ease',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
              boxShadow: '0 0 24px rgba(37, 99, 235, 0.45)',
            }}
          >
            <Droplets size={26} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-navy-50 tracking-tight">Lavadero</h1>
          <p className="text-sm text-navy-400 mt-1">Panel de gestión</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-navy-300 uppercase tracking-wider">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="admin@lavadero.com"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-navy-50 placeholder-navy-500 outline-none transition-all duration-200"
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(51, 65, 85, 0.8)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.8)'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-navy-300 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm text-navy-50 placeholder-navy-500 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(51, 65, 85, 0.8)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.8)'; e.currentTarget.style.boxShadow = 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-lg text-sm text-status-red"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-200 mt-2"
            style={{
              background: loading
                ? 'rgba(37, 99, 235, 0.5)'
                : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: loading ? 'none' : '0 0 20px rgba(37, 99, 235, 0.3)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; if (!loading) e.currentTarget.style.boxShadow = '0 0 28px rgba(37, 99, 235, 0.45)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 0 20px rgba(37, 99, 235, 0.3)' }}
          >
            {loading ? (
              <span
                className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
              />
            ) : (
              <LogIn size={16} />
            )}
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-xs text-navy-500 mt-6">
          Solo usuarios con rol <span className="text-navy-400">manager</span>,{' '}
          <span className="text-navy-400">admin</span> o{' '}
          <span className="text-navy-400">superadmin</span> pueden ingresar.
        </p>
      </div>
    </div>
  )
}
