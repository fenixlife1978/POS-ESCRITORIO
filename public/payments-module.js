/* Payment, Cashea, and sale completion workflows. Dependencias compartidas: estado y utilidades globales de main.js. */
function casheaPaymentAssistantDlg(totalSale, rate, onApplied, onCancel){
  const el = h('<div class="form" style="gap:12px">'+
    '<div style="background:#1E1B4B;border:1px solid #4338CA;border-radius:8px;padding:12px;color:#EEF2FF">'+
      '<div style="display:flex;align-items:center;justify-content:space-between">'+
        '<div><b style="font-size:15px;color:#FBBF24">⚡ Asistente de Financiamiento CASHEA</b><div style="font-size:12px;color:#C7D2FE">Compra ahora y paga en 3 cuotas quincenales sin interés</div></div>'+
        '<span class="badge-cashea">Registro manual · validar en Cashea</span>'+
      '</div>'+
      '<div style="margin-top:10px;display:flex;gap:16px;align-items:baseline">'+
        '<div><small style="color:#A5B4FC;text-transform:uppercase;font-size:10px">Total Venta</small><div style="font-size:22px;font-weight:700">'+usd(totalSale)+'</div></div>'+
        '<div><small style="color:#A5B4FC;text-transform:uppercase;font-size:10px">Equivalente BCV</small><div style="font-size:18px;font-weight:600;color:#FBBF24">'+bsf(totalSale*rate)+'</div></div>'+
      '</div>'+
    '</div>'+
    '<div class="docgrid">'+
      '<div class="f wide"><label>Cliente / Titular Cashea</label><input class="fld" id="cshClient" value="'+esc(S.client.name)+'" readonly></div>'+
      '<div class="f"><label>C.I. / RIF Cliente</label><input class="fld mono" id="cshCi" value="'+esc(S.client.rif)+'" placeholder="V-00000000"></div>'+
      '<div class="f"><label>Token / Aprobación real de Cashea *</label><input class="fld mono" id="cshToken" placeholder="Ingrese el código aprobado en Cashea" value="" required style="font-weight:700;color:#6366F1"></div>'+
      '<div class="f wide"><label>Nivel de Usuario en Cashea</label>'+
        '<select class="fld" id="cshLevel">'+
          '<option value="40" data-cuotas="3" selected>Nivel 3, 4 y 5 (Inicial 40% / 60% Financiado en 3 cuotas) [Recomendado]</option>'+
          '<option value="50" data-cuotas="3">Nivel 2 (Inicial 50% / 50% Financiado en 3 cuotas)</option>'+
          '<option value="60" data-cuotas="3">Nivel 1 (Inicial 60% / 40% Financiado en 3 cuotas)</option>'+
          '<option value="0" data-cuotas="1">Línea Cotidiana / Nivel Más (Inicial 0% / 100% en 1 cuota a 14 días)</option>'+
          '<option value="custom" data-cuotas="3">Personalizado (Definir porcentaje de inicial)</option>'+
        '</select>'+
      '</div>'+
      '<div class="f" id="cshCustomPctWrap" hidden><label>% Inicial personalizado</label><input class="fld r" id="cshCustomPct" type="number" min="0" max="95" value="40"></div>'+
      '<div class="f wide"><label>Distribución del pago inicial entre varios métodos</label><div class="hint">Puede combinar efectivo, tarjeta, Biopago, pago móvil, transferencia o Zelle. Introduzca el importe real de cada método; la suma equivalente debe cubrir exactamente la inicial Cashea.</div><div class="gridwrap"><table class="grid" style="min-width:620px"><thead><tr><th>Método</th><th>Moneda</th><th>Importe de la inicial</th><th>Referencia / autorización</th></tr></thead><tbody id="cshInitialRows"></tbody></table></div><div id="cshInitialSummary" class="hint" style="font-weight:700;margin-top:6px"></div></div>'+
    '</div>'+
    '<div class="cashea-calc-box" id="cshPlanBox"></div>'+
    '<div class="hint">Este asistente calcula y registra el plan en el POS; no consulta ni confirma aprobaciones mediante la API oficial de Cashea. Verifique el token y las condiciones en Cashea antes de confirmar. La inicial se cobra ahora; el saldo financiado queda pendiente de liquidación y debe conciliarse después.</div>'+
  '</div>');

  const planBox = $('#cshPlanBox', el);
  const selLevel = $('#cshLevel', el);
  const customWrap = $('#cshCustomPctWrap', el);
  const customPct = $('#cshCustomPct', el);
  const initialRows = $('#cshInitialRows', el);
  const initialSummary = $('#cshInitialSummary', el);
  const initialMethods = METHODS.filter(m=>m.id!=='cashea');
  const initialNeedsRef = new Set(['biopago','punto','pmovil','transf','zelle']);
  initialRows.innerHTML=initialMethods.map(m=>'<tr><td><b>'+esc(m.name)+'</b></td><td class="c">'+(m.cur==='USD'?'US$':'Bs.')+'</td><td><input class="fld r" type="number" min="0" step="0.01" id="cshInitAmt-'+m.id+'" data-csh-initial-method="'+m.id+'" value="0" style="min-width:105px" aria-label="Importe inicial '+esc(m.name)+'"></td><td>'+(initialNeedsRef.has(m.id)?'<input class="fld mini mono" id="cshInitRef-'+m.id+'" placeholder="Referencia / autorización" style="min-width:150px">':'<span class="hint">No aplica</span>')+'</td></tr>').join('');
  const ciInp = $('#cshCi', el);
  const tokenInp = $('#cshToken', el);

  function getPct(){
    if(selLevel.value === 'custom') return Math.max(0, Math.min(100, Number(customPct.value) || 0));
    return Number(selLevel.value) || 0;
  }
  function getCuotasCount(){
    const opt = selLevel.options[selLevel.selectedIndex];
    return Number(opt.dataset.cuotas || 3);
  }

  function renderPlan(){
    const pct = getPct();
    const cuotas = getCuotasCount();
    const inicialUsd = r2(totalSale * (pct / 100));
    const financiadoUsd = r2(totalSale - inicialUsd);
    const cuotaUsd = r2(financiadoUsd / cuotas);
    const now = Date.now(), dayMs = 86400000;

    let cuotasHtml = '';
    for(let c = 1; c <= cuotas; c++){
      const fDate = new Date(now + c * 14 * dayMs).toLocaleDateString('es-VE');
      cuotasHtml += '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-size:12px">'+
        '<span>Cuota '+c+' (en '+ (c * 14) +' días · '+fDate+'):</span>'+
        '<b>'+usd(cuotaUsd)+' <span style="color:#FBBF24;font-size:11px">('+bsf(cuotaUsd*rate)+')</span></b>'+
      '</div>';
    }

    planBox.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'+
      '<div style="background:rgba(255,255,255,0.06);padding:8px 10px;border-radius:6px">'+
        '<small style="color:#C7D2FE;display:block;font-size:10px">1. PAGO INICIAL EN CAJA ('+pct+'%)</small>'+
        '<div style="font-size:17px;font-weight:700;color:#A7F3D0">'+usd(inicialUsd)+'</div>'+
        '<small style="color:#94A3B8">'+bsf(inicialUsd*rate)+'</small>'+
      '</div>'+
      '<div style="background:rgba(255,255,255,0.06);padding:8px 10px;border-radius:6px">'+
        '<small style="color:#C7D2FE;display:block;font-size:10px">2. SALDO FINANCIADO CASHEA</small>'+
        '<div style="font-size:17px;font-weight:700;color:#FBBF24">'+usd(financiadoUsd)+'</div>'+
        '<small style="color:#94A3B8">'+bsf(financiadoUsd*rate)+'</small>'+
      '</div>'+
    '</div>'+
    '<div style="font-size:11.5px;color:#C7D2FE;margin-bottom:4px;font-weight:600">Plan de '+cuotas+' cuotas quincenales (sin interés):</div>'+
    cuotasHtml;
    let paidInitialUsd=0;
    initialMethods.forEach(m=>{const amount=Math.max(0,Number($('#cshInitAmt-'+m.id,el).value)||0);paidInitialUsd+=m.cur==='USD'?amount/(1+IGTF):amount/rate;});
    const delta=r2(paidInitialUsd-inicialUsd);
    initialSummary.textContent='Inicial requerida: '+usd(inicialUsd)+' · Distribuido: '+usd(paidInitialUsd)+' · Diferencia: '+usd(delta);
    initialSummary.style.color=Math.abs(delta)<=0.01?'#16A34A':'#B45309';
  }

  selLevel.addEventListener('change', () => {
    customWrap.hidden = selLevel.value !== 'custom';
    renderPlan();
  });
  customPct.addEventListener('input', renderPlan);
  initialRows.addEventListener('input',e=>{if(e.target.matches('[data-csh-initial-method]'))renderPlan();});
  renderPlan();

  openWin({
    title: 'Asistente de Financiamiento CASHEA (BNPL)',
    w: 640,
    body: el,
    foot: [
      { label: 'Volver al pago', fn:()=>{closeWin();if(onCancel)onCancel();return false;} },
      {
        label: 'Aplicar a la Venta',
        primary: true,
        fn: () => {
          const token = tokenInp.value.trim();
          if(!token){ msg('Ingrese el código de aprobación o token de Cashea.', 'bad'); return false; }
          const ci = ciInp.value.trim() || S.client.rif;
          const pct = getPct();
          const cuotas = getCuotasCount();
          const inicialUsd = r2(totalSale * (pct / 100));
          const financiadoUsd = r2(totalSale - inicialUsd);
          const cuotaUsd = r2(financiadoUsd / cuotas);
          const nivelTxt = selLevel.options[selLevel.selectedIndex].textContent;
          const initialPayments=[];
          let paidInitialUsd=0;
          for(const m of initialMethods){
            const amount=r2(Math.max(0,Number($('#cshInitAmt-'+m.id,el).value)||0));
            if(amount<=0)continue;
            const refInput=$('#cshInitRef-'+m.id,el);
            const ref=refInput?refInput.value.trim():'';
            if(initialNeedsRef.has(m.id)&&!ref){msg('Ingrese la referencia o autorización de '+m.name+' para registrar la inicial.','bad');return false;}
            paidInitialUsd+=m.cur==='USD'?amount/(1+IGTF):amount/rate;
            initialPayments.push({id:m.id,name:m.name,cur:m.cur,amount,ref});
          }
          if(Math.abs(r2(paidInitialUsd-inicialUsd))>0.01){msg('La inicial debe quedar cubierta exactamente. Requerida: '+usd(inicialUsd)+'; distribuida: '+usd(paidInitialUsd)+'.','bad');return false;}
          const result={
            aprobacion: token,
            ci,
            nivel: nivelTxt,
            totalVenta: totalSale,
            inicialUsd,
            initialPayments,
            inicialMetodoId: initialPayments.length===1?initialPayments[0].id:'',
            inicialMetodoName: initialPayments.map(p=>p.name).join(' + ')||'Sin inicial',
            financiadoUsd,
            cuotasCount: cuotas,
            cuotaUsd
          };
          closeWin();
          onApplied(result);
          return false;
        }
      }
    ],
    onClose:()=>{closeWin();if(onCancel)onCancel();}
  });
}

