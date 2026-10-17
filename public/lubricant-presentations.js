/* Configuración estática de presentaciones de lubricantes. */
(function (root) {
  'use strict';
  const LUBRICANT_PRES_CONFIG = {
  litro: (code, bc) => [
    { name: 'Pote / Litro individual (946 mL / 1 L)', unit: 'L', factor: 1, barcode: bc || code, price: 0 },
    { name: 'Caja x 12 Litros', unit: 'caja', factor: 12, barcode: (bc || code) + 'C12', price: 0 },
    { name: 'Galón (3.785 L / 4 L)', unit: 'gal', factor: 3.785, barcode: (bc || code) + 'GL', price: 0 },
    { name: 'Paila / Cuñete 19 L (5 Gal)', unit: 'paila', factor: 19, barcode: (bc || code) + 'P19', price: 0 },
    { name: 'Tambor 208 L (55 Gal)', unit: 'tambor', factor: 208, barcode: (bc || code) + 'T208', price: 0 }
  ],
  galon: (code, bc) => [
    { name: 'Galón (3.785 L / 4 L)', unit: 'gal', factor: 1, barcode: bc || code, price: 0 },
    { name: 'Caja x 3 Galones', unit: 'caja', factor: 3, barcode: (bc || code) + 'C3', price: 0 },
    { name: 'Paila 19 L (5 Gal)', unit: 'paila', factor: 5, barcode: (bc || code) + 'P19', price: 0 },
    { name: 'Tambor 208 L (55 Gal)', unit: 'tambor', factor: 55, barcode: (bc || code) + 'T208', price: 0 }
  ],
  paila: (code, bc) => [
    { name: 'Paila / Cuñete 19 L (5 Gal)', unit: 'paila', factor: 1, barcode: bc || code, price: 0 },
    { name: 'Tambor 208 L (55 Gal)', unit: 'tambor', factor: 11, barcode: (bc || code) + 'T208', price: 0 }
  ],
  grasa: (code, bc) => [
    { name: 'Pote 400g / 500g', unit: 'und', factor: 1, barcode: bc || code, price: 0 },
    { name: 'Tubo / Cartucho 400g', unit: 'und', factor: 1, barcode: (bc || code) + 'TB', price: 0 },
    { name: 'Paila 16 kg (Grasa)', unit: 'paila', factor: 32, barcode: (bc || code) + 'P16', price: 0 },
    { name: 'Tambor 180 kg', unit: 'tambor', factor: 360, barcode: (bc || code) + 'T180', price: 0 }
  ]
};;
  Object.values(LUBRICANT_PRES_CONFIG).forEach(factory => Object.freeze(factory));
  root.POS_LUBRICANT_PRES_CONFIG = Object.freeze(LUBRICANT_PRES_CONFIG);
})(window);
