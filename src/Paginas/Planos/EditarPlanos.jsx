import React, { useState , useEffect } from 'react';
import InputMask from 'react-input-mask';
//import '../Planos/Planos.css'; // Verifique o nome do arquivo CSS
import { useParams , useNavigate } from 'react-router-dom';

function EditarPlanos() {
  const [planoValido, setPlanoValido] = useState(false);
  const [valorValido, setValorValido] = useState(false);
  const [vigenciaValida, setVigenciaValida] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const {id} = useParams();
  const navigate = useNavigate();

  // Funções de validação
  const validarPlano = (nome) => {
    const regex = /^[A-Za-z\s]+$/;
    return nome.length >= 3 && regex.test(nome);
  };

  const validarValor = (quantidade) => {
    return quantidade >= 0;
  };

  const validarVigencia = (dias) => {
    return dias > 0;
  };

  // Funções para lidar com a validação onBlur
  const handleNomeBlur = (event) => {
    const nome = event.target.value;
    if (!validarPlano(nome)) {
      document.getElementById('nomeAviso').textContent = 'Nome do plano deve ter no mínimo 3 caracteres e não pode conter números.';
      setPlanoValido(false);
    } else {
      document.getElementById('nomeAviso').textContent = '';
      setPlanoValido(true);
    }
  };

  const handleQuantidadeBlur = (event) => {
    const quantidade = parseFloat(event.target.value.replace(/[^0-9.-]+/g, ""));
    if (!validarValor(quantidade)) {
      document.getElementById('qtdAviso').textContent = 'Valor deve ser no mínimo R$ 0,00.';
      setValorValido(false);
    } else {
      document.getElementById('qtdAviso').textContent = '';
      setValorValido(true);
    }
  };

  const handleVigenciaBlur = (event) => {
    const vigencia = parseInt(event.target.value, 10);
    if (!validarVigencia(vigencia)) {
      document.getElementById('vigenciaAviso').textContent = 'Vigência deve ser no mínimo 1 dia.';
      setVigenciaValida(false);
    } else {
      document.getElementById('vigenciaAviso').textContent = '';
      setVigenciaValida(true);
    }
  };

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const response = await fetch(`${apiUrl}/planos/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Atribuir os valores recuperados aos campos de entrada diretamente
          document.getElementById('nome').value = data[0].pla_nome;
          document.getElementById('quantidade').value = data[0].pla_valor;
          document.getElementById('vigencia').value = data[0].pla_dias;
        } else {
          console.error('Erro ao buscar plano:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar plano:', error.message);
      }
    };
  
    if (id) {
      fetchPlanos();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (planoValido && valorValido && vigenciaValida) {
      const nome = document.getElementById('nome').value;
      const valor = document.getElementById('quantidade').value;
      const dias = document.getElementById('vigencia').value;

      const plano ={
        pla_nome: nome,
        pla_valor: valor,
        pla_dias: dias,
      };
      console.log(plano);
      try{
        const response = await fetch(`${apiUrl}/planos/${id}`,{
          method : 'PUT',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(plano),
        });
  
        if(response.ok){
          alert('Plano Atualizado com sucesso');
          navigate('/buscar/planos')
          setPlanoValido(false);
          setValorValido(false);
          setVigenciaValida(false);
        }else{
          const errorData = await response.json();
          alert(`Erro ao atualizar plano: ${errorData.message}`);
        }
      }catch(error){
        alert(`Erro ao atualizar plano: ${error.message}`);
      }
    }else{
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  return (
    <form action="submit" className="container mt-5" onSubmit={handleSubmit}>
      <h1>Editar Plano</h1>
      <div className="form-group">
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          className={`form-control ${planoValido ? 'is-valid' : ''}`}
          id="nome"
          placeholder="Nome"
          onBlur={handleNomeBlur}
        />
        <p id="nomeAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <label htmlFor="quantidade">Valor</label>
        <InputMask
          mask="R$ 9999.99"
          maskChar=""
          className={`form-control ${valorValido ? 'is-valid' : ''}`}
          id="quantidade"
          placeholder="Valor"
          onBlur={handleQuantidadeBlur}
        />
        <p id="qtdAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <label htmlFor="vigencia">Vigência (Dias)</label>
        <input
          type="number"
          className={`form-control ${vigenciaValida ? 'is-valid' : ''}`}
          id="vigencia"
          placeholder="Vigência"
          onBlur={handleVigenciaBlur}
        />
        <p id="vigenciaAviso" className="text-danger"></p>
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-success">Salvar</button>
      </div>
    </form>
  );
}

export default EditarPlanos;
