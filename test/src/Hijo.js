// Hijo.js
import React from 'react';

function Hijo(props) {
  return (
    <div>
      <h2>Componente Hijo</h2>
      <p>Nombre: {props.nombre}</p>
      <p>Edad: {props.edad}</p>
    </div>
  );
}

export default Hijo;
