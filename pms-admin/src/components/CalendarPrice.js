import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importar la localización de moment en español
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

const ReusableCalendar = ({ events, view, onEventSelect, onDateChange }) => {
  // Aquí puedes agregar la lógica de estilo para cada evento si deseas personalizar la apariencia
  const eventStyleGetter = (event) => {
    const backgroundColor = event.backgroundColor || '#3174ad';
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '8px',
      padding: '6px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
      textAlign: 'center',
    };
    return {
      style: style,
    };
  };

  return (
    <div className="container mt-5">
      <div style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={events} // Pasar los eventos
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}
          eventPropGetter={eventStyleGetter}
          views={['week']}
          defaultView={view || "month"} // Vista predeterminada en mes o la vista pasada por props
          step={1440}
          timeslots={1}
          showMultiDayTimes={false}
          dayLayoutAlgorithm="no-overlap"
          messages={messages} // Añadir los mensajes personalizados en español
          onSelectEvent={onEventSelect} // Función cuando se selecciona un evento
          onNavigate={onDateChange} // Función cuando se cambia de fecha
        />
      </div>
    </div>
  );
};

export default ReusableCalendar;
