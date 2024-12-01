import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import './Relatorios.css';

const RelatorioUtilizacaoSalas = () => {
    const [relatorioData, setRelatorioData] = useState([]);
    const [salas, setSalas] = useState([]);
    const [filters, setFilters] = useState({
        data: '',
        status: {
            'check-in': true,
            'check-out': true,
            aprovado: true,
            pendente: true,
        },
        sala: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRelatorio = await axios.get('http://localhost:4001/salas/relatorio');
                const resSalas = await axios.get('http://localhost:4001/salas');
                setRelatorioData(resRelatorio.data);
                setSalas(resSalas.data);
            } catch (error) {
                console.error('Erro ao carregar dados', error);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFilters({
                ...filters,
                status: { ...filters.status, [name]: checked }
            });
        } else {
            setFilters({
                ...filters,
                [name]: value
            });
        }
    };

    const filteredData = relatorioData.filter((item) => {
        // Lógica de filtragem de data
        const dateMatch = !filters.data || 
            (new Date(item.age_data_formatada).toDateString() === new Date(filters.data).toDateString());

        // Lógica de filtragem de status
        const statusMatch = Object.keys(filters.status).some(status => filters.status[status] && item.age_status === status);

        // Lógica de filtragem de sala
        const salaMatch = !filters.sala || item.sal_nome === filters.sala;

        return dateMatch && statusMatch && salaMatch;
    });

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Relatorio');
        XLSX.writeFile(wb, 'relatorio_salas.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Relatório de Utilização de Salas', 20, 10);
        doc.autoTable({
            head: [['ID', 'Data', 'Hora Início', 'Hora Fim', 'Sala', 'Cliente', 'Status']],
            body: filteredData.map((item) => [
                item.age_id,
                item.age_data_formatada,
                item.age_horario_inicio_formatado,
                item.age_horario_fim_formatado,
                item.sal_nome,
                item.cli_nome,
                item.age_status
            ]),
        });
        doc.save('relatorio_salas.pdf');
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write('<html><head><title>Relatório de Utilização de Salas</title></head><body>');
        printWindow.document.write('<h1>Relatório de Utilização de Salas</h1>');
        printWindow.document.write('<table border="1"><thead><tr><th>ID</th><th>Data</th><th>Hora Início</th><th>Hora Fim</th><th>Sala</th><th>Cliente</th><th>Status</th></tr></thead><tbody>');
        filteredData.forEach(item => {
            printWindow.document.write(`<tr>
                <td>${item.age_id}</td>
                <td>${item.age_data_formatada}</td>
                <td>${item.age_horario_inicio_formatado}</td>
                <td>${item.age_horario_fim_formatado}</td>
                <td>${item.sal_nome}</td>
                <td>${item.cli_nome}</td>
                <td>${item.age_status}</td>
            </tr>`);
        });
        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="relatorio-container">
            <h1>Relatório de Utilização de Salas</h1>

            <div className="filters">
                <div>
                    <label>Data:</label>
                    <input type="date" name="data" value={filters.data} onChange={handleFilterChange} />
                </div>
                <div>
                    <label>Status:</label>
                    <div>
                        {['check-in', 'check-out', 'aprovado', 'pendente'].map(status => (
                            <label key={status}>
                                <input
                                    type="checkbox"
                                    name={status}
                                    checked={filters.status[status]}
                                    onChange={handleFilterChange}
                                />
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label>Sala:</label>
                    <select name="sala" value={filters.sala} onChange={handleFilterChange}>
                        <option value="">Selecione uma sala</option>
                        {salas.map(sala => (
                            <option key={sala.sal_nome} value={sala.sal_nome}>
                                {sala.sal_nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data</th>
                        <th>Hora Início</th>
                        <th>Hora Fim</th>
                        <th>Sala</th>
                        <th>Cliente</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.age_id}>
                            <td>{item.age_id}</td>
                            <td>{item.age_data_formatada}</td>
                            <td>{item.age_horario_inicio_formatado}</td>
                            <td>{item.age_horario_fim_formatado}</td>
                            <td>{item.sal_nome}</td>
                            <td>{item.cli_nome}</td>
                            <td>{item.age_status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="actions">
                <button onClick={handlePrint}>Imprimir</button>
                <button onClick={exportToExcel}>Exportar para Excel</button>
                <button onClick={exportToPDF}>Exportar para PDF</button>
            </div>
        </div>
    );
};

export default RelatorioUtilizacaoSalas;
