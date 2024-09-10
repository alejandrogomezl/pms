import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CalendarPrice from '../components/CalendarPrice'; // Importar el componente CalendarPrice

const Price = () => {
  const { apartmentId } = useParams(); // Obtener el apartmentId desde la URL
  const [events, setEvents] = useState([]); // Eventos (precios por día)
  const [apartment, setApartment] = useState(null); // Guardar la información del apartamento
  
  useEffect(() => {
    if (apartmentId) {
      fetchApartmentInfo(); // Obtener la información del apartamento
      fetchPrices(); // Obtener los precios
    }
  }, [apartmentId]);

  // Función para obtener la información del apartamento (nombre, etc.)
  const fetchApartmentInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/apartments/${apartmentId}`);
      setApartment(response.data); // Guardar la información del apartamento
    } catch (error) {
      console.error('Error al obtener la información del apartamento:', error);
    }
  };

  // Función para obtener los precios del apartamento
  const fetchPrices = async () => {
    try {
      const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

      const response = await axios.get(`http://localhost:3000/api/prices/get-prices/${apartmentId}`, {
        params: { startDate, endDate }
      });

      const prices = response.data.prices;

      const events = prices.map(price => ({
        title: `€${price.price}`,
        start: new Date(price.startDate),
        end: new Date(price.endDate),
        allDay: true,
      }));

      setEvents(events); // Guardar los eventos en el estado
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  return (
    <div>
      {/* Mostrar el nombre del apartamento y el precio */}
      <h2>
        {apartment ? `Precio del Apartamento - ${apartment.name}` : 'Cargando...'}
      </h2>
      
      {/* Renderizar el componente CalendarPrice con los precios obtenidos */}
      <CalendarPrice events={events} />
    </div>
  );
};

export default Price;
