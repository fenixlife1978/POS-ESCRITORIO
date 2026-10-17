/* Datos maestros estáticos del catálogo. Sin estado de aplicación ni lógica de interfaz. */

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
};

const MASTER_CURATED_CATALOG = [
  // --- PDV (Petróleos de Venezuela) ---
  {
    code: '7591001001',
    desc: 'Aceite de Motor PDV Extra Multigrado 20W-50 Mineral 1 L (Pote 946 mL)',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '', // Sin OEM verificado (en blanco)
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001001')
  },
  {
    code: '7591001002',
    desc: 'Aceite de Motor PDV Extra Multigrado 20W-50 Mineral Galón 3,785 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'gal',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.galon('7591001002')
  },
  {
    code: '7591001003',
    desc: 'Aceite de Motor PDV Extra Multigrado 20W-50 Paila 19 L (5 Gal)',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'paila',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.paila('7591001003')
  },
  {
    code: '7591001004',
    desc: 'Aceite de Motor PDV Extra Multigrado 15W-40 Semisintético 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Semisintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001004')
  },
  {
    code: '7591001005',
    desc: 'Aceite de Motor PDV Ultra Diésel 15W-40 CI-4/SL 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001005')
  },
  {
    code: '7591001006',
    desc: 'Aceite de Motor PDV Ultra Diésel 15W-40 Paila 19 L (5 Gal)',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'paila',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.paila('7591001006')
  },
  {
    code: '7591001007',
    desc: 'Aceite de Motor PDV Maxidiesel 50 Monogrado 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001007')
  },
  {
    code: '7591001008',
    desc: 'Aceite Transmisión PDV EP-90 Valvulina 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001008')
  },
  {
    code: '7591001009',
    desc: 'Aceite Transmisión PDV EP-140 Valvulina 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001009')
  },
  {
    code: '7591001010',
    desc: 'Aceite Transmisión Automática PDV ATF Dexron III 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Caja Automática (ATF)',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001010')
  },
  {
    code: '7591001011',
    desc: 'Aceite 2T Marino PDV Fuera de Borda TC-W3 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: '2 Tiempos Marino',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001011')
  },
  {
    code: '7591001012',
    desc: 'Aceite 2T Moto PDV Enfriado por Aire 1 L',
    brand: 'PDV',
    dept: 'Motocicletas',
    cat: 'Moto',
    subcat: 'Aceite 2T',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001012')
  },
  {
    code: '7591001013',
    desc: 'Aceite Hidráulico PDV Hidralub ISO 68 Paila 19 L (5 Gal)',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Grasas y lubricantes',
    subcat: 'Aceite Hidráulico',
    unit: 'paila',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.paila('7591001013')
  },
  {
    code: '7591001014',
    desc: 'Grasa PDV Chasis MP-2 / Rulemanes EP-2 Pote 500 g',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Grasas y lubricantes',
    subcat: 'Grasas Litio y Chasis',
    unit: 'und',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.grasa('7591001014')
  },

  // --- VENOCO ---
  {
    code: '7592001001',
    desc: 'Aceite de Motor Venoco Expert 20W-50 SL/CF Mineral 1 L (Pote 946 mL)',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001001')
  },
  {
    code: '7592001002',
    desc: 'Aceite de Motor Venoco Expert 20W-50 SL Galón 3,785 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'gal',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.galon('7592001002')
  },
  {
    code: '7592001003',
    desc: 'Aceite de Motor Venoco Lubri-Ven 15W-40 CI-4 Diésel/Gasolina 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001003')
  },
  {
    code: '7592001004',
    desc: 'Aceite de Motor Venoco Sintético 5W-30 SN/CF 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Sintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001004')
  },
  {
    code: '7592001005',
    desc: 'Valvulina Venoco 80W-90 GL-5 Engranajes 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001005')
  },
  {
    code: '7592001006',
    desc: 'Valvulina Venoco 85W-140 GL-5 Engranajes 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001006')
  },
  {
    code: '7592001007',
    desc: 'Aceite Transmisión Automática Venoco ATF Dexron III 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Caja Automática (ATF)',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001007')
  },
  {
    code: '7592001008',
    desc: 'Aceite 2T Marino Venoco Outboard TC-W3 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: '2 Tiempos Marino',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001008')
  },
  {
    code: '7592001009',
    desc: 'Grasa Azul de Litio Venoco EP Complejo Pote 400 g',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Grasas y lubricantes',
    subcat: 'Grasas Litio y Chasis',
    unit: 'und',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.grasa('7592001009')
  },

  // --- INCA ---
  {
    code: '7593001001',
    desc: 'Aceite de Motor Inca Super Multigrado 20W-50 SL Mineral 1 L',
    brand: 'Inca',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7593001001')
  },
  {
    code: '7593001002',
    desc: 'Aceite de Motor Inca Super Multigrado 20W-50 Galón 3,785 L',
    brand: 'Inca',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'gal',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.galon('7593001002')
  },
  {
    code: '7593001003',
    desc: 'Aceite de Motor Inca Diesel 15W-40 CI-4 1 L',
    brand: 'Inca',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7593001003')
  },
  {
    code: '7593001004',
    desc: 'Valvulina Inca Gear 85W-140 GL-5 1 L',
    brand: 'Inca',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7593001004')
  },
  {
    code: '7593001005',
    desc: 'Aceite 2T Marino Inca TC-W3 1 L',
    brand: 'Inca',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: '2 Tiempos Marino',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7593001005')
  },

  // --- SHELL VENEZUELA ---
  {
    code: '7594001001',
    desc: 'Aceite de Motor Shell Helix HX5 15W-40 Mineral 1 L',
    brand: 'Shell',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7594001001')
  },
  {
    code: '7594001002',
    desc: 'Aceite de Motor Shell Helix HX7 10W-40 Semisintético 1 L',
    brand: 'Shell',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Semisintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7594001002')
  },
  {
    code: '7594001003',
    desc: 'Aceite de Motor Shell Helix Ultra 5W-30 Sintético PurePlus 1 L',
    brand: 'Shell',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Sintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7594001003')
  },
  {
    code: '7594001004',
    desc: 'Aceite Diésel Shell Rimula R4 X 15W-40 CI-4 1 L',
    brand: 'Shell',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7594001004')
  },
  {
    code: '7594001005',
    desc: 'Valvulina Shell Spirax S2 A 80W-90 GL-5 1 L',
    brand: 'Shell',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7594001005')
  },

  // --- CASTROL ---
  {
    code: '7595001001',
    desc: 'Aceite de Motor Castrol GTX 20W-50 Mineral 1 L (Pote 946 mL)',
    brand: 'Castrol',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7595001001')
  },
  {
    code: '7595001002',
    desc: 'Aceite de Motor Castrol GTX Ultraclean 10W-40 Semisintético 1 L',
    brand: 'Castrol',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Semisintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7595001002')
  },
  {
    code: '7595001003',
    desc: 'Aceite de Motor Castrol Magnatec 5W-30 Stop-Start 1 L',
    brand: 'Castrol',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Sintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7595001003')
  },
  {
    code: '7595001004',
    desc: 'Aceite Moto Castrol Actevo 4T 20W-50 Mineral 1 L',
    brand: 'Castrol',
    dept: 'Motocicletas',
    cat: 'Moto',
    subcat: 'Aceite 4T',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7595001004')
  },

  // --- MOBIL ---
  {
    code: '7596001001',
    desc: 'Aceite de Motor Mobil Super 20W-50 Mineral 1 L (Pote 946 mL)',
    brand: 'Mobil',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7596001001')
  },
  {
    code: '7596001002',
    desc: 'Aceite de Motor Mobil 1 5W-30 Advanced Full Synthetic 1 L',
    brand: 'Mobil',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Sintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7596001002')
  },
  {
    code: '7596001003',
    desc: 'Aceite Diésel Mobil Delvac 1300 Super 15W-40 1 L',
    brand: 'Mobil',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7596001003')
  },

  // --- MOTUL ---
  {
    code: '7597001001',
    desc: 'Aceite de Motor Motul 4000 Motion 15W-40 Mineral 1 L',
    brand: 'Motul',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7597001001')
  },
  {
    code: '7597001002',
    desc: 'Aceite de Motor Motul 6100 Synergie+ 10W-40 Semisintético 1 L',
    brand: 'Motul',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Semisintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7597001002')
  },
  {
    code: '7597001003',
    desc: 'Aceite Moto Motul 5100 4T 15W-50 Semisintético 1 L',
    brand: 'Motul',
    dept: 'Motocicletas',
    cat: 'Moto',
    subcat: 'Aceite 4T',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7597001003')
  },
  {
    code: '7597001004',
    desc: 'Refrigerante Motul Inugel Expert 50% Listo para Usar 1 L',
    brand: 'Motul',
    dept: 'Lubricantes y Fluidos',
    cat: 'Refrigerante y aditivos',
    subcat: 'Refrigerante 50%',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Envase 1 Litro', unit: 'L', factor: 1, barcode: '7597001004', price: 0 },
      { name: 'Garrafa 5 Litros', unit: 'gal', factor: 5, barcode: '7597001004G5', price: 0 }
    ]
  },

  // --- VALVOLINE ---
  {
    code: '7598001001',
    desc: 'Aceite de Motor Valvoline Daily Protection 20W-50 Mineral 1 L',
    brand: 'Valvoline',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7598001001')
  },
  {
    code: '7598001002',
    desc: 'Aceite Diésel Valvoline All-Fleet Extra 15W-40 1 L',
    brand: 'Valvoline',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7598001002')
  },
  {
    code: '7598001003',
    desc: 'Aceite de Motor Valvoline Advanced Full Synthetic 5W-30 1 L',
    brand: 'Valvoline',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Sintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7598001003')
  },

  // --- REPUESTOS AUTOMOTRICES CON CÓDIGOS OEM VERIFICADOS ---
  // Toyota Corolla
  {
    code: '7504001001',
    desc: 'Filtro de Aceite de Motor Toyota Corolla 1.8 (2003-2014) / Celica',
    brand: 'Millard',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-corolla-1.8'], // 04152-YZZA6
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001001', price: 0 }]
  },
  {
    code: '7504001002',
    desc: 'Filtro de Aire Motor Toyota Corolla 1.8 (2003-2008)',
    brand: 'Web',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aire',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aire-corolla'], // 17801-22020
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001002', price: 0 }]
  },
  {
    code: '7504001003',
    desc: 'Pastillas de Freno Delanteras Toyota Corolla 1.8 (2003-2008)',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-corolla-03-08'], // 04465-02061
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504001003', price: 0 }]
  },
  {
    code: '7504001004',
    desc: 'Pastillas de Freno Delanteras Toyota Corolla New Sensation (2009-2014)',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-corolla-09-14'], // 04465-02220
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504001004', price: 0 }]
  },
  {
    code: '7504001005',
    desc: 'Disco de Freno Delantero Ventilado Toyota Corolla (2003-2008)',
    brand: 'Fremax',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Discos de Freno',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['discos-freno-corolla'], // 43512-02110
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad (Rueda)', unit: 'und', factor: 1, barcode: '7504001005', price: 0 }]
  },
  {
    code: '7504001006',
    desc: 'Bujía de Encendido Cobre Toyota Corolla / Aveo / Corsa (BKR6E-11)',
    brand: 'NGK',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Bujías',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bujia-ngk-corolla'], // 90919-01164
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001006', price: 0 },
      { name: 'Caja x 4 Bujías', unit: 'caja', factor: 4, barcode: '7504001006C4', price: 0 }
    ]
  },
  {
    code: '7504001007',
    desc: 'Bujía de Iridium Toyota Corolla / Camry / RAV4 (SK20R11)',
    brand: 'Denso',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Bujías',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bujia-iridium-corolla'], // 90919-01210
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001007', price: 0 },
      { name: 'Caja x 4 Bujías', unit: 'caja', factor: 4, barcode: '7504001007C4', price: 0 }
    ]
  },
  {
    code: '7504001008',
    desc: 'Bobina de Encendido Individual Toyota Corolla 1.8 1ZZ-FE (2003-2008)',
    brand: 'Denso',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Bobinas de Encendido',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bobina-corolla-1.8'], // 90919-02239
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001008', price: 0 }]
  },
  {
    code: '7504001009',
    desc: 'Muñón Inferior Delantero Toyota Corolla (SB-3642)',
    brand: '555',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Muñones y Rótulas',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['munon-corolla'], // 43330-19115
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001009', price: 0 }]
  },
  {
    code: '7504001010',
    desc: 'Terminal de Dirección Externo Toyota Corolla (SE-3641)',
    brand: '555',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Terminales de Dirección',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['terminal-corolla'], // 45046-19175
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001010', price: 0 }]
  },
  {
    code: '7504001011',
    desc: 'Amortiguador Delantero a Gas Toyota Corolla (334815)',
    brand: 'KYB',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Amortiguadores',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['amortiguador-corolla'], // 48510-09L40
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001011', price: 0 },
      { name: 'Par Delantero (2 und)', unit: 'par', factor: 2, barcode: '7504001011P2', price: 0 }
    ]
  },
  {
    code: '7504001012',
    desc: 'Bomba de Agua Toyota Corolla 1.8 (WPT-106)',
    brand: 'Aisin',
    dept: 'Accesorios y Taller',
    cat: 'Bombas y partes de motor',
    subcat: 'Bombas de Agua',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bomba-agua-corolla'], // 16100-29157
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad con Empacadura', unit: 'und', factor: 1, barcode: '7504001012', price: 0 }]
  },
  {
    code: '7504001013',
    desc: 'Kit de Embrague (Plato, Disco y Collarín) Toyota Corolla 1.8 (KT-277)',
    brand: 'Aisin',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Kits de Embrague',
    unit: 'kit',
    oem: VERIFIED_OEM_MAP['kit-embrague-corolla'], // 31250-12391
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Kit Completo 3 Piezas', unit: 'kit', factor: 1, barcode: '7504001013', price: 0 }]
  },

  // Toyota Hilux / 4Runner
  {
    code: '7504001020',
    desc: 'Filtro de Aceite Toyota Hilux 2.7 / Fortuner 4.0 / 4Runner',
    brand: 'Millard',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-hilux-4runner'], // 90915-YZZD3
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001020', price: 0 }]
  },
  {
    code: '7504001021',
    desc: 'Filtro de Aire Toyota Hilux / Fortuner 2.7 y 4.0',
    brand: 'WIX',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aire',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aire-hilux'], // 17801-0C010
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001021', price: 0 }]
  },
  {
    code: '7504001022',
    desc: 'Filtro de Gasoil Trampa con Sensor Toyota Hilux 1KD / 2KD Diésel',
    brand: 'Toyota Genuine',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Combustible',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-gasoil-hilux'], // 23390-0L041
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Elemento con O-ring', unit: 'und', factor: 1, barcode: '7504001022', price: 0 }]
  },
  {
    code: '7504001023',
    desc: 'Pastillas de Freno Delanteras Toyota Hilux Vigo / Fortuner / 4Runner',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-hilux-fortuner'], // 04465-0K090
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504001023', price: 0 }]
  },

  // Chevrolet Aveo
  {
    code: '7504002001',
    desc: 'Filtro de Aceite de Motor Chevrolet Aveo 1.6 / Daewoo Lanos',
    brand: 'Millard',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-aveo'], // 93745067
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002001', price: 0 }]
  },
  {
    code: '7504002002',
    desc: 'Filtro de Aire Motor Chevrolet Aveo 1.6 (Todos los años)',
    brand: 'Web',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aire',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aire-aveo'], // 96536696
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002002', price: 0 }]
  },
  {
    code: '7504002003',
    desc: 'Filtro de Gasolina Metálico Chevrolet Aveo / Corsa / Optra / Spark',
    brand: 'AC Delco',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Combustible',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-gasolina-aveo'], // 96335719
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002003', price: 0 }]
  },
  {
    code: '7504002004',
    desc: 'Pastillas de Freno Delanteras Chevrolet Aveo 1.6 (2005-2015)',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-aveo'], // 96534653
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504002004', price: 0 }]
  },
  {
    code: '7504002005',
    desc: 'Disco de Freno Delantero Chevrolet Aveo 1.6',
    brand: 'Fremax',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Discos de Freno',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['discos-freno-aveo'], // 96574633
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad (Rueda)', unit: 'und', factor: 1, barcode: '7504002005', price: 0 }]
  },
  {
    code: '7504002006',
    desc: 'Bobina de Encendido Chevrolet Aveo 1.6 (Módulo 3 Pines)',
    brand: 'Delphi',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Bobinas de Encendido',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bobina-aveo'], // 96253555
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002006', price: 0 }]
  },
  {
    code: '7504002007',
    desc: 'Juego de Cables de Bujía 7mm Chevrolet Aveo 1.6',
    brand: 'AC Delco',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Cables de Bujías',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['cables-bujia-aveo'], // 96497773
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego 4 Cables', unit: 'jgo', factor: 1, barcode: '7504002007', price: 0 }]
  },
  {
    code: '7504002008',
    desc: 'Muñón Inferior Delantero Chevrolet Aveo (CBKD-11)',
    brand: 'CTR',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Muñones y Rótulas',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['munon-aveo'], // 96535081
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002008', price: 0 }]
  },
  {
    code: '7504002009',
    desc: 'Terminal de Dirección Externo Chevrolet Aveo (CEKD-13)',
    brand: 'CTR',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Terminales de Dirección',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['terminal-aveo'], // 96535224
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002009', price: 0 }]
  },
  {
    code: '7504002010',
    desc: 'Amortiguador Delantero Chevrolet Aveo a Gas (72288)',
    brand: 'Monroe',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Amortiguadores',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['amortiguador-aveo'], // 96586885
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002010', price: 0 },
      { name: 'Par Delantero (2 und)', unit: 'par', factor: 2, barcode: '7504002010P2', price: 0 }
    ]
  },
  {
    code: '7504002011',
    desc: 'Correa de Distribución Chevrolet Aveo 1.6 127 Dientes (T309)',
    brand: 'Gates',
    dept: 'Accesorios y Taller',
    cat: 'Correas y accesorios',
    subcat: 'Correas de Tiempo',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['correa-dist-aveo'], // 96814098
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002011', price: 0 }]
  },
  {
    code: '7504002012',
    desc: 'Tensor de Distribución Chevrolet Aveo 1.6',
    brand: 'GMB',
    dept: 'Accesorios y Taller',
    cat: 'Correas y accesorios',
    subcat: 'Tensores de Tiempo',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['tensor-dist-aveo'], // 96350550
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002012', price: 0 }]
  },
  {
    code: '7504002013',
    desc: 'Bomba de Agua Chevrolet Aveo 1.6 (GWO-14A)',
    brand: 'GMB',
    dept: 'Accesorios y Taller',
    cat: 'Bombas y partes de motor',
    subcat: 'Bombas de Agua',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bomba-agua-aveo'], // 96352650
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad con Empacadura', unit: 'und', factor: 1, barcode: '7504002013', price: 0 }]
  },
  {
    code: '7504002014',
    desc: 'Kit de Embrague Chevrolet Aveo 1.6 (DWK-039)',
    brand: 'Valeo',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Kits de Embrague',
    unit: 'kit',
    oem: VERIFIED_OEM_MAP['kit-embrague-aveo'], // 96349976
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Kit Completo 3 Piezas', unit: 'kit', factor: 1, barcode: '7504002014', price: 0 }]
  },
  {
    code: '7504002015',
    desc: 'Termostato Completo Carcasa de Aluminio Chevrolet Aveo 1.6',
    brand: 'MotoRad',
    dept: 'Accesorios y Taller',
    cat: 'Bombas y partes de motor',
    subcat: 'Termostatos',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['termostato-aveo'], // 96407677
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad con Termostato', unit: 'und', factor: 1, barcode: '7504002015', price: 0 }]
  },

  // Ford Fiesta
  {
    code: '7504003001',
    desc: 'Filtro de Aceite Ford Fiesta Power / Move / Max 1.6 (FL-910S)',
    brand: 'Motorcraft',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-fiesta'], // BE8Z-6731-AB
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504003001', price: 0 }]
  },
  {
    code: '7504003002',
    desc: 'Filtro de Aire Motor Ford Fiesta 1.6 Zetec Rocam',
    brand: 'Motorcraft',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aire',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aire-fiesta'], // 2S61-9601-CA
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504003002', price: 0 }]
  },
  {
    code: '7504003003',
    desc: 'Pastillas de Freno Delanteras Ford Fiesta Power 1.6 (2004-2013)',
    brand: 'Motorcraft',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-fiesta'], // 2S6J-2K021-AA
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504003003', price: 0 }]
  },
  {
    code: '7504003004',
    desc: 'Bobina de Encendido Ford Fiesta 1.6 Zetec Rocam / EcoSport 1.6',
    brand: 'Bosch',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Bobinas de Encendido',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bobina-fiesta'], // 1S7G-12029-AC
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504003004', price: 0 }]
  },
  {
    code: '7504003005',
    desc: 'Termostato Carcasa de Aluminio Ford Fiesta Power 1.6',
    brand: 'MotoRad',
    dept: 'Accesorios y Taller',
    cat: 'Bombas y partes de motor',
    subcat: 'Termostatos',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['termostato-fiesta'], // 2S65-8A520-AA
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Carcasa Completa Aluminio', unit: 'und', factor: 1, barcode: '7504003005', price: 0 }]
  },

  // Hyundai Getz / Accent
  {
    code: '7504004001',
    desc: 'Filtro de Aceite Hyundai Getz / Accent 1.3 - 1.6 / Tucson / Kia Rio',
    brand: 'Millard',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-getz'], // 26300-35503
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504004001', price: 0 }]
  },
  {
    code: '7504004002',
    desc: 'Pastillas de Freno Delanteras Hyundai Getz (2006-2012)',
    brand: 'Hi-Q Sangsin',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-getz'], // 58101-1CA00
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504004002', price: 0 }]
  },

  // Nissan Tiida / Sentra
  {
    code: '7504005001',
    desc: 'Filtro de Aceite Nissan Tiida 1.8 / Sentra B16 / Versa / March',
    brand: 'WIX',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-tiida'], // 15208-65F0A
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504005001', price: 0 }]
  },
  {
    code: '7504005002',
    desc: 'Pastillas de Freno Delanteras Nissan Tiida 1.8 (2007-2014)',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-tiida'], // D1060-EE50A
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504005002', price: 0 }]
  },

  // Chery Arauca / Orinoco
  {
    code: '7504006001',
    desc: 'Filtro de Aceite Chery Arauca 1.3 / Orinoco 1.8 / Tiggo',
    brand: 'Millard',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-arauca'], // 481H-1012010
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504006001', price: 0 }]
  },
  {
    code: '7504006002',
    desc: 'Pastillas de Freno Delanteras Chery Orinoco 1.8',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-orinoco'], // A11-3501080BA
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504006002', price: 0 }]
  },

  // Mitsubishi Lancer
  {
    code: '7504007001',
    desc: 'Filtro de Aceite Mitsubishi Lancer 1.6 / 2.0 / Montero Sport / Dakar',
    brand: 'WIX',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-lancer'], // MD360935
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504007001', price: 0 }]
  },

  // Jeep Grand Cherokee
  {
    code: '7504008001',
    desc: 'Filtro de Aceite Jeep Grand Cherokee 4.7 V8 / Cherokee Liberty 3.7',
    brand: 'WIX',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-grand-cherokee'], // 04884899AC
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504008001', price: 0 }]
  },

  // Químicos y Fluidos Universales
  {
    code: '7509001001',
    desc: 'Líquido para Frenos DOT 3 Frasco 355 mL',
    brand: 'Wagner',
    dept: 'Lubricantes y Fluidos',
    cat: 'Grasas y lubricantes',
    subcat: 'Líquidos de Freno',
    unit: 'und',
    oem: '', // Sin OEM (universal)
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Frasco 355 mL', unit: 'und', factor: 1, barcode: '7509001001', price: 0 },
      { name: 'Envase 946 mL (1 Litro)', unit: 'und', factor: 2.66, barcode: '7509001001L', price: 0 }
    ]
  },
  {
    code: '7509001002',
    desc: 'Refrigerante / Coolant Radiador 50/50 Listo para Usar 1 Galón (3,785 L)',
    brand: 'Prestone',
    dept: 'Lubricantes y Fluidos',
    cat: 'Refrigerante y aditivos',
    subcat: 'Refrigerante 50%',
    unit: 'gal',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Galón individual', unit: 'gal', factor: 1, barcode: '7509001002', price: 0 }]
  },
  {
    code: '7509001003',
    desc: 'Agua Desmineralizada / Destilada para Baterías y Radiador 1 Galón (3,785 L)',
    brand: 'Genérico',
    dept: 'Lubricantes y Fluidos',
    cat: 'Refrigerante y aditivos',
    subcat: 'Agua Destilada',
    unit: 'gal',
    oem: '',
    taxType: 'E', // Exento
    taxRate: 0,
    presentations: [{ name: 'Galón individual', unit: 'gal', factor: 1, barcode: '7509001003', price: 0 }]
  },
  {
    code: '7509001004',
    desc: 'Limpiador de Carburador y Cuerpos de Aceleración Carb Cleaner Spray 450 mL',
    brand: 'ABRO',
    dept: 'Lubricantes y Fluidos',
    cat: 'Grasas y lubricantes',
    subcat: 'Aerosoles y Sprays',
    unit: 'und',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Lata Spray 450 mL', unit: 'und', factor: 1, barcode: '7509001004', price: 0 }]
  },
  {
    code: '7509001005',
    desc: 'Silicón Formador de Juntas Gris Mega Grey Alta Temperatura Tubo 85 g',
    brand: 'VersaChem',
    dept: 'Accesorios y Taller',
    cat: 'Grasas y lubricantes',
    subcat: 'Selladores y Silicones',
    unit: 'und',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Tubo 85 g', unit: 'und', factor: 1, barcode: '7509001005', price: 0 }]
  }
];
