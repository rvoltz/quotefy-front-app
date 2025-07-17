import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Button from '../components/Button'; // Importa o Button do novo caminho

const PartsPage = () => {
  const navigate = useNavigate();

  // Dados mock de peças
  const [parts] = useState([
    { id: 'p1', description: 'Pastilha de Freio Dianteira', vehicleId: 'v1' }, // Civic
    { id: 'p2', description: 'Filtro de Óleo', vehicleId: 'v2' }, // Corolla
    { id: 'p3', description: 'Vela de Ignição', vehicleId: 'v3' }, // Onix
    { id: 'p4', description: 'Pneu Aro 15', vehicleId: 'v4' }, // HB20
    { id: 'p5', description: 'Bateria 60Ah', vehicleId: 'v5' }, // Tracker
    { id: 'p6', description: 'Amortecedor Traseiro', vehicleId: 'v1' }, // Civic
  ]);

  // Dados mock de veículos para lookup (para exibir o nome do veículo na lista)
  const vehiclesData = [
    { id: 'v1', modelo: 'Civic', ano: 2020 },
    { id: 'v2', modelo: 'Corolla', ano: 2021 },
    { id: 'v3', modelo: 'Onix', ano: 2019 },
    { id: 'v4', modelo: 'HB20', ano: 2022 },
    { id: 'v5', modelo: 'Tracker', ano: 2023 },
  ];

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehiclesData.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.modelo} (${vehicle.ano})` : 'Veículo Desconhecido';
  };

  // Estados para filtros
  const [filterDescription, setFilterDescription] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('');

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Lógica de filtragem
  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      const matchesDescription = part.description.toLowerCase().includes(filterDescription.toLowerCase());
      const matchesVehicle = filterVehicle === '' || part.vehicleId === filterVehicle;
      return matchesDescription && matchesVehicle;
    });
  }, [parts, filterDescription, filterVehicle]);

  // Lógica de paginação
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParts = filteredParts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRegisterClick = () => {
    navigate('/cadastro-peca'); // Navega para a tela de cadastro de peça
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Peças</h1>
        <Button onClick={handleRegisterClick} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Cadastrar Nova Peça
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="filterDescription" className="block text-sm font-medium text-gray-700">Filtrar por Descrição</label>
          <input
            id="filterDescription"
            type="text"
            value={filterDescription}
            onChange={(e) => { setFilterDescription(e.target.value); setCurrentPage(1); }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            placeholder="Buscar por descrição..."
          />
        </div>
        <div>
          <label htmlFor="filterVehicle" className="block text-sm font-medium text-gray-700">Filtrar por Veículo</label>
          <select
            id="filterVehicle"
            value={filterVehicle}
            onChange={(e) => { setFilterVehicle(e.target.value); setCurrentPage(1); }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          >
            <option value="">Todos os Veículos</option>
            {vehiclesData.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {`${vehicle.modelo} (${vehicle.ano})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Peças */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veículo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentParts.length > 0 ? (
              currentParts.map((part) => (
                <tr key={part.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{part.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getVehicleInfo(part.vehicleId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => alert(`Editar peça ${part.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => alert(`Excluir peça ${part.id}`)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhuma peça encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          Anterior
        </Button>
        <span className="text-sm text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export default PartsPage;