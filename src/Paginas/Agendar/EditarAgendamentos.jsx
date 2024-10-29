import React, { useState, useEffect } from 'react';
import BarraBusca from '../Busca/BarraBusca';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Estilização/cadastros.css';

function EditarAgendamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const agendamento = location.state;

  const [salas, setSalas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState(agendamento.sal_id);
  const [clienteSelecionado, setClienteSelecionado] = useState({ cli_id: agendamento.cli_id, cli_nome: agendamento.cli_nome });
  const [dataAgendamento, setDataAgendamento] = useState(agendamento.age_data.split('T')[0]);
  const [horarioInicio, setHorarioInicio] = useState(agendamento.age_horario_inicio);
  const [horarioFim, setHorarioFim] = useState(agendamento.age_horario_fim);
  const [disponivel, setDisponivel] = useState(true);
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

    fetchSalas();
    fetchClientes();
  }, []);

  const filtrarClientes = (termo) => {
    if (typeof termo !== 'string') return;
    const filtered = clientes.filter(cliente =>
      (cliente.cli_nome && cliente.cli_nome.toLowerCase().includes(termo.toLowerCase())) ||
      (cliente.cli_razao && cliente.cli_razao.toLowerCase().includes(termo.toLowerCase()))
    );
    setClientesFiltrados(filtered);
  };

  const verificarDisponibilidade = async () => {
    try {
      const response = await fetch(`${apiUrl}/salas/agendamento/verificar-disponibilidade`, {
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

      alert(result.disponivel ? 'Sala disponível no horário selecionado.' : 'Sala indisponível no horário selecionado.');
    } catch (error) {
      alert('Erro ao verificar disponibilidade: ' + error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disponivel) {
        try {
          const response = await fetch(`${apiUrl}/agendamento/${agendamento.age_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cli_id: clienteSelecionado.cli_id,
                    sal_id: salaSelecionada,
                    age_data: dataAgendamento,
                    age_horario_inicio: horarioInicio,
                    age_horario_fim: horarioFim
                })
            });

            const result = await response.json(); // Certifique-se de esperar a resposta

            if (response.ok) {
                alert(result.message); // Exibe a mensagem de sucesso
                navigate('/agendamentos'); // Redireciona após a atualização
            } else {
                alert(`Agendamento atualizado com sucesso!`); // Exibe mensagem de erro
                navigate('/buscar/agendamentos'); // Redireciona após a atualização
            }
        } catch (error) {
            alert('Erro ao atualizar agendamento: ' + error.message);
        }
    }
};


  return (
    <div>
      <form className="container mt-5" onSubmit={handleSubmit}>
        <h1>Editar Agendamento</h1>

        <div className="form-group">
          <label htmlFor="cliente">Cliente</label>
          <BarraBusca
            placeHolder="Buscar cliente"
            dados={clientesFiltrados}
            campoChave="cli_id"
            campoBusca="cli_nome"
            funcaoSelecao={(cliente) => setClienteSelecionado(cliente)}
            valor={clienteSelecionado.cli_nome || ''}
            onChange={(termo) => filtrarClientes(termo)}
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
            className="btn btn-primary"
            onClick={verificarDisponibilidade}
          >
            Verificar Disponibilidade
          </button>
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-success" disabled={!disponivel}>
            Atualizar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarAgendamento;
