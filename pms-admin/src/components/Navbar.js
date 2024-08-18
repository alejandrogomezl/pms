import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/path-to-logo.png" alt="Mara Apartments" />
      </div>
      <div className="navbar-links">
        <NavLink to="/dashboard" activeClassName="active">Reservas</NavLink>
        <NavLink to="/documents" activeClassName="active">Documentos</NavLink>
        <NavLink to="/access" activeClassName="active">Acceso</NavLink>
        <NavLink to="/settings" activeClassName="active">Configuración</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
