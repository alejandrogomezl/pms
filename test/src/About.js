import React from 'react';
import { useParams } from 'react-router-dom';

function About() {
  const { name } = useParams(); // Usamos useParams para obtener el parámetro de la URL

  return (
    <div>
      <h1>About Page</h1>
      <p>Received parameter: {name}</p>
    </div>
  );
}

export default About;
