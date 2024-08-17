import React, { useState } from 'react';
import '../css/DateSelector.scss';

const DateSelector = ({ onDatesChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Estado para controlar la visualización

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onDatesChange({ startDate, endDate });
    setIsSubmitted(true); // Establecer como enviado
  };

  // Renderizar como barra de navegación si isSubmitted es true
  if (isSubmitted) {
    return (
    <div className="date-selector-nav">
    <label htmlFor="startDate" className="form-label">Fecha Llegada:
    <input type="date" className="form-control date-input" id="startDate" value={startDate} onChange={handleStartDateChange} />
    </label>
    <label htmlFor="endDate" className="form-label">Fecha Salida:
    <input type="date" className="form-control date-input" id="endDate" value={endDate} onChange={handleEndDateChange} />
    </label>
    <button type="submit" className="search-button">Buscar</button>
    </div>
    );
  }

  // Formulario normal si no se ha enviado
  return (
    <div className="date-selector-container">
      <form onSubmit={handleSubmit} className="date-form">
        <label htmlFor="startDate" className="form-label">Start Date:</label>
        <input
          type="date"
          className="form-control date-input"
          id="startDate"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <label htmlFor="endDate" className="form-label">End Date:</label>
        <input
          type="date"
          className="form-control date-input"
          id="endDate"
          value={endDate}
          onChange={handleEndDateChange}
        />
        <button type="submit" className="search-button">Buscar</button>
      </form>
    </div>
  );
};

export default DateSelector;
