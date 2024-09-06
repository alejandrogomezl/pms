import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationsTable from '../components/ReservationsTable';
import '../css/Dashboard.scss'; // Usamos el CSS del Dashboard

const Apartments = () => {
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('startDate'); // Campo por defecto
  const [sortOrder, setSortOrder] = useState('asc'); // Orden por defecto
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [pageSize] = useState(10); // Tamaño de página
  const [totalReservations, setTotalReservations] = useState(0); // Total de reservas

  useEffect(() => {
    fetchReservations();
  }, [startDate, endDate, sortBy, sortOrder, currentPage]);

  const fetchReservations = async () => {
    try {
      const apiUrl = 'http://localhost:3000/api/reservations/res';

      const params = {
        sortBy,
        sortOrder,
        page: currentPage,
        limit: pageSize,
      };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('Fetching reservations with params:', params);

      const response = await axios.get(apiUrl, { params });
      setReservations(response.data.reservations);
      setTotalReservations(response.data.totalReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSort = (column) => {
    // Ciclo de orden: ascendente -> descendente -> por defecto
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc'); // Cambia a descendente
      } else if (sortOrder === 'desc') {
        setSortBy(null); // Reinicia el campo a sin orden
        setSortOrder(null);
      } else {
        setSortOrder('asc'); // Cambia a ascendente
      }
    } else {
      setSortBy(column);
      setSortOrder('asc'); // Nuevo campo, empieza en ascendente
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalReservations / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Todas las Reservas</h2>
      <div className="filter-container">
        <label>Fecha Inicio:</label>
        <input type="date" value={startDate} onChange={handleStartDateChange} />
        <label>Fecha Fin:</label>
        <input type="date" value={endDate} onChange={handleEndDateChange} />
      </div>
      <ReservationsTable
        reservations={reservations}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      <div className="pagination-controls">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>Página {currentPage} de {Math.ceil(totalReservations / pageSize)}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(totalReservations / pageSize)}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Apartments;