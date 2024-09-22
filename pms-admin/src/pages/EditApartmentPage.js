import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

const EditApartmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState({
    name: '',
    description: '',
    price: '',
    services: '',
    imageUrl: '',
  });

  useEffect(() => {
    // Fetch apartment details
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
        navigate('/apartments');
      })
      .catch(error => {
        console.error('Error updating apartment:', error);
        alert('Failed to update apartment');
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Editar Apartamento</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <div className="mb-3">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            name="name"
            value={apartment.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description">Descripción:</label>
          <textarea
            name="description"
            value={apartment.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price">Precio:</label>
          <input
            type="number"
            name="price"
            value={apartment.price}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="services">Servicios (separados por comas):</label>
          <input
            type="text"
            name="services"
            value={apartment.services}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="imageUrl">URL de Imagen:</label>
          <input
            type="text"
            name="imageUrl"
            value={apartment.imageUrl}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditApartmentPage;
