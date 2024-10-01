import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReservationsTable from '../components/ReservationsTable';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

const ReservationsInd = () => {
  const { apartmentId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalReservations, setTotalReservations] = useState(0);
  const [apartment, setApartment] = useState(null); // Nuevo estado para almacenar la información del apartamento

  useEffect(() => {
    if (apartmentId) {
      fetchApartmentInfo();
    }
    fetchReservations();
  }, [apartmentId, startDate, endDate, sortBy, sortOrder, currentPage]);

  // Función para obtener la información del apartamento
  const fetchApartmentInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/apartments/${apartmentId}`);
      setApartment(response.data); // Almacena la información del apartamento
    } catch (error) {
      console.error('Error fetching apartment information:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const params = {
        sortBy,
        sortOrder,
        page: currentPage,
        limit: pageSize
      };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (apartmentId) params.apartmentId = apartmentId;

      const response = await axios.get('http://localhost:3000/api/reservations', { params });

      setReservations(response.data.reservations);
      setTotalReservations(response.data.totalReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleSort = (column) => {
    if (['reservationId', 'firstName', 'startDate', 'endDate', 'apartmentId'].includes(column)) {
      setSortBy(column);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalReservations / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{apartment ? `Reservas - ${apartment.name}` : 'Cargando...'}</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="startDate">Fecha Inicio:</label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="endDate">Fecha Fin:</label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <ReservationsTable
        reservations={reservations}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {Math.ceil(totalReservations / pageSize)}</span>
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalReservations / pageSize)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ReservationsInd;
