import { useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ApartmentDetails = () => {
  const [apartment, setApartment] = useState(null);
  const { id } = useParams();  // Extrae el id de la URL
  const navigate = useNavigate();
  console.log('id:', id);

  useEffect(() => {
    const fetchApartment = async () => {
      const url = `http://localhost:3000/api/apartments/${id}`; // Asegúrate de incluir el puerto correcto y la ruta completa
      try {
        const response = await axios.get(url);
        setApartment(response.data);
      } catch (error) {
        console.error("Error fetching apartment details:", error);
      }
    };

    fetchApartment();
  }, [id]);

  const handleReservationClick = () => {
    navigate(`/reserve/${id}`); // Redirige al formulario de reserva con el ID del apartamento
  };


  if (!apartment) return <div>Loading...</div>;

  return (
    <div>
      <h1>{apartment.name}</h1>
      <p>{apartment.description}</p>
      <p>Location: {apartment.location}</p>
      <p>Price: ${apartment.price}</p>
      <button onClick={handleReservationClick}>Make a Reservation</button>
    </div>
  );
};

export default ApartmentDetails;
