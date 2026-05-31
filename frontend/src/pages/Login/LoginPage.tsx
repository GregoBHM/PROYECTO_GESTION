import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Layers, Lock, User, AlertCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { useProjectStore } from '../../store/project.store'
import { authApi } from '../../api/auth.api'
import { projectsApi } from '../../api/projects.api'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const { setAvailableProjects } = useProjectStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const loginRes = await authApi.login(username, password)
      const { access, refresh, user } = loginRes.data

      setTokens(access, refresh)
      setUser(user)

      if (user.is_admin) {
        navigate('/admin')
        return
      }

      const projectsRes = await projectsApi.getMyProjects()
      setAvailableProjects(projectsRes.data)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Credenciales incorrectas. Intenta de nuevo.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-aurora flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-violet-500/30 rounded-2xl blur-xl animate-pulse-glow" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-violet-600 to-electric-500 rounded-2xl flex items-center justify-center shadow-glow-violet">
              <Layers size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gradient">GestioCambios</h1>
          <p className="text-slate-500 text-sm mt-1">Sistema de Gestión de Configuración SCM</p>
        </div>

        <div className="glass-card p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Iniciar Sesión</h2>
            <p className="text-slate-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Usuario</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="tu_usuario"
                  required
                  autoFocus
                  className="glass-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="glass-input pl-10 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading || !username || !password}
              className="btn-primary w-full mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verificando credenciales...
                </>
              ) : (
                'Ingresar al Sistema'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          GestioCambios SCM · Versión 1.0.0
        </p>
      </div>
    </div>
  )
}

export default LoginPage
