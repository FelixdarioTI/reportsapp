import { axiosInstance } from './axiosInstance';
import axios from 'axios';
export class UsuarioService {
  login(credentials: { email: string; cpf: string; }) {
    return axiosInstance.post('/Atendentes/Login', credentials);
  }

  fetchPlanosCancelados(page: number, p0: number) {
    const token = localStorage.getItem('token'); 
    return axiosInstance.get('https://testing-apibnereports.bne.com.br/ReportsBNE/PlanoMotivoCancelamento/ListarPlanoCancelados', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  fetchAtendentes() {
    const token = localStorage.getItem('token'); 
    return axiosInstance.get('/Atendentes/ListarAtendentes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  adicionarAtendente(atendente: any) {
    return axiosInstance.post('/Atendentes/AdicionarAtendente', atendente);
  }

  atualizarAtendente(id: string, atendente: any) {
    return axiosInstance.put(`/Atendentes/AtualizarAtendente`, { id, ...atendente });
  }

  excluirAtendente(id: string) {
    return axiosInstance.delete(`/Atendentes/ExcuirAtendente`, {
      data: { id }
    });
  }
}
