// src/components/SupplierSelector.tsx
import { useState, useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import Button from './Button';

interface Supplier {
  id: string;
  name: string;
}

interface SupplierSelectorProps {
  // Os fornecedores disponíveis para seleção
  availableSuppliers: Supplier[];
  // O array de fornecedores já selecionados
  selectedSuppliers: Supplier[];
  // Função para atualizar a lista de fornecedores no formulário
  onSelectedChange: (suppliers: Supplier[]) => void;
}

const SupplierSelector = ({ availableSuppliers, selectedSuppliers, onSelectedChange }: SupplierSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra a lista de fornecedores disponíveis com base no termo de busca
  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) {
      return []; // Não mostra nada se a busca estiver vazia
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const selectedIds = selectedSuppliers.map(s => s.id);

    return availableSuppliers.filter(supplier =>
      !selectedIds.includes(supplier.id) &&
      supplier.name.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, availableSuppliers, selectedSuppliers]);

  const handleAddSupplier = (supplier: Supplier) => {
    onSelectedChange([...selectedSuppliers, supplier]);
    setSearchTerm('');
  };

  const handleRemoveSupplier = (supplierToRemove: Supplier) => {
    const updatedSuppliers = selectedSuppliers.filter(
      (supplier) => supplier.id !== supplierToRemove.id
    );
    onSelectedChange(updatedSuppliers);
  };

  return (
    <div>
      <div className="relative mb-4">
        <label htmlFor="supplier-search" className="block text-sm font-medium text-gray-700">Adicionar Fornecedor</label>
        <input
          id="supplier-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          placeholder="Pesquisar fornecedor..."
        />
        {/* Lista de resultados da busca */}
        {searchTerm && filteredSuppliers.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredSuppliers.map(supplier => (
              <li
                key={supplier.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
              >
                <span>{supplier.name}</span>
                <Button
                  type="button"
                  onClick={() => handleAddSupplier(supplier)}
                  variant="ghost"
                  size="icon"
                >
                  <Plus className="h-4 w-4 text-green-600" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Lista de Fornecedores Selecionados */}
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">Fornecedores Selecionados:</span>
        {selectedSuppliers.length > 0 ? (
          <ul className="space-y-2">
            {selectedSuppliers.map((supplier) => (
              <li
                key={supplier.id}
                className="flex items-center justify-between p-2 rounded-md bg-gray-100 text-gray-800"
              >
                <span>{supplier.name}</span>
                <Button
                  type="button"
                  onClick={() => handleRemoveSupplier(supplier)}
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Nenhum fornecedor adicionado.</p>
        )}
      </div>
    </div>
  );
};

export default SupplierSelector;