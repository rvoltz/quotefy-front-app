import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { getSuppliers, deleteSupplier } from '../services/supplierService'; 
import type { Supplier } from '../services/supplierService';
import type { AxiosError } from 'axios';
import PageParams from '../constants/page'; 
import ConfirmationModal from '../components/ConfirmationModal';
import ToastMessage from '../components/ToastMessage';
import type { ShippingModeValue } from '../constants/supplierConstants';

const formatShippingModes = (modes: (ShippingModeValue | string)[] = []) => {
  return modes
    .map(method => method.charAt(0) + method.slice(1).toLowerCase())
    .join(', ');
};

const SuppliersPage = () => {
  const navigate = useNavigate();
  const debounceRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); 
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [debouncedFilterName, setDebouncedFilterName] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToDeleteId, setSupplierToDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const handleCloseToast = () => setToast(null);

  const fetchSuppliers = useCallback(async () => {   
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getSuppliers({
        page: PageParams.getPageIndex(currentPage),
        size: PageParams.ITEMS_PER_PAGE,
        name: debouncedFilterName, 
      });

      setSuppliers(data.content || []);
      setTotalPages(data.totalPages || 1);

    } catch (err) {
      console.error("Erro na requisição da API:", err);
      
      let errorMessage = "Não foi possível carregar os dados. Verifique o status da sua sessão.";
      const axiosError = err as AxiosError;
      if (axiosError.response) {
         errorMessage = `Erro ${axiosError.response.status}. Verifique as permissões.`;
      } else if (axiosError.request) {
         errorMessage = "Servidor offline ou erro de rede. Tente novamente mais tarde.";
      }
      
      setError(errorMessage);
      setSuppliers([]);
      setTotalPages(1);

    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedFilterName]);

  useEffect(() => {
     if (isInitialMount.current) {
      isInitialMount.current = false;
      return; 
    }
    
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilterName = e.target.value;
    
    setFilterName(newFilterName);

    if (debounceRef.current) {
        clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
        setDebouncedFilterName(newFilterName);
        setCurrentPage(1); 
    }, PageParams.DEBOUNCE_DELAY_MS);
  }

  useEffect(() => {
      return () => {
          if (debounceRef.current) {
              clearTimeout(debounceRef.current);
          }
      };
  }, []);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRegisterClick = () => {
    navigate('/cadastro-fornecedor'); 
  };
  
  const handleEdit = (id: number) => {
    navigate(`/editar-fornecedor/${id}`);
  };
  
  const handleDelete = (id: number) => {
    setSupplierToDeleteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!supplierToDeleteId) return;

    setIsModalOpen(false);
    setIsLoading(true);

    try {
      await deleteSupplier(supplierToDeleteId);
      setToast({ message: 'Fornecedor excluído com sucesso!', type: 'success' });
      
      await fetchSuppliers();

    } catch (err) {
      console.error("Erro ao excluir fornecedor:", err);
      setToast({ message: 'Falha ao excluir o fornecedor. Tente novamente.', type: 'error' });
    } finally {
      setSupplierToDeleteId(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Fornecedores</h1>
        
        <button 
          onClick={handleRegisterClick} 
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-150 bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
        >
          <PlusCircle className="h-5 w-5" /> Cadastrar Novo Fornecedor
        </button>
      </div>
   
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-100">
        <div>
          <label htmlFor="filterName" className="block text-sm font-semibold text-gray-700 mb-1">Filtrar por Nome</label>
          <input
            id="filterName"
            type="text"
            value={filterName}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 transition duration-150"
            placeholder="Buscar por nome do fornecedor..."
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
          <p className="font-bold">Erro de Conexão</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Modo de Envio</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ativo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 whitespace-nowrap text-sm text-gray-500 text-center">
                  <Loader2 className="h-6 w-6 animate-spin inline-block mr-2 text-orange-500" /> Carregando fornecedores...
                </td>
              </tr>
            ) : (
              suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-orange-50 transition duration-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatShippingModes(supplier.shippingModes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full transition-colors ${
                        supplier.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {supplier.active ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button
                        onClick={() => handleEdit(supplier.id)}
                        className="p-2 rounded-full text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 mr-2 transition disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-2 rounded-full text-red-600 hover:text-red-800 hover:bg-red-100 transition disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum fornecedor encontrado para o filtro atual.</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-lg">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-4 py-2 rounded-lg font-semibold transition-all duration-150 border border-orange-500 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="text-sm font-semibold text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-4 py-2 rounded-lg font-semibold transition-all duration-150 border border-orange-500 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza de que deseja excluir o fornecedor ID ${supplierToDeleteId}? Esta ação é irreversível.`}
        confirmButtonText="Excluir"
      />

      {/* Toast para feedback de sucesso/erro */}
      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={handleCloseToast} />}
    </div>
  );
};

export default SuppliersPage;
