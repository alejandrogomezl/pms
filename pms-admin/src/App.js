import React from 'react';
import { BrowserRouter as Router, Route, Routes, UNSAFE_DataRouterStateContext } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ApartmentsPage from './pages/ApartmentsPage';
import ApartmentReservationsPage from './pages/ApartmentReservationPage';
import EditApartmentPage from './pages/EditApartmentPage';
import CreateApartmentPage from './pages/CreateApartmenPage';

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
        < Route path="/reservations/:apartmentId" Component={ApartmentReservationsPage} />
        < Route path="/edit/:id" Component={EditApartmentPage} />
        < Route path="/create-apartment" element={<CreateApartmentPage />} />
        {/* Añadir las rutas para Documentos, Acceso y Configuración */}
      </Routes>
    </Router>
  );
}

export default App;
