import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.scss';
import logo from '../img/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">
          <img src={logo} alt="Alejandro Gomez" />
        </NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
        <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'active' : '')}>Calendario</NavLink>
        <NavLink to="/apartments" className={({ isActive }) => (isActive ? 'active' : '')}>Apartamentos</NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>Configuración</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;