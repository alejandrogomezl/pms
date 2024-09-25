import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/ApartmentDetails.scss';

const ApartmentDetails = () => {
  const [apartment, setApartment] = useState(null);
  const { id } = useParams(); // Extrae el id de la URL
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acceder al estado pasado por el Link

  // Asegúrate de acceder correctamente a location.state
  const { totalPrice, nightCount } = location.state || {}; // Si no existe, al menos obtenemos un objeto vacío

  // Agrega un console.log para verificar si los valores están llegando
  console.log("Estado recibido en ApartmentDetails:", { totalPrice, nightCount });

  useEffect(() => {
    const fetchApartment = async () => {
      const url = `http://localhost:3000/api/apartments/${id}`;
      try {
        const response = await axios.get(url);
        setApartment(response.data);
      } catch (error) {
        console.error("Error fetching apartment details:", error);
      }
    };

    fetchApartment();
  }, [id]);

  const handleReservationClick = () => {
    navigate(`/reserve/${id}`);
  };

  if (!apartment) return <div>Loading...</div>;

  return (
    <div className="apartment-details">
      <div className="apartment-header">
        <h1>{apartment.name}</h1>
      </div>
      <div className="apartment-content">
        <div className="apartment-image-container">
          <img src={apartment.imageUrl} alt={apartment.name} className="apartment-image" />
        </div>
        <div className="apartment-info">
          <h2 className="description-title">Descripción</h2>
          <p className="description">{apartment.description}</p>
        </div>
      </div>
      <div className="apartment-reservation">
        <div className="price-container">
          {/* Muestra el precio total si fue pasado por el Link */}
          {totalPrice !== undefined ? (
            <>
              <span className="price">Total para {nightCount} noches: {totalPrice.toFixed(2)} €</span>
            </>
          ) : (
            <span className="price">Calculando precio...</span>
          )}
        </div>
        <button className="reserve-button" onClick={handleReservationClick}>Reservar</button>
      </div>
    </div>
  );
};

export default ApartmentDetails;
