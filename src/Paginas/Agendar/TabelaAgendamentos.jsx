import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Estilização/tabelas.css';

function TabelaAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [dataBusca, setDataBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

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

  const buscarAgendamentos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/agendamento/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataBusca }),
      });
      const data = await response.json();
      setAgendamentos(data || []);
    } catch (error) {
      alert('Erro ao buscar agendamentos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const realizarCheck = async (id) => {
      const response = await fetch(`${apiUrl}/agendamento/check/${id}`, { method: 'POST' });
      const data = await response.json();
      alert("Check-in/check-out realizado com sucesso!");

      // Atualiza a lista de agendamentos
      fetchAgendamentos();

  };

  const excluirAgendamento = async (id) => {
    if (window.confirm('Deseja realmente excluir este agendamento?')) {
      try {
        const response = await fetch(`${apiUrl}/agendamento/${id}`, { method: 'DELETE' });
        if (response.ok) {
          alert('Agendamento excluído com sucesso');
          setAgendamentos(agendamentos.filter((agendamento) => agendamento.age_id !== id));
        }
      } catch (error) {
        alert('Erro ao excluir agendamento: ' + error.message);
      }
    }
  };

  const editarAgendamento = (agendamento) => {
    navigate(`/agendamento/editar/${agendamento.age_id}`, { state: agendamento });
  };

  const aprovarAgendamento = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/agendamento/aprovar/${id}`, { method: 'PUT' });
      alert('Agendamento aprovado com sucesso');
      fetchAgendamentos();
    } catch (error) {
      alert('Erro ao aprovar agendamento: ' + error.message);
    }
  };

  return (
    <div className="mt-5 text-center">
      <h1 className="mt-3">Lista de agendamentos</h1>
      <div className="mb-3 input-group justify-content-center">
        <input
          type="date"
          value={dataBusca}
          onChange={(e) => setDataBusca(e.target.value)}
          className="form-control input-busca"
        />
        <button className="btn btn-primary" onClick={buscarAgendamentos}>
          🔍
        </button>
      </div>

      {isLoading ? (
        <p>Carregando agendamentos...</p>
      ) : (
        <table className="table mt-3 table-striped mx-auto">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Sala</th>
              <th>Data</th>
              <th>Horário de Início</th>
              <th>Horário de Fim</th>
              <th>Status</th>
              <th>Check-in</th>
              <th>Check-out</th>
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
                  <td>{agendamento.age_status}</td>
                  <td>{agendamento.check_in ? new Date(agendamento.check_in).toLocaleString() : '—'}</td>
                  <td>{agendamento.check_out ? new Date(agendamento.check_out).toLocaleString() : '—'}</td>
                  <td>
                    {agendamento.age_status === 'pendente' && (
                      <button
                        className="btn btn-success btn-sm me-1"
                        onClick={() => aprovarAgendamento(agendamento.age_id)}
                      >
                        <i className="fas fa-check"></i> Aprovar
                      </button>
                    )}
                    {agendamento.age_status === 'check-in' &&
                      !agendamento.check_out && ( // Só exibe se check_out estiver vazio
                        <button
                          className={`btn ${
                            agendamento.check_in ? 'btn-primary' : 'btn-success'
                          } btn-sm me-1`}
                          onClick={() => realizarCheck(agendamento.age_id)}
                        >
                          <i
                            className={`fas ${
                              agendamento.check_in ? 'fa-sign-out-alt' : 'fa-sign-in-alt'
                            }`}
                          ></i>{' '}
                          {agendamento.check_in ? 'Check-out' : 'Check-in'}
                        </button>
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
                <td colSpan="9">Nenhum agendamento encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TabelaAgendamentos;
