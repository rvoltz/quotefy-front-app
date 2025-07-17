import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Button from '../components/Button'; // Importa o Button do novo caminho

const VehiclesPage = () => {
  const navigate = useNavigate();

  const [vehicles] = useState([
    { id: 'v1', modelo: 'Civic', marca: 'Honda', ano: 2020, motor: '2.0L', combustivel: 'flex' },
    { id: 'v2', modelo: 'Corolla', marca: 'Toyota', ano: 2021, motor: '1.8L', combustivel: 'flex' },
    { id: 'v3', modelo: 'Onix', marca: 'Chevrolet', ano: 2019, motor: '1.0L', combustivel: 'gasolina' },
    { id: 'v4', modelo: 'HB20', marca: 'Hyundai', ano: 2022, motor: '1.6L', combustivel: 'flex' },
    { id: 'v5', modelo: 'Tracker', marca: 'Chevrolet', ano: 2023, motor: '1.2L Turbo', combustivel: 'gasolina' },
    { id: 'v6', modelo: 'Renegade', marca: 'Jeep', ano: 2020, motor: '1.8L', combustivel: 'flex' },
    { id: 'v7', modelo: 'Compass', marca: 'Jeep', ano: 2022, motor: '2.0L Diesel', combustivel: 'diesel' },
    { id: 'v8', modelo: 'T-Cross', marca: 'Volkswagen', ano: 2021, motor: '1.4L Turbo', combustivel: 'flex' },
    { id: 'v9', modelo: 'Kicks', marca: 'Nissan', ano: 2020, motor: '1.6L', combustivel: 'flex' },
    { id: 'v10', modelo: 'Creta', marca: 'Hyundai', ano: 2023, motor: '2.0L', combustivel: 'flex' },
    { id: 'v11', modelo: 'Argo', marca: 'Fiat', ano: 2018, motor: '1.0L', combustivel: 'gasolina' },
    { id: 'v12', modelo: 'Cronos', marca: 'Fiat', ano: 2021, motor: '1.3L', combustivel: 'flex' },
  ]);

  const [filterModelo, setFilterModelo] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [filterCombustivel, setFilterCombustivel] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesModelo = vehicle.modelo.toLowerCase().includes(filterModelo.toLowerCase());
      const matchesMarca = vehicle.marca.toLowerCase().includes(filterMarca.toLowerCase());
      const matchesCombustivel = filterCombustivel === '' || vehicle.combustivel === filterCombustivel;
      return matchesModelo && matchesMarca && matchesCombustivel;
    });
  }, [vehicles, filterModelo, filterMarca, filterCombustivel]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRegisterClick = () => {
    navigate('/cadastro-veiculo');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Veículos</h1>
        <Button onClick={handleRegisterClick} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Cadastrar Novo Veículo
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="filterModelo" className="block text-sm font-medium text-gray-700">Filtrar por Modelo</label>
          <input
            id="filterModelo"
            type="text"
            value={filterModelo}
            onChange={(e) => { setFilterModelo(e.target.value); setCurrentPage(1); }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="filterMarca" className="block text-sm font-medium text-gray-700">Filtrar por Marca</label>
          <input
            id="filterMarca"
            type="text"
            value={filterMarca}
            onChange={(e) => { setFilterMarca(e.target.value); setCurrentPage(1); }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="filterCombustivel" className="block text-sm font-medium text-gray-700">Filtrar por Combustível</label>
          <select
            id="filterCombustivel"
            value={filterCombustivel}
            onChange={(e) => { setFilterCombustivel(e.target.value); setCurrentPage(1); }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          >
            <option value="">Todos</option>
            <option value="gasolina">Gasolina</option>
            <option value="alcool">Álcool</option>
            <option value="flex">Flex</option>
            <option value="diesel">Diesel</option>
          </select>
        </div>
      </div>

      {/* Tabela de Veículos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Combustível</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentVehicles.length > 0 ? (
              currentVehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.modelo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.marca}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.ano}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.motor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{vehicle.combustivel}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum veículo encontrado.</td>
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

export default VehiclesPage;