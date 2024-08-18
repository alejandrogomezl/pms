import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import '../css/ApartmentDetails.scss';
import { DateContext } from '../context/DateContext';

const ApartmentDetails = () => {
  const [apartment, setApartment] = useState(null);
  const { id } = useParams();  // Extrae el id de la URL
  const navigate = useNavigate();
  const { selectedDates } = useContext(DateContext);

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
          {/* <ul className="services-list">
            {apartment.services && apartment.services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul> */}
        </div>
      </div>
      <div className="apartment-reservation">
        <div className="price-container">
          <span className="price">{apartment.price.toFixed(2)} €</span>
        </div>
        <button className="reserve-button" onClick={handleReservationClick}>Reservar</button>
      </div>
    </div>
  );
};

export default ApartmentDetails;
