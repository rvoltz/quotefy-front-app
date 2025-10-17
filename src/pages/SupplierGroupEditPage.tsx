import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import Button from '../components/Button.jsx';
import ToastMessage from '../components/ToastMessage.jsx';
import SupplierSelector from '../components/SupplierSelector.tsx';
import { getSupplierGroupById, updateSupplierGroup } from '../services/supplierGroupService.ts';
import { getSuppliersForSelector } from '../services/supplierService.ts'; 
import { supplierGroupSchema } from '../schemas/supplierGroupSchema.ts';
import type { SupplierGroupFormData } from '../schemas/supplierGroupSchema.ts';
import type { SelectorSupplier } from '../schemas/supplierSchema.ts';
import ConfigParams from '../constants/config';


type ToastState = { message: string, type: 'success' | 'error' } | null;

const SupplierGroupEditPage = () => {
    const navigate = useNavigate();
    const { groupId } = useParams<{ groupId: string }>(); 
    const groupIdNum = parseInt(groupId || '0');

    // Estados de UI e Dados
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<ToastState>(null);
    const [availableSuppliers, setAvailableSuppliers] = useState<SelectorSupplier[]>([]);

    const {
        handleSubmit,
        control,
        register,
        formState: { errors },
        reset
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
        if (!groupId || groupIdNum <= 0) {
            setIsLoading(false);
            setToast({ message: 'ID do grupo inválido na URL.', type: 'error' });
            return;
        }

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const suppliersData = await getSuppliersForSelector();
                setAvailableSuppliers(suppliersData);

                const groupData = await getSupplierGroupById(groupIdNum);

                reset(groupData); 

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                setToast({ message: 'Falha ao carregar dados do grupo ou fornecedores.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [groupId, groupIdNum, reset]);


    const onSubmit = async (data: SupplierGroupFormData) => {
        if (groupIdNum <= 0) return;
        setIsSubmitting(true);
        setToast(null);

        try {
            await updateSupplierGroup(groupIdNum, data);
            setToast({ message: '✅ Grupo de Fornecedor atualizado com sucesso!', type: 'success' });
            
            setTimeout(() => navigate('/grupos-fornecedores'), ConfigParams.DELAY_AFTER_SAVE);

        } catch (error) {
            console.error('Erro ao atualizar grupo:', error);
            setToast({ message: '❌ Falha ao atualizar grupo. Verifique os dados.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                <p className="ml-3 text-gray-600">Carregando dados do grupo...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  Editar Grupo de Fornecedor (ID: <span className="text-orange-600">{groupId}</span>)
              </h1>
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
                                availableSuppliers={availableSuppliers} 
                                selectedSuppliers={availableSuppliers.filter(s => field.value.includes(String(s.id)))}
                                onSelectedChange={(newSelected) => {
                                    field.onChange(newSelected.map(s => s.id));
                                }}
                            />
                        )}
                    />
                    {errors.suppliers && <p className="mt-1 text-sm text-red-600">{errors.suppliers.message}</p>}
                </div>

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

export default SupplierGroupEditPage;