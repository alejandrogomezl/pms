import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationsTable from '../components/ReservationsTable';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalReservations, setTotalReservations] = useState(0);

  useEffect(() => {
    fetchReservations();
  }, [startDate, endDate, sortBy, sortOrder, currentPage]);

  const fetchReservations = async () => {
    try {
      const apiUrl = 'http://localhost:3000/api/reservations/res';
      const params = { sortBy, sortOrder, page: currentPage, limit: pageSize };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await axios.get(apiUrl, { params });
      setReservations(response.data.reservations);
      setTotalReservations(response.data.totalReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleSort = (column) => {
    setSortBy(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalReservations / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mt-5">
      {/* Encabezado del Dashboard */}
      <div className="text-center mb-4">
        <h2 className="display-4">Dashboard de Reservas</h2>
        <p className="lead text-muted">Gestión de todas las reservas</p>
      </div>

      {/* Filtros de Fecha */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">Fecha Inicio:</label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="endDate" className="form-label">Fecha Fin:</label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla de Reservas */}
      <ReservationsTable
        reservations={reservations}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      {/* Paginación */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo; Anterior
        </button>
        <span className="text-muted">
          Página {currentPage} de {Math.ceil(totalReservations / pageSize)}
        </span>
        <button
          className="btn btn-outline-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalReservations / pageSize)}
        >
          Siguiente &raquo;
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
