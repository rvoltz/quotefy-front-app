import { Routes, Route } from 'react-router-dom';

// Componentes de Layout
import MainLayout from './components/MainLayout';

// Páginas com layout
import HomePage from './pages/HomePage';
import QuotationsPage from './pages/QuotationsPage';
import NewQuotationPage from './pages/NewQuotationPage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleRegistrationPage from './pages/VehicleRegistrationPage';
import PartsPage from './pages/PartsPage';
import PartRegistrationPage from './pages/PartRegistrationPage';
import SuppliersPage from './pages/SuppliersPage';
import SupplierRegistrationPage from './pages/SupplierRegistrationPage';
import SupplierGroupsPage from './pages/SupplierGroupPage';
import SupplierGroupRegistrationPage from './pages/SupplierGroupRegistrationPage';
import QuotationDetailsPage from './pages/QuotationDetailsPage';

// Página sem layout (pública)
import VendorQuotationPage from './pages/VendorQuotationPage';

function App() {
  return (
    <Routes>
      {/* Rota para páginas públicas (sem Header e Sidebar) */}
      <Route path="/submit-quote/:quotationToken" element={<VendorQuotationPage />} />

      {/* Rota principal com o layout completo para o resto da aplicação */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cotacoes" element={<QuotationsPage />} />
        <Route path="/nova-cotacao" element={<NewQuotationPage />} />
        <Route path="/veiculos" element={<VehiclesPage />} />
        <Route path="/cadastro-veiculo" element={<VehicleRegistrationPage />} />
        <Route path="/pecas" element={<PartsPage />} />
        <Route path="/cadastro-peca" element={<PartRegistrationPage />} />
        <Route path="/fornecedores" element={<SuppliersPage />} />
        <Route path="/cadastro-fornecedor" element={<SupplierRegistrationPage />} />
        <Route path="/grupos-fornecedores" element={<SupplierGroupsPage />} />
        <Route path="/cadastro-grupo-fornecedor" element={<SupplierGroupRegistrationPage />} />
        <Route path="/cotacoes/:id" element={<QuotationDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;