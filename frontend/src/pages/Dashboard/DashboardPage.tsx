import React from 'react'
import { Ticket, Clock, CheckCircle2, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react'
import { useProjectStore } from '../../store/project.store'
import { useAuthStore } from '../../store/auth.store'

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
}

const KPI_DATA = [
  { label: 'Total Tickets',      value: '24',  change: '+3 esta semana',   icon: <Ticket size={20} />,         color: 'from-violet-600 to-violet-500' },
  { label: 'Pendientes',         value: '8',   change: '2 urgentes',       icon: <Clock size={20} />,          color: 'from-amber-600 to-amber-500' },
  { label: 'Resueltos',          value: '14',  change: '58% del total',    icon: <CheckCircle2 size={20} />,   color: 'from-emerald-600 to-emerald-500' },
  { label: 'Críticos',           value: '2',   change: 'Requiere atención', icon: <AlertTriangle size={20} />, color: 'from-red-600 to-red-500' },
]

const RECENT_TICKETS = [
  { id: 'SC-0024', title: 'Error en módulo de facturación',     status: 'en_qa',                priority: 'alta',     date: '30 May 2026' },
  { id: 'SC-0023', title: 'Mejora en reportes de inventario',   status: 'en_desarrollo',        priority: 'media',    date: '29 May 2026' },
  { id: 'SC-0022', title: 'Nuevo módulo de exportación PDF',    status: 'pendiente_evaluacion', priority: 'baja',     date: '28 May 2026' },
  { id: 'SC-0021', title: 'Vulnerabilidad en autenticación',    status: 'cerrado',              priority: 'critica',  date: '27 May 2026' },
  { id: 'SC-0020', title: 'Optimización consultas SQL',         status: 'revision_final',       priority: 'alta',     date: '26 May 2026' },
]

const PRIORITY_COLORS: Record<string, string> = {
  baja:     'bg-green-500/20 text-green-400',
  media:    'bg-amber-500/20 text-amber-400',
  alta:     'bg-orange-500/20 text-orange-400',
  critica:  'bg-red-500/20 text-red-400',
}

const DashboardPage: React.FC = () => {
  const { currentProject } = useProjectStore()
  const { user } = useAuthStore()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {currentProject ? `Proyecto: ${currentProject.name}` : 'Vista general del sistema'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass-card">
          <TrendingUp size={16} className="text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">Rendimiento: 92%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi, index) => (
          <div key={index} className="kpi-card group animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white`}>
                {kpi.icon}
              </div>
              <ArrowUpRight size={16} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-1">{kpi.label}</p>
            </div>
            <p className="text-xs text-slate-600">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Tickets Recientes</h2>
          <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Ver todos →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prioridad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {RECENT_TICKETS.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-violet-400">{ticket.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white">{ticket.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`status-badge ${STATUS_COLORS[ticket.status] || 'bg-slate-500/20 text-slate-400'}`}>
                      {ticket.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`status-badge ${PRIORITY_COLORS[ticket.priority] || ''}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{ticket.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
