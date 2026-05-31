import React from 'react'
import { ChevronDown, Folder } from 'lucide-react'
import { useProjectStore, ProjectOption } from '../store/project.store'

const ProjectSelector: React.FC = () => {
  const { currentProject, availableProjects, setCurrentProject } = useProjectStore()
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (project: ProjectOption) => {
    setCurrentProject(project)
    setIsOpen(false)
  }

  if (!currentProject) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-night-800/60 border border-white/10 hover:border-violet-500/40 transition-all duration-200"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-electric-500 flex items-center justify-center">
          <Folder size={14} className="text-white" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-white leading-none">{currentProject.name}</p>
          <p className="text-xs text-violet-400 mt-0.5">{currentProject.role_display}</p>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 glass-card p-2 z-50 animate-fade-in">
          <p className="px-3 py-2 text-xs text-slate-500 uppercase tracking-wider font-semibold">Mis Proyectos</p>
          {availableProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => handleSelect(project)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                currentProject.id === project.id
                  ? 'bg-violet-500/15 border border-violet-500/30'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                currentProject.id === project.id
                  ? 'bg-gradient-to-br from-violet-600 to-electric-500'
                  : 'bg-night-700'
              }`}>
                <Folder size={14} className="text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-white">{project.name}</p>
                <p className="text-xs text-slate-400">{project.role_display}</p>
              </div>
              {currentProject.id === project.id && (
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectSelector
