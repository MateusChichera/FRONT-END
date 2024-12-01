import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import './Relatorios.css';

const RelatorioPlanosPorCliente = () => {
    const [relatorioData, setRelatorioData] = useState([]);
    const [planos, setPlanos] = useState([]);
    const [filters, setFilters] = useState({
        cliente: '',
        formaPagamento: {
            PIX: true,
            DINHEIRO: true,
            'CARTÃO DE CRÉDITO': true,
            'CARTÃO DE DÉBITO': true,
        },
        plano: ''
    });

    // Carregar os dados do relatório e planos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRelatorio = await axios.get('http://localhost:4001/clientes/planos');
                const resPlanos = await axios.get('http://localhost:4001/planos');
                setRelatorioData(resRelatorio.data);
                setPlanos(resPlanos.data);
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
                formaPagamento: { ...filters.formaPagamento, [name]: checked }
            });
        } else {
            setFilters({
                ...filters,
                [name]: value
            });
        }
    };

    // Filtrar os dados com base nos filtros selecionados
    const filteredData = relatorioData.filter((item) => {
        const clienteMatch = !filters.cliente || item.cliente.toLowerCase().includes(filters.cliente.toLowerCase());
        const formaPagamentoMatch = Object.keys(filters.formaPagamento).some(
            (forma) => filters.formaPagamento[forma] && item.formadepagamento === forma
        );
        const planoMatch = !filters.plano || item.pla_nome === filters.plano;

        return clienteMatch && formaPagamentoMatch && planoMatch;
    });

    // Função para exportar para Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
        XLSX.writeFile(wb, 'relatorio_planos.xlsx');
    };

    // Função para exportar para PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Relatório de Planos por Cliente', 20, 10);
        doc.autoTable({
            head: [['Cliente', 'Telefone', 'Plano', 'Valor', 'Forma de Pagamento']],
            body: filteredData.map((item) => [
                item.cliente,
                item.cli_tel,
                item.pla_nome,
                item.pla_valor,
                item.formadepagamento
            ]),
        });
        doc.save('relatorio_planos.pdf');
    };

    // Função para imprimir
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write('<html><head><title>Relatório de Planos por Cliente</title></head><body>');
        printWindow.document.write('<h1>Relatório de Planos por Cliente</h1>');
        printWindow.document.write('<table border="1"><thead><tr><th>Cliente</th><th>Telefone</th><th>Plano</th><th>Valor</th><th>Forma de Pagamento</th></tr></thead><tbody>');
        filteredData.forEach(item => {
            printWindow.document.write(`<tr>
                <td>${item.cliente}</td>
                <td>${item.cli_tel}</td>
                <td>${item.pla_nome}</td>
                <td>${item.pla_valor}</td>
                <td>${item.formadepagamento}</td>
            </tr>`);
        });
        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="relatorio-container">
            <h1>Relatório de Planos por Cliente</h1>

            <div className="filters">
                <div>
                    <label>Cliente:</label>
                    <input
                        type="text"
                        name="cliente"
                        value={filters.cliente}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por nome do cliente"
                    />
                </div>

                <div>
                    <label>Forma de Pagamento:</label>
                    <div>
                        {['PIX', 'DINHEIRO', 'CARTÃO DE CRÉDITO', 'CARTÃO DE DÉBITO'].map((forma) => (
                            <label key={forma}>
                                <input
                                    type="checkbox"
                                    name={forma}
                                    checked={filters.formaPagamento[forma]}
                                    onChange={handleFilterChange}
                                />
                                {forma}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Plano:</label>
                    <select name="plano" value={filters.plano} onChange={handleFilterChange}>
                        <option value="">Selecione um plano</option>
                        {planos.map((plano) => (
                            <option key={plano.pla_nome} value={plano.pla_nome}>
                                {plano.pla_nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Telefone</th>
                        <th>Plano</th>
                        <th>Valor</th>
                        <th>Forma de Pagamento</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.cliente}</td>
                                <td>{item.cli_tel}</td>
                                <td>{item.pla_nome}</td>
                                <td>{item.pla_valor}</td>
                                <td>{item.formadepagamento}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum registro encontrado</td>
                        </tr>
                    )}
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

export default RelatorioPlanosPorCliente;
