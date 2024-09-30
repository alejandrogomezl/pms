import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ApartmentList.scss'; // Asegúrate de que la ruta es correcta

const ApartmentList = ({ apartments, totalPrices, nightCounts }) => {
  const navigate = useNavigate();
  const pageSize = 10; // Número de apartamentos por página
  const [currentPage, setCurrentPage] = useState(1);

  if (!apartments || apartments.length === 0) {
    return <p></p>; // Condición para mostrar un mensaje si no hay apartamentos
  }

  // Calcular el número total de páginas
  const totalPages = Math.ceil(apartments.length / pageSize);

  // Obtener los apartamentos de la página actual
  const paginatedApartments = apartments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="apartment-list">
      {paginatedApartments.map((apartment) => {
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

      {/* Mostrar la paginación solo si hay más de una página */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            className="btn btn-secondary" 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button 
            className="btn btn-secondary" 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ApartmentList;
