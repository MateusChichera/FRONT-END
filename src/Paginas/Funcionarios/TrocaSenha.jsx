import React, { useState } from 'react';

function TrocaSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaValida, setSenhaValida] = useState(false);
  const [senhasIguais, setSenhasIguais] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Valida se a nova senha atende aos critérios
  const validarSenha = (senha) => senha.length >= 6;

  // Lidar com validação onBlur para a nova senha
  const handleNovaSenhaBlur = (event) => {
    const senha = event.target.value;
    if (!validarSenha(senha)) {
      document.getElementById('novaSenhaAviso').textContent = 'Senha deve ter no mínimo 6 caracteres.';
      setSenhaValida(false);
    } else {
      document.getElementById('novaSenhaAviso').textContent = '';
      setSenhaValida(true);
    }
    setNovaSenha(senha);
  };

  // Lidar com validação onBlur para confirmar senha
  const handleConfirmarSenhaBlur = (event) => {
    const senhaConfirmada = event.target.value;
    if (senhaConfirmada !== novaSenha) {
      document.getElementById('confirmarSenhaAviso').textContent = 'As senhas não correspondem.';
      setSenhasIguais(false);
    } else {
      document.getElementById('confirmarSenhaAviso').textContent = '';
      setSenhasIguais(true);
    }
    setConfirmarSenha(senhaConfirmada);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Recupera o ID do usuário do sessionStorage
    const usuarioId = localStorage.getItem('usu_id');
    if (!usuarioId) {
      alert('Usuário não autenticado.');
      return;
    }

    if (senhaValida && senhasIguais) {
      try {
        const response = await fetch(`${apiUrl}/funcionarios/trocar-senha`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: usuarioId, novaSenha }),
        });

        if (response.ok) {
          alert('Senha alterada com sucesso.');
          setNovaSenha('');
          setConfirmarSenha('');
        } else {
          const errorData = await response.json();
          alert(`Erro ao trocar senha: ${errorData.message}`);
        }
      } catch (error) {
        alert(`Erro ao trocar senha: ${error.message}`);
      }
    } else {
      alert('Por favor, preencha os campos corretamente.');
    }
  };

  return (
    <form className="container mt-5" onSubmit={handleSubmit}>
      <h1>Troca de Senha</h1>
      <div className="form-group">
        <label htmlFor="novaSenha">Nova Senha</label>
        <input
          type="password"
          className={`form-control ${senhaValida ? 'is-valid' : ''}`}
          id="novaSenha"
          placeholder="Digite a nova senha"
          onBlur={handleNovaSenhaBlur}
        />
        <p id="novaSenhaAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <label htmlFor="confirmarSenha">Confirme a Nova Senha</label>
        <input
          type="password"
          className={`form-control ${senhasIguais ? 'is-valid' : ''}`}
          id="confirmarSenha"
          placeholder="Confirme a nova senha"
          onBlur={handleConfirmarSenhaBlur}
        />
        <p id="confirmarSenhaAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-success">Confirmar</button>
      </div>
    </form>
  );
}

export default TrocaSenha;
