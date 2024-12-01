import React, { useState, useEffect } from 'react';
import BarraBusca from '../Busca/BarraBusca'; // Importando o componente de busca
import '../Estilização/cadastros.css';

function AssociarPlanos() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [planos, setPlanos] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState('');
  const [planoValor, setPlanoValor] = useState('');
  const [planoDias, setPlanoDias] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const dataAtual = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  // Carregar clientes e planos ao montar o componente
  useEffect(() => {
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

  // Atualiza valor e dias do plano ao selecionar um plano
  const handlePlanoChange = (e) => {
    const selectedPlanoId = parseInt(e.target.value);
    setPlanoSelecionado(selectedPlanoId);

    const selectedPlano = planos.find((plano) => plano.pla_id === selectedPlanoId);
    if (selectedPlano) {
      setPlanoValor(selectedPlano.pla_valor);
      setPlanoDias(selectedPlano.pla_dias);
    } else {
      setPlanoValor('');
      setPlanoDias('');
    }
  };

  // Filtrar clientes conforme a busca
  const filtrarClientes = (termo) => {
    const filtered = clientes.filter((cliente) =>
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
          formapagamento: formaPagamento,
          data: dataAtual,  
        }),
      });

      if (response.ok) {
        alert('Plano associado com sucesso ao cliente!');
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
    return clienteSelecionado && planoSelecionado && formaPagamento;
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
            onChange={handlePlanoChange}
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

        {/* Exibir valor e dias do plano (não editável) */}
        <div className="form-group">
          <label>Valor do Plano</label>
          <input type="text" className="form-control" value={planoValor} readOnly />
        </div>

        <div className="form-group">
          <label>Dias do Plano</label>
          <input type="text" className="form-control" value={planoDias} readOnly />
        </div>

        {/* Select para escolher forma de pagamento */}
        <div className="form-group">
          <label htmlFor="formaPagamento">Forma de Pagamento</label>
          <select
            className="form-control"
            id="formaPagamento"
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            required
          >
            <option value="">Selecione uma forma de pagamento</option>
            <option value="DINHEIRO">Dinheiro</option>
            <option value="PIX">Pix</option>
            <option value="CARTÃO DE DÉBITO">Cartão de Débito</option>
            <option value="CARTÃO DE CRÉDITO">Cartão de Crédito</option>
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
