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
