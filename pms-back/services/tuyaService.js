const axios = require('axios');
const crypto = require('crypto');
const Settings = require('../models/Settings');

let token = '';
let tokenExpiry = 0; // Para gestionar la caducidad del token

const config = {
  host: 'https://openapi.tuyaeu.com',
  accessKey: '5kw3amxpsyenj3nd57fv',
  secretKey: '89f1e8d9f1964903942bab272f05a432',
};

// Function to generate HMAC-SHA256 signature
async function encryptStr(str, secret) {
  return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase();
}

// Function to get the token from Tuya API
async function getToken() {
  // Verificar si el token aún es válido
  if (Date.now() < tokenExpiry && token) {
    return token;
  }

  const method = 'GET';
  const timestamp = Date.now().toString();
  const signUrl = '/v1.0/token?grant_type=1';
  
  const contentHash = crypto.createHash('sha256').update('').digest('hex');
  const stringToSign = [method, contentHash, '', signUrl].join('\n');
  const signStr = config.accessKey + timestamp + stringToSign;
  const sign = await encryptStr(signStr, config.secretKey);

  // Request headers
  const headers = {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: config.accessKey,
    sign: sign,
  };

  // Make the request to Tuya API
  try {
    const { data: login } = await axios.get(`${config.host}/v1.0/token?grant_type=1`, { headers });
    if (!login || !login.success) {
      throw new Error(`Error obtaining token: ${login.msg}`);
    }
    token = login.result.access_token;
    tokenExpiry = Date.now() + login.result.expire_time * 1000; // Guardar el tiempo de expiración del token
    console.log('Token obtained:', token);
    return token;
  } catch (error) {
    console.error('Error fetching token:', error.message);
    throw error;
  }
}

// Function to build headers for Tuya API requests
async function buildHeaders(method, url) {
  const timestamp = Date.now().toString();
  const token = await getToken(); // Asegurarse de tener el token actualizado
  const contentHash = crypto.createHash('sha256').update('').digest('hex');
  const stringToSign = [method, contentHash, '', url].join('\n');
  const signStr = config.accessKey + token + timestamp + stringToSign;
  const sign = await encryptStr(signStr, config.secretKey);

  return {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: config.accessKey,
    access_token: token,
    sign: sign,
  };
}

// Function to get the device state from Tuya API
async function getDeviceState(deviceId) {
  try {
    const url = `/v1.0/devices/status?device_ids=${deviceId}`;
    const headers = await buildHeaders('GET', url);

    // Fetch the device status from Tuya API
    const response = await axios.get(`${config.host}${url}`, { headers });
    if (response.data.success) {
      console.log('Device state fetched:', response.data.result);
      // Extract and return the state information
      const deviceStatus = response.data.result[deviceId];
      return deviceStatus;
    } else {
      throw new Error(`Failed to fetch device state: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('Error fetching device state:', error.message);
    throw error;
  }
}

// Function to get states for multiple devices (batch request)
async function getMultipleDeviceStates(deviceIds) {
  try {
    const url = `/v1.0/devices/status?device_ids=${deviceIds.join(',')}`;
    const headers = await buildHeaders('GET', url);

    // Fetch the devices' statuses from Tuya API
    const response = await axios.get(`${config.host}${url}`, { headers });
    if (response.data.success) {
      console.log('Multiple device states fetched:', response.data.result);
      return response.data.result;
    } else {
      throw new Error(`Failed to fetch device states: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('Error fetching multiple device states:', error.message);
    throw error;
  }
}

async function putDeviceState(deviceId, code, value) {
  try {
    // Generar el string de comandos en formato JSON
    const commandString = JSON.stringify([{ code, value }]);
    
    // Construir la URL completa para la consulta
    const url = `/v1.0/devices/${deviceId}/commands`;
    const fullUrl = `${config.host}${url}?commands=`;

    // Obtener los headers
    const headers = await buildHeaders('GET', url);

    // Mostrar la consulta completa antes de enviarse
    console.log('Full request URL:', fullUrl);
    console.log('Request headers:', headers);

    // Enviar la solicitud POST a la API de Tuya
    const response = await axios.post(fullUrl, null, { headers });

    if (response.data.success) {
      console.log('Device command sent successfully:', response.data);
      return response.data;
    } else {
      throw new Error(`Failed to send device command: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('Error sending device command:', error.message);
    throw error;
  }
}




console.log(getDeviceState('bf7ea9af00476103f7mbuz'));
//console.log(putDeviceState('bf7ea9af00476103f7mbuz', 'switch1', 'true'));

module.exports = { getToken, getDeviceState, getMultipleDeviceStates, putDeviceState };