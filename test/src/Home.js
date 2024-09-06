import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const name = "John Doe"; // Parámetro que queremos pasar

  return (
    <div>
      <h1>Home Page</h1>
      <p>Click the link below to go to the About page and pass a parameter.</p>
      <Link to={`/about/${name}`}>Go to About Page</Link>
    </div>
  );
}

export default Home;
