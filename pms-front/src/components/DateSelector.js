import React, { useState, useEffect, useContext } from 'react';
import { DateContext } from '../context/DateContext';
import '../css/DateSelector.scss';

const DateSelector = ({ isSubmittedProp, onDatesChange }) => {
  const { selectedDates, setSelectedDates } = useContext(DateContext);
  const [startDate, setStartDate] = useState(selectedDates.startDate || '');
  const [endDate, setEndDate] = useState(selectedDates.endDate || '');
  const [isSubmitted, setIsSubmitted] = useState(isSubmittedProp || false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedDates({ startDate, endDate });
  }, [startDate, endDate, setSelectedDates]);

  // Obtén la fecha de hoy para usarla en las restricciones de fechas
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Por favor, selecciona ambas fechas.');
    } else if (endDate < startDate) {
      setError('La fecha de salida no puede ser anterior a la fecha de llegada.');
    } else {
      setError('');
      setIsSubmitted(true);
      // Solo llamamos a onDatesChange si es una función
      if (typeof onDatesChange === 'function') {
        onDatesChange({ startDate, endDate });
      }
    }
  };

  useEffect(() => {
    if (isSubmittedProp !== undefined) {
      setIsSubmitted(isSubmittedProp);
    }
  }, [isSubmittedProp]);

  return (
    <div className={isSubmitted ? "date-selector-nav" : "date-selector-container"}>
      <form onSubmit={handleSubmit} className={isSubmitted ? "date-form-nav" : "date-form"}>
        <label htmlFor="startDate" className="form-label">Fecha Llegada:</label>
        <input
          type="date"
          className="form-control date-input"
          id="startDate"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            if (endDate && e.target.value > endDate) {
              setEndDate(''); // Limpiar el endDate si se selecciona una startDate mayor
            }
          }}
          min={today} // No permitir seleccionar fechas pasadas
        />
        <label htmlFor="endDate" className="form-label">Fecha Salida:</label>
        <input
          type="date"
          className="form-control date-input"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || today} // El endDate no puede ser anterior al startDate
        />
        <button type="submit" className="search-button">Buscar</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default DateSelector;