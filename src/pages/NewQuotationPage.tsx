import { useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import SearchableDropdown from '../components/SearchableDropdown';
import type { NewQuotationFormData } from '../schemas/types/newQuotationFormDataSchema'; // Importa os schemas
import { newQuotationSchema } from '../schemas/quotationSchema';

const NewQuotationPage = () => {
  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<NewQuotationFormData>({
    resolver: zodResolver(newQuotationSchema),
    defaultValues: {
      parts: [{ partId: '', quantity: 1 }],
      selectedSupplierIds: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'parts',
  });

  const selectedVehicleId = watch('vehicleId');

  // Dados mock de veículos (para o select de veículo)
  const allVehicles = [
    { id: 'v1', modelo: 'Civic', ano: 2020 },
    { id: 'v2', modelo: 'Corolla', ano: 2021 },
    { id: 'v3', modelo: 'Onix', ano: 2019 },
    { id: 'v4', modelo: 'HB20', ano: 2022 },
    { id: 'v5', modelo: 'Tracker', ano: 2023 },
    { id: 'v6', modelo: 'Renegade', ano: 2020 },
  ];

  // Dados mock de peças (para o select de peças, filtrado por veículo)
  const allParts = [
    { id: 'p1', description: 'Pastilha de Freio Dianteira', vehicleId: 'v1' }, // Civic
    { id: 'p2', description: 'Filtro de Óleo', vehicleId: 'v2' }, // Corolla
    { id: 'p3', description: 'Vela de Ignição', vehicleId: 'v3' }, // Onix
    { id: 'p4', description: 'Pneu Aro 15', vehicleId: 'v4' }, // HB20
    { id: 'p5', description: 'Bateria 60Ah', vehicleId: 'v5' }, // Tracker
    { id: 'p6', description: 'Amortecedor Traseiro', vehicleId: 'v1' }, // Civic
    { id: 'p7', description: 'Correia Dentada', vehicleId: 'v2' }, // Corolla
    { id: 'p8', description: 'Filtro de Combustível', vehicleId: 'v3' }, // Onix
  ];

  // Dados mock de fornecedores (apenas os ativos)
  const allSuppliers = [
    { id: 's1', name: 'Auto Peças ABC', isActive: true },
    { id: 's2', name: 'Distribuidora de Peças XYZ', isActive: true },
    { id: 's3', name: 'Peças Rápidas LTDA', isActive: false }, // Inativo
    { id: 's4', name: 'Fornecedor Universal', isActive: true },
    { id: 's5', name: 'Componentes Automotivos', isActive: true },
  ];

  const activeSuppliers = useMemo(() => {
    return allSuppliers.filter(supplier => supplier.isActive);
  }, [allSuppliers]);

  const availablePartsForVehicle = useMemo(() => {
    if (!selectedVehicleId) return [];
    return allParts.filter(part => part.vehicleId === selectedVehicleId);
  }, [selectedVehicleId, allParts]);

  const onSubmit = async (data: NewQuotationFormData) => {
    console.log('Dados da Nova Cotação:', data);
    // Simular envio para o backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de rede
    alert('Cotação criada e enviada aos fornecedores selecionados! (Verifique o console para os dados)');
    // Aqui você enviaria os dados para sua API
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Criar Nova Cotação</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Seleção do Veículo */}
        <div className="p-4 border rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">1. Selecione o Veículo</h2>
          <div>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">Veículo</label>
            <Controller
              name="vehicleId"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={allVehicles.map(v => ({ value: v.id, label: `${v.modelo} (${v.ano})` }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pesquisar e selecionar um veículo..."
                  name={field.name}
                />
              )}
            />
            {errors.vehicleId && <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>}
          </div>
        </div>

        {/* Adição de Peças */}
        {selectedVehicleId && (
          <div className="p-4 border rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">2. Adicione as Peças e Quantidades</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 mb-4 p-3 border border-gray-200 rounded-md bg-white items-end">
                <div className="flex-1">
                  <label htmlFor={`parts.${index}.partId`} className="block text-sm font-medium text-gray-700">Peça</label>
                  <Controller
                    name={`parts.${index}.partId` as const}
                    control={control}
                    render={({ field: partField }) => (
                      <SearchableDropdown
                        options={availablePartsForVehicle.map(p => ({ value: p.id, label: p.description }))}
                        value={partField.value}
                        onChange={partField.onChange}
                        placeholder="Pesquisar e selecionar uma peça..."
                        name={partField.name}
                      />
                    )}
                  />
                  {errors.parts?.[index]?.partId && <p className="mt-1 text-sm text-red-600">{errors.parts[index].partId?.message}</p>}
                </div>
                <div className="w-full md:w-1/4">
                  <label htmlFor={`parts.${index}.quantity`} className="block text-sm font-medium text-gray-700">Quantidade</label>
                  <input
                    id={`parts.${index}.quantity`}
                    type="number"
                    {...register(`parts.${index}.quantity` as const, { valueAsNumber: true })}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                  />
                  {errors.parts?.[index]?.quantity && <p className="mt-1 text-sm text-red-600">{errors.parts[index].quantity?.message}</p>}
                </div>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Remover peça</span>
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ partId: '', quantity: 1 })}
              variant="outline"
              className="mt-4 w-full flex items-center justify-center gap-2 text-orange-700 border-orange-500 hover:bg-orange-50"
            >
              <PlusCircle className="h-5 w-5" /> Adicionar Peça
            </Button>
            {errors.parts && !errors.parts.message && <p className="mt-1 text-sm text-red-600">{errors.parts.message}</p>}
          </div>
        )}

        {/* Seleção de Fornecedores */}
        {selectedVehicleId && fields.length > 0 && ( // Só mostra se um veículo e pelo menos uma peça foram adicionados
          <div className="p-4 border rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">3. Selecione os Fornecedores para Envio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSuppliers.length > 0 ? (
                activeSuppliers.map(supplier => (
                  <div key={supplier.id} className="flex items-center p-2 border rounded-md bg-white shadow-sm">
                    <input
                      id={`supplier-${supplier.id}`}
                      type="checkbox"
                      value={supplier.id}
                      {...register('selectedSupplierIds')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`supplier-${supplier.id}`} className="ml-2 block text-sm font-medium text-gray-900">
                      {supplier.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 col-span-full">Nenhum fornecedor ativo encontrado.</p>
              )}
            </div>
            {errors.selectedSupplierIds && <p className="mt-1 text-sm text-red-600">{errors.selectedSupplierIds.message}</p>}
          </div>
        )}

        {/* Botão de Envio */}
        <Button type="submit" className="w-full py-3 text-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando Cotação...' : 'Enviar Cotação'}
        </Button>
      </form>
    </div>
  );
};

export default NewQuotationPage;