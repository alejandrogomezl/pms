// src/components/ReservationsTable.js
import React from 'react';
import '../css/ReservationsTable.scss';

const ReservationsTable = ({ reservations = [] }) => {  // Asigna un array vacío como valor predeterminado
  return (
    <div className="reservations-table-container">
      <h3>Reservas</h3>
      {reservations.length === 0 ? (
        <p>No hay reservas disponibles.</p>
      ) : (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha Llegada</th>
              <th>Fecha Salida</th>
              <th>Apartamento</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation._id}</td>
                <td>{reservation.firstName} {reservation.lastName}</td>
                <td>{reservation.startDate}</td>
                <td>{reservation.endDate}</td>
                <td>{reservation.apartmentName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservationsTable;
