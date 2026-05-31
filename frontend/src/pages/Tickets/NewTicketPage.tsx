import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, FileText, AlertTriangle, Loader2 } from 'lucide-react'
import { ticketsApi } from '../../api/tickets.api'
import { useProjectStore } from '../../store/project.store'

const TYPE_OPTIONS = [
  { value: 'bug',     label: 'Reporte de Error (Bug)' },
  { value: 'mejora',  label: 'Mejora de Funcionalidad' },
  { value: 'feature', label: 'Nuevo Requerimiento (Feature)' },
]

const PRIORITY_OPTIONS = [
  { value: 'baja',    label: 'Baja',    dot: 'bg-green-400' },
  { value: 'media',   label: 'Media',   dot: 'bg-amber-400' },
  { value: 'alta',    label: 'Alta',    dot: 'bg-orange-400' },
  { value: 'critica', label: 'Crítica', dot: 'bg-red-400' },
]

const NewTicketPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentProject } = useProjectStore()

  const [form, setForm] = useState({
    title: '',
    description: '',
    justification: '',
    request_type: 'bug',
    priority: 'media',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentProject) return
    setError(null)
    setIsLoading(true)

    try {
      await ticketsApi.create({
        ...form,
        project_id: currentProject.id,
      })
      navigate('/tickets')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al registrar la solicitud.')
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = form.title.length >= 5 && form.description.length >= 10 && form.justification.length >= 10

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/tickets')} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Nueva Solicitud de Cambio</h1>
          <p className="text-slate-500 text-sm mt-1">Proyecto: {currentProject?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-electric-500 flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">Información de la Solicitud</p>
              <p className="text-xs text-slate-500">Completa todos los campos requeridos</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Título de la Solicitud *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ej: Error en el módulo de facturación al generar PDF"
              required
              minLength={5}
              className="glass-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Solicitud</label>
              <select
                value={form.request_type}
                onChange={(e) => handleChange('request_type', e.target.value)}
                className="glass-input"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-night-900">{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prioridad</label>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITY_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handleChange('priority', p.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all duration-200 ${
                      form.priority === p.value
                        ? 'border-violet-500/50 bg-violet-500/10 text-white'
                        : 'border-white/10 bg-night-800/40 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${p.dot}`} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Descripción Detallada *</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe el problema o la funcionalidad que necesitas. Incluye los pasos para reproducir el error si aplica."
              required
              minLength={10}
              rows={5}
              className="glass-input resize-none"
            />
            <p className="text-xs text-slate-600 mt-1">{form.description.length} caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Justificación del Cambio *</label>
            <textarea
              value={form.justification}
              onChange={(e) => handleChange('justification', e.target.value)}
              placeholder="Explica por qué es necesario este cambio y cuál es el impacto en el negocio si no se realiza."
              required
              minLength={10}
              rows={3}
              className="glass-input resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate('/tickets')} className="btn-ghost">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <Send size={16} />
                Registrar Solicitud
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewTicketPage
