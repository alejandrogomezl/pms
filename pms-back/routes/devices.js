const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const { getToken } = require('../services/tuyaService'); // Importar el servicio de Tuya

// Crear un nuevo dispositivo
router.post('/', async (req, res) => {
  const { deviceId, name, apartmentId, deviceType, lockCodes, state, thermostat } = req.body;

  try {
    const newDevice = new Device({
      deviceId,
      name,
      apartmentId,
      deviceType,
      lockCodes,
      state,
      thermostat
    });

    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el dispositivo', error });
  }
});

// Obtener todos los dispositivos
router.get('/', async (req, res) => {
    try {
      // Sincronizar dispositivos con Tuya
      console.log('Token:', getToken());
      const tuyaDevices = await getToken();
  
      // Procesar los dispositivos de Tuya y actualizarlos/guardarlos en la base de datos
      for (const device of tuyaDevices) {
        // Buscar si el dispositivo ya existe en la base de datos
        const existingDevice = await Device.findOne({ deviceId: device.id });
  
        if (existingDevice) {
          // Si existe, actualizar el estado
          existingDevice.state = device.online; // Ajusta según tu lógica
          await existingDevice.save();
        } else {
          // Si no existe, crear un nuevo dispositivo
          const newDevice = new Device({
            deviceId: device.id,
            apartmentId: null, // Ajusta según tu lógica
            deviceType: device.category, // Mapear al tipo de dispositivo
            state: device.online,
          });
          await newDevice.save();
        }
      }
  
      // Después de sincronizar, obtener todos los dispositivos desde la base de datos
      const devices = await Device.find().populate('apartmentId');
  
      // Enviar la respuesta con los dispositivos sincronizados
      res.status(200).json(devices);
    } catch (error) {
      console.error('Error al obtener o sincronizar dispositivos:', error);
      res.status(500).json({ message: 'Error al obtener o sincronizar dispositivos', error });
    }
  });

// Obtener un dispositivo por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Buscar el dispositivo en la base de datos
      const device = await Device.findById(id).populate('apartmentId');
  
      if (!device) {
        return res.status(404).json({ message: 'Dispositivo no encontrado' });
      }
  
      // Sincronizar el estado del dispositivo con la API de Tuya
      const tuyaDevice = await syncDeviceWithTuya(device.deviceId);
  
      if (tuyaDevice) {
        // Actualizar el estado del dispositivo en la base de datos
        device.state = tuyaDevice.status[0].value; // Actualiza el estado con los datos de Tuya
        await device.save();
      }
  
      // Devolver el dispositivo actualizado
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el dispositivo', error });
    }
  });

// Obtener todos los dispositivos por `apartmentId`
router.get('/apartment/:apartmentId', async (req, res) => {
    const { apartmentId } = req.params;
  
    try {
      // Sincronizar dispositivos de Tuya con la base de datos
      const tuyaDevices = await syncDevicesWithTuya();
  
      // Actualizar el estado de los dispositivos en la base de datos
      for (const tuyaDevice of tuyaDevices) {
        await Device.findOneAndUpdate(
          { deviceId: tuyaDevice.id },
          { state: tuyaDevice.status[0].value },
          { upsert: true, new: true }
        );
      }
  
      // Obtener los dispositivos sincronizados
      const devices = await Device.find({ apartmentId });
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching devices', details: error.message });
    }
  });

// Actualizar un dispositivo De momento no se sincronizo, tengo que comprobar el serviceTuya
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { deviceId, apartmentId, deviceType, lockCodes, state, thermostat } = req.body;

  try {
    const updatedDevice = await Device.findByIdAndUpdate(
      id,
      {
        deviceId,
        apartmentId,
        deviceType,
        lockCodes,
        state,
        thermostat
      },
      { new: true } // Devolver el dispositivo actualizado
    );

    if (!updatedDevice) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }

    res.status(200).json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el dispositivo', error });
  }
});


module.exports = router;
