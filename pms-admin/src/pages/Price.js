import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from '../components/CalendarPrice'; // Importar el componente de calendario
import moment from 'moment';

const Price = () => {
  const { apartmentId } = useParams(); // Obtener la ID del apartamento desde la URL
  const [apartmentName, setApartmentName] = useState(''); // Estado para el nombre del apartamento
  const [events, setEvents] = useState([]); // Eventos del calendario (incluyendo precios)
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado para editar

  useEffect(() => {
    fetchApartmentDetails(); // Llamar para obtener el nombre del apartamento
    fetchApartmentPrices(); // Llamar para obtener los precios
  }, [apartmentId]);

  const fetchApartmentDetails = async () => {
    try {
      const apiUrl = `http://localhost:3000/api/apartments/${apartmentId}`; // Endpoint para obtener detalles del apartamento
      const response = await axios.get(apiUrl);
      const apartment = response.data.apartment;

      setApartmentName(apartment.name); // Asignar el nombre del apartamento
      console.log("name", apartment.name);
    } catch (error) {
      console.error('Error fetching apartment details:', error);
    }
  };

  const fetchApartmentPrices = async () => {
    try {
      const apiUrl = `http://localhost:3000/api/prices/${apartmentId}`;
      const response = await axios.get(apiUrl);
      const data = response.data.prices;

      // Transformar los datos de la API en el formato que el calendario espera
      const formattedEvents = data.map((priceEntry) => ({
        title: `€${priceEntry.price}`, // Mostramos el precio como título
        start: new Date(priceEntry.date),
        end: new Date(priceEntry.date),
        allDay: true,
        price: priceEntry.price, // Guardamos el precio para la edición
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching apartment prices:', error);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event); // Permitir editar el precio de un evento
  };

  const handlePriceChange = (e) => {
    if (selectedEvent) {
      setSelectedEvent({
        ...selectedEvent,
        price: e.target.value, // Cambiar el precio del evento seleccionado
      });
    }
  };

  const savePriceChange = async () => {
    if (selectedEvent) {
      try {
        const apiUrl = `http://localhost:3000/api/prices/update/${apartmentId}`;
        await axios.post(apiUrl, {
          date: selectedEvent.start,
          price: selectedEvent.price,
        });
        alert('Precio actualizado correctamente');
        setSelectedEvent(null); // Cerrar el formulario de edición
        fetchApartmentPrices(); // Recargar precios
      } catch (error) {
        console.error('Error saving price:', error);
      }
    }
  };

  return (
    <div className="calendar-price-container">
      <h2>Precios de Calendario - {apartmentName}</h2> {/* Mostrar el nombre del apartamento */}
      <Calendar events={events} onSelectEvent={handleSelectEvent} />

      {selectedEvent && (
        <div className="price-editor">
          <h3>Editar precio para {moment(selectedEvent.start).format('DD/MM/YYYY')}</h3>
          <input
            type="number"
            value={selectedEvent.price}
            onChange={handlePriceChange}
            placeholder="Nuevo precio"
          />
          <button onClick={savePriceChange}>Guardar</button>
        </div>
      )}
    </div>
  );
};

export default Price;
