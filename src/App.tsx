import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

import HomePage from './pages/HomePage';
import QuotationsPage from './pages/QuotationsPage';
import NewQuotationPage from './pages/NewQuotationPage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleRegistrationPage from './pages/VehicleRegistrationPage';
import PartsPage from './pages/PartsPage';
import PartRegistrationPage from './pages/PartRegistrationPage';
import SuppliersPage from './pages/SuppliersPage';
import SupplierRegistrationPage from './pages/SupplierRegistrationPage';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans antialiased">
      {/* Cabeçalho */}
      <Header onMenuClick={handleMobileMenuToggle} />

      <div className="flex flex-1">
        {/* Menu Lateral (Desktop e Mobile com Sheet) */}
        <Sidebar isMobileOpen={isMobileMenuOpen} onClose={handleMobileMenuClose} />

        {/* Conteúdo Principal */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Routes>
            <Route path="/cotacoes" element={<QuotationsPage />} />
            <Route path="/nova-cotacao" element={<NewQuotationPage />} />
            <Route path="/veiculos" element={<VehiclesPage />} />
            <Route path="/cadastro-veiculo" element={<VehicleRegistrationPage />} />
            <Route path="/pecas" element={<PartsPage />} />
            <Route path="/cadastro-peca" element={<PartRegistrationPage />} />
            <Route path="/fornecedores" element={<SuppliersPage />} />
            <Route path="/cadastro-fornecedor" element={<SupplierRegistrationPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;