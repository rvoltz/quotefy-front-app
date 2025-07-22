import { useMemo, useEffect, useState, useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import SearchableDropdown from '../components/SearchableDropdown';
import type { NewQuotationFormData } from '../schemas/quotationSchema';
import { newQuotationFormSchema } from '../schemas/quotationSchema';


const NewQuotationPage = () => {
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<NewQuotationFormData>({
    resolver: zodResolver(newQuotationFormSchema),
    defaultValues: {
      licensePlate: '',
      model: '',
      brand: '',
      year: undefined,
      engine: '',
      items: [{ itemDescription: '', itemBrand: '', quantity: 1 }], // Default values atualizados
      selectedVendorIds: [], // Renomeado
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items', // Renomeado de 'parts'
  });

  const enteredLicensePlate = watch('licensePlate'); // Observa o valor do campo placa
  const [foundByLicensePlate, setFoundByLicensePlate] = useState<boolean | null>(null); // Estado para controlar se o veículo foi encontrado (null para não verificado)
  const [isLoadingVehicleData, setIsLoadingVehicleData] = useState(false); // Estado para o carregamento da API

  // Dados mock de veículos por placa (para simular a resposta da API)
  const mockVehiclesApiData = useMemo(() => ([
    { licensePlate: 'ABC1234', model: 'Civic', brand: 'Honda', year: 2020, engine: '2.0 Flex' },
    { licensePlate: 'XYZ5678', model: 'Corolla', brand: 'Toyota', year: 2021, engine: '1.8 Hybrid' },
    { licensePlate: 'DEF9012', model: 'Onix', brand: 'Chevrolet', year: 2019, engine: '1.0 Turbo' },
    { licensePlate: 'GHI3456', model: 'HB20', brand: 'Hyundai', year: 2022, engine: '1.0 Aspirado' },
  ]), []);

  // Dados mock de fornecedores (apenas os ativos)
  const allVendors = useMemo(() => ([ // Renomeado de 'allSuppliers'
    { id: 's1', name: 'Auto Peças ABC', isActive: true },
    { id: 's2', name: 'Distribuidora de Peças XYZ', isActive: true },
    { id: 's3', name: 'Peças Rápidas LTDA', isActive: false },
    { id: 's4', name: 'Fornecedor Universal', isActive: true },
    { id: 's5', name: 'Componentes Automotivos', isActive: true },
  ]), []);

  const activeVendors = useMemo(() => { // Renomeado de 'activeSuppliers'
    return allVendors.filter(vendor => vendor.isActive);
  }, [allVendors]);

  // Dados mock de Marcas para o veículo
  const allBrands = useMemo(() => ([
    { value: 'Honda', label: 'Honda' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Chevrolet', label: 'Chevrolet' },
    { value: 'Hyundai', label: 'Hyundai' },
    { value: 'Ford', label: 'Ford' },
    { value: 'Volkswagen', label: 'Volkswagen' },
    { value: 'Fiat', label: 'Fiat' },
  ]), []);

  // Dados para o campo Ano (últimos 30 anos)
  const allYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 30; i++) {
      const year = currentYear - i;
      years.push({ value: String(year), label: String(year) });
    }
    return years;
  }, []);

  // Função para buscar dados do veículo pela placa (simulada)
  const fetchVehicleData = useCallback(async (licensePlate: string) => { // Parâmetro renomeado
    setIsLoadingVehicleData(true);
    setFoundByLicensePlate(null); // Resetar o estado de encontrado ao iniciar a busca

    try {
      // Simulação de chamada de API
      // Em um cenário real, você faria:
      // const response = await fetch(`https://sua-api.com/veiculos/${licensePlate}`);
      // const data = await response.json();

      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simular a busca nos dados mockados
      const foundVehicle = mockVehiclesApiData.find(v => v.licensePlate.toUpperCase() === licensePlate.toUpperCase());

      if (foundVehicle) {
        setFoundByLicensePlate(true);
        setValue('model', foundVehicle.model);
        setValue('brand', foundVehicle.brand);
        setValue('year', foundVehicle.year);
        setValue('engine', foundVehicle.engine);
      } else {
        setFoundByLicensePlate(false);
        // Limpa os campos se a placa não for encontrada, permitindo preenchimento manual
        setValue('model', '');
        setValue('brand', '');
        setValue('year', undefined);
        setValue('engine', '');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do veículo:', error);
      setFoundByLicensePlate(false); // Em caso de erro, trate como não encontrado
      // Limpa os campos em caso de erro
      setValue('model', '');
      setValue('brand', '');
      setValue('year', undefined);
      setValue('engine', '');
    } finally {
      setIsLoadingVehicleData(false);
    }
  }, [mockVehiclesApiData, setValue]);

  // Efeito para buscar detalhes do veículo quando a placa muda
  useEffect(() => {
    if (enteredLicensePlate.trim().length >= 7) {
      fetchVehicleData(enteredLicensePlate);
    } else {
      setFoundByLicensePlate(null); // Reseta o estado quando a placa está vazia ou menor que 7 caracteres
      setIsLoadingVehicleData(false); // Desativa o loading se a placa não atende ao critério
      // Limpa os campos se a placa estiver vazia ou curta
      setValue('model', '');
      setValue('brand', '');
      setValue('year', undefined);
      setValue('engine', '');
    }
  }, [enteredLicensePlate, fetchVehicleData, setValue]);

  const onSubmit = async (data: NewQuotationFormData) => {
    console.log('Dados da Nova Cotação:', data);
    // Simular envio para o backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Cotação criada e enviada aos fornecedores selecionados! (Verifique o console para os dados)');
    // Aqui você enviaria os dados para sua API
  };

  // Função para selecionar todos os fornecedores
  const handleSelectAllVendors = () => { // Renomeado
    const allActiveVendorIds = activeVendors.map(vendor => vendor.id); // Renomeado
    setValue('selectedVendorIds', allActiveVendorIds); // Renomeado
  };

  // Função para desmarcar todos os fornecedores
  const handleDeselectAllVendors = () => { // Renomeado
    setValue('selectedVendorIds', []); // Renomeado
  };

  // Condição para exibir as seções abaixo da placa
  const showLowerSections = enteredLicensePlate.trim().length >= 7;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Criar Nova Cotação</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo Placa - Primeira Etapa */}
        <div className="p-4 border rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">1. Informe a Placa</h2>
          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">Placa do Veículo</label>
            <input
              id="licensePlate"
              type="text"
              {...register('licensePlate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 uppercase"
              placeholder="Ex: ABC1234"
              maxLength={7} // Limita a 7 caracteres para placas padrão
            />
            {errors.licensePlate && <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>}
            {isLoadingVehicleData && (
              <p className="mt-2 text-sm text-gray-500">Buscando dados do veículo...</p>
            )}
            {!isLoadingVehicleData && enteredLicensePlate.trim().length >= 7 && foundByLicensePlate !== null && (
              foundByLicensePlate ? (
                <p className="mt-2 text-sm text-green-600">Veículo encontrado! Detalhes preenchidos automaticamente.</p>
              ) : (
                <p className="mt-2 text-sm text-red-600">Placa não encontrada. Por favor, preencha os detalhes do veículo manualmente.</p>
              )
            )}
            {enteredLicensePlate.trim().length > 0 && enteredLicensePlate.trim().length < 7 && (
              <p className="mt-2 text-sm text-yellow-600">Digite pelo menos 7 caracteres para a placa.</p>
            )}
          </div>
        </div>

        {/* Detalhes do Veículo - Habilitado se a placa tiver 7 ou mais caracteres */}
        {showLowerSections && (
          <div className="p-4 border rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {foundByLicensePlate ? '2. Detalhes do Veículo (Carregados)' : '2. Detalhes do Veículo (Preencha Manualmente)'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
                <input
                  id="model"
                  type="text"
                  {...register('model')}
                  readOnly={foundByLicensePlate === true || isLoadingVehicleData}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${foundByLicensePlate === true || isLoadingVehicleData ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-orange-500 focus:ring-orange-500'}`}
                />
              </div>
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <SearchableDropdown
                      options={allBrands}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Selecione a marca..."
                      name={field.name}
                      disabled={foundByLicensePlate === true || isLoadingVehicleData}
                    />
                  )}
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Ano</label>
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <SearchableDropdown
                      options={allYears}
                      value={field.value !== undefined ? String(field.value) : ''} // Converte para string para o dropdown
                      onChange={(selectedValue: string) => field.onChange(parseInt(selectedValue, 10))} // Converte de volta para number
                      placeholder="Selecione o ano..."
                      name={field.name}
                      disabled={foundByLicensePlate === true || isLoadingVehicleData}
                    />
                  )}
                />
              </div>
              <div>
                <label htmlFor="engine" className="block text-sm font-medium text-gray-700">Motor</label>
                <input
                  id="engine"
                  type="text"
                  {...register('engine')}
                  readOnly={foundByLicensePlate === true || isLoadingVehicleData}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${foundByLicensePlate === true || isLoadingVehicleData ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-orange-500 focus:ring-orange-500'}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Adição de Peças - Habilitado se a placa tiver 7 ou mais caracteres */}
        {showLowerSections && (
          <div className="p-4 border rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">3. Adicione as Peças e Quantidades</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 mb-4 p-3 border border-gray-200 rounded-md bg-white items-end">
                {/* Campo de Descrição da Peça - Aumentado */}
                <div className="w-full md:w-2/5">
                  <label htmlFor={`items.${index}.itemDescription`} className="block text-sm font-medium text-gray-700">Descrição da Peça</label>
                  <input
                    id={`items.${index}.itemDescription`}
                    type="text"
                    {...register(`items.${index}.itemDescription` as const)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                    placeholder="Ex: Pastilha de Freio Dianteira"
                  />
                  {errors.items?.[index]?.itemDescription && <p className="mt-1 text-sm text-red-600">{errors.items[index].itemDescription?.message}</p>}
                </div>
                {/* Campo de Marca da Peça */}
                <div className="w-full md:w-1/3">
                  <label htmlFor={`items.${index}.itemBrand`} className="block text-sm font-medium text-gray-700">Marca da Peça (Opcional)</label>
                  <input
                    id={`items.${index}.itemBrand`}
                    type="text"
                    {...register(`items.${index}.itemBrand` as const)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                    placeholder="Ex: Bosch"
                  />
                </div>
                {/* Campo de Quantidade - Diminuído */}
                <div className="w-full md:w-1/6">
                  <label htmlFor={`items.${index}.quantity`} className="block text-sm font-medium text-gray-700">Quantidade</label>
                  <input
                    id={`items.${index}.quantity`}
                    type="number"
                    {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                  />
                  {errors.items?.[index]?.quantity && <p className="mt-1 text-sm text-red-600">{errors.items[index].quantity?.message}</p>}
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
              onClick={() => append({ itemDescription: '', itemBrand: '', quantity: 1 })}
              variant="outline"
              className="mt-4 w-full flex items-center justify-center gap-2 text-orange-700 border-orange-500 hover:bg-orange-50"
            >
              <PlusCircle className="h-5 w-5" /> Adicionar Peça
            </Button>
            {errors.items && typeof errors.items.message === 'string' && <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>}
          </div>
        )}

        {/* Seleção de Fornecedores - Habilitado se a placa tiver 7 ou mais caracteres e pelo menos uma peça adicionada */}
        {showLowerSections && fields.length > 0 && (
          <div className="p-4 border rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">4. Selecione os Fornecedores para Envio</h2>
            <div className="flex justify-end gap-2 mb-4"> {/* Botões Selecionar/Desmarcar Todos */}
              <Button
                type="button"
                onClick={handleSelectAllVendors}
                variant="outline"
                className="text-sm px-3 py-1 border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Selecionar Todos
              </Button>
              <Button
                type="button"
                onClick={handleDeselectAllVendors}
                variant="outline"
                className="text-sm px-3 py-1 border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Desmarcar Todos
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeVendors.length > 0 ? (
                activeVendors.map(vendor => (
                  <div key={vendor.id} className="flex items-center p-2 border rounded-md bg-white shadow-sm">
                    <input
                      id={`vendor-${vendor.id}`}
                      type="checkbox"
                      value={vendor.id}
                      {...register('selectedVendorIds')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`vendor-${vendor.id}`} className="ml-2 block text-sm font-medium text-gray-900">
                      {vendor.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 col-span-full">Nenhum fornecedor ativo encontrado.</p>
              )}
            </div>
            {errors.selectedVendorIds && <p className="mt-1 text-sm text-red-600">{errors.selectedVendorIds.message}</p>}
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