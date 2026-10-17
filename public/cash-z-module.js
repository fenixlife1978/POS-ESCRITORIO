/* Cashbox, opening, reconciliation, and Z close workflows. Dependencias compartidas: estado y utilidades globales de main.js. */
function getZHistory(){
  if(!Array.isArray(S.cortesZ))S.cortesZ=[];
  return S.cortesZ;
}
function moneyTotal(rows,fn){
  return r2(rows.reduce((a,x)=>a+fn(x),0));
}
function zPayTotals(sales){
  const out={};
  sales.forEach(s=>(s.pays||[]).forEach(p=>{
    const k=(p.name||p.id||'Otro')+' ('+(p.cur||'USD')+')';
    out[k]=(out[k]||0)+Number(p.amount||0);
  }));
  return out;
}
function zOperationalTotals(sales,start,end,box){
  const inPeriod=ts=>Number(ts)>=Number(start)&&Number(ts)<=Number(end);
  const out={cxcUsd:0,cxcBs:0,casheaUsd:0,creditSalesUsd:0,cashInUsd:0,cashOutUsd:0,cashInBs:0,cashOutBs:0,movementCount:0};
  (S.cxc||[]).forEach(item=>{
    if(item.cashbox&&String(item.cashbox)!==String(box))return;
    (item.payments||[]).forEach(p=>{if(inPeriod(p.ts)){out.cxcUsd=r2(out.cxcUsd+Number(p.amountUsd||0));out.cxcBs=r2(out.cxcBs+Number(p.amountBs||0));}});
  });
  sales.filter(s=>!s.void).forEach(s=>(s.pays||[]).forEach(p=>{if(p.id==='credito')out.creditSalesUsd=r2(out.creditSalesUsd+Number(p.amount||0));}));
  const saleNos=new Set(sales.filter(s=>!s.void&&String(s.cashbox||box)===String(box)).map(s=>String(s.no)));
  (S.casheaLiquidaciones||[]).forEach(lot=>{
    if(lot.tipo==='REVERSIÓN'||lot.estado==='Revertido'||!inPeriod(lot.fecha))return;
    const ops=Array.isArray(lot.operaciones)?lot.operaciones:[];
    if((S.casheaMovimientos||[]).some(m=>ops.includes(m.id)&&saleNos.has(String(m.ventaNo))))out.casheaUsd=r2(out.casheaUsd+Number(lot.depositadoUsd||0));
  });
  (S.movimientosCaja||[]).forEach(m=>{
    if(String(m.cashbox||box)!==String(box)||!inPeriod(m.ts))return;
    const currency=m.currency==='USD'?'Usd':'Bs',direction=m.direction==='IN'?'In':'Out',key='cash'+direction+currency;
    out[key]=r2(out[key]+Math.max(0,Number(m.amount||0)));out.movementCount++;
  });
  return out;
}
function readActiveOpening(){
  try{
    const sessionValue=JSON.parse(sessionStorage.getItem('sifer360_active_opening')||'null');
    if(sessionValue&&sessionValue.status==='abierta')return sessionValue;
    const localValue=JSON.parse(localStorage.getItem('sifer360_active_opening')||'null');
    return localValue||sessionValue||null;
  }catch(e){return null;}
}
function writeActiveOpening(opening){
  const value=JSON.stringify(opening);
  localStorage.setItem('sifer360_active_opening',value);
  sessionStorage.setItem('sifer360_active_opening',value);
}
function zExpectedByMethod(sales,opening){
  const out={};
  METHODS.forEach(m=>out[m.id]=0);
  out.efBs=Number(opening&&opening.bs||0);
  out.efUSD=Number(opening&&opening.usd||0);
  sales.forEach(s=>{
    (s.pays||[]).forEach(p=>{
      if(Object.prototype.hasOwnProperty.call(out,p.id))out[p.id]+=Number(p.amount||0);
    });
    const change=Math.max(0,Number(s.change||0));
    if(change>0){
      const rate=Number(s.rate||S.cfg.rate||1)||1;
      const cashUsd=(s.pays||[]).filter(p=>p.id==='efUSD').reduce((a,p)=>a+Number(p.amount||0),0);
      const cashBs=(s.pays||[]).filter(p=>p.id==='efBs').reduce((a,p)=>a+Number(p.amount||0),0);
      const usdEquivalent=cashUsd+cashBs/rate;
      if(usdEquivalent>0){
        const usdChange=change*(cashUsd/usdEquivalent);
        const bsChange=change*(cashBs/rate/usdEquivalent)*rate;
        out.efUSD-=usdChange;
        out.efBs-=bsChange;
      }
    }
  });
  (S.movimientosCaja||[]).forEach(m=>{
    if(String(m.cashbox||opening.cashbox||'')!==String(opening.cashbox||m.cashbox||'')||Number(m.ts)<Number(opening.openedAt||0))return;
    const key=m.currency==='USD'?'efUSD':(m.currency==='BS'?'efBs':null);
    if(!key)return;
    const amount=Math.max(0,Number(m.amount||0));
    out[key]+=m.direction==='IN'?amount:-amount;
  });
  Object.keys(out).forEach(k=>out[k]=r2(k==='efBs'||k==='efUSD'?out[k]:Math.max(0,out[k])));
  return out;
}
function zDiffStatus(rows){
  const diffs=rows.map(r=>Number(r.diff||0));
  const hasShort=diffs.some(d=>d<-.009);
  const hasOver=diffs.some(d=>d>.009);
  if(!hasShort&&!hasOver)return 'CONCILIADO · CUADRA';
  if(hasShort&&hasOver)return 'CON DIFERENCIAS · FALTANTES Y SOBRANTES';
  return hasShort?'FALTANTE':'SOBRANTE';
}
function printCorteZ(z,autoPrint){
  const w=window.open('','_blank','width=420,height=800');
  if(!w){msg('Permite ventanas emergentes para mostrar o imprimir el Corte Z.','bad');return;}
  const line=(a,b)=>'<div class="zr"><span>'+esc(a)+'</span><b>'+esc(b==null?'—':String(b))+'</b></div>';
  const reconciliation=Array.isArray(z.reconciliation)?z.reconciliation:[];
  const recHtml=reconciliation.map(r=>'<div class="zrec"><b>'+esc(r.name)+' ('+esc(r.cur)+')</b><div class="zrecvals"><span>Sist. '+esc(nf(r.system))+'</span><span>Real '+esc(r.real==null?'—':nf(r.real))+'</span><b>Dif. '+esc(r.diff==null?'—':(r.diff>0?'+':'')+nf(r.diff))+'</b></div></div>').join('');
  const notes=z.observations?line('Observaciones',z.observations):'';
  const html='<div class="zpaper"><center><b>'+esc(S.cfg.empresa||'SIFER 360')+'</b><br>REPORTE Z · CIERRE DE CAJA<br><small>REPORTE DE CONTROL INTERNO · NO FISCAL</small></center><hr>'+
    line('Corte Z',z.id)+line('Fecha',fmtDT(z.closedAt))+line('Caja',z.cashbox)+line('Cajero',z.cashier)+line('Desde',z.openedAt?fmtDT(z.openedAt):'—')+line('Desde factura',z.invoiceFrom||'—')+line('Hasta factura',z.invoiceTo||'—')+
    '<hr><b>RESUMEN DE VENTAS</b>'+line('Facturas válidas',String(z.salesCount))+line('Anulaciones',String(z.voidCount))+line('Ventas netas USD',usd(z.netUsd))+line('Ventas netas Bs.',bsf(z.netBs))+line('IVA USD',usd(z.ivaUsd))+line('IGTF USD',usd(z.igtfUsd))+
    '<hr><b>RESUMEN DE COBROS Y CRÉDITOS</b>'+line('Cobros de CxC recibidos',usd(z.detailTotals&&z.detailTotals.cxcUsd||0)+' / '+bsf(z.detailTotals&&z.detailTotals.cxcBs||0))+line('Depósitos Cashea recibidos',usd(z.detailTotals&&z.detailTotals.casheaUsd||0))+line('Ventas a crédito generadas (CxC)',usd(z.detailTotals&&z.detailTotals.creditSalesUsd||0))+
    '<hr><b>TOTALES COBRADOS · POR MÉTODO</b>'+(Object.keys(z.payments||{}).length?Object.entries(z.payments).map(([name,amount])=>line(name,name.includes('(VES)')?bsf(amount):usd(amount))).join(''):'<div class="zrec">No hay cobros registrados por método en este corte.</div>')+'<hr><b>ARQUEO DE CAJA · POR MÉTODO</b><div class="zrec-head"><b>SISTEMA</b> / <b>REAL CONTADO O CONCILIADO</b> / <b>DIFERENCIA</b></div>'+(recHtml||'<div class="zrec">Este Corte Z no contiene detalle de arqueo por método.</div>')+
    '<hr><b>RESULTADO DEL ARQUEO</b>'+line('Estado de conciliación',z.reconciliationStatus||(reconciliation.length?zDiffStatus(reconciliation):'SIN ARQUEO DETALLADO · CORTE ANTERIOR'))+line('Faltante USD',usd(z.shortageUsd||0))+line('Sobrante USD',usd(z.surplusUsd||0))+line('Faltante Bs.',bsf(z.shortageBs||0))+line('Sobrante Bs.',bsf(z.surplusBs||0))+
    '<hr><b>MOVIMIENTOS DE EFECTIVO FÍSICO</b>'+line('Entradas efectivo USD (+)',usd(z.detailTotals&&z.detailTotals.cashInUsd||0))+line('Salidas efectivo USD (−)',usd(z.detailTotals&&z.detailTotals.cashOutUsd||0))+line('Entradas efectivo Bs. (+)',bsf(z.detailTotals&&z.detailTotals.cashInBs||0))+line('Salidas efectivo Bs. (−)',bsf(z.detailTotals&&z.detailTotals.cashOutBs||0))+line('Cantidad de movimientos',String(z.detailTotals&&z.detailTotals.movementCount||0))+notes+
    '<hr>'+line('Operador',z.cashier)+line('Generado',new Date(z.closedAt).toLocaleString('es-VE'))+'<hr><center>Conserve este reporte para auditoría interna.<br>La impresión no sustituye una factura fiscal ni registra una operación directamente en una impresora fiscal.</center></div>';
  const printScript=autoPrint?'window.onload=()=>{window.focus();window.print()}':'window.onload=()=>window.focus()';
  const previewToolbar='<div class="zpreview-tools"><b>Vista previa de impresión · Térmica 80 mm</b><button type="button" onclick="window.print()">Imprimir 80 mm</button><button type="button" onclick="window.close()">Cerrar vista previa</button></div>';
  const previewCss='.zpreview-tools{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding:10px;background:#f1f5f9;border-bottom:1px solid #cbd5e1;font:13px Arial,sans-serif}.zpreview-tools button{padding:8px 12px;cursor:pointer;border:1px solid #64748b;border-radius:5px;background:#fff;font-weight:600}';
  w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>'+esc(z.id)+'</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>@page{size:80mm auto;margin:3mm}*{box-sizing:border-box}body{margin:0;color:#000;font:10px/1.3 "Courier New",monospace}.zpaper{width:74mm;margin:auto}.zr{display:flex;justify-content:space-between;align-items:flex-start;gap:5px;margin:3px 0}.zr span{max-width:48mm;overflow-wrap:anywhere}.zr b{text-align:right;overflow-wrap:anywhere}.zrec{margin:5px 0;border-bottom:1px dotted #777;padding-bottom:4px}.zrecvals{display:flex;justify-content:space-between;gap:3px;font-size:9px;flex-wrap:wrap}.zrec-head{font-size:9px;margin:4px 0}hr{border:0;border-top:1px dashed #333;margin:7px 0}center{line-height:1.5}small{font-size:8px}'+previewCss+'@media print{body{width:74mm}.zpreview-tools{display:none!important}}</style></head><body>'+(autoPrint?'':previewToolbar)+html+'<script>'+printScript+'<\/script></body></html>');
  w.document.close();
}
function corteZDlg(){
  const login=activeUser(),openingNow=readActiveOpening();
  if(login.role==='admin'&&currentCaja()==='SIN-ASIGNAR'){adminCajaRequiredDlg('Corte Z');return;}
  if(!openingNow||openingNow.status!=='abierta'||String(openingNow.cashbox)!==currentCaja()){adminCajaRequiredDlg('Corte Z');return;}
  let active=readActiveOpening();
  const box=currentCaja();
  const boxOpen=()=>!!(active&&String(active.cashbox)===box&&active.status==='abierta');
  const shiftStart=()=>active&&active.openedAt?new Date(active.openedAt).getTime():Date.now();
  const el=h('<div class="form"><div class="hint" id="zIntro">Arqueo previo obligatorio: compare el saldo que registra el sistema con el importe real de cada método. La diferencia se calcula como Real − Sistema. El cierre guarda una fotografía inalterable del turno y después permite imprimir el reporte térmico de 80 mm.</div>'+
    '<section id="zOpenPanel" hidden style="border:1px solid var(--lo);padding:10px;margin:8px 0;border-radius:6px"><b>Apertura de turno / fondo inicial</b><p class="hint">Si esta caja todavía no tiene un turno abierto, registre el fondo inicial antes de realizar el arqueo.</p><div class="row"><label>Fondo inicial Bs. <input class="fld r" id="zOpeningBs" value="0,00" inputmode="decimal" style="width:125px"></label><label>Fondo inicial US$ <input class="fld r" id="zOpeningUsd" value="0,00" inputmode="decimal" style="width:125px"></label><button class="btn primary" id="zOpenShift">Abrir turno</button></div><div class="hint" id="zOpenStatus"></div></section>'+
    '<div class="gridwrap"><table class="grid"><thead><tr><th>Resumen del turno</th><th class="r">Total</th></tr></thead><tbody id="zSummary"></tbody></table></div>'+
    '<section id="zArqueoPanel" style="border:2px solid var(--ac);padding:12px;margin:10px 0;border-radius:8px"><h3 style="margin:0 0 6px">ARQUEO PREVIO POR MÉTODO DE PAGO</h3><p class="hint" style="margin:4px 0 10px">Este formulario es obligatorio para el Corte Z. Abra el turno primero; luego escriba el monto real contado o conciliado en cada método. Si no tuvo movimientos, escriba 0,00. La diferencia se calcula automáticamente.</p><div class="gridwrap"><table class="grid" style="min-width:660px"><thead><tr><th>Método de pago</th><th>Moneda</th><th class="r">Saldo en sistema</th><th class="r">Monto real contado / conciliado</th><th class="r">Dif. (+/−)</th></tr></thead><tbody id="zReconcile"></tbody><tfoot id="zReconcileFoot"></tfoot></table></div><div class="gridwrap"><table class="grid"><thead><tr><th>Totales de arqueo</th><th class="r">US$</th><th class="r">Bs.</th></tr></thead><tbody id="zTotals"></tbody></table></div></section>'+
    '<section style="border:1px solid var(--lo);padding:10px;margin:8px 0;border-radius:6px"><b>Movimientos de efectivo físico (+ / −)</b><div class="row" style="flex-wrap:wrap"><label>Tipo <select class="fld" id="zMovDir"><option value="IN">Entrada (+)</option><option value="OUT">Salida (−)</option></select></label><label>Moneda <select class="fld" id="zMovCur"><option value="BS">Efectivo Bs.</option><option value="USD">Efectivo USD</option></select></label><label>Monto <input class="fld r" id="zMovAmount" inputmode="decimal" placeholder="0,00" style="width:110px"></label><label>Motivo <input class="fld" id="zMovReason" maxlength="160" placeholder="Ej. retiro para sencillo" style="min-width:190px"></label><button class="btn" id="zMovAdd">Registrar movimiento</button></div><div class="hint" id="zMovStatus">Registre entradas o salidas de efectivo físico para que aparezcan en el cierre.</div><div id="zMovRows"></div></section>'+
    '<label for="zObservations">Observaciones del cierre</label><textarea class="fld" id="zObservations" rows="2" placeholder="Explique faltantes, sobrantes, depósitos pendientes o incidencias."></textarea>'+
    '<div class="row" style="margin:10px 0;gap:8px;flex-wrap:wrap"><button class="btn" id="zPreview">Vista previa del reporte Z · 80 mm</button><button class="btn primary" id="zClose">Confirmar cierre e imprimir</button></div><div class="hint" id="zActionStatus" role="status" aria-live="polite">Abra el turno y complete el arqueo para habilitar el cierre.</div>'+
    '<p class="hint">El botón de impresión abre el diálogo del sistema para seleccionar una impresora térmica de 80 mm. Este reporte es no fiscal; una impresora fiscal requiere su integración/controlador homologado para emitir documentos fiscales.</p>'+
    '<h3>Historial de Cortes Z</h3><div class="gridwrap"><table class="grid" style="min-width:560px"><thead><tr><th>Corte</th><th>Fecha</th><th>Cajero</th><th class="r">Ventas USD</th><th>Resultado</th><th>Acciones</th></tr></thead><tbody id="zHistory"></tbody></table></div></div>');
  const getPeriodSales=()=>S.sales.filter(s=>String(s.cashbox||box)===box&&Number(s.ts)>=shiftStart());
  const getRows=()=>{
    const sales=getPeriodSales().filter(s=>!s.void);
    const expected=zExpectedByMethod(sales,active||{});
    return METHODS.map(m=>({id:m.id,name:m.name,cur:m.cur,system:r2(expected[m.id]||0)}));
  };
  const readReal=()=>{
    const out={};
    $$('#zReconcile [data-z-real]',el).forEach(input=>{out[input.dataset.zReal]=pnZero(input.value);});
    return out;
  };
  const calculate=()=>{
    const rows=getRows(),real=readReal();
    const rec=rows.map(r=>Object.assign({},r,{real:real[r.id],diff:real[r.id]===null||real[r.id]===undefined?null:r2(real[r.id]-r.system)}));
    const total={shortageUsd:0,surplusUsd:0,shortageBs:0,surplusBs:0,complete:rec.every(r=>r.diff!==null)};
    rec.forEach(r=>{
      if(r.diff===null)return;
      const short=Math.max(0,-r.diff),over=Math.max(0,r.diff);
      if(r.cur==='USD'){total.shortageUsd=r2(total.shortageUsd+short);total.surplusUsd=r2(total.surplusUsd+over);}
      else{total.shortageBs=r2(total.shortageBs+short);total.surplusBs=r2(total.surplusBs+over);}
    });
    total.status=!total.complete?'PENDIENTE DE COMPLETAR ARQUEO':zDiffStatus(rec);
    return {rec,total};
  };
  const updateTotals=()=>{
    const result=calculate(),t=result.total;
    $('#zReconcileFoot',el).innerHTML='<tr><th colspan="2">Balance</th><th class="r">—</th><th class="r">Montos reales</th><th class="r">'+(t.complete?esc(t.status):'Pendiente')+'</th></tr>';
    $('#zTotals',el).innerHTML=[
      ['Faltante',usd(t.shortageUsd),bsf(t.shortageBs)],
      ['Sobrante',usd(t.surplusUsd),bsf(t.surplusBs)],
      ['Estado',t.status,'']
    ].map(r=>'<tr><td>'+esc(r[0])+'</td><td class="r"><b>'+esc(r[1])+'</b></td><td class="r"><b>'+esc(r[2])+'</b></td></tr>').join('');
    return result;
  };
  const draw=()=>{
    active=readActiveOpening();
    const opened=boxOpen();
    $('#zOpenStatus',el).textContent=opened?'Turno abierto desde '+fmtDT(active.openedAt)+' · Caja '+box+' · '+String(active.cashier||currentCajero()):'No hay un turno abierto para esta caja. Registre el fondo inicial y pulse Abrir turno.';
    $('#zOpenPanel',el).hidden=opened;
    $('#zIntro',el).textContent=opened?'La apertura de caja ya está registrada. Se reutiliza el turno iniciado al entrar al POS; no debe abrir otro turno aquí. Complete el arqueo real de los 8 métodos, revise la vista previa de 80 mm y luego confirme el cierre.':'No se detectó una apertura válida para esta caja. Registre el fondo inicial aquí solo si no se hizo al iniciar sesión. El arqueo por los 8 métodos seguirá siendo obligatorio antes del cierre.';
    $('#zOpenPanel',el).style.opacity='1';
    $('#zOpenShift',el).disabled=opened;
    $('#zOpeningBs',el).disabled=opened;
    $('#zOpeningUsd',el).disabled=opened;
    const period=getPeriodSales(),validSales=period.filter(s=>!s.void),voidSales=period.filter(s=>s.void);
    $('#zSummary',el).innerHTML=[['Facturas válidas',String(validSales.length)],['Anulaciones',String(voidSales.length)],['Ventas netas USD',usd(moneyTotal(validSales,s=>Number(s.total||0)))],['Ventas netas Bs.',bsf(moneyTotal(validSales,s=>Number(s.total||0)*Number(s.rate||S.cfg.rate||0)))],['IVA USD',usd(moneyTotal(validSales,s=>Number(s.iva||0)))],['IGTF USD',usd(moneyTotal(validSales,s=>Number(s.igtf||0)))]] .map(r=>'<tr><td>'+esc(r[0])+'</td><td class="r"><b>'+esc(r[1])+'</b></td></tr>').join('');
    const oldReal=readReal();
    const movements=(S.movimientosCaja||[]).filter(m=>String(m.cashbox||box)===String(box)&&Number(m.ts)>=shiftStart()&&Number(m.ts)<=Date.now()).sort((a,b)=>Number(b.ts)-Number(a.ts));
    $('#zMovRows',el).innerHTML=movements.length?'<div class="gridwrap"><table class="grid"><thead><tr><th>Fecha</th><th>Movimiento</th><th>Motivo</th><th class="r">Monto</th><th>Usuario</th></tr></thead><tbody>'+movements.map(m=>'<tr><td>'+esc(fmtDT(m.ts))+'</td><td>'+esc((m.direction==='IN'?'Entrada (+)':'Salida (−)')+' · '+(m.currency==='USD'?'Efectivo USD':'Efectivo Bs.'))+'</td><td>'+esc(m.reason||'—')+'</td><td class="r">'+esc(m.currency==='USD'?usd(m.amount):bsf(m.amount))+'</td><td>'+esc(m.user||'—')+'</td></tr>').join('')+'</tbody></table></div>':'<div class="hint">Sin movimientos de efectivo registrados en este turno.</div>';
    const rows=getRows();
    $('#zReconcile',el).innerHTML=rows.map(r=>{
      const existing=oldReal[r.id];
      const value=existing===null||existing===undefined?'':nf(existing);
      return '<tr><td>'+esc(r.name)+'</td><td>'+esc(r.cur)+'</td><td class="r">'+esc(nf(r.system))+'</td><td><input class="fld r" style="min-width:115px;width:100%" data-z-real="'+esc(r.id)+'" aria-label="Monto real '+esc(r.name)+'" inputmode="decimal" placeholder="Ingrese importe real" value="'+esc(value)+'" '+(!opened?'disabled':'')+'></td><td class="r" data-z-diff="'+esc(r.id)+'">—</td></tr>';
    }).join('');
    const hs=getZHistory().filter(z=>String(z.cashbox)===box).slice().sort((a,b)=>Number(b.closedAt)-Number(a.closedAt));
    $('#zHistory',el).innerHTML=hs.length?hs.map(z=>'<tr><td>'+esc(z.id)+'</td><td>'+esc(fmtDT(z.closedAt))+'</td><td>'+esc(z.cashier||'—')+'</td><td class="r">'+esc(usd(z.netUsd||0))+'</td><td>'+esc(z.reconciliationStatus||'Histórico anterior')+'</td><td><button class="btn mini2" data-z-view="'+esc(z.id)+'">Mostrar</button> <button class="btn mini2" data-z-print="'+esc(z.id)+'">Reimprimir</button></td></tr>').join(''):'<tr class="empty"><td colspan="6">Todavía no hay cortes Z guardados para esta caja.</td></tr>';
    const result=updateTotals();
    $('#zClose',el).disabled=!opened||!result.total.complete;
    $('#zActionStatus',el).textContent=!opened?'El cierre está bloqueado: primero abra el turno de esta caja.':(!result.total.complete?'Arqueo incompleto: ingrese el monto real de los 8 métodos de pago; use 0,00 en los métodos sin movimientos.':'Arqueo completo. Puede revisar la vista previa de 80 mm y confirmar el cierre.');
    result.rec.forEach(r=>{
      const cell=$('[data-z-diff="'+r.id+'"]',el);
      if(cell)cell.textContent=r.diff===null?'—':(r.diff>0?'+':'')+nf(r.diff);
    });
    $('#zPreview',el).disabled=!opened;
  };
  el.addEventListener('input',e=>{
    if(e.target.matches('[data-z-real]')){
      const result=updateTotals();
      result.rec.forEach(r=>{
        const cell=$('[data-z-diff="'+r.id+'"]',el);
        if(cell)cell.textContent=r.diff===null?'—':(r.diff>0?'+':'')+nf(r.diff);
      });
      const opened=boxOpen();
      $('#zClose',el).disabled=!opened||!result.total.complete;
      $('#zActionStatus',el).textContent=!opened?'El cierre está bloqueado: primero abra el turno de esta caja.':(!result.total.complete?'Arqueo incompleto: ingrese el monto real de los 8 métodos de pago; use 0,00 en los métodos sin movimientos.':'Arqueo completo. Puede revisar la vista previa de 80 mm y confirmar el cierre.');
    }
  });
  el.addEventListener('click',e=>{
    const view=e.target.closest('[data-z-view]');
    if(view){const z=getZHistory().find(item=>item.id===view.dataset.zView&&String(item.cashbox)===box);if(z)printCorteZ(z,false);return;}
    const reprint=e.target.closest('[data-z-print]');
    if(reprint){const z=getZHistory().find(item=>item.id===reprint.dataset.zPrint&&String(item.cashbox)===box);if(z)printCorteZ(z,true);return;}
    if(e.target.id==='zMovAdd'){
      active=readActiveOpening();
      if(!boxOpen()){msg('Debe abrir el turno antes de registrar movimientos.','bad');return;}
      const amount=pn($('#zMovAmount',el).value),reason=$('#zMovReason',el).value.trim();
      if(!amount||!reason){msg('Indique un monto mayor que cero y el motivo del movimiento.','bad');return;}
      if(!Array.isArray(S.movimientosCaja))S.movimientosCaja=[];
      S.movimientosCaja.push({id:'MOV-'+box.replace(/\W/g,'')+'-'+Date.now(),cashbox:box,ts:Date.now(),direction:$('#zMovDir',el).value,currency:$('#zMovCur',el).value,amount:r2(amount),reason,user:currentCajero(),openingId:active.id||''});
      save();$('#zMovAmount',el).value='';$('#zMovReason',el).value='';$('#zMovStatus',el).textContent='Movimiento registrado y guardado en el historial del turno.';draw();return;
    }
    if(e.target.id==='zOpenShift'){
      active=readActiveOpening();
      if(boxOpen()){msg('Ya existe un turno abierto para esta caja.','bad');draw();return;}
      const bs=pnZero($('#zOpeningBs',el).value),usdOpening=pnZero($('#zOpeningUsd',el).value);
      if(bs===null||usdOpening===null){msg('Indique el fondo inicial de Bs. y US$, aunque sea cero.','bad');return;}
      const now=Date.now();
      active={id:'OPEN-'+box.replace(/\W/g,'')+'-'+now,cashbox:box,cashier:currentCajero(),openedAt:now,bs:r2(bs),usd:r2(usdOpening),status:'abierta'};
      writeActiveOpening(active);
      const ctx=Object.assign(cajaContext(),{cashbox:box,name:currentCajero(),status:'abierta',openedAt:now});
      sessionStorage.setItem('sifer360_active_box',JSON.stringify(ctx));localStorage.setItem('sifer360_active_box',JSON.stringify(ctx));
      msg('Turno abierto para la caja '+box+'. Registre el arqueo real antes de cerrar.');
      draw();return;
    }
    if(e.target.id==='zPreview'){
      active=readActiveOpening();
      if(!boxOpen()){msg('Abra el turno y registre el fondo inicial antes de previsualizar el Corte Z.','bad');draw();return;}
      const result=calculate();
      const all=getPeriodSales(),sales=all.filter(s=>!s.void),voids=all.filter(s=>s.void);
      const now=Date.now();
      const rec=result.rec.map(r=>Object.assign({},r,{real:r.real==null?null:Number(r.real),diff:r.diff==null?null:Number(r.diff)}));
      const draft={id:'VISTA PREVIA · Z-'+box,cashbox:box,cashier:currentCajero(),openedAt:active.openedAt,closedAt:now,openingId:active.id||'',invoiceFrom:all.length?pad(Math.min(...all.map(s=>Number(s.no)||0))):'—',invoiceTo:all.length?pad(Math.max(...all.map(s=>Number(s.no)||0))):'—',salesCount:sales.length,voidCount:voids.length,netUsd:moneyTotal(sales,s=>Number(s.total||0)),netBs:moneyTotal(sales,s=>Number(s.total||0)*Number(s.rate||S.cfg.rate||0)),ivaUsd:moneyTotal(sales,s=>Number(s.iva||0)),igtfUsd:moneyTotal(sales,s=>Number(s.igtf||0)),payments:zPayTotals(sales),detailTotals:zOperationalTotals(all,shiftStart(),now,box),openingBs:Number(active.bs||0),openingUsd:Number(active.usd||0),reconciliation:rec,reconciliationStatus:result.total.status,shortageUsd:result.total.shortageUsd,surplusUsd:result.total.surplusUsd,shortageBs:result.total.shortageBs,surplusBs:result.total.surplusBs,observations:$('#zObservations',el).value.trim(),saleIds:all.map(s=>s.no),status:'previa'};
      printCorteZ(draft,false);return;
    }
    if(e.target.id==='zClose'){
      active=readActiveOpening();
      if(!boxOpen()){msg('Abra el turno y registre el fondo inicial antes del cierre Z.','bad');draw();return;}
      const result=calculate();
      if(!result.total.complete){msg('Complete el importe real de todos los métodos de pago; use 0,00 si no hubo movimientos.','bad');return;}
      if(window.SIFERAccess&&typeof window.SIFERAccess.requestPin==='function'&&!window.SIFERAccess.requestPin('Cerrar caja y generar Corte Z '+box))return;
      const status=result.total.status;
      if(!confirm('¿Confirmar el cierre definitivo de la caja '+box+'?\\nResultado: '+status+'\\nFaltante: '+usd(result.total.shortageUsd)+' / '+bsf(result.total.shortageBs)+'\\nSobrante: '+usd(result.total.surplusUsd)+' / '+bsf(result.total.surplusBs)+'\\nEl corte quedará guardado en el historial.'))return;
      const all=getPeriodSales(),sales=all.filter(s=>!s.void),voids=all.filter(s=>s.void);
      const rec=result.rec.map(r=>Object.assign({},r,{real:Number(r.real),diff:Number(r.diff)}));
      const seqs=cajaSeqs(),seq=seqs[box]||{z:1};const zSeq=Number(seq.z)||1;seq.z=zSeq+1;seqs[box]=seq;localStorage.setItem('sifer360_box_sequences',JSON.stringify(seqs));
      const t=Object.assign({},result.total);
      const z={id:'Z-'+box.replace(/\W/g,'')+'-'+new Date().getFullYear()+two(new Date().getMonth()+1)+two(new Date().getDate())+'-'+pad(zSeq,4),cashbox:box,cashier:currentCajero(),openedAt:active.openedAt,closedAt:Date.now(),openingId:active.id||'',invoiceFrom:all.length?pad(Math.min(...all.map(s=>Number(s.no)||0))):'—',invoiceTo:all.length?pad(Math.max(...all.map(s=>Number(s.no)||0))):'—',salesCount:sales.length,voidCount:voids.length,netUsd:moneyTotal(sales,s=>Number(s.total||0)),netBs:moneyTotal(sales,s=>Number(s.total||0)*Number(s.rate||S.cfg.rate||0)),ivaUsd:moneyTotal(sales,s=>Number(s.iva||0)),igtfUsd:moneyTotal(sales,s=>Number(s.igtf||0)),payments:zPayTotals(sales),detailTotals:zOperationalTotals(all,shiftStart(),Date.now(),box),openingBs:Number(active.bs||0),openingUsd:Number(active.usd||0),reconciliation:rec,reconciliationStatus:status,shortageUsd:t.shortageUsd,surplusUsd:t.surplusUsd,shortageBs:t.shortageBs,surplusBs:t.surplusBs,observations:$('#zObservations',el).value.trim(),saleIds:all.map(s=>s.no),status:'cerrada'};
      getZHistory().push(z);
      save();
      const closedOpening=Object.assign({},active,{status:'cerrada',closedAt:z.closedAt,cutId:z.id});
      writeActiveOpening(closedOpening);
      const closedBox=Object.assign(cajaContext(),{cashbox:box,status:'cerrada',closedAt:z.closedAt,cutId:z.id});
      sessionStorage.setItem('sifer360_active_box',JSON.stringify(closedBox));localStorage.setItem('sifer360_active_box',JSON.stringify(closedBox));
      msg('Corte Z '+z.id+' guardado. Resultado: '+status+'. Se abrirá la vista previa de 80 mm para imprimir.');
      printCorteZ(z,false);draw();
    }
  });
  openWin({title:'Corte Z · '+box,w:900,body:el,foot:[{label:'Cerrar',primary:true}],onOpen:draw});
}

const TB=[
 ['nueva','Nueva','F2',newSale],['buscar','Buscar','F3',searchCatalogDlg],['cliente','Cliente','F4',clientDlg],
 ['suspender','Suspender','F5',suspend],['recuperar','Recuperar','F6',recoverDlg],['descuento','Descuento','F7',discountDlg],['quitar','Quitar','Supr',removeSel],
 '-',['inventario','Inventario','F8',inventoryDlg],['conteo','Conteo','F11',()=>conteoDlg()],['kardex','Kardex','',()=>kardexDlg()],
 '-',['compras','Compras','F10',()=>comprasDlg('new')],['cxc','CxC','',()=>cxcDlg()],['cxp','CxP','',()=>cxpDlg()],['divisas','USD/Zelle','',()=>divisasDlg()],['cashea','Cashea','',()=>casheaDlg()],
 '-',['ventas','Ventas día','F9',salesDlg],['cortez','Corte Z','',corteZDlg],['seniat','Fiscal','',()=>seniatSudebanDlg()],['documentos','Documentos','',()=>fiscalDocumentsDlg()],['basedatos','Base de datos','',()=>databaseSettingsDlg()],['tasa','Tasa','',()=>cfgDlg('cRate')]
];
