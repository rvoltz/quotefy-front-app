import { useMemo, useEffect, useState, useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import SearchableDropdown from '../components/SearchableDropdown';
import type { NewQuotationFormData } from '../schemas/quotationSchema';
import { newQuotationFormSchema } from '../schemas/quotationSchema';

// Dados mock de grupos de fornecedores (simulando uma API)
const mockVendorGroups = [
  { id: 'g1', name: 'Grupo de Pneus', suppliers: [{ id: 's4', name: 'Fornecedor Universal' }] },
  { id: 'g2', name: 'Grupo de Peças', suppliers: [{ id: 's1', name: 'Auto Peças ABC' }, { id: 's2', name: 'Distribuidora de Peças XYZ' }] },
  { id: 'g3', name: 'Grupo de Peças e Lubrificantes', suppliers: [{ id: 's5', name: 'Componentes Automotivos' }] },
];

const NewQuotationPage = () => {
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<NewQuotationFormData>({
    resolver: zodResolver(newQuotationFormSchema),
    defaultValues: {
      licensePlate: '',
      model: '',
      brand: '',
      year: undefined,
      engine: '',
      items: [{ itemDescription: '', itemBrand: '', quantity: 1 }],
      selectedVendorGroupId: '', // Novo campo para o ID do grupo
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const enteredLicensePlate = watch('licensePlate');
  const [foundByLicensePlate, setFoundByLicensePlate] = useState<boolean | null>(null);
  const [isLoadingVehicleData, setIsLoadingVehicleData] = useState(false);

  // ... (dados mock de veículos, marcas e anos, e as funções `fetchVehicleData`, `useEffect`)
  
  // Dados mock de veículos por placa (para simular a resposta da API)
  const mockVehiclesApiData = useMemo(() => ([
    { licensePlate: 'ABC1234', model: 'Civic', brand: 'Honda', year: 2020, engine: '2.0 Flex' },
    { licensePlate: 'XYZ5678', model: 'Corolla', brand: 'Toyota', year: 2021, engine: '1.8 Hybrid' },
    { licensePlate: 'DEF9012', model: 'Onix', brand: 'Chevrolet', year: 2019, engine: '1.0 Turbo' },
    { licensePlate: 'GHI3456', model: 'HB20', brand: 'Hyundai', year: 2022, engine: '1.0 Aspirado' },
  ]), []);

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
  
  const fetchVehicleData = useCallback(async (licensePlate: string) => { // Parâmetro renomeado
    setIsLoadingVehicleData(true);
    setFoundByLicensePlate(null); 
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const foundVehicle = mockVehiclesApiData.find(v => v.licensePlate.toUpperCase() === licensePlate.toUpperCase());
      if (foundVehicle) {
        setFoundByLicensePlate(true);
        setValue('model', foundVehicle.model);
        setValue('brand', foundVehicle.brand);
        setValue('year', foundVehicle.year);
        setValue('engine', foundVehicle.engine);
      } else {
        setFoundByLicensePlate(false);
        setValue('model', '');
        setValue('brand', '');
        setValue('year', undefined);
        setValue('engine', '');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do veículo:', error);
      setFoundByLicensePlate(false);
      setValue('model', '');
      setValue('brand', '');
      setValue('year', undefined);
      setValue('engine', '');
    } finally {
      setIsLoadingVehicleData(false);
    }
  }, [mockVehiclesApiData, setValue]);

  useEffect(() => {
    if (enteredLicensePlate.trim().length >= 7) {
      fetchVehicleData(enteredLicensePlate);
    } else {
      setFoundByLicensePlate(null);
      setIsLoadingVehicleData(false);
      setValue('model', '');
      setValue('brand', '');
      setValue('year', undefined);
      setValue('engine', '');
    }
  }, [enteredLicensePlate, fetchVehicleData, setValue]);
  
  const onSubmit = async (data: NewQuotationFormData) => {
    console.log('Dados da Nova Cotação:', data);
    const selectedGroup = mockVendorGroups.find(group => group.id === data.selectedVendorGroupId);
    console.log('Grupo selecionado:', selectedGroup);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Cotação criada e enviada aos fornecedores do grupo selecionado! (Verifique o console para os dados)');
  };

  const showLowerSections = enteredLicensePlate.trim().length >= 7;

  // Mapeia os dados dos grupos para o formato que o SearchableDropdown espera
  const vendorGroupOptions = useMemo(() => {
    return mockVendorGroups.map(group => ({
      value: group.id,
      label: group.name,
    }));
  }, []);


  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Criar Nova Cotação</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ... (Seção de Placa) */}
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
              maxLength={7}
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

        {/* ... (Seção de Detalhes do Veículo - Mantém a lógica) */}
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
                      value={field.value !== undefined ? String(field.value) : ''}
                      onChange={(selectedValue: string) => field.onChange(parseInt(selectedValue, 10))}
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

        {/* ... (Seção de Adição de Peças) */}
        {showLowerSections && (
          <div className="p-4 border rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">3. Adicione as Peças e Quantidades</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 mb-4 p-3 border border-gray-200 rounded-md bg-white items-end">
                {/* Campo de Descrição da Peça */}
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
                {/* Campo de Quantidade */}
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

        {/* Seleção do Grupo de Fornecedores - NOVO CAMPO */}
        {showLowerSections && fields.length > 0 && (
          <div className="p-4 border rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">4. Selecione o Grupo de Fornecedores</h2>
            <div>
              <label htmlFor="vendorGroup" className="block text-sm font-medium text-gray-700">Grupo de Fornecedores</label>
              <Controller
                name="selectedVendorGroupId"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    options={vendorGroupOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione um grupo..."
                    name={field.name}
                  />
                )}
              />
              {errors.selectedVendorGroupId && <p className="mt-1 text-sm text-red-600">{errors.selectedVendorGroupId.message}</p>}
            </div>
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