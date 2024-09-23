import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap esté importado

const ApartmentList = ({ apartments }) => {
  if (!apartments || apartments.length === 0) {
    return <p>No apartments available.</p>;
  }

  return (
    <div className="container my-4">
      <div className="row">
        {apartments.map((apartment) => (
          <div key={apartment._id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="row no-gutters">
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                  <img
                    src={apartment.imageUrl}
                    alt={apartment.name}
                    className="img-fluid rounded-start"  // Clase de Bootstrap para imágenes
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
                      <Link to={`/apartments/${apartment._id}`} className="btn btn-primary mb-2">Acceso</Link>
                      <Link to={`/price/${apartment._id}`} className="btn btn-primary">Precio</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentList;
