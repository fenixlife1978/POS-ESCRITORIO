/* Atajos de teclado documentados en la ayuda del POS. */
(function(){
  'use strict';
  const shortcuts = [
    ['F1','Control SENIAT/SUDEBAN'],['F2','Nueva venta'],['F3','Ir a código / búsqueda'],['F4','Seleccionar cliente'],['F5','Suspender venta'],['F6','Recuperar venta en espera'],
    ['F7','Descuento'],['F8','Maestro de Inventario'],['F9','Ventas del día y cierre'],['F10','Módulo de Compras'],['F11','Conteo físico masivo'],['F12','Cobrar'],
    ['↑ ↓','Moverse por el catálogo (en la caja de búsqueda) o por la venta'],['+ / −','Sumar o restar una unidad al renglón seleccionado'],
    ['Supr','Quitar el renglón seleccionado'],['3*texto','Agregar 3 unidades del producto buscado'],['Esc','Cerrar ventana o limpiar la búsqueda']
  ].map(row => Object.freeze(row));
  window.POS_HELP_SHORTCUTS = Object.freeze(shortcuts);
})();
