import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/Button'; // Importa o Button do novo caminho
import type { Quotation} from '../schemas/quotationSchema';
import type { QuotationItem } from '../schemas/quotationSchema';
import { format, subDays } from 'date-fns';


// Função auxiliar para gerar datas aleatórias nos últimos 15 dias
const generateRandomDate = (): string => {
  const now = new Date();
  const fifteenDaysAgo = subDays(now, 15);
  const randomTime = fifteenDaysAgo.getTime() + Math.random() * (now.getTime() - fifteenDaysAgo.getTime());
  const randomDate = new Date(randomTime);
  return randomDate.toISOString();
};


const QuotationsPage = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: 'q1',
      licensePlate: 'ABC1234',
      date: generateRandomDate(),
      model: 'Civic',
      brand: 'Honda',
      year: 2020,
      engine: '2.0',
      items: [
        { partName: 'Pastilha de Freio', vehicleModel: 'Civic', vehicleYear: 2020, expectedQuotes: 3, receivedQuotes: 1, status: 'em andamento', price: undefined, quantity: 1 },
        { partName: 'Filtro de Ar', vehicleModel: 'Civic', vehicleYear: 2020, expectedQuotes: 2, receivedQuotes: 0, status: 'pendente', price: undefined, quantity: 1 },
      ],
      user: { id: 'u1', name: 'João Silva' }
    },
    {
      id: 'q2',      
      date: generateRandomDate(),
      licensePlate: 'XYZ5678',
      model: 'Corolla',
      brand: 'Toyota',
      year: 2021,
      items: [
        { partName: 'Amortecedor Dianteiro', vehicleModel: 'Corolla', vehicleYear: 2021, expectedQuotes: 5, receivedQuotes: 5, status: 'finalizada', price: 550.00, quantity: 2},
      ],
      user: { id: 'u2', name: 'Maria Souza' }
    },
    {
      id: 'q3',
      date: generateRandomDate(),
      licensePlate: 'LMN9101',
      model: 'Onix',
      brand: 'Chevrolet',
      year: 2019,
      items: [
        { partName: 'Vela de Ignição', vehicleModel: 'Onix', vehicleYear: 2019, expectedQuotes: 4, receivedQuotes: 2, status: 'em andamento', price: undefined,  quantity: 4},
      ],
      user: { id: 'u1', name: 'João Silva' }
    },
     {
      id: 'q4',
      date: generateRandomDate(),
      licensePlate: 'OPQ2345',
      model: 'HB20',
      brand: 'Hyundai',
      year: 2022,
      items: [
        { partName: 'Pneu Aro 15', vehicleModel: 'HB20', vehicleYear: 2022, expectedQuotes: 3, receivedQuotes: 3, status: 'finalizada', price: 400.00, quantity: 4},
      ],
      user: { id: 'u3', name: 'Carlos Pereira' }
    },
    {
      id: 'q5',
      date: generateRandomDate(),
      licensePlate: 'RST6789',
      model: 'Tracker',
      brand: 'Chevrolet',
      year: 2023,
      items: [
        { partName: 'Bateria 60Ah', vehicleModel: 'Tracker', vehicleYear: 2023, expectedQuotes: 2, receivedQuotes: 1, status: 'em andamento', price: undefined, quantity: 1 },
      ],
      user: { id: 'u2', name: 'Maria Souza' }
    },
  ]);

  // Estados para filtros da lista de cotações
  const [filterSearch, setFilterSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('');

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Valor inicial de 10 itens por página

    // Função auxiliar para formatar a data usando date-fns
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm'); // Formata com data e hora
    } catch (e) {
      console.error("Erro ao formatar data com date-fns:", dateString, e);
      return 'Data Inválida';
    }
  };

  // Função para simular o refresh e atualização de dados
  const simulateRefresh = useCallback(() => {
    setQuotations(prevQuotations => {
      return prevQuotations.map(quotation => {
        const updatedItems = quotation.items.map(item => {
          if (item.status === 'pendente' || item.status === 'em andamento') {
            const newReceivedQuotes = Math.min(item.receivedQuotes + 1, item.expectedQuotes);
            let newStatus: QuotationItem['status'] = item.status;
            let newPrice = item.price;

            if (newReceivedQuotes === item.expectedQuotes) {
              newStatus = 'finalizada';
              newPrice = newPrice || parseFloat((Math.random() * (1000 - 100) + 100).toFixed(2));
            } else if (newReceivedQuotes > item.receivedQuotes) {
              newStatus = 'em andamento';
            }

            return {
              ...item,
              receivedQuotes: newReceivedQuotes,
              status: newStatus,
              price: newPrice,
            };
          }
          return item;
        });

        return {
          ...quotation,
          items: updatedItems,
        };
      });
    });
  }, []);

  // Configura o refresh a cada 5 segundos
  useEffect(() => {
    const intervalId = setInterval(simulateRefresh, 5000);
    return () => clearInterval(intervalId);
  }, [simulateRefresh]);

  // Lógica de filtragem para cotações
  const filteredQuotations = useMemo(() => {
    let tempQuotations = [...quotations];

    // Filtro por busca geral (Placa, Peça, Veículo)
    if (filterSearch) {
      const searchTerm = filterSearch.toLowerCase();
      tempQuotations = tempQuotations.filter(quotation => {
        const matchesLicensePlate = quotation.licensePlate.toLowerCase().includes(searchTerm);
        const matchesPartOrVehicle = quotation.items.some(item =>
          item.partName.toLowerCase().includes(searchTerm) ||
          item.vehicleModel.toLowerCase().includes(searchTerm)
        );       
        const matchesUser = quotation.user?.name?.toLowerCase().includes(searchTerm);
        return matchesLicensePlate || matchesPartOrVehicle || matchesUser;
      });
    }

    // Filtro por situação
    if (filterStatus) {
      tempQuotations = tempQuotations.filter(quotation => {
        const overallStatus = quotation.items.every(item => item.status === 'finalizada') ? 'finalizada' :
                              quotation.items.some(item => item.status === 'em andamento') ? 'em andamento' :
                              quotation.items.some(item => item.status === 'pendente') ? 'pendente' :
                              quotation.items.some(item => item.status === 'cancelada') ? 'cancelada' : 'desconhecido';
        return overallStatus === filterStatus;
      });
    }

    // Filtro por data
   if (filterDateRange) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Zera hora para comparação de data

      tempQuotations = tempQuotations.filter(quotation => {
        if (!quotation.date) return false;

        const quotationDate = new Date(quotation.date);
        quotationDate.setHours(0, 0, 0, 0);

        switch (filterDateRange) {
          case 'hoje': { 
            return quotationDate.getTime() === today.getTime();
          }
          case 'ultimos-7-dias': { 
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            return quotationDate >= sevenDaysAgo && quotationDate <= today;
          }
          case 'ultimos-15-dias': { 
            const fifteenDaysAgo = new Date(today);
            fifteenDaysAgo.setDate(today.getDate() - 15);
            return quotationDate >= fifteenDaysAgo && quotationDate <= today;
          }
          default:
            return true;
        }
      });
    }

    return tempQuotations;
  }, [quotations, filterSearch, filterStatus, filterDateRange]);

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuotations = filteredQuotations.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reinicia a página para 1 quando o filtro ou o número de itens por página muda
  useEffect(() => {
    setCurrentPage(1);
  }, [filterSearch, filterStatus, filterDateRange, itemsPerPage]);


  const handleEdit = (id: string) => {
    alert(`Editar cotação ${id}`);
  };

  const handleCancel = (id: string) => {
    if (window.confirm(`Tem certeza que deseja cancelar a cotação ${id}?`)) {
      setQuotations(prevQuotations =>
        prevQuotations.map(q =>
          q.id === id ? { ...q, items: q.items.map(item => ({ ...item, status: 'cancelada' })) } : q
        )
      );
      alert(`Cotação ${id} cancelada.`);
    }
  };

  const handleCreateQuotationClick = () => {
    navigate('/nova-cotacao'); // Navega para a tela de criação de cotação
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Cotações</h1>
        <Button onClick={handleCreateQuotationClick} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Criar Nova Cotação
        </Button>
      </div>

      {/* Filtros da Lista de Cotações */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-full md:col-span-1"> {/* Campo de busca geral */}
          <label htmlFor="filterSearch" className="block text-sm font-medium text-gray-700">Buscar (Cliente, Peça, Veículo)</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="filterSearch"
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              placeholder="Buscar por cliente, peça ou veículo..."
            />
          </div>
        </div>

        <div> {/* Filtro por Situação */}
          <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">Filtrar por Situação</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          >
            <option value="">Todas</option>
            <option value="pendente">Pendente</option>
            <option value="em andamento">Em Andamento</option>
            <option value="finalizada">Finalizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div> {/* Filtro por Data */}
          <label htmlFor="filterDateRange" className="block text-sm font-medium text-gray-700">Filtrar por Data</label>
          <select
            id="filterDateRange"
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          >
            <option value="">Todos os Períodos</option>
            <option value="hoje">Hoje</option>
            <option value="ultimos-7-dias">Últimos 7 dias</option>
            <option value="ultimos-15-dias">Últimos 15 dias</option>
          </select>
        </div>
      </div>

      {/* Tabela de Cotações */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto mb-6"> {/* Adicionado mb-6 para espaçamento com a paginação */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr> {/* Ajuste de formatação */}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peça</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veículo</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cotações</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider font-bold">Preço Total</th> {/* Destaque */}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr></thead>
          <tbody className="bg-white divide-y divide-gray-200">{ /* Ajuste de formatação */
            currentQuotations.length > 0 ? (
              currentQuotations.map((quotation) => {
                const firstItem = quotation.items[0]; // Exibindo o primeiro item para simplificar
                const totalReceivedQuotes = quotation.items.reduce((sum, item) => sum + item.receivedQuotes, 0);
                const totalExpectedQuotes = quotation.items.reduce((sum, item) => sum + item.expectedQuotes, 0);
                const totalPrice = quotation.items.reduce((sum, item) => sum + (item.price || 0), 0);   
  
                return (
                  <tr key={quotation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quotation.licensePlate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(quotation.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{firstItem?.partName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{firstItem?.vehicleModel || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${totalReceivedQuotes}/${totalExpectedQuotes}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold">{totalPrice > 0 ? `R$ ${totalPrice.toFixed(2)}` : '-'}</td> {/* Destaque */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quotation.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(quotation.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCancel(quotation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhuma cotação encontrada.</td>
              </tr>
            )}</tbody>
        </table>
      </div>

      {/* Controles de Paginação */}
      {filteredQuotations.length > 0 && ( // Mostra a paginação apenas se houver itens filtrados
        <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-md">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Anterior
            </Button>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Próximo
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex items-center gap-4"> {/* Agrupando informações de exibição e seletor */}
              <p className="text-sm text-gray-700">                
                <span className="font-medium">Mostrando {filteredQuotations.length}</span> resultados
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="items-per-page" className="text-sm font-medium text-gray-700">Itens por página:</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-1"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="ghost"
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    variant={currentPage === i + 1 ? 'default' : 'ghost'}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${currentPage === i + 1 ? 'z-10 bg-orange-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'}`}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="ghost"
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Próximo</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default QuotationsPage;
