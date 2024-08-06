'use client';
import { CircleHelp, User, UserCog, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ModeToggle } from "../components/toggle";
import Logo from '../imgs/reports__4_-removebg-preview.png';
import { UsuarioService } from "../../../service/Service";
import axios from 'axios';

const usuarioService = new UsuarioService();

const origemMotivoCancelamentoMap: { [key: number]: string } = {
  1: 'Telefone',
  2: 'WhatsApp',
  3: 'Email',
  4: 'RA',
  5: 'Crisp',
  6: 'Outros'
};

const motivoCancelamentoMap: { [key: number]: string } = {
  1: 'Já estou empregado',
  2: 'Acho que o Vip não funciona',
  3: 'Poucas Vagas',
  4: 'Não entendi como o site funciona',
  5: 'Plano VIP está caro',
  6: 'Recebi muito e-mails',
  7: 'Outros',
  8: 'Já finalizei meu processo seletivo - Candidato BNE',
  9: 'Já finalizei meu processo seletivo - Indicação',
  10: 'Já finalizei meu processo seletivo - Outro',
  11: 'Não consegui utilizar o site',
  12: 'Não obtive resultados com os anúncios',
  13: 'Não consegui contato com os candidatos',
  14: 'O valor da assinatura está muito alto',
  15: 'Vou testar outras ferramentas',
  16: 'Esta assinatura não atende às minhas necessidades',
  17: 'O valor da assinatura está muito alto',
  18: 'Outros',
  19: 'Já consegui um emprego pelo BNE',
  20: 'Já consegui um emprego por indicação',
  21: 'Já consegui um emprego por outra ferramenta'
};

const planoSituacaoMap: { [key: number]: string } = {
  0: 'Aguardando Liberacao',
  1: 'Liberado',
  2: 'Encerrado',
  3: 'Cancelado',
  4: 'Bloqueado',
  5: 'Liberação Futura',
  6: 'Liberação Automática',
  7: 'Congelado'
};

interface PlanoCancelado {
  des_DetalheMotivoCancelamento: string;
  idf_PlanoMotivoCancelamento: number;
  idf_PlanoAdquirido: number;
  dta_Cancelamento: string;
  idf_MotivoCancelamento: number;
  nme_Atendente: string;
  planoAdquirido: {
    idf_Plano: string;
    dataCancelamento: string;
    dataFimPlano: string;
    dataCadastro: string;
    idf_UsuarioFilialPerfil: {
      pessoaFisica: {
        idf_PessoaFisica: string;
        nome: string;
        email: string;
        cpf: string;
      };
    };
    idf_PlanoSituacao: number;
  };
  motivoCancelamento: {
    des_MotivoCancelamento: string;
    idf_TipoMotivoCancelamento: string;
    des_DetalheMotivoCancelamento: string;
  };
}

