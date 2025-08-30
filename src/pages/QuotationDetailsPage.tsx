import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import Button from '../components/Button';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import type { Quotation } from '../schemas/quotationSchema';
import { format } from 'date-fns';

// Define o tipo para um item de cotação enviado por um fornecedor
interface VendorQuotationItem {
  partName: string;
  quantity: number;
  price: number;
}

// Define o tipo para a oferta completa de um fornecedor
interface VendorQuote {
  vendorId: string;
  vendorName: string;
  date: string;
  items: VendorQuotationItem[];
  freightCost: number;
}

// Dados mockados para simular as ofertas de cotação recebidas
const mockQuotationOffers: Record<string, VendorQuote[]> = {
  'q1': [
    {
      vendorId: 's1', vendorName: 'Auto Peças ABC', date: new Date().toISOString(),
      items: [
        { partName: 'Pastilha de Freio', quantity: 1, price: 250.00 },
        { partName: 'Filtro de Ar', quantity: 1, price: 95.00 },
      ],
      freightCost: 25.50,
    },
    {
      vendorId: 's2', vendorName: 'Distribuidora XYZ', date: new Date().toISOString(),
      items: [
        { partName: 'Pastilha de Freio', quantity: 1, price: 260.00 },
        { partName: 'Filtro de Ar', quantity: 1, price: 105.00 },
      ],
      freightCost: 0.00,
    },
  ],
  'q2': [
    {
      vendorId: 's5', vendorName: 'Componentes Automotivos', date: new Date().toISOString(),
      items: [
        { partName: 'Amortecedor Dianteiro', quantity: 2, price: 325.00 },
      ],
      freightCost: 40.00,
    },
    {
      vendorId: 's4', vendorName: 'Fornecedor Universal', date: new Date().toISOString(),
      items: [
        { partName: 'Amortecedor Dianteiro', quantity: 2, price: 350.00 },
      ],
      freightCost: 0.00,
    },
  ],
  'q3': [
    {
      vendorId: 's1', vendorName: 'Auto Peças ABC', date: new Date().toISOString(),
      items: [
        { partName: 'Vela de Ignição', quantity: 4, price: 30.00 },
      ],
      freightCost: 15.00,
    },
  ],
  'q4': [
    {
      vendorId: 's4', vendorName: 'Fornecedor Universal', date: new Date().toISOString(),
      items: [
        { partName: 'Pneu Aro 15', quantity: 4, price: 400.00 },
      ],
      freightCost: 60.00,
    },
  ],
};

// Dados mockados de cotações com os novos campos 'status' e 'confirmedVendorId'
const mockQuotations: Quotation[] = [
  {
    id: 'q1',
    licensePlate: 'ABC1234',
    date: new Date().toISOString(),
    model: 'Civic',
    brand: 'Honda',
    year: 2020,
    engine: '2.0',
    items: [
      { partName: 'Pastilha de Freio', quantity: 1 },
      { partName: 'Filtro de Ar', quantity: 1 },
    ],
    status: 'Aberta',
    user: { id: 'u1', name: 'João Silva' }
  },
  {
    id: 'q2',      
    date: new Date().toISOString(),
    licensePlate: 'XYZ5678',
    model: 'Corolla',
    brand: 'Toyota',
    year: 2021,
    items: [{ partName: 'Amortecedor Dianteiro', quantity: 2}],
    status: 'Pedido confirmado',
    confirmedVendorId: 's5', 
    user: { id: 'u2', name: 'Maria Souza' }
  },
  {
    id: 'q3',
    date: new Date().toISOString(),
    licensePlate: 'LMN9101',
    model: 'Onix',
    brand: 'Chevrolet',
    year: 2019,
    items: [{ partName: 'Vela de Ignição', quantity: 4}],
    status: 'Concluida',
    confirmedVendorId: 's1', 
    user: { id: 'u1', name: 'João Silva' }
  },
  {
    id: 'q4',
    date: new Date().toISOString(),
    licensePlate: 'OPQ2345',
    model: 'HB20',
    brand: 'Hyundai',
    year: 2022,
    items: [{ partName: 'Pneu Aro 15', quantity: 4}],
    status: 'Cancelada',
    user: { id: 'u3', name: 'Carlos Pereira' },
  },  
  {
    id: 'q5',
    date: new Date().toISOString(),
    licensePlate: 'RST6789',
    model: 'Tracker',
    brand: 'Chevrolet',
    year: 2023,
    items: [
    { partName: 'Bateria 60Ah', vehicleModel: 'Tracker', vehicleYear: 2023, expectedQuotes: 2, receivedQuotes: 1, status: 'em andamento', price: undefined, quantity: 1 },
    ],
    user: { id: 'u2', name: 'Maria Souza' },
    status: 'Aberta'
   }  
];

