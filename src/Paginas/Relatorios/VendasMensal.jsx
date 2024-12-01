import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import './Relatorios.css';

const RelatorioVendasMensal = () => {
    const [relatorioData, setRelatorioData] = useState([]);
    const [filtros, setFiltros] = useState({
        dataInicio: '',
        dataFim: '',
        plano: ''
    });

    const fetchData = async () => {
        try {
            const { dataInicio, dataFim } = filtros;
            const response = await axios.post('http://localhost:4001/associar/vendasmensal', {
                dataInicio,
                dataFim
            });
            setRelatorioData(response.data);
        } catch (error) {
            console.error('Erro ao carregar dados', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value
        });
    };

    const filteredData = relatorioData.filter((item) => {
        return !filtros.plano || item.pla_nome.toLowerCase().includes(filtros.plano.toLowerCase());
    });

    // Cálculo dos totais
    const totalVendas = filteredData.reduce((acc, item) => acc + item.total_vendas, 0);
    const totalValorVendas = filteredData.reduce((acc, item) => acc + parseFloat(item.total_valor_vendas), 0);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet([...filteredData, {
            pla_nome: 'Total Geral',
            total_vendas: totalVendas,
            total_valor_vendas: totalValorVendas.toFixed(2)
        }]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Relatorio_Vendas');
        XLSX.writeFile(wb, 'relatorio_vendas.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Relatório de Vendas', 20, 10);
        doc.autoTable({
            head: [['Plano', 'Total Vendas', 'Total Valor']],
            body: [...filteredData.map((item) => [
                item.pla_nome,
                item.total_vendas,
                `R$ ${item.total_valor_vendas}`
            ]), ['Total Geral', totalVendas, `R$ ${totalValorVendas.toFixed(2)}`]],
        });
        doc.save('relatorio_vendas.pdf');
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write('<html><head><title>Relatório de Vendas</title></head><body>');
        printWindow.document.write('<h1>Relatório de Vendas</h1>');
        printWindow.document.write('<table border="1"><thead><tr><th>Plano</th><th>Total Vendas</th><th>Total Valor</th></tr></thead><tbody>');
        filteredData.forEach(item => {
            printWindow.document.write(`<tr>
                <td>${item.pla_nome}</td>
                <td>${item.total_vendas}</td>
                <td>R$ ${item.total_valor_vendas}</td>
            </tr>`);
        });
        printWindow.document.write(`
            <tr style="font-weight:bold">
                <td>Total Geral</td>
                <td>${totalVendas}</td>
                <td>R$ ${totalValorVendas.toFixed(2)}</td>
            </tr>`);
        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="relatorio-container">
            <h1>Relatório de Vendas por Período</h1>

            <div className="filters">
                <div>
                    <label>Data Início:</label>
                    <input 
                        type="date" 
                        name="dataInicio" 
                        value={filtros.dataInicio} 
                        onChange={handleFilterChange} 
                    />
                </div>
                <div>
                    <label>Data Fim:</label>
                    <input 
                        type="date" 
                        name="dataFim" 
                        value={filtros.dataFim} 
                        onChange={handleFilterChange} 
                    />
                </div>
                <div>
                    <label>Plano:</label>
                    <input 
                        type="text" 
                        name="plano" 
                        value={filtros.plano} 
                        onChange={handleFilterChange} 
                        placeholder="Nome do plano" 
                    />
                </div>
                <button onClick={fetchData}>Buscar Relatório</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Plano</th>
                        <th>Total Vendas</th>
                        <th>Total Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.pla_nome}>
                            <td>{item.pla_nome}</td>
                            <td>{item.total_vendas}</td>
                            <td>R$ {item.total_valor_vendas}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Total Geral</strong></td>
                        <td><strong>{totalVendas}</strong></td>
                        <td><strong>R$ {totalValorVendas.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>

            <div className="actions">
                <button onClick={handlePrint}>Imprimir</button>
                <button onClick={exportToExcel}>Exportar para Excel</button>
                <button onClick={exportToPDF}>Exportar para PDF</button>
            </div>
        </div>
    );
};

export default RelatorioVendasMensal;
