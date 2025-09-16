import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/Button';
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

  // NOVAS OPÇÕES: Unificadas com a tela de cotação
  const fuelTypeOptions = useMemo(() => [
    { value: 'Gasolina', label: 'Gasolina' },
    { value: 'Etanol', label: 'Etanol' },
    { value: 'Flex', label: 'Flex' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Elétrico', label: 'Elétrico' },
    { value: 'Híbrido', label: 'Híbrido' },
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

        {/* Campo atualizado para usar SearchableDropdown */}
        <div>
          <label htmlFor="combustivel" className="block text-sm font-medium text-gray-700">Tipo de Combustível</label>
          <Controller
            name="combustivel"
            control={control}
            render={({ field }) => (
              <SearchableDropdown
                options={fuelTypeOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione o tipo..."
                name={field.name}
              />
            )}
          />
          {errors.combustivel && <p className="mt-1 text-sm text-red-600">{errors.combustivel.message}</p>}
        </div>

        {/* Campo Chassi */}
        <div>
          <label htmlFor="chassi" className="block text-sm font-medium text-gray-700">Chassi</label>
          <input
            id="chassi"
            {...register('chassi')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            placeholder="Ex: 9BW... ou 93X..."
          />
          {errors.chassi && <p className="mt-1 text-sm text-red-600">{errors.chassi.message}</p>}
        </div>

        {/* Campo Observações */}
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

export default VehicleRegistrationPage;