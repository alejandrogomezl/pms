import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importar la localización de moment en español
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import '../css/Calendar.scss';

// Configurar moment para usar español
moment.locale('es');

// Crear el localizer en español
const localizer = momentLocalizer(moment);

// Mensajes personalizados en español para el calendario
const messages = {
  next: 'Siguiente',
  previous: 'Anterior',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango',
};

const CalendarPage = () => {
  const [reservations, setReservations] = useState([]);
  const [apartmentColors, setApartmentColors] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('week');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  // Obtener reservas del backend
  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/reservations');
      const fetchedReservations = response.data;

      const colors = assignColors(fetchedReservations);
      setApartmentColors(colors);

      const events = fetchedReservations.map((reservation) => ({
        title: `${reservation.firstName} ${reservation.lastName} - ${reservation.apartmentId?.name || 'N/A'}`,
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
        apartmentId: reservation.apartmentId._id,
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
        colors[apartmentId] = getColorFromHash(apartmentId);
      }
    });
    return colors;
  };

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const getColorFromHash = (str) => {
    const hash = hashString(str);
    const color = '#' + ((hash >> 24) & 0xFF).toString(16).padStart(2, '0') +
      ((hash >> 16) & 0xFF).toString(16).padStart(2, '0') +
      ((hash >> 8) & 0xFF).toString(16).padStart(2, '0');
    return color;
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = apartmentColors[event.apartmentId] || '#3174ad';
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style: style,
    };
  };

  const handleSelectEvent = (event) => {
    navigate(`/details/${event.reservationId}`);
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <h2>Calendario de Reservas</h2>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="date-picker">Seleccionar Fecha: </label>
        <input 
          type="date" 
          id="date-picker" 
          value={moment(selectedDate).format('YYYY-MM-DD')} 
          onChange={handleDateChange} 
        />
      </div>
      <Calendar
        localizer={localizer}
        events={reservations}
        startAccessor="start"
        endAccessor="end"
        date={selectedDate}
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        views={['week', 'month']}
        defaultView={Views.WEEK}
        step={1440}
        timeslots={1}
        showMultiDayTimes={false}
        dayLayoutAlgorithm="no-overlap"
        onSelectEvent={handleSelectEvent}
        messages={messages} // Añadir los mensajes personalizados en español
      />
    </div>
  );
};

export default CalendarPage;
