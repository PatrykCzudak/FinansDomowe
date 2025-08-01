import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { MonthProvider } from './contexts/month-context';
import { ThemeProvider } from './contexts/theme-context';  // opcjonalnie

import App from './App';
//import './styles/index.css';  // import Tailwind CSS

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MonthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MonthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
