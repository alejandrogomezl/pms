import React, { useState, useContext, useEffect } from 'react';
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

  const [fields, setFields] = useState([]); // Para almacenar los campos obtenidos desde la API
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    country: '',
    postalCode: '',
    phoneNumber: '',
    documentType: 'DNI',
    dni: '',
    email: ''
  });

  const [bookingStatus, setBookingStatus] = useState('');

  // Obtener campos de reserva desde la API
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/reservation-fields');
        setFields(response.data); // Asignar campos de reserva desde la API
      } catch (error) {
        console.error('Error fetching reservation fields:', error);
      }
    };
    fetchFields();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/reservations', {
        apartmentId: id,
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate,
        ...formData,
        price: totalPrice
      });
      setBookingStatus('Reservation successful');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setBookingStatus('Failed to make reservation: ' + (error.response?.data?.error || error.message));
      console.error('Reservation error:', error);
    }
  };

  return (
    <div className="reservation-form-container container">
      <div className="apartment-info mb-4">
        <img src={location.state?.imageUrl || ''} alt={location.state?.name || ''} className="apartment-image" />
        <div className="apartment-details">
          <h2>{location.state?.name || 'Apartamento'}</h2>
          <p>
            Desde {selectedDates.startDate || 'dd/mm/yyyy'} hasta {selectedDates.endDate || 'dd/mm/yyyy'} | {nightCount || 'x'} noches
          </p>
          <div className="apartment-price">
            <span>Total: {totalPrice !== undefined ? `${totalPrice.toFixed(2)} €` : 'Calculando...'}</span>
          </div>
        </div>
      </div>

      <form className="reservation-form" onSubmit={handleReservation}>
        <div className="row">
          {/* Generar dinámicamente los campos obtenidos desde la API */}
          {fields.map((field) => (
            <div className="col-md-4 mb-3" key={field._id}>
              <label htmlFor={field.name} className="form-label">{field.name}:</label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                className="form-control"
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
        </div>

        {/* Added mt-4 for margin-top to create space between the fields and the button */}
        <div className="form-row mt-4">
          <button type="submit" className="reserve-button btn btn-primary">Ir al pago</button>
        </div>

        {bookingStatus && <p className="booking-status">{bookingStatus}</p>}
      </form>
    </div>
  );
};

export default ReservationForm;
