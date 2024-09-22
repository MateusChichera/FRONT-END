import React, { useState, useEffect } from 'react';
import '../Estilização/tabelas.css';
function TabelaSalas() {
  const [salas, setSalas] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await fetch('http://localhost:4001/salas');
        if (response.ok) {
          const data = await response.json();
          setSalas(data);
        } else {
          console.error('Erro ao buscar salas:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar salas:', error.message);
      }
    };

    fetchSalas();
  }, []);


  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:4001/salas/buscar/${busca}`);
      if (response.ok) {
        const data = await response.json();
        setSalas(data);
      } else {
        console.error('Erro ao buscar salas:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar salas:', error.message);
    }
  };




  const handleExcluir = async (id,nome) => {
    if (window.confirm(`Deseja mesmo excluir a sala ${nome}?`)) {
        try {
          const response = await fetch(`http://localhost:4001/salas/${id}`, {
            method: 'DELETE',
          });
  
          if (response.ok) {
            alert('Sala excluída com sucesso!');
            window.location.reload();
          } else {
            const errorData = await response.json();
            alert(`Erro ao excluir sala: ${errorData.message}`);
          }
        } catch (error) {
          alert(`Erro ao excluir sala: ${error.message}`);
        }
      }
  };

  return (
    <>
    <h1 className="mt-3">Lista de Salas</h1>
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
          <th scope="col">Tipo</th>
          <th scope="col">Andar</th>
          <th scope="col">Capacidade</th>
          <th scope="col">Observações</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody>
        {salas.map((sala) => (
          <tr key={sala.sal_id}>
            <td>{sala.sal_id}</td>
            <td>{sala.sal_nome}</td>
            <td>{sala.sal_tipo}</td>
            <td>{sala.sal_andar}</td>
            <td>{sala.sal_cap}</td>
            <td>{sala.sal_obs}</td>
            <td>
              <div className="d-flex">
                <button
                  className="btn btn-success btn-sm mr-1"
                  onClick={() => {
                    window.location.href = `/editar/sala/${sala.sal_id}`;
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleExcluir(sala.sal_id,sala.sal_nome)}
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

export default TabelaSalas;
