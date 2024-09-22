import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import '../Estilização/tabelas.css';

function TabelaClientes({ setMostrarTabela }) {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [tipoBusca, setTipoBusca] = useState('nome');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:4001/clientes');
        if (response.ok) {
          const data = await response.json();
          setClientes(data);
        } else {
          console.error('Erro ao buscar clientes:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error.message);
      }
    };

    fetchClientes();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:4001/clientes/buscar/${busca}`);
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        console.error('Erro ao buscar clientes:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error.message);
    }
  };

  const handleTipoBuscaChange = (e) => {
    setTipoBusca(e.target.value);
    setBusca(''); // Limpa o valor do campo de busca ao mudar o tipo de busca
  };

  const handleDelete = async (id,nome,razao) => {
    if (window.confirm(`Deseja mesmo excluir o horário de ${nome} ${razao}?`)) {
      try {
        const response = await fetch(`http://localhost:4001/clientes/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Cliente excluído com sucesso!');
          setClientes(clientes.filter(cliente => cliente.cli_id !== id));
        } else {
          const errorData = await response.json();
          alert(`Erro ao excluir cliente: ${errorData.message}`);
        }
      } catch (error) {
        alert(`Erro ao excluir cliente: ${error.message}`);
      }
    }
  };

  const renderInputBusca = () => {
    switch (tipoBusca) {
      case 'nome':
        return (
          <input
            type="text"
            className="form-control"
            placeholder="Digite o nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        );
      case 'cpf':
        return (
          <InputMask
            mask="999.999.999-99"
            type="text"
            className="form-control"
            placeholder="Digite o CPF"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        );
      case 'cnpj':
        return (
          <InputMask
            mask="99.999.999/9999-99"
            type="text"
            className="form-control"
            placeholder="Digite o CNPJ"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <h1 className="mt-3">Lista de Clientes</h1>
      <div className="input-group mb-3">
        <select className="form-control input-busca" value={tipoBusca} onChange={handleTipoBuscaChange}>
          <option value="nome">Buscar por Nome/Razão</option>
          <option value="cpf">Buscar por CPF</option>
          <option value="cnpj">Buscar por CNPJ</option>
        </select>
        {renderInputBusca()}
        <div className="select-busca">
          <button className="btn cor" type="button" onClick={handleSearch}>
          🔍
          </button>
        </div>
      </div>
      <table className="table mt-3 table-striped"> {/* Adicione a classe 'table-striped' */}
        <thead>
          <tr>
            <th scope="col">Nome / Razão Social</th>
            <th scope="col">CPF / CNPJ</th>
            <th scope="col">Telefone</th>
            <th scope="col">Email</th>
            <th scope="col">Endereço</th>
            <th scope="col">Numero</th>
            <th scope="col">Cidade</th>
            <th scope="col">Estado</th>
            <th scope="col">Ações</th> {/* Adicione a coluna para as ações */}
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.cli_id}>
              <td>{cliente.cli_nome || cliente.cli_razao}</td>
              <td>{cliente.cli_cpf || cliente.cli_cnpj}</td>
              <td>{cliente.cli_tel}</td>
              <td>{cliente.cli_email}</td>
              <td>{cliente.cli_end}</td>
              <td>{cliente.cli_num}</td>
              <td>{cliente.cli_cid}</td>
              <td>{cliente.cli_uf}</td>
              <td> {/* Adicione os botões de editar e excluir */}
                <div className="d-flex">
                  <button
                    className="btn btn-success btn-sm mr-1"
                    onClick={() => {
                      // Redirecionar para a página de cadastro com o ID do cliente na URL
                      window.location.href = `/editar/${cliente.cli_id}`;
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(cliente.cli_id,cliente.cli_nome,cliente.cli_razao)}
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

export default TabelaClientes;
