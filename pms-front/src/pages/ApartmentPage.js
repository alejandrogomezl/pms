// src/pages/ApartmentPage.js
import React from 'react';
import ApartmentDetails from '../components/ApartmentDetails';

const ApartmentPage = ({ match }) => {
  return (
    <div>
      <ApartmentDetails match={match} />
    </div>
  );
};

export default ApartmentPage;