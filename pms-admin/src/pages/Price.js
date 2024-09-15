import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CalendarPrice from '../components/CalendarPrice';
import PriceList from '../components/PriceList';
import '../css/ToggleSwitch.scss'; // Archivo CSS para el toggle switch
import '../css/Price.scss'; // Archivo CSS para la página de precios

const Price = () => {
  const { apartmentId } = useParams();
  const [events, setEvents] = useState([]);
  const [apartment, setApartment] = useState(null);
  const [prices, setPrices] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // Estado para controlar la vista (tabla o calendario)

  useEffect(() => {
    if (apartmentId) {
      fetchApartmentInfo();
      fetchPrices();
    }
  }, [apartmentId]);

  const fetchApartmentInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/apartments/${apartmentId}`);
      setApartment(response.data);
    } catch (error) {
      console.error('Error al obtener la información del apartamento:', error);
    }
  };

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

      setEvents(events);
      setPrices(prices);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const toggleViewMode = () => {
    setViewMode(prevMode => (prevMode === 'table' ? 'calendar' : 'table'));
  };

  return (
    <div>
      <h2>{apartment ? `Precio del Apartamento - ${apartment.name}` : 'Cargando...'}</h2>

      {/* Toggle Switch para cambiar entre la vista de tabla y calendario */}
      <label className="switch">
        <input type="checkbox" onChange={toggleViewMode} checked={viewMode === 'calendar'} />
        <span className="slider round"></span>
      </label>
      <span>{viewMode === 'table' ? 'Tabla' : 'Calendario'}</span>

      {viewMode === 'table' ? (
        <PriceList prices={prices} apartmentId={apartmentId} onPriceAdded={fetchPrices} />
      ) : (
        <CalendarPrice events={events} />
      )}
    </div>
  );
};

export default Price;
