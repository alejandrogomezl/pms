import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PriceList from '../components/PriceList';
import 'bootstrap/dist/css/bootstrap.min.css';

const Price = () => {
  const { apartmentId } = useParams();
  const [apartment, setApartment] = useState(null);
  const [prices, setPrices] = useState([]);

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

      setPrices(response.data.prices);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{apartment ? `Precios del Apartamento - ${apartment.name}` : 'Cargando...'}</h2>
      <PriceList prices={prices} apartmentId={apartmentId} onPriceAdded={fetchPrices} />
    </div>
  );
};

export default Price;
