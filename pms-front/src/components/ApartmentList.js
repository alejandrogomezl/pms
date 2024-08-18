import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ApartmentList.scss'; // Asegúrate de que la ruta es correcta

const ApartmentList = ({ apartments }) => {
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
              <span>Desde</span>
              <span className="price">{apartment.price} €</span>
            </div>
            <Link to={`/apartments/${apartment._id}`} className="reserve-button">Reservar</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApartmentList;
