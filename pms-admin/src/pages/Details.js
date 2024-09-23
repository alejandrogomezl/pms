import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';

const Details = () => {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchReservationDetails();
  }, [reservationId]);

  const fetchReservationDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/reservations/${reservationId}`);
      setReservation(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los detalles de la reserva:', error);
    }
  };

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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/reservations/${reservationId}`);
      alert('Reserva eliminada correctamente');
      navigate('/reservations');
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
    }
  };

  const handleCreateBill = () => {
    navigate(`/bill/${reservationId}`);
  };

  const handleChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  if (loading) {
    return <p className="text-center">Cargando...</p>;
  }

  if (!reservation) {
    return <p className="text-center">No se encontraron detalles de la reserva.</p>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="text-center mb-4">Detalles de la Reserva</h2>

          {isEditing ? (
            <form onSubmit={handleEdit} className="mt-3">
              <div className="mb-3">
                <label>Nombre</label>
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      name="firstName"
                      value={reservation.firstName}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      name="lastName"
                      value={reservation.lastName}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label>Fecha de Llegada</label>
                <input
                  type="date"
                  name="startDate"
                  value={new Date(reservation.startDate).toISOString().substring(0, 10)}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Fecha de Salida</label>
                <input
                  type="date"
                  name="endDate"
                  value={new Date(reservation.endDate).toISOString().substring(0, 10)}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Guardar Cambios</button>
            </form>
          ) : (
            <div className="mt-3">
              <p><strong>ID de Reserva:</strong> {reservation.reservationId}</p>
              <p><strong>Nombre:</strong> {reservation.firstName} {reservation.lastName}</p>
              <p><strong>Fecha de Llegada:</strong> {new Date(reservation.startDate).toLocaleDateString()}</p>
              <p><strong>Fecha de Salida:</strong> {new Date(reservation.endDate).toLocaleDateString()}</p>
              <p><strong>Teléfono:</strong> {reservation.phoneNumber}</p>
              <p><strong>DNI:</strong> {reservation.dni}</p>
              <p><strong>Plataforma:</strong> {reservation.platform}</p>
              <p><strong>Apartamento:</strong> {reservation.apartmentId.name}</p>
              <div className="d-flex justify-content-between mt-4">
                <button onClick={() => setIsEditing(true)} className="btn btn-primary me-2">
                  <FontAwesomeIcon icon={faEdit} /> Editar
                </button>
                <button onClick={handleShowDeleteModal} className="btn btn-danger me-2">
                  <FontAwesomeIcon icon={faTrash} /> Eliminar
                </button>
                <button onClick={handleCreateBill} className="btn btn-secondary">
                  <FontAwesomeIcon icon={faFileInvoice} /> Crear Factura
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmación para Eliminar */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta reserva?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Details;
