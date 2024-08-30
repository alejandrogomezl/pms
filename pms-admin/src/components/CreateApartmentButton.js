// src/components/CreateApartmentButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CreateApartmentButton.scss'; // Asegúrate de crear un archivo CSS para estilos si lo necesitas

const CreateApartmentButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create-apartment'); // Cambia la ruta según tu configuración
  };

  return (
    <button className="create-apartment-button" onClick={handleClick}>
      Crear Nuevo Apartamento
    </button>
  );
};

export default CreateApartmentButton;
