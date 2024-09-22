// src/components/CreateApartmentButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateApartmentButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create-apartment'); // Cambia la ruta según tu configuración
  };

  return (
    <button className="btn btn-primary my-4" onClick={handleClick}>
      Crear Nuevo Apartamento
    </button>
  );
};

export default CreateApartmentButton;
