'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserCog, UserX, Users, LogOut, User } from 'lucide-react';
import { ModeToggle } from '../components/toggle';
import { useTheme } from 'next-themes';
import Logo from '../imgs/reports__4_-removebg-preview.png';

export default function Inicio() {
  const [isGerente, setIsGerente] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme } = useTheme(); 
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole === 'Gerente') {
      setIsGerente(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('cpf');
    localStorage.removeItem('user');
    router.push('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="flex flex-col h-screen dark:bg-gray-800 dark:text-white bg-gray-100 text-gray-900">
<nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          <a href="/inicio" className="flex items-center">
            <img src={Logo.src} className="h-16 ml-4" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-amber-300">ReportsBne</span>
          </a>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <ModeToggle />
              </li>
              <li>
              <button
                onClick={toggleDropdown}
                className="flex items-center p-2.5 py-2.5 dark:bg-gray-800 bg-white rounded-full  focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full border">
                <User className="w-5 h-5" />
              </button>

              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
                  <ul className="py-1">
                    {isGerente && (
                      <li>
                        <button
                          onClick={() => router.push('/FuncionariosToList')}
                          className="flex items-center w-full px-4 py-2 text-left dark:text-white dark:hover:bg-gray-700 text-gray-900 hover:bg-gray-100"
                        >
                          <UserCog className="w-5 h-5 mr-2" />
                          Gerenciar Atendentes
                        </button>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-left dark:text-white dark:hover:bg-gray-700 text-gray-900 hover:bg-gray-100"
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        Encerrar Sessão
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    

      <div className="flex items-center justify-center h-full">
        <div className="grid grid-cols-2 gap-8 p-8">
          <div
            className="flex flex-col items-center justify-center dark:bg-gray-900 dark:text-white bg-white text-gray-900  rounded-lg shadow-md h-80 w-[470px] cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onClick={() => router.push('/MotivosCancelamento')}
          >
            <UserX className="w-10 h-10 mb-4" />
            <span className="text-lg font-semibold">Motivos de Cancelamento</span>
          </div>

          <div
            className="flex flex-col items-center justify-center dark:bg-gray-900 dark:text-white bg-white text-gray-900  rounded-lg shadow-md h-80 w-[470px] cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onClick={() => router.push('/MotivosSuporte')}
          >
            <Users className="w-10 h-10 mb-4" />
            <span className="text-lg font-semibold">Motivos de Suporte</span>
          </div>
        </div>
      </div>
    </div>
  );
}
