import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Para hacer solicitudes a la API
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faKey, faDoorClosed, faDoorOpen, faPencilAlt, faTimes, faLock } from '@fortawesome/free-solid-svg-icons'; // Importar iconos

const DeviceControlPage = () => {
  const { apartmentId } = useParams(); // Obtener el ID del apartamento desde la URL
  const [apartmentName, setApartmentName] = useState(''); // Nombre del apartamento
  const [occupiedTemp, setOccupiedTemp] = useState(22); // Temperatura habitación ocupada
  const [vacantTemp, setVacantTemp] = useState(18); // Temperatura habitación vacía
  const [isOccupied, setIsOccupied] = useState(false); // Indicador de ocupación
  const [currentTemp, setCurrentTemp] = useState(21); // Temperatura actual

  // Estados para gestionar los códigos de acceso
  const [accessCodes, setAccessCodes] = useState([
    { id: 1, name: 'Limpieza', code: '0001' },
    { id: 2, name: 'Mantenimiento', code: '0002' },
    { id: 3, name: 'Cliente 1', code: '0003' }
  ]);
  const [newCodeName, setNewCodeName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [editingCode, setEditingCode] = useState(null); // Para saber si se está editando un código
  const [isAdding, setIsAdding] = useState(false); // Estado para mostrar u ocultar los campos para crear un nuevo código

  // Obtener el nombre del apartamento utilizando el ID desde la API
  useEffect(() => {
    const fetchApartmentName = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/apartments/${apartmentId}`);
        setApartmentName(response.data.name); // Actualizar el nombre del apartamento
      } catch (error) {
        console.error('Error al obtener el nombre del apartamento:', error);
      }
    };

    fetchApartmentName(); // Llamar a la función cuando se monte el componente
  }, [apartmentId]);

  // Función para añadir un nuevo código
  const handleAddCode = () => {
    if (newCodeName && newCode) {
      setAccessCodes([...accessCodes, { id: Date.now(), name: newCodeName, code: newCode }]);
      setNewCodeName('');
      setNewCode('');
      setIsAdding(false); // Ocultar el formulario después de añadir
    }
  };

  // Función para editar un código
  const handleEditCode = (id) => {
    const codeToEdit = accessCodes.find((code) => code.id === id);
    setNewCodeName(codeToEdit.name);
    setNewCode(codeToEdit.code);
    setEditingCode(id);
    setIsAdding(true); // Mostrar el formulario cuando se edite
  };

  // Función para guardar los cambios de edición
  const handleSaveEdit = () => {
    setAccessCodes(
      accessCodes.map((code) =>
        code.id === editingCode ? { ...code, name: newCodeName, code: newCode } : code
      )
    );
    setEditingCode(null);
    setNewCodeName('');
    setNewCode('');
    setIsAdding(false); // Ocultar el formulario después de guardar
  };

  // Función para eliminar un código
  const handleDeleteCode = (id) => {
    setAccessCodes(accessCodes.filter((code) => code.id !== id));
  };

  return (
    <div className="container mt-5">

      <div className="text-center mb-4">
        <h2 className="display-4">Control de Dispositivos</h2>
        <p className="lead text-muted">{apartmentName || 'Cargando...'}</p>
      </div>

      <div className="row">
        {/* Sección de ocupación */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">
                {isOccupied ? (
                  <FontAwesomeIcon icon={faDoorOpen} className="me-2" size="3x" />
                ) : (
                  <FontAwesomeIcon icon={faDoorClosed} className="me-2" size="3x" />
                )}
                {isOccupied ? 'Apartamento Ocupado' : 'Apartamento Vacío'}
              </h5>
            </div>
          </div>

          {/* Sección de temperatura */}
          <div className="row">
            {/* Temperatura de habitación ocupada */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-center">
                    <FontAwesomeIcon icon={faThermometerHalf} className="me-2" /> Temperatura - Habitación Ocupada
                  </h5>
                  <div className="d-flex justify-content-center align-items-center">
                    <input
                      type="number"
                      className="form-control text-center"
                      value={occupiedTemp}
                      onChange={(e) => setOccupiedTemp(e.target.value)}
                      style={{ width: '100px' }}
                    />
                    <span className="ms-2">°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Temperatura de habitación vacía */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-center">
                    <FontAwesomeIcon icon={faThermometerHalf} className="me-2" /> Temperatura - Habitación Vacía
                  </h5>
                  <div className="d-flex justify-content-center align-items-center">
                    <input
                      type="number"
                      className="form-control text-center"
                      value={vacantTemp}
                      onChange={(e) => setVacantTemp(e.target.value)}
                      style={{ width: '100px' }}
                    />
                    <span className="ms-2">°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de códigos de acceso */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title text-center">
                <FontAwesomeIcon icon={faKey} className="me-2" /> Códigos de Acceso
              </h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Código</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {accessCodes.map((code) => (
                    <tr key={code.id}>
                      <td>{code.name}</td>
                      <td>{code.code}</td>
                      <td>
                        <FontAwesomeIcon
                          icon={faPencilAlt}
                          className="me-3"
                          onClick={() => handleEditCode(code.id)}
                          style={{ cursor: 'pointer' }}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          onClick={() => handleDeleteCode(code.id)}
                          style={{ cursor: 'pointer', color: 'red' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Botón para añadir un nuevo código */}
              <div className="d-flex justify-content-center mb-3">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsAdding(!isAdding)}
                >
                  <FontAwesomeIcon icon={faLock} className="me-2" />
                  {isAdding ? 'Cancelar' : 'Nuevo Código'}
                </button>
              </div>

              {/* Formulario para añadir o editar códigos */}
              {isAdding && (
                <div>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nombre del Código"
                    value={newCodeName}
                    onChange={(e) => setNewCodeName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Código"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                  />
                  {editingCode ? (
                    <button className="btn btn-warning" onClick={handleSaveEdit}>
                      Guardar Cambios
                    </button>
                  ) : (
                    <button className="btn btn-success" onClick={handleAddCode}>
                      Añadir Código
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Temperatura actual */}
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-lg">
            <div className="card-body text-center">
              <h5 className="card-title">
                <FontAwesomeIcon icon={faThermometerHalf} className="me-2" /> Temperatura Actual
              </h5>
              <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{currentTemp}°C</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceControlPage;
