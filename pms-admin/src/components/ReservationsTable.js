// src/components/ReservationsTable.js
import React from 'react';
import '../css/ReservationsTable.scss';

const ReservationsTable = ({ reservations = [], onSort, sortBy, sortOrder, ojete }) => {
  
  console.log('hola?:', ojete);
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
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.reservationId}</td>
                <td>{reservation.firstName} {reservation.lastName}</td>
                <td>{reservation.startDate}</td>
                <td>{reservation.endDate}</td>
                <td>{reservation.apartmentId.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservationsTable;
