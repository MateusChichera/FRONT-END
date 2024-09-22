import React, { useState , useEffect } from 'react';
import InputMask from 'react-input-mask';
//import './Clientes.css';
import { validarCPF, validarCNPJ, buscarEnderecoPorCEP, buscarCnpj } from './Clientes.js';
import TabelaClientes from './TabelaClientes';
import { useParams , useNavigate } from 'react-router-dom';

function Editar() {
  const [cli_tipo, setCli_tipo] = useState('CPF');
  const [cli_nome, setCli_nome] = useState('');
  const [cli_razao, setCli_razao] = useState('');
  const [cli_fantasia, setCli_fantasia] = useState('');
  const [cli_tel, setCli_tel] = useState('');
  const [nomeError, setNomeError] = useState('');
  const [cli_cpf, setCli_cpf] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [cli_cnpj, setCli_cnpj] = useState('');
  const [cnpjError, setCnpjError] = useState('');
  const [cli_data_nascimento, setCli_data_nascimento] = useState('');
  const [dataNascimentoError, setDataNascimentoError] = useState('');
  const [cli_cep, setCli_cep] = useState('');
  const [cepError, setCepError] = useState('');
  const [cli_end, setCli_end] = useState('');
  const [cli_bairro, setCli_bairro] = useState('');
  const [cli_num, setCli_num] = useState('');
  const [cli_uf, setCli_uf] = useState('');
  const [cli_cid, setCli_cid] = useState('');
  const [cli_email, setCli_email] = useState('');
  const [mostrarTabela, setMostrarTabela] = useState(false);

  const navigate = useNavigate();

  const formatarData = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const { id } = useParams();
  console.log("id encontrado",id);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(`http://localhost:4001/clientes/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Atualizar o estado local com os dados do cliente
          console.log(data);
          setCli_nome(data[0].cli_nome);
          setCli_razao(data[0].cli_razao);
          setCli_fantasia(data[0].cli_fantasia);
          setCli_tel(data[0].cli_tel);
          setCli_cpf(data[0].cli_cpf);
          setCli_cnpj(data[0].cli_cnpj);
          const dataformatada = formatarData(data[0].cli_data_nascimento);
          setCli_data_nascimento(dataformatada);
          setCli_cep(data[0].cli_cep);
          setCli_end(data[0].cli_end);
          setCli_bairro(data[0].cli_bairro);
          setCli_num(data[0].cli_num);
          setCli_uf(data[0].cli_uf);
          setCli_cid(data[0].cli_cid);
          setCli_email(data[0].cli_email);
          setCli_tipo(data[0].cli_tipo);
          
        } else {
          console.error('Erro ao buscar cliente:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error.message);
      }
    };

    if (id) {
      fetchCliente();
    }
  }, [id]);


  const handleBlurNome = () => {
    if (cli_nome.length < 2) {
      setNomeError('O nome deve ter pelo menos 2 caracteres.');
    } else {
      setNomeError('');
    }
  };

  const handleBlurCPF = () => {
    if (!validarCPF(cli_cpf)) {
      setCpfError('CPF inválido');
    } else {
      setCpfError('');
    }
  };

  const handleBlurCNPJ = async () => {
    if (validarCNPJ(cli_cnpj)) {
      try {
        const data = await buscarCnpj(cli_cnpj);
        if (data.numero) { // Verifica se a resposta contém o campo "numero"
          setCli_fantasia(data.fantasia);
          setCli_razao(data.nome);
          setCli_tel(data.telefone);
          setCli_end(data.logradouro);
          setCli_num(data.numero)
          setCli_cid(data.municipio);
          setCli_bairro(data.bairro);
          setCli_uf(data.uf);
          setCli_cep(data.cep);
          setCli_email(data.email);
          setCli_data_nascimento(null);
          setCnpjError('');
        } else {
          setCnpjError('CNPJ inválido');
        }
      } catch (error) {
        setCnpjError('Erro ao buscar CNPJ');
      }
    } else {
      setCnpjError('CNPJ inválido');
    }
  };

  const handleBlurDataNascimento = () => {
    const hoje = new Date();
    const nascimento = new Date(cli_data_nascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    if (idade < 10) {
      setDataNascimentoError('A idade deve ser maior que 10 anos.');
    } else {
      setDataNascimentoError('');
    }
  };

  const handleBlurCEP = async () => {
    const cepLimpo = cli_cep.replace(/[^\d]/g, '');
    if (cepLimpo.length === 8) {
      try {
        const data = await buscarEnderecoPorCEP(cepLimpo);
        if (data.erro) {
          setCepError('CEP não encontrado');
          setCli_end('');
          setCli_cid('');
          setCli_bairro('');
          setCli_uf('');
        } else {
          setCepError('');
          setCli_end(data.logradouro);
          setCli_cid(data.localidade);
          setCli_bairro(data.bairro);
          setCli_uf(data.uf);
        }
      } catch {
        setCepError('Erro ao buscar CEP');
      }
    } else {
      setCepError('CEP inválido');
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    // Executar todas as validações antes de enviar o formulário
    handleBlurNome();
    handleBlurCPF();
    handleBlurCNPJ();
    handleBlurDataNascimento();
    handleBlurCEP();

    // Se houver algum erro, não enviar o formulário
    if (nomeError || cpfError || cnpjError || dataNascimentoError || cepError) {
      return;
    }

    const cliente = {
      cli_id:id,
      cli_tipo,
      cli_nome,
      cli_razao,
      cli_fantasia,
      cli_tel,
      cli_cpf,
      cli_cnpj,
      cli_data_nascimento,
      cli_cep,
      cli_end,
      cli_num,
      cli_bairro,
      cli_cid,
      cli_uf,
      cli_email,
    };

    try {
        const response = await fetch(`http://localhost:4001/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });

      if (response.ok) {
        alert('Cliente atualizado com sucesso!');
        navigate('/buscar')
        // Limpar todos os campos após o envio
        setCli_nome('');
        setCli_razao('');
        setCli_fantasia('');
        setCli_tel('');
        setCli_cpf('');
        setCli_cnpj('');
        setCli_data_nascimento('');
        setCli_cep('');
        setCli_end('');
        setCli_bairro('');
        setCli_num('');
        setCli_uf('');
        setCli_cid('');
        setCli_email('');
        setCli_tipo('CPF');
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar cliente: ${errorData.message}`);
      }
    } catch (error) {
      alert(`Erro ao atualizar cliente: ${error.message}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };
  return (
    <>
      {mostrarTabela ? (
        <TabelaClientes setMostrarTabela={setMostrarTabela}/>
      ) : (
        <form className="container mt-5" onSubmit={handleSubmit}>
          <h1>Editar Cliente</h1>
          <div className="form-group">
            <label htmlFor="cli_tipo">Tipo de Cliente</label>
            <select
              className="form-control"
              id="cli_tipo"
              value={cli_tipo}
              onChange={(e) => setCli_tipo(e.target.value)}
            >
              <option value="CPF">Pessoa Física</option>
              <option value="CNPJ">Pessoa Jurídica</option>
            </select>
          </div>

          {cli_tipo === 'CPF' && (
            <>
              <div className="form-group">
                <label htmlFor="cli_nome">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="cli_nome"
                  value={cli_nome}
                  onChange={(e) => setCli_nome(e.target.value)}
                  onBlur={handleBlurNome}
                  placeholder="Nome"
                />
                {nomeError && <p className="text-danger">{nomeError}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="cli_cpf">CPF</label>
                <InputMask
                  mask="999.999.999-99"
                  className="form-control"
                  id="cli_cpf"
                  value={cli_cpf}
                  onChange={(e) => setCli_cpf(e.target.value)}
                  onBlur={handleBlurCPF}
                  placeholder="CPF"
                />
                {cpfError && <p className="text-danger">{cpfError}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="cli_data_nascimento">Data de Nascimento</label>
                <input
                  type="date"
                  className="form-control"
                  id="cli_data_nascimento"
                  value={cli_data_nascimento}
                  onChange={(e) => setCli_data_nascimento(e.target.value)}
                  onBlur={handleBlurDataNascimento}
                  placeholder="Data de Nascimento"
                />
                {dataNascimentoError && <p className="text-danger">{dataNascimentoError}</p>}
              </div>
            </>
          )}

          {cli_tipo === 'CNPJ' && (
            <>
              <div className="form-group">
                <label htmlFor="cli_cnpj">CNPJ</label>
                <InputMask
                  mask="99.999.999/9999-99"
                  className="form-control"
                  id="cli_cnpj"
                  value={cli_cnpj}
                  onChange={(e) => setCli_cnpj(e.target.value)}
                  onBlur={handleBlurCNPJ}
                  placeholder="CNPJ"
                />
                {cnpjError && <p className="text-danger">{cnpjError}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="cli_fantasia">Nome Fantasia</label>
                <input
                  type="text"
                  className="form-control"
                  id="cli_fantasia"
                  value={cli_fantasia}
                  onChange={(e) => setCli_fantasia(e.target.value)}
                  placeholder="Nome Fantasia"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cli_razao">Razão Social</label>
                <input
                  type="text"
                  className="form-control"
                  id="cli_razao"
                  value={cli_razao}
                  onChange={(e) => setCli_razao(e.target.value)}
                  placeholder="Razão Social"
                />
              </div>
              
              
             
            </>
          )}

          <div className="form-group">
            <label htmlFor="cli_tel">Telefone</label>
            <InputMask
              mask="(99) 99999-9999"
              className="form-control"
              id="cli_tel"
              value={cli_tel}
              onChange={(e) => setCli_tel(e.target.value)}
              placeholder="Telefone"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cli_cep">CEP</label>
            <InputMask
              mask="99999-999"
              className="form-control"
              id="cli_cep"
              value={cli_cep}
              onChange={(e) => setCli_cep(e.target.value)}
              onBlur={handleBlurCEP}
              placeholder="CEP"
            />
            {cepError && <p className="text-danger">{cepError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="cli_end">Endereço</label>
            <input
              type="text"
              className="form-control"
              id="cli_end"
              value={cli_end}
              onChange={(e) => setCli_end(e.target.value)}
              placeholder="Endereço"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cli_num">Número</label>
            <input
              type="text"
              className="form-control"
              id="cli_num"
              value={cli_num}
              onChange={(e) => setCli_num(e.target.value)}
              placeholder="Número"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cli_bairro">Bairro</label>
            <input
              type="text"
              className="form-control"
              id="cli_bairro"
              value={cli_bairro}
              onChange={(e) => setCli_bairro(e.target.value)}
              placeholder="Bairro"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cli_cid">Cidade</label>
            <input
              type="text"
              className="form-control"
              id="cli_cid"
              value={cli_cid}
              onChange={(e) => setCli_cid(e.target.value)}
              placeholder="Cidade"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cli_uf">Estado</label>
            <input
              type="text"
              className="form-control"
              id="cli_uf"
              value={cli_uf}
              onChange={(e) => setCli_uf(e.target.value)}
              placeholder="Estado"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cli_email">Email</label>
            <input
              type="email"
              className="form-control"
              id="cli_email"
              value={cli_email}
              onChange={(e) => setCli_email(e.target.value)}
              placeholder="Email"
            />
          </div>
          <button type="submit" className="btn btn-success" onKeyDown={handleKeyDown}>
            Salvar
          </button>
        </form>
      )}
    </>
  );
}



export default Editar;
