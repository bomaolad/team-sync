import React, { createContext, useContext, ReactNode } from 'react';
import { useMyTasks, useProjects } from '@/src/hooks';
import { Task, Project } from '@/src/types';

interface IProps {
  children: ReactNode;
}

type TDashboardContext = {
  tasks: Task[];
  projects: Project[];
  activeTasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
};

const DashboardContext = createContext<TDashboardContext | undefined>(
  undefined,
);

export const useDashboardState = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardState must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider: React.FC<IProps> = ({ children }) => {
  const { data: tasks = [], isLoading: tasksLoading } = useMyTasks();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const activeTasks = tasks.filter((t: Task) => t.status !== 'DONE');
  const completedTasks = tasks.filter((t: Task) => t.status === 'DONE');
  const isLoading = tasksLoading || projectsLoading;

  return (
    <DashboardContext.Provider
      value={{
        tasks,
        projects,
        activeTasks,
        completedTasks,
        isLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