function casheaSimulatorDlg(){
  const rate = S.cfg.rate;
  const el = h('<div class="form" style="gap:12px">'+
    '<div style="background:#1E1B4B;border:1px solid #4338CA;border-radius:8px;padding:12px;color:#EEF2FF">'+
      '<div style="font-size:16px;font-weight:700;color:#FBBF24">⚡ Simulador de Cuotas CASHEA</div>'+
      '<div style="font-size:12px;color:#C7D2FE">Calcule en segundos el pago inicial y las cuotas quincenales para orientar al cliente en mostrador</div>'+
    '</div>'+
    '<div class="docgrid">'+
      '<div class="f"><label>Monto de la compra (US$)</label><input class="fld r big" id="simUsd" type="number" step="0.5" value="100.00"></div>'+
      '<div class="f"><label>Tasa oficial BCV</label><input class="fld r" id="simRate" value="'+nf(rate)+' Bs." readonly></div>'+
      '<div class="f wide"><label>Nivel del cliente en Cashea</label>'+
        '<select class="fld" id="simLevel">'+
          '<option value="40" selected>Nivel 3, 4 y 5 (Inicial 40% / Financiado 60% en 3 cuotas)</option>'+
          '<option value="50">Nivel 2 (Inicial 50% / Financiado 50% en 3 cuotas)</option>'+
          '<option value="60">Nivel 1 (Inicial 60% / Financiado 40% en 3 cuotas)</option>'+
          '<option value="0">Línea Cotidiana / Nivel Más (Inicial 0% / Financiado 100% a 14 días)</option>'+
        '</select>'+
      '</div>'+
    '</div>'+
    '<div class="cashea-calc-box" id="simResultBox"></div>'+
  '</div>');

  const simUsd = $('#simUsd', el);
  const simLevel = $('#simLevel', el);
  const resultBox = $('#simResultBox', el);

  function recalc(){
    const tot = Math.max(0, Number(simUsd.value) || 0);
    const pct = Number(simLevel.value) || 0;
    const cuotas = pct === 0 ? 1 : 3;
    const inicial = r2(tot * (pct / 100));
    const financiado = r2(tot - inicial);
    const cuota = r2(financiado / cuotas);
    const now = Date.now(), dayMs = 86400000;

    let cHtml = '';
    for(let c = 1; c <= cuotas; c++){
      const dt = new Date(now + c * 14 * dayMs).toLocaleDateString('es-VE');
      cHtml += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-size:12.5px">'+
        '<span>Cuota '+c+' (en '+(c*14)+' días · '+dt+'):</span>'+
        '<b style="color:#A7F3D0">'+usd(cuota)+' <span style="color:#FBBF24;font-size:11px">('+bsf(cuota*rate)+')</span></b>'+
      '</div>';
    }

    resultBox.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">'+
      '<div style="background:rgba(255,255,255,0.06);padding:10px;border-radius:6px">'+
        '<div style="font-size:11px;color:#C7D2FE;text-transform:uppercase">Inicial en mostrador ('+pct+'%)</div>'+
        '<div style="font-size:22px;font-weight:700;color:#A7F3D0">'+usd(inicial)+'</div>'+
        '<div style="font-size:12px;color:#FBBF24">'+bsf(inicial*rate)+'</div>'+
      '</div>'+
      '<div style="background:rgba(255,255,255,0.06);padding:10px;border-radius:6px">'+
        '<div style="font-size:11px;color:#C7D2FE;text-transform:uppercase">Financiado Cashea ('+(100-pct)+'%)</div>'+
        '<div style="font-size:22px;font-weight:700;color:#FBBF24">'+usd(financiado)+'</div>'+
        '<div style="font-size:12px;color:#94A3B8">'+bsf(financiado*rate)+'</div>'+
      '</div>'+
    '</div>'+
    '<div style="font-size:12px;font-weight:600;color:#C7D2FE;margin-bottom:6px">Cronograma de pagos del cliente:</div>'+
    cHtml;
  }

  simUsd.addEventListener('input', recalc);
  simLevel.addEventListener('change', recalc);
  recalc();

  openWin({
    title: 'Simulador de Cuotas Cashea (BNPL)',
    w: 580,
    body: el,
    foot: [{ label: 'Cerrar', primary: true }]
  });
}

