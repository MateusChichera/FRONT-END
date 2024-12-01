import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import './Relatorios.css';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredLeads, setFilteredLeads] = useState([]);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await axios.get('http://localhost:4001/clientes/leads');
                setLeads(response.data);
                setFilteredLeads(response.data); // Inicializa com todos os leads
            } catch (error) {
                console.error('Erro ao buscar leads:', error);
            }
        };

        fetchLeads();
    }, []);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearch(value);

        if (value) {
            const filtered = leads.filter((lead) =>
                lead.cliente.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredLeads(filtered);
        } else {
            setFilteredLeads(leads); // Se não houver filtro, mostra todos os leads
        }
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredLeads);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Leads');
        XLSX.writeFile(wb, 'leads.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Relatório de Leads', 20, 10);
        doc.autoTable({
            head: [['Nome do Cliente', 'Telefone']],
            body: filteredLeads.map((lead) => [
                lead.cliente,
                lead.cli_tel
            ]),
        });
        doc.save('leads.pdf');
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write('<html><head><title>Relatório de Leads</title></head><body>');
        printWindow.document.write('<h1>Relatório de Leads</h1>');
        printWindow.document.write('<table border="1"><thead><tr><th>Nome do Cliente</th><th>Telefone</th></tr></thead><tbody>');
        filteredLeads.forEach(lead => {
            printWindow.document.write(`<tr><td>${lead.cliente}</td><td>${lead.cli_tel}</td></tr>`);
        });
        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="relatorio-container">
            <h1>Relatório de Leads</h1>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Buscar cliente"
                    value={search}
                    onChange={handleSearchChange}
                    style={{ padding: '5px' }}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nome do Cliente</th>
                        <th>Telefone</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead, index) => (
                            <tr key={index}>
                                <td>{lead.cliente}</td>
                                <td>{lead.cli_tel}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'center' }}>Nenhum lead encontrado</td>
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

export default Leads;
