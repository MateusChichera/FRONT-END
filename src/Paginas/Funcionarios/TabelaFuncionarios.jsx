import React, { useState, useEffect } from 'react';
import '../Estilização/tabelas.css';

function TabelaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await fetch('http://localhost:4001/funcionarios');
        if (response.ok) {
          const data = await response.json();
          setFuncionarios(data);
        } else {
          console.error('Erro ao buscar funcionários:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error.message);
      }
    };

    fetchFuncionarios();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:4001/funcionarios/buscar/${busca}`);
      if (response.ok) {
        const data = await response.json();
        setFuncionarios(data);
      } else {
        console.error('Erro ao buscar funcionários:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error.message);
    }
  };

  const handleExcluir = async (id, nome) => {
    if (window.confirm(`Deseja mesmo excluir o funcionário ${nome}?`)) {
      try {
        const response = await fetch(`http://localhost:4001/funcionarios/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Funcionário excluído com sucesso!');
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Erro ao excluir funcionário: ${errorData.message}`);
        }
      } catch (error) {
        alert(`Erro ao excluir funcionário: ${error.message}`);
      }
    }
  };

  return (
    <>
      <h1 className="mt-3">Lista de Funcionários</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Busca por nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary cor" type="button" onClick={handleSearch}>
          🔍
          </button>
        </div>
      </div>
      <table className="table mt-3 table-striped">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nome</th>
            <th scope="col">Setor</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((funcionario) => (
            <tr key={funcionario.fun_id}>
              <td>{funcionario.fun_id}</td>
              <td>{funcionario.fun_nome}</td>
              <td>{funcionario.fun_setor}</td>
              <td>
                <div className="d-flex">
                  <button
                    className="btn btn-success btn-sm mr-1"
                    onClick={() => {
                      window.location.href = `/editar/funcionarios/${funcionario.fun_id}`;
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleExcluir(funcionario.fun_id, funcionario.fun_nome)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TabelaFuncionarios;