function casheaPrintVoucherDlg(m){
  const rate = S.cfg.rate;
  const now = m.ts ? fmtDT(m.ts) : fmtDT(Date.now());
  const el = h('<div class="form" style="gap:10px">'+
    '<div class="ticket-roll-wrap"><pre class="ticket-80mm" style="font-family:IBM Plex Mono,monospace;font-size:12px;line-height:1.35;white-space:pre">'+
      '========================================\n'+
      '      COMPROBANTE FINANCIAMIENTO       \n'+
      '             CASHEA (BNPL)              \n'+
      '========================================\n'+
      esc(S.cfg.empresa)+'\n'+
      'RIF: '+esc(S.cfg.rif)+'\n'+
      '----------------------------------------\n'+
      'Nº APROBACIÓN : '+esc(m.aprobacion)+'\n'+
      'FECHA / HORA  : '+now+'\n'+
      'VENTA FACTURA : #'+pad(m.ventaNo)+'\n'+
      'Nº CONTROL    : '+(m.ctrlNo||'--')+'\n'+
      'ESTADO        : '+esc(m.estado)+'\n'+
      '----------------------------------------\n'+
      'DATOS DEL CLIENTE:\n'+
      'Titular       : '+esc(m.clienteNombre)+'\n'+
      'Cédula / RIF  : '+esc(m.clienteCi)+'\n'+
      '----------------------------------------\n'+
      'DESGLOSE FINANCIERO:\n'+
      'Total Venta   : '+usd(m.totalVenta)+' ('+bsf(m.totalVenta*rate)+')\n'+
      'Inicial Caja  : '+usd(m.inicialUsd)+' ('+bsf(m.inicialUsd*rate)+')\n'+
      'Financiado    : '+usd(m.financiadoUsd)+' ('+bsf(m.financiadoUsd*rate)+')\n'+
      '----------------------------------------\n'+
      'PLAN DE '+m.cuotasCount+' CUOTAS QUINCENALES:\n'+
      'Cuota quincenal: '+usd(m.cuotaUsd)+' c/u\n'+
      '----------------------------------------\n'+
      (m.loteLiquidacion ? ('LIQUIDACIÓN BANCARIA:\nLote: '+esc(m.loteLiquidacion)+'\nFecha: '+fmtDT(m.fechaLiquidacion)+'\n----------------------------------------\n') : '')+
      '   FIRMA CLIENTE: __________________\n'+
      '       C.I.: '+esc(m.clienteCi)+'\n\n'+
      '   FIRMA CAJERO:  __________________\n'+
      '========================================\n'+
      '  CONCILIACIÓN OFICIAL CASHEA TECHNOLOGIES\n'+
      '========================================'+
    '</pre></div>'+
    '<div class="row" style="justify-content:flex-end"><button class="btn primary" id="btnPrintCshVoucher">Imprimir Comprobante</button></div>'+
  '</div>');

  $('#btnPrintCshVoucher', el).addEventListener('click', () => {
    const wrap = $('#fiscalPrintWrap');
    wrap.innerHTML = '<pre style="font-family:IBM Plex Mono,monospace;font-size:12px;padding:20px">'+$('pre', el).textContent+'</pre>';
    window.print();
  });

  openWin({
    title: 'Comprobante Cashea - ' + m.aprobacion,
    w: 520,
    body: el,
    foot: [{ label: 'Cerrar', primary: true }]
  });
}

