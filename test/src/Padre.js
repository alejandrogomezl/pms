// Padre.js
import React from 'react';
import Hijo from './Hijo';

function Padre() {
  return (
    <div>
      <h1>Componente Padre</h1>
      {/* Pasamos propiedades (props) al componente Hijo */}
      <Hijo nombre="Juan" edad={25} />
    </div>
  );
}

export default Padre;