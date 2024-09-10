import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const CalendarPrice = ({ events }) => {
  const localizer = momentLocalizer(moment); // Inicializar el localizador de moment

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events} // Pasar los eventos (precios)
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarPrice;
