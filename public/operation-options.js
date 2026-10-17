/* Mapeo estático de colecciones locales a tipos de operación para sincronización. */
(function(){
  'use strict';
  window.POS_OPERATION_COLLECTIONS = Object.freeze([
    Object.freeze(['sales','sale']),
    Object.freeze(['purchases','purchase']),
    Object.freeze(['cxc','receivable']),
    Object.freeze(['cxp','payable']),
    Object.freeze(['cortesZ','cash-close']),
    Object.freeze(['kardex','inventory-movement']),
    Object.freeze(['counts','inventory-count']),
    Object.freeze(['held','held-sale']),
    Object.freeze(['casheaMovimientos','cashea-operation']),
    Object.freeze(['casheaLiquidaciones','cashea-settlement']),
    Object.freeze(['cambiosDivisas','currency-movement']),
    Object.freeze(['retencionesIva','tax-retention']),
    Object.freeze(['retentions','tax-retention']),
    Object.freeze(['returns','return']),
    Object.freeze(['voids','void'])
  ]);
})();
