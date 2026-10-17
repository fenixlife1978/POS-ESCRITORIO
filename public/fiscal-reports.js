/* Reportes y exportaciones fiscales. Fragmento ensamblado dentro del IIFE de main.js por scripts/build-main.mjs. */
function downloadBlob(filename, content, mimeType){
  const blob=new Blob([content],{type:mimeType||'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();
  setTimeout(()=>{a.remove();URL.revokeObjectURL(url);},500);
}

function printFiscalReport(title,html){
  let w=$('#fiscalPrintWrap');
  if(!w){
    w=document.createElement('div');
    w.id='fiscalPrintWrap';
    document.body.appendChild(w);
  }
  w.hidden=false;
  w.innerHTML='<div style="font-family:sans-serif;color:#10222B;line-height:1.35">'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #10222B;padding-bottom:8px;margin-bottom:12px">'+
      '<div>'+
        '<h2 style="margin:0;font-size:16px;text-transform:uppercase">'+esc(S.cfg.empresa)+'</h2>'+
        '<div style="font-size:11.5px"><b>RIF:</b> '+esc(S.cfg.rif)+' &middot; <b>Domicilio Fiscal:</b> '+esc(S.cfg.dir||'No especificado')+'</div>'+
        '<div style="font-size:11.5px"><b>Condición declarada en el POS:</b> '+(S.cfg.contribEspecial?'Sujeto Pasivo Especial (confirmar notificación)':'No confirmado como Sujeto Pasivo Especial')+' &middot; <b>Referencia:</b> '+esc(S.cfg.provEspecial||'No registrada')+'</div>'+
      '</div>'+
      '<div style="text-align:right">'+
        '<div style="font-weight:700;font-size:14px;color:#1842B8">'+esc(title)+'</div>'+
        '<div style="font-size:11px;color:#555">Fecha de Emisión: '+fmtDT(Date.now())+'</div>'+
        '<div style="font-size:11px;color:#555">Control Fiscal: '+esc(S.cfg.ctrlPrefix||'00-')+' &middot; Rango Aut. Imprenta</div>'+
      '</div>'+
    '</div>'+
    html+
    '<div style="margin-top:24px;border-top:1px dashed #888;padding-top:10px;display:flex;justify-content:space-between;font-size:10.5px;color:#555">'+
      '<div>Documento generado por SIFER 360 &middot; Sistema Administrativo y de Control Fiscal</div>'+
      '<div>Firma Contador / Administrador: _____________________________</div>'+
    '</div>'+
  '</div>';
  document.body.classList.add('printing-fiscal');
  window.print();
  setTimeout(()=>{
    document.body.classList.remove('printing-fiscal');
    if(w)w.hidden=true;
  },600);
}

function exportLibroVentasCsv(sales){
  const BOM='\uFEFF';
  const headers=window.POS_FISCAL_EXPORT_HEADERS.sales;
  const rows=sales.map((s,idx)=>{
    const due=r2(s.total+(s.igtf||0));
    const rate=s.rate||S.cfg.rate;
    const bG=s.baseG16!==undefined?s.baseG16:s.base;
    const bR=s.baseR8||0;
    const bA=s.baseA31||0;
    const bE=s.baseEx||0;
    const iva16=r2(bG*0.16);
    const iva8=r2(bR*0.08);
    const iva31=r2(bA*0.31);
    const igtfBs=r2((s.igtf||0)*rate);
    return [
      idx+1,
      fmtD(new Date(s.ts)),
      `"${s.client.rif}"`,
      `"${s.client.name.replace(/"/g,'""')}"`,
      pad(s.no),
      s.ctrlNo||('00-'+pad(s.no,8)),
      s.void?(s.voidDoc||('NC-'+pad(s.no,8))):'',
      s.void?pad(s.no):'',
      s.transType||(s.void?'03-ANUL':'01-REG'),
      due.toFixed(2),
      r2(due*rate).toFixed(2),
      r2(bE*rate).toFixed(2),
      r2(bG*rate).toFixed(2),
      r2(iva16*rate).toFixed(2),
      r2(bR*rate).toFixed(2),
      r2(iva8*rate).toFixed(2),
      r2(bA*rate).toFixed(2),
      r2(iva31*rate).toFixed(2),
      igtfBs.toFixed(2),
      (s.igtf||0).toFixed(2),
      '0.00',
      rate.toFixed(2)
    ].join(';');
  });
  const csv=BOM+[headers.join(';')].concat(rows).join('\r\n');
  downloadBlob(`Libro_Ventas_SENIAT_${S.cfg.rif}_${new Date().toISOString().slice(0,10)}.csv`,csv,'text/csv;charset=utf-8;');
  msg('Libro de Ventas Fiscal exportado a CSV con éxito.');
}

function exportLibroComprasCsv(purchases){
  const BOM='\uFEFF';
  const headers=window.POS_FISCAL_EXPORT_HEADERS.purchases;
  const rows=purchases.map((p,idx)=>{
    const rate=p.rate||S.cfg.rate;
    const retBs=p.retIva?r2(p.retIva*rate):r2(p.iva*0.75*rate);
    return [
      idx+1,
      fmtD(new Date(p.ts)),
      `"${p.supplier.rif}"`,
      `"${p.supplier.name.replace(/"/g,'""')}"`,
      p.docProv,
      p.ctrlProv||('00-'+pad(p.no+4400,8)),
      '01-REG',
      p.total.toFixed(2),
      r2(p.total*rate).toFixed(2),
      '0.00',
      r2(p.base*rate).toFixed(2),
      r2(p.iva*rate).toFixed(2),
      retBs.toFixed(2),
      p.retIvaDoc||('202610'+pad(idx+41,8)),
      rate.toFixed(2)
    ].join(';');
  });
  const csv=BOM+[headers.join(';')].concat(rows).join('\r\n');
  downloadBlob(`Libro_Compras_SENIAT_${S.cfg.rif}_${new Date().toISOString().slice(0,10)}.csv`,csv,'text/csv;charset=utf-8;');
  msg('Libro de Compras Fiscal exportado a CSV con éxito.');
}

function exportIgtfCsv(sales){
  const BOM='\uFEFF';
  const headers=window.POS_FISCAL_EXPORT_HEADERS.igtf;
  const rows=[];
  sales.forEach(s=>{
    const usdPays=(s.pays||[]).filter(p=>p.cur==='USD');
    if(!usdPays.length&&!(s.igtf>0))return;
    const rate=s.rate||S.cfg.rate;
    const baseUsd=usdPays.reduce((a,p)=>a+(p.id==='efUSD'?r2(p.amount/1.03):p.amount),0);
    const igtfUsd=s.igtf||r2(baseUsd*0.03);
    const igtfBs=r2(igtfUsd*rate);
    rows.push([
      pad(s.no),
      fmtDT(s.ts),
      `"${s.client.rif}"`,
      `"${s.client.name.replace(/"/g,'""')}"`,
      `"${usdPays.map(p=>p.name).join(' + ')}"`,
      baseUsd.toFixed(2),
      rate.toFixed(2),
      r2(baseUsd*rate).toFixed(2),
      '3.00%',
      igtfUsd.toFixed(2),
      igtfBs.toFixed(2)
    ].join(';'));
  });
  const csv=BOM+[headers.join(';')].concat(rows).join('\r\n');
  downloadBlob(`Percepcion_IGTF_SENIAT_${S.cfg.rif}_${new Date().toISOString().slice(0,10)}.csv`,csv,'text/csv;charset=utf-8;');
  msg('Reporte de Percepción IGTF exportado a CSV con éxito.');
}

function exportSeniatTxt(periodo){
  if(!periodo){const d=new Date();periodo=String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0');}
  const rifAgente=S.cfg.rif.replace(/[^A-Za-z0-9]/g,'').toUpperCase();
  const list=S.retencionesIva||[];
  if(!list.length){
    msg('No hay registros de retención IVA para el período '+periodo+'.','bad');
    return;
  }
  const lines=list.map(r=>{
    const rifProv=(r.supplier.rif||'').replace(/[^A-Za-z0-9]/g,'').toUpperCase();
    const fec=new Date(r.ts).toISOString().slice(0,10);
    const numFac=(r.docProv||'0001').replace(/[^A-Za-z0-9-]/g,'').slice(0,20);
    const numCtrl=(r.ctrlProv||'00-00000001').replace(/[^A-Za-z0-9-]/g,'').slice(0,20);
    const totBs=r2((r.base+r.iva)*(r.rate||S.cfg.rate)).toFixed(2);
    const baseBs=r2(r.base*(r.rate||S.cfg.rate)).toFixed(2);
    const retBs=r2(r.retainedBs||(r.iva*0.75*(r.rate||S.cfg.rate))).toFixed(2);
    const numComp=r.id||(periodo+pad(r.purchaseNo||1,8));
    return `${rifAgente}\t${periodo}\t${fec}\tC\t01\t${rifProv}\t${numFac}\t${numCtrl}\t${totBs}\t${baseBs}\t${retBs}\t0\t${numComp}\t0.00\t16.00\t0`;
  });
  const txt=lines.join('\r\n');
  downloadBlob(`RetencionesIVA_${rifAgente}_${periodo}.txt`,txt,'text/plain;charset=utf-8;');
  msg('Archivo de trabajo exportado. El contador debe validar formato y datos antes de cualquier carga o declaración ante el SENIAT.');
}

function printComprobanteRetencion(r){
  const rate=r.rate||S.cfg.rate;
  const totBs=r2((r.base+r.iva)*rate);
  const baseBs=r2(r.base*rate);
  const ivaBs=r2(r.iva*rate);
  const retBs=r2(r.retainedBs||(r.iva*0.75*rate));
  const html='<div style="padding:10px;border:1px solid #10222B;border-radius:6px">'+
    '<div style="text-align:center;font-weight:700;font-size:15px;margin-bottom:8px">COMPROBANTE DE RETENCIÓN DEL IMPUESTO AL VALOR AGREGADO (I.V.A.)</div>'+
    '<div style="text-align:center;font-size:11.5px;color:#444;margin-bottom:14px">Ley de IVA &middot; Artículos 11 y Providencia Administrativa SNAT/2015/0049 para Sujetos Pasivos Especiales</div>'+
    '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px">'+
      '<tr><td style="padding:4px;border:1px solid #BAC7CE;background:#f5f5f5;width:25%"><b>Nº Comprobante:</b></td><td style="padding:4px;border:1px solid #BAC7CE;font-family:monospace;font-weight:700">'+esc(r.id)+'</td><td style="padding:4px;border:1px solid #BAC7CE;background:#f5f5f5;width:20%"><b>Fecha Emisión:</b></td><td style="padding:4px;border:1px solid #BAC7CE">'+fmtD(new Date(r.ts))+'</td></tr>'+
      '<tr><td style="padding:4px;border:1px solid #BAC7CE;background:#f5f5f5"><b>Agente de Retención:</b></td><td style="padding:4px;border:1px solid #BAC7CE">'+esc(S.cfg.empresa)+' ('+esc(S.cfg.rif)+')</td><td style="padding:4px;border:1px solid #BAC7CE;background:#f5f5f5"><b>Período Fiscal:</b></td><td style="padding:4px;border:1px solid #BAC7CE">'+esc(r.periodo||'202610')+'</td></tr>'+
      '<tr><td style="padding:4px;border:1px solid #BAC7CE;background:#f5f5f5"><b>Proveedor Sujeto:</b></td><td style="padding:4px;border:1px solid #BAC7CE" colspan="3">'+esc(r.supplier.name)+' &middot; <b>RIF:</b> '+esc(r.supplier.rif)+'</td></tr>'+
    '</table>'+
    '<table style="width:100%;border-collapse:collapse;font-size:11.5px;text-align:right">'+
      '<thead><tr style="background:#10222B;color:#fff"><th style="padding:5px;text-align:center">Operación</th><th style="padding:5px;text-align:center">Nº Factura</th><th style="padding:5px;text-align:center">Nº Control</th><th style="padding:5px">Total Bs.</th><th style="padding:5px">Base Imponible Bs.</th><th style="padding:5px">IVA 16% Bs.</th><th style="padding:5px;text-align:center">% Ret.</th><th style="padding:5px">IVA Retenido Bs.</th></tr></thead>'+
      '<tbody><tr><td style="padding:6px;border:1px solid #BAC7CE;text-align:center">01-COMPRA</td><td style="padding:6px;border:1px solid #BAC7CE;text-align:center;font-family:monospace">'+esc(r.docProv)+'</td><td style="padding:6px;border:1px solid #BAC7CE;text-align:center;font-family:monospace">'+esc(r.ctrlProv)+'</td><td style="padding:6px;border:1px solid #BAC7CE">'+nf(totBs)+'</td><td style="padding:6px;border:1px solid #BAC7CE">'+nf(baseBs)+'</td><td style="padding:6px;border:1px solid #BAC7CE">'+nf(ivaBs)+'</td><td style="padding:6px;border:1px solid #BAC7CE;text-align:center;font-weight:700">'+fq(r.pct||75)+'%</td><td style="padding:6px;border:1px solid #BAC7CE;font-weight:700;color:#1842B8">'+nf(retBs)+'</td></tr></tbody>'+
    '</table>'+
    '<div style="margin-top:16px;padding:8px;background:#EDF7F0;border:1px solid #BEE7C8;border-radius:4px;font-size:11.5px;color:#1D6F39">'+
      '<b>Monto Retenido en Letras:</b> Retención del 75% correspondiente al impuesto facturado por un total de <b>'+nf(retBs)+' Bolívares</b> (Equivalente: US$ '+nf(r.retainedUsd||(r.iva*0.75))+').'+
    '</div>'+
  '</div>';
  printFiscalReport('Comprobante de Retención IVA — '+r.id,html);
}

function printActaBcv(sales){
  const ok=sales.filter(s=>!s.void);
  const rowsHtml=ok.map(s=>'<tr><td style="padding:4px;border:1px solid #BAC7CE;font-family:monospace">'+pad(s.no)+'</td><td style="padding:4px;border:1px solid #BAC7CE">'+fmtDT(s.ts)+'</td><td style="padding:4px;border:1px solid #BAC7CE">'+esc(s.client.name)+'</td><td style="padding:4px;border:1px solid #BAC7CE;text-align:right">'+nf(s.total+(s.igtf||0))+'</td><td style="padding:4px;border:1px solid #BAC7CE;text-align:right;font-weight:700;color:#1842B8">'+nf(s.rate||S.cfg.rate)+'</td><td style="padding:4px;border:1px solid #BAC7CE;text-align:right">'+nf((s.total+(s.igtf||0))*(s.rate||S.cfg.rate))+'</td><td style="padding:4px;border:1px solid #BAC7CE;text-align:center;color:#1D6F39;font-weight:700">100% CONFORME BCV</td></tr>').join('');
  const html='<div style="font-size:12px">'+
    '<div style="background:#EBF7EE;border:1px solid #BEE7C8;padding:10px;border-radius:6px;margin-bottom:12px">'+
      '<h3 style="margin:0 0 4px;font-size:14px;color:#1D6F39">ACTA DE FISCALIZACIÓN Y CONFORMIDAD CAMBIARIA (BANCO CENTRAL DE VENEZUELA)</h3>'+
      '<p style="margin:0;font-size:11.5px;color:#144A75">Se hace constar ante los funcionarios del <b>SENIAT</b> y la <b>SUNDDE</b> que la entidad <b>'+esc(S.cfg.empresa)+'</b> (RIF: '+esc(S.cfg.rif)+') aplica de manera estricta y sin excepciones la <b>Tasa Oficial publicada por el Banco Central de Venezuela (BCV)</b> en todas sus operaciones comerciales y documentos de venta.</p>'+
    '</div>'+
    '<table style="width:100%;border-collapse:collapse;font-size:11px">'+
      '<thead><tr style="background:#10222B;color:#fff"><th style="padding:5px">Factura</th><th style="padding:5px">Fecha/Hora</th><th style="padding:5px">Cliente</th><th style="padding:5px;text-align:right">Total US$</th><th style="padding:5px;text-align:right">Tasa Oficial BCV</th><th style="padding:5px;text-align:right">Total Facturado Bs.</th><th style="padding:5px;text-align:center">Verificación</th></tr></thead>'+
      '<tbody>'+rowsHtml+'</tbody>'+
    '</table>'+
  '</div>';
  printFiscalReport('Acta de Cumplimiento de Precios y Tasa BCV',html);
}
