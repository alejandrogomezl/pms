import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Importamos useLocation
import '../css/ReservationForm.scss';
import { DateContext } from '../context/DateContext';

const ReservationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Obtenemos el state pasado por la navegación
  const { selectedDates } = useContext(DateContext);

  // Obtenemos los datos pasados desde la navegación (precio total y número de noches)
  const { totalPrice, nightCount, imageUrl, name } = location.state || {};
  console.log('location.state:', location.state);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [documentType, setDocumentType] = useState('DNI');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const price = totalPrice;

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/reservations', {
        apartmentId: id,
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate,
        firstName,
        lastName,
        address,
        country,
        postalCode,
        phoneNumber,
        documentType,
        dni,
        email,
        price
      });
      setBookingStatus('Reservation successful');
      setTimeout(() => navigate('/'), 2000); 
    } catch (error) {
      setBookingStatus('Failed to make reservation: ' + (error.response?.data?.error || error.message));
      console.error('Reservation error:', error);
    }
  };
  return (
    <div className="reservation-form-container">
      <div className="apartment-info">
        <img src={location.state?.imageUrl || ''} alt={location.state?.name || ''} className="apartment-image" />
        <div className="apartment-details">
          <h2>{location.state?.name || 'Apartamento'}</h2>
          <p>Desde {selectedDates.startDate || "dd/mm/yyyy"} hasta {selectedDates.endDate || "dd/mm/yyyy"} | {nightCount || 'x'} noches</p>
          <div className="apartment-price">
            <span>Total: {totalPrice !== undefined ? `${totalPrice.toFixed(2)} €` : 'Calculando...'}</span>
          </div>
        </div>
      </div>
      <form className="reservation-form" onSubmit={handleReservation}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">Nombre:</label>
            <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Apellidos:</label>
            <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">Dirección:</label>
            <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="country">País:</label>
            <input type="text" id="country" value={country} onChange={e => setCountry(e.target.value)} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="postalCode">Código Postal:</label>
            <input type="text" id="postalCode" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Nº Teléfono:</label>
            <input type="tel" id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="documentType">Tipo de Documento:</label>
            <select id="documentType" value={documentType} onChange={e => setDocumentType(e.target.value)} required>
              <option value="DNI">DNI</option>
              <option value="NIE">NIE</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dni">Nº Documento:</label>
            <input type="text" id="dni" value={dni} onChange={e => setDni(e.target.value)} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="form-row">
          <button type="submit" className="reserve-button">Ir al pago</button>
        </div>
        {bookingStatus && <p className="booking-status">{bookingStatus}</p>}
      </form>
    </div>
  );
};

export default ReservationForm;
