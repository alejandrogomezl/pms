// src/pages/CreateApartmentPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap instalado

const CreateApartmentPage = () => {
  const navigate = useNavigate();
  const [apartment, setApartment] = useState({
    name: '',
    description: '',
    price: '',
    services: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApartment(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/apartments', apartment);
      alert('Apartment created successfully!');
      navigate('/apartments');
    } catch (error) {
      console.error('Error creating apartment:', error);
      alert('Failed to create apartment');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4">Crear Nuevo Apartamento</h2>
          <form onSubmit={handleSubmit} className="card p-4 shadow">
            <div className="form-group mb-3">
              <label htmlFor="name">Nombre:</label>
              <input 
                type="text" 
                className="form-control" 
                name="name" 
                value={apartment.name} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="description">Descripción:</label>
              <textarea 
                className="form-control" 
                name="description" 
                value={apartment.description} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="price">Precio:</label>
              <input 
                type="number" 
                className="form-control" 
                name="price" 
                value={apartment.price} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="services">Servicios (separados por comas):</label>
              <input 
                type="text" 
                className="form-control" 
                name="services" 
                value={apartment.services} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="imageUrl">URL de la imagen:</label>
              <input 
                type="text" 
                className="form-control" 
                name="imageUrl" 
                value={apartment.imageUrl} 
                onChange={handleChange} 
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Crear Apartamento</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateApartmentPage;
