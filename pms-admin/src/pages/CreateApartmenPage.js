// src/pages/CreateApartmentPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/CreateApartmentPage.scss';

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
    <div className="create-apartment-container">
      <h2>Crear Nuevo Apartamento</h2>
      <form onSubmit={handleSubmit} className="create-apartment-form">
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" value={apartment.name} onChange={handleChange} required />

        <label htmlFor="description">Description:</label>
        <textarea name="description" value={apartment.description} onChange={handleChange} required />

        <label htmlFor="price">Price:</label>
        <input type="number" name="price" value={apartment.price} onChange={handleChange} required />

        <label htmlFor="services">Services (comma separated):</label>
        <input type="text" name="services" value={apartment.services} onChange={handleChange} required />

        <label htmlFor="imageUrl">Image URL:</label>
        <input type="text" name="imageUrl" value={apartment.imageUrl} onChange={handleChange} />

        <button type="submit">Crear Apartamento</button>
      </form>
    </div>
  );
};

export default CreateApartmentPage;
