/* Datos iniciales del catálogo, separados del núcleo de la aplicación.
 * La fábrica recibe P para conservar la construcción original de cada producto.
 */
(function (root) {
  'use strict';
  const seedFactory = function (P) {
    return [
 P('7501001','Aceite 20W-50 Mineral 1 L','Castrol GTX','Lubricantes y Fluidos','Aceites de motor','Mineral',5.20,48,12,'A-1','und',3.35,'G',16),
 P('7501002','Aceite 20W-50 Mineral Galón 4 L','Castrol GTX','Lubricantes y Fluidos','Aceites de motor','Mineral',19.50,14,6,'A-1','gal',12.60,'G',16),
 P('7501003','Aceite 10W-40 Semisintético 1 L','Mobil Super','Lubricantes y Fluidos','Aceites de motor','Semisintético',7.80,30,10,'A-2','und',5.05,'G',16),
 P('7501004','Aceite 5W-30 Sintético 1 L','Mobil 1','Lubricantes y Fluidos','Aceites de motor','Sintético',13.90,16,8,'A-2','und',9.10,'G',16),
 P('7501005','Aceite 10W-30 High Mileage 1 L','Valvoline','Lubricantes y Fluidos','Aceites de motor','Semisintético',7.40,22,8,'A-2','und',4.80,'G',16),
 P('7501006','Aceite Diésel 15W-40 Galón 3,78 L','Valvoline','Lubricantes y Fluidos','Aceites de motor','Diésel Pesado',24.80,9,5,'A-3','gal',16.20,'G',16),
 P('7501007','Aceite 10W-40 Semisintético 1 L','Shell Helix HX7','Lubricantes y Fluidos','Aceites de motor','Semisintético',7.60,25,10,'A-2','und',4.95,'G',16),
 P('7501008','Aceite 10W-40 Quartz 7000 1 L','Total','Lubricantes y Fluidos','Aceites de motor','Semisintético',7.50,3,8,'A-2','und',4.85,'G',16),
 P('7501009','Aceite 20W-50 a granel (por litro)','Genérico','Lubricantes y Fluidos','Aceites de motor','Granel',3.40,120,40,'A-0','L',2.10,'G',16),
 P('7510001','Aceite Moto 4T 20W-50 1 L','Motul 3000','Motocicletas','Moto','Aceite 4T',8.90,20,8,'M-1','und',5.80,'G',16),
 P('7510002','Aceite Moto 4T 20W-50 1 L','Mobil Racing','Motocicletas','Moto','Aceite 4T',7.10,26,10,'M-1','und',4.55,'G',16),
 P('7510003','Lubricante de Cadena 400 ml','Motul','Motocicletas','Moto','Mantenimiento Cadena',9.30,14,6,'M-2','und',6.00,'G',16),
 P('7510004','Pastillas de Freno Delanteras Moto','Bendix','Motocicletas','Moto','Frenos Moto',8.50,12,6,'M-3','jgo',5.40,'G',16),
 P('7502001','ATF Dexron III Automática 1 L','Castrol','Lubricantes y Fluidos','Transmisión y diferencial','Caja Automática (ATF)',8.20,18,6,'B-1','und',5.30,'G',16),
 P('7502002','Aceite Transmisión 80W-90 GL-5 1 L','Valvoline','Lubricantes y Fluidos','Transmisión y diferencial','Valvulina y Engranajes',6.90,21,8,'B-1','und',4.45,'G',16),
 P('7502003','Aceite Transmisión 75W-90 Sintético 1 L','Mobil','Lubricantes y Fluidos','Transmisión y diferencial','Valvulina y Engranajes',12.40,7,4,'B-1','und',8.05,'G',16),
 P('7502004','Líquido Hidráulico Dirección 1 L','Genérico','Lubricantes y Fluidos','Transmisión y diferencial','Dirección Hidráulica',4.60,15,6,'B-2','und',2.95,'G',16),
 P('7503001','Lubricante Multiuso 11 oz','WD-40','Lubricantes y Fluidos','Grasas y lubricantes','Aerosoles y Sprays',6.50,40,12,'C-1','und',4.20,'G',16),
 P('7503002','Grasa Multipropósito Litio NLGI-2 500 g','Genérico','Lubricantes y Fluidos','Grasas y lubricantes','Grasas Litio y Chasis',4.90,26,8,'C-1','und',3.10,'G',16),
 P('7503003','Grasa de Chasis Roja 1 kg','Valvoline','Lubricantes y Fluidos','Grasas y lubricantes','Grasas Litio y Chasis',7.20,11,5,'C-2','kg',4.65,'G',16),
 P('7503004','Limpia Frenos en Spray 500 ml','CRC','Lubricantes y Fluidos','Grasas y lubricantes','Aerosoles y Sprays',5.80,17,6,'C-3','und',3.75,'G',16),
 P('7503005','Silicón Lubricante en Spray 400 ml','Genérico','Lubricantes y Fluidos','Grasas y lubricantes','Aerosoles y Sprays',4.30,19,6,'C-3','und',2.75,'G',16),
 P('7504001','Filtro de Aceite PH3600','Fram','Filtros y Mantenimiento','Filtros','Filtro de Aceite',4.80,35,10,'D-1','und',3.00,'G',16),
 P('7504002','Filtro de Aceite W 712/75','Mann','Filtros y Mantenimiento','Filtros','Filtro de Aceite',7.90,12,5,'D-1','und',5.10,'G',16),
 P('7504003','Filtro de Aire CA9482','Fram','Filtros y Mantenimiento','Filtros','Filtro de Aire',9.60,10,4,'D-2','und',6.20,'G',16),
 P('7504004','Filtro de Gasolina G3727','Fram','Filtros y Mantenimiento','Filtros','Filtro de Combustible',5.40,2,6,'D-2','und',3.45,'G',16),
 P('7504005','Filtro de Cabina Carbón Activado','Bosch','Filtros y Mantenimiento','Filtros','Filtro de Cabina',11.50,8,4,'D-3','und',7.45,'G',16),
 P('7505001','Pastillas Delanteras Cerámicas','Bendix','Frenos y Suspensión','Frenos','Pastillas de Freno',24.00,9,4,'E-1','jgo',15.60,'G',16),
 P('7505002','Pastillas Traseras Semimetálicas','Bendix','Frenos y Suspensión','Frenos','Pastillas de Freno',19.00,7,4,'E-1','jgo',12.30,'G',16),
 P('7505003','Líquido de Frenos DOT 4 500 ml','Bosch','Frenos y Suspensión','Frenos','Líquido de Frenos',5.10,28,10,'E-2','und',3.30,'G',16),
 P('7505004','Disco de Freno Delantero Ventilado (par)','Brembo','Frenos y Suspensión','Frenos','Discos de Freno',58.00,0,2,'E-3','par',38.00,'G',16),
 P('7506001','Bujía Iridium','NGK','Eléctrico y Encendido','Encendido y eléctrico','Bujías',8.50,40,16,'F-1','und',5.50,'G',16),
 P('7506002','Bujía Estándar BKR5E','NGK','Eléctrico y Encendido','Encendido y eléctrico','Bujías',2.80,96,24,'F-1','und',1.75,'G',16),
 P('7506003','Batería 12V 45 Ah','Duncan','Eléctrico y Encendido','Encendido y eléctrico','Baterías',68.00,6,3,'F-3','und',46.00,'G',16),
 P('7506004','Juego de Cables de Bujía','Bosch','Eléctrico y Encendido','Encendido y eléctrico','Cables de Encendido',22.00,5,3,'F-2','jgo',14.20,'G',16),
 P('7507001','Refrigerante 50/50 Galón','Prestone','Lubricantes y Fluidos','Refrigerante y aditivos','Refrigerantes y Agua',9.80,18,6,'G-1','gal',6.35,'G',16),
 P('7507002','Limpia Inyectores 355 ml','STP','Lubricantes y Fluidos','Refrigerante y aditivos','Aditivos Motor y Combustible',5.60,24,8,'G-2','und',3.60,'G',16),
 P('7507003','Tratamiento Anti-fuga de Aceite 443 ml','STP','Lubricantes y Fluidos','Refrigerante y aditivos','Aditivos Motor y Combustible',6.20,13,5,'G-2','und',4.00,'G',16),
 P('7507004','Agua Destilada Galón','Genérico','Lubricantes y Fluidos','Refrigerante y aditivos','Refrigerantes y Agua',1.80,30,10,'G-3','gal',1.10,'E',0),
 P('7508001','Correa Serpentina 6PK1750','Gates','Filtros y Mantenimiento','Correas y accesorios','Correas de Motor',17.50,8,4,'H-1','und',11.30,'G',16),
 P('7508002','Kit de Correa de Tiempo','Gates','Filtros y Mantenimiento','Correas y accesorios','Correas de Motor',46.00,4,2,'H-1','jgo',30.00,'G',16),
 P('7509001','Escobillas Limpiaparabrisas 22" (par)','Bosch','Accesorios y Taller','Correas y accesorios','Limpiaparabrisas',9.00,15,6,'J-1','par',5.80,'G',16),
 P('7509002','Embudo Plástico para Aceite','Genérico','Accesorios y Taller','Correas y accesorios','Herramientas y Envases',1.50,22,6,'J-2','und',0.90,'G',16),
 P('7509003','Bandeja Recolectora de Aceite 15 L','Genérico','Accesorios y Taller','Correas y accesorios','Herramientas y Envases',6.80,9,3,'J-2','und',4.30,'G',16)
    ];
  };
  root.POS_SEED_FACTORY = seedFactory;
  root.POS_SEED_OPERATIONS = Object.freeze({
    sales: Object.freeze([
      Object.freeze([1038,8,12,0,Object.freeze([Object.freeze(['7501001',1,0])]),'pm']),
      Object.freeze([1039,9,5,4,Object.freeze([Object.freeze(['7510002',1,0]),Object.freeze(['7510003',1,0])]),'usd']),
      Object.freeze([1040,10,31,1,Object.freeze([Object.freeze(['7501006',2,5]),Object.freeze(['7504002',2,5]),Object.freeze(['7505003',1,0])]),'pv']),
      Object.freeze([1041,12,48,2,Object.freeze([Object.freeze(['7502002',6,0]),Object.freeze(['7503003',2,0])]),'bio']),
      Object.freeze([1042,16,20,0,Object.freeze([Object.freeze(['7506001',4,0]),Object.freeze(['7507002',1,0])]),'usd'])
    ]),
    purchases: Object.freeze({
      '7501001':24,'7501002':8,'7504001':20,'7504002':10,'7505001':6
    }),
    purchaseLines: Object.freeze([
      Object.freeze({code:'7504001',desc:'Fram Filtro de Aceite PH3600',qty:20,cost:3.00,sub:60.00}),
      Object.freeze({code:'7504002',desc:'Mann Filtro de Aceite W 712/75',qty:10,cost:5.10,sub:51.00}),
      Object.freeze({code:'7505001',desc:'Bendix Pastillas Delanteras Cerámicas',qty:6,cost:15.60,sub:93.60})
    ])
  });
})(window);
