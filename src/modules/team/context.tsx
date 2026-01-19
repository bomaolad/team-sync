import React, { createContext, useContext, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

type TTeamContext = {};

const TeamContext = createContext<TTeamContext | undefined>(undefined);

export const useTeamState = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeamState must be used within TeamProvider');
  }
  return context;
};

export const TeamProvider: React.FC<IProps> = ({ children }) => {
  return <TeamContext.Provider value={{}}>{children}</TeamContext.Provider>;
};
