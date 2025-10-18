import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Componentes de Layout e Proteção
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Componente de carregamento para o Suspense
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700">
    Carregando Módulo...
  </div>
);

// PÁGINAS COM CARREGAMENTO PREGUIÇOSO (LAZY LOADING)
// Isso garante que o código da página só seja carregado quando a rota for acessada.
const HomePage = React.lazy(() => import('./pages/HomePage'));
const QuotationsPage = React.lazy(() => import('./pages/QuotationsPage'));
const NewQuotationPage = React.lazy(() => import('./pages/NewQuotationPage'));
const VehiclesPage = React.lazy(() => import('./pages/VehiclesPage'));
const PartsPage = React.lazy(() => import('./pages/PartsPage'));
const PartRegistrationPage = React.lazy(() => import('./pages/PartRegistrationPage'));
const SuppliersPage = React.lazy(() => import('./pages/SuppliersPage'));
const SupplierRegistrationPage = React.lazy(() => import('./pages/SupplierRegistrationPage'));
const SupplierGroupsPage = React.lazy(() => import('./pages/SupplierGroupPage'));
const SupplierViewPage = React.lazy(() => import('./pages/SupplierViewPage'));
const SupplierGroupRegistrationPage = React.lazy(() => import('./pages/SupplierGroupRegistrationPage'));
const SupplierGroupEditPage = React.lazy(() => import('./pages/SupplierGroupEditPage'));
const SupplierGroupViewPage = React.lazy(() => import('./pages/SupplierGroupViewPage'));
const QuotationDetailsPage = React.lazy(() => import('./pages/QuotationDetailsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const VendorQuotationPage = React.lazy(() => import('./pages/VendorQuotationPage')); 
const SupplierEditPage = React.lazy(() => import('./pages/SupplierEditPage'));

function App() {
  // Componente Suspense padronizado para uso nas rotas.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const suspenseWrapper = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/submit-quote/:quotationToken" element={suspenseWrapper(VendorQuotationPage)} />
      <Route path="/login" element={suspenseWrapper(LoginPage)} />

      {/* ROTA PROTEGIDA: Todas as rotas internas devem ser filhas desta Route */}
      <Route element={<ProtectedRoute />}> 
        
        {/* MainLayout como wrapper de todas as rotas protegidas */}
        <Route element={<MainLayout />}>
          {/* CORREÇÃO: Aplicando Suspense individualmente a cada elemento de página */}
          
          <Route path="/" element={suspenseWrapper(HomePage)} />
          <Route path="/cotacoes" element={suspenseWrapper(QuotationsPage)} />
          <Route path="/nova-cotacao" element={suspenseWrapper(NewQuotationPage)} />
          <Route path="/veiculos" element={suspenseWrapper(VehiclesPage)} />
          <Route path="/pecas" element={suspenseWrapper(PartsPage)} />
          <Route path="/cadastro-peca" element={suspenseWrapper(PartRegistrationPage)} />
          <Route path="/fornecedores" element={suspenseWrapper(SuppliersPage)} />
          <Route path="/cadastro-fornecedor" element={suspenseWrapper(SupplierRegistrationPage)} />
          <Route path="/editar-fornecedor/:id" element={suspenseWrapper(SupplierEditPage)} />
          <Route path="/visualizar-fornecedor/:id" element={suspenseWrapper(SupplierViewPage)} />
          <Route path="/grupos-fornecedores" element={suspenseWrapper(SupplierGroupsPage)} />          
          <Route path="/editar-grupo-fornecedor/:groupId" element={<SupplierGroupEditPage />} />
          <Route path="/cadastro-grupo-fornecedor" element={suspenseWrapper(SupplierGroupRegistrationPage)} />
          <Route path="/visualizar-grupo-fornecedor/:groupId" element={suspenseWrapper(SupplierGroupViewPage)} />
          <Route path="/cotacoes/:id" element={suspenseWrapper(QuotationDetailsPage)} />
        </Route>
        
      </Route> 
    </Routes>    
  );
}

export default App;
