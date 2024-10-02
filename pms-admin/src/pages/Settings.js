import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTimes, faLock } from '@fortawesome/free-solid-svg-icons';
import '../css/Settings.scss';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('APIKeys');
  const [activeService, setActiveService] = useState('HomeAssistant');
  const [formData, setFormData] = useState({
    apiUrl: '',
    apiKey: '',
    token: ''
  });
  const [loading, setLoading] = useState(false);
  const [reservationFields, setReservationFields] = useState([]);
  const [newField, setNewField] = useState('');
  const [isAdding, setIsAdding] = useState(false); // Controla si estamos añadiendo un nuevo campo
  const [editingFieldId, setEditingFieldId] = useState(null); // Para editar campos existentes

  // Fetch settings when switching tabs or services
  useEffect(() => {
    if (activeTab === 'APIKeys') {
      setLoading(true);
      fetchSettings(activeService).finally(() => setLoading(false));
    }
  }, [activeTab, activeService]);

  // Fetch settings for the active service
  const fetchSettings = async (serviceName) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/settings/${serviceName}`);
      setFormData({
        apiUrl: response.data.apiUrl || '',
        apiKey: response.data.apiKey || '',
        token: response.data.token || ''
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setFormData({
        apiUrl: '',
        apiKey: '',
        token: ''
      });
    }
  };

  // Handle form changes for API keys
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle saving API keys
  const handleSave = async () => {
    if (!formData.apiUrl || !formData.apiKey || !formData.token) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/settings/${activeService}`, formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  // Fetch reservation fields when switching to the reservation fields tab
  useEffect(() => {
    if (activeTab === 'ReservationFields') {
      fetchReservationFields();
    }
  }, [activeTab]);

  // Fetch reservation fields
  const fetchReservationFields = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/reservation-fields/');
      setReservationFields(response.data);
    } catch (error) {
      console.error('Error fetching reservation fields:', error);
      setReservationFields([]);
    }
  };

  // Handle adding a new reservation field
  const handleAddField = async () => {
    if (!newField) {
      alert('El campo no puede estar vacío.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/reservation-fields', { name: newField });
      setReservationFields([...reservationFields, response.data]); // Add the new field to the list
      setNewField(''); // Clear the input
      setIsAdding(false); // Close the adding form
    } catch (error) {
      console.error('Error adding field:', error);
    }
  };

  // Handle editing a reservation field
  const handleEditField = async (id) => {
    const updatedFieldName = reservationFields.find(field => field._id === id).name;
    try {
      await axios.put(`http://localhost:3000/api/reservation-fields/${id}`, { name: updatedFieldName });
      fetchReservationFields(); // Refresh the list
      setEditingFieldId(null); // Exit edit mode
    } catch (error) {
      console.error('Error editing field:', error);
    }
  };

  // Handle deleting a reservation field
  const handleDeleteField = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/reservation-fields/${id}`);
      setReservationFields(reservationFields.filter(field => field._id !== id)); // Remove field from list
    } catch (error) {
      console.error('Error deleting field:', error);
    }
  };

  return (
    <div className="settings-container container mt-4">
      <h2 className="text-center">Settings</h2>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <>
          <ul className="nav nav-tabs mb-3 justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'APIKeys' ? 'active' : ''}`}
                onClick={() => setActiveTab('APIKeys')}
              >
                Claves API
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'ReservationFields' ? 'active' : ''}`}
                onClick={() => setActiveTab('ReservationFields')}
              >
                Campos de Reserva
              </button>
            </li>
          </ul>

          {activeTab === 'APIKeys' && (
            <>
              <div className="form-group">
                <label htmlFor="apiServiceSelect" className="form-label">Seleccione el servicio</label>
                <select
                  id="apiServiceSelect"
                  className="form-select"
                  value={activeService}
                  onChange={(e) => setActiveService(e.target.value)}
                >
                  <option value="HomeAssistant">Home Assistant</option>
                  <option value="Tuya">Tuya</option>
                  <option value="Channexx">Channexx</option>
                </select>
              </div>

              <div className="tab-content p-4 border rounded">
                <div className="mb-3">
                  <label className="form-label">API URL:</label>
                  <input
                    type="text"
                    name="apiUrl"
                    value={formData.apiUrl}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">API Key:</label>
                  <input
                    type="text"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Token:</label>
                  <input
                    type="text"
                    name="token"
                    value={formData.token}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                  Guardar
                </button>
              </div>
            </>
          )}

          {activeTab === 'ReservationFields' && (
            <div className="reservation-fields-tab">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title text-center">
                    Campos de Reserva
                  </h5>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Campo</th>
                        <th style={{ textAlign: 'right', width: '150px' }}>Acciones</th> {/* Alineación a la derecha */}
                      </tr>
                    </thead>
                    <tbody>
                      {reservationFields.map((field) => (
                        <tr key={field._id}>
                          <td>
                            {editingFieldId === field._id ? (
                              <input
                                type="text"
                                className="form-control"
                                value={field.name}
                                onChange={(e) => setReservationFields(
                                  reservationFields.map(f => (f._id === field._id ? { ...f, name: e.target.value } : f))
                                )}
                              />
                            ) : (
                              field.name
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}> {/* Alineación a la derecha */}
                            {editingFieldId === field._id ? (
                              <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditField(field._id)}>
                                Guardar
                              </button>
                            ) : (
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                className="me-3"
                                onClick={() => setEditingFieldId(field._id)}
                                style={{ cursor: 'pointer' }}
                              />
                            )}
                            <FontAwesomeIcon
                              icon={faTimes}
                              onClick={() => handleDeleteField(field._id)}
                              style={{ cursor: 'pointer', color: 'red' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="d-flex justify-content-center mb-3">
                    <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
                      {isAdding ? 'Cancelar' : 'Nuevo Campo'}
                    </button>
                  </div>

                  {isAdding && (
                    <div>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Nuevo campo"
                        value={newField}
                        onChange={(e) => setNewField(e.target.value)}
                      />
                      <button className="btn btn-success" onClick={handleAddField}>
                        Añadir campo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


        </>
      )}
    </div>
  );
};

export default SettingsPage;
