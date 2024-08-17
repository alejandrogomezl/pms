import React, { useState, useEffect } from 'react';
import '../css/DateSelector.scss';

const DateSelector = ({ onDatesChange, isSubmittedProp }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onDatesChange({ startDate, endDate });
    setIsSubmitted(true);
  };

  // Utilizar el estado pasado por props si existe
  useEffect(() => {
    if (isSubmittedProp !== undefined) {
      setIsSubmitted(isSubmittedProp);
    }
  }, [isSubmittedProp]);

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
