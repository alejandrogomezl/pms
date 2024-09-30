import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReusableCalendar from '../components/CalendarPrice';
import randomColor from 'randomcolor'; // Importa randomcolor
import '../css/Calendar.scss';

const CalendarPage = () => {
  const [reservations, setReservations] = useState([]);
  const [apartmentColors, setApartmentColors] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/reservations');
      const fetchedReservations = response.data;

      // Asignar colores únicos a cada apartamento
      const colors = assignColors(fetchedReservations);
      setApartmentColors(colors);

      const events = fetchedReservations.map((reservation) => ({
        title: `${reservation.firstName} ${reservation.lastName} - ${reservation.apartmentId?.name || 'N/A'}`,
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
        apartmentId: reservation.apartmentId._id,
        backgroundColor: colors[reservation.apartmentId._id],
        allDay: true,
        reservationId: reservation._id
      }));

      setReservations(events);
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  };

  const assignColors = (reservations) => {
    const colors = {};
    reservations.forEach((reservation) => {
      const apartmentId = reservation.apartmentId._id;
      if (!colors[apartmentId]) {
        colors[apartmentId] = generateColor(apartmentId);
      }
    });
    return colors;
  };

  // Usar randomcolor para generar colores únicos y consistentes
  const generateColor = (apartmentId) => {
    return randomColor({
      seed: apartmentId, // Asegura que el color siempre sea el mismo para el mismo apartamento
      luminosity: 'dark', // Esto genera colores claros
      format: 'hex'
    });
  };

  const handleSelectEvent = (event) => {
    navigate(`/details/${event.reservationId}`);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="container mt-5">
      <h2 className="display-4 text-center mb-4">Calendario de Reservas</h2>
      <ReusableCalendar
        events={reservations}
        view="week"
        onEventSelect={handleSelectEvent}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default CalendarPage;
