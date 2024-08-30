import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApartmentList from '../components/ApartmentList'; // Asegúrate de que la ruta es correcta
import '../css/ApartmentsPage.scss'; // Asegúrate de que la ruta es correcta
import CreateApartmentButton from '../components/CreateApartmentButton';

const ApartmentsPage = () => {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/apartments/all');
      setApartments(response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  return (
    <div className="apartments-page">
      <h1>Available Apartments</h1>
      <CreateApartmentButton /> {/* Añade el botón aquí */}
      <ApartmentList apartments={apartments} />
    </div>
  );
};

export default ApartmentsPage;
