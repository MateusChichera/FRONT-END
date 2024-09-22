// src/Paginas/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [id, setId] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [funcionarios, setFuncionarios] = useState([]);
    const [selectedFuncionario, setSelectedFuncionario] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const response = await axios.get('http://localhost:4001/funcionarios');
                setFuncionarios(response.data);
            } catch (err) {
                setError('Erro ao carregar dados dos funcionários.');
            }
        };

        fetchFuncionarios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        if (!selectedFuncionario) {
            setError('Por favor, selecione um funcionário.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:4001/funcionarios/autenticar', { id: selectedFuncionario, senha });
            setSuccess('Login bem-sucedido!');
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('nome', response.data.nome); // Armazena o nome do funcionário
            navigate('/home'); // Redireciona para a página inicial após o login
        } catch (err) {
            setError('Credenciais inválidas. Tente novamente.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="funcionario">Funcionário:</label>
                    <select
                        id="funcionario"
                        value={selectedFuncionario}
                        onChange={(e) => setSelectedFuncionario(e.target.value)}
                        required
                    >
                        <option value="">Selecione um funcionário</option>
                        {funcionarios.map(func => (
                            <option key={func.fun_id} value={func.fun_id}>
                                {func.fun_nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="senha">Senha:</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default Login;
