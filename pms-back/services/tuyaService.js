const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');
const Settings = require('../models/Settings');

let token = '';

const config = {
  host: 'https://openapi.tuyaeu.com',
  accessKey: '5kw3amxpsyenj3nd57fv',
  secretKey: '89f1e8d9f1964903942bab272f05a432',
};

// Function to get the Tuya settings from the database
const getTuyaSettings = async () => {
  const settings = await Settings.findOne({ serviceName: 'Tuya' });
  if (!settings || !settings.apiKey || !settings.token) {
    throw new Error('Tuya settings not configured');
  }
  // Update config with the values fetched from DB
  config.accessKey = settings.apiKey;
  config.secretKey = settings.token;
  return settings;
};

// Function to generate HMAC-SHA256 signature
async function encryptStr(str, secret) {
  return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase();
}

// Function to get the token from Tuya API
async function getToken() {
  // await getTuyaSettings();  // First, we get settings from the DB

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
    console.log('Token obtained:', token);
    return token;  // Return the token
  } catch (error) {
    console.error('Error fetching token:', error.message);
    throw error;
  }
}

// Run the function to get token
(async () => {
  try {
    const token = await getToken();
    console.log(`Successfully fetched token: ${token}`);
  } catch (err) {
    console.error(err);
  }
})();
