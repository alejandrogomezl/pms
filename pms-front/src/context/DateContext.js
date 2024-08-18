import React, { createContext, useState } from 'react';

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [selectedDates, setSelectedDates] = useState({
    startDate: '',
    endDate: ''
  });

  return (
    <DateContext.Provider value={{ selectedDates, setSelectedDates }}>
      {children}
    </DateContext.Provider>
  );
};
