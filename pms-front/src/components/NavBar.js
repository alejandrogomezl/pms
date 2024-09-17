import React from 'react';
import '../css/NavBar.scss';
import logo from '../img/logo.png';

const NavBar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="navbar-logo" />
    </nav>
  );
};

export default NavBar;
