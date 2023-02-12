import React, { createContext } from 'react';

export const ThemeCtrlContext: React.Context<(changeToTheme?: string) => void> = createContext((changeToTheme?: string) => {});