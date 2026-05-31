import React, { useState, useEffect } from 'react'
import {
  FolderKanban, Users, Plus, Trash2, Loader2,
  UserPlus, ChevronDown, Settings, AlertTriangle, CheckCircle2
} from 'lucide-react'
import { projectsApi } from '../../api/projects.api'
import { authApi } from '../../api/auth.api'

interface ProjectItem {
  id: number
  name: string
  description: string
  methodology: string
  client_name: string
  ticket_count: number
  open_ticket_count: number
  is_active: boolean
  created_at: string
}

interface ProjectDetail {
  id: number
  name: string
  description: string
  specifications: string
  methodology: string
  client: { id: number; username: string; first_name: string; last_name: string }
  memberships: {
    id: number
    user: { id: number; username: string; first_name: string; last_name: string }
    role: { id: number; name: string; display_name: string }
  }[]
  is_active: boolean
}

interface UserItem {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
}

const METHODOLOGY_OPTIONS = [
  { value: 'RUP',    label: 'RUP' },
  { value: 'SCRUM',  label: 'Scrum' },
  { value: 'KANBAN', label: 'Kanban' },
]

const ROLE_OPTIONS = [
  { id: 1, name: 'solicitante',   label: 'Solicitante' },
  { id: 2, name: 'director',      label: 'Director / Jefe de Proyecto' },
  { id: 3, name: 'gestor_config', label: 'Gestor de Configuración' },
  { id: 4, name: 'analista',      label: 'Líder Técnico / Analista' },
  { id: 5, name: 'ccb',           label: 'Comité de Control (CCB)' },
  { id: 6, name: 'desarrollador', label: 'Desarrollador' },
  { id: 7, name: 'qa',            label: 'QA / Tester' },
]

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'users'>('projects')
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [newProject, setNewProject] = useState({ name: '', description: '', specifications: '', methodology: 'RUP', client_id: 0 })
  const [newMember, setNewMember] = useState({ user_id: 0, role_id: 1 })
  const [newUser, setNewUser] = useState({ username: '', email: '', first_name: '', last_name: '', password: '', password_confirm: '' })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [pRes, uRes] = await Promise.all([
        projectsApi.getAll(),
        authApi.listUsers(),
      ])
      setProjects(pRes.data.results || pRes.data)
      setUsers(uRes.data.results || uRes.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  const loadProjectDetail = async (id: number) => {
    try {
      const res = await projectsApi.getById(id)
      setSelectedProject(res.data)
    } catch {}
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setErrorMsg(null)
    try {
      await projectsApi.create(newProject)
      setShowCreateProject(false)
      setNewProject({ name: '', description: '', specifications: '', methodology: 'RUP', client_id: 0 })
      setSuccessMsg('Proyecto creado exitosamente')
      await loadData()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || 'Error al crear proyecto')
    } finally {
      setActionLoading(false)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject) return
    setActionLoading(true)
    try {
      await projectsApi.addMember(selectedProject.id, newMember)
      setShowAddMember(false)
      setNewMember({ user_id: 0, role_id: 1 })
      await loadProjectDetail(selectedProject.id)
      setSuccessMsg('Miembro agregado al proyecto')
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch {} finally {
      setActionLoading(false)
    }
  }

  const handleRemoveMember = async (membershipId: number) => {
    if (!selectedProject) return
    try {
      await projectsApi.removeMember(selectedProject.id, membershipId)
      await loadProjectDetail(selectedProject.id)
    } catch {}
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setErrorMsg(null)
    try {
      await authApi.register(newUser)
      setShowCreateUser(false)
      setNewUser({ username: '', email: '', first_name: '', last_name: '', password: '', password_confirm: '' })
      setSuccessMsg('Usuario creado exitosamente')
      await loadData()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || 'Error al crear usuario')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-slate-500 text-sm mt-1">Gestión de proyectos, usuarios y roles</p>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl animate-fade-in">
          <CheckCircle2 size={16} className="text-green-400" />
          <p className="text-green-400 text-sm">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in">
          <AlertTriangle size={16} className="text-red-400" />
          <p className="text-red-400 text-sm">{errorMsg}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => { setActiveTab('projects'); setSelectedProject(null) }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'projects'
              ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <FolderKanban size={16} />
          Proyectos
        </button>
        <button
          onClick={() => { setActiveTab('users'); setSelectedProject(null) }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'users'
              ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Users size={16} />
          Usuarios
        </button>
      </div>

      {activeTab === 'projects' && !selectedProject && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowCreateProject(true)} className="btn-primary">
              <Plus size={16} />
              Nuevo Proyecto
            </button>
          </div>

          {showCreateProject && (
            <div className="glass-card p-6 space-y-4 animate-slide-up">
              <h3 className="text-base font-semibold text-white">Crear Proyecto</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                    <input value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} required className="glass-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Metodología</label>
                    <select value={newProject.methodology} onChange={(e) => setNewProject({...newProject, methodology: e.target.value})} className="glass-input">
                      {METHODOLOGY_OPTIONS.map((m) => <option key={m.value} value={m.value} className="bg-night-900">{m.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
                  <textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} required rows={2} className="glass-input resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Cliente (Solicitante)</label>
                  <select value={newProject.client_id} onChange={(e) => setNewProject({...newProject, client_id: Number(e.target.value)})} required className="glass-input">
                    <option value={0} className="bg-night-900">Seleccionar usuario...</option>
                    {users.map((u) => <option key={u.id} value={u.id} className="bg-night-900">{u.first_name} {u.last_name} (@{u.username})</option>)}
                  </select>
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowCreateProject(false)} className="btn-ghost">Cancelar</button>
                  <button type="submit" disabled={actionLoading} className="btn-primary">
                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    Crear Proyecto
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : projects.map((p) => (
              <div
                key={p.id}
                onClick={() => loadProjectDetail(p.id)}
                className="glass-card p-5 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-electric-500 flex items-center justify-center">
                    <FolderKanban size={18} className="text-white" />
                  </div>
                  <span className={`status-badge ${p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {p.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-violet-300 transition-colors">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <span className="text-xs text-slate-500">{p.methodology}</span>
                  <div className="flex gap-3">
                    <span className="text-xs text-slate-400">{p.ticket_count} tickets</span>
                    <span className="text-xs text-amber-400">{p.open_ticket_count} abiertos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && selectedProject && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedProject(null)} className="btn-ghost p-2">
              <ChevronDown size={18} className="rotate-90" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white">{selectedProject.name}</h2>
              <p className="text-xs text-slate-500">{selectedProject.methodology} · Cliente: {selectedProject.client.first_name} {selectedProject.client.last_name}</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Miembros del Proyecto ({selectedProject.memberships.length})</h3>
              <button onClick={() => setShowAddMember(true)} className="btn-primary text-xs py-2 px-4">
                <UserPlus size={14} />
                Agregar Miembro
              </button>
            </div>

            {showAddMember && (
              <form onSubmit={handleAddMember} className="mb-4 p-4 bg-night-800/40 rounded-xl space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Usuario</label>
                    <select value={newMember.user_id} onChange={(e) => setNewMember({...newMember, user_id: Number(e.target.value)})} required className="glass-input py-2 text-sm">
                      <option value={0} className="bg-night-900">Seleccionar...</option>
                      {users.map((u) => <option key={u.id} value={u.id} className="bg-night-900">{u.first_name} {u.last_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Rol</label>
                    <select value={newMember.role_id} onChange={(e) => setNewMember({...newMember, role_id: Number(e.target.value)})} className="glass-input py-2 text-sm">
                      {ROLE_OPTIONS.map((r) => <option key={r.id} value={r.id} className="bg-night-900">{r.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddMember(false)} className="btn-ghost text-xs py-1.5">Cancelar</button>
                  <button type="submit" disabled={actionLoading} className="btn-primary text-xs py-1.5 px-3">
                    {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                    Agregar
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-white/5">
              {selectedProject.memberships.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${m.user.username}&background=8b5cf6&color=fff`}
                      alt=""
                      className="w-8 h-8 rounded-lg"
                    />
                    <div>
                      <p className="text-sm text-white">{m.user.first_name} {m.user.last_name}</p>
                      <p className="text-xs text-slate-500">@{m.user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="status-badge bg-violet-500/20 text-violet-400">{m.role.display_name}</span>
                    <button onClick={() => handleRemoveMember(m.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowCreateUser(true)} className="btn-primary">
              <UserPlus size={16} />
              Nuevo Usuario
            </button>
          </div>

          {showCreateUser && (
            <div className="glass-card p-6 space-y-4 animate-slide-up">
              <h3 className="text-base font-semibold text-white">Crear Usuario</h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                    <input value={newUser.first_name} onChange={(e) => setNewUser({...newUser, first_name: e.target.value})} required className="glass-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Apellido</label>
                    <input value={newUser.last_name} onChange={(e) => setNewUser({...newUser, last_name: e.target.value})} required className="glass-input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Usuario</label>
                    <input value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} required className="glass-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required className="glass-input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                    <input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required minLength={8} className="glass-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Confirmar Contraseña</label>
                    <input type="password" value={newUser.password_confirm} onChange={(e) => setNewUser({...newUser, password_confirm: e.target.value})} required className="glass-input" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowCreateUser(false)} className="btn-ghost">Cancelar</button>
                  <button type="submit" disabled={actionLoading} className="btn-primary">
                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={3} className="py-20 text-center">
                    <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${u.username}&background=8b5cf6&color=fff`} alt="" className="w-8 h-8 rounded-lg" />
                        <span className="text-sm text-white">@{u.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm text-slate-400">{u.email}</span></td>
                    <td className="px-6 py-4"><span className="text-sm text-slate-300">{u.first_name} {u.last_name}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
