import React, { createContext, useContext, ReactNode } from 'react';
import { useProjects, useTasks } from '@/src/hooks';
import { Project, Task } from '@/src/types';

interface IProps {
  children: ReactNode;
}

type TProjectsContext = {
  projects: Project[];
  allTasks: Task[];
  isLoading: boolean;
};

const ProjectsContext = createContext<TProjectsContext | undefined>(undefined);

export const useProjectsState = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjectsState must be used within ProjectsProvider');
  }
  return context;
};

export const ProjectsProvider: React.FC<IProps> = ({ children }) => {
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: allTasks = [] } = useTasks();

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        allTasks,
        isLoading: projectsLoading,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
