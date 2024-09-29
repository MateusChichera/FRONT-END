import React, { useState, useEffect } from 'react';
import BarraBusca from '../Busca/BarraBusca'; // Importando o componente de busca
import '../Estilização/cadastros.css';

function AssociarPlanos() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [planos, setPlanos] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState('');
  const [associado, setAssociado] = useState(false);

  useEffect(() => {
    // Função para buscar os clientes do backend
    async function fetchClientes() {
      try {
        const response = await fetch('http://localhost:4001/clientes');
        const data = await response.json();
        setClientes(data);
        setClientesFiltrados(data);
      } catch (error) {
        alert('Erro ao carregar os clientes: ' + error.message);
      }
    }

    // Função para buscar os planos do backend
    async function fetchPlanos() {
      try {
        const response = await fetch('http://localhost:4001/planos');
        const data = await response.json();
        setPlanos(data);
      } catch (error) {
        alert('Erro ao carregar os planos: ' + error.message);
      }
    }

    fetchClientes();
    fetchPlanos();

  }, []);

  // Filtrar clientes conforme a busca
  const filtrarClientes = (termo) => {
    const filtered = clientes.filter(cliente =>
      (cliente.cli_nome && cliente.cli_nome.toLowerCase().includes(termo.toLowerCase())) ||
      (cliente.cli_razao && cliente.cli_razao.toLowerCase().includes(termo.toLowerCase()))
    );
    setClientesFiltrados(filtered);
  };

  // Função para associar plano ao cliente
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4001/associar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cli_id: clienteSelecionado,
          pla_id: planoSelecionado,
        })
      });

      if (response.ok) {
        alert('Plano associado com sucesso ao cliente!');
        setAssociado(true);
        window.location.reload(); // Atualiza a página após associação
      } else {
        const errorData = await response.json();
        alert(`Erro ao associar plano: ${errorData.message}`);
      }
    } catch (error) {
      alert('Erro ao associar plano: ' + error.message);
    }
  };

  // Função para verificar se todos os campos estão preenchidos
  const todosCamposPreenchidos = () => {
    return clienteSelecionado && planoSelecionado
  };

  return (
    <div>
      <form className="container mt-5" onSubmit={handleSubmit}>
        <h1>Associar Plano ao Cliente</h1>

        {/* Componente de busca para selecionar o cliente */}
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

        {/* Select para escolher o plano */}
        <div className="form-group">
          <label htmlFor="plano">Plano</label>
          <select
            className="form-control"
            id="plano"
            value={planoSelecionado}
            onChange={(e) => setPlanoSelecionado(e.target.value)}
            required
          >
            <option value="">Selecione um plano</option>
            {planos.length > 0 ? (
              planos.map((plano) => (
                <option key={plano.pla_id} value={plano.pla_id}>
                  {plano.pla_nome}
                </option>
              ))
            ) : (
              <option value="">Nenhum plano disponível</option>
            )}
          </select>
        </div>

        {/* Botão de submissão */}
        <div className="form-group">
          <button
            type="submit"
            className="btn btn-success"
            disabled={!todosCamposPreenchidos()}
          >
            Associar Plano
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssociarPlanos;
