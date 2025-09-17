import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// NOVO: Importe o HashRouter
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* NOVO: Troque BrowserRouter por HashRouter e remova o basename */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);