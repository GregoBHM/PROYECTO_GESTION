import React from 'react'
import { Bell, Search, LogOut } from 'lucide-react'
import ProjectSelector from './ProjectSelector'
import { useAuthStore } from '../store/auth.store'
import { useProjectStore } from '../store/project.store'
import { useNavigate } from 'react-router-dom'

const Topbar: React.FC = () => {
  const { user, logout } = useAuthStore()
  const { clearProject } = useProjectStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    clearProject()
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-white/5 bg-night-950/80 backdrop-blur-glass flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {!user?.is_admin && <ProjectSelector />}
        {user?.is_admin && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <span className="text-sm font-medium text-amber-400">Panel Administrador</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar tickets..."
            className="bg-night-800/40 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40 w-48"
          />
        </div>

        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell size={18} className="text-slate-400" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
        </button>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <img
            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.username}&background=8b5cf6&color=fff`}
            alt={user?.username}
            className="w-8 h-8 rounded-lg object-cover ring-2 ring-violet-500/30"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white leading-none">{user?.full_name || user?.username}</p>
            <p className="text-xs text-slate-500 mt-0.5">{user?.is_admin ? 'Administrador' : 'Usuario'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar
