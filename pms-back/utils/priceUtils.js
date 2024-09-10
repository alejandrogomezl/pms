// utils/priceUtils.js

const Price = require('../models/Price');
const Apartment = require('../models/Apartment');

// Obtener el precio para una fecha específica, devolviendo un precio por defecto si no se encuentra un precio específico
const getPriceForDate = async (apartmentId, date) => {
  // Busca si hay un precio específico para la fecha
  const priceEntry = await Price.findOne({
    apartmentId,
    startDate: { $lte: new Date(date) },
    endDate: { $gte: new Date(date) },
  });

  // Si no existe un precio específico, busca el precio por defecto del apartamento
  if (!priceEntry) {
    const apartment = await Apartment.findById(apartmentId);
    return apartment ? apartment.defaultPrice : 100; // Si el defaultPrice no está definido, usa 100 como fallback
  }

  return priceEntry.price;
};

module.exports = { getPriceForDate };
