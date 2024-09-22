import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

const ReservationsTable = ({ reservations = [], onSort, sortBy, sortOrder }) => {
  const navigate = useNavigate();

  const handleDetailsClick = (reservationId) => {
    navigate(`/details/${reservationId}`);
  };

  const renderSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? ' ↑' : ' ↓';
    }
    return null;
  };

  return (
    <div className="container mt-4">
      <h3>Reservas</h3>
      {reservations.length === 0 ? (
        <p>No hay reservas disponibles.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th onClick={() => onSort('reservationId')}>
                ID {renderSortIcon('reservationId')}
              </th>
              <th onClick={() => onSort('firstName')}>
                Nombre {renderSortIcon('firstName')}
              </th>
              <th onClick={() => onSort('startDate')}>
                Fecha Llegada {renderSortIcon('startDate')}
              </th>
              <th onClick={() => onSort('endDate')}>
                Fecha Salida {renderSortIcon('endDate')}
              </th>
              <th onClick={() => onSort('apartmentId')}>
                Apartamento {renderSortIcon('apartmentId')}
              </th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.reservationId}</td>
                <td>
                  {reservation.firstName} {reservation.lastName}
                </td>
                <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
                <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
                <td>{reservation.apartmentId.name}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDetailsClick(reservation._id)}
                  >
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
