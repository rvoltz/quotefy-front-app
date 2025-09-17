// src/components/QuotationDetailsByVendor.tsx

import { format } from 'date-fns';
import type { SelectedItem, ItemForSelection } from '../pages/QuotationDetailsPage';

// NOVO: Interface para a tipagem dos itens da cotação
interface VendorQuotationItem {
  partName: string;
  quantity: number;
  price: number;
}

interface VendorQuote {
  vendorId: string;
  vendorName: string;
  date: string;
  // NOVO: O tipo agora é VendorQuotationItem[]
  items: VendorQuotationItem[];
  freightCost: number;
}

interface QuotationDetailsByVendorProps {
    sortedVendorQuotes: VendorQuote[] | undefined;
    selectedItems: SelectedItem[];
    handleSelectItem: (item: ItemForSelection, isChecked: boolean) => void;
    quotationStatus: string;
    confirmedVendorId?: string;
}

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

const QuotationDetailsByVendor = ({ sortedVendorQuotes, selectedItems, handleSelectItem, quotationStatus, confirmedVendorId }: QuotationDetailsByVendorProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ofertas por Fornecedor</h2>
            {sortedVendorQuotes && sortedVendorQuotes.length > 0 ? (
                <ul className="space-y-6">
                    {sortedVendorQuotes.map((quote, index) => {
                        // O reduce agora também está tipado
                        const partsSubtotal = quote.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                        const totalQuotePrice = partsSubtotal + quote.freightCost;
                        const isBestOffer = index === 0;

                        const isConfirmedOffer = (quotationStatus === 'Pedido confirmado' || quotationStatus === "Concluida") && confirmedVendorId === quote.vendorId;
                        const isAnyItemSelected = selectedItems.some(si => si.vendorId === quote.vendorId);
                        
                        return (
                            <li key={quote.vendorId} className={`flex flex-col p-4 border rounded-md shadow-sm relative ${isConfirmedOffer ? 'bg-green-50' : isAnyItemSelected ? 'bg-indigo-50' : isBestOffer ? 'bg-orange-50' : 'bg-gray-50'}`}>
                                {isConfirmedOffer ? (
                                    <div className="absolute -top-3 -right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                        Pedido Confirmado
                                    </div>
                                ) : isBestOffer && quotationStatus === 'Aberta' ? (
                                    <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                        Melhor Preço
                                    </div>
                                ) : null}

                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex-1">
                                        <p className="text-lg font-semibold text-gray-900">{quote.vendorName}</p>
                                        <p className="text-xs text-gray-500">Enviado em: {formatDate(quote.date)}</p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Detalhes da Cotação:</h3>
                                    <ul className="space-y-2 text-sm text-gray-800">
                                        {quote.items.map((item, itemIndex: number) => {
                                            const isSelected = selectedItems.some(si => si.partName === item.partName && si.vendorId === quote.vendorId);
                                            const isOtherVendorSelected = selectedItems.some(si => si.partName === item.partName && si.vendorId !== quote.vendorId);
                                            
                                            return (
                                                <li key={itemIndex} className={`flex justify-between items-center ${isOtherVendorSelected ? 'opacity-50' : ''}`}>
                                                    <div className="flex items-center">
                                                        {quotationStatus === 'Aberta' && (
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-2"
                                                                onChange={(e) => handleSelectItem({ ...item, vendorId: quote.vendorId, vendorName: quote.vendorName, freightCost: quote.freightCost}, e.target.checked)}
                                                                checked={isSelected}
                                                                disabled={isOtherVendorSelected}
                                                            />
                                                        )}
                                                        <span>{item.partName} ({item.quantity} un.)</span>
                                                    </div>
                                                    <span className="font-medium text-orange-600">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                                                </li>
                                            );
                                        })}
                                        <li className="flex justify-between font-semibold border-t border-gray-300 pt-2 mt-2">
                                            <span>Frete</span>
                                            <span className="text-gray-900">R$ {quote.freightCost.toFixed(2).replace('.', ',')}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-orange-500">
                                    <span className="text-lg font-bold text-gray-900">Preço Total:</span>
                                    <span className="text-2xl font-bold text-green-700">R$ {totalQuotePrice.toFixed(2).replace('.', ',')}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-500">Ainda não há ofertas para esta cotação.</p>
            )}
        </div>
    );
};

export default QuotationDetailsByVendor;