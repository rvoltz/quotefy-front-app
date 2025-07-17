import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Button from '../components/Button'; // Importa o Button do novo caminho

const SuppliersPage = () => {
  const navigate = useNavigate();

  // Dados mock de fornecedores
  const [suppliers] = useState([
    { id: 's1', name: 'Auto Peças ABC', street: 'Rua A', number: '123', neighborhood: 'Centro', cityState: 'São Paulo/SP', submissionMethods: ['whatsapp', 'email'], isActive: true },
    { id: 's2', name: 'Distribuidora de Peças XYZ', street: 'Av. B', number: '456', neighborhood: 'Industrial', cityState: 'Rio de Janeiro/RJ', submissionMethods: ['email'], isActive: true },
    { id: 's3', name: 'Peças Rápidas LTDA', street: 'Rua C', number: '789', neighborhood: 'Vila Nova', cityState: 'Belo Horizonte/MG', submissionMethods: ['whatsapp'], isActive: false },
    { id: 's4', name: 'Fornecedor Universal', street: 'Travessa D', number: '10', neighborhood: 'Jardim', cityState: 'Curitiba/PR', submissionMethods: ['whatsapp', 'email'], isActive: true },
    { id: 's5', name: 'Componentes Automotivos', street: 'Rua E', number: '20', neighborhood: 'Centro', cityState: 'Porto Alegre/RS', submissionMethods: ['email'], isActive: true },
  ]);

  // Estados para filtros
  const [filterName, setFilterName] = useState('');

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Lógica de filtragem
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesName = supplier.name.toLowerCase().includes(filterName.toLowerCase());
      return matchesName;
    });
  }, [suppliers, filterName]);

  // Lógica de paginação
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRegisterClick = () => {
    navigate('/cadastro-fornecedor'); // Navega para a tela de cadastro de fornecedor
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Fornecedores</h1>
        <Button onClick={handleRegisterClick} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Cadastrar Novo Fornecedor
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="filterName" className="block text-sm font-medium text-gray-700">Filtrar por Nome</label>
          <input
            id="filterName"
            type="text"
            value={filterName}
            onChange={(e) => { setFilterName(e.target.value); setCurrentPage(1); }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            placeholder="Buscar por nome do fornecedor..."
          />
        </div>
      </div>

      {/* Tabela de Fornecedores */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modo de Envio</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentSuppliers.length > 0 ? (
              currentSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.submissionMethods.map(method => method.charAt(0).toUpperCase() + method.slice(1)).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {supplier.isActive ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => alert(`Editar fornecedor ${supplier.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => alert(`Excluir fornecedor ${supplier.id}`)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum fornecedor encontrado.</td>
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

export default SuppliersPage;