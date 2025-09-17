// src/pages/QuotationDetailsPage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Button from '../components/Button';
import { ChevronLeft, CheckCircle, List, Grid } from 'lucide-react';
import { format } from 'date-fns';
import QuotationDetailsByPart from '../components/QuotationDetailsByPart';
import QuotationDetailsByVendor from '../components/QuotationDetailsByVendor';

// Interfaces de tipagem que já tínhamos definido
interface QuoteDetails {
  vendorId: string;
  vendorName: string;
  date: string;
  unitPrice: number;
  totalPrice: number;
  freightCost: number;
}
export interface PartData {
  quantity: number;
  quotes: QuoteDetails[];
}
export interface ItemForSelection {
  vendorId: string;
  vendorName: string;
  partName: string;
  quantity?: number;
  price?: number;
  unitPrice?: number;
  freightCost: number;
}
export interface SelectedItem {
  vendorId: string;
  vendorName: string;
  partName: string;
  quantity: number;
  price: number;
  freightCost: number;
}

// NOVO: Tipagem para os dados mockados
interface VendorQuotationItem {
    partName: string;
    quantity: number;
    price: number;
}
interface VendorQuote {
    vendorId: string;
    vendorName: string;
    date: string;
    items: VendorQuotationItem[];
    freightCost: number;
}
interface QuotationItem {
    partName: string;
    vehicleModel: string;
    vehicleYear: number;
    expectedQuotes: number;
    receivedQuotes: number;
    status: string;
    price: number | undefined;
    quantity: number;
}
interface Quotation {
    id: string;
    licensePlate: string;
    date: string;
    model: string;
    brand: string;
    year: number;
    engine?: string;
    items: QuotationItem[];
    status: string;
    user: { id: string; name: string };
    confirmedVendorId?: string;
}

// Dados mockados (re-adicionados)
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
      {
        vendorId: 's3', vendorName: 'Fornecedor Universal', date: new Date().toISOString(),
        items: [
          { partName: 'Pastilha de Freio', quantity: 1, price: 245.00 },
          { partName: 'Filtro de Ar', quantity: 1, price: 98.00 },
        ],
        freightCost: 10.00,
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
    'q5': [
        {
          vendorId: 's2', vendorName: 'Distribuidora XYZ', date: new Date().toISOString(),
          items: [
            { partName: 'Bateria 60Ah', quantity: 1, price: 280.00 },
          ],
          freightCost: 20.00,
        },
    ]
};
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
          { partName: 'Pastilha de Freio', vehicleModel: 'Civic', vehicleYear: 2020, expectedQuotes: 3, receivedQuotes: 3, status: 'em andamento', price: undefined, quantity: 1 },
          { partName: 'Filtro de Ar', vehicleModel: 'Civic', vehicleYear: 2020, expectedQuotes: 2, receivedQuotes: 3, status: 'pendente', price: undefined, quantity: 1 },
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
      items: [
          { partName: 'Amortecedor Dianteiro', vehicleModel: 'Corolla', vehicleYear: 2021, expectedQuotes: 5, receivedQuotes: 5, status: 'finalizada', price: 550.00, quantity: 2},
      ],
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
      items: [
       { partName: 'Vela de Ignição', vehicleModel: 'Onix', vehicleYear: 2019, expectedQuotes: 4, receivedQuotes: 2, status: 'em andamento', price: undefined,  quantity: 4},
      ],
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
      items: [
       { partName: 'Pneu Aro 15', vehicleModel: 'HB20', vehicleYear: 2022, expectedQuotes: 3, receivedQuotes: 3, status: 'finalizada', price: 400.00, quantity: 4},
      ],
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

