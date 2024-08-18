import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApartmentList from './components/ApartmentList'; // Suponiendo que tienes un componente para listar apartamentos
import ApartmentDetails from './components/ApartmentDetails';
import ReservationForm from './components/ReservationForm';
import Home from './pages/Home';
import ApartmentDetailsPage from './pages/ApartmentDetailsPage';
import NavBar from './components/NavBar';
import { DateProvider } from './context/DateContext';
//Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';



function App() {
  return (
    <DateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apartments/:id" element={<ApartmentDetailsPage />} />
          <Route path="/" element={<ApartmentList />} />
          <Route path="/apartments/:id" element={<ApartmentDetailsPage />} />
          <Route path="/reserve/:id" element={<ReservationForm />} />
        </Routes>
      </Router>
    </DateProvider>
  );
}

export default App;