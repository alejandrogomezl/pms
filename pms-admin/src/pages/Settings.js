import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Settings.scss';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('SmartLock');
  const [formData, setFormData] = useState({
    apiUrl: '',
    apiKey: '',
    token: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSettings(activeTab).finally(() => setLoading(false));
  }, [activeTab]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.apiUrl || !formData.apiKey || !formData.token) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/settings/${activeTab}`, formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="tabs">
            <button
              className={activeTab === 'SmartLock' ? 'active' : ''}
              onClick={() => setActiveTab('SmartLock')}
            >
              Smart Lock
            </button>
            <button
              className={activeTab === 'AirBnB' ? 'active' : ''}
              onClick={() => setActiveTab('AirBnB')}
            >
              AirBnB
            </button>
            <button
              className={activeTab === 'Booking' ? 'active' : ''}
              onClick={() => setActiveTab('Booking')}
            >
              Booking
            </button>
          </div>
          <div className="tab-content">
            <div className="form-group">
              <label>API URL:</label>
              <input
                type="text"
                name="apiUrl"
                value={formData.apiUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>API Key:</label>
              <input
                type="text"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Token:</label>
              <input
                type="text"
                name="token"
                value={formData.token}
                onChange={handleInputChange}
              />
            </div>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsPage;