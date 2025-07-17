import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/Button'; // Importa o Button do novo caminho
import type { VehicleFormData } from '../schemas/vehicleSchema'; 
import { vehicleSchema } from '../schemas/vehicleSchema'; 
import SearchableDropdown from '../components/SearchableDropdown';

const VehicleRegistrationPage = () => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  // Opções para o combobox de marca
  const marcaOptions = useMemo(() => [
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Volkswagen', label: 'Volkswagen' },
    { value: 'Chevrolet', label: 'Chevrolet' },
    { value: 'Fiat', label: 'Fiat' },
    { value: 'Hyundai', label: 'Hyundai' },
    { value: 'Honda', label: 'Honda' },
    { value: 'Ford', label: 'Ford' },
    { value: 'Renault', label: 'Renault' },
    { value: 'Jeep', label: 'Jeep' },
    { value: 'Nissan', label: 'Nissan' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
    { value: 'Audi', label: 'Audi' },
    { value: 'Volvo', label: 'Volvo' },
    { value: 'Outra', label: 'Outra' },
  ], []);

  const onSubmit = (data: VehicleFormData) => {
    console.log('Dados do Veículo:', data);
    alert('Veículo cadastrado com sucesso! (Verifique o console para os dados)');
    reset();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Cadastro de Veículo</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="placa" className="block text-sm font-medium text-gray-700">Placa</label>
          <input
            id="placa"
            {...register('placa')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            placeholder="Ex: ABC1D23 ou ABC1234"
          />
          {errors.placa && <p className="mt-1 text-sm text-red-600">{errors.placa.message}</p>}
        </div>
        <div>
          <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo</label>
          <input
            id="modelo"
            {...register('modelo')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
          {errors.modelo && <p className="mt-1 text-sm text-red-600">{errors.modelo.message}</p>}
        </div>

        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
          <Controller
            name="marca"
            control={control}
            render={({ field }) => (
              <SearchableDropdown
                options={marcaOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione ou digite a marca..."
                name={field.name}
              />
            )}
          />
          {errors.marca && <p className="mt-1 text-sm text-red-600">{errors.marca.message}</p>}
        </div>

        <div>
          <label htmlFor="ano" className="block text-sm font-medium text-gray-700">Ano</label>
          <input
            id="ano"
            type="number"
            {...register('ano', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
          {errors.ano && <p className="mt-1 text-sm text-red-600">{errors.ano.message}</p>}
        </div>

        <div>
          <label htmlFor="motor" className="block text-sm font-medium text-gray-700">Motor</label>
          <input
            id="motor"
            {...register('motor')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
          {errors.motor && <p className="mt-1 text-sm text-red-600">{errors.motor.message}</p>}
        </div>

        <div>
          <label htmlFor="combustivel" className="block text-sm font-medium text-gray-700">Tipo de Combustível</label>
          <select
            id="combustivel"
            {...register('combustivel')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          >
            <option value="">Selecione...</option>
            <option value="gasolina">Gasolina</option>
            <option value="alcool">Álcool</option>
            <option value="flex">Flex</option>
            <option value="diesel">Diesel</option>
          </select>
          {errors.combustivel && <p className="mt-1 text-sm text-red-600">{errors.combustivel.message}</p>}
        </div>

        {/* Novo campo: Observações (textarea) */}
        <div>
          <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">Observações</label>
          <textarea
            id="observacoes"
            {...register('observacoes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            placeholder="Adicione quaisquer observações relevantes sobre o veículo..."
          ></textarea>
          {errors.observacoes && <p className="mt-1 text-sm text-red-600">{errors.observacoes.message}</p>}
        </div>

        <Button type="submit" className="w-full">
          Cadastrar Veículo
        </Button>
      </form>
    </div>
  );
};

// --- Componente de Listagem de Veículos ---
const VehiclesPage = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([
    { id: 'v1', modelo: 'Civic', marca: 'Honda', ano: 2020, motor: '2.0L', combustivel: 'flex', placa: 'ABC1234', observacoes: 'Veículo em bom estado.' },
    { id: 'v2', modelo: 'Corolla', marca: 'Toyota', ano: 2021, motor: '1.8L', combustivel: 'flex', placa: 'DEF5G67', observacoes: 'Manutenção em dia.' },
    { id: 'v3', modelo: 'Onix', marca: 'Chevrolet', ano: 2019, motor: '1.0L', combustivel: 'gasolina', placa: 'HIJ8901', observacoes: '' },
    { id: 'v4', modelo: 'HB20', marca: 'Hyundai', ano: 2022, motor: '1.6L', combustivel: 'flex', placa: 'KLM2N34', observacoes: 'Único dono.' },
    { id: 'v5', modelo: 'Tracker', marca: 'Chevrolet', ano: 2023, motor: '1.2L Turbo', combustivel: 'gasolina', placa: 'OPQ5R67', observacoes: 'Versão LTZ.' },
    { id: 'v6', modelo: 'Renegade', marca: 'Jeep', ano: 2020, motor: '1.8L', combustivel: 'flex', placa: 'STU8901', observacoes: 'Apenas para cotação de peças.' },
    { id: 'v7', modelo: 'Compass', marca: 'Jeep', ano: 2022, motor: '2.0L Diesel', combustivel: 'diesel', placa: 'VWX2Y34', observacoes: '' },
    { id: 'v8', modelo: 'T-Cross', marca: 'Volkswagen', ano: 2021, motor: '1.4L Turbo', combustivel: 'flex', placa: 'ZAB5C67', observacoes: 'Completo.' },
    { id: 'v9', modelo: 'Kicks', marca: 'Nissan', ano: 2020, motor: '1.6L', combustivel: 'flex', placa: 'CDE8901', observacoes: 'Pequenos arranhões na lateral.' },
    { id: 'v10', modelo: 'Creta', marca: 'Hyundai', ano: 2023, motor: '2.0L', combustivel: 'flex', placa: 'FGH2I34', observacoes: '' },
    { id: 'v11', modelo: 'Argo', marca: 'Fiat', ano: 2018, motor: '1.0L', combustivel: 'gasolina', placa: 'JKL5M67', observacoes: 'Precisa de revisão.' },
    { id: 'v12', modelo: 'Cronos', marca: 'Fiat', ano: 2021, motor: '1.3L', combustivel: 'flex', placa: 'NOP8901', observacoes: '' },
  ]);

  const [filterModelo, setFilterModelo] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [filterCombustivel, setFilterCombustivel] = useState('');
  const [filterPlaca, setFilterPlaca] = useState(''); // Novo filtro para placa

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesModelo = vehicle.modelo.toLowerCase().includes(filterModelo.toLowerCase());
      const matchesMarca = vehicle.marca.toLowerCase().includes(filterMarca.toLowerCase());
      const matchesCombustivel = filterCombustivel === '' || vehicle.combustivel === filterCombustivel;
      const matchesPlaca = vehicle.placa.toLowerCase().includes(filterPlaca.toLowerCase()); // Filtro de placa
      return matchesModelo && matchesMarca && matchesCombustivel && matchesPlaca;
    });
  }, [vehicles, filterModelo, filterMarca, filterCombustivel, filterPlaca]); // Adiciona filterPlaca nas dependências

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
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"> {/* Aumenta para 4 colunas */}
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
        {/* Novo filtro para Placa */}
        <div>
          <label htmlFor="filterPlaca" className="block text-sm font-medium text-gray-700">Filtrar por Placa</label>
          <input
            id="filterPlaca"
            type="text"
            value={filterPlaca}
            onChange={(e) => { setFilterPlaca(e.target.value); setCurrentPage(1); }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th> {/* Nova coluna */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th> {/* Nova coluna */}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.placa}</td> {/* Exibe placa */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{vehicle.observacoes || '-'}</td> {/* Exibe observações */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum veículo encontrado.</td>
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

export default VehicleRegistrationPage;