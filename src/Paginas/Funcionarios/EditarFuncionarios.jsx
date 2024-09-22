import React, { useState, useEffect } from 'react';
//import '../Funcionarios/Funcionario.css'; // Verifique o nome do arquivo CSS
import { useParams, useNavigate } from 'react-router-dom';

function EditarFuncionarios() {
  const [nomeValido, setNomeValido] = useState(false);
  const [senhaValida, setSenhaValida] = useState(false);
  const [setorValido, setSetorValido] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Funções de validação
  const validarNome = (nome) => {
    const regex = /^[A-Za-z\s]+$/;
    return nome.length >= 3 && regex.test(nome);
  };

  const validarSenha = (senha) => {
    return senha.length >= 6;
  };

  const validarSetor = (setor) => {
    return ['secretaria', 'administrador', 'financeiro'].includes(setor.toLowerCase());
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
      document.getElementById('setorAviso').textContent = 'Setor deve ser: secretaria, administrador ou financeiro.';
      setSetorValido(false);
    } else {
      document.getElementById('setorAviso').textContent = '';
      setSetorValido(true);
    }
  };

  useEffect(() => {
    const fetchFuncionario = async () => {
      try {
        const response = await fetch(`http://localhost:4001/funcionarios/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Atribuir os valores recuperados aos campos de entrada diretamente
          document.getElementById('nome').value = data[0].fun_nome;
          document.getElementById('senha').value = data[0].fun_senha;
          document.getElementById('setor').value = data[0].fun_setor;
        } else {
          console.error('Erro ao buscar funcionário:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar funcionário:', error.message);
      }
    };

    if (id) {
      fetchFuncionario();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nomeValido, senhaValida, setorValido) {
      const nome = document.getElementById('nome').value;
      const senha = document.getElementById('senha').value;
      const setor = document.getElementById('setor').value;

      const funcionario = {
        fun_nome: nome,
        fun_senha: senha,
        fun_setor: setor,
      };

      try {
        const response = await fetch(`http://localhost:4001/funcionarios/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(funcionario),
        });

        if (response.ok) {
          alert('Funcionário atualizado com sucesso');
          navigate('/buscar/funcionarios');
          setNomeValido(false);
          setSenhaValida(false);
          setSetorValido(false);
        } else {
          const errorData = await response.json();
          alert(`Erro ao atualizar funcionário: ${errorData.message}`);
        }
      } catch (error) {
        alert(`Erro ao atualizar funcionário: ${error.message}`);
      }
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  };

  return (
    <form action="submit" className="container mt-5" onSubmit={handleSubmit}>
      <h1>Editar Funcionário</h1>
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
        <input
          type="text"
          className={`form-control ${setorValido ? 'is-valid' : ''}`}
          id="setor"
          placeholder="Setor"
          onBlur={handleSetorBlur}
        />
        <p id="setorAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-success">Salvar</button>
      </div>
    </form>
  );
}

export default EditarFuncionarios;
