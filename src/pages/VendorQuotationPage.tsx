import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface QuotationRequestItem {
  partName: string;
  quantity: number;
}

interface QuotationRequest {
  id: string;
  vehicle: string;
  engine: string;
  fuelType: string;
  requestingCompany: {
    name: string;
    contactName: string;
    phone: string;
  };
  items: QuotationRequestItem[];
  status: 'pending' | 'submitted' | 'expired';
}

interface VendorResponse {
  vendorName: string;
  items: {
    partName: string;
    unitPrice: number;
    totalPrice: number;
    brand: string;
    quantity: number;
  }[];
  freightCost: number;
}

const mockFetchQuotation = (token: string): Promise<QuotationRequest | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (token === 'valid-token-123') {
        resolve({
          id: 'q1',
          vehicle: 'Honda Civic 2020',
          engine: '1.5 Turbo',
          fuelType: 'Gasolina',
          requestingCompany: { name: 'Oficina Rápida', contactName: 'José Antunes', phone: '(11) 98765-4321' },
          items: [
            { partName: 'Pastilha de Freio', quantity: 1 },
            { partName: 'Filtro de Ar', quantity: 1 },
          ],
          status: 'pending',
        });
      } else if (token === 'submitted-token-456') {
        resolve({
          id: 'q2',
          vehicle: 'Toyota Corolla 2021',
          engine: '2.0 Flex',
          fuelType: 'Flex',
          requestingCompany: { name: 'Auto Peças ABC', contactName: 'João Silva', phone: '(21) 91234-5678' },
          items: [{ partName: 'Amortecedor Dianteiro', quantity: 2 }],
          status: 'submitted',
        });
      } else {
        resolve(null);
      }
    }, 1000);
  });
};

