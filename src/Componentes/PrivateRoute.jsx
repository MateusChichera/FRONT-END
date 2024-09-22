// src/Componentes/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (!token) {
        // Se não estiver autenticado, redireciona para a página de login
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return element;
};

export default PrivateRoute;
