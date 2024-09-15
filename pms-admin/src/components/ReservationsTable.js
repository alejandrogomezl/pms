import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate en lugar de useHistory
import '../css/ReservationsTable.scss';

const ReservationsTable = ({ reservations = [], onSort, sortBy, sortOrder }) => {
  const navigate = useNavigate(); // Inicializar useNavigate para hacer redirecciones

  // Función para redirigir a la factura del apartamento
  const handleDetailsClick = (apartmentId) => {
    navigate(`/details/${apartmentId}`);
  };

  const renderSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? ' ↑' : ' ↓';
    }
    return null;
  };

  return (
    <div className="reservations-table-container">
      <h3>Reservas</h3>
      {reservations.length === 0 ? (
        <p>No hay reservas disponibles.</p>
      ) : (
        <table className="reservations-table">
          <thead>
            <tr>
              <th onClick={() => onSort('reservationId')}>ID {renderSortIcon('reservationId')}</th>
              <th onClick={() => onSort('firstName')}>Nombre {renderSortIcon('firstName')}</th>
              <th onClick={() => onSort('startDate')}>Fecha Llegada {renderSortIcon('startDate')}</th>
              <th onClick={() => onSort('endDate')}>Fecha Salida {renderSortIcon('endDate')}</th>
              <th onClick={() => onSort('apartmentId')}>Apartamento {renderSortIcon('apartmentId')}</th>
              <th>Detalles</th> {/* Nueva columna para el botón de factura */}
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.reservationId}</td>
                <td>{reservation.firstName} {reservation.lastName}</td>
                <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
                <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
                <td>{reservation.apartmentId.name}</td>
                <td>
                  {/* Botón para redirigir a la factura */}
                  <button onClick={() => handleDetailsClick(reservation._id)}>
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
