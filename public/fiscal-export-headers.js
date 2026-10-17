/* Encabezados estáticos de exportaciones fiscales CSV. Se preservan literalmente. */
(function (root) {
  'use strict';
  const headers = {
    sales: [
      'Nro_Operacion','Fecha_Emision','RIF_Cliente','Nombre_Razon_Social',
      'Numero_Factura','Numero_Control','Numero_Nota_Credito','Factura_Afectada',
      'Tipo_Transaccion','Total_Ventas_USD','Total_Ventas_Bs','Ventas_Exentas_Bs',
      'Base_Imponible_16_Bs','Debito_Fiscal_16_Bs','Base_Reducida_8_Bs','Debito_Reducido_8_Bs',
      'Base_Adicional_31_Bs','Debito_Adicional_31_Bs','IGTF_3_Divisas_Bs','IGTF_3_Divisas_USD',
      'IVA_Retenido_Bs','Tasa_BCV'
    ],
    purchases: [
      'Nro_Operacion','Fecha_Emision','RIF_Proveedor','Nombre_Proveedor',
      'Numero_Factura_Proveedor','Numero_Control_Proveedor','Tipo_Transaccion',
      'Total_Compras_USD','Total_Compras_Bs','Compras_Exentas_Bs',
      'Base_Imponible_16_Bs','Credito_Fiscal_16_Bs','IVA_Retenido_75_Bs',
      'Comprobante_Retencion','Tasa_BCV'
    ],
    igtf: [
      'Factura','Fecha','RIF_Cliente','Cliente','Forma_Pago_Divisa',
      'Monto_USD_Sujeto_IGTF','Tasa_BCV','Base_Imponible_Bs','Alicuota_IGTF',
      'IGTF_Percibido_USD','IGTF_Percibido_Bs'
    ]
  };
  Object.values(headers).forEach(Object.freeze);
  root.POS_FISCAL_EXPORT_HEADERS = Object.freeze(headers);
})(window);
