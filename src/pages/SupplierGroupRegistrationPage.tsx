import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import Button from '../components/Button.jsx';
import ToastMessage from '../components/ToastMessage.jsx'; 
import SupplierSelector from '../components/SupplierSelector.tsx';
import { supplierGroupSchema } from '../schemas/supplierGroupSchema.ts';
import type { SelectorSupplier } from '../schemas/supplierSchema.ts';
import type { SupplierGroupFormData } from '../schemas/supplierGroupSchema.ts';
import { createSupplierGroup } from '../services/supplierGroupService.ts';
import { getSuppliersForSelector } from '../services/supplierService.ts'; 
import ConfigParams from '../constants/config';

type ToastState = { message: string, type: 'success' | 'error' } | null;

const SupplierGroupRegistrationPage = () => {
  const navigate = useNavigate();
  const [availableSuppliers, setAvailableSuppliers] = useState<SelectorSupplier[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors }
  } = useForm<SupplierGroupFormData>({
    resolver: zodResolver(supplierGroupSchema),
    defaultValues: {
      suppliers: [],
      isActive: true,
    },
  });
  
  const handleCloseToast = () => setToast(null);

  const handleGoBack = () => {
    navigate('/grupos-fornecedores');
  };

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await getSuppliersForSelector();
        setAvailableSuppliers(data);
      } catch (error) {
        setToast({ message: 'Falha ao carregar a lista de fornecedores.', type: 'error' });
        console.error('Erro ao carregar fornecedores:', error);
      } finally {
        setIsLoadingSuppliers(false);
      }
    };
    loadSuppliers();
  }, []);

  const onSubmit = async (data: SupplierGroupFormData) => {
    setIsSubmitting(true);
    setToast(null);

    try {
      await createSupplierGroup(data);
      setToast({ message: '✅ Grupo de fornecedor cadastrado com sucesso!', type: 'success' });
      setTimeout(() => navigate('/grupos-fornecedores'), ConfigParams.DELAY_AFTER_SAVE); 

    } catch (error) {
      console.error('Erro ao cadastrar grupo de fornecedor:', error);
      setToast({ message: '❌ Falha ao cadastrar grupo. Verifique os dados.', type: 'error' });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingSuppliers) {
    return (
        <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-700">Carregando fornecedores...</span>
        </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Cadastrar Novo Grupo de Fornecedor</h1>
         <Button onClick={handleGoBack} className="mt-4">
            <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Campo Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
          <input
            id="description"
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            placeholder="Ex: Pneus e Rodas"
            disabled={isSubmitting}
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
                availableSuppliers={availableSuppliers} // <-- Usando dados da API
                selectedSuppliers={availableSuppliers.filter(s => field.value.includes(s.id))}
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
            disabled={isSubmitting}
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Grupo Ativo</label>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
           {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Cadastrando...
            </span>
          ) : (
            'Cadastrar Grupo'
          )}
        </Button>
      </form>
      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={handleCloseToast} />}
    </div>
  );
};

export default SupplierGroupRegistrationPage;