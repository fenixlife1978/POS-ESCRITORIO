(function(){
  'use strict';
  const tipoLabel = Object.freeze({
    'ZELLE_PROV':'COMPRA USD ZELLE PARA PAGO DIRECTO A PROVEEDOR (TRIANGULACIÓN)',
    'USD_EFECTIVO':'COMPRA DE USD EN EFECTIVO FÍSICO A PERSONA NATURAL',
    'ZELLE_PROPIO':'COMPRA DE USD ZELLE PARA TESORERÍA / CUENTA PROPIA',
    'VENTA_USD':'CANJE DE USD EFECTIVO A BOLÍVARES (SALIDA DE CAJA)'
  });
  const tagClass = Object.freeze({
    'ZELLE_PROV':'cambio-tag zel-prv',
    'USD_EFECTIVO':'cambio-tag usd-efe',
    'ZELLE_PROPIO':'cambio-tag zel-own',
    'VENTA_USD':'cambio-tag vta'
  });
  const tagShort = Object.freeze({
    'ZELLE_PROV':'Zelle Proveedor',
    'USD_EFECTIVO':'USD Efectivo',
    'ZELLE_PROPIO':'Zelle Propio',
    'VENTA_USD':'Venta USD'
  });
  window.POS_CURRENCY_OPTIONS = Object.freeze({ tipoLabel, tagClass, tagShort });
})();
