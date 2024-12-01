import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import './Relatorios.css';

const RelatorioCheckInCheckOut = () => {
    const [relatorioData, setRelatorioData] = useState([]);
    const [filters, setFilters] = useState({
        clienteNome: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4001/clientes/relatorio');
                setRelatorioData(response.data);
            } catch (error) {
                console.error('Erro ao carregar dados', error);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const filteredData = relatorioData.filter((item) => {
        const nomeMatch = !filters.clienteNome || item.cli_nome.toLowerCase().includes(filters.clienteNome.toLowerCase());
        return nomeMatch;
    });

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Relatorio');
        XLSX.writeFile(wb, 'relatorio_checkin_checkout.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Relatório de Check-in e Check-out', 20, 10);
        doc.autoTable({
            head: [['ID', 'Cliente', 'Check-in', 'Check-out']],
            body: filteredData.map((item) => [
                item.age_id,
                item.cli_nome,
                item.check_in_formatado || 'Não registrado',
                item.check_out_formatado || 'Não registrado'
            ]),
        });
        doc.save('relatorio_checkin_checkout.pdf');
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write('<html><head><title>Relatório de Check-in e Check-out</title></head><body>');
        printWindow.document.write('<h1>Relatório de Check-in e Check-out</h1>');
        printWindow.document.write('<table border="1"><thead><tr><th>ID</th><th>Cliente</th><th>Check-in</th><th>Check-out</th></tr></thead><tbody>');
        filteredData.forEach(item => {
            printWindow.document.write(`<tr>
                <td>${item.age_id}</td>
                <td>${item.cli_nome}</td>
                <td>${item.check_in_formatado || 'Não registrado'}</td>
                <td>${item.check_out_formatado || 'Não registrado'}</td>
            </tr>`);
        });
        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="relatorio-container">
            <h1>Relatório de Check-in e Check-out</h1>

            <div className="filters">
                <div>
                    <label>Nome do Cliente:</label>
                    <input
                        type="text"
                        name="clienteNome"
                        value={filters.clienteNome}
                        onChange={handleFilterChange}
                    />
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.age_id}>
                            <td>{item.age_id}</td>
                            <td>{item.cli_nome}</td>
                            <td>{item.check_in_formatado || 'Não registrado'}</td>
                            <td>{item.check_out_formatado || 'Não registrado'}</td>
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

export default RelatorioCheckInCheckOut;
