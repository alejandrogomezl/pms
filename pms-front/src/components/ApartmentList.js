import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ApartmentList.scss'; // Asegúrate de que la ruta es correcta

const ApartmentList = ({ apartments, totalPrices, nightCounts }) => {
  console.log(apartments);
  if (!apartments) {
    apartments = [];  // Maneja el caso de que 'apartments' sea undefined
  }

  return (
    <div className="apartment-list">
      {apartments.map((apartment) => (
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
              <p>{nightCounts && nightCounts[apartment._id] ? nightCounts[apartment._id] : 'Calculando...'} Noches</p>
              <p>{totalPrices && totalPrices[apartment._id] ? totalPrices[apartment._id] : 'Calculando...'} €</p>
            </div>
            <Link to={`/apartments/${apartment._id}`} className="reserve-button">Reservar</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApartmentList;
