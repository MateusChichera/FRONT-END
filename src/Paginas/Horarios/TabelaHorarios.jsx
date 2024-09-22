import React, { useState, useEffect } from 'react';
import '../Estilização/tabelas.css';

function TabelaHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const response = await fetch('http://localhost:4001/horarios');
        if (response.ok) {
          const data = await response.json();
          setHorarios(data);
        } else {
          console.error('Erro ao buscar horarios:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar horarios:', error.message);
      }
    };

    fetchPlanos();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:4001/horarios/buscar/${busca}`);
      if (response.ok) {
        const data = await response.json();
        setHorarios(data);
      } else {
        console.error('Erro ao buscar salas:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar salas:', error.message);
    }
  };


  const handleExcluir = async (id,nome) => {
    if (window.confirm(`Deseja mesmo excluir o horário da sala ${nome}?`)) {
      try {
        const response = await fetch(`http://localhost:4001/horarios/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Horario excluído com sucesso!');
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Erro ao excluir horario: ${errorData.message}`);
        }
      } catch (error) {
        alert(`Erro ao excluir horario: ${error.message}`);
      }
    }
  };

  return (
    <>
      <h1 className="mt-3">Lista de Horarios</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Busca por nome/dias"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary cor" type="button" onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      <table className="table mt-3 table-striped">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Tipo</th>
            <th scope="col">Dias</th>
            <th scope="col">Inico</th>
            <th scope="col">Fim</th>
            <th scope="col">Açoes</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((horario) => (
            <tr key={horario.hor_id}>
              <td>{horario.hor_id}</td>
              <td>{horario.hor_tipo}</td>
              <td>{horario.hor_dias}</td>
              <td>{horario.hor_inicio}</td>
              <td>{horario.hor_fim}</td>
              <td>
                <div className="d-flex">
                  <button
                    className="btn btn-success btn-sm mr-1"
                    onClick={() => {
                      window.location.href = `/editar/horarios/${horario.hor_id}`;
                    }}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleExcluir(horario.hor_id,horario.hor_tipo)}
                  >
                    <i className="fas fa-trash-alt"></i> Excluir
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

export default TabelaHorarios;
