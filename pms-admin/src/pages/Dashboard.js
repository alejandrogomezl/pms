import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationsTable from '../components/ReservationsTable';
import '../css/Dashboard.scss';

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(10);
  const [totalReservations, setTotalReservations] = useState(0);

  useEffect(() => {
    fetchReservations();
  }, [startDate, endDate, currentPage]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/reservations/res', {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          page: currentPage,
          limit: reservationsPerPage,
        }
      });

      // Verificar que la respuesta contenga datos válidos
      if (response.data && response.data.reservations) {
        setReservations(response.data.reservations);
        setTotalReservations(response.data.totalReservations || 0);
      } else {
        // Si no se devuelven reservas, establecer a un array vacío
        setReservations([]);
        setTotalReservations(0);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      // En caso de error, establecer las reservas a un array vacío
      setReservations([]);
      setTotalReservations(0);
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setCurrentPage(1); // Resetea a la primera página al cambiar las fechas
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setCurrentPage(1); // Resetea a la primera página al cambiar las fechas
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalReservations / reservationsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const totalPages = Math.ceil(totalReservations / reservationsPerPage);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Panel de Control de Reservas</h2>
        <div className="filter-container">
          <label>Fecha Inicio:</label>
          <input type="date" value={startDate} onChange={handleStartDateChange} />
          <label>Fecha Fin:</label>
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </div>
      </div>
      <div className="dashboard-content">
        {reservations.length > 0 ? (
          <>
            <ReservationsTable reservations={reservations} />
            <div className="pagination-buttons">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>Siguiente</button>
            </div>
          </>
        ) : (
          <p>No hay reservas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
