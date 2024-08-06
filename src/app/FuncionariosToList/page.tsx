'use client'
import {  Menu, UserX } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { ModeToggle } from "../components/toggle";
import Logo from '../imgs/reports__4_-removebg-preview.png';
import { UsuarioService } from "../../../service/Service";

const usuarioService = new UsuarioService();

interface Atendente {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  role: string;
}

export default function FuncionariosToList() {
  const [isModalOpen1, setisModalOpen1] = useState(false);
  const [isModalOpen2, setisModalOpen2] = useState(false);
  const [isModalOpen3, setisModalOpen3] = useState(false);
  const [atendentes, setAtendentes] = useState<Atendente[]>([]);
  const [selectedAtendente, setSelectedAtendente] = useState<Atendente | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    console.log("User role from localStorage:", userRole);
    if (userRole !== 'Gerente') {
      router.push('/inicio');
    }
  }, [router]);

  const toggleModal = (atendente: Atendente | null) => {
    if (atendente) {
      setSelectedAtendente(atendente);
      setNome(atendente.nome);
      setEmail(atendente.email);
      setCpf(atendente.cpf);
      setDataNascimento(atendente.data_nascimento);
      setRole(atendente.role);
    }
    setisModalOpen1(!isModalOpen1);
  };

  const toggleModal2 = (atendente: Atendente | null) => {
    setSelectedAtendente(atendente);
    setisModalOpen2(!isModalOpen2);
  };

  const toggleModal3 = () => {
    setNome('');
    setEmail('');
    setCpf('');
    setDataNascimento('');
    setRole('');
    setisModalOpen3(!isModalOpen3);
  };

  useEffect(() => {
    fetchAtendentes();
  }, []);

  const fetchAtendentes = () => {
    usuarioService.fetchAtendentes()
      .then(response => {
        console.log("Dados recebidos:", response.data);
        setAtendentes(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar os atendentes:", error.response ? error.response.data : error.message);
        console.error("Detalhes do erro:", error.response);
        setError('Erro ao buscar os atendentes. Verifique o console para mais detalhes.');
      });
  };

  const handleAddAtendente = (e: React.FormEvent) => {
    e.preventDefault();
    const newAtendente = { nome, email, cpf, data_nascimento: dataNascimento, role };
    usuarioService.adicionarAtendente(newAtendente)
      .then(response => {
        console.log("Atendente adicionado:", response.data);
        setisModalOpen3(false);
        fetchAtendentes();
      })
      .catch(error => {
        console.error("Erro ao adicionar atendente:", error.response ? error.response.data : error.message);
      });
  };

  const handleUpdateAtendente = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAtendente) {
      const updatedAtendente = { nome, email, cpf, data_nascimento: dataNascimento, role };
      usuarioService.atualizarAtendente(selectedAtendente.id, updatedAtendente)
        .then(response => {
          console.log("Atendente atualizado:", response.data);
          setisModalOpen1(false);
          fetchAtendentes();
        })
        .catch(error => {
          console.error("Erro ao atualizar atendente:", error.response ? error.response.data : error.message);
        });
    }
  };

  const handleDeleteAtendente = () => {
    if (selectedAtendente) {
      usuarioService.excluirAtendente(selectedAtendente.id)
        .then(response => {
          console.log("Atendente excluído:", response.data);
          setisModalOpen2(false);
          fetchAtendentes();
        })
        .catch(error => {
          console.error("Erro ao excluir atendente:", error.response ? error.response.data : error.message);
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
              <li>
                <a href="/inicio" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" aria-current="page"><Menu className="mr-2"/>Inicio</a>
              </li>
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
                    <span className="mr-3 font-semibold text-amber-300">Gerenciar Atendentes</span>
                  </h3>
                  <div className="relative flex flex-wrap items-center my-2">
                    <button type="button" className="inline-flex items-center gap-x-2 rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold text-gray-400 shadow-sm hover:bg-blue-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600" onClick={toggleModal3}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                      </span>
                      <span className="">Adicionar Atendente</span>
                    </button>
                  </div>
                </div>
                <div className="flex-auto block py-8 pt-6 px-9 dark:text-white">
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  <div className="overflow-x-auto">
                    <table className="w-full my-0 align-middle text-dark border-neutral-200 dark:bg-gray-900 dark:text-white">
                      <thead className="align-bottom">
                        <tr className="font-semibold text-[0.95rem] text-secondary-dark">
                          <th className="pb-3 text-center min-w-fit">Nome</th>
                          <th className="pb-3 text-center min-w-fit">Email</th>
                          <th className="pb-3 text-center min-w-fit">CPF</th>
                          <th className="pb-3 text-center min-w-fit">Data de Nascimento</th>
                          <th className="pb-3 text-center min-w-fit">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {atendentes.map((atendente) => (
                          <tr key={atendente.id} className="border-b border-dashed last:border-b-0">
                            <td className="p-3 pl-0">
                              <div className="flex items-center">
                                <div className="flex flex-col justify-center">
                                  <span className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-lg/normal text-secondary-inverse hover:text-primary">
                                    {atendente.nome}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 pr-0 text-center">
                              <span className="font-semibold text-light-inverse text-md/normal">{atendente.email}</span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-primary bg-primary-light rounded-lg">{atendente.cpf}</span>
                            </td>
                            <td className="p-3 pr-0 text-center">
                              <span className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-primary bg-primary-light rounded-lg">{atendente.data_nascimento}</span>
                            </td>
                            <td className="p-3 pr-0 text-center">
                              <button type="button" className="inline-flex items-center gap-x-2 rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold text-gray-400 shadow-sm hover:bg-blue-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600" onClick={() => toggleModal(atendente)}>
                                <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 13a3 3 0 1 0-6 0"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><circle cx="12" cy="8" r="2"/></svg>
                                </span>
                              </button>
                              <button type="button" className="inline-flex items-center gap-x-2 rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold text-gray-400 shadow-sm hover:bg-red-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600" onClick={() => toggleModal2(atendente)}>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen1 && selectedAtendente && (
          <div id="authentication-modal" tabIndex={-1} aria-hidden="true" className=" flex overflow-y-auto overflow-x-hidden fixed top-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 13a3 3 0 1 0-6 0"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><circle cx="12" cy="8" r="2"/></svg>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4 dark:text-white">
                      Atualizar Cadastro
                  </h3>
                  <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={() => setisModalOpen1(false)}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Fechar modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5">
                  <form className="space-y-4" onSubmit={handleUpdateAtendente}>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input type="text" name="name" value={nome} onChange={(e) => setNome(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                      <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
                      <input type="text" name="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data de Nascimento</label>
                      <input type="date" name="data_nascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                      <input type="text" name="role" value={role} onChange={(e) => setRole(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Atualizar Cadastro</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModalOpen2 && selectedAtendente && (
          <div id="modal">
            <div id="popup-modal" className="flex overflow-y-auto overflow-x-hidden fixed top-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                  <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal" onClick={() => setisModalOpen2(false)}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Fechar modal</span>
                  </button>
                  <div className="p-4 md:p-5 text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Você realmente deseja excluir a atendente?</h3>
                    <button data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center" onClick={handleDeleteAtendente}>
                      Sim, Exclua.
                    </button>
                    <button data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-800" onClick={() => setisModalOpen2(false)}>Não, cancele</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModalOpen3 && (
          <div id="authentication-modal" tabIndex={-1} aria-hidden="true" className="flex overflow-y-auto overflow-x-hidden fixed top-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                  <h3 className="text-xl font-semibold ml-4 text-gray-900 dark:text-white">
                    Adicionar Cadastro
                  </h3>
                  <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={() => setisModalOpen3(false)}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Fechar modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5">
                  <form className="space-y-4" onSubmit={handleAddAtendente}>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input type="text" name="name" value={nome} onChange={(e) => setNome(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                      <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
                      <input type="text" name="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data de Nascimento</label>
                      <input type="date" name="data_nascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                      <input type="text" name="role" value={role} onChange={(e) => setRole(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Adicionar Cadastro</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
