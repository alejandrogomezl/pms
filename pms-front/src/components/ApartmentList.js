import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ApartmentList.scss'; // Asegúrate de que la ruta es correcta

const ApartmentList = ({ apartments, totalPrices, nightCounts }) => {
  const navigate = useNavigate();
  if (!apartments) {
    apartments = [];  // Maneja el caso de que 'apartments' sea undefined
  }


  const handleNavigate = (apartmentId, totalPrice, nightCount, imageUrl, name, description, services) => {
    navigate(`/apartments/${apartmentId}`, {
      state: { 
        totalPrice: totalPrice, 
        nightCount: nightCount,
        imageUrl: imageUrl,
        name: name,
        description: description,
        services: services
      }
    });
  };

  return (
    <div className="apartment-list">
      {apartments.map((apartment) => {
        const totalPrice = totalPrices ? totalPrices[apartment._id] : undefined;
        const nightCount = nightCounts ? nightCounts[apartment._id] : undefined;
        const imageUrl = apartment.imageUrl;
        const name = apartment.name;
        const description = apartment.description;
        const services = apartment.services;

        return (
          <div key={apartment._id} className="apartment-item">
            <div className="apartment-image-container">
              <img src={apartment.imageUrl} alt={apartment.name} className="apartment-image" />
            </div>
            <div className="apartment-info">
              <h2>{apartment.name}</h2>
              <p>{apartment.description}</p>
              Servicios:
              <p>{apartment.services}</p>
            </div>
            <div className="apartment-price-reserve">
              <div className="apartment-price">
                <span>Total para tu reserva:</span>
                <p>{nightCount ? nightCount : 'Calculando...'} Noches</p>
                <p>{totalPrice ? totalPrice : 'Calculando...'} €</p>
              </div>
              <button 
                className="reserve-button"
                onClick={() => handleNavigate(apartment._id, totalPrice, nightCount, imageUrl, name, description, services)}
              >
                Reservar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApartmentList;
