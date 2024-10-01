import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap instalado

const ApartmentForm = React.memo(({ apartment, handleChange, handleSubmit, isEditMode, loading }) => {
  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow">
      <div className="form-group mb-3">
        <label htmlFor="name">Nombre:</label>
        <input 
          type="text" 
          className="form-control" 
          name="name" 
          value={apartment.name} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="description">Descripción:</label>
        <textarea 
          className="form-control" 
          name="description" 
          value={apartment.description} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="mb-3">
        <label htmlFor="defaultPrice">Precio por defecto:</label>
        <input
          type="number"
          name="defaultPrice"
          value={apartment.defaultPrice}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="services">Servicios (separados por comas):</label>
        <input 
          type="text" 
          className="form-control" 
          name="services" 
          value={apartment.services} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="imageUrl">URL de la imagen:</label>
        <input 
          type="text" 
          className="form-control" 
          name="imageUrl" 
          value={apartment.imageUrl} 
          onChange={handleChange} 
        />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Procesando...' : isEditMode ? 'Guardar Cambios' : 'Crear Apartamento'}
      </button>
    </form>
  );
});

export default ApartmentForm;
