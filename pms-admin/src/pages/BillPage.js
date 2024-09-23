import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';

const BillPage = () => {
  const { reservationId } = useParams(); 
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para mostrar el spinner de carga

  useEffect(() => {
    fetchReservation();
  }, [reservationId]);

  // Obtener la reserva desde el backend
  const fetchReservation = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/reservations/${reservationId}`);
      setReservation(response.data);
      setLoading(false); // Dejar de mostrar el spinner una vez cargado
    } catch (error) {
      console.error('Error al obtener los detalles de la reserva:', error);
      setLoading(false);
    }
  };

  // Función para generar y descargar el PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Añadir el título de la factura
    doc.setFontSize(18);
    doc.text('Factura de Reserva', 14, 22);

    if (reservation) {
      // Información de la reserva
      doc.setFontSize(12);
      doc.text(`Reserva ID: ${reservation.reservationId}`, 14, 32);
      doc.text(`Nombre: ${reservation.firstName} ${reservation.lastName}`, 14, 42);
      doc.text(`Teléfono: ${reservation.phoneNumber}`, 14, 52);
      doc.text(`DNI: ${reservation.dni}`, 14, 62);
      doc.text(`Fecha de Llegada: ${new Date(reservation.startDate).toLocaleDateString()}`, 14, 72);
      doc.text(`Fecha de Salida: ${new Date(reservation.endDate).toLocaleDateString()}`, 14, 82);
      doc.text(`Apartamento: ${reservation.apartmentId.name}`, 14, 92);

      // Total de la factura
      doc.text(`Total: €${calculateTotal(reservation)}`, 14, 102);
    }

    // Guardar el PDF con un nombre personalizado
    doc.save(`factura_reserva_${reservationId}.pdf`);
  };

  // Función para calcular el total de la reserva
  const calculateTotal = (reservation) => {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const pricePerNight = 100; 
    return nights * pricePerNight;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <span className="ms-2">Cargando detalles de la reserva...</span>
      </div>
    );
  }

  if (!reservation) {
    return <p>No se encontraron detalles de la reserva.</p>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
        <h2 className="text-center mb-4">Factura para la reserva: {reservation.reservationId}</h2>
          <p><strong>ID de Reserva:</strong> {reservation.reservationId}</p>
          <p><strong>Nombre:</strong> {reservation.firstName} {reservation.lastName}</p>
          <p><strong>Teléfono:</strong> {reservation.phoneNumber}</p>
          <p><strong>DNI:</strong> {reservation.dni}</p>
          <p><strong>Fecha de Llegada:</strong> {new Date(reservation.startDate).toLocaleDateString()}</p>
          <p><strong>Fecha de Salida:</strong> {new Date(reservation.endDate).toLocaleDateString()}</p>
          <p><strong>Apartamento:</strong> {reservation.apartmentId.name}</p>
          <p><strong>Total:</strong> €{calculateTotal(reservation)}</p>
        </div>
        <div className="card-footer text-end">
          <button 
            onClick={generatePDF} 
            className="btn btn-success"
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillPage;
