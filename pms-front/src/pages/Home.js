import React, { useState } from 'react';
import axios from 'axios';
import DateSelector from '../components/DateSelector';
import ApartmentList from '../components/ApartmentList';
import NavBar from '../components/NavBar';

const Home = () => {
  const [apartments, setApartments] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalPrices, setTotalPrices] = useState({}); // Guardar precios totales por apartamento
  const [nightCounts, setNightCounts] = useState({}); // Guardar número de noches por apartamento

  const handleDatesChange = async (dates) => {
    try {
      // Obtener apartamentos disponibles para las fechas seleccionadas
      const response = await axios.get('http://localhost:3000/api/apartments', {
        params: {
          startDate: dates.startDate,
          endDate: dates.endDate,
        }
      });

      const fetchedApartments = response.data;
      setApartments(fetchedApartments);

      const priceCalculations = {};
      const nightCalculations = {};

      for (const apartment of fetchedApartments) {
        const priceResponse = await axios.get(`http://localhost:3000/api/prices/get-total-price/${apartment._id}`, {
          params: {
            startDate: dates.startDate,
            endDate: dates.endDate
          }
        });

        const { totalPrice, diffNights } = priceResponse.data;
        priceCalculations[apartment._id] = totalPrice;
        nightCalculations[apartment._id] = diffNights; // Guardar el número de noches
      }

      setTotalPrices(priceCalculations); // Guardar los precios totales
      setNightCounts(nightCalculations); // Guardar el número de noches

    } catch (error) {
      console.error('Error fetching apartments or prices:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <DateSelector isSubmittedProp={isSubmitted} onDatesChange={handleDatesChange} />
      {isSubmitted && <ApartmentList apartments={apartments} totalPrices={totalPrices} nightCounts={nightCounts} />}
      <ApartmentList apartments={apartments} totalPrices={totalPrices} nightCounts={nightCounts} />
    </div>
  );
};

export default Home;