function casheaSettlementDlg(onDone){
  const allPendings = (S.casheaMovimientos || []).filter(m => m.estado === 'Pendiente Liquidación');
  let pendings = allPendings.slice();
  if(!pendings.length){
    msg('No hay operaciones de Cashea pendientes de liquidación.', 'bad');
    return;
  }
  const rate = S.cfg.rate;
  let totFinanciado = pendings.reduce((acc, m) => acc + (m.financiadoUsd || 0), 0);

  const el = h('<div class="form" style="gap:12px">'+
    '<div style="background:#1E1B4B;border:1px solid #4338CA;border-radius:8px;padding:12px;color:#EEF2FF">'+
      '<b style="font-size:15px;color:#FBBF24">📥 Registrar Liquidación de Lote CASHEA</b>'+
      '<div style="font-size:12px;color:#C7D2FE">Seleccione las operaciones incluidas en este depósito real de Cashea. Se puede liquidar un subconjunto y conciliar el resto posteriormente.</div>'+
    '</div>'+
    '<div class="gridwrap" style="max-height:180px"><table class="grid"><thead><tr><th>Incluir</th><th>Factura</th><th>Cliente</th><th class="r">Financiado US$</th></tr></thead><tbody>'+
      allPendings.map(m=>'<tr><td><input type="checkbox" data-liq-op="'+esc(m.id)+'" checked aria-label="Incluir operación '+esc(m.id)+'"></td><td>'+esc(m.ventaNo)+'</td><td>'+esc(m.clienteNombre||m.clienteCi||'—')+'</td><td class="r">'+esc(usd(m.financiadoUsd||0))+'</td></tr>').join('')+
    '</tbody></table></div>'+
    '<div class="docgrid">'+
      '<div class="f"><label>Nº de Operaciones pendientes</label><input class="fld mono" value="'+pendings.length+' facturas" readonly></div>'+
      '<div class="f"><label>Total Bruto por Cobrar (US$)</label><input class="fld r mono" id="liqBruto" value="'+nf(totFinanciado)+'" readonly style="font-weight:700"></div>'+
      '<div class="f wide"><label>Banco Receptor del Comercio</label>'+
        '<select class="fld" id="liqBanco">'+
          '<option value="Banco Mercantil">Banco Mercantil (Cta. Corriente)</option>'+
          '<option value="Banesco Banco Universal">Banesco Banco Universal</option>'+
          '<option value="Banco de Venezuela">Banco de Venezuela (BDV)</option>'+
          '<option value="Banco Nacional de Crédito (BNC)">Banco Nacional de Crédito (BNC)</option>'+
          '<option value="Bancamiga Banco Universal">Bancamiga Banco Universal</option>'+
        '</select>'+
      '</div>'+
      '<div class="f"><label>Nº Referencia Transferencia Cashea</label><input class="fld mono" id="liqRef" placeholder="Referencia bancaria real" autocomplete="off"></div>'+
      '<div class="f"><label>% Comisión Cashea (MDR)</label><input class="fld r" id="liqComPct" type="number" min="0" max="100" step="0.01" required placeholder="Según contrato"></div>'+
      '<div class="f wide"><label>Monto neto depositado según banco (US$ equivalente)</label><input class="fld r mono" id="liqDeposit" inputmode="decimal" autocomplete="off" placeholder="Registra el monto real del estado de cuenta"></div>'+
    '</div>'+
    '<div class="cashea-calc-box" id="liqCalcBox"></div>'+
  '</div>');

  const comPctInp = $('#liqComPct', el);
  const calcBox = $('#liqCalcBox', el);
  const refInp = $('#liqRef', el);
  const depositInp = $('#liqDeposit', el);
  const bancoSel = $('#liqBanco', el);
  el.addEventListener('change', e => {
    const checkbox = e.target.closest('[data-liq-op]');
    if(!checkbox)return;
    const selected = new Set($('[data-liq-op]',el).filter(input=>input.checked).map(input=>input.dataset.liqOp));
    pendings = allPendings.filter(m=>selected.has(String(m.id)));
    totFinanciado = r2(pendings.reduce((acc,m)=>acc+Number(m.financiadoUsd||0),0));
    $('#liqBruto',el).value=nf(totFinanciado);
    recalc();
  });

  function recalc(){
    const pct = Math.max(0, Number(comPctInp.value) || 0);
    const comUsd = r2(totFinanciado * (pct / 100));
    const netoUsd = r2(totFinanciado - comUsd);
    const depositRaw=depositInp.value.trim();
    const depositUsd=depositRaw?pn(depositRaw):null;
    const diff=depositUsd===null?null:r2(depositUsd-netoUsd);
    calcBox.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center">'+
      '<div style="background:rgba(255,255,255,0.06);padding:8px;border-radius:6px">'+
        '<small style="color:#C7D2FE;font-size:10px">TOTAL BRUTO</small>'+
        '<div style="font-size:16px;font-weight:700">'+usd(totFinanciado)+'</div>'+
        '<small style="color:#94A3B8">'+bsf(totFinanciado*rate)+'</small>'+
      '</div>'+
      '<div style="background:rgba(255,255,255,0.06);padding:8px;border-radius:6px">'+
        '<small style="color:#F87171;font-size:10px">COMISIÓN ('+pct+'%)</small>'+
        '<div style="font-size:16px;font-weight:700;color:#F87171">- '+usd(comUsd)+'</div>'+
        '<small style="color:#94A3B8">'+bsf(comUsd*rate)+'</small>'+
      '</div>'+
      '<div style="background:rgba(255,255,255,0.06);padding:8px;border-radius:6px">'+
        '<small style="color:#A7F3D0;font-size:10px">NETO ESPERADO</small>'+
        '<div style="font-size:16px;font-weight:700;color:#A7F3D0">'+usd(netoUsd)+'</div>'+
        '<small style="color:#FBBF24">'+bsf(netoUsd*rate)+'</small>'+
      '</div>'+
    '</div><div style="margin-top:10px;padding:10px;border:1px solid '+(diff===null?'#475569':Math.abs(diff)<=0.01?'#059669':'#B45309')+';border-radius:6px;font-size:12px;color:#E2E8F0">'+
      (diff===null?'Registra el depósito real para comparar con el neto esperado.':'Diferencia bancaria: <b style="color:'+(Math.abs(diff)<=0.01?'#6EE7B7':'#FCD34D')+'">'+usd(diff)+'</b> · '+(Math.abs(diff)<=0.01?'Coincide con el neto esperado.':'No coincide; la liquidación no se confirmará.'))+
    '</div>';
  }
  comPctInp.addEventListener('input', recalc);
  depositInp.addEventListener('input', recalc);
  recalc();

  openWin({
    title: 'Liquidación de Lote Cashea',
    w: 620,
    body: el,
    foot: [
      { label: 'Cancelar' },
      {
        label: 'Confirmar y Liquidar Lote',
        primary: true,
        fn: () => {
          const ref = refInp.value.trim();
          const depositRaw = depositInp.value.trim();
          const pct = Number(comPctInp.value);
          if(!pendings.length){msg('Seleccione al menos una operación pendiente para liquidar.','bad');return false;}
          const comUsd = r2(totFinanciado * (pct / 100));
          const netoUsd = r2(totFinanciado - comUsd);
          const depositUsd = depositRaw ? pn(depositRaw) : null;
          if(!ref){ msg('Ingrese la referencia bancaria real de Cashea.', 'bad'); return false; }
          if(!depositRaw || depositUsd===null || !comPctInp.value.trim() || !Number.isFinite(pct) || pct<0 || pct>100){ msg('Registre el depósito real y una comisión válida entre 0 % y 100 %.', 'bad'); return false; }
          if(Math.abs(depositUsd-netoUsd)>0.01){ msg('Liquidación rechazada: el depósito real ('+usd(depositUsd)+') no coincide con el neto esperado ('+usd(netoUsd)+'). Revise la comisión o el estado de cuenta.', 'bad'); return false; }
          const loteId = 'LIQ-CSH-' + Date.now().toString(36).toUpperCase();
          const now = Date.now();
          pendings.forEach(m => {
            m.estado = 'Liquidado';
            m.loteLiquidacion = loteId;
            m.fechaLiquidacion = now;
            m.bancoReceptor = bancoSel.value;
            m.refBancaria = ref;
            m.comisionPct = pct;
            m.comisionUsd = r2((m.financiadoUsd||0) * pct / 100);
            m.netoEsperadoUsd = r2((m.financiadoUsd||0) - m.comisionUsd);
            m.tasaBcvLiquidacion = rate;
          });
          if(!Array.isArray(S.casheaLiquidaciones))S.casheaLiquidaciones=[];
          S.casheaLiquidaciones.push({id:loteId,fecha:now,operaciones:pendings.map(m=>m.id),cantidad:pendings.length,banco:bancoSel.value,referencia:ref,brutoUsd:r2(totFinanciado),comisionPct:pct,comisionUsd:comUsd,netoEsperadoUsd:netoUsd,depositadoUsd:depositUsd,diferenciaUsd:r2(depositUsd-netoUsd),tasaBcv:rate});
          save();
          msg('Lote '+loteId+' conciliado y guardado ('+pendings.length+' facturas).');
          if(onDone) onDone();
          return true;
        }
      }
    ]
  });
}

function reverseCasheaSettlement(movementId,onDone){
  const movement=(S.casheaMovimientos||[]).find(m=>String(m.id)===String(movementId));
  if(!movement||movement.estado!=='Liquidado'||!movement.loteLiquidacion){msg('La operación no tiene una liquidación activa que pueda revertirse.','bad');return false;}
  const lot=(S.casheaLiquidaciones||[]).find(item=>item.id===movement.loteLiquidacion&&item.tipo!=='REVERSIÓN');
  if(!lot||lot.estado==='Revertido'){msg('El lote ya fue revertido o no existe en el historial.','bad');return false;}
  if(!window.SIFERAccess||typeof window.SIFERAccess.requestPin!=='function'){msg('No se puede revertir: el servicio de autorización no está disponible.','bad');return false;}
  if(!window.SIFERAccess.requestPin('Revertir liquidación CASHEA '+lot.id))return false;
  const motivo=window.prompt('Indique el motivo de la reversión del lote '+lot.id+':','');
  if(!motivo||!motivo.trim()){msg('La reversión requiere un motivo para auditoría.','bad');return false;}
  if(!confirm('¿Revertir el lote '+lot.id+'? Las operaciones volverán a pendientes y el motivo quedará registrado.'))return false;
  const now=Date.now(), revId='REV-CSH-'+now.toString(36).toUpperCase();
  const affected=(S.casheaMovimientos||[]).filter(m=>m.estado==='Liquidado'&&m.loteLiquidacion===lot.id);
  if(!affected.length){msg('No hay operaciones activas en ese lote.','bad');return false;}
  lot.estado='Revertido';lot.revertidoAt=now;lot.revertidoPor=currentCajero();lot.reversionId=revId;lot.motivoReversion=motivo.trim();
  affected.forEach(m=>{
    m.loteLiquidacionAnterior=lot.id;
    m.estado='Pendiente Liquidación';
    m.loteLiquidacion='';
    delete m.bancoReceptor;delete m.refBancaria;delete m.comisionPct;delete m.comisionUsd;delete m.netoEsperadoUsd;delete m.tasaBcvLiquidacion;delete m.fechaLiquidacion;
  });
  S.casheaLiquidaciones.push({id:revId,tipo:'REVERSIÓN',fecha:now,loteOriginal:lot.id,operaciones:affected.map(m=>m.id),cantidad:affected.length,operador:currentCajero(),motivo:motivo.trim(),estado:'Registrada'});
  save();
  msg('Reversión '+revId+' registrada. '+affected.length+' operaciones regresaron a pendientes.');
  if(onDone)onDone();
  return true;
}

