const mongoose = require('mongoose');
const { Schema } = mongoose;

const deviceSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true // Cada dispositivo tiene un ID único
  },
  name: {
    type: String,
    required: true
  },
  apartmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Apartment', // Referencia al modelo de apartamentos
    required: true
  },
  deviceType: {
    type: String,
    enum: ['Enchufe', 'Luz', 'Termostato', 'Cerradura', 'Otro'], // Lista de tipos de dispositivos
    required: true
  },
  lockCodes: {
    type: [Number], // Array de enteros para los códigos de la cerradura
    default: [], // Opcional por defecto
    required: false // No obligatorio
  },
  state: {
    type: Boolean, // Estado para enchufe o luz
    required: false, // No obligatorio
    default: null // Por defecto nulo, lo que indica que no es necesario
  },
  thermostat: {
    temp: {
      type: Number, // Temperatura actual para termostatos
      required: false, // No obligatorio
      default: null // Por defecto nulo
    },
    temp_empty: {
      type: Number, // Temperatura cuando el apartamento está vacío
      required: false, // No obligatorio
      default: null // Por defecto nulo
    }
  }
});

// Función de validación personalizada basada en el deviceType
deviceSchema.pre('save', function(next) {
  if (this.deviceType !== 'Cerradura') {
    this.lockCodes = undefined; // Si no es cerradura, no necesitamos lockCodes
  }
  if (this.deviceType !== 'Enchufe' && this.deviceType !== 'Luz') {
    this.state = undefined; // Si no es enchufe o luz, no necesitamos estado
  }
  if (this.deviceType !== 'Termostato') {
    this.thermostat = { temp: undefined, temp_empty: undefined }; // Si no es termostato, no necesitamos temperaturas
  }
  next();
});

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
