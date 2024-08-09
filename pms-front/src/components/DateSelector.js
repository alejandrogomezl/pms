import React, { useState } from 'react';
import '../DateSelector.css';  // Asegúrate de tener este archivo CSS en la misma carpeta

const DateSelector = ({ onDatesChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onDatesChange({ startDate, endDate });
  };

  return (
    <div className="date-selector-container">  {/* Clase de contenedor para centrar */}
      <form onSubmit={handleSubmit} className="date-form">
        <label htmlFor="startDate" className="form-label">Start Date:</label>
        <input type="date" className="form-control date-input" id="startDate" value={startDate} onChange={handleStartDateChange} />
        <label htmlFor="endDate" className="form-label">End Date:</label>
        <input type="date" className="form-control date-input" id="endDate" value={endDate} onChange={handleEndDateChange} />
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default DateSelector;
