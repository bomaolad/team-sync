import React, { createContext, useContext, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

type TTasksContext = {};

const TasksContext = createContext<TTasksContext | undefined>(undefined);

export const useTasksState = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasksState must be used within TasksProvider');
  }
  return context;
};

export const TasksProvider: React.FC<IProps> = ({ children }) => {
  return <TasksContext.Provider value={{}}>{children}</TasksContext.Provider>;
};
