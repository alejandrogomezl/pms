import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/custom.scss';
import { BrowserRouter as Router, Route, Routes, UNSAFE_DataRouterStateContext } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import EditApartmentPage from './pages/EditApartmentPage';
import CreateApartmentPage from './pages/CreateApartmenPage';
import ApartmentsPage from './pages/ApartmentsPage';
import ReservationsInd from './pages/ReservationsInd';
import Price from './pages/Price';
import Details from './pages/Details';
import BillPage from './pages/BillPage';
import CalendarPage from './pages/Calendar';
import Devices from './pages/Devices';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/dashboard" element={<Dashboard />} />*/}
        < Route path="/" element={<Dashboard />} />
        < Route path="/apartments" element={< ApartmentsPage />} />
        < Route path="/documents" element={<h1>Documentos</h1>} />
        < Route path="/access" element={<h1>Acceso</h1>} />
        < Route path="/settings" element={<Settings />} />
        < Route path="/reservations/:apartmentId" Component={ReservationsInd} />
        < Route path="/price/:apartmentId" Component={Price} />
        < Route path="/edit/:id" Component={EditApartmentPage} />
        < Route path="/create-apartment" element={<CreateApartmentPage />} />
        <Route path="/details/:reservationId" element={<Details />} /> 
        <Route path="/bill/:reservationId" element={<BillPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/devices/:apartmentId" element={<Devices />} />
        {/* Añadir las rutas para Documentos, Acceso y Configuración */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
