import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importando useNavigate para redirecionamento
import './Redefinirsenha.css';

const RedefinirSenha = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();  // Instanciando o hook para redirecionamento

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        try {
            await axios.post(`${apiUrl}/funcionarios/redefinir`, { email });
            setSuccess('Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.');

            // Redireciona para a tela de login após 3 segundos
            setTimeout(() => {
                navigate('/login');  // Altere '/login' para a rota correta do seu sistema
            }, 3000);
        } catch (err) {
            setError('Erro ao solicitar redefinição de senha. Tente novamente.');
        }
    };

    return (
        <div className="redefinir-container">
            <h2>Redefinir Senha</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Enviar</button>
            </form>
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
            
            {/* Botão para voltar à tela de login */}
            <button onClick={() => navigate('/login')} className="back-button">Voltar para Login</button>
        </div>
    );
};

export default RedefinirSenha;
