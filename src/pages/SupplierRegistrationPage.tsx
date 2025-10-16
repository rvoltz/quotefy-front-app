import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';
import { supplierSchema } from '../schemas/supplierSchema';
import { createSupplier } from '../services/supplierService';
import { CLASSIFICATION_OPTIONS } from '../constants/supplierConstants'; // 👈 Importa opções em Português/Inglês
import type { SupplierFormData } from '../schemas/supplierSchema';
import { Loader2 } from 'lucide-react';
import ConfigParams from '../constants/config';

type ToastState = {
  message: string;
  type: 'success' | 'error';
} | null;

const SupplierRegistrationPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null); 

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      submissionMethods: [],
      isActive: true
    }
  });

  const handleCloseToast = () => setToast(null);

  const onSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true);
    setToast(null); 
    try {
      await createSupplier(data);
      setToast({ message: '✅ Fornecedor cadastrado com sucesso!', type: 'success' });
      
      setTimeout(() => navigate('/fornecedores'), ConfigParams.DELAY_AFTER_SAVE); 

    } catch (error) {
      console.error('Erro ao cadastrar fornecedor:', error);
      const errorMessage = '❌ Falha ao cadastrar. Verifique a conexão ou os dados.';
      
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Cadastro de Fornecedor</h1>
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
                id="whatsapp"
                type="checkbox"
                value="whatsapp"
                {...register('submissionMethods')}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="whatsapp" className="ml-2 block text-sm text-gray-900">WhatsApp</label>
            </div>
            <div className="flex items-center">
              <input
                id="email"
                type="checkbox"
                value="email"
                {...register('submissionMethods')}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="email" className="ml-2 block text-sm text-gray-900">Email</label>
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
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Cadastrando...
            </span>
          ) : (
            'Cadastrar Fornecedor'
          )}
        </Button>
      </form>
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};

export default SupplierRegistrationPage;