function casheaDlg(defaultTab){
  let curTab = defaultTab || 'ALL';
  let query = '';
  const rate = S.cfg.rate;

  const el = h('<div class="form" style="gap:12px">'+
    '<div class="kpi-grid" id="cshKpis"></div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between;background:var(--alt);padding:8px 10px;border:1px solid var(--lo);border-radius:6px">'+
      '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">'+
        '<button class="btn mini2" id="cshBtnSim" style="background:#312E81;color:#E0E7FF;border-color:#4338CA;font-weight:700">⚡ Simulador de Cuotas</button>'+
        '<button class="btn mini2" id="cshBtnLiq" style="background:#064E3B;color:#A7F3D0;border-color:#059669;font-weight:700">📥 Registrar Liquidación de Lote</button>'+
        '<button class="btn mini2" id="cshBtnCsv">📊 Exportar Reporte (CSV)</button>'+
      '</div>'+
      '<div style="display:flex;gap:8px;align-items:center">'+
        '<select class="fld mini" id="cshStatusFilter" style="width:170px">'+
          '<option value="ALL">Todos los estados</option>'+
          '<option value="Pendiente Liquidación">Pendientes de Liquidación</option>'+
          '<option value="Liquidado">Liquidados por Cashea</option>'+
        '</select>'+
        '<input class="fld mini" id="cshSearch" placeholder="Buscar por cliente, CI, CSH-..." style="width:200px">'+
      '</div>'+
    '</div>'+
    '<div class="gridwrap" style="max-height:360px"><table class="grid" id="cshTable">'+
      '<thead><tr>'+
        '<th>ID Mov.</th>'+
        '<th>Factura</th>'+
        '<th>Fecha</th>'+
        '<th>Cliente</th>'+
        '<th>Token Cashea</th>'+
        '<th class="r">Total Venta</th>'+
        '<th class="r">Inicial Caja</th>'+
        '<th class="r">Financiado</th>'+
        '<th class="c">Cuotas</th>'+
        '<th class="c">Estado</th>'+
        '<th class="c">Acciones</th>'+
      '</tr></thead>'+
      '<tbody id="cshRows"></tbody>'+
    '</table></div>'+
    '<div class="hint">Las ventas con Cashea permiten cobrar la inicial en el mostrador y financiar el saldo en 3 cuotas quincenales sin interés. El saldo pendiente representa una Cuenta por Cobrar a Cashea Technologies.</div>'+
  '</div>');

  function render(){
    const list = S.casheaMovimientos || [];
    const totVentas = list.reduce((a, m) => a + (m.totalVenta || 0), 0);
    const totInicial = list.reduce((a, m) => a + (m.inicialUsd || 0), 0);
    const pendings = list.filter(m => m.estado === 'Pendiente Liquidación');
    const totPendiente = pendings.reduce((a, m) => a + (m.financiadoUsd || 0), 0);
    const liquidados = list.filter(m => m.estado === 'Liquidado');
    const totLiquidado = liquidados.reduce((a, m) => a + (m.financiadoUsd || 0), 0);

    $('#cshKpis', el).innerHTML = '<div class="kpi-card">'+
        '<div class="klabel">Total Facturado Cashea</div>'+
        '<div class="kval" style="color:#A5B4FC">'+usd(totVentas)+'</div>'+
        '<div class="ksub">'+bsf(totVentas*rate)+'</div>'+
      '</div>'+
      '<div class="kpi-card">'+
        '<div class="klabel">Iniciales Cobradas</div>'+
        '<div class="kval" style="color:#A7F3D0">'+usd(totInicial)+'</div>'+
        '<div class="ksub">'+bsf(totInicial*rate)+'</div>'+
      '</div>'+
      '<div class="kpi-card">'+
        '<div class="klabel">Por Liquidar (CxC Cashea)</div>'+
        '<div class="kval" style="color:#FBBF24">'+usd(totPendiente)+'</div>'+
        '<div class="ksub">'+pendings.length+' facturas pendientes</div>'+
      '</div>'+
      '<div class="kpi-card">'+
        '<div class="klabel">Total Liquidado</div>'+
        '<div class="kval" style="color:#34D399">'+usd(totLiquidado)+'</div>'+
        '<div class="ksub">'+liquidados.length+' facturas conciliadas</div>'+
      '</div>';

    const q = norm(query);
    const filtered = list.filter(m => {
      if(curTab !== 'ALL' && m.estado !== curTab) return false;
      if(!q) return true;
      const haystack = norm((m.id||'')+' '+(m.ventaNo||'')+' '+(m.clienteNombre||'')+' '+(m.clienteCi||'')+' '+(m.aprobacion||'')+' '+(m.loteLiquidacion||''));
      return haystack.includes(q);
    }).slice().sort((a,b) => (b.ts||0) - (a.ts||0));

    const rows = $('#cshRows', el);
    if(!filtered.length){
      rows.innerHTML = '<tr class="empty"><td colspan="11">No se encontraron operaciones de Cashea registradas.</td></tr>';
      return;
    }
    rows.innerHTML = filtered.map(m => {
      const isOk = m.estado === 'Liquidado';
      const stBadge = '<span class="badge-cashea '+(isOk?'ok':'pend')+'">'+esc(m.estado)+'</span>';
      return '<tr>'+
        '<td class="mono" style="font-size:11px">'+esc(m.id)+'</td>'+
        '<td><b>#'+pad(m.ventaNo)+'</b></td>'+
        '<td style="font-size:11.5px">'+esc(fmtDT(m.ts||Date.now()))+'</td>'+
        '<td>'+esc(m.clienteNombre)+'<div class="sub mono">'+esc(m.clienteCi)+'</div></td>'+
        '<td class="mono" style="font-weight:700;color:#6366F1">'+esc(m.aprobacion)+'</td>'+
        '<td class="r">'+usd(m.totalVenta)+'</td>'+
        '<td class="r" style="color:#10B981">'+usd(m.inicialUsd)+'</td>'+
        '<td class="r" style="font-weight:700;color:#F59E0B">'+usd(m.financiadoUsd)+'</td>'+
        '<td class="c mono" style="font-size:11.5px">'+(m.cuotasCount||3)+'x '+usd(m.cuotaUsd)+'</td>'+
        '<td class="c">'+stBadge+'</td>'+
        '<td class="c">'+
          '<button class="btn mini2" data-csh-vouch="'+esc(m.id)+'" title="Ver Comprobante">Voucher</button> '+
          '<button class="btn mini2" data-csh-ticket="'+m.ventaNo+'" title="Ver Ticket Térmico 80mm">Ticket</button>'+
          (isOk?'<button class="btn mini2" data-csh-reverse="'+esc(m.id)+'" title="Revertir lote conciliado">Revertir lote</button>':'')+
        '</td>'+
      '</tr>';
    }).join('');
  }

  $('#cshStatusFilter', el).value = curTab;
  $('#cshStatusFilter', el).addEventListener('change', e => { curTab = e.target.value; render(); });
  $('#cshSearch', el).addEventListener('input', e => { query = e.target.value.trim(); render(); });
  $('#cshBtnSim', el).addEventListener('click', () => casheaSimulatorDlg());
  $('#cshBtnLiq', el).addEventListener('click', () => casheaSettlementDlg(() => render()));
  $('#cshBtnCsv', el).addEventListener('click', () => {
    const list = S.casheaMovimientos || [];
    if(!list.length){ msg('No hay datos para exportar.', 'bad'); return; }
    let csv = 'ID;Venta;Fecha;Cliente;CI;Aprobacion;Total_USD;Inicial_USD;Financiado_USD;Cuotas;Cuota_USD;Estado;Lote_Liquidacion;Banco;Referencia_Bancaria;Comision_Pct;Comision_USD;Neto_Esperado_USD;Deposito_Lote_USD;Diferencia_Lote_USD;Tasa_BCV_Liquidacion\n';
    const exportedLots = new Set();
    list.forEach(m => {
      const batch=(S.casheaLiquidaciones||[]).find(l=>l.id===m.loteLiquidacion);
      const includeBatch=!!batch&&!exportedLots.has(batch.id);
      if(includeBatch)exportedLots.add(batch.id);
      csv += [m.id, m.ventaNo, fmtDT(m.ts||0), m.clienteNombre, m.clienteCi, m.aprobacion, m.totalVenta, m.inicialUsd, m.financiadoUsd, m.cuotasCount, m.cuotaUsd, m.estado, m.loteLiquidacion||'', m.bancoReceptor||'', m.refBancaria||'', m.comisionPct??'', m.comisionUsd??'', m.netoEsperadoUsd??'', includeBatch?batch.depositadoUsd:'', includeBatch?batch.diferenciaUsd:'', m.tasaBcvLiquidacion??''].join(';') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'cashea-lote-'+new Date().toISOString().slice(0,10)+'.csv';
    a.click();
    msg('Archivo CSV de Cashea exportado correctamente.');
  });

  $('#cshRows', el).addEventListener('click', e => {
    const bReverse = e.target.closest('[data-csh-reverse]');
    if(bReverse){
      const movement=(S.casheaMovimientos||[]).find(x=>x.id===bReverse.dataset.cshReverse);
      if(movement)reverseCasheaSettlement(movement.id,()=>render());
      return;
    }
    const bVouch = e.target.closest('[data-csh-vouch]');
    if(bVouch){
      const m = (S.casheaMovimientos || []).find(x => x.id === bVouch.dataset.cshVouch);
      if(m) casheaPrintVoucherDlg(m);
      return;
    }
    const bTick = e.target.closest('[data-csh-ticket]');
    if(bTick){
      const sale = (S.sales || []).find(x => x.no === Number(bTick.dataset.cshTicket));
      if(sale) showTicket(sale);
      else msg('No se encontró la factura #'+bTick.dataset.cshTicket, 'bad');
    }
  });

  render();

  openWin({
    title: 'MÓDULO CASHEA — Pagos en Cuotas (BNPL), Aprobaciones y Conciliación',
    w: 1040,
    body: el,
    foot: [{ label: 'Cerrar', primary: true }]
  });
}

/* ---------- cobro (con soporte de CASHEA y Crédito / CxC) ---------- */
function payDlg(draft){
  const loginUser=activeUser();
  if(loginUser.role==='admin'){
    if(currentCaja()==='SIN-ASIGNAR'){msg('Para cobrar como administrador, cree una caja y asígnesela en Gestión de Usuarios.','bad');usersManagementDlg(loginUser.username);return;}
    const opening=readActiveOpening();
    if(!opening||opening.status!=='abierta'||String(opening.cashbox)!==currentCaja()){msg('Abra primero el turno de su caja desde Reporte Z antes de cobrar.','bad');corteZDlg();return;}
  }
  draft=draft||{};
  if(!S.cart.length){msg('Agregue productos antes de cobrar.','bad');return;}
  const t=totals(),rate=S.cfg.rate;
  const rowsHtml=METHODS.map(m=>{
    const isBio=m.id==='biopago';
    const isCashea=m.id==='cashea';
    const hasRef=['biopago','punto','pmovil','transf','zelle','cashea'].includes(m.id);
    return '<tr>'+
      '<td><b>'+esc(m.name)+'</b>'+(isBio?' <span class="fiscal-tag ok" style="font-size:10px;padding:1px 5px;margin-left:4px">BDV Huella</span>':'')+(isCashea?' <span class="badge-cashea" style="margin-left:4px">3 Cuotas BNPL</span>':'')+'</td>'+
      '<td class="c mono" style="font-weight:600">'+(m.cur==='USD'?'US$':'Bs.')+'</td>'+
      '<td class="r"><input class="fld r pin" id="pm-'+m.id+'" data-m="'+m.id+'" inputmode="decimal" autocomplete="off" placeholder="0,00" aria-label="Monto recibido en '+esc(m.name)+'"></td>'+
      '<td><button class="btn mini2" data-fill="'+m.id+'" type="button">Saldo</button>'+(isCashea?' <button class="btn mini2" id="btnCasheaAssistantInPay" type="button" style="background:#312E81;color:#E0E7FF;border-color:#4338CA;font-weight:700">⚡ Asistente</button>':'')+'</td>'+
      '<td>'+(hasRef?'<input class="fld mini mono pref" id="pref-'+m.id+'" data-m="'+m.id+'" placeholder="'+(m.id==='zelle'?'Confirmación Zelle':m.id==='punto'?'Voucher / autorización tarjeta':m.id==='biopago'?'Nº operación Biopago':m.id==='pmovil'?'Referencia pago móvil':m.id==='transf'?'Referencia transferencia':isCashea?'Aprobación real Cashea':'Referencia bancaria')+'" style="width:145px" title="'+(isCashea?'Código real de aprobación Cashea':'Referencia / autorización de '+m.name)+'">'
      :'<span class="hint" style="font-size:11px">—</span>')+'</td>'+
    '</tr>';
  }).join('');
  const el=h('<div class="form"><div class="paytop"><div class="lcd"><div class="lcd-label">TOTAL FACTURA</div><div class="lcd-bs">'+bsf(t.total*rate)+'</div><div class="lcd-usd">'+usd(t.total)+'</div></div><table class="sumt"><thead><tr><th>Concepto</th><th class="r">US$</th><th class="r">Bs.</th></tr></thead><tbody id="payRes"></tbody></table></div>'+
    '<div id="casheaPayPreview" hidden style="background:#1E1B4B;border:1px solid #4338CA;border-radius:6px;padding:8px 12px;margin:6px 0;font-size:12px;color:#E0E7FF;display:flex;align-items:center;gap:8px;flex-wrap:wrap"></div>'+
    '<div class="invbar" style="background:var(--alt);padding:5px 8px;border:1px solid var(--lo)">'+
      '<label class="chk"><input type="checkbox" id="payCreditChk"> Enviar saldo pendiente a <b>Cuentas por Cobrar (CxC)</b></label>'+
      '<span id="payCreditDaysWrap" class="row" style="margin-left:auto" hidden><label for="payCreditDays">Plazo crédito (días):</label><input class="fld r" id="payCreditDays" value="15" style="width:64px" inputmode="numeric"></span>'+
    '</div>'+
    '<div class="gridwrap paywrap"><table class="grid"><thead><tr><th>Forma de pago</th><th class="c">Moneda</th><th class="r">Monto recibido</th><th></th><th>Ref. Bancaria / Aprob.</th></tr></thead><tbody>'+rowsHtml+'</tbody></table></div><p class="hint">Trazabilidad: Zelle, tarjeta/Punto, Biopago, Pago Móvil, transferencia y Cashea requieren referencia o autorización real. El efectivo no requiere referencia. Los pagos en divisas (efectivo US$ y Zelle) generan IGTF de 3 %; valide la aplicación fiscal según la operación real.</p></div>');
  const amts=()=>{const o={};METHODS.forEach(m=>{o[m.id]=pn($('#pm-'+m.id,el).value);});return o;};
  const refs=()=>{const o={};METHODS.forEach(m=>{const inp=$('#pref-'+m.id,el);o[m.id]=inp?inp.value.trim():'';});return o;};
  let last=null;
  METHODS.forEach(m=>{const a=$('#pm-'+m.id,el),r=$('#pref-'+m.id,el);if(a&&draft.amts&&draft.amts[m.id]>0)a.value=nf(draft.amts[m.id]);if(r&&draft.refs&&draft.refs[m.id])r.value=draft.refs[m.id];});
  if(draft.credit)$('#payCreditChk',el).checked=true;
  if(draft.cDays)$('#payCreditDays',el).value=String(draft.cDays);
  if(draft.casheaTx){
    el._casheaTx=draft.casheaTx;
    const prev=$('#casheaPayPreview',el);
    prev.hidden=false;
    prev.innerHTML='<b>⚡ CASHEA aplicado:</b> Aprobación <b>'+esc(draft.casheaTx.aprobacion)+'</b> · Inicial: <b>'+usd(draft.casheaTx.inicialUsd)+'</b> · Financiado: <b>'+usd(draft.casheaTx.financiadoUsd)+'</b> ('+draft.casheaTx.cuotasCount+' cuota(s) de '+usd(draft.casheaTx.cuotaUsd)+' c/u). Confirme el cobro para finalizar la factura; luego registre la liquidación en el módulo Cashea.';
  }
  const upd=()=>{
    const st=calcPay(t.total,rate,amts());last=st;
    const isCred=$('#payCreditChk',el).checked;
    $('#payCreditDaysWrap',el).hidden=!isCred;
    const row=(c,a,cls,tot)=>'<tr class="'+(cls||'')+(tot?' tot':'')+'"><td>'+c+'</td><td class="r">'+nf(a)+'</td><td class="r">'+nf(a*rate)+'</td></tr>';
    let html=row('Total factura',t.total)+row('IGTF 3 % (divisas)',st.igtf)+row('Total a cobrar',st.due,'',true);
    if(st.pending>=0.01){
      html+=row(isCred?'Saldo a Cuentas por Cobrar (CxC)':'Falta por cobrar',st.pending,isCred?'good':'warn');
    }
    else if(st.change>=0.01)html+=row('Vuelto al cliente',st.change,'good');
    else html+='<tr class="good"><td colspan="3">Saldo cubierto. Puede confirmar el cobro.</td></tr>';
    $('#payRes',el).innerHTML=html;
    const b=$('#btnConfirm');if(b)b.disabled=!(st.pending<0.01||isCred);
  };
  el.addEventListener('input',e=>{if(e.target.matches('.pin'))upd();});
  el.addEventListener('change',e=>{if(e.target.id==='payCreditChk')upd();});
  el.addEventListener('click',e=>{
    if(e.target.id==='btnCasheaAssistantInPay'||e.target.closest('#btnCasheaAssistantInPay')){
      const draftNow={amts:amts(),refs:refs(),credit:$('#payCreditChk',el).checked,cDays:Math.max(1,Math.round(pn($('#payCreditDays',el).value)||15)),casheaTx:el._casheaTx||null};
      casheaPaymentAssistantDlg(t.total,rate,(cData)=>{
        draftNow.casheaTx=cData;
        draftNow.refs={cashea:cData.aprobacion};
        draftNow.amts={cashea:cData.financiadoUsd};
        (cData.initialPayments||[]).forEach(p=>{draftNow.amts[p.id]=p.amount;if(p.ref)draftNow.refs[p.id]=p.ref;});
        payDlg(draftNow);
      },()=>payDlg(draftNow));
      return;
    }
    const b=e.target.closest('[data-fill]');if(!b)return;
    const m=METHODS.find(x=>x.id===b.dataset.fill),inp=$('#pm-'+m.id,el);
    inp.value='';
    const st=calcPay(t.total,rate,amts());
    if(st.pending>=0.005){
      const isDivisa=m.id==='efUSD'||m.id==='zelle';
      inp.value=nf(m.cur==='USD'?(isDivisa?r2(st.pending*(1+IGTF)):r2(st.pending)):r2(st.pending*rate));
    }
    upd();inp.focus();inp.select();
  });
  openWin({title:'Cobrar factura '+pad(S.invoice),w:760,body:el,
    foot:[{label:'Cancelar'},{id:'btnConfirm',label:'Confirmar cobro',primary:true,fn:()=>{
      const isCred=$('#payCreditChk',el).checked;
      if(!last||(last.pending>=0.01&&!isCred))return false;
      const enteredAmts=amts(),enteredRefs=refs();
      const refPrompts={zelle:'confirmación o referencia de Zelle',punto:'voucher o código de autorización de la tarjeta',biopago:'número de operación/autorización de Biopago',pmovil:'referencia del pago móvil',transf:'referencia de la transferencia',cashea:'código real de aprobación de Cashea'};
      for(const m of METHODS){if((enteredAmts[m.id]||0)>0&&refPrompts[m.id]&&!enteredRefs[m.id]){msg('Complete la '+refPrompts[m.id]+' para registrar la trazabilidad de '+m.name+'.','bad');const ri=$('#pref-'+m.id,el);if(ri)ri.focus();return false;}}
      if(enteredAmts.cashea>0&&el._casheaTx&&Math.abs(enteredAmts.cashea-el._casheaTx.financiadoUsd)>0.01){msg('El importe financiado no coincide con el plan Cashea aplicado. Vuelva al asistente.','bad');return false;}
      if(isCred&&last.pending>=0.01&&S.client.rif==='V-00000000'){
        msg('Para ventas a crédito (CxC), seleccione o registre primero el cliente (F4).','bad');
        return false;
      }
      const cDays=Math.max(1,Math.round(pn($('#payCreditDays',el).value)||15));
      finalize(last,enteredAmts,isCred,cDays,enteredRefs,el);return false;
    }}],
    onOpen:()=>{upd();$('#pm-efUSD',el).focus();}});
}

function showSaleCompletion(sale){
  const change=r2(Math.max(0,Number(sale.change)||0));
  const rate=Number(sale.rate||S.cfg.rate)||1;
  const hasChange=change>=0.01;
  const body=h('<div class="sale-completion">'+
    '<div class="sale-completion-icon '+(hasChange?'change':'success')+'">'+(hasChange?'↩':'✓')+'</div>'+
    '<div class="sale-completion-label">'+(hasChange?'VUELTO A ENTREGAR':'VENTA FINALIZADA')+'</div>'+
    (hasChange?'<div class="sale-completion-amount">'+esc(usd(change))+'</div><div class="sale-completion-equivalent">Equivalente: <b>'+esc(bsf(r2(change*rate)))+'</b></div><p class="sale-completion-note">Entregue el vuelto en efectivo según la moneda acordada con el cliente. Si el excedente provino de un pago electrónico, gestione la devolución por ese mismo medio.</p>':'<p class="sale-completion-note">La factura '+esc(pad(sale.no))+' fue registrada correctamente. No hay vuelto pendiente.</p>')+
    '<div class="sale-completion-ticket">Factura <b>'+esc(pad(sale.no))+'</b> · Total <b>'+esc(usd(r2(sale.total+sale.igtf)))+'</b></div>'+
    '</div>');
  openWin({title:hasChange?'Vuelto de la venta':'Venta finalizada',w:390,body,foot:[
    {label:'Ver / imprimir ticket',primary:true,fn:()=>{closeWin();showTicket(sale);return false;}},
    {label:'Cerrar'}
  ],onOpen:()=>{const node=$('.sale-completion',body);if(node)node.setAttribute('tabindex','-1');}});
}

function finalize(st,amts,isCred,cDays,refs,payEl){
  const ctx=cajaContext();if(ctx.role==='cajero'&&ctx.status!=='abierta'){msg('La caja no está abierta. Solicite al administrador una nueva apertura antes de facturar.','bad');return;}
  const t=totals(), ts=Date.now(), invNo=nextCajaInvoice();
  const lines=S.cart.map(l=>{
    const i=lineInfo(l);
    return{
      code:l.code,
      desc:i.p.brand+' '+i.p.desc,
      unit:i.p.unit||'und',
      qty:l.qty,
      price:i.p.price,
      disc:l.disc,
      taxRate:i.rate,
      taxType:(i.p.tax&&i.p.tax.type)||'G',
      taxTag:prodTaxTag(i.p),
      iva:i.iva,
      net:i.net
    };
  });
  const pays=METHODS.filter(m=>amts[m.id]>0).map(m=>({
    id:m.id,
    name:m.name,
    cur:m.cur,
    amount:r2(amts[m.id]),
    ref:(refs&&refs[m.id])||''
  }));
  const creditAmt=(isCred&&st.pending>=0.01)?r2(st.pending):0;
  if(creditAmt>0){
    pays.push({id:'credito',name:'Crédito CxC ('+cDays+' días)',cur:'USD',amount:creditAmt});
  }
  const ctrlPrefix=S.cfg.ctrlPrefix||'00-';
  const seqs=cajaSeqs(),boxSeq=seqs[currentCaja()]||(seqs[currentCaja()]={invoice:1,void:1,refund:1,cxc:1,movement:1,z:1});
  const ctrlNext=Number(boxSeq.ctrl||1);boxSeq.ctrl=ctrlNext+1;localStorage.setItem('sifer360_box_sequences',JSON.stringify(seqs));
  const ctrlNo=ctrlPrefix+String(currentCaja()).replace(/\W/g,'').slice(-4)+'-'+pad(ctrlNext,8);
  const sale={
    no:invNo,ctrlNo,docType:'01-FACTURA',transType:'01-REG',
    ts,cashbox:currentCaja(),cashier:currentCajero(),client:Object.assign({},S.client),lines,
    sub:t.sub,disc:t.disc,base:t.base,
    baseG16:t.baseG16,baseR8:t.baseR8,baseA31:t.baseA31,baseEx:t.baseEx,
    iva:t.iva,total:t.total,igtf:st.igtf,rate:S.cfg.rate,pays,
    change:r2(st.change),credit:creditAmt,void:false
  };

  const casheaAmt=r2(amts.cashea||0);
  if(casheaAmt>0){
    const cRef=(refs&&refs.cashea)||'';
    if(!cRef){msg('Falta el código real de aprobación Cashea; no se generará una referencia ficticia.','bad');return;}
    const cTx=(payEl&&payEl._casheaTx)||{};
    const inicialUsd=cTx.inicialUsd!==undefined?cTx.inicialUsd:r2(t.total-casheaAmt);
    const nivel=cTx.nivel||'Nivel 3 (40% inicial / 60% financiado)';
    const cuotasCount=cTx.cuotasCount||3;
    const cuotaUsd=r2(casheaAmt/cuotasCount);
    sale.cashea={
      aprobacion:cRef,
      ci:S.client.rif,
      cliente:S.client.name,
      nivel,
      totalVenta:t.total,
      inicialUsd,
      inicialMetodo:cTx.inicialMetodoName||'Caja',
      financiadoUsd:casheaAmt,
      cuotasCount,
      cuotaUsd,
      fechasCuotas:Array.from({length:cuotasCount},(_,i)=>ts+(i+1)*14*86400000).map(fmtDT),
      estado:'Pendiente Liquidación'
    };
    if(!Array.isArray(S.casheaMovimientos))S.casheaMovimientos=[];
    S.casheaMovimientos.push({
      id:'CSH-MOV-'+pad(S.casheaMovimientos.length+1,4),
      ventaNo:invNo,
      ctrlNo,
      ts,
      clienteCi:S.client.rif,
      clienteNombre:S.client.name,
      aprobacion:cRef,
      totalVenta:t.total,
      inicialUsd,
      financiadoUsd:casheaAmt,
      cuotasCount,
      cuotaUsd,
      estado:'Pendiente Liquidación',
      loteLiquidacion:null,
      fechaLiquidacion:null
    });
  }

  S.cart.forEach(l=>{
    const p=prod(l.code);
    p.stock=Math.max(0,r2(p.stock-l.qty));
    addKardex({
      ts,code:p.code,type:'VENTA',dir:'OUT',doc:'FAC-'+pad(invNo),
      party:S.client.name,qty:l.qty,stockAfter:p.stock,cost:p.cost,user:S.cfg.cajero
    });
  });
  if(creditAmt>0){
    const paidUpfront=r2(Math.max(0,t.total-creditAmt));
    S.cxc.push({
      id:'CXC-'+String(currentCaja()).replace(/\W/g,'')+'-'+pad(S.cxc.filter(x=>x.cashbox===currentCaja()).length+1,6),
      cashbox:currentCaja(),cashier:currentCajero(),saleNo:invNo,
      doc:'FAC-'+pad(invNo),
      client:Object.assign({},S.client),
      concept:'Factura de venta ('+lines.length+' reng.)',
      ts,dueTs:ts+cDays*86400000,
      total:t.total,
      paid:paidUpfront,
      payments:paidUpfront>0?[{ts,method:'Pago inicial en caja',cur:'USD',amountUsd:paidUpfront,amountBs:r2(paidUpfront*S.cfg.rate),ref:'FAC-'+pad(invNo),note:'Abono en caja al facturar'}]:[]
    });
  }
  S.sales.push(sale);S.invoice=Math.max(S.invoice,invNo+1);S.cart=[];S.sel=-1;S.client=S.clients[0];
  save();renderAll();
  msg('Factura '+pad(sale.no)+' procesada por '+usd(r2(sale.total+sale.igtf))+(casheaAmt>0?' (Financiado Cashea: '+usd(casheaAmt)+')':'')+(creditAmt>0?' (Saldo a CxC: '+usd(creditAmt)+')':'')+'.');
  showSaleCompletion(sale);
}

const TICKET_FONTS=window.POS_OPTIONS.TICKET_FONTS;