export default function Inicio() {
  const [isModalOpen1, setisModalOpen1] = useState(false);
  const [isModalOpen2, setisModalOpen2] = useState(false);
  const [planosCancelados, setPlanosCancelados] = useState<PlanoCancelado[]>([]);
  const [selectedPlano, setSelectedPlano] = useState<PlanoCancelado | null>(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [origemCancelamento, setOrigemCancelamento] = useState('');
  const [isGerente, setIsGerente] = useState(false);
const router = useRouter();
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole === 'Gerente') {
      setIsGerente(true);
    }
  }, []);

  const toggleModal = (plano: PlanoCancelado) => {
    setSelectedPlano(plano);
    setisModalOpen1(!isModalOpen1);
  };

  const toggleModal2 = (plano: PlanoCancelado) => {
    setSelectedPlano(plano);
    setisModalOpen2(!isModalOpen2);
  };

  useEffect(() => {
    fetchPlanosCancelados(currentPage);
  }, [currentPage]);

  const fetchPlanosCancelados = (page: number) => {
    usuarioService.fetchPlanosCancelados(page, 10)
      .then(response => {
        console.log("Resposta completa da API:", response);
        const data = response.data;
        if (data && Array.isArray(data)) {
          setPlanosCancelados(data.slice((page - 1) * 10, page * 10));
          setTotalPages(Math.ceil(data.length / 10));
        } else {
          console.error("Estrutura inesperada da resposta:", data);
          setError('Estrutura inesperada da resposta. Verifique o console para mais detalhes.');
        }
      })
      .catch(error => {
        console.error("Erro ao buscar os planos cancelados:", error.response ? error.response.data : error.message);
        setError('Erro ao buscar os planos cancelados. Verifique o console para mais detalhes.');
      });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleMotivoCancelamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMotivoCancelamento(e.target.value);
  };

  const handleOrigemCancelamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrigemCancelamento(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlano) {
      const data = {
        id: selectedPlano.idf_PlanoMotivoCancelamento,
        cpf: localStorage.getItem('cpf') || '', 
        motivoCancelamento,
        origemCancelamento
      };
      axios.post('https://testing-bnereports.bne.com.br/ReportsBNE/PlanoMotivoCancelamento/EditarPlanoMotivoCancelamento', data)
        .then(response => {
          console.log("Resposta da API:", response.data);
          setisModalOpen2(false);
        })
        .catch(error => {
          console.error("Erro ao enviar os dados:", error.response ? error.response.data : error.message);
        });
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('cpf');
    localStorage.removeItem('user');
    router.push('/');
  };
  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 dark:text-white">
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          <a href="/inicio" className="flex items-center">
            <img src={Logo.src} className="h-16 ml-4" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-amber-300">ReportsBne</span>
          </a>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {isGerente && (
                <li>
                  <a href="/FuncionariosToList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" aria-current="page"><UserCog className="mr-2" />Gerenciar Atendentes</a>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"><UserX className="mr-2" />Encerrar Sessão</button>
              </li>
              <li>
                <ModeToggle />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="flex-1 p-4">
        <div className="flex flex-wrap -mx-3 mb-5 mt-24">
          <div className="w-full max-w-full px-3 mb-6 mx-auto">
            <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5 dark:bg-gray-900 dark:text-white">
              <div className="relative flex flex-col min-w-0 break-words border bg-clip-border rounded-2xl bg-light/30">
                <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
                  <h3 className="flex flex-col items-center justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                    <span className="mr-3 font-semibold text-amber-300">Planos Cancelados Via Admin</span>
                  </h3>
                </div>
                <div className="flex-auto block py-8 pt-6 px-9 dark:text-white">
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  {planosCancelados.length === 0 ? (
                    <p className="text-center">Nenhum plano cancelado encontrado.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full my-0 align-middle text-dark border-neutral-200 dark:bg-gray-900 dark:text-white">
                        <thead className="align-bottom">
                          <tr className="font-semibold text-[0.95rem] text-secondary-dark">
                            <th className="pb-3 text-center min-w-fit">Data de Nascimento</th>
                            <th className="pb-3 text-center min-w-fit">Protocolo</th>
                            <th className="pb-3 text-center min-w-fit">Origem</th>
                            <th className="pb-3 text-center min-w-fit">Cancelado Por</th>
                            <th className="pb-3 text-center min-w-fit">Nome Candidato</th>
                            <th className="pb-3 text-center min-w-fit">Email Candidato</th>
                            <th className="pb-3 text-center min-w-fit">CPF Candidato</th>
                            <th className="pb-3 text-center min-w-fit">Plano Situação</th>
                            <th className="pb-3 text-center min-w-fit">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {planosCancelados.map((plano) => (
                            <tr key={plano.idf_PlanoMotivoCancelamento} className="border-b border-dashed last:border-b-0">
                              <td className="p-3 pl-0">
                                <div className="flex items-center">
                                  <div className="flex flex-col justify-center">
                                    <span className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-lg/normal text-secondary-inverse hover:text-primary">
                                      {plano.dta_Cancelamento || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 pr-0 text-center">
                                <span className="font-semibold text-light-inverse text-md/normal">{plano.idf_PlanoAdquirido || "N/A"}</span>
                              </td>
                              <td className="p-3 pr-0 text-center">
                                <span className="text-center align-baseline inline-flex px-2 py-1 mr-auto items-center font-semibold text-base/none text-success bg-success-light rounded-lg">
                                  {origemMotivoCancelamentoMap[plano.idf_MotivoCancelamento] || "N/A"}
                                </span>
                              </td>
                              <td className="p-3 pr-12 text-center">
                                <span className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-primary bg-primary-light rounded-lg">{plano.nme_Atendente || "N/A"}</span>
                              </td>
                              <td className="pr-0 text-center">
                                <span className="font-semibold text-light-inverse text-md/normal">{plano.planoAdquirido.idf_UsuarioFilialPerfil?.pessoaFisica?.nome || "N/A"}</span>
                              </td>
                              <td className="p-3 pr-0 text-center">
                                <span className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-primary bg-primary-light rounded-lg">{plano.planoAdquirido.idf_UsuarioFilialPerfil?.pessoaFisica?.email || "N/A"}</span>
                              </td>
                              <td className="p-3 pr-0 text-center">
                                <span className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-primary bg-primary-light rounded-lg">{plano.planoAdquirido.idf_UsuarioFilialPerfil?.pessoaFisica?.cpf || "N/A"}</span>
                              </td>
                              <td className="p-3 pr-0 text-center">
                                <span className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-primary bg-primary-light rounded-lg">{planoSituacaoMap[plano.planoAdquirido?.idf_PlanoSituacao] || "N/A"}</span>
                              </td>
                              <td className="p-3 pr-0 text-center">
                                <button type="button" className="inline-flex items-center gap-x-2 rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold text-gray-400 shadow-sm hover:bg-blue-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600" onClick={() => toggleModal(plano)}>
                                  <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M15 13a3 3 0 1 0-6 0" />
                                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                                      <circle cx="12" cy="8" r="2" />
                                    </svg>
                                  </span>
                                </button>

                                <button type="button" className="inline-flex items-center gap-x-2 rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold text-gray-400 shadow-sm hover:bg-red-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600" onClick={() => toggleModal2(plano)}>
                                  <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m13.5 8.5-5 5" />
                                      <path d="m8.5 8.5 5 5" />
                                      <circle cx="11" cy="11" r="8" />
                                      <path d="m21 21-4.3-4.3" />
                                    </svg>
                                  </span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                <nav aria-label="Page navigation example">
                    <ul className="flex items-center -space-x-px h-10 text-base">
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <span className="sr-only">Anterior</span>
                          <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                          </svg>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li key={index}>
                          <button
                            onClick={() => handlePageChange(index + 1)}
                            className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === index + 1 ? 'text-white bg-blue-500 border-blue-600' : 'text-gray-500 bg-white'} border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <span className="sr-only">Próximo</span>
                          <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isModalOpen1 && selectedPlano && (
          <div className="flex overflow-y-auto overflow-x-hidden fixed top-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" id="modal">
            <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
              <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border dark:bg-gray-800">
                <div className="w-full flex justify-start text-gray-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 13a3 3 0 1 0-6 0" />
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                    <circle cx="12" cy="8" r="2" />
                  </svg>
                </div>
                <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">Detalhes do Plano Cancelado</h1>
                <p>Protocolo: {selectedPlano.idf_PlanoAdquirido || "N/A"}</p>
                <p>Data de início do plano: {selectedPlano.planoAdquirido?.dataCadastro || "N/A"}</p>
                <p>Data de Cancelamento do Plano: {selectedPlano.planoAdquirido?.dataCancelamento || "N/A"}</p>
                <p>Data de fim do plano: {selectedPlano.planoAdquirido?.dataFimPlano || "N/A"}</p>
                <p>Cancelado Por: {selectedPlano.nme_Atendente || "N/A"}</p>
                <p>Nome do Candidato: {selectedPlano.planoAdquirido.idf_UsuarioFilialPerfil?.pessoaFisica?.nome || "N/A"}</p>
                <p>Email do Candidato: {selectedPlano.planoAdquirido.idf_UsuarioFilialPerfil?.pessoaFisica?.email || "N/A"}</p>
                <p>CPF do Candidato: {selectedPlano.planoAdquirido.idf_UsuarioFilialPerfil?.pessoaFisica?.cpf || "N/A"}</p>
                <p>Motivo Cancelamento: {selectedPlano.motivoCancelamento?.des_MotivoCancelamento || "N/A"}</p>
                <p>Detalhe do motivo de Cancelamento: {selectedPlano?.des_DetalheMotivoCancelamento || "N/A"}</p>
                <p>Situação do Plano: {planoSituacaoMap[selectedPlano.planoAdquirido?.idf_PlanoSituacao] || "N/A"}</p>
                <p>Descrição do Plano: {selectedPlano.planoAdquirido?.idf_Plano || "N/A"}</p>
                <button className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" aria-label="close modal" role="button" onClick={() => setisModalOpen1(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        {isModalOpen2 && selectedPlano && (
          <div className="flex overflow-y-auto overflow-x-hidden fixed top-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" id="modal">
            <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
              <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border dark:bg-gray-800">
                <div className="w-full flex justify-start text-gray-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#DB0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m13.5 8.5-5 5" />
                    <path d="m8.5 8.5 5 5" />
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4 dark:text-white">Motivo Cancelamento</h1>
                <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
                  <div className="relative mb-5 mt-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Motivo Cancelamento</label>
                    <select id="motivo-cancelamento" value={motivoCancelamento} onChange={handleMotivoCancelamentoChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <option value="">Selecione o Motivo do Cancelamento</option>
                      {Object.entries(motivoCancelamentoMap).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative mb-5 mt-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Origem Cancelamento</label>
                    <select id="origem-cancelamento" value={origemCancelamento} onChange={handleOrigemCancelamentoChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <option value="">Selecione a Origem do Cancelamento</option>
                      {Object.entries(origemMotivoCancelamentoMap).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-start w-full">
                    <button type="submit" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-[#DB0000] bg-[#DB0000] rounded text-white px-8 py-2 text-sm">Cadastrar</button>
                  </div>
                  <button type="button" className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" aria-label="close modal" role="button" onClick={() => setisModalOpen2(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
