import React, { useState, useEffect } from 'react';
import BarraBusca from '../Busca/BarraBusca'; // Importando o componente de busca
import '../Estilização/cadastros.css';

function AgendamentoSalas() {
  const [salas, setSalas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [disponivel, setDisponivel] = useState(true);
  const [agendamentos, setAgendamentos] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    async function fetchSalas() {
      try {
        const response = await fetch(`${apiUrl}/salas`);
        const data = await response.json();
        setSalas(data);
      } catch (error) {
        alert('Erro ao carregar as salas: ' + error.message);
      }
    }

    async function fetchClientes() {
      try {
        const response = await fetch(`${apiUrl}/clientes`);
        const data = await response.json();
        setClientes(data);
        setClientesFiltrados(data);
      } catch (error) {
        alert('Erro ao carregar os clientes: ' + error.message);
      }
    }

    async function fetchAgendamentos() {
      try {
        const response = await fetch(`${apiUrl}/agendamento`);
        const data = await response.json();
        setAgendamentos(data);
      } catch (error) {
        alert('Erro ao carregar os agendamentos: ' + error.message);
      }
    }

    fetchSalas();
    fetchClientes();
    fetchAgendamentos();
  }, []);

  const filtrarClientes = (termo) => {
    const filtered = clientes.filter(cliente => 
      (cliente.cli_nome && cliente.cli_nome.toLowerCase().includes(termo.toLowerCase())) || 
      (cliente.cli_razao && cliente.cli_razao.toLowerCase().includes(termo.toLowerCase()))
    );
    setClientesFiltrados(filtered);
  };

  const verificarDisponibilidade = async () => {
    try {
      const response = await fetch(`${apiUrl}/agendamento/verificar-disponibilidade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sal_id: salaSelecionada,
          age_data: dataAgendamento,
          age_horario_inicio: horarioInicio,
          age_horario_fim: horarioFim
        })
      });
      const result = await response.json();
      setDisponivel(result.disponivel);

      if (result.disponivel) {
        alert('Sala disponível no horário selecionado.');
      } else {
        alert('Sala indisponível no horário selecionado.');
      }
    } catch (error) {
      alert('Erro ao verificar disponibilidade: ' + error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disponivel) {
      try {
        const response = await fetch(`${apiUrl}/agendamento`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cli_id: clienteSelecionado,
            sal_id: salaSelecionada,
            age_data: dataAgendamento,
            age_horario_inicio: horarioInicio,
            age_horario_fim: horarioFim
          })
        });
        if (response.ok) {
          alert('Sala agendada com sucesso');
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Erro ao agendar sala: ${errorData.message}`);
        }
      } catch (error) {
        alert('Erro ao agendar sala: ' + error.message);
      }
    }
  };

  // Função para verificar se todos os campos estão preenchidos
  const todosCamposPreenchidos = () => {
    return salaSelecionada && clienteSelecionado && dataAgendamento && horarioInicio && horarioFim;
  };

  return (
    <div>
      <form className="container mt-5" onSubmit={handleSubmit}>
        <h1>Agendamento de Sala</h1>

        <div className="form-group">
          <label htmlFor="cliente">Cliente</label>
          <BarraBusca
            placeHolder="Buscar cliente"
            dados={clientesFiltrados}
            campoChave="cli_id"
            campoBusca="cli_nome"
            funcaoSelecao={(cliente) => setClienteSelecionado(cliente.cli_id)}
            valor={clienteSelecionado}
          />
        </div>

        <div className="form-group">
          <label htmlFor="sala">Sala</label>
          <select
            className="form-control"
            id="sala"
            value={salaSelecionada}
            onChange={(e) => setSalaSelecionada(e.target.value)}
            required
          >
            <option value="">Selecione uma sala</option>
            {salas.length > 0 ? (
              salas.map((sala) => (
                <option key={sala.sal_id} value={sala.sal_id}>
                  {sala.sal_nome}
                </option>
              ))
            ) : (
              <option value="">Nenhuma sala disponível</option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="data">Data</label>
          <input
            type="date"
            className="form-control"
            id="data"
            value={dataAgendamento}
            onChange={(e) => setDataAgendamento(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="horarioInicio">Horário de Início</label>
          <input
            type="time"
            className="form-control"
            id="horarioInicio"
            value={horarioInicio}
            onChange={(e) => setHorarioInicio(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="horarioFim">Horário de Fim</label>
          <input
            type="time"
            className="form-control"
            id="horarioFim"
            value={horarioFim}
            onChange={(e) => setHorarioFim(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
        <button
        type="button" 
        className={`btn btn-primary ${!todosCamposPreenchidos() ? 'btn-disabled' : ''}`} 
        onClick={verificarDisponibilidade}
        disabled={!todosCamposPreenchidos()} // Desabilita se não estiver preenchido
      >
        Verificar Disponibilidade
      </button>

        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-success" disabled={!disponivel}>
            Agendar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgendamentoSalas;
