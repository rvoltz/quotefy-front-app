import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Importe HashRouter
import App from './App.tsx';
import './index.css'; // Certifique-se de que este caminho está correto

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter> {/* Envolva o App com HashRouter */}
      <App />
    </HashRouter>
  </React.StrictMode>,
);