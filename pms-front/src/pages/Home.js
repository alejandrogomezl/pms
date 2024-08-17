// src/pages/Home.js
import React, { useState } from 'react';
import axios from 'axios';
import DateSelector from '../components/DateSelector';
import ApartmentList from '../components/ApartmentList';
import NavBar from '../components/NavBar';

const Home = () => {
  const [apartments, setApartments] = useState([]);

  const handleDatesChange = async (dates) => {
    try {
      const response = await axios.get('http://localhost:3000/api/apartments', {
        params: {
          startDate: dates.startDate,
          endDate: dates.endDate
        }
      });
      setApartments(response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <DateSelector onDatesChange={handleDatesChange} />
      <ApartmentList apartments={apartments} />
    </div>
  );
};

export default Home;