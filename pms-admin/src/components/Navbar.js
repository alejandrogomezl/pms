import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.scss';
import logo from '../img/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Alejandro Gomez" />
      </div>
      <div className="navbar-links">
        <NavLink to="/" activeClassName="active">Dashboard</NavLink>
        <NavLink to="/apartments" activeClassName="active">apartamentos</NavLink>
        <NavLink to="/access" activeClassName="active">Acceso</NavLink>
        <NavLink to="/settings" activeClassName="active">Configuración</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
