import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/ApartmentDetails.scss';

const ApartmentDetails = () => {
  const [apartment, setApartment] = useState(null);
  const { id } = useParams(); // Extrae el id de la URL
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acceder al estado pasado por el Link

  // Extraemos el estado pasado por el Link (si está disponible)
  const { totalPrice, nightCount, imageUrl, name, description, services } = location.state || {};

  // Función para manejar la navegación a la página de reserva
  const handleNavigate = (apartmentId, totalPrice, nightCount, imageUrl, name, description, services) => {
    navigate(`/reserve/${id}`, {
      state: { 
        totalPrice, 
        nightCount,
        imageUrl,
        name,
        description,
        services
      }
    });
  }

  // Este efecto debería cargar los datos del apartamento si no están pasados desde el Link
  useEffect(() => {
    if (!location.state) {
      const fetchApartment = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/apartments/${id}`);
          setApartment(response.data);
        } catch (error) {
          console.error('Error fetching apartment details:', error);
        }
      };
      fetchApartment();
    } else {
      setApartment(location.state); // Si ya está en el estado, lo usamos
    }
  }, [id, location.state]);

  // Si los datos no están listos, muestra un mensaje de carga
  if (!apartment) {
    return <div>Loading...</div>;
  }

  // Renderizamos los detalles del apartamento
  return (
    <div className="apartment-details">
      <div className="apartment-item">
        <div className="apartment-image-container">
          <img src={imageUrl || apartment.imageUrl} alt={name || apartment.name} className="apartment-image" />
        </div>
        <div className="apartment-info">
          <h2>{name || apartment.name}</h2>
          <p>{description || apartment.description}</p>
          Servicios:
          <p>{services || apartment.services}</p>
        </div>
        <div className="apartment-price-reserve">
          <div className="apartment-price">
            <span>Total para tu reserva:</span>
            <p>{nightCount || 'Calculando...'} Noches</p>
            <p>{totalPrice !== undefined ? totalPrice : 'Calculando...'} €</p>
          </div>
          <button 
            className="reserve-button"
            onClick={() => handleNavigate(apartment._id, totalPrice, nightCount, imageUrl || apartment.imageUrl, name || apartment.name, description || apartment.description, services || apartment.services)}
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetails;