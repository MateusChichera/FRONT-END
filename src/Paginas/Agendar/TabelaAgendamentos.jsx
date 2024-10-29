import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Estilização/tabelas.css';

function TabelaAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [dataBusca, setDataBusca] = useState(''); // Valor de busca (data)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  // Fetch padrão para carregar todos os agendamentos
  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/agendamento`);
      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      alert('Erro ao carregar os agendamentos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar agendamentos por data
  const buscarAgendamentos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/agendamento/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: dataBusca }), // Enviando a data como JSON
      });
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setAgendamentos(data); // Define os agendamentos encontrados
      } else {
        setAgendamentos([]); // Se não houver resultados, limpa a tabela
      }
    } catch (error) {
      alert('Erro ao buscar agendamentos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para excluir o agendamento
  const excluirAgendamento = async (id) => {
    if (window.confirm('Deseja realmente excluir este agendamento?')) {
      try {
        const response = await fetch(`${apiUrl}/agendamento/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Agendamento excluído com sucesso');
          setAgendamentos(agendamentos.filter((agendamento) => agendamento.age_id !== id));
        }
      } catch (error) {
        alert('Erro ao excluir agendamento: ' + error.message);
      }
    }
  };

  // Função para editar o agendamento
  const editarAgendamento = (agendamento) => {
    navigate(`/agendamento/editar/${agendamento.age_id}`, { state: agendamento });
  };

  // Função para aprovar o agendamento (atualizar age_status para "aprovado")
  const aprovarAgendamento = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/agendamento/aprovar/${id}`, {
        method: 'PUT',
      });
      
        alert('Agendamento aprovado com sucesso');
        // Atualizar a lista de agendamentos após a aprovação
        setAgendamentos(
          agendamentos.map((agendamento) =>
            agendamento.age_id === id ? { ...agendamento, age_status: 'aprovado' } : agendamento
          )
        );
     
    } catch (error) {
      alert('Erro ao aprovar agendamento: ' + error.message);
    }
  };

  return (
    <div className="mt-5 text-center"> {/* Centraliza o conteúdo */}
      <h1 className="mt-3">Lista de agendamentos</h1>

      {/* Campo de busca por data */}
      <div className="mb-3 input-group justify-content-center"> {/* Centraliza o campo de busca */}
        <input
          type="date"
          value={dataBusca}
          onChange={(e) => setDataBusca(e.target.value)}
          className="form-control input-busca"
        />
        <button className="btn btn-primary" onClick={buscarAgendamentos}>
          🔍 {/* Lupa (emoji ou ícone) */}
        </button>
      </div>

      {/* Tabela de agendamentos */}
      {isLoading ? (
        <p>Carregando agendamentos...</p>
      ) : (
        <table className="table mt-3 table-striped mx-auto"> {/* Centraliza a tabela */}
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Sala</th>
              <th>Data</th>
              <th>Horário de Início</th>
              <th>Horário de Fim</th>
              <th>Status</th> {/* Nova coluna de status */}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.length > 0 ? (
              agendamentos.map((agendamento) => (
                <tr key={agendamento.age_id}>
                  <td>{agendamento.cli_nome || agendamento.cli_razao}</td>
                  <td>{agendamento.sal_nome}</td>
                  <td>{new Date(agendamento.age_data).toLocaleDateString()}</td>
                  <td>{agendamento.age_horario_inicio}</td>
                  <td>{agendamento.age_horario_fim}</td>
                  <td>{agendamento.age_status}</td> {/* Exibe o status */}
                  <td>
                    {agendamento.age_status === 'pendente' && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-1"
                          onClick={() => aprovarAgendamento(agendamento.age_id)}
                        >
                          Aprovar
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-primary btn-sm me-1"
                      onClick={() => editarAgendamento(agendamento)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => excluirAgendamento(agendamento.age_id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhum agendamento encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TabelaAgendamentos;
