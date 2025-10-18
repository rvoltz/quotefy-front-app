import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Edit, Trash2, Loader2, Eye } from 'lucide-react';
import { getVehicles } from '../services/vehicleService'; 
import type { Vehicle, VehicleSearchParams, VehicleBrand, FuelType } from '../schemas/vehicleSchema';
import { getAvailableBrands, getAvailableFuelTypes } from '../schemas/vehicleSchema';
import type { PageableResponse } from '../schemas/page';
import type { AxiosError } from 'axios';
import PageParams from '../constants/page'; 
import ConfirmationModal from '../components/ConfirmationModal';
import ToastMessage from '../components/ToastMessage'; 
import Button from '../components/Button';

type ToastState = { message: string, type: 'success' | 'error' } | null;

const VehiclesPage = () => {
  const debounceRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  
  // Estado de Dados e UI
  const [vehicles, setVehicles] = useState<Vehicle[]>([]); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros de busca (Estado de UI - Não debounced)
  const [filterFuel, setFilterFuel] = useState<FuelType | ''>('');
  const [filterBrand, setFilterBrand] = useState<VehicleBrand | ''>(''); 
  const [filterEngine, setFilterEngine] = useState('');
  const [filterModel, setFilterModel] = useState('');
  
  // Filtros debounced (Estado para API)
  const [debouncedFilters, setDebouncedFilters] = useState<Omit<VehicleSearchParams, 'page' | 'size'>>({
    model: '',
    brand: '',
    engine: '',
    fuelType: '',
  });

  // Paginação (Baseado em 1 para a UI)
  const [currentPage, setCurrentPage] = useState(1); 
  
  // Modal de Confirmação (para futura ação de exclusão)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToActOn, setVehicleToActOn] = useState<number | null>(null);
  
  // Toast
  const [toast, setToast] = useState<ToastState>(null);
  const handleCloseToast = () => setToast(null);

  const availableFuelTypes = useMemo(() => getAvailableFuelTypes(), []);
  const availableBrands = useMemo(() => getAvailableBrands(), []);

  const formatBrand = (brand: VehicleBrand): string => {
    return brand.replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
  };
  
  // FUNÇÃO DE BUSCA DA API
  const fetchVehicles = useCallback(async () => {   
    setIsLoading(true);
    setError(null);
    
    try {
      const params: VehicleSearchParams = {
        // Converte a página baseada em 1 (UI) para índice zero-based (Backend)
        page: PageParams.getPageIndex(currentPage),
        size: PageParams.ITEMS_PER_PAGE,
        ...debouncedFilters, 
      };

      // Nota: getVehicles precisa retornar PageableResponse<Vehicle>
      const data: PageableResponse<Vehicle> = await getVehicles(params);

      setVehicles(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);

    } catch (err) {
      console.error("Erro na requisição da API:", err);
      
      let errorMessage = "Não foi possível carregar os dados. Verifique a conexão.";
      const axiosError = err as AxiosError;
      
      // Tratamento de erro robusto como no SuppliersPage
      if (axiosError.response) {
         errorMessage = `Erro ${axiosError.response.status}. Verifique as permissões de acesso.`;
      } else if (axiosError.request) {
         errorMessage = "Servidor offline ou erro de rede. Tente novamente mais tarde.";
      }
      
      setError(errorMessage);
      setVehicles([]);
      setTotalPages(1);

    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedFilters]);

  // EFEITO: Inicializa a busca (após a montagem) e reexecuta em mudança de página/filtro
  useEffect(() => {
     if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchVehicles(); // Executa a busca na primeira montagem
      return; 
    }
    
    fetchVehicles();
  }, [fetchVehicles]);

  // FUNÇÃO: Gerencia a mudança de filtros de texto com debounce
  const handleTextFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, key: keyof typeof debouncedFilters, value: string) => {
    setter(value);

    if (debounceRef.current) {
        clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
        setDebouncedFilters(prev => ({
            ...prev,
            [key]: value,
        }));
        setCurrentPage(1); // Sempre volta para a primeira página ao filtrar
    }, PageParams.DEBOUNCE_DELAY_MS);
  }
  
  // FUNÇÃO: Gerencia a mudança de filtros que não precisam de debounce (selects)
  const handleSelectFilterChange = (key: keyof typeof debouncedFilters, value: string) => {
    setDebouncedFilters(prev => ({
        ...prev,
        [key]: value,
    }));
    setCurrentPage(1); // Sempre volta para a primeira página ao filtrar
  }
  
  // EFEITO: Limpa o debounce ao desmontar
  useEffect(() => {
      return () => {
          if (debounceRef.current) {
              clearTimeout(debounceRef.current);
          }
      };
  }, []);
  
  // FUNÇÃO: Gerencia a mudança de página
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const showConstructionMessage = () => {
    setToast({ message: 'Funcionalidade em construção. Por favor, aguarde as próximas atualizações.', type: 'error' });
  };

  // Funções de Navegação e Ação
  /*const handleRegisterClick = () => {
    navigate('/cadastro-veiculo'); 
  };
  */
  const handleEdit = (/*id: number*/) => {
    //navigate(`/editar-veiculo/${id}`);
    showConstructionMessage();
  };
  
  const handleView = (/*id: number*/) => {
    //navigate(`/visualizar-veiculo/${id}`);
    showConstructionMessage();
  };

  const handleDelete = (/*id: number*/) => {
    // Ação de exclusão mantida como placeholder para o modal
    //setVehicleToActOn(id);
    //setIsModalOpen(true);
    showConstructionMessage();
  };


  const confirmDelete = async () => {
    if (!vehicleToActOn) return;

    setIsModalOpen(false);
    setIsLoading(true);

    try {
      // É necessário implementar deleteVehicle(vehicleToActOn) no service
      // await deleteVehicle(vehicleToActOn); 
      setToast({ message: `Veículo ID ${vehicleToActOn} excluído com sucesso! (Ação simulada)`, type: 'success' });
      
      // Refaz a busca para atualizar a lista
      await fetchVehicles();

    } catch (err) {
      console.error("Erro ao excluir veículo:", err);
      setToast({ message: 'Falha ao excluir o veículo. Tente novamente.', type: 'error' });
    } finally {
      setVehicleToActOn(null);
      setIsLoading(false);
    }
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Veículos</h1>        
      </div>
   
      {/* Container de Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 border border-gray-100">
        
        {/* Filtro Modelo (Com Debounce) */}
        <div>
          <label htmlFor="filterModel" className="block text-sm font-semibold text-gray-700 mb-1">Modelo</label>
          <input
            id="filterModel"
            type="text"
            value={filterModel}
            onChange={(e) => handleTextFilterChange(setFilterModel, 'model', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 transition duration-150"
            placeholder="Ex: Civic"
          />
        </div>
        
        {/* Filtro Marca (Com Debounce) */}
        <div>
          <label htmlFor="filterBrand" className="block text-sm font-semibold text-gray-700 mb-1">Marca</label>
          <select
            id="filterBrand"
            value={filterBrand}
            onChange={(e) => {
                const value = e.target.value as VehicleBrand | '';
                setFilterBrand(value);
                handleSelectFilterChange('brand', value);
            }}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 transition duration-150 bg-white"
          >
            <option value="">Todas</option>
            {availableBrands.map((brand) => (
              <option key={brand} value={brand}>
                {formatBrand(brand)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Motor (Com Debounce) */}
        <div>
          <label htmlFor="filterEngine" className="block text-sm font-semibold text-gray-700 mb-1">Motor</label>
          <input
            id="filterEngine"
            type="text"
            value={filterEngine}
            onChange={(e) => handleTextFilterChange(setFilterEngine, 'engine', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 transition duration-150"
            placeholder="Ex: 2.0L"
          />
        </div>

        {/* Filtro Combustível (Sem Debounce) */}
        <div>
          <label htmlFor="filterFuel" className="block text-sm font-semibold text-gray-700 mb-1">Combustível</label>
          <select
            id="filterFuel"
            value={filterFuel}
            onChange={(e) => {
                const value = e.target.value as FuelType | '';
                setFilterFuel(value);
                handleSelectFilterChange('fuelType', value);
            }}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 transition duration-150 bg-white"
          >
            <option value="">Todas</option>
            {availableFuelTypes.map((fuelType) => (
              <option key={fuelType} value={fuelType}>
                {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
          <p className="font-bold">Erro de Conexão</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tabela de Veículos */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Modelo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marca</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ano</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Motor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Combustível</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 whitespace-nowrap text-sm text-gray-500 text-center">
                  <Loader2 className="h-6 w-6 animate-spin inline-block mr-2 text-orange-500" /> Carregando veículos...
                </td>
              </tr>
            ) : (
              vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-orange-50 transition duration-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.engine}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{vehicle.fuelType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button
                        onClick={() => handleView(/*vehicle.id*/)}
                        className="p-2 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100 mr-2 transition disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(/*vehicle.id*/)}
                        className="p-2 rounded-full text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 mr-2 transition disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(/*vehicle.id*/)}
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
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum veículo encontrado para os filtros atuais.</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-lg">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-4 py-2 rounded-lg font-semibold transition-all duration-150 border border-orange-500 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </Button>
        <span className="text-sm font-semibold text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-4 py-2 rounded-lg font-semibold transition-all duration-150 border border-orange-500 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
        </Button>
      </div>
      
      {/* Exibição da contagem total */}
      <div className="text-center mt-4 text-sm text-gray-500">
        Total de {totalElements} veículos encontrados.
      </div>

      {/* Modal de Confirmação para Exclusão (Simulado) */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza de que deseja excluir o veículo ID ${vehicleToActOn}? Esta ação é irreversível. (Ação simulada)`}
        confirmButtonText="Excluir"
      />

      {/* Toast para feedback de sucesso/erro */}
      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={handleCloseToast} />}
    </div>
  );
};

export default VehiclesPage;