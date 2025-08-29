import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Button from '../components/Button';

// Definindo o tipo para o Grupo de Fornecedores
interface SupplierGroup {
  id: string;
  description: string;
  isActive: boolean;
}

const SupplierGroupsPage = () => {
  const navigate = useNavigate();

  // Dados mock de grupos de fornecedores
  const [supplierGroups] = useState<SupplierGroup[]>([
    { id: 'g1', description: 'Suspensão e Freios', isActive: true },
    { id: 'g2', description: 'Elétrica e Eletrônica', isActive: true },
    { id: 'g3', description: 'Motor e Transmissão', isActive: false },
    { id: 'g4', description: 'Funilaria e Pintura', isActive: true },
    { id: 'g5', description: 'Pneus e Rodas', isActive: true },
  ]);

  // Estados para filtros
  const [filterDescription, setFilterDescription] = useState('');

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Lógica de filtragem
  const filteredSupplierGroups = useMemo(() => {
    return supplierGroups.filter(group => {
      const matchesDescription = group.description.toLowerCase().includes(filterDescription.toLowerCase());
      return matchesDescription;
    });
  }, [supplierGroups, filterDescription]);

  // Lógica de paginação
  const totalPages = Math.ceil(filteredSupplierGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSupplierGroups = filteredSupplierGroups.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRegisterClick = () => {
    navigate('/cadastro-grupo-fornecedor'); 
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Grupos de Fornecedores</h1>
        <Button onClick={handleRegisterClick} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Cadastrar Novo Grupo
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div>
          <label htmlFor="filterDescription" className="block text-sm font-medium text-gray-700">Filtrar por Descrição</label>
          <input
            id="filterDescription"
            type="text"
            value={filterDescription}
            onChange={(e) => { setFilterDescription(e.target.value); setCurrentPage(1); }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            placeholder="Buscar por descrição do grupo..."
          />
        </div>
      </div>

      {/* Tabela de Grupos de Fornecedores */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentSupplierGroups.length > 0 ? (
              currentSupplierGroups.map((group) => (
                <tr key={group.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {group.isActive ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => alert(`Editar grupo ${group.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => alert(`Excluir grupo ${group.id}`)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum grupo encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          Anterior
        </Button>
        <span className="text-sm text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export default SupplierGroupsPage;