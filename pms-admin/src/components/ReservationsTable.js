import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faEye } from '@fortawesome/free-solid-svg-icons';

const ReservationsTable = ({ reservations = [], onSort, sortBy, sortOrder }) => {
  const navigate = useNavigate();

  const handleDetailsClick = (reservationId) => {
    navigate(`/details/${reservationId}`);
  };

  const renderSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />;
    }
    return <FontAwesomeIcon icon={faSort} />;
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Listado de Reservas</h3>
      {reservations.length === 0 ? (
        <div className="alert alert-warning text-center">
          No hay reservas disponibles.
        </div>
      ) : (
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-primary text-center align-middle">
            <tr>
              <th onClick={() => onSort('reservationId')} style={{ cursor: 'pointer' }}>
                ID {renderSortIcon('reservationId')}
              </th>
              <th onClick={() => onSort('firstName')} style={{ cursor: 'pointer' }}>
                Nombre {renderSortIcon('firstName')}
              </th>
              <th onClick={() => onSort('startDate')} style={{ cursor: 'pointer' }}>
                Fecha Llegada {renderSortIcon('startDate')}
              </th>
              <th onClick={() => onSort('endDate')} style={{ cursor: 'pointer' }}>
                Fecha Salida {renderSortIcon('endDate')}
              </th>
              <th onClick={() => onSort('apartmentId')} style={{ cursor: 'pointer' }}>
                Apartamento {renderSortIcon('apartmentId')}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id} className="text-center align-middle">
                <td>{reservation.reservationId}</td>
                <td>{reservation.firstName} {reservation.lastName}</td>
                <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
                <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
                <td>{reservation.apartmentId.name}</td>
                <td>
                  <button
                    className="btn btn-primary text-white"
                    onClick={() => handleDetailsClick(reservation._id)}
                  >
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservationsTable;
