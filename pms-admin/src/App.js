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
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Ruta pública para login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/apartments"
          element={
            <PrivateRoute>
              <ApartmentsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <PrivateRoute>
              <h1>Documentos</h1>
            </PrivateRoute>
          }
        />
        <Route
          path="/access"
          element={
            <PrivateRoute>
              <h1>Acceso</h1>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservations/:apartmentId"
          element={
            <PrivateRoute>
              <ReservationsInd />
            </PrivateRoute>
          }
        />
        <Route
          path="/price/:apartmentId"
          element={
            <PrivateRoute>
              <Price />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditApartmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-apartment"
          element={
            <PrivateRoute>
              <CreateApartmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/details/:reservationId"
          element={
            <PrivateRoute>
              <Details />
            </PrivateRoute>
          }
        />
        <Route
          path="/bill/:reservationId"
          element={
            <PrivateRoute>
              <BillPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <CalendarPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/devices/:apartmentId"
          element={
            <PrivateRoute>
              <Devices />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
