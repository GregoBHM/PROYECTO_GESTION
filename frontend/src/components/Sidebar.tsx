import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Ticket, PlusCircle, Users, FolderKanban,
  Shield, ClipboardCheck, Code2, TestTube2, Layers, Settings
} from 'lucide-react'
import { useProjectStore } from '../store/project.store'
import { useAuthStore } from '../store/auth.store'

const ROLE_MENUS: Record<string, { label: string; path: string; icon: React.ReactNode }[]> = {
  solicitante: [
    { label: 'Dashboard',         path: '/dashboard',    icon: <LayoutDashboard size={18} /> },
    { label: 'Mis Solicitudes',   path: '/tickets',      icon: <Ticket size={18} /> },
    { label: 'Nueva Solicitud',   path: '/tickets/new',  icon: <PlusCircle size={18} /> },
  ],
  director: [
    { label: 'Dashboard',         path: '/dashboard',    icon: <LayoutDashboard size={18} /> },
    { label: 'Bandeja de Tickets', path: '/tickets',     icon: <Ticket size={18} /> },
    { label: 'Aprobaciones',      path: '/tickets',      icon: <ClipboardCheck size={18} /> },
  ],
  gestor_config: [
    { label: 'Dashboard',         path: '/dashboard',    icon: <LayoutDashboard size={18} /> },
    { label: 'Tickets',           path: '/tickets',      icon: <Ticket size={18} /> },
    { label: 'Repositorios',      path: '/dashboard',    icon: <FolderKanban size={18} /> },
  ],
  analista: [
    { label: 'Dashboard',         path: '/dashboard',    icon: <LayoutDashboard size={18} /> },
    { label: 'Análisis Técnico',  path: '/tickets',      icon: <Ticket size={18} /> },
  ],
  ccb: [
    { label: 'Dashboard',         path: '/dashboard',    icon: <LayoutDashboard size={18} /> },
    { label: 'Comité CCB',        path: '/tickets',      icon: <Shield size={18} /> },
  ],
  desarrollador: [
    { label: 'Dashboard',         path: '/dashboard',    icon: <LayoutDashboard size={18} /> },
    { label: 'Mis Tareas',        path: '/tickets',      icon: <Code2 size={18} /> },
  ],
  qa: [
    { label: 'Dashboard',         path: '/dashboard',    icon: <LayoutDashboard size={18} /> },
    { label: 'Control de Calidad', path: '/tickets',     icon: <TestTube2 size={18} /> },
  ],
}

const ADMIN_MENU = [
  { label: 'Dashboard',       path: '/dashboard',   icon: <LayoutDashboard size={18} /> },
  { label: 'Proyectos',       path: '/admin',        icon: <FolderKanban size={18} /> },
  { label: 'Usuarios',        path: '/admin',        icon: <Users size={18} /> },
  { label: 'Configuración',   path: '/admin',        icon: <Settings size={18} /> },
]

const Sidebar: React.FC = () => {
  const { currentProject } = useProjectStore()
  const { user } = useAuthStore()

  const menuItems = user?.is_admin
    ? ADMIN_MENU
    : ROLE_MENUS[currentProject?.role || ''] || []

  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-night-950/60 backdrop-blur-glass flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-electric-500 rounded-xl flex items-center justify-center shadow-glow-violet">
          <Layers size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-none">GestioCambios</h1>
          <p className="text-xs text-slate-500 mt-0.5">SCM v1.0</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 py-2 text-xs text-slate-600 uppercase tracking-wider font-semibold">
          {user?.is_admin ? 'Administración' : currentProject?.role_display || 'Menú'}
        </p>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-slate-500">Metodología</p>
          <p className="text-sm font-semibold text-violet-400">{currentProject?.methodology || 'N/A'}</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