// Função auxiliar para definir a cor do badge de status
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Aberta':
      return 'bg-blue-100 text-blue-800';
    case 'Pedido confirmado':
      return 'bg-green-100 text-green-800';
    case 'Concluida':
      return 'bg-gray-100 text-gray-800';
    case 'Cancelada':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const QuotationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const quotation = useMemo(() => mockQuotations.find(q => q.id === id), [id]);
  const vendorQuotes: VendorQuote[] | undefined = useMemo(() => {
    const quotes = id ? mockQuotationOffers[id] : undefined;
    
    if (quotes) {
      const sortedQuotes = [...quotes];
      sortedQuotes.sort((a, b) => {
        const totalA = a.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + a.freightCost;
        const totalB = b.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + b.freightCost;
        return totalA - totalB;
      });
      return sortedQuotes;
    }
    return quotes;
  }, [id]);

  const handleConfirmOrder = (vendorId: string, vendorName: string) => {
    if (window.confirm(`Tem certeza que deseja confirmar o pedido com o fornecedor ${vendorName}?`)) {
      alert(`Simulando a confirmação do pedido com o fornecedor ${vendorName}. Em uma aplicação real, a cotação seria atualizada com o status 'Pedido confirmado' e o ID do fornecedor.`);
      navigate('/cotacoes');
    }
  };
  
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (e) {
      console.error("Erro ao formatar data:", dateString, e);
      return 'Data Inválida';
    }
  };

  if (!quotation) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Cotação não encontrada.</p>
        <Button onClick={() => navigate('/cotacoes')} className="mt-4">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Botão de voltar */}
      <div className="mb-4">
        <Button onClick={() => navigate('/cotacoes')} variant="outline" className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Button>
      </div>

      {/* Título e informações da cotação */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Detalhes da Cotação</h1>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(quotation.status)}`}>
            {quotation.status}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Placa:</strong> {quotation.licensePlate}</p>
            <p><strong>Veículo:</strong> {quotation.brand} {quotation.model} ({quotation.year})</p>
            <p><strong>Peças:</strong> {quotation.items.map(i => `${i.partName} (${i.quantity} un.)`).join(', ')}</p>
          </div>
          <div>
            <p><strong>Criação:</strong> {formatDate(quotation.date)}</p>
            <p><strong>Usuário:</strong> {quotation.user?.name || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Lista de ofertas de fornecedores */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ofertas Recebidas</h2>
        {vendorQuotes && vendorQuotes.length > 0 ? (
          <ul className="space-y-6">
            {vendorQuotes.map((quote, index) => {
              const partsSubtotal = quote.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const totalQuotePrice = partsSubtotal + quote.freightCost;
              const isBestOffer = index === 0;

              // NOVO: Lógica condicional para o badge
              const isConfirmedOffer = (quotation.status === 'Pedido confirmado' || quotation.status === "Concluida") && quotation.confirmedVendorId === quote.vendorId;
              
              return (
                <li key={quote.vendorId} className={`flex flex-col p-4 border rounded-md shadow-sm relative ${isConfirmedOffer ? 'bg-green-50' : isBestOffer ? 'bg-orange-50' : 'bg-gray-50'}`}>
                  
                  {isConfirmedOffer ? (
                    // Badge para pedido confirmado
                    <div className="absolute -top-3 -right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      Pedido Confirmado
                    </div>
                  ) : isBestOffer && quotation.status === 'Aberta' ? (
                    // Badge de melhor preço, apenas se a cotação estiver 'Aberta'
                    <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      Melhor Preço
                    </div>
                  ) : null}

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-900">{quote.vendorName}</p>
                      <p className="text-xs text-gray-500">Enviado em: {formatDate(quote.date)}</p>
                    </div>
                    {/* Botão de confirmação de pedido só aparece se a cotação estiver 'Aberta' */}
                    {quotation.status === 'Aberta' && (
                       <Button onClick={() => handleConfirmOrder(quote.vendorId, quote.vendorName)} className="flex items-center gap-2">
                         <CheckCircle className="h-4 w-4" /> Confirmar Pedido
                       </Button>
                    )}
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Detalhes da Cotação:</h3>
                    <ul className="space-y-2 text-sm text-gray-800">
                      {quote.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex justify-between">
                          <span>{item.partName} ({item.quantity} un.)</span>
                          <span className="font-medium text-orange-600">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                      <li className="flex justify-between font-semibold border-t border-gray-300 pt-2 mt-2">
                        <span>Frete</span>
                        <span className="text-gray-900">R$ {quote.freightCost.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-orange-500">
                    <span className="text-lg font-bold text-gray-900">Preço Total:</span>
                    <span className="text-2xl font-bold text-green-700">R$ {totalQuotePrice.toFixed(2)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">Ainda não há ofertas para esta cotação.</p>
        )}
      </div>
    </div>
  );
};

export default QuotationDetailsPage;