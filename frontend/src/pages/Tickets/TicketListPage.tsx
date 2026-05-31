import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, ChevronDown, ArrowUpDown } from 'lucide-react'
import { ticketsApi } from '../../api/tickets.api'
import { useProjectStore } from '../../store/project.store'

const STATUS_COLORS: Record<string, string> = {
  pendiente_evaluacion: 'bg-amber-500/20 text-amber-400',
  en_analisis:          'bg-blue-500/20 text-blue-400',
  pendiente_ccb:        'bg-purple-500/20 text-purple-400',
  fast_track:           'bg-cyan-500/20 text-cyan-400',
  en_desarrollo:        'bg-indigo-500/20 text-indigo-400',
  en_qa:                'bg-violet-500/20 text-violet-400',
  revision_final:       'bg-orange-500/20 text-orange-400',
  en_uat:               'bg-emerald-500/20 text-emerald-400',
  cerrado:              'bg-green-500/20 text-green-400',
  rechazado:            'bg-red-500/20 text-red-400',
  archivado:            'bg-slate-500/20 text-slate-400',
}

const PRIORITY_COLORS: Record<string, string> = {
  baja:     'bg-green-500/20 text-green-400',
  media:    'bg-amber-500/20 text-amber-400',
  alta:     'bg-orange-500/20 text-orange-400',
  critica:  'bg-red-500/20 text-red-400',
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'pendiente_evaluacion', label: 'Pendiente Evaluación' },
  { value: 'en_analisis', label: 'En Análisis' },
  { value: 'pendiente_ccb', label: 'Pendiente CCB' },
  { value: 'fast_track', label: 'Fast-Track' },
  { value: 'en_desarrollo', label: 'En Desarrollo' },
  { value: 'en_qa', label: 'En QA' },
  { value: 'revision_final', label: 'Revisión Final' },
  { value: 'en_uat', label: 'UAT' },
  { value: 'cerrado', label: 'Cerrado' },
  { value: 'rechazado', label: 'Rechazado' },
]

const PRIORITY_OPTIONS = [
  { value: '', label: 'Todas las prioridades' },
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' },
]

interface TicketRow {
  id: number
  ticket_id: string
  title: string
  requester_name: string
  status: string
  status_display: string
  priority: string
  priority_display: string
  request_type: string
  type_display: string
  created_at: string
}

const TicketListPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentProject } = useProjectStore()

  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [currentProject?.id])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const res = await ticketsApi.getAll(currentProject?.id)
      setTickets(res.data.results || res.data)
    } catch {
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = tickets.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticket_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = !statusFilter || t.status === statusFilter
    const matchPriority = !priorityFilter || t.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bandeja de Tickets</h1>
          <p className="text-slate-500 text-sm mt-1">
            {currentProject?.name || 'Todos los proyectos'} · {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        {currentProject?.role === 'solicitante' && (
          <button
            onClick={() => navigate('/tickets/new')}
            className="btn-primary"
          >
            <Plus size={16} />
            Nueva Solicitud
          </button>
        )}
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por ID o título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-9 py-2.5"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost ${showFilters ? 'border-violet-500/40 text-violet-300' : ''}`}
          >
            <Filter size={14} />
            Filtros
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5 animate-fade-in">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input py-2 text-xs"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-night-900">{o.label}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="glass-input py-2 text-xs"
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-night-900">{o.label}</option>
              ))}
            </select>
            {(statusFilter || priorityFilter) && (
              <button
                onClick={() => { setStatusFilter(''); setPriorityFilter('') }}
                className="text-xs text-red-400 hover:text-red-300 transition-colors whitespace-nowrap"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-night-800 flex items-center justify-center mb-4">
              <Search size={24} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium">No se encontraron tickets</p>
            <p className="text-slate-600 text-sm mt-1">Intenta con otros filtros o crea una nueva solicitud</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-300">
                      ID <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prioridad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Solicitante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-violet-400 group-hover:text-violet-300">{ticket.ticket_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white group-hover:text-violet-200 transition-colors">{ticket.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400">{ticket.type_display}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${STATUS_COLORS[ticket.status] || 'bg-slate-500/20 text-slate-400'}`}>
                        {ticket.status_display}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${PRIORITY_COLORS[ticket.priority] || ''}`}>
                        {ticket.priority_display}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">{ticket.requester_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{formatDate(ticket.created_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketListPage
