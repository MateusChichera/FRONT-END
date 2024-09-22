function validarNome(nome) {
    const regex = /^[A-Za-z\s]+$/;
    return nome.length >= 3 && regex.test(nome);
  }
  
  function validarQuantidade(quantidade) {
    return quantidade >= 0;
  }
  
  function validarCapacidade(capacidade) {
    return capacidade >= 0;
  }
  
  function validarObservacoes(observacoes) {
    return observacoes.length <= 300;
  }

  function handleSubmit(event) {
    event.preventDefault();
  
    const nome = document.getElementById('nome').value;
    const quantidade = parseInt(document.getElementById('quantidade').value, 10);
    const capacidade = parseInt(document.getElementById('capacidade').value, 10);
    const observacoes = document.getElementById('observacoes').value;
  
    let valid = true;
  
    if (!validarNome(nome)) {
      document.getElementById('nomeAviso').textContent = 'Nome deve ter no mínimo 3 caracteres e não pode conter números.';
      valid = false;
    } else {
      document.getElementById('nomeAviso').textContent = '';
    }
  
    if (!validarQuantidade(quantidade)) {
      document.getElementById('qtdAviso').textContent = 'Quantidade deve ser um número não negativo.';
      valid = false;
    } else {
      document.getElementById('qtdAviso').textContent = '';
    }
  
    if (!validarCapacidade(capacidade)) {
      document.getElementById('capacidadeAviso').textContent = 'Capacidade deve ser um número não negativo.';
      valid = false;
    } else {
      document.getElementById('capacidadeAviso').textContent = '';
    }
  
    if (!validarObservacoes(observacoes)) {
      document.getElementById('observacoesAviso').textContent = 'Observações podem ter até 300 caracteres.';
      valid = false;
    } else {
      document.getElementById('observacoesAviso').textContent = '';
    }
  
    if (valid) {
      // Enviar o formulário se todas as validações passarem
      alert('Sala cadastrada com sucesso!');
    }
  }
  