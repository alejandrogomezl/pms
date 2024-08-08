// src/components/ApartmentList.js
import React from 'react';
import { Link } from 'react-router-dom';

const ApartmentList = ({ apartments }) => {
  // Asegúrate de que 'apartments' es siempre un array
  console.log('apartments:', apartments);
  if (!apartments) {
    apartments = [];  // Esto maneja el caso de que 'apartments' sea undefined
  }

  return (
    <div>
      {apartments.map((apartment) => (
        <div key={apartment._id}> {/* Asegúrate de que usas '_id' si es el formato correcto en tu base de datos */}
          <h2>{apartment.name}</h2>
          <p>{apartment.description}</p>
          <Link to={`/apartments/${apartment._id}`}>More Details</Link>
        </div>
      ))}
    </div>
  );
};

export default ApartmentList;