const VendorQuotationPage = () => {
  const { quotationToken } = useParams<{ quotationToken: string }>();
  const [quotation, setQuotation] = useState<QuotationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [itemData, setItemData] = useState<Record<string, { unitPrice: number; brand: string }>>({});
  const [freight, setFreight] = useState(0);
  // NOVO: Estado para o checkbox
  const [isFreightCourtesy, setIsFreightCourtesy] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const loadQuotation = async () => {
      if (!quotationToken) {
        setError('Token da cotação não fornecido.');
        setLoading(false);
        return;
      }
      try {
        const data = await mockFetchQuotation(quotationToken);
        if (!data) {
          setError('Cotação não encontrada ou token inválido.');
        } else if (data.status !== 'pending') {
          setError(`A cotação já foi ${data.status === 'submitted' ? 'enviada' : 'finalizada'} ou expirou.`);
        } else {
          setQuotation(data);
          const initialItemData = data.items.reduce((acc, item) => {
            acc[item.partName] = { unitPrice: 0, brand: '' };
            return acc;
          }, {} as Record<string, { unitPrice: number; brand: string }>);
          setItemData(initialItemData);
        }
      } catch (err) {
        setError('Ocorreu um erro ao carregar a cotação.' + err);
      } finally {
        setLoading(false);
      }
    };
    loadQuotation();
  }, [quotationToken]);

  const handleItemChange = (partName: string, field: 'unitPrice' | 'brand', value: string) => {
    setItemData(prev => ({
      ...prev,
      [partName]: {
        ...prev[partName],
        [field]: field === 'unitPrice' ? (parseFloat(value.replace(',', '.')) || 0) : value,
      },
    }));
  };
  
  // NOVO: Adicionei a função para lidar com a mudança do checkbox
  const handleFreightCourtesyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsFreightCourtesy(isChecked);
    if (isChecked) {
        setFreight(0); // Zera o frete se o checkbox estiver marcado
    }
  };
  
  // NOVO: Adicionei a função para lidar com a mudança do frete, desmarcando o checkbox
  const handleFreightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(',', '.')) || 0;
    setFreight(value);
    if (value > 0) {
        setIsFreightCourtesy(false); // Desmarca o checkbox se o frete for maior que zero
    }
  };

  const handleSubmit = async () => {
    if (!quotation) return;
    const allPricesFilled = quotation.items.every(item => itemData[item.partName].unitPrice > 0);
    const allBrandsFilled = quotation.items.every(item => itemData[item.partName].brand.trim() !== '');

    if (!allPricesFilled) {
      alert('Por favor, preencha o preço unitário de todos os itens.');
      return;
    }
    if (!allBrandsFilled) {
      alert('Por favor, preencha a marca de todos os itens.');
      return;
    }
    if (vendorName.trim() === '') {
      alert('Por favor, preencha o seu nome de vendedor.');
      return;
    }

    setIsSubmitting(true);
    const vendorResponse: VendorResponse = {
      vendorName: vendorName,
      items: quotation.items.map(item => ({
        partName: item.partName,
        quantity: item.quantity,
        unitPrice: itemData[item.partName].unitPrice,
        totalPrice: itemData[item.partName].unitPrice * item.quantity,
        brand: itemData[item.partName].brand,
      })),
      // NOVO: O custo do frete é 0 se for cortesia
      freightCost: isFreightCourtesy ? 0 : freight,
    };
    console.log('Dados a serem enviados:', vendorResponse);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Falha ao enviar a cotação:', err);
      setIsSubmitting(false);
      setError('Erro ao enviar a cotação. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-6 text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-800 mb-2">Erro</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-green-800 mb-2">Cotação Enviada!</h1>
        <p className="text-gray-600">Agradecemos por sua participação. Sua cotação foi recebida com sucesso.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg my-8">
      <div className="border-b border-gray-200 pb-4 mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Solicitação de Cotação</h1>
        <p className="text-lg text-gray-600 mt-1">Veículo: {quotation?.vehicle}</p>
        <div className="flex flex-wrap justify-center gap-x-4 mt-2 text-sm text-gray-500">
          <p>Motor: <strong>{quotation?.engine}</strong></p>
          <p>Combustível: <strong>{quotation?.fuelType}</strong></p>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <p>Solicitado por: <strong>{quotation?.requestingCompany.name}</strong></p>
          <p>Contato: {quotation?.requestingCompany.contactName} - {quotation?.requestingCompany.phone}</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Peças para Cotar
        </h2>
        <div className="space-y-4">
          {quotation?.items.map(item => (
            <div key={item.partName} className="bg-gray-50 p-4 rounded-md shadow-sm">
              <span className="font-medium text-gray-900 block mb-2">{item.partName} ({item.quantity} un.)</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2">
                <div>
                  <label htmlFor={`unit-price-${item.partName}`} className="block text-xs font-medium text-gray-700">
                    Preço Unitário (R$) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`unit-price-${item.partName}`}
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={itemData[item.partName]?.unitPrice === 0 ? '' : itemData[item.partName]?.unitPrice.toString().replace('.', ',')}
                    onChange={(e) => handleItemChange(item.partName, 'unitPrice', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0,00"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`brand-${item.partName}`} className="block text-xs font-medium text-gray-700">
                    Marca <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`brand-${item.partName}`}
                    value={itemData[item.partName]?.brand}
                    onChange={(e) => handleItemChange(item.partName, 'brand', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Bosch"
                    required
                  />
                </div>
                <div className="self-end md:self-auto">
                  <p className="block text-xs font-medium text-gray-700">Preço Total:</p>
                  <p className="text-lg font-bold text-gray-800 mt-1 md:mt-0">
                    R$ {(itemData[item.partName]?.unitPrice * item.quantity || 0).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm">
            <span className="font-medium text-gray-900">Frete</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">R$</span>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                value={freight === 0 ? '' : freight.toString().replace('.', ',')}
                // NOVO: Adiciona o manipulador de eventos para o frete
                onChange={handleFreightChange}
                className="w-32 border border-gray-300 rounded-md py-2 px-3 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0,00"
                // NOVO: Desabilita o input se o frete for cortesia
                disabled={isFreightCourtesy}
              />
            </div>
            {/* NOVO: Checkbox para Frete Cortesia */}
            <div className="flex items-center ml-4">
                <input 
                    id="frete-cortesia"
                    name="frete-cortesia"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={isFreightCourtesy}
                    onChange={handleFreightCourtesyChange}
                />
                <label htmlFor="frete-cortesia" className="ml-2 block text-sm text-gray-700">
                    Frete Cortesia
                </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Vendedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="vendorName"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Seu nome"
              required
            />
          </div>
        </div>

        <div className="mt-8">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              'Enviar Cotação'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VendorQuotationPage;