import './NavBar.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaBars, FaCogs, FaHome, FaChevronDown, FaChevronUp, FaChevronLeft } from 'react-icons/fa';
import { useState, useEffect } from 'react';

function NavBar() {
    const [show, setShow] = useState(true);
    const [showSubmenu, setShowSubmenu] = useState(false);
    const [showBuscarSubmenu, setShowBuscarSubmenu] = useState(false);
    const [showAgendamentoSubmenu, setShowAgendamentoSubmenu] = useState(false); // Novo estado para o submenu de agendamentos
    const [userName, setUserName] = useState('');
    const [userSetor, setUserSetor] = useState(''); // Adiciona estado para o setor do usuário
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserName = localStorage.getItem('nome');
        const storedUserSetor = localStorage.getItem('setor'); // Recupera o setor do localStorage
        if (storedUserName) {
            setUserName(storedUserName);
        }
        if (storedUserSetor) {
            setUserSetor(storedUserSetor); // Define o setor no estado
        }
    }, []);

    const handleShow = () => {
        setShow(!show);
    };

    const handleSubmenu = () => {
        setShowSubmenu(!showSubmenu);
        setShowBuscarSubmenu(false); // Fecha o submenu de buscar ao abrir o submenu de cadastrar
        setShowAgendamentoSubmenu(false); // Fecha o submenu de agendamentos
    };

    const handleBuscarSubmenu = () => {
        setShowBuscarSubmenu(!showBuscarSubmenu);
        setShowSubmenu(false); // Fecha o submenu de cadastrar ao abrir o submenu de buscar
        setShowAgendamentoSubmenu(false); // Fecha o submenu de agendamentos
    };

    const handleAgendamentoSubmenu = () => {
        setShowAgendamentoSubmenu(!showAgendamentoSubmenu); // Alterna o submenu de agendamentos
        setShowBuscarSubmenu(false); // Fecha o submenu de buscar
        setShowSubmenu(false); // Fecha o submenu de cadastrar
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nome');
        localStorage.removeItem('setor');
        navigate('/login');
    };

    // Funções para checar permissões
    const isAdministrador = userSetor === 'administrador';
    const isFinanceiro = userSetor === 'financeiro';
    const isSecretaria = userSetor === 'secretaria';

    return (
        <>
            <div className={`side-bar ${show ? 'active-nav' : ''}`} id="sidebar">
                <button className="menu-toggle" onClick={handleShow}>
                    <FaChevronLeft />
                </button>
                <ul className="nav flex-column text-white w-100">
                    <li className="nav-link">
                        <span className="h3 text-white my-2">Olá, {userName}</span>
                    </li>
                    <li className="nav-link">
                        <Link to='/home'>
                            <FaHome />
                            <span className="mx-2" style={{ color: 'white' }}>Home</span>
                        </Link>
                    </li>

                    {/* Menu Cadastrar - Verificar permissões */}
                    <li className="nav-link">
                        <div onClick={handleSubmenu} style={{ cursor: 'pointer' }}>
                            <FaCogs />
                            <span className="mx-2" style={{ color: 'white' }}>Cadastrar</span>
                            {showSubmenu ? <FaChevronUp className="mx-2" /> : <FaChevronDown className="mx-2" />}
                        </div>
                        {showSubmenu && (
                            <ul className="nav flex-column text-white w-100 submenu">
                                {!isSecretaria && (
                                    <li className="nav-link">
                                        <Link to='/salas'>
                                            <FaCogs />
                                            <span className="mx-2" style={{ color: 'white' }}>Sala</span>
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-link">
                                    <Link to='/clientes'>
                                        <FaCogs />
                                        <span className="mx-2" style={{ color: 'white' }}>Cliente</span>
                                    </Link>
                                </li>
                                {!isSecretaria && (
                                    <li className="nav-link">
                                        <Link to='/planos'>
                                            <FaCogs />
                                            <span className="mx-2" style={{ color: 'white' }}>Plano</span>
                                        </Link>
                                    </li>
                                )}
                                {!isSecretaria && !isFinanceiro && (
                                    <li className="nav-link">
                                        <Link to='/funcionario'>
                                            <FaCogs />
                                            <span className="mx-2" style={{ color: 'white' }}>Funcionario</span>
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-link">
                                    <Link to='/associar'>
                                        <FaCogs />
                                        <span className="mx-2" style={{ color: 'white' }}>Associar Planos</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Menu Buscar - Verificar permissões */}
                    <li className="nav-link">
                        <div onClick={handleBuscarSubmenu} style={{ cursor: 'pointer' }}>
                            <FaCogs />
                            <span className="mx-2" style={{ color: 'white' }}>Buscar</span>
                            {showBuscarSubmenu ? <FaChevronUp className="mx-2" /> : <FaChevronDown className="mx-2" />}
                        </div>
                        {showBuscarSubmenu && (
                            <ul className="nav flex-column text-white w-100 submenu">
                                {!isSecretaria && (
                                    <li className="nav-link">
                                        <Link to='/buscar/salas'>
                                            <FaCogs />
                                            <span className="mx-2" style={{ color: 'white' }}>Salas</span>
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-link">
                                    <Link to='/buscar'>
                                        <FaCogs />
                                        <span className="mx-2" style={{ color: 'white' }}>Clientes</span>
                                    </Link>
                                </li>
                                {!isSecretaria && (
                                    <li className="nav-link">
                                        <Link to='/buscar/planos'>
                                            <FaCogs />
                                            <span className="mx-2" style={{ color: 'white' }}>Planos</span>
                                        </Link>
                                    </li>
                                )}
                                {!isSecretaria && !isFinanceiro && (
                                    <li className="nav-link">
                                        <Link to='/buscar/funcionarios'>
                                            <FaCogs />
                                            <span className="mx-2" style={{ color: 'white' }}>Funcionarios</span>
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-link">
                                    <Link to='/buscar/agendamentos'>
                                        <FaCogs />
                                        <span className="mx-2" style={{ color: 'white' }}>Agendamentos</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Menu Agendamentos */}
                    <li className="nav-link">
                        <div onClick={handleAgendamentoSubmenu} style={{ cursor: 'pointer' }}>
                            <FaCogs />
                            <span className="mx-2" style={{ color: 'white' }}>Agendamentos</span>
                            {showAgendamentoSubmenu ? <FaChevronUp className="mx-2" /> : <FaChevronDown className="mx-2" />}
                        </div>
                        {showAgendamentoSubmenu && (
                            <ul className="nav flex-column text-white w-100 submenu">
                                <li className="nav-link">
                                    <Link to='/agendar'>
                                        <FaCogs />
                                        <span className="mx-2" style={{ color: 'white' }}>Agendar</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="nav-link">
                        <button className="btn btn-danger w-100" onClick={handleLogout}>
                            Sair
                        </button>
                    </li>
                </ul>
            </div>
            <div className="p-1 my-container"></div>
            <div style={{ paddingLeft: show ? '250px' : '0' }}>
                <Container>
                    <Outlet />
                </Container>
            </div>
        </>
    );
}

export default NavBar;
