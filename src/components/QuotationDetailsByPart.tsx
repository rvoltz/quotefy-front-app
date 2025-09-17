import type { PartData, SelectedItem, ItemForSelection } from '../pages/QuotationDetailsPage';

interface QuotationDetailsByPartProps {
    groupedByPart: Record<string, PartData>;
    selectedItems: SelectedItem[];
    // NOVO: O item agora é do tipo ItemForSelection
    handleSelectItem: (item: ItemForSelection, isChecked: boolean) => void;
    quotationStatus: string;
}

const QuotationDetailsByPart = ({ groupedByPart, selectedItems, handleSelectItem, quotationStatus }: QuotationDetailsByPartProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ofertas por Peça</h2>
            {Object.keys(groupedByPart).length > 0 ? (
                <div className="space-y-6">
                    {Object.keys(groupedByPart).map(partName => {
                        const partData = groupedByPart[partName];
                        const bestUnitPrice = Math.min(...partData.quotes.map(q => q.unitPrice));

                        return (
                            <div key={partName} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{partName} ({partData.quantity} un.)</h3>
                                <ul className="space-y-3">
                                    {partData.quotes.map((quote) => {
                                        const isSelected = selectedItems.some(si => si.partName === partName && si.vendorId === quote.vendorId);
                                        const isOtherVendorSelected = selectedItems.some(si => si.partName === partName && si.vendorId !== quote.vendorId);
                                        const isBestOffer = quote.unitPrice === bestUnitPrice;

                                        return (
                                            <li
                                                key={quote.vendorId}
                                                className={`p-3 rounded-md border-l-4 relative ${isBestOffer ? 'border-orange-500 bg-white shadow-md' : 'border-gray-300'}`}
                                            >
                                                {isBestOffer && (
                                                    <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                                        Melhor Preço
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        {quotationStatus === 'Aberta' && (
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-2"
                                                                // NOVO: Passamos partName para o objeto
                                                                onChange={(e) => handleSelectItem({ ...quote, partName }, e.target.checked)}
                                                                checked={isSelected}
                                                                disabled={isOtherVendorSelected}
                                                            />
                                                        )}
                                                        <p className="font-medium text-gray-800">{quote.vendorName}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                                                    <div>
                                                        <p className="font-semibold">Preço Unit.:</p>
                                                        <p>R$ {quote.unitPrice.toFixed(2).replace('.', ',')}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">Frete:</p>
                                                        <p>R$ {quote.freightCost.toFixed(2).replace('.', ',')}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-2 border-t-2 border-green-500 flex justify-between items-center">
                                                    <span className="font-bold text-sm text-gray-700">Preço Total:</span>
                                                    <span className="text-lg font-bold text-gray-900">R$ {(quote.unitPrice * partData.quantity + quote.freightCost).toFixed(2).replace('.', ',')}</span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500">Ainda não há ofertas para esta cotação.</p>
            )}
        </div>
    );
};

export default QuotationDetailsByPart;