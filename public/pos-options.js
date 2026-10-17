/* Datos estáticos de opciones del POS. Se cargan antes de main.js. */
(function(){
'use strict';
window.POS_OPTIONS = Object.freeze({
  MOTIVOS: [
  'Conteo físico periódico',
  'Diferencia de inventario / cuadre',
  'Merma / derrame / evaporación',
  'Producto dañado o averiado',
  'Producto vencido',
  'Error de despacho / facturación',
  'Error de recepción de compra',
  'Sobrante encontrado en almacén',
  'Muestra / consumo interno taller',
  'Hurto / extravío'
],
  UM_OPTIONS: [
  {id:'und',name:'Unidad (und)'},
  {id:'L',name:'Litro (L)'},
  {id:'gal',name:'Galón (gal)'},
  {id:'kg',name:'Kilogramo (kg)'},
  {id:'g',name:'Gramo (g)'},
  {id:'m',name:'Metro (m)'},
  {id:'par',name:'Par (par)'},
  {id:'jgo',name:'Juego / Kit (jgo)'},
  {id:'caja',name:'Caja (caja)'},
  {id:'pz',name:'Pieza (pz)'}
],
  TAX_OPTIONS: [
  {type:'G',rate:16,name:'Gravado 16 % (G)',tag:'16%',cls:''},
  {type:'R',rate:8,name:'Reducido 8 % (R)',tag:'8% Red.',cls:'red'},
  {type:'A',rate:31,name:'Adicional / Suntuario 31 % (A)',tag:'31% Adic.',cls:'adic'},
  {type:'E',rate:0,name:'Exento 0 % (E)',tag:'Exento (0%)',cls:'ex'},
  {type:'NS',rate:0,name:'No Sujeto 0 % (NS)',tag:'No Suj. (0%)',cls:'ex'}
],
  METHODS: [
 {id:'efUSD',name:'Efectivo US$',cur:'USD'},
 {id:'zelle',name:'Zelle',cur:'USD'},
 {id:'cashea',name:'Cashea (BNPL)',cur:'USD',isCashea:true},
 {id:'efBs',name:'Efectivo Bs.',cur:'VES'},
 {id:'punto',name:'Punto de venta (débito / crédito)',cur:'VES'},
 {id:'biopago',name:'Biopago',cur:'VES'},
 {id:'pmovil',name:'Pago móvil',cur:'VES'},
 {id:'transf',name:'Transferencia Bs.',cur:'VES'}
],
  IC: {
 nueva:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M12 11v6M9 14h6"/>',
 buscar:'<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/>',
 ver:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 cliente:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-4 3.5-6 7-6s7 2 7 6"/>',
 suspender:'<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
 recuperar:'<path d="M4 15v4h16v-4M12 4v10M8 8l4-4 4 4"/>',
 descuento:'<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M19 5L5 19"/>',
 quitar:'<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v6M14 11v6"/>',
 inventario:'<path d="M3 8l9-5 9 5v9l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v9"/>',
 conteo:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/><path d="M16 14l2 2 4-4"/>',
 kardex:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11M14 9v11"/>',
 compras:'<path d="M3 4h3l2.5 10h9l2-7H7.5"/><circle cx="9.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/><path d="M13 3v6M10 6l3 3 3-3"/>',
 cxc:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h2M16 15h2"/>',
 cxp:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h10M7 14h6"/><path d="M18 3l3 3-3 3"/>',
 ventas:'<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
 tasa:'<path d="M4 8h13M13 4l4 4-4 4M20 16H7M11 12l-4 4 4 4"/>',
 seniat:'<path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/><path d="M9 12l2 2 4-4"/>',
 divisas:'<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
 cashea:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M7 15h3M14 15h3"/>',
 basedatos:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
 documentos:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
 usuarios:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-4 2.5-6 6.5-6s6.5 2 6.5 6M17 8a3 3 0 0 1 0 6M18 15c2.5.5 3.5 2 3.5 5"/>',
 cajas:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5M16 4v5M7 14h4M7 17h7"/>',
 pos:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M7 14h3M14 14h3M7 17h10"/>'
},
  TICKET_FONTS: [
  {id:'ibm',name:'Térmica POS 80mm (IBM Plex Mono)',css:'"IBM Plex Mono",Consolas,"Liberation Mono",monospace'},
  {id:'jetbrains',name:'Térmica Alta Nitidez (JetBrains Mono)',css:'"JetBrains Mono",Consolas,monospace'},
  {id:'courier',name:'Térmica Fiscal Clásica (Courier Prime / Courier New)',css:'"Courier Prime","Courier New",Courier,monospace'},
  {id:'roboto',name:'Térmica Condensada Epson/Bixolon (Roboto Mono)',css:'"Roboto Mono","Lucida Console",Consolas,monospace'},
  {id:'inconsolata',name:'Térmica Compacta Tirilla (Inconsolata / Lucida)',css:'"Inconsolata","Lucida Console",Consolas,monospace'},
  {id:'sans',name:'Térmica Comercial Moderna (Segoe UI / Tahoma Tabular)',css:'"Segoe UI",Tahoma,Verdana,sans-serif'}
]
});
})();
