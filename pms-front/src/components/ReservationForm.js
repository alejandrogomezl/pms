import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ReservationForm.scss';

const ReservationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [documentType, setDocumentType] = useState('DNI'); // Estado para el tipo de documento
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3000/api/apartments/${id}`)
      .then(response => {
        setApartment(response.data);
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
        address,
        country,
        postalCode,
        phoneNumber,
        documentType, // Agrega el tipo de documento en la solicitud
        dni,
        email
      });
      setBookingStatus('Reservation successful');
      setTimeout(() => navigate('/'), 2000); 
    } catch (error) {
      setBookingStatus('Failed to make reservation: ' + (error.response?.data?.error || error.message));
      console.error('Reservation error:', error);
    }
  };

  if (!apartment) return <div>Loading...</div>;

  return (
    <div className="reservation-form-container">
      <div className="apartment-info">
        <img src={apartment.imageUrl} alt={apartment.name} className="apartment-image" />
        <div className="apartment-details">
          <h2>{apartment.name}</h2>
          <p>Desde {startDate || "dd/mm/yyyy"} hasta {endDate || "dd/mm/yyyy"} | {apartment.nights || "x"} noches</p>
          <div className="apartment-price">
            <span>{apartment.price.toFixed(2)} €</span>
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
