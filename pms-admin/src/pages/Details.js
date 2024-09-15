import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Details.scss'; // Importa el archivo CSS que ya hemos creado

const Details = () => {
  const { reservationId } = useParams(); // Obtener reservationId de la URL
  const [reservation, setReservation] = useState(null); // Estado para almacenar los detalles de la reserva
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar la edición
  const navigate = useNavigate(); // Para redirigir después de eliminar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservationDetails(); // Obtener los detalles de la reserva al cargar la página
  }, [reservationId]);

  // Función para obtener los detalles de la reserva
  const fetchReservationDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/reservations/${reservationId}`);
      setReservation(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los detalles de la reserva:', error);
    }
  };

  // Función para manejar la edición de la reserva
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/reservations/${reservationId}`, reservation);
      setIsEditing(false);
      alert('Reserva actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
    }
  };

  // Función para manejar la eliminación de la reserva
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/reservations/${reservationId}`);
      alert('Reserva eliminada correctamente');
      navigate('/reservations'); // Redirigir a la lista de reservas
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
    }
  };

  // Función para manejar la creación de la factura
  const handleCreateBill = () => {
    navigate(`/bill/${reservationId}`); // Redirigir a la página de facturación
  };

  // Manejo del estado de los campos para la edición
  const handleChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <p className="loading-message">Cargando...</p>;
  }

  if (!reservation) {
    return <p className="loading-message">No se encontraron detalles de la reserva.</p>;
  }

  return (
    <div className="details-container">
      <h2>Detalles de la Reserva</h2>
      {isEditing ? (
        <form onSubmit={handleEdit} className="details-form">
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="firstName"
              value={reservation.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              value={reservation.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Fecha de Llegada:</label>
            <input
              type="date"
              name="startDate"
              value={new Date(reservation.startDate).toISOString().substring(0, 10)}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Fecha de Salida:</label>
            <input
              type="date"
              name="endDate"
              value={new Date(reservation.endDate).toISOString().substring(0, 10)}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      ) : (
        <div className="details-info">
          <p><strong>ID de Reserva:</strong> {reservation.reservationId}</p>
          <p><strong>Nombre:</strong> {reservation.firstName} {reservation.lastName}</p>
          <p><strong>Fecha de Llegada:</strong> {new Date(reservation.startDate).toLocaleDateString()}</p>
          <p><strong>Fecha de Salida:</strong> {new Date(reservation.endDate).toLocaleDateString()}</p>
          <p><strong>Apartamento:</strong> {reservation.apartmentId.name}</p>
          <button onClick={() => setIsEditing(true)}>Editar</button>
          <button onClick={handleDelete} className="delete-button">
            Eliminar Reserva
          </button>
          <button onClick={handleCreateBill}>
            Crear Factura
          </button>
        </div>
      )}
    </div>
  );
};

export default Details;
