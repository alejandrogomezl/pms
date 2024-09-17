import React from 'react';
import { BrowserRouter as Router, Route, Routes, UNSAFE_DataRouterStateContext } from 'react-router-dom';
import Navbar from './components/Navbar';
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
        <Route path="/details/:reservationId" element={<Details />} /> {/* Ruta para la página de detalles */}
        <Route path="/bill/:reservationId" element={<BillPage />} /> {/* Ruta para la factura */}
        <Route path="/calendar" element={<CalendarPage />} /> {/* Ruta para el calendario */}
        {/* Añadir las rutas para Documentos, Acceso y Configuración */}
      </Routes>
    </Router>
  );
}

export default App;
