import React, { createContext, useContext, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

type TSettingsContext = {};

const SettingsContext = createContext<TSettingsContext | undefined>(undefined);

export const useSettingsState = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsState must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<IProps> = ({ children }) => {
  return (
    <SettingsContext.Provider value={{}}>{children}</SettingsContext.Provider>
  );
};
