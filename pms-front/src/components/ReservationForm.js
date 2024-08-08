import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ReservationForm = () => {
  const { id } = useParams(); // Obtener el ID del apartamento desde la URL
  const navigate = useNavigate();
  const [apartmentName, setApartmentName] = useState(''); // Estado para almacenar el nombre del apartamento
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dni, setDni] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    // Cargar el nombre del apartamento al cargar el componente
    axios.get(`http://localhost:3000/api/apartments/${id}`)
      .then(response => {
        setApartmentName(response.data.name); // Asegúrate de que el backend envíe el nombre con la clave 'name'
      })
      .catch(error => console.error('Failed to fetch apartment details:', error));
  }, [id]);

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/reservations', {
        apartmentId: id,
        startDate,
        endDate,
        firstName,
        lastName,
        phoneNumber,
        dni
      });
      setBookingStatus('Reservation successful');
      setTimeout(() => navigate('/'), 2000); // Redirige de vuelta a la lista de apartamentos o a una página de éxito
    } catch (error) {
      setBookingStatus('Failed to make reservation: ' + (error.response?.data?.error || error.message));
      console.error('Reservation error:', error);
    }
  };

  return (
    <div>
      <h2>Reservation Form for {apartmentName || 'Apartment'}</h2> {/* Usar el nombre del apartamento o un valor por defecto */}
      <form onSubmit={handleReservation}>
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        
        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
        
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input type="tel" id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
        
        <label htmlFor="dni">DNI:</label>
        <input type="text" id="dni" value={dni} onChange={e => setDni(e.target.value)} required />
        
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        
        <label htmlFor="endDate">End Date:</label>
        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        
        <button type="submit">Reserve</button>
      </form>
      {bookingStatus && <p>{bookingStatus}</p>}
    </div>
  );
};

export default ReservationForm;
