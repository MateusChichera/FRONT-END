import React, { useState } from 'react';
//import '../Funcionarios/Funcionario.css'; // Verifique o nome do arquivo CSS

function Funcionarios() {
  const [nomeValido, setNomeValido] = useState(false);
  const [senhaValida, setSenhaValida] = useState(false);
  const [setorValido, setSetorValido] = useState(false);

  // Funções de validação
  const validarNome = (nome) => {
    const regex = /^[A-Za-z\s]+$/;
    return nome.length >= 3 && regex.test(nome);
  };

  const validarSenha = (senha) => {
    return senha.length >= 6;
  };

  const validarSetor = (setor) => {
    return setor !== '';
  };

  // Funções para lidar com a validação onBlur
  const handleNomeBlur = (event) => {
    const nome = event.target.value;
    if (!validarNome(nome)) {
      document.getElementById('nomeAviso').textContent = 'Nome deve ter no mínimo 3 caracteres e não pode conter números.';
      setNomeValido(false);
    } else {
      document.getElementById('nomeAviso').textContent = '';
      setNomeValido(true);
    }
  };

  const handleSenhaBlur = (event) => {
    const senha = event.target.value;
    if (!validarSenha(senha)) {
      document.getElementById('senhaAviso').textContent = 'Senha deve ter no mínimo 6 caracteres.';
      setSenhaValida(false);
    } else {
      document.getElementById('senhaAviso').textContent = '';
      setSenhaValida(true);
    }
  };

  const handleSetorBlur = (event) => {
    const setor = event.target.value;
    if (!validarSetor(setor)) {
      document.getElementById('setorAviso').textContent = 'Por favor, selecione um setor.';
      setSetorValido(false);
    } else {
      document.getElementById('setorAviso').textContent = '';
      setSetorValido(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nomeValido && senhaValida && setorValido) {
      const nome = document.getElementById('nome').value;
      const senha = document.getElementById('senha').value;
      const setor = document.getElementById('setor').value;

      const funcionario = {
        fun_nome: nome,
        fun_senha: senha,
        fun_setor: setor,
      };
      console.log(funcionario);
      try {
        const response = await fetch('http://localhost:4001/funcionarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(funcionario),
        });

        if (response.ok) {
          alert('Funcionário cadastrado com sucesso');
          window.location.reload();
          setNomeValido(false);
          setSenhaValida(false);
          setSetorValido(false);
        } else {
          const errorData = await response.json();
          alert(`Erro ao cadastrar funcionário: ${errorData.message}`);
        }
      } catch (error) {
        alert(`Erro ao cadastrar funcionário: ${error.message}`);
      }
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  };

  return (
    <form action="submit" className="container mt-5" onSubmit={handleSubmit}>
      <h1>Cadastro de Funcionário</h1>
      <div className="form-group">
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          className={`form-control ${nomeValido ? 'is-valid' : ''}`}
          id="nome"
          placeholder="Nome"
          onBlur={handleNomeBlur}
        />
        <p id="nomeAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          className={`form-control ${senhaValida ? 'is-valid' : ''}`}
          id="senha"
          placeholder="Senha"
          onBlur={handleSenhaBlur}
        />
        <p id="senhaAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <label htmlFor="setor">Setor</label>
        <select
          className={`form-control ${setorValido ? 'is-valid' : ''}`}
          id="setor"
          onBlur={handleSetorBlur}
        >
          <option value="">Selecione o Setor</option>
          <option value="secretaria">Secretaria</option>
          <option value="administrador">Administrador</option>
          <option value="financeiro">Financeiro</option>
        </select>
        <p id="setorAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-success">Salvar</button>
      </div>
    </form>
  );
}

export default Funcionarios;
