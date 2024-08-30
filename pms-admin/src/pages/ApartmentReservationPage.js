// src/pages/ReservationsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationsTable from '../components/ReservationsTable';
import '../css/Dashboard.scss'; // Usamos el CSS del Dashboard

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('startDate'); // Campo por defecto
  const [sortOrder, setSortOrder] = useState('asc'); // Orden por defecto

  useEffect(() => {
    fetchReservations();
  }, [startDate, endDate, sortBy, sortOrder]);

  const fetchReservations = async () => {
    try {
      const apiUrl = 'http://localhost:3000/api/reservations/res';

      const params = {
        sortBy,
        sortOrder,
      };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('Fetching reservations with params:', params);

      const response = await axios.get(apiUrl, { params });
      setReservations(response.data.reservations);
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
    if (sortBy === column) {
      // Si ya estamos ordenando por esta columna, invertir el orden
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Si no, ordenar por la nueva columna en orden ascendente
      setSortBy(column);
      setSortOrder('asc');
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
        ojete='hola'
        // No se pasan los argumentos a la función del componente
      />
    </div>
  );
};

export default ReservationsPage;
