// src/App.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './Componentes/NavBar';
import './App.css';

function App() {
  const location = useLocation();

  // Verifica se a rota atual é a de login
  const isLoginPage = location.pathname === '/';

  return (
    <div className="App">
      {!isLoginPage && <NavBar />}
      <h1>Seja bem-vindo ao site.</h1>
      {}
    </div>
  );
}

export default App;
