// src/pages/EditApartmentPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/EditApartmentPage.scss';

const EditApartmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Cambiar useHistory a useNavigate
  const [apartment, setApartment] = useState({
    name: '',
    description: '',
    price: '',
    services: '',
    imageUrl: '',
  });

  useEffect(() => {
    // Fetch apartment details
    console.log("id")
    axios.get(`http://localhost:3000/api/apartments/${id}`)
      .then(response => {
        setApartment(response.data);
      })
      .catch(error => {
        console.error('Error fetching apartment:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApartment(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/api/apartments/${id}`, apartment)
      .then(response => {
        alert('Apartment updated successfully!');
        navigate(`/apartments`); // Cambiar history.push a navigate
      })
      .catch(error => {
        console.error('Error updating apartment:', error);
        alert('Failed to update apartment');
      });
  };

  return (
    <div className="edit-apartment-container">
      <h2>Edit Apartment</h2>
      <form onSubmit={handleSubmit} className="edit-apartment-form">
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditApartmentPage;