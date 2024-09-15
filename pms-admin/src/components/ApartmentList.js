import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ApartmentList.scss'; // Asegúrate de que la ruta del archivo CSS sea correcta

const ApartmentList = ({ apartments }) => {
  if (!apartments || apartments.length === 0) {
    return <p>No apartments available.</p>;
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
          <div className="apartment-options">
            <Link to={`/edit/${apartment._id}`} className="reserve-button">Editar</Link>
            <Link to={`/reservations/${apartment._id}`} className="reserve-button">Ver Reservas</Link>
            <Link to={`/apartments/${apartment._id}`} className="reserve-button">Acceso</Link>
            <Link to={`/price/${apartment._id}`} className="reserve-button">Precio</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApartmentList;
