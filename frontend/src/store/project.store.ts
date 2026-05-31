import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProjectOption {
  id: number
  name: string
  role: string
  role_display: string
  methodology: string
}

interface ProjectState {
  currentProject: ProjectOption | null
  availableProjects: ProjectOption[]
  setCurrentProject: (project: ProjectOption) => void
  setAvailableProjects: (projects: ProjectOption[]) => void
  clearProject: () => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      currentProject: null,
      availableProjects: [],

      setCurrentProject: (project) =>
        set({ currentProject: project }),

      setAvailableProjects: (projects) =>
        set({
          availableProjects: projects,
          currentProject: projects.length > 0 ? projects[0] : null,
        }),

      clearProject: () =>
        set({ currentProject: null, availableProjects: [] }),
    }),
    {
      name: 'gestiocambios-project',
      partialize: (state) => ({
        currentProject: state.currentProject,
        availableProjects: state.availableProjects,
      }),
    }
  )
)
