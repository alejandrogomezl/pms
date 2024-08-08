import React, { useState } from 'react';

const DateSelector = ({ onDatesChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDatesChange({ startDate, endDate });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Start Date:
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </label>
      <label>
        End Date:
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </label>
      <button type="submit">Search</button>
    </form>
  );
};

export default DateSelector;