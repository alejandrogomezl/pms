import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BillPage = () => {
  const { reservationId } = useParams(); // Obtener reservationId de la URL
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    fetchReservation();
  }, [reservationId]);

  // Obtener la reserva desde el backend
  const fetchReservation = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/reservations/${reservationId}`);
      setReservation(response.data);
    } catch (error) {
      console.error('Error al obtener los detalles de la reserva:', error);
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
    // Ejemplo simple: calcular el número de noches multiplicado por el precio del apartamento
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Diferencia de fechas en días

    const pricePerNight = 100; // Asumiendo un precio por noche fijo o puedes calcularlo
    return nights * pricePerNight;
  };

  if (!reservation) {
    return <p>Cargando detalles de la reserva...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Factura para la reserva: {reservation.firstName} {reservation.lastName}</h2>
      <p><strong>ID de Reserva:</strong> {reservation.reservationId}</p>
      <p><strong>Nombre:</strong> {reservation.firstName} {reservation.lastName}</p>
      <p><strong>Teléfono:</strong> {reservation.phoneNumber}</p>
      <p><strong>DNI:</strong> {reservation.dni}</p>
      <p><strong>Fecha de Llegada:</strong> {new Date(reservation.startDate).toLocaleDateString()}</p>
      <p><strong>Fecha de Salida:</strong> {new Date(reservation.endDate).toLocaleDateString()}</p>
      <p><strong>Apartamento:</strong> {reservation.apartmentId.name}</p>
      <p><strong>Total:</strong> €{calculateTotal(reservation)}</p>

      <button onClick={generatePDF} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Descargar PDF
      </button>
    </div>
  );
};

export default BillPage;
