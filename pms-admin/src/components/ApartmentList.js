import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap esté importado

const ApartmentList = ({ apartments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Número de apartamentos por página

  // Calcular el número total de páginas
  const totalPages = Math.ceil(apartments.length / pageSize);

  // Obtener los apartamentos que se mostrarán en la página actual
  const paginatedApartments = apartments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!apartments || apartments.length === 0) {
    return <p>No apartments available.</p>;
  }

  return (
    <div className="container my-4">
      <div className="row">
        {paginatedApartments.map((apartment) => (
          <div key={apartment._id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="row no-gutters">
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                  <img
                    src={apartment.imageUrl}
                    alt={apartment.name}
                    className="img-fluid"
                    style={{ borderRadius: '0.25rem', marginLeft: '30px' }} // Aplicar estilo en línea
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{apartment.name}</h5>
                    <p className="card-text">{apartment.description}</p>
                    <p className="card-text">
                      <small className="text-muted">Servicios: {apartment.services}</small>
                    </p>
                    <div className="d-flex flex-column">
                      <Link to={`/devices/${apartment._id}`} className="btn btn-primary mb-2">Control</Link>
                      <Link to={`/edit/${apartment._id}`} className="btn btn-primary mb-2">Editar</Link>
                      <Link to={`/reservations/${apartment._id}`} className="btn btn-primary mb-2">Ver Reservas</Link>
                      <Link to={`/price/${apartment._id}`} className="btn btn-primary">Precio</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="d-flex justify-content-between mt-4">
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
    </div>
  );
};

export default ApartmentList;
