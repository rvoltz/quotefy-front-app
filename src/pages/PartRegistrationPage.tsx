import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/Button'; // Importa o Button do novo caminho
import type { PartFormData } from '../schemas/partSchema'; // Importa o schema e o tipo
import { partSchema } from '../schemas/partSchema'; // Importa o schema e o tipo

const PartRegistrationPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PartFormData>({
    resolver: zodResolver(partSchema),
  });

  // Dados mock de veículos para o combobox
  const vehicles = [
    { id: 'v1', modelo: 'Civic', ano: 2020 },
    { id: 'v2', modelo: 'Corolla', ano: 2021 },
    { id: 'v3', modelo: 'Onix', ano: 2019 },
    { id: 'v4', modelo: 'HB20', ano: 2022 },
    { id: 'v5', modelo: 'Tracker', ano: 2023 },
  ];

  const onSubmit = (data: PartFormData) => {
    console.log('Dados da Peça:', data);
    alert('Peça cadastrada com sucesso! (Verifique o console para os dados)');
    reset();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Cadastro de Peça</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
          <input
            id="description"
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">Veículo</label>
          <select
            id="vehicleId"
            {...register('vehicleId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          >
            <option value="">Selecione um veículo...</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {`${vehicle.modelo} (${vehicle.ano})`}
              </option>
            ))}
          </select>
          {errors.vehicleId && <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>}
        </div>

        <Button type="submit" className="w-full">
          Cadastrar Peça
        </Button>
      </form>
    </div>
  );
};

export default PartRegistrationPage;