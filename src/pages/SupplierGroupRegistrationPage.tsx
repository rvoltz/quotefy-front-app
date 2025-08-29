// src/pages/SupplierGroupRegistrationPage.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/Button';
import { supplierGroupSchema } from '../schemas/supplierGroupSchema';
import type { SupplierGroupFormData } from '../schemas/supplierGroupSchema';
import { useState } from 'react';
import SupplierSelector from '../components/SupplierSelector.tsx';

// Definindo o tipo para os fornecedores mockados
interface Supplier {
  id: string;
  name: string;
}

const SupplierGroupRegistrationPage = () => {
  // Dados mock de fornecedores para simular a busca
  const [mockSuppliers] = useState<Supplier[]>([
    { id: 's1', name: 'Auto Peças ABC' },
    { id: 's2', name: 'Distribuidora de Peças XYZ' },
    { id: 's3', name: 'Peças Rápidas LTDA' },
    { id: 's4', name: 'Fornecedor Universal' },
    { id: 's5', name: 'Componentes Automotivos' },
    { id: 's6', name: 'Peças em Geral LTDA' },
    { id: 's7', name: 'Autos e Motores' },
  ]);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SupplierGroupFormData>({
    resolver: zodResolver(supplierGroupSchema),
    defaultValues: {
      suppliers: [],
      isActive: true,
    },
  });
  
  // Observa o array de fornecedores para re-renderizar
  const selectedSuppliers = watch('suppliers');

  const onSubmit = (data: SupplierGroupFormData) => {
    // Aqui você pode mapear os IDs de volta para o objeto completo se precisar
    const selectedSupplierObjects = mockSuppliers.filter(s => data.suppliers.includes(s.id));
    console.log('Dados do Grupo de Fornecedor:', {
      ...data,
      selectedSupplierObjects,
    });
    alert('Grupo de fornecedor cadastrado com sucesso! (Verifique o console para os dados)');
    reset();
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Cadastrar Novo Grupo de Fornecedor</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Campo Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
          <input
            id="description"
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            placeholder="Ex: Pneus e Rodas"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Componente de Seleção de Fornecedores */}
        <div>
          <Controller
            name="suppliers"
            control={control}
            render={({ field }) => (
              <SupplierSelector
                availableSuppliers={mockSuppliers}
                selectedSuppliers={mockSuppliers.filter(s => field.value.includes(s.id))}
                onSelectedChange={(newSelected) => {
                  field.onChange(newSelected.map(s => s.id));
                }}
              />
            )}
          />
          {errors.suppliers && <p className="mt-1 text-sm text-red-600">{errors.suppliers.message}</p>}
        </div>

        {/* Campo Ativo? (Checkbox) */}
        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Grupo Ativo</label>
        </div>

        <Button type="submit" className="w-full">
          Cadastrar Grupo
        </Button>
      </form>
    </div>
  );
};

export default SupplierGroupRegistrationPage;