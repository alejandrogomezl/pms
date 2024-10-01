import React, { useReducer, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApartmentForm from '../components/ApartmentForm';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap instalado

const apartmentReducer = (state, action) => {
  return {
    ...state,
    [action.name]: action.value
  };
};

const EditApartmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, dispatch] = useReducer(apartmentReducer, {
    name: '',
    description: '',
    defaultPrice: '',
    services: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApartmentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/apartments/${id}`);
        dispatch({ name: 'name', value: response.data.name });
        dispatch({ name: 'description', value: response.data.description });
        dispatch({ name: 'defaultPrice', value: response.data.defaultPrice });
        dispatch({ name: 'services', value: response.data.services });
        dispatch({ name: 'imageUrl', value: response.data.imageUrl });
      } catch (error) {
        console.error('Error al obtener los detalles del apartamento:', error);
      }
    };
    
    fetchApartmentDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/apartments/${id}`, apartment);
      alert('Apartamento actualizado con éxito');
      navigate('/apartments');
    } catch (error) {
      console.error('Error al actualizar el apartamento:', error);
      alert('Error al actualizar el apartamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este apartamento?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/apartments/${id}`);
        alert('Apartamento eliminado con éxito');
        navigate('/apartments');
      } catch (error) {
        console.error('Error al eliminar el apartamento:', error);
        alert('Error al eliminar el apartamento');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Editar Apartamento</h2>
      <ApartmentForm
        apartment={apartment}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEditMode={true}
        loading={loading}
      />
      <div className="text-center mt-4">
        <button 
          className="btn btn-danger"
          onClick={handleDelete}
        >
          Eliminar Apartamento
        </button>
      </div>
    </div>
  );
};

export default EditApartmentPage;
