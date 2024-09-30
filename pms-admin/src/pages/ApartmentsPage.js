import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApartmentList from '../components/ApartmentList'; // Asegúrate de que la ruta es correcta
import CreateApartmentButton from '../components/CreateApartmentButton'; // Asegúrate de que la ruta es correcta
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faPlus } from '@fortawesome/free-solid-svg-icons'; // Importa el icono de añadir

const ApartmentsPage = () => {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/apartments/all');
      setApartments(response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h1 className="display-4">Apartmentos</h1>
        <p className="lead text-muted">Encuentra todos los apartamentos</p>
      </div>

      {/* Botón para crear un nuevo apartamento */}
      <div className="d-flex justify-content-center mb-4">
        <CreateApartmentButton>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add New Apartment
        </CreateApartmentButton>
      </div>

      {/* Lista de apartamentos */}
      <div className="row">
        {apartments.length > 0 ? (
          <ApartmentList apartments={apartments} />
        ) : (
          <div className="col text-center">
            <p className="text-muted">No apartments available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApartmentsPage;
