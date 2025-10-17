import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Loader2, Eye } from 'lucide-react';
import { getSupplierGroups, deleteSupplierGroup } from '../services/supplierGroupService'; 
import type { SupplierGroup } from '../schemas/supplierGroupSchema';
import type { AxiosError } from 'axios';
import PageParams from '../constants/page'; 
import ConfirmationModal from '../components/ConfirmationModal';
import ToastMessage from '../components/ToastMessage';

type ToastState = { message: string, type: 'success' | 'error' } | null;

const SupplierGroupsPage = () => {
  const navigate = useNavigate();
  const debounceRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  
  const [supplierGroups, setSupplierGroups] = useState<SupplierGroup[]>([]); 
  const [totalPages, setTotalPages] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupToDeleteId, setGroupToDeleteId] = useState<number | null>(null);

  const [filterDescription, setFilterDescription] = useState('');
  const [debouncedFilterDescription, setDebouncedFilterDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 

  const handleCloseToast = () => setToast(null);

  const fetchSupplierGroups = useCallback(async () => {   
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getSupplierGroups({
        page: PageParams.getPageIndex(currentPage),
        size: PageParams.ITEMS_PER_PAGE,
        description: debouncedFilterDescription, // Usando o filtro
      });

      setSupplierGroups(data.content || []);
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
      setSupplierGroups([]);
      setTotalPages(1);

    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedFilterDescription]);

  useEffect(() => {    
     if (isInitialMount.current) {
        isInitialMount.current = false;
        fetchSupplierGroups(); 
        return;
    }
    
    fetchSupplierGroups();
  }, [fetchSupplierGroups]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilterDescription = e.target.value;
    
    setFilterDescription(newFilterDescription);

    if (debounceRef.current) {
        clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
        setDebouncedFilterDescription(newFilterDescription);
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
    navigate('/cadastro-grupo-fornecedor'); 
  };
  
  const handleEdit = (id: number) => {
    navigate(`/editar-grupo-fornecedor/${id}`);
  };
  
  const handleDelete = (id: number) => {
    setGroupToDeleteId(id);
    setIsModalOpen(true);
  };

  const handleView = (id: number) => {
    navigate(`/visualizar-grupo-fornecedor/${id}`);
  };

  const confirmDelete = async () => {
    if (!groupToDeleteId) return;

    setIsModalOpen(false);
    setIsLoading(true);

    try {
      await deleteSupplierGroup(groupToDeleteId); // Chamada à função de exclusão
      setToast({ message: '✅ Grupo excluído com sucesso!', type: 'success' });
      
      await fetchSupplierGroups();

    } catch (err) {
      console.error("Erro ao excluir grupo:", err);
      setToast({ message: '❌ Falha ao excluir o grupo. Tente novamente.', type: 'error' });
    } finally {
      setGroupToDeleteId(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Grupos de Fornecedores</h1>
        
        <button 
          onClick={handleRegisterClick} 
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-150 bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
        >
          <PlusCircle className="h-5 w-5" /> Cadastrar Novo Grupo
        </button>
      </div>
   
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-100">
        <div>
          <label htmlFor="filterDescription" className="block text-sm font-semibold text-gray-700 mb-1">Filtrar por Descrição</label>
          <input
            id="filterDescription"
            type="text"
            value={filterDescription}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 transition duration-150"
            placeholder="Buscar por descrição do grupo..."
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descrição</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ativo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 whitespace-nowrap text-sm text-gray-500 text-center">
                  <Loader2 className="h-6 w-6 animate-spin inline-block mr-2 text-orange-500" /> Carregando grupos...
                </td>
              </tr>
            ) : (
              supplierGroups.length > 0 ? (
                supplierGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-orange-50 transition duration-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{group.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full transition-colors ${
                        group.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {group.active ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                       <button
                        onClick={() => handleView(group.id)}
                        className="p-2 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100 mr-2 transition disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(group.id)}
                        className="p-2 rounded-full text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 mr-2 transition disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(group.id)}
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
                  <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum grupo encontrado para o filtro atual.</td>
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
        title="Confirmar Exclusão de Grupo"
        message={`Tem certeza de que deseja excluir o grupo ID ${groupToDeleteId}? Esta ação é irreversível.`}
        confirmButtonText="Excluir"
      />

      {/* Toast para feedback de sucesso/erro */}
      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={handleCloseToast} />}
    </div>
  );
};

export default SupplierGroupsPage;
