import React from 'react';
import NavBar from '../components/NavBar';
import DateSelector from '../components/DateSelector';
import ApartmentDetails from '../components/ApartmentDetails';
import '../css/ApartmentDetailsPage.scss';

const ApartmentDetailsPage = ({ apartment, handleReservationClick }) => {
  return (
    <div className="apartment-details-page">
      <NavBar />
      <DateSelector isSubmittedProp={true} /> {/* Pasar isSubmitted como true */}
      <div className="apartment-details-container">
        <ApartmentDetails apartment={apartment} handleReservationClick={handleReservationClick} />
      </div>
    </div>
  );
};

export default ApartmentDetailsPage;
