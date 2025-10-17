import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, CheckCircle, XCircle, Edit } from 'lucide-react';
import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';
import { fetchSupplier } from '../services/supplierService';
import { CLASSIFICATION_OPTIONS } from '../constants/supplierConstants';
import type { SupplierFormData } from '../schemas/supplierSchema';


type ToastState = { message: string, type: 'success' | 'error' } | null;

const SupplierViewPage = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [supplierData, setSupplierData] = useState<SupplierFormData | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const handleCloseToast = () => setToast(null);

  const classificationLabel = useMemo(() => {
    if (!supplierData) return 'N/A';
    const option = CLASSIFICATION_OPTIONS.find(opt => opt.value === supplierData.classification);
    return option ? option.label : 'Não Classificado';
  }, [supplierData]);

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
        
        const data = await fetchSupplier(supplierId);
        setSupplierData(data);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setToast({ message: 'Falha ao carregar dados do fornecedor.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
    loadSupplierData();
  }, [id]);

  const handleGoBack = () => {
    navigate('/fornecedores');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="ml-3 text-gray-600">Carregando dados do fornecedor...</p>
      </div>
    );
  }

  if (!supplierData) {
    return (
        <div className="p-6 max-w-xl mx-auto text-center">
            <p className="text-xl text-red-600">Fornecedor não encontrado ou ID inválido.</p>
            <Button onClick={handleGoBack} className="mt-4">
                <ArrowLeft className="h-5 w-5 mr-2" /> Voltar para a lista
            </Button>
        </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Detalhes de Fornecedor
        </h1>
        <Button onClick={handleGoBack} className="group">
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" /> Voltar
        </Button>
      </div>

      <div className="space-y-6">

        {/* Seção Principal de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            
            {/* Nome */}
            <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Nome da Empresa</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{supplierData.name}</p>
            </div>

            {/* Classificação */}
            <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Classificação</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{classificationLabel}</p>
            </div>
            
            {/* Vendedor */}
            <div className='col-span-full'>
                <p className="text-sm font-semibold text-gray-500 uppercase">Vendedor / Contato Comercial</p>
                <p className="text-lg text-gray-700 mt-1">{supplierData.seller}</p>
            </div>
        </div>

        {/* Seção de Contato e Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
            
            {/* Email */}
            <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">E-mail</p>
                <a 
                    href={`mailto:${supplierData.email}`} 
                    className="text-indigo-600 hover:text-indigo-800 break-words mt-1 block"
                >
                    {supplierData.email}
                </a>
            </div>

            {/* WhatsApp */}
            <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">WhatsApp</p>               
                    {supplierData.whatsapp}        
            </div>

            {/* Status Ativo */}
            <div className="self-center">
                <p className="text-sm font-semibold text-gray-500 uppercase">Status</p>
                <div className="flex items-center mt-1">
                    {supplierData.isActive ? (
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

        {/* Seção de Modos de Envio */}
        <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Modos de Envio de Cotação Preferidos</h2>
            <div className="flex flex-wrap gap-3">
                {supplierData.submissionMethods && supplierData.submissionMethods.length > 0 ? (
                    supplierData.submissionMethods.map(method => (
                        <span 
                            key={method} 
                            className="px-4 py-1 bg-orange-100 text-orange-700 font-medium text-sm rounded-full shadow-md"
                        >
                            {method.toUpperCase()}
                        </span>
                    ))
                ) : (
                    <span className="text-gray-500">Nenhum modo de envio definido.</span>
                )}
            </div>
        </div>

        {/* Botão de Edição */}
        <div className="pt-6 border-t border-gray-200">
          <Button 
            onClick={() => navigate(`/editar-fornecedor/${id}`)}      
            className="w-full"
          >
            <Edit className="h-5 w-5 mr-2" /> Editar Este Fornecedor
          </Button>
        </div>

      </div>
      
      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={handleCloseToast} />}
    </div>
  );
};

export default SupplierViewPage;
