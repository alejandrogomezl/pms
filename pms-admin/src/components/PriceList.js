import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap

const PriceList = ({ prices, apartmentId, onPriceAdded }) => {
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Asegúrate de que apartmentId se utiliza correctamente en la solicitud POST
      await axios.post(`http://localhost:3000/api/prices/set-prices/${apartmentId}`, {
        prices: [
          {
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            price: parseFloat(price)
          }
        ]
      });

      // Llamar a la función de actualización del componente principal
      onPriceAdded();

      // Limpiar el formulario y ocultarlo
      setStartDate('');
      setEndDate('');
      setPrice('');
      setShowForm(false);
    } catch (error) {
      console.error('Error al añadir el nuevo precio:', error);
    }
  };

  return (
    <div className="container">
      <h3 className="my-4">Lista de Precios</h3>
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Precio (€)</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price, index) => (
            <tr key={index}>
              <td>{new Date(price.startDate).toLocaleDateString()}</td>
              <td>{new Date(price.endDate).toLocaleDateString()}</td>
              <td>€{price.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón para mostrar el formulario */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn btn-primary my-3"
      >
        {showForm ? 'Cancelar' : 'Añadir nuevo precio'}
      </button>

      {/* Formulario para añadir un nuevo precio */}
      {showForm && (
        <form onSubmit={handleSubmit} className="my-4">
          <div className="form-group">
            <label htmlFor="startDate">Fecha de Inicio:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">Fecha de Fin:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Precio (€):</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
        </form>
      )}
    </div>
  );
};

export default PriceList;
