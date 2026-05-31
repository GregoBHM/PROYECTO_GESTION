import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Clock, User, Tag, AlertTriangle, CheckCircle2,
  ChevronRight, Loader2, MessageSquare, Paperclip
} from 'lucide-react'
import { ticketsApi } from '../../api/tickets.api'
import { useProjectStore } from '../../store/project.store'

const STATUS_COLORS: Record<string, string> = {
  pendiente_evaluacion: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  en_analisis:          'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pendiente_ccb:        'bg-purple-500/20 text-purple-400 border-purple-500/30',
  fast_track:           'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  en_desarrollo:        'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  en_qa:                'bg-violet-500/20 text-violet-400 border-violet-500/30',
  revision_final:       'bg-orange-500/20 text-orange-400 border-orange-500/30',
  en_uat:               'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cerrado:              'bg-green-500/20 text-green-400 border-green-500/30',
  rechazado:            'bg-red-500/20 text-red-400 border-red-500/30',
  archivado:            'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

const PRIORITY_COLORS: Record<string, string> = {
  baja:     'text-green-400',
  media:    'text-amber-400',
  alta:     'text-orange-400',
  critica:  'text-red-400',
}

interface TicketDetail {
  id: number
  ticket_id: string
  title: string
  description: string
  justification: string
  request_type: string
  type_display: string
  priority: string
  priority_display: string
  status: string
  status_display: string
  cost_assignment: string | null
  requester: { id: number; username: string; first_name: string; last_name: string; avatar_url: string }
  assigned_dev: { id: number; username: string; first_name: string; last_name: string; avatar_url: string } | null
  history: {
    id: number
    changed_by: { username: string; first_name: string; last_name: string }
    from_status: string
    to_status: string
    comment: string
    timestamp: string
  }[]
  attachments: { id: number; file: string; filename: string; uploaded_at: string }[]
  created_at: string
  updated_at: string
}

interface Transition {
  to_status: string
  label: string
}

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentProject } = useProjectStore()

  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [transitions, setTransitions] = useState<Transition[]>([])
  const [loading, setLoading] = useState(true)
  const [transitionLoading, setTransitionLoading] = useState<string | null>(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (id) loadTicket()
  }, [id])

  const loadTicket = async () => {
    setLoading(true)
    try {
      const [ticketRes, transRes] = await Promise.all([
        ticketsApi.getById(Number(id)),
        ticketsApi.getTransitions(Number(id)),
      ])
      setTicket(ticketRes.data)
      setTransitions(transRes.data)
    } catch {
      navigate('/tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleTransition = async (toStatus: string) => {
    setTransitionLoading(toStatus)
    try {
      await ticketsApi.transition(Number(id), { to_status: toStatus, comment })
      setComment('')
      await loadTicket()
    } catch {
    } finally {
      setTransitionLoading(null)
    }
  }

  const formatDateTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!ticket) return null

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/tickets')} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-violet-400">{ticket.ticket_id}</span>
            <span className={`status-badge border ${STATUS_COLORS[ticket.status] || ''}`}>
              {ticket.status_display}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{ticket.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Descripción</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Justificación</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{ticket.justification}</p>
          </div>

          {transitions.length > 0 && (
            <div className="glass-card p-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Acciones Disponibles</h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comentario opcional para la transición..."
                rows={2}
                className="glass-input resize-none text-sm"
              />
              <div className="flex flex-wrap gap-3">
                {transitions.map((t) => {
                  const isReject = t.to_status.includes('rechaz') || t.to_status.includes('archivado')
                  return (
                    <button
                      key={t.to_status}
                      onClick={() => handleTransition(t.to_status)}
                      disabled={transitionLoading !== null}
                      className={isReject ? 'btn-danger' : 'btn-primary'}
                    >
                      {transitionLoading === t.to_status ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                Línea de Tiempo ({ticket.history.length})
              </div>
            </h2>
            <div className="space-y-0">
              {ticket.history.map((entry, index) => (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${
                      index === ticket.history.length - 1 ? 'bg-violet-500 shadow-glow-violet' : 'bg-slate-600'
                    }`} />
                    {index < ticket.history.length - 1 && (
                      <div className="w-px flex-1 bg-white/10 my-1" />
                    )}
                  </div>
                  <div className="pb-6 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {entry.changed_by.first_name} {entry.changed_by.last_name}
                      </span>
                      <span className="text-xs text-slate-600">{formatDateTime(entry.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {entry.from_status && (
                        <>
                          <span className="text-xs text-slate-500">{entry.from_status.replace(/_/g, ' ')}</span>
                          <ChevronRight size={12} className="text-slate-600" />
                        </>
                      )}
                      <span className="text-xs text-violet-400 font-medium">{entry.to_status.replace(/_/g, ' ')}</span>
                    </div>
                    {entry.comment && (
                      <div className="mt-2 flex items-start gap-2 bg-night-800/40 rounded-lg px-3 py-2">
                        <MessageSquare size={12} className="text-slate-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-400">{entry.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Detalles</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Tipo</span>
                <span className="text-xs text-slate-300">{ticket.type_display}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Prioridad</span>
                <span className={`text-xs font-medium ${PRIORITY_COLORS[ticket.priority]}`}>
                  {ticket.priority_display}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Creado</span>
                <span className="text-xs text-slate-300">{formatDateTime(ticket.created_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Actualizado</span>
                <span className="text-xs text-slate-300">{formatDateTime(ticket.updated_at)}</span>
              </div>
              {ticket.cost_assignment && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Costo</span>
                  <span className="text-xs text-slate-300 capitalize">{ticket.cost_assignment}</span>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Solicitante</h3>
            <div className="flex items-center gap-3">
              <img
                src={ticket.requester.avatar_url || `https://ui-avatars.com/api/?name=${ticket.requester.username}&background=8b5cf6&color=fff`}
                alt=""
                className="w-8 h-8 rounded-lg"
              />
              <div>
                <p className="text-sm text-white">{ticket.requester.first_name} {ticket.requester.last_name}</p>
                <p className="text-xs text-slate-500">@{ticket.requester.username}</p>
              </div>
            </div>
          </div>

          {ticket.assigned_dev && (
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Desarrollador</h3>
              <div className="flex items-center gap-3">
                <img
                  src={ticket.assigned_dev.avatar_url || `https://ui-avatars.com/api/?name=${ticket.assigned_dev.username}&background=6366f1&color=fff`}
                  alt=""
                  className="w-8 h-8 rounded-lg"
                />
                <div>
                  <p className="text-sm text-white">{ticket.assigned_dev.first_name} {ticket.assigned_dev.last_name}</p>
                  <p className="text-xs text-slate-500">@{ticket.assigned_dev.username}</p>
                </div>
              </div>
            </div>
          )}

          {ticket.attachments.length > 0 && (
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Adjuntos</h3>
              {ticket.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg bg-night-800/40 hover:bg-night-700/40 transition-colors"
                >
                  <Paperclip size={14} className="text-violet-400" />
                  <span className="text-xs text-slate-300 truncate">{att.filename}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketDetailPage
