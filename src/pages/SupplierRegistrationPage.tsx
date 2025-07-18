import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/Button'; // Importa o Button do novo caminho
import { supplierSchema } from '../schemas/supplierSchema'; // Importa o schema e o tipo
import type { SupplierFormData } from '../schemas/supplierSchema'; // Importa o schema e o tipo

const SupplierRegistrationPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      submissionMethods: [],
      isActive: true, // Por padrão, ativo
    }
  });

  const onSubmit = (data: SupplierFormData) => {
    console.log('Dados do Fornecedor:', data);
    alert('Fornecedor cadastrado com sucesso! (Verifique o console para os dados)');
    reset();
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">Rua</label>
            <input
              id="street"
              {...register('street')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            />
            {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
          </div>
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">Número</label>
            <input
              id="number"
              {...register('number')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            />
            {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Bairro</label>
            <input
              id="neighborhood"
              {...register('neighborhood')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            />
            {errors.neighborhood && <p className="mt-1 text-sm text-red-600">{errors.neighborhood.message}</p>}
          </div>
          <div>
            <label htmlFor="cityState" className="block text-sm font-medium text-gray-700">Cidade/Estado</label>
            <input
              id="cityState"
              {...register('cityState')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            />
            {errors.cityState && <p className="mt-1 text-sm text-red-600">{errors.cityState.message}</p>}
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

        <Button type="submit" className="w-full">
          Cadastrar Fornecedor
        </Button>
      </form>
    </div>
  );
};

export default SupplierRegistrationPage;