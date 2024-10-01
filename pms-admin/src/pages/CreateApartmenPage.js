import React, { useReducer, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApartmentForm from '../components/ApartmentForm';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap instalado

const apartmentReducer = (state, action) => {
  return {
    ...state,
    [action.name]: action.value
  };
};

const CreateApartmentPage = () => {
  const navigate = useNavigate();
  const [apartment, dispatch] = useReducer(apartmentReducer, {
    name: '',
    description: '',
    defaultPrice: '',
    services: '',
    imageUrl: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/apartments', apartment);
      alert('Apartamento creado con éxito');
      navigate('/apartments');
    } catch (error) {
      console.error('Error al crear el apartamento:', error);
      alert('Error al crear el apartamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Crear Nuevo Apartamento</h2>
      <ApartmentForm
        apartment={apartment}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEditMode={false}
        loading={loading}
      />
    </div>
  );
};

export default CreateApartmentPage;
