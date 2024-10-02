import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import logo from '../img/logo.png'; // Importa la imagen local


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

    
    // Convertir imagen local a base64 y añadirla al PDF
    const img = new Image();
    img.src = logo; // Importamos la imagen
    img.onload = () => {
      doc.addImage(img, 'PNG', 65, 26, 80, 20); // Añadir la imagen al PDF tras cargarse
  
      // Continuar con el resto del contenido del PDF solo después de cargar la imagen
      // Datos de la factura
      doc.setFont('helvetica', 'bold');
      doc.text('FACTURA', 14, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nº: ${reservation.reservationId || '----'}`, 14, 66);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 72);
  
      // Detalles de la reserva
      doc.setFont('helvetica', 'bold');
      doc.text('Reserva:', 14, 84);
      doc.text('Habitación:', 14, 90);
      doc.text('Nombre:', 14, 96);
      doc.text('DNI:', 14, 102);
      doc.setFont('helvetica', 'normal');
      doc.text(`${reservation.apartmentId.name || '----'}`, 45, 90);
      doc.text(`${reservation.firstName} ${reservation.lastName}`, 45, 96);
      doc.text(`${reservation.dni || '----'}`, 45, 102);
  
      // Fechas de entrada y salida
      doc.setFont('helvetica', 'bold');
      doc.text('Alojamiento', 14, 112);
      doc.setLineWidth(0.5);
      doc.line(14, 115, 200, 115);
      doc.setFont('helvetica', 'normal');
      doc.text(`Entrada: ${new Date(reservation.startDate).toLocaleDateString()}`, 14, 122);
      doc.text(`Salida: ${new Date(reservation.endDate).toLocaleDateString()}`, 14, 128);
  
      // Precio y otros detalles
      const itemHeight = 138;
      doc.text('Total días:', 14, itemHeight);
      doc.text('2', 45, itemHeight);
      doc.text(`Total: €${calculateTotal(reservation)}`, 45, itemHeight + 6);
  
      // Total final
      doc.setFont('helvetica', 'bold');
      doc.text('Total factura:', 14, itemHeight + 30);
      doc.text(`€${calculateTotal(reservation)}`, 45, itemHeight + 30);
  
      // IVA
      const vat = (calculateTotal(reservation) * 0.045).toFixed(2); // 4.5% VAT
      doc.text(`IVA (4.5%): €${vat}`, 14, itemHeight + 36);
  
      // Total con IVA
      const totalWithVAT = (calculateTotal(reservation) + parseFloat(vat)).toFixed(2);
      doc.text(`Total con IVA: €${totalWithVAT}`, 14, itemHeight + 42);
  
      // Mensaje de despedida
      doc.setFont('helvetica', 'bold');
      doc.text('Gracias por su visita.', 105, 290, null, null, 'center');
  
      // Guardar el PDF con un nombre personalizado
      doc.save(`factura_reserva_${reservation.reservationId || 'sin_id'}.pdf`);
    };
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
