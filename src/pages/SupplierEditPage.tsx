import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/Button';
import { supplierSchema } from '../schemas/supplierSchema';
import type { SupplierFormData } from '../schemas/supplierSchema';
import { fetchSupplier, updateSupplier } from '../services/supplierService';
import { CLASSIFICATION_OPTIONS } from '../constants/supplierConstants';
import { Loader2, ArrowLeft } from 'lucide-react';
import ToastMessage from '../components/ToastMessage';
import ConfigParams from '../constants/config';

const SupplierEditPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      submissionMethods: [],
      isActive: true,
      email: '',
      whatsapp: '',
    }
  });

  const handleCloseToast = () => setToast(null);

  const handleGoBack = () => {
    navigate('/fornecedores');
  };

  useEffect(() => {
    async function loadSupplierData() {
      if (!id) {
        setIsLoading(false);
        setToast({ message: 'ID do fornecedor não encontrado na URL.', type: 'error' });
        return;
      }

      try {
        const supplierId = parseInt(id, 10);
        if (isNaN(supplierId)) {
            throw new Error("ID inválido.");
        }
        console.log(`Carregando dados do fornecedor: ${supplierId}`);

        const data = await fetchSupplier(supplierId);

        reset(data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setToast({ message: 'Falha ao carregar dados do fornecedor.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
    loadSupplierData();
  }, [id, reset]);

  const onSubmit = async (data: SupplierFormData) => {
    if (!id) return;
    setIsSubmitting(true);

    try {
      const supplierId = parseInt(id, 10);
      await updateSupplier(supplierId, data);
      setTimeout(() => navigate('/fornecedores'), ConfigParams.DELAY_AFTER_SAVE); 
      setToast({ message: '✅ Fornecedor atualizado com sucesso!', type: 'success' });
      
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      const errorMessage = 'Falha ao atualizar. Verifique os dados ou a conexão.';
      setToast({ message: `❌ Erro: ${errorMessage}`, type: 'error' });
    } 
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="ml-3 text-gray-600">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
     <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Editar Fornecedor (ID: {id})
        </h1>
        <Button onClick={handleGoBack} className="mt-4">
                  <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
              </Button>
        </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            id="name"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>      

        <div>
          <label htmlFor="classification" className="block text-sm font-medium text-gray-700">Classificação</label>
          <select
            id="classification"
            {...register('classification')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          >
            <option value="">Selecione...</option>
            {CLASSIFICATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.classification && <p className="mt-1 text-sm text-red-600">{errors.classification.message}</p>}
        </div>

        <div>
          <label htmlFor="seller" className="block text-sm font-medium text-gray-700">Nome do Vendedor</label>
          <input
            id="seller"
            {...register('seller')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            placeholder="Nome do contato comercial"
          />
          {errors.seller && <p className="mt-1 text-sm text-red-600">{errors.seller.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              placeholder="contato@empresa.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp</label>
            <input
              id="whatsapp"
              type="tel"
              {...register('whatsapp')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              placeholder="(XX) 9XXXX-XXXX"
            />
            {errors.whatsapp && <p className="mt-1 text-sm text-red-600">{errors.whatsapp.message}</p>}
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Modo de Envio da Cotação</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="whatsapp-mode"
                type="checkbox"
                value="whatsapp"
                {...register('submissionMethods')}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="whatsapp-mode" className="ml-2 block text-sm text-gray-900">WhatsApp</label>
            </div>
            <div className="flex items-center">
              <input
                id="email-mode"
                type="checkbox"
                value="email"
                {...register('submissionMethods')}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="email-mode" className="ml-2 block text-sm text-gray-900">Email</label>
            </div>
          </div>
          {errors.submissionMethods && <p className="mt-1 text-sm text-red-600">{errors.submissionMethods.message}</p>}
        </div>

        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Fornecedor Ativo</label>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Atualizando...
            </span>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </form>
      
      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={handleCloseToast} />}
    </div>
  );
};

export default SupplierEditPage;