// Helper para definir a cor do badge de status (re-adicionado)
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
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [viewMode, setViewMode] = useState<'product' | 'vendor'>('product');

    // Acessando os dados mockados
    const quotation = useMemo(() => mockQuotations.find(q => q.id === id), [id]);
    const vendorQuotes: VendorQuote[] | undefined = useMemo(() => {
        return id ? mockQuotationOffers[id] : undefined;
    }, [id]);

    const groupedByPart = useMemo<Record<string, PartData>>(() => {
        if (!vendorQuotes) return {};
        const partsMap: Record<string, PartData> = {};
        vendorQuotes.forEach(quote => {
            // Agora 'quote' é do tipo VendorQuote e 'item' do tipo VendorQuotationItem
            quote.items.forEach(item => {
                if (!partsMap[item.partName]) {
                    partsMap[item.partName] = { quantity: item.quantity, quotes: [] };
                }
                partsMap[item.partName].quotes.push({
                    vendorId: quote.vendorId,
                    vendorName: quote.vendorName,
                    date: quote.date,
                    unitPrice: item.price,
                    totalPrice: item.price * item.quantity,
                    freightCost: quote.freightCost,
                });
            });
        });
        for (const partName in partsMap) {
            partsMap[partName].quotes.sort((a, b) => a.unitPrice - b.unitPrice);
        }
        return partsMap;
    }, [vendorQuotes]);

    const sortedVendorQuotes = useMemo(() => {
        if (!vendorQuotes) return undefined;
        const sortedQuotes = [...vendorQuotes];
        sortedQuotes.sort((a, b) => {
            // Os itens também estão tipados aqui
            const totalA = a.items.reduce((sum: number, item) => sum + (item.price * item.quantity), 0) + a.freightCost;
            const totalB = b.items.reduce((sum: number, item) => sum + (item.price * item.quantity), 0) + b.freightCost;
            return totalA - totalB;
        });
        return sortedQuotes;
    }, [vendorQuotes]);

    const handleSelectItem = (item: ItemForSelection, isChecked: boolean) => {
        setSelectedItems(prevItems => {
            const updatedItems = prevItems.filter(si => si.partName !== item.partName);
            if (isChecked) {
                return [...updatedItems, { 
                    partName: item.partName, 
                    quantity: item.quantity || quotation?.items.find(i => i.partName === item.partName)?.quantity || 1,
                    price: item.unitPrice || item.price || 0,
                    vendorId: item.vendorId, 
                    vendorName: item.vendorName, 
                    freightCost: item.freightCost 
                }];
            } else {
                return updatedItems;
            }
        });
    };

    const calculateTotalPrice = useMemo(() => {
        const totalByVendor: Record<string, { total: number; freight: number }> = {};
        selectedItems.forEach(item => {
            if (!totalByVendor[item.vendorId]) {
                totalByVendor[item.vendorId] = { total: 0, freight: item.freightCost };
            }
            totalByVendor[item.vendorId].total += item.price * item.quantity;
        });

        let finalPrice = 0;
        for (const vendorId in totalByVendor) {
            finalPrice += totalByVendor[vendorId].total + totalByVendor[vendorId].freight;
        }
        return finalPrice;
    }, [selectedItems]);
    
    const handleConfirmOrder = () => {
        if (window.confirm('Tem certeza que deseja confirmar o pedido com os itens selecionados?')) {
            console.log('Pedido Final:', selectedItems);
            alert('Pedido confirmado! (Verifique o console para os itens selecionados)');
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
            <div className="mb-4 flex justify-between items-center">
                <Button onClick={() => navigate('/cotacoes')} variant="outline" className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Voltar
                </Button>
                <Button 
                    onClick={() => setViewMode(viewMode === 'product' ? 'vendor' : 'product')}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    {viewMode === 'product' ? (
                        <>
                            <List className="h-4 w-4" /> Ver por Fornecedor
                        </>
                    ) : (
                        <>
                            <Grid className="h-4 w-4" /> Ver por Peça
                        </>
                    )}
                </Button>
            </div>

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

            {viewMode === 'product' ? (
                <QuotationDetailsByPart 
                    groupedByPart={groupedByPart}
                    selectedItems={selectedItems}
                    handleSelectItem={handleSelectItem}
                    quotationStatus={quotation.status}
                />
            ) : (
                <QuotationDetailsByVendor 
                    sortedVendorQuotes={sortedVendorQuotes}
                    selectedItems={selectedItems}
                    handleSelectItem={handleSelectItem}
                    quotationStatus={quotation.status}
                    confirmedVendorId={quotation.confirmedVendorId}
                />
            )}

            {quotation.status === 'Aberta' && selectedItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Seu Pedido Final</h3>
                            <p className="text-sm text-gray-600">
                                {selectedItems.map((item, index) => (
                                    <span key={index} className="mr-2">
                                        {item.partName} de **{item.vendorName}**
                                        {index < selectedItems.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <span className="block text-sm text-gray-500">Preço Total Estimado:</span>
                                <span className="block text-2xl font-bold text-green-700">
                                    R$ {calculateTotalPrice.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                            <Button onClick={handleConfirmOrder} className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" /> Confirmar Pedido
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotationDetailsPage;