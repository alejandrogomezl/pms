import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'; // Importar los iconos de FontAwesome

const PriceList = ({ prices, apartmentId, onPriceAdded }) => {
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [editingIndex, setEditingIndex] = useState(null); // Estado para saber cuál entrada está siendo editada
  const [errorMessage, setErrorMessage] = useState(''); // Para mostrar mensajes de error

  const today = new Date(); // La fecha actual

  // Función para manejar el envío del formulario (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: La fecha de fin no puede ser anterior a la fecha de inicio
    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    try {
      const payload = {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        price: parseFloat(price),
      };

      if (editingIndex !== null) {
        // Editar precio existente
        const priceId = prices[editingIndex]._id; // Obtener el ID del precio que se está editando
        await axios.put(`http://localhost:3000/api/prices/update-price/${apartmentId}/${priceId}`, payload);
      } else {
        // Añadir nuevo precio
        await axios.post(`http://localhost:3000/api/prices/set-prices/${apartmentId}`, { prices: [payload] });
      }

      // Llamar a la función de actualización del componente principal
      onPriceAdded();

      // Limpiar el formulario y ocultarlo
      setStartDate('');
      setEndDate('');
      setPrice('');
      setErrorMessage(''); // Limpiar el mensaje de error
      setShowForm(false);
      setEditingIndex(null); // Salir del modo de edición
    } catch (error) {
      console.error('Error al añadir o editar el precio:', error);
    }
  };

  // Función para manejar la edición
  const handleEdit = (index) => {
    const selectedPrice = prices[index];
    setStartDate(new Date(selectedPrice.startDate).toISOString().split('T')[0]);
    setEndDate(new Date(selectedPrice.endDate).toISOString().split('T')[0]);
    setPrice(selectedPrice.price);
    setEditingIndex(index);
    setShowForm(true); // Mostrar el formulario para editar
  };

  // Función para manejar la eliminación
  const handleDelete = async (index) => {
    const priceId = prices[index]._id;

    // Mostrar mensaje de confirmación
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este precio?');
    if (!confirmDelete) {
      return; // Si el usuario cancela, no eliminar el registro
    }

    try {
      await axios.delete(`http://localhost:3000/api/prices/delete-price/${apartmentId}/${priceId}`);
      onPriceAdded(); // Refrescar la lista de precios
    } catch (error) {
      console.error('Error al eliminar el precio:', error);
    }
  };

  // Filtrar los precios que tienen fecha de fin mayor a la fecha actual
  const filteredPrices = prices.filter(price => new Date(price.endDate) >= today);

  return (
    <div className="container">
      <h3 className="my-4 text-center">Lista de Precios</h3>

      {/* Mostrar el mensaje de error si existe */}
      {errorMessage && (
        <div className="alert alert-danger text-center" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Tabla de precios */}
      <table className="table table-striped table-hover table-bordered shadow-sm">
        <thead className="thead-light">
          <tr className="text-center">
            <th style={{ width: '25%' }}>Fecha de Inicio</th>
            <th style={{ width: '25%' }}>Fecha de Fin</th>
            <th style={{ width: '25%' }}>Precio (€)</th>
            <th style={{ width: '25%' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrices.map((price, index) => (
            <tr key={index} className="text-center">
              <td>{new Date(price.startDate).toLocaleDateString()}</td>
              <td className="text-center">{new Date(price.endDate).toLocaleDateString()}</td>
              <td>€{price.price}</td>
              <td>
                <button 
                  className="btn btn-warning btn-sm me-2" 
                  onClick={() => handleEdit(index)}
                >
                  <FontAwesomeIcon icon={faPencilAlt} /> {/* Icono de lápiz */}
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => handleDelete(index)}
                >
                  <FontAwesomeIcon icon={faTimes} /> {/* Icono de X */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón para mostrar el formulario */}
      <div className="text-center">
        <button
          onClick={() => {
            setErrorMessage('');
            setShowForm(!showForm);
          }}
          className={`btn ${showForm ? 'btn-outline-danger' : 'btn-outline-primary'} my-3`}
        >
          {showForm ? 'Cancelar' : 'Añadir nuevo precio'}
        </button>
      </div>

      {/* Formulario para añadir o editar un precio */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="startDate" className="form-label">Fecha de Inicio:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="endDate" className="form-label">Fecha de Fin:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Precio (€):</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-success">
              {editingIndex !== null ? 'Guardar Cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PriceList;
