// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import NavBar from './Componentes/NavBar';
import Login from './Paginas/Login/Login.jsx';
import Home from './Paginas/Home/Home.jsx'; // Importa a página inicial
import Salas from './Paginas/Salas/Salas.jsx';
import Horarios from './Paginas/Horarios/Horarios.jsx';
import Planos from './Paginas/Planos/Planos.jsx';
import Clientes from './Paginas/Clientes/Clientes.jsx';
import TabelaClientes from './Paginas/Clientes/TabelaClientes.jsx';
import Editar from './Paginas/Clientes/Editar.jsx';
import TabelaSalas from './Paginas/Salas/TabelaSalas.jsx';
import EditarSalas from './Paginas/Salas/EditarSalas.jsx';
import TabelaPlanos from './Paginas/Planos/TabelaPlanos.jsx';
import EditarPlanos from './Paginas/Planos/EditarPlanos.jsx';
import TabelaHorarios from './Paginas/Horarios/TabelaHorarios.jsx';
import EditarHorario from './Paginas/Horarios/EditarHorario.jsx';
import Funcionarios from './Paginas/Funcionarios/Funcionario.jsx';
import TabelaFuncionarios from './Paginas/Funcionarios/TabelaFuncionarios.jsx';
import EditarFuncionarios from './Paginas/Funcionarios/EditarFuncionarios.jsx';
import AgendamentoSalas from './Paginas/Agendar/Agendar.jsx';
import TabelaAgendamentos from './Paginas/Agendar/TabelaAgendamentos.jsx';
import EditarAgendamento from './Paginas/Agendar/EditarAgendamentos.jsx';
import AssociarPlanos from './Paginas/Associar/Associar.jsx';
import TrocaSenha from './Paginas/Funcionarios/TrocaSenha.jsx';
import PrivateRoute from './Componentes/PrivateRoute'; // Importa o componente de proteção de rota
import RedefinirSenha from './Paginas/Login/Redefinirsenha.jsx';
import RelatorioUtilizacaoSalas from './Paginas/Relatorios/Utilização.jsx';
import RelatorioCheckInCheckOut from './Paginas/Relatorios/Checks.jsx';
import Leads from './Paginas/Relatorios/Leads.jsx';
import RelatorioPlanosPorCliente from './Paginas/Relatorios/Planos.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/redefinir-senha',
    element: <RedefinirSenha />,
  },
  {
    element: <NavBar />, // Navbar será usado como layout para páginas protegidas
    children: [ 
      {
        path: '/editar/funcionarios/:id',
        element: <PrivateRoute element={< EditarFuncionarios/>} />, // Protege a página inicial
      },
      {
        path: '/relatorio/utilizacao',
        element: <PrivateRoute element={< RelatorioUtilizacaoSalas/>} />, // Protege a página inicial
      },
      {
        path: '/relatorio/planos',
        element: <PrivateRoute element={< RelatorioPlanosPorCliente/>} />, // Protege a página inicial
      },
      {
        path: '/relatorio/leads',
        element: <PrivateRoute element={< Leads/>} />, // Protege a página inicial
      },
      {
        path: '/relatorio/check',
        element: <PrivateRoute element={< RelatorioCheckInCheckOut/>} />, // Protege a página inicial
      },
      {
        path: '/buscar/funcionarios',
        element: <PrivateRoute element={<TabelaFuncionarios />} />, // Protege a página inicial
      },
      {
        path: '/associar',
        element: <PrivateRoute element={<AssociarPlanos />} />, // Protege a página inicial
      },
      {
        path: '/buscar/agendamentos',
        element: <PrivateRoute element={<TabelaAgendamentos />} />, // Protege a página inicial
      },
      {
        path: '/agendamento/editar/:id',
        element: <PrivateRoute element={<EditarAgendamento />} />, // Protege a página inicial
      },
      {
        path: '/trocarsenha',
        element: <PrivateRoute element={<TrocaSenha />} />, // Protege a página inicial
      },
      {
      path: '/funcionario',
      element: <PrivateRoute element={<Funcionarios />} />, // Protege a página inicial
    },
      {
        path: '/',
        element: <PrivateRoute element={<Home />} />, // Protege a página inicial
      },
      {
        path: '/home',
        element: <PrivateRoute element={<Home />} />, // Protege a página inicial
      },
      {
        path: '/salas',
        element: <PrivateRoute element={<Salas />} />,
      },
      {
        path: '/horarios',
        element: <PrivateRoute element={<Horarios />} />,
      },
      {
        path: '/clientes',
        element: <PrivateRoute element={<Clientes />} />,
      },
      {
        path: '/planos',
        element: <PrivateRoute element={<Planos />} />,
      },
      {
        path: '/buscar',
        element: <PrivateRoute element={<TabelaClientes />} />,
      },
      {
        path: '/editar/:id',
        element: <PrivateRoute element={<Editar />} />,
      },
      {
        path: '/buscar/salas',
        element: <PrivateRoute element={<TabelaSalas />} />,
      },
      {
        path: '/editar/sala/:id',
        element: <PrivateRoute element={<EditarSalas />} />,
      },
      {
        path: '/buscar/planos',
        element: <PrivateRoute element={<TabelaPlanos />} />,
      },
      {
        path: '/editar/planos/:id',
        element: <PrivateRoute element={<EditarPlanos />} />,
      },
      {
        path: '/buscar/horarios',
        element: <PrivateRoute element={<TabelaHorarios />} />,
      },
      {
        path: '/editar/horarios/:id',
        element: <PrivateRoute element={<EditarHorario />} />,
      },
      {
        path: '/agendar',
        element: <PrivateRoute element={<AgendamentoSalas />} />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
