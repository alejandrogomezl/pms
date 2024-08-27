import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ApartmentList.scss'; // Asegúrate de que la ruta del archivo CSS sea correcta

const ApartmentList = ({ apartments }) => {
  if (!apartments || apartments.length === 0) {
    return <p>No apartments available.</p>;
  }

  return (
    <div className="apartment-list">
      {apartments.map((apartment) => {
        // Verifica que apartment.services sea un array, de lo contrario, convierte a un array vacío
        const services = Array.isArray(apartment.services) ? apartment.services : [];

        return (
          <div key={apartment._id} className="apartment-item">
            <div className="apartment-image-container">
              <img src={apartment.imageUrl} alt={apartment.name} className="apartment-image" />
            </div>
            <div className="apartment-info">
              <h2>{apartment.name}</h2>
              <p>{apartment.description}</p>
              <p><strong>Servicios:</strong> {services.length > 0 ? services.join(', ') : 'No services available'}</p>
            </div>
            <div className="apartment-price-reserve">
              <div className="apartment-price">
                <span>Desde</span>
                <span className="price">{apartment.price} €</span>
              </div>
              <Link to={`/apartments/${apartment._id}`} className="reserve-button">Reservar</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApartmentList;
