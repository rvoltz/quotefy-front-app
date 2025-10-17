import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, CheckCircle, XCircle, Edit } from 'lucide-react';
import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';
import { getSupplierGroupById } from '../services/supplierGroupService';
import type { SupplierGroupFormData } from '../schemas/supplierGroupSchema';
import { getSuppliersForSelector } from '../services/supplierService';
import type { SelectorSupplier } from '../schemas/supplierSchema';


type ToastState = { message: string, type: 'success' | 'error' } | null;

const SupplierGroupViewPage = () => {
    const navigate = useNavigate();
    const { groupId } = useParams<{ groupId: string }>(); // Obtém o ID da URL
    const groupIdNum = parseInt(groupId || '0');

    const [isLoading, setIsLoading] = useState(true);
    const [groupData, setGroupData] = useState<SupplierGroupFormData | null>(null);
    const [availableSuppliers, setAvailableSuppliers] = useState<SelectorSupplier[]>([]);
    const [toast, setToast] = useState<ToastState>(null);

    const handleCloseToast = () => setToast(null);

    const selectedSupplierObjects = useMemo(() => {
        if (!groupData) return [];
        return availableSuppliers.filter(s => groupData.suppliers.includes(String(s.id)));
    }, [groupData, availableSuppliers]);


    // Efeito para carregar o grupo E os fornecedores
    useEffect(() => {
        if (!groupId || groupIdNum <= 0) {
            setIsLoading(false);
            setToast({ message: 'ID do grupo inválido na URL.', type: 'error' });
            return;
        }

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // 1. Carregar lista de fornecedores disponíveis (necessário para mapear os IDs)
                const suppliersData = await getSuppliersForSelector();
                setAvailableSuppliers(suppliersData);

                // 2. Carregar dados do grupo (usa mapApiDataToFormData que converte para string[])
                const data = await getSupplierGroupById(groupIdNum);
                setGroupData(data); 

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                setToast({ message: 'Falha ao carregar dados do grupo ou fornecedores.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [groupId, groupIdNum]);
    
    // Função para voltar à lista
    const handleGoBack = () => {
        navigate('/grupos-fornecedores');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                <p className="ml-3 text-gray-600">Carregando detalhes do grupo...</p>
            </div>
        );
    }

    if (!groupData) {
        return (
            <div className="p-6 max-w-xl mx-auto text-center">
                <p className="text-xl text-red-600">Grupo de Fornecedor não encontrado ou ID inválido.</p>
                <Button onClick={handleGoBack} className="mt-4">
                    <ArrowLeft className="h-5 w-5 mr-2" /> Voltar para a lista
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-800">
                    Detalhes Grupo ({groupId})
                </h1>
                <Button onClick={handleGoBack} className="group">
                    <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" /> Voltar
                </Button>
            </div>

            <div className="space-y-6">
                
                {/* Detalhes Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                    {/* Descrição */}
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase">Descrição do Grupo</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{groupData.description}</p>
                    </div>

                    {/* Status Ativo */}
                    <div className="self-center">
                        <p className="text-sm font-semibold text-gray-500 uppercase">Status</p>
                        <div className="flex items-center mt-1">
                            {groupData.isActive ? (
                                <span className="flex items-center text-lg font-bold text-green-600">
                                    <CheckCircle className="h-5 w-5 mr-2" /> Ativo
                                </span>
                            ) : (
                                <span className="flex items-center text-lg font-bold text-red-600">
                                    <XCircle className="h-5 w-5 mr-2" /> Inativo
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lista de Fornecedores Selecionados */}
                <div className="pt-4 border-t border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Fornecedores Associados ({selectedSupplierObjects.length})
                    </h2>

                    {selectedSupplierObjects.length === 0 ? (
                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-lg">
                            Este grupo não possui fornecedores associados.
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                            {selectedSupplierObjects.map((supplier) => (
                                <div 
                                    key={supplier.id} 
                                    className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
                                >
                                    <span className="font-medium text-gray-700">{supplier.name}</span>
                                    <span className="text-xs font-semibold text-gray-500">ID: {supplier.id}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Botão de Edição */}
                <div className="pt-6 border-t border-gray-200">
                    <Button 
                        onClick={() => navigate(`/editar-grupo-fornecedor/${groupId}`)} 
                        className="w-full" 
                    >
                        <Edit className="h-5 w-5 mr-2" /> Editar Este Grupo
                    </Button>
                </div>
            </div>
            
            {toast && <ToastMessage message={toast.message} type={toast.type} onClose={handleCloseToast} />}
        </div>
    );
};

export default SupplierGroupViewPage;
