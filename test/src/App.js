import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Padre from './Padre';
import Hijo from './Hijo';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Padre</Link>
          <Link to="/hijo">Hijo</Link>
        </nav>

        {/* Envuelve tus rutas dentro de <Routes> */}
        <Routes>
          <Route exact path="/" element={<Padre />} />
          <Route path="/hijo" element={<Hijo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;