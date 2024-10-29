import React, { useState , useEffect} from 'react';
//import '../Salas/Salas.css';
import { useParams , useNavigate } from 'react-router-dom';

function EditarSalas() {
  const [nomeValido, setNomeValido] = useState(false);
  const [quantidadeValida, setQuantidadeValida] = useState(false);
  const [capacidadeValida, setCapacidadeValida] = useState(false);
  const [observacoesValidas, setObservacoesValidas] = useState(false);
  const [tipoSala, setTipoSala] = useState('COWORKING');
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const validarNome = (nome) => {
    const regex = /^[A-Za-z\s]+$/;
    return nome.length >= 3 && regex.test(nome);
  };

  const validarQuantidade = (quantidade) => {
    const regex = /^([T]|[1-9]\d*)$/;
    return regex.test(quantidade);
  };

  const validarCapacidade = (capacidade) => {
    return capacidade >= 1;
  };

  const validarObservacoes = (observacoes) => {
    return observacoes.length <= 150;
  };

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

  const handleQuantidadeBlur = (event) => {
    const quantidade = event.target.value;
    if (!validarQuantidade(quantidade)) {
      document.getElementById('qtdAviso').textContent = 'Andar deve ser "T" para térreo ou um número positivo.';
      setQuantidadeValida(false);
    } else {
      document.getElementById('qtdAviso').textContent = '';
      setQuantidadeValida(true);
    }
  };

  const handleCapacidadeBlur = (event) => {
    const capacidade = parseInt(event.target.value, 10);
    if (!validarCapacidade(capacidade)) {
      document.getElementById('capacidadeAviso').textContent = 'Capacidade deve ser no mínimo 1.';
      setCapacidadeValida(false);
    } else {
      document.getElementById('capacidadeAviso').textContent = '';
      setCapacidadeValida(true);
    }
  };

  const handleObservacoesBlur = (event) => {
    const observacoes = event.target.value;
    if (!validarObservacoes(observacoes)) {
      document.getElementById('observacoesAviso').textContent = 'Observações podem ter até 150 caracteres.';
      setObservacoesValidas(false);
    } else {
      document.getElementById('observacoesAviso').textContent = '';
      setObservacoesValidas(true);
    }
  };

  useEffect(() => {
    const fetchSala = async () => {
      try {
        const response = await fetch(`${apiUrl}/salas/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Atribuir os valores recuperados aos campos de entrada diretamente
          document.getElementById('tipoSala').value = data[0].sal_tipo;
          document.getElementById('capacidade').value = data[0].sal_cap;
          document.getElementById('nome').value = data[0].sal_nome;
          document.getElementById('observacoes').value = data[0].sal_obs;
          document.getElementById('andar').value = data[0].sal_andar;
        } else {
          console.error('Erro ao buscar sala:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar sala:', error.message);
      }
    };
  
    if (id) {
      fetchSala();
    }
  }, [id]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nomeValido && quantidadeValida && capacidadeValida && observacoesValidas) {
      const nome = document.getElementById('nome').value;
      const quantidade = document.getElementById('andar').value;
      const capacidade = document.getElementById('capacidade').value;
      const observacoes = document.getElementById('observacoes').value;
  
      const sala ={
        sal_nome: nome,
        sal_tipo: tipoSala,
        sal_andar: quantidade,
        sal_cap: capacidade,
        sal_obs: observacoes,
      };
  
      try{
        const response = await fetch(`${apiUrl}/salas/${id}`,{
          method : 'PUT',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sala),
        });
  
        if(response.ok){
          alert('Sala atualizada com sucesso');
          navigate('/buscar/salas')
          setNomeValido(false);
          setCapacidadeValida(false);
          setObservacoesValidas(false);
          setQuantidadeValida(false);
        }else{
          const errorData = await response.json();
          alert(`Erro ao atualizar sala: ${errorData.message}`);
        }
      }catch(error){
        alert(`Erro ao atualizar sala: ${error.message}`);
      }
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  };
  

  return (
    <form action="submit" className="container mt-5" onSubmit={handleSubmit}>
      <h1>Editar Sala</h1>
      <div className="form-group">
        <label htmlFor="tipoSala">Tipo de Sala</label>
        <select
          className="form-control"
          id="tipoSala"
          value={tipoSala}
          onChange={(e) => setTipoSala(e.target.value)}
        >
          <option value="COWORKING">COWORKING</option>
          <option value="SALAS INDIVIDUAIS">SALAS INDIVIDUAIS</option>
          <option value="SALA DE REUNIÃO">SALA DE REUNIÃO</option>
          <option value="SALÃO NOBRE">SALÃO NOBRE</option>
        </select>
      </div>
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
        <label htmlFor="quantidade">Andar</label>
        <input
          type="text"
          className={`form-control ${quantidadeValida ? 'is-valid' : ''}`}
          id="andar"
          placeholder="Andar"
          onBlur={handleQuantidadeBlur}
        />
        <p id="qtdAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <label htmlFor="capacidade">Capacidade</label>
        <input
          type="number"
          className={`form-control ${capacidadeValida ? 'is-valid' : ''}`}
          id="capacidade"
          placeholder="Capacidade"
          onBlur={handleCapacidadeBlur}
        />
        <p id="capacidadeAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <label htmlFor="observacoes">Observações</label>
        <textarea
          className={`form-control ${observacoesValidas ? 'is-valid' : ''}`}
          id="observacoes"
          placeholder="Observações"
          maxLength="150"
          onBlur={handleObservacoesBlur}
          style={{ height: '100px', resize: 'none' }} // Aumentando o tamanho do input
        ></textarea>
        <p id="observacoesAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-success">Salvar</button>
      </div>
    </form>
  );
}

export default EditarSalas;
