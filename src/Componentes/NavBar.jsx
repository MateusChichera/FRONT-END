import './NavBar.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { 
    FaBars, 
    FaCogs, 
    FaHome, 
    FaChevronDown, 
    FaChevronUp, 
    FaChevronLeft, 
    FaUser, 
    FaClipboard, 
    FaCalendarAlt, 
    FaSearch, 
    FaPlusCircle, 
    FaFileAlt, // Ícone para Relatórios
    FaSignInAlt, // Ícone para Check-in/Check-out
    FaChartLine // Ícone para Vendas
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

function NavBar() {
    const [show, setShow] = useState(true);
    const [showSubmenu, setShowSubmenu] = useState(false);
    const [showBuscarSubmenu, setShowBuscarSubmenu] = useState(false);
    const [showAgendamentoSubmenu, setShowAgendamentoSubmenu] = useState(false);
    const [showRelatorioSubmenu, setShowRelatorioSubmenu] = useState(false); // Estado para o submenu de Relatórios
    const [userName, setUserName] = useState('');
    const [userSetor, setUserSetor] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserName = localStorage.getItem('nome');
        const storedUserSetor = localStorage.getItem('setor');
        if (storedUserName) setUserName(storedUserName);
        if (storedUserSetor) setUserSetor(storedUserSetor);
    }, []);

    const handleShow = () => setShow(!show);
    const handleTrocaSenha = () => navigate('/trocarsenha');
    const handleSubmenu = () => {
        setShowSubmenu(!showSubmenu);
        setShowBuscarSubmenu(false);
        setShowAgendamentoSubmenu(false);
        setShowRelatorioSubmenu(false); // Fechar o submenu de Relatórios ao abrir outro submenu
    };
    const handleBuscarSubmenu = () => {
        setShowBuscarSubmenu(!showBuscarSubmenu);
        setShowSubmenu(false);
        setShowAgendamentoSubmenu(false);
        setShowRelatorioSubmenu(false); // Fechar o submenu de Relatórios ao abrir outro submenu
    };
    const handleAgendamentoSubmenu = () => {
        setShowAgendamentoSubmenu(!showAgendamentoSubmenu);
        setShowBuscarSubmenu(false);
        setShowSubmenu(false);
        setShowRelatorioSubmenu(false); // Fechar o submenu de Relatórios ao abrir outro submenu
    };
    const handleRelatorioSubmenu = () => {
        setShowRelatorioSubmenu(!showRelatorioSubmenu); // Alterna o submenu de Relatórios
        setShowBuscarSubmenu(false);
        setShowSubmenu(false);
        setShowAgendamentoSubmenu(false);
    };
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

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
                        <span className="h3 text-white my-2">Olá, {userName} ({userSetor})</span>
                    </li>
                    <li className="nav-link">
                        <Link to='/home'>
                            <FaHome />
                            <span className="mx-2" style={{ color: 'white' }}>Home</span>
                        </Link>
                    </li>

                    {/* Menu Cadastrar */}
                    <li className="nav-link">
                        <div onClick={handleSubmenu} style={{ cursor: 'pointer' }}>
                            <FaPlusCircle />
                            <span className="mx-2" style={{ color: 'white' }}>Cadastrar</span>
                            {showSubmenu ? <FaChevronUp className="mx-2" /> : <FaChevronDown className="mx-2" />}
                        </div>
                        {showSubmenu && (
                            <ul className="nav flex-column text-white w-100 submenu">
                                {!isSecretaria && (
                                    <li className="nav-link">
                                        <Link to='/salas'>
                                            <FaClipboard />
                                            <span className="mx-2" style={{ color: 'white' }}>Sala</span>
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-link">
                                    <Link to='/clientes'>
                                        <FaUser />
                                        <span className="mx-2" style={{ color: 'white' }}>Cliente</span>
                                    </Link>
                                </li>
                                {!isSecretaria && (
                                    <li className="nav-link">
                                        <Link to='/planos'>
                                            <FaClipboard />
                                            <span className="mx-2" style={{ color: 'white' }}>Plano</span>
                                        </Link>
                                    </li>
                                )}
                                {!isSecretaria && !isFinanceiro && (
                                    <li className="nav-link">
                                        <Link to='/funcionario'>
                                            <FaUser />
                                            <span className="mx-2" style={{ color: 'white' }}>Funcionario</span>
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-link">
                                    <Link to='/associar'>
                                        <FaClipboard />
                                        <span className="mx-2" style={{ color: 'white' }}>Associar Planos</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Menu Buscar */}
                    <li className="nav-link">
                        <div onClick={handleBuscarSubmenu} style={{ cursor: 'pointer' }}>
                            <FaSearch />
                            <span className="mx-2" style={{ color: 'white' }}>Buscar</span>
                            {showBuscarSubmenu ? <FaChevronUp className="mx-2" /> : <FaChevronDown className="mx-2" />}
                        </div>
                        {showBuscarSubmenu && (
                            <ul className="nav flex-column text-white w-100 submenu">
                                {!isSecretaria && (
                                    <li className="nav-link">
                                        <Link to='/buscar/salas'>
                                            <FaClipboard />
                                            <span className="mx-2" style={{ color: 'white' }}>Salas</span>
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-link">
                                    <Link to='/buscar'>
                                        <FaSearch />
                                        <span className="mx-2" style={{ color: 'white' }}>Clientes</span>
                                    </Link>
                                </li>
                                {!isSecretaria && (
                                    <li className="nav-link">
                                        <Link to='/buscar/planos'>
                                            <FaClipboard />
                                            <span className="mx-2" style={{ color: 'white' }}>Planos</span>
                                        </Link>
                                    </li>
                                )}
                                {!isSecretaria && !isFinanceiro && (
                                    <li className="nav-link">
                                        <Link to='/buscar/funcionarios'>
                                            <FaUser />
                                            <span className="mx-2" style={{ color: 'white' }}>Funcionarios</span>
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-link">
                                    <Link to='/buscar/agendamentos'>
                                        <FaCalendarAlt />
                                        <span className="mx-2" style={{ color: 'white' }}>Agendamentos</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    {/* Menu Agendamentos */}
                    <li className="nav-link">
                        <div onClick={handleAgendamentoSubmenu} style={{ cursor: 'pointer' }}>
                            <FaCalendarAlt />
                            <span className="mx-2" style={{ color: 'white' }}>Agendamentos</span>
                            {showAgendamentoSubmenu ? <FaChevronUp className="mx-2" /> : <FaChevronDown className="mx-2" />}
                        </div>
                        {showAgendamentoSubmenu && (
                            <ul className="nav flex-column text-white w-100 submenu">
                                <li className="nav-link">
                                    <Link to='/agendar'>
                                        <FaCalendarAlt />
                                        <span className="mx-2" style={{ color: 'white' }}>Agendar</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>


                    {/* Menu Relatórios */}
                    <li className="nav-link">
                        <div onClick={handleRelatorioSubmenu} style={{ cursor: 'pointer' }}>
                            <FaFileAlt />
                            <span className="mx-2" style={{ color: 'white' }}>Relatórios</span>
                            {showRelatorioSubmenu ? <FaChevronUp className="mx-2" /> : <FaChevronDown className="mx-2" />}
                        </div>
                        {showRelatorioSubmenu && (
                            <ul className="nav flex-column text-white w-100 submenu">
                                <li className="nav-link">
                                    <Link to='/relatorio/utilizacao'>
                                        <FaClipboard />
                                        <span className="mx-2" style={{ color: 'white' }}>Utilização de Salas</span>
                                    </Link>
                                </li>
                                <li className="nav-link">
                                    <Link to='/relatorio/check'>
                                        <FaSignInAlt />
                                        <span className="mx-2" style={{ color: 'white' }}>Check-in / Check-out</span>
                                    </Link>
                                </li>
                                <li className="nav-link">
                                    <Link to='/relatorio/leads'>
                                        <FaChartLine />
                                        <span className="mx-2" style={{ color: 'white' }}>Leads</span>
                                    </Link>
                                </li>
                                <li className="nav-link">
                                    <Link to='/relatorio/planos'>
                                        <FaFileAlt />
                                        <span className="mx-2" style={{ color: 'white' }}>Planos por Cliente</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Logout */}
                    <li className="nav-link">
                        <div onClick={handleLogout}>
                            <FaSignInAlt />
                            <span className="mx-2" style={{ color: 'white' }}>Logout</span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Conteúdo da Página */}
            <div id="content">
                <Container fluid>
                    <Outlet />
                </Container>
            </div>
        </>
    );
}

export default NavBar;
