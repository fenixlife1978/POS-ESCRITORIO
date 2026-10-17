/* Compras, cuentas por cobrar y cuentas por pagar. Fragmento ensamblado dentro del IIFE de main.js por scripts/build-main.mjs. */
function comprasDlg(initialTab){
  let tab=initialTab||'new';
  let supIdx=0;
  let pLines=window.POS_SEED_OPERATIONS.purchaseFormDefaults.map(line=>({...line}));
  let cond='Crédito', creditDays=15, applyIva=true, paidInit=0, payMethod='Transferencia Bs.';

  const el=h('<div class="form"><div class="tabs"><button class="tab" data-tab="new">Registrar Compra de Mercancía</button><button class="tab" data-tab="hist">Historial de Compras</button><button class="tab" data-tab="sup">Directorio de Proveedores</button></div><div id="compView"></div></div>');

  const renderView=()=>{
    $$('.tab',el).forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
    const v=$('#compView',el);
    if(tab==='new')renderNewPurchase(v);
    else if(tab==='hist')renderPurchaseHist(v);
    else renderSuppliersTab(v);
  };

  const renderNewPurchase=v=>{
    const supOpts=S.suppliers.map((s,i)=>'<option value="'+i+'"'+(i===supIdx?' selected':'')+'>'+esc(s.name)+' ('+esc(s.rif)+')</option>').join('');
    const prodOpts=S.products.map(p=>'<option value="'+esc(p.code)+'">'+esc(p.code)+' — '+esc(p.desc)+' ('+esc(p.brand)+') [Stock: '+fq(p.stock)+']</option>').join('');
    v.innerHTML=
      '<div class="fltgrid">'+
        '<div class="f" style="grid-column:span 2"><label for="cpSup">Proveedor</label><select class="fld" id="cpSup">'+supOpts+'</select></div>'+
        '<div class="f"><label for="cpDoc">Nº Factura / Control Prov.</label><input class="fld mono" id="cpDoc" value="F-'+pad(S.purchaseSeq*41,6)+'" autocomplete="off"></div>'+
        '<div class="f"><label for="cpCond">Condición de Compra</label><select class="fld" id="cpCond"><option value="Crédito"'+(cond==='Crédito'?' selected':'')+'>Crédito (Genera CxP)</option><option value="Contado"'+(cond==='Contado'?' selected':'')+'>Contado (Pagada)</option></select></div>'+
        '<div class="f" id="cpDaysWrap"><label for="cpDays">Plazo Crédito (días)</label><input class="fld r" id="cpDays" value="'+creditDays+'" inputmode="numeric"></div>'+
        '<div class="f"><label for="cpInit">Abono / Pago Inicial US$</label><input class="fld r" id="cpInit" value="'+(paidInit?nf(paidInit):'0,00')+'" inputmode="decimal"></div>'+
        '<div class="f"><label for="cpMethod">Medio de Pago Inicial</label><select class="fld" id="cpMethod">'+METHODS.map(m=>'<option value="'+esc(m.name)+'"'+(payMethod===m.name?' selected':'')+'>'+esc(m.name)+'</option>').join('')+'</select></div>'+
      '</div>'+
      '<div class="invbar">'+
        '<label for="cpAddProd">Agregar producto</label>'+
        '<select class="fld" id="cpAddProd" style="flex:2">'+prodOpts+'</select>'+
        '<label for="cpAddQty">Cant.</label>'+
        '<input class="fld r" id="cpAddQty" value="6" style="max-width:75px" inputmode="decimal">'+
        '<button class="btn" id="cpBtnAdd">+ Agregar renglón</button>'+
        '<label class="chk" style="margin-left:auto"><input type="checkbox" id="cpIva" '+(applyIva?'checked':'')+'> Incluye IVA 16 %</label>'+
      '</div>'+
      '<div class="gridwrap invwrap"><table class="grid" style="min-width:820px">'+
        '<thead><tr><th>Código</th><th>Producto</th><th class="r">Stock Act.</th><th class="r">Cantidad Recibida</th><th class="r">Costo Unit. US$</th><th class="r">P. Venta US$</th><th class="r">Subtotal US$</th><th></th></tr></thead>'+
        '<tbody id="cpBody"></tbody>'+
      '</table></div>'+
      '<div class="cierre" id="cpTotals"></div>';

    const drawLines=()=>{
      $('#cpDaysWrap',v).style.display=cond==='Crédito'?'':'none';
      $('#cpBody',v).innerHTML=pLines.length?pLines.map((l,i)=>{
        const p=prod(l.code);if(!p)return '';
        const sub=r2(l.qty*l.cost);
        return '<tr data-pi="'+i+'">'+
          '<td class="mono">'+esc(p.code)+'</td>'+
          '<td><div class="desc">'+esc(p.desc)+'</div><div class="sub">'+esc(p.brand)+' · '+esc(p.cat)+'</div></td>'+
          '<td class="r '+stockCls(p)+'">'+fq(p.stock)+'</td>'+
          '<td class="r"><input class="fld cell r" data-cpf="qty" value="'+fq(l.qty)+'" inputmode="decimal"></td>'+
          '<td class="r"><input class="fld cell r" data-cpf="cost" value="'+nf(l.cost)+'" inputmode="decimal"></td>'+
          '<td class="r"><input class="fld cell r" data-cpf="price" value="'+nf(l.price)+'" inputmode="decimal"></td>'+
          '<td class="r"><b>'+nf(sub)+'</b></td>'+
          '<td class="c"><button class="mini" data-cpdel="'+i+'" title="Quitar">&times;</button></td>'+
        '</tr>';
      }).join(''):'<tr class="empty"><td colspan="8">Agregue productos a la orden de compra.</td></tr>';

      const base=r2(pLines.reduce((a,l)=>a+r2(l.qty*l.cost),0));
      const iva=applyIva?r2(base*IVA):0;
      const tot=r2(base+iva);
      const effPaid=cond==='Contado'?tot:Math.min(tot,paidInit);
      const pend=r2(Math.max(0,tot-effPaid));
      $('#cpTotals',v).innerHTML=
        '<table class="sumt"><thead><tr><th>Resumen de Compra</th><th class="r">US$</th><th class="r">Bs. (Tasa '+nf(S.cfg.rate)+')</th></tr></thead><tbody>'+
          '<tr><td>Base imponible (Costo mercancía)</td><td class="r">'+nf(base)+'</td><td class="r">'+nf(base*S.cfg.rate)+'</td></tr>'+
          '<tr><td>IVA 16 % Crédito Fiscal</td><td class="r">'+nf(iva)+'</td><td class="r">'+nf(iva*S.cfg.rate)+'</td></tr>'+
          '<tr class="tot"><td>Total Factura de Compra</td><td class="r">'+nf(tot)+'</td><td class="r">'+nf(tot*S.cfg.rate)+'</td></tr>'+
        '</tbody></table>'+
        '<table class="sumt"><thead><tr><th>Condición Financiera</th><th class="r">US$</th><th class="r">Bs.</th></tr></thead><tbody>'+
          '<tr><td>Modalidad</td><td colspan="2" class="r"><b>'+esc(cond)+(cond==='Crédito'?' ('+creditDays+' días)':'')+'</b></td></tr>'+
          '<tr class="good"><td>Monto Pagado / Abonado</td><td class="r">'+nf(effPaid)+'</td><td class="r">'+nf(effPaid*S.cfg.rate)+'</td></tr>'+
          '<tr class="'+(pend>0?'warn':'')+'"><td>Saldo a Cuentas por Pagar (CxP)</td><td class="r">'+nf(pend)+'</td><td class="r">'+nf(pend*S.cfg.rate)+'</td></tr>'+
        '</tbody></table>';
    };

    v.onchange=e=>{
      const t=e.target;
      if(t.id==='cpSup'){supIdx=+t.value;return;}
      if(t.id==='cpCond'){cond=t.value;drawLines();return;}
      if(t.id==='cpDays'){creditDays=Math.max(1,Math.round(pn(t.value)||15));drawLines();return;}
      if(t.id==='cpInit'){paidInit=pn(t.value);t.value=nf(paidInit);drawLines();return;}
      if(t.id==='cpMethod'){payMethod=t.value;return;}
      if(t.id==='cpIva'){applyIva=t.checked;drawLines();return;}
      if(t.dataset.cpf){
        const tr=t.closest('tr'), idx=+tr.dataset.pi, l=pLines[idx];
        const val=pn(t.value);
        if(t.dataset.cpf==='qty')l.qty=val||1;
        if(t.dataset.cpf==='cost')l.cost=val||l.cost;
        if(t.dataset.cpf==='price')l.price=val||l.price;
        drawLines();
      }
    };
    v.onclick=e=>{
      if(e.target.id==='cpBtnAdd'){
        const code=$('#cpAddProd',v).value, qty=pn($('#cpAddQty',v).value)||1, p=prod(code);
        if(!p)return;
        const ex=pLines.find(x=>x.code===code);
        if(ex)ex.qty=r2(ex.qty+qty);
        else pLines.push({code,qty,cost:p.cost,price:p.price});
        drawLines();
      }
      const del=e.target.closest('[data-cpdel]');
      if(del){pLines.splice(+del.dataset.cpdel,1);drawLines();}
    };
    drawLines();
  };

  const renderPurchaseHist=v=>{
    const list=(S.purchases||[]).slice().sort((a,b)=>b.no-a.no);
    v.innerHTML=
      '<div class="gridwrap tallwrap"><table class="grid" style="min-width:820px">'+
        '<thead><tr><th>Compra Nº</th><th>Fac. Prov.</th><th>Fecha</th><th>Proveedor</th><th>Condición</th><th class="r">Total US$</th><th class="r">Pagado US$</th><th class="r">Saldo CxP</th><th>Acción</th></tr></thead>'+
        '<tbody>'+(list.length?list.map(c=>{
          const pend=r2(Math.max(0,c.total-(c.paid||0)));
          return '<tr class="'+(c.void?'void':'')+'">'+
            '<td class="mono">COM-'+pad(c.no)+'</td>'+
            '<td class="mono">'+esc(c.docProv)+'</td>'+
            '<td>'+fmtDT(c.ts)+'</td>'+
            '<td>'+esc(c.supplier.name)+'</td>'+
            '<td>'+esc(c.cond)+'</td>'+
            '<td class="r">'+nf(c.total)+'</td>'+
            '<td class="r">'+nf(c.paid||0)+'</td>'+
            '<td class="r '+(pend>0&&!c.void?'st-low':'')+'">'+(c.void?'ANULADA':nf(pend))+'</td>'+
            '<td class="c">'+(c.void?'—':'<button class="btn mini2" data-void-comp="'+c.no+'">Anular</button>')+'</td>'+
          '</tr>';
        }).join(''):'<tr class="empty"><td colspan="9">Sin compras registradas.</td></tr>')+'</tbody>'+
      '</table></div>';
    v.onclick=e=>{
      const b=e.target.closest('[data-void-comp]');
      if(!b)return;
      const c=S.purchases.find(x=>x.no===+b.dataset.voidComp);
      if(!c||c.void)return;
      c.void=true;
      c.lines.forEach(l=>{
        const p=prod(l.code);
        if(p){
          p.stock=Math.max(0,r2(p.stock-l.qty));
          addKardex({
            code:p.code,type:'ANULACIÓN',dir:'OUT',doc:'COM-'+pad(c.no),
            party:'Anulación compra prov. '+c.supplier.name,qty:l.qty,stockAfter:p.stock,cost:l.cost,user:S.cfg.cajero
          });
        }
      });
      S.cxp=(S.cxp||[]).filter(x=>x.purchaseNo!==c.no);
      save();renderAll();renderPurchaseHist(v);
      msg('Compra COM-'+pad(c.no)+' anulada. Se revirtió el ingreso en inventario y Kardex.');
    };
  };

  const renderSuppliersTab=v=>{
    v.innerHTML=
      '<div class="gridwrap invwrap"><table class="grid"><thead><tr><th>Código</th><th>Razón Social / Proveedor</th><th>RIF</th><th>Teléfono</th><th>Condición Habitual</th><th>Retención IVA</th></tr></thead><tbody>'+
        S.suppliers.map(s=>'<tr><td class="mono">'+esc(s.id)+'</td><td><b>'+esc(s.name)+'</b></td><td class="mono">'+esc(s.rif)+'</td><td>'+esc(s.tel)+'</td><td>'+esc(s.cond)+'</td><td>'+'<select class="fld" data-ret-iva="'+esc(s.id)+'" aria-label="Sujeto a retención IVA"><option value="no"'+(s.retieneIva===true?'':' selected')+'>No / verificar</option><option value="si"'+(s.retieneIva===true?' selected':'')+'>Sí, confirmado</option></select>'+'</td></tr>').join('')+
      '</tbody></table></div>'+
      '<details class="newp" open><summary>Registrar nuevo proveedor</summary><div class="newgrid">'+
        '<div class="f"><label for="nsRif">RIF</label><input class="fld" id="nsRif" placeholder="J-00000000-0"></div>'+
        '<div class="f wide"><label for="nsName">Razón Social</label><input class="fld" id="nsName" placeholder="Nombre de la distribuidora o fabricante"></div>'+
        '<div class="f"><label for="nsTel">Teléfono</label><input class="fld" id="nsTel"></div>'+
        '<div class="f"><label for="nsCond">Condición</label><select class="fld" id="nsCond"><option>Contado</option><option selected>15 días</option><option>30 días</option></select></div>'+
        '<div class="f"><label for="nsRetIva">Sujeto a retención de IVA</label><select class="fld" id="nsRetIva"><option value="no" selected>No / por verificar</option><option value="si">Sí, confirmado</option></select></div>'+
      '</div><p class="muted">Active esta opción solo después de verificar la condición fiscal del proveedor y la operación.</p><button class="btn" id="nsSave">Guardar proveedor</button></details>';
    v.onchange=e=>{
      const ctl=e.target.closest('[data-ret-iva]');
      if(!ctl)return;
      const sup=S.suppliers.find(x=>x.id===ctl.dataset.retIva);
      if(!sup)return;
      sup.retieneIva=ctl.value==='si';
      save();
      renderSuppliersTab(v);
      msg('Configuración de retención IVA actualizada para '+sup.name+'.');
    };
    v.onclick=e=>{
      if(e.target.id==='nsSave'){
        const rif=$('#nsRif',v).value.trim(), name=$('#nsName',v).value.trim();
        if(!rif||!name){msg('Indique RIF y razón social del proveedor.','bad');return;}
        S.suppliers.push({id:'PRV-'+two(S.suppliers.length+1),name,rif,tel:$('#nsTel',v).value.trim(),cond:$('#nsCond',v).value,retieneIva:$('#nsRetIva',v).value==='si'});
        save();renderSuppliersTab(v);msg('Proveedor '+name+' registrado.');
      }
    };
  };

  el.addEventListener('click',e=>{
    const tb=e.target.closest('[data-tab]');
    if(tb){tab=tb.dataset.tab;renderView();}
  });

  const processPurchase=()=>{
    if(tab!=='new')return true;
    if(!pLines.length){msg('Agregue al menos un producto a la compra.','bad');return false;}
    const sup=S.suppliers[supIdx]||S.suppliers[0];
    const docProv=($('#cpDoc',el)?$('#cpDoc',el).value.trim():'')||('F-'+S.purchaseSeq);
    const ts=Date.now();
    const no=S.purchaseSeq++;
    const lines=pLines.map(l=>{
      const p=prod(l.code);
      /* Costo Promedio Ponderado */
      const prevVal=Math.max(0,p.stock)*p.cost;
      const newVal=l.qty*l.cost;
      const nextStock=r2(p.stock+l.qty);
      const nextCost=nextStock>0?r2((prevVal+newVal)/nextStock):l.cost;
      p.stock=nextStock;
      p.cost=nextCost;
      if(l.price>0)p.price=r2(l.price);
      addKardex({
        ts,code:p.code,type:'COMPRA',dir:'IN',doc:'COM-'+pad(no),
        party:sup.name+' (Fac. '+docProv+')',qty:l.qty,stockAfter:p.stock,cost:l.cost,user:S.cfg.cajero
      });
      return{code:p.code,desc:p.brand+' '+p.desc,qty:l.qty,cost:l.cost,sub:r2(l.qty*l.cost)};
    });
    const base=r2(lines.reduce((a,x)=>a+x.sub,0));
    const iva=applyIva?r2(base*IVA):0;
    const total=r2(base+iva);
    const dueTs=ts+creditDays*86400000;
    const retPct=75; /* Por defecto legal ordinario; los casos especiales al 100% se documentan aparte para revisión del contador. */
    const aplicarRetencion=!!(applyIva&&iva>0&&S.cfg.contribEspecial&&S.cfg.retencionHabilitadaConfirmada===true&&sup.retieneIva===true);
    const retUsd=aplicarRetencion?r2(iva*(retPct/100)):0;
    const retBs=r2(retUsd*S.cfg.rate);
    const payableTotal=r2(Math.max(0,total-retUsd));
    const effPaid=cond==='Contado'?payableTotal:Math.min(payableTotal,paidInit);
    const comp={no,docProv,ts,dueTs,supplier:Object.assign({},sup),cond,lines,base,iva,total,payableTotal,retIva:retUsd,rate:S.cfg.rate,paid:effPaid,void:false};
    comp.ctrlProv='00-'+pad(no+4400,8);
    if(aplicarRetencion){
      const periodo=(()=>{const d=new Date(ts);return String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0');})();
      const retSeq=(S.retencionesIva||[]).filter(r=>String(r.periodo)===periodo).reduce((m,r)=>Math.max(m,Number(String(r.id||'').slice(-8))||0),0)+1;
      const retDoc=periodo+pad(retSeq,8);
      comp.retIvaDoc=retDoc;
      if(!S.retencionesIva)S.retencionesIva=[];
      S.retencionesIva.push({
        id:retDoc,ts,periodo,supplier:Object.assign({},sup),purchaseNo:no,docProv,
        ctrlProv:comp.ctrlProv,base,iva,pct:retPct,rate:S.cfg.rate,
        retainedUsd:retUsd,retainedBs:retBs,
        estado:'Pendiente de revisión del contador',declarada:false,pagada:false,comprobanteEntregado:false,observaciones:''
      });
    }
    S.purchases.push(comp);
    if(payableTotal-effPaid>=0.01){
      const cxpId='CXP-'+pad((S.cxp.length+1),4);
      const payments=effPaid>0?[{ts,method:payMethod,cur:'VES',amountBs:r2(effPaid*S.cfg.rate),amountUsd:effPaid,ref:'INI-'+no,note:'Abono inicial en compra'}]:[];
      S.cxp.push({
        id:cxpId,purchaseNo:no,doc:docProv+' (COM-'+pad(no)+')',
        supplier:Object.assign({},sup),
        concept:'Compra mercancía ('+lines.length+' reng.)'+(retUsd>0?' — retención IVA '+usd(retUsd):''),
        ts,dueTs,total:payableTotal,invoiceTotal:total,retIva:retUsd,paid:effPaid,payments
      });
    }
    save();renderAll();
    msg('Compra COM-'+pad(no)+' guardada. Factura: '+usd(total)+(retUsd>0?'; IVA retenido: '+usd(retUsd)+'; saldo a proveedor: '+usd(payableTotal):'')+'. Stock, costos y Kardex actualizados.');
    return true;
  };

  openWin({
    title:'Módulo de Compras y Recepción de Mercancía',
    w:980,
    body:el,
    foot:[
      {label:'Ir a Cuentas por Pagar (CxP)',left:true,fn:()=>{cxpDlg();return false;}},
      {label:'Cancelar'},
      {label:'Procesar y Guardar Compra',primary:true,fn:processPurchase}
    ],
    onEnter:()=>{},
    onOpen:()=>{renderView();}
  });
}

/* ---------- MÓDULO DE CUENTAS POR COBRAR (CxC) ---------- */
function cxcDlg(selId){
  let fState='PEND', fQ='', curId=selId||null, payMode='SINGLE';
  let mixState={};
  const resetMix=()=>{
    mixState={};
    METHODS.forEach(m=>{mixState[m.id]={usd:0,bs:0,ref:''};});
  };
  resetMix();

  const el=h('<div class="form">'+
    '<div class="kpis" id="cxcKpis"></div>'+
    '<div class="invbar">'+
      '<label for="cxcState">Estado</label>'+
      '<select class="fld" id="cxcState" style="max-width:190px"><option value="PEND">Pendientes por cobrar</option><option value="OVER">Solo vencidas</option><option value="PAID">Pagadas / Solventes</option><option value="ALL">Todas las cuentas</option></select>'+
      '<label for="cxcQ">Buscar</label>'+
      '<input class="fld" id="cxcQ" placeholder="Cliente, RIF o Nº de factura..." autocomplete="off">'+
      '<button class="btn mini2" id="cxcNewBtn">+ Nuevo Cargo / CxC Manual</button>'+
    '</div>'+
    '<div class="gridwrap invwrap" style="height:175px"><table class="grid" style="min-width:860px">'+
      '<thead><tr><th>Doc. / Factura</th><th>Cliente</th><th>RIF</th><th>Emisión</th><th>Vencimiento</th><th>Estado</th><th class="r">Total US$</th><th class="r">Abonado US$</th><th class="r">Saldo US$</th><th class="r">Saldo Bs.</th></tr></thead>'+
      '<tbody id="cxcBody"></tbody>'+
    '</table></div>'+
    '<div class="group" id="cxcDetail"></div>'+
  '</div>');

  const draw=()=>{
    const now=Date.now(), rate=S.cfg.rate, all=(S.cxc||[]).filter(x=>x.cashbox===currentCaja());
    const totPend=r2(all.reduce((a,x)=>a+Math.max(0,x.total-x.paid),0));
    const totOver=r2(all.filter(x=>x.total-x.paid>=0.01&&x.dueTs<now).reduce((a,x)=>a+Math.max(0,x.total-x.paid),0));
    const totVig=r2(Math.max(0,totPend-totOver));
    let cobHoy=0;
    all.forEach(x=>(x.payments||[]).forEach(p=>{if(sameDay(p.ts))cobHoy+=p.amountUsd;}));
    cobHoy=r2(cobHoy);

    $('#cxcKpis',el).innerHTML=
      '<div class="kpi"><span>Total por Cobrar (Cartera)</span><b class="warn">'+usd(totPend)+'</b><small>'+bsf(totPend*rate)+'</small></div>'+
      '<div class="kpi"><span>Cartera Vencida</span><b class="'+(totOver>0?'bad':'')+'">'+usd(totOver)+'</b><small>Requiere gestión de cobro</small></div>'+
      '<div class="kpi"><span>Cartera Vigente (Por vencer)</span><b class="ok">'+usd(totVig)+'</b><small>Dentro del plazo</small></div>'+
      '<div class="kpi"><span>Cobros Recibidos Hoy</span><b class="ok">'+usd(cobHoy)+'</b><small>'+bsf(cobHoy*rate)+'</small></div>';

    const q=norm(fQ);
    const list=all.filter(x=>{
      const bal=r2(x.total-x.paid);
      if(fState==='PEND'&&bal<0.01)return false;
      if(fState==='OVER'&&(bal<0.01||x.dueTs>=now))return false;
      if(fState==='PAID'&&bal>=0.01)return false;
      if(q&&norm(x.doc+x.client.name+x.client.rif+x.concept).indexOf(q)<0)return false;
      return true;
    }).sort((a,b)=>a.dueTs-b.dueTs);

    if(curId&&!list.some(x=>x.id===curId))curId=list[0]?list[0].id:null;
    if(!curId&&list[0])curId=list[0].id;

    $('#cxcBody',el).innerHTML=list.length?list.map(x=>{
      const bal=r2(Math.max(0,x.total-x.paid));
      const isOver=bal>=0.01&&x.dueTs<now;
      const stTxt=bal<0.01?'PAGADA':(isOver?'VENCIDA':'VIGENTE');
      const stCls=bal<0.01?'st-ok':(isOver?'st-out':'st-low');
      return '<tr data-id="'+esc(x.id)+'" class="'+(x.id===curId?'sel':'')+'">'+
        '<td class="mono"><b>'+esc(x.doc)+'</b></td>'+
        '<td><div class="desc">'+esc(x.client.name)+'</div><div class="sub">'+esc(x.concept||'')+'</div></td>'+
        '<td class="mono">'+esc(x.client.rif)+'</td>'+
        '<td>'+fmtD(x.ts)+'</td>'+
        '<td>'+fmtD(x.dueTs)+'</td>'+
        '<td class="'+stCls+'">'+stTxt+'</td>'+
        '<td class="r">'+nf(x.total)+'</td>'+
        '<td class="r">'+nf(x.paid)+'</td>'+
        '<td class="r"><b>'+nf(bal)+'</b></td>'+
        '<td class="r">'+nf(bal*rate)+'</td>'+
      '</tr>';
    }).join(''):'<tr class="empty"><td colspan="10">No hay cuentas por cobrar para el filtro seleccionado.</td></tr>';

    renderDetailBox();
  };

  const calcMixTotalUsd=()=>r2(METHODS.reduce((a,m)=>a+(mixState[m.id]?mixState[m.id].usd:0),0));

  const updateMixSummary=bal=>{
    const rate=S.cfg.rate;
    const sumUsd=calcMixTotalUsd();
    const remUsd=r2(bal-sumUsd);
    const sumEl=$('#cxcMixSum',el);
    if(!sumEl)return;
    let statusHtml='';
    if(sumUsd<=0){
      statusHtml='<span class="dim">Ingrese el monto en uno o más métodos de cobro.</span>';
    }else if(remUsd<-0.01){
      statusHtml='<b class="bad">Excede el saldo por '+usd(Math.abs(remUsd))+' ('+bsf(Math.abs(remUsd)*rate)+')</b>';
    }else if(remUsd<=0.01){
      statusHtml='<b class="ok">Cubre el 100 % del saldo pendiente (Factura solvente)</b>';
    }else{
      statusHtml='<b class="warn">Abono parcial · Resta por cobrar: '+usd(remUsd)+' ('+bsf(remUsd*rate)+')</b>';
    }
    sumEl.innerHTML=
      '<span>Total Cobro Mixto: <b>'+usd(sumUsd)+'</b> ('+bsf(sumUsd*rate)+')</span>'+
      '<span style="margin-left:14px">'+statusHtml+'</span>';
  };

  const renderDetailBox=()=>{
    const box=$('#cxcDetail',el), item=(S.cxc||[]).find(x=>x.id===curId);
    if(!item){box.innerHTML='<span class="dim">Seleccione una cuenta por cobrar para registrar un abono simple o mixto y ver su historial de pagos.</span>';return;}
    const bal=r2(Math.max(0,item.total-item.paid)), rate=S.cfg.rate;
    const mOpts='<option value="MIXTO"'+(payMode==='MIXTO'?' selected':'')+'>★ Cobro Mixto (Múltiples métodos de pago)</option>'+
      METHODS.map(m=>'<option value="'+esc(m.id)+'"'+(payMode===m.id?' selected':'')+'>'+esc(m.name)+' ('+m.cur+')</option>').join('');
    const hist=(item.payments||[]).map(p=>'<tr><td>'+fmtDT(p.ts)+'</td><td>'+esc(p.method)+'</td><td class="mono">'+esc(p.ref||'-')+'</td><td class="r">'+nf(p.amountUsd)+'</td><td class="r">'+nf(p.amountBs)+'</td><td>'+esc(p.note||'')+'</td></tr>').join('')||'<tr><td colspan="6" class="dim">Sin abonos registrados todavía.</td></tr>';

    let formHtml='';
    if(bal<0.01){
      formHtml='<div class="dim" style="margin-bottom:6px">Esta factura ya se encuentra totalmente solvente.</div>';
    }else if(payMode!=='MIXTO'){
      formHtml=
        '<div class="invbar" style="margin-bottom:6px">'+
          '<label>Forma de cobro</label><select class="fld" id="abMethod" style="max-width:235px">'+mOpts+'</select>'+
          '<label>Monto US$</label><input class="fld r" id="abUsd" value="'+nf(bal)+'" style="max-width:92px" inputmode="decimal">'+
          '<label>Equiv. Bs.</label><input class="fld r" id="abBs" value="'+nf(bal*rate)+'" style="max-width:105px" inputmode="decimal">'+
          '<label>Referencia</label><input class="fld" id="abRef" placeholder="Nº recibo / op." style="max-width:115px">'+
          '<label>Nota</label><input class="fld" id="abNote" placeholder="Abono a factura">'+
          '<button class="btn mini2" id="abSwitchMixBtn" title="Distribuir el cobro entre varios métodos de pago">Cobro Mixto…</button>'+
          '<button class="btn primary" id="abSaveBtn">Registrar Cobro</button>'+
        '</div>';
    }else{
      const mixRows=METHODS.map(m=>{
        const st=mixState[m.id]||{usd:0,bs:0,ref:''};
        const isUsd=m.cur==='USD';
        return '<tr>'+
          '<td><b>'+esc(m.name)+'</b></td>'+
          '<td class="c"><span class="sku-tag">'+(isUsd?'US$':'Bs.')+'</span></td>'+
          '<td class="r" style="width:125px"><input class="fld r cxc-mix-usd" data-m="'+esc(m.id)+'" value="'+(st.usd>0?nf(st.usd):'')+'" placeholder="0,00" inputmode="decimal"></td>'+
          '<td class="r" style="width:135px"><input class="fld r cxc-mix-bs" data-m="'+esc(m.id)+'" value="'+(st.bs>0?nf(st.bs):'')+'" placeholder="0,00" inputmode="decimal"></td>'+
          '<td style="width:155px"><input class="fld mono cxc-mix-ref" data-m="'+esc(m.id)+'" value="'+esc(st.ref||'')+'" placeholder="Nº ref. / lote / op."></td>'+
          '<td class="c" style="width:85px"><button class="btn mini2" data-cxc-fill="'+esc(m.id)+'" title="Asignar el saldo restante a este método">Restante</button></td>'+
        '</tr>';
      }).join('');
      formHtml=
        '<div style="background:var(--alt);border:1px solid var(--lo);padding:6px 8px;margin-bottom:6px">'+
          '<div class="invbar" style="margin-bottom:6px">'+
            '<label>Forma de cobro</label><select class="fld" id="abMethod" style="max-width:250px;font-weight:700">'+mOpts+'</select>'+
            '<label>Nota general</label><input class="fld" id="abNote" placeholder="Cobro mixto a factura '+esc(item.doc)+'">'+
            '<button class="btn mini2" id="cxcMixClear">Limpiar montos</button>'+
            '<button class="btn primary" id="abSaveMixBtn">Registrar Cobro Mixto</button>'+
          '</div>'+
          '<div class="gridwrap" style="max-height:155px;margin-bottom:5px"><table class="grid">'+
            '<thead><tr><th>Método de Cobro Interviniente</th><th class="c" style="width:65px">Moneda</th><th class="r">Monto en US$</th><th class="r">Monto en Bs. (Tasa '+nf(rate)+')</th><th>Referencia / Comprobante</th><th class="c">Asignar</th></tr></thead>'+
            '<tbody>'+mixRows+'</tbody>'+
          '</table></div>'+
          '<div class="row" id="cxcMixSum" style="justify-content:space-between;font-size:11px;padding:2px 4px"></div>'+
        '</div>';
    }

    box.innerHTML=
      '<div class="gtitle">Detalle y Abonos — '+esc(item.doc)+' · '+esc(item.client.name)+' (Saldo Pendiente: '+usd(bal)+' / '+bsf(bal*rate)+')</div>'+
      formHtml+
      '<div class="gridwrap" style="max-height:110px"><table class="grid"><thead><tr><th>Fecha</th><th>Método</th><th>Referencia</th><th class="r">Equiv. US$</th><th class="r">Monto Bs.</th><th>Observación</th></tr></thead><tbody>'+hist+'</tbody></table></div>';

    if(payMode==='MIXTO'&&bal>=0.01)updateMixSummary(bal);
  };

  el.addEventListener('change',e=>{
    if(e.target.id==='cxcState'){fState=e.target.value;draw();return;}
    if(e.target.id==='abMethod'){
      payMode=e.target.value;
      renderDetailBox();
    }
  });
  el.addEventListener('input',e=>{
    if(e.target.id==='cxcQ'){fQ=e.target.value;draw();return;}
    const rate=S.cfg.rate||1;
    if(e.target.id==='abUsd'){
      const v=pn(e.target.value);
      const bsInp=$('#abBs',el);if(bsInp)bsInp.value=v>0?nf(r2(v*rate)):'';
      return;
    }
    if(e.target.id==='abBs'){
      const v=pn(e.target.value);
      const usdInp=$('#abUsd',el);if(usdInp)usdInp.value=v>0?nf(r2(v/rate)):'';
      return;
    }
    if(e.target.classList.contains('cxc-mix-usd')){
      const mid=e.target.dataset.m, u=Math.max(0,pn(e.target.value));
      mixState[mid]=mixState[mid]||{usd:0,bs:0,ref:''};
      mixState[mid].usd=r2(u);
      mixState[mid].bs=r2(u*rate);
      const bsInp=el.querySelector('.cxc-mix-bs[data-m="'+mid+'"]');
      if(bsInp)bsInp.value=u>0?nf(mixState[mid].bs):'';
      const item=(S.cxc||[]).find(x=>x.id===curId);
      if(item)updateMixSummary(r2(Math.max(0,item.total-item.paid)));
      return;
    }
    if(e.target.classList.contains('cxc-mix-bs')){
      const mid=e.target.dataset.m, b=Math.max(0,pn(e.target.value));
      mixState[mid]=mixState[mid]||{usd:0,bs:0,ref:''};
      mixState[mid].bs=r2(b);
      mixState[mid].usd=r2(b/rate);
      const usdInp=el.querySelector('.cxc-mix-usd[data-m="'+mid+'"]');
      if(usdInp)usdInp.value=b>0?nf(mixState[mid].usd):'';
      const item=(S.cxc||[]).find(x=>x.id===curId);
      if(item)updateMixSummary(r2(Math.max(0,item.total-item.paid)));
      return;
    }
    if(e.target.classList.contains('cxc-mix-ref')){
      const mid=e.target.dataset.m;
      mixState[mid]=mixState[mid]||{usd:0,bs:0,ref:''};
      mixState[mid].ref=e.target.value;
    }
  });
  el.addEventListener('click',e=>{
    const tr=e.target.closest('tr[data-id]');
    if(tr){curId=tr.dataset.id;resetMix();draw();return;}
    if(e.target.id==='cxcNewBtn'){newCxcManualDlg();return;}
    if(e.target.id==='abSwitchMixBtn'){payMode='MIXTO';renderDetailBox();return;}
    if(e.target.id==='cxcMixClear'){resetMix();renderDetailBox();return;}
    const fillBtn=e.target.closest('[data-cxc-fill]');
    if(fillBtn){
      const mid=fillBtn.dataset.cxcFill;
      const item=(S.cxc||[]).find(x=>x.id===curId);if(!item)return;
      const bal=r2(Math.max(0,item.total-item.paid));
      const otherUsd=r2(METHODS.reduce((a,m)=>a+(m.id!==mid&&mixState[m.id]?mixState[m.id].usd:0),0));
      const rem=r2(Math.max(0,bal-otherUsd));
      mixState[mid]=mixState[mid]||{usd:0,bs:0,ref:''};
      mixState[mid].usd=rem;
      mixState[mid].bs=r2(rem*S.cfg.rate);
      renderDetailBox();
      return;
    }
    if(e.target.id==='abSaveBtn'){
      const item=(S.cxc||[]).find(x=>x.id===curId);if(!item)return;
      const bal=r2(Math.max(0,item.total-item.paid));
      const rawAmt=pn($('#abUsd',el).value);
      if(rawAmt<=0){msg('Indique un monto de abono válido mayor a cero.','bad');return;}
      if(rawAmt-bal>0.01){msg('El monto ingresado ('+usd(rawAmt)+') supera el saldo pendiente ('+usd(bal)+').','bad');return;}
      const amt=Math.min(bal,rawAmt);
      const mId=$('#abMethod',el).value;
      const m=METHODS.find(x=>x.id===mId)||METHODS[0];
      item.paid=r2(item.paid+amt);
      item.payments=item.payments||[];
      item.payments.push({
        ts:Date.now(),method:m.name,cur:m.cur,
        amountUsd:amt,amountBs:r2(amt*S.cfg.rate),
        ref:$('#abRef',el).value.trim()||'REC-'+pad(item.payments.length+1,4),
        note:$('#abNote',el).value.trim()||'Abono de cliente'
      });
      save();draw();renderStatus();
      msg('Abono de '+usd(amt)+' registrado en '+item.doc+' ('+item.client.name+').');
      return;
    }
    if(e.target.id==='abSaveMixBtn'){
      const item=(S.cxc||[]).find(x=>x.id===curId);if(!item)return;
      const bal=r2(Math.max(0,item.total-item.paid));
      const active=METHODS.filter(m=>mixState[m.id]&&mixState[m.id].usd>=0.01);
      if(!active.length){msg('Ingrese el monto en al menos un método de pago para el cobro mixto.','bad');return;}
      const totalMix=r2(active.reduce((a,m)=>a+mixState[m.id].usd,0));
      if(totalMix-bal>0.01){
        msg('La suma del cobro mixto ('+usd(totalMix)+') excede el saldo pendiente de la factura ('+usd(bal)+'). Ajuste los montos.','bad');
        return;
      }
      const ts=Date.now();
      const baseNote=($('#abNote',el)?$('#abNote',el).value.trim():'')||(active.length>1?'Cobro mixto ('+active.length+' métodos)':'Abono de cliente');
      item.payments=item.payments||[];
      const batchNo=item.payments.length+1;
      active.forEach((m,idx)=>{
        const st=mixState[m.id];
        const tag=active.length>1?'[Mixto '+(idx+1)+'/'+active.length+'] ':'';
        item.payments.push({
          ts,
          method:tag+m.name,
          cur:m.cur,
          amountUsd:r2(st.usd),
          amountBs:r2(st.bs||st.usd*S.cfg.rate),
          ref:(st.ref||'').trim()||('MIX-'+pad(batchNo,3)+'-'+(idx+1)),
          note:baseNote
        });
      });
      item.paid=r2(Math.min(item.total,item.paid+totalMix));
      resetMix();
      save();draw();renderStatus();
      msg('Cobro mixto por '+usd(totalMix)+' ('+active.length+' métodos) registrado en '+item.doc+'.');
    }
  });

  openWin({title:'Cuentas por Cobrar (CxC) y Gestión de Crédito a Clientes',w:980,body:el,foot:[{label:'Cerrar',primary:true}],onEnter:()=>{},onOpen:()=>{draw();}});
}

function newCxcManualDlg(){
  const clOpts=S.clients.filter(c=>c.rif!=='V-00000000').map((c,i)=>'<option value="'+esc(c.rif)+'">'+esc(c.name)+' ('+esc(c.rif)+')</option>').join('');
  const el=h('<div class="form"><div class="newgrid">'+
    '<div class="f wide"><label for="mcClient">Cliente</label><select class="fld" id="mcClient">'+clOpts+'</select></div>'+
    '<div class="f"><label for="mcDoc">Documento / Ref.</label><input class="fld mono" id="mcDoc" value="ND-'+pad((S.cxc.length+101),6)+'"></div>'+
    '<div class="f"><label for="mcAmt">Monto Total US$</label><input class="fld r" id="mcAmt" inputmode="decimal" placeholder="0,00"></div>'+
    '<div class="f"><label for="mcDue">Fecha Vencimiento</label><input class="fld" type="date" id="mcDue" value="'+isoD(Date.now()+15*86400000)+'"></div>'+
    '<div class="f wide"><label for="mcConc">Concepto</label><input class="fld" id="mcConc" placeholder="Factura a crédito / Nota de débito"></div>'+
  '</div></div>');
  openWin({title:'Registrar Cuenta por Cobrar',w:520,body:el,foot:[
    {label:'Cancelar',fn:()=>{cxcDlg();return false;}},
    {label:'Guardar CxC',primary:true,fn:()=>{
      const rif=$('#mcClient',el).value, cl=S.clients.find(c=>c.rif===rif)||S.clients[1];
      const amt=pn($('#mcAmt',el).value);
      if(!amt){msg('Indique el monto en US$.','bad');return false;}
      const id='CXC-'+pad(S.cxc.length+1,4);
      S.cxc.push({
        id,saleNo:null,doc:$('#mcDoc',el).value.trim()||id,
        client:Object.assign({},cl),
        concept:$('#mcConc',el).value.trim()||'Cargo a crédito',
        ts:Date.now(),dueTs:parseIsoD($('#mcDue',el).value),cashbox:currentCaja(),cashier:currentCajero(),
        total:amt,paid:0,payments:[]
      });
      save();cxcDlg(id);msg('Cuenta por cobrar registrada.');return false;
    }}
  ]});
}

/* ---------- MÓDULO DE CUENTAS POR PAGAR (CxP) ---------- */
function cxpDlg(selId){
  let fState='PEND', fQ='', curId=selId||null, payMode='SINGLE';
  let mixState={};
  const resetMix=()=>{
    mixState={};
    METHODS.forEach(m=>{mixState[m.id]={usd:0,bs:0,ref:''};});
  };
  resetMix();

  const el=h('<div class="form">'+
    '<div class="kpis" id="cxpKpis"></div>'+
    '<div class="invbar">'+
      '<label for="cxpState">Estado</label>'+
      '<select class="fld" id="cxpState" style="max-width:190px"><option value="PEND">Pendientes por pagar</option><option value="OVER">Solo vencidas</option><option value="PAID">Pagadas / Solventes</option><option value="ALL">Todas las obligaciones</option></select>'+
      '<label for="cxpQ">Buscar</label>'+
      '<input class="fld" id="cxpQ" placeholder="Proveedor, RIF o Nº de factura..." autocomplete="off">'+
      '<button class="btn mini2" id="cxpNewBtn">+ Registrar Obligación / Gasto</button>'+
    '</div>'+
    '<div class="gridwrap invwrap" style="height:175px"><table class="grid" style="min-width:860px">'+
      '<thead><tr><th>Doc. / Factura</th><th>Proveedor</th><th>RIF</th><th>Emisión</th><th>Vencimiento</th><th>Estado</th><th class="r">Total US$</th><th class="r">Pagado US$</th><th class="r">Saldo US$</th><th class="r">Saldo Bs.</th></tr></thead>'+
      '<tbody id="cxpBody"></tbody>'+
    '</table></div>'+
    '<div class="group" id="cxpDetail"></div>'+
  '</div>');

  const draw=()=>{
    const now=Date.now(), rate=S.cfg.rate, all=S.cxp||[];
    const totPend=r2(all.reduce((a,x)=>a+Math.max(0,x.total-x.paid),0));
    const totOver=r2(all.filter(x=>x.total-x.paid>=0.01&&x.dueTs<now).reduce((a,x)=>a+Math.max(0,x.total-x.paid),0));
    const totVig=r2(Math.max(0,totPend-totOver));
    let pagHoy=0;
    all.forEach(x=>(x.payments||[]).forEach(p=>{if(sameDay(p.ts))pagHoy+=p.amountUsd;}));
    pagHoy=r2(pagHoy);

    $('#cxpKpis',el).innerHTML=
      '<div class="kpi"><span>Total por Pagar (Pasivo)</span><b class="warn">'+usd(totPend)+'</b><small>'+bsf(totPend*rate)+'</small></div>'+
      '<div class="kpi"><span>Deuda Vencida</span><b class="'+(totOver>0?'bad':'')+'">'+usd(totOver)+'</b><small>Pago prioritario</small></div>'+
      '<div class="kpi"><span>Deuda Vigente (Por vencer)</span><b class="ok">'+usd(totVig)+'</b><small>Dentro del plazo de crédito</small></div>'+
      '<div class="kpi"><span>Pagos Emitidos Hoy</span><b class="ok">'+usd(pagHoy)+'</b><small>'+bsf(pagHoy*rate)+'</small></div>';

    const q=norm(fQ);
    const list=all.filter(x=>{
      const bal=r2(x.total-x.paid);
      if(fState==='PEND'&&bal<0.01)return false;
      if(fState==='OVER'&&(bal<0.01||x.dueTs>=now))return false;
      if(fState==='PAID'&&bal>=0.01)return false;
      if(q&&norm(x.doc+x.supplier.name+x.supplier.rif+x.concept).indexOf(q)<0)return false;
      return true;
    }).sort((a,b)=>a.dueTs-b.dueTs);

    if(curId&&!list.some(x=>x.id===curId))curId=list[0]?list[0].id:null;
    if(!curId&&list[0])curId=list[0].id;

    $('#cxpBody',el).innerHTML=list.length?list.map(x=>{
      const bal=r2(Math.max(0,x.total-x.paid));
      const isOver=bal>=0.01&&x.dueTs<now;
      const stTxt=bal<0.01?'PAGADA':(isOver?'VENCIDA':'VIGENTE');
      const stCls=bal<0.01?'st-ok':(isOver?'st-out':'st-low');
      return '<tr data-id="'+esc(x.id)+'" class="'+(x.id===curId?'sel':'')+'">'+
        '<td class="mono"><b>'+esc(x.doc)+'</b></td>'+
        '<td><div class="desc">'+esc(x.supplier.name)+'</div><div class="sub">'+esc(x.concept||'')+'</div></td>'+
        '<td class="mono">'+esc(x.supplier.rif)+'</td>'+
        '<td>'+fmtD(x.ts)+'</td>'+
        '<td>'+fmtD(x.dueTs)+'</td>'+
        '<td class="'+stCls+'">'+stTxt+'</td>'+
        '<td class="r">'+nf(x.total)+'</td>'+
        '<td class="r">'+nf(x.paid)+'</td>'+
        '<td class="r"><b>'+nf(bal)+'</b></td>'+
        '<td class="r">'+nf(bal*rate)+'</td>'+
      '</tr>';
    }).join(''):'<tr class="empty"><td colspan="10">No hay cuentas por pagar para el filtro seleccionado.</td></tr>';

    renderDetailBox();
  };

  const calcMixTotalUsd=()=>r2(METHODS.reduce((a,m)=>a+(mixState[m.id]?mixState[m.id].usd:0),0));

  const updateMixSummary=bal=>{
    const rate=S.cfg.rate;
    const sumUsd=calcMixTotalUsd();
    const remUsd=r2(bal-sumUsd);
    const sumEl=$('#cxpMixSum',el);
    if(!sumEl)return;
    let statusHtml='';
    if(sumUsd<=0){
      statusHtml='<span class="dim">Ingrese el monto en uno o más medios de pago.</span>';
    }else if(remUsd<-0.01){
      statusHtml='<b class="bad">Excede el saldo por '+usd(Math.abs(remUsd))+' ('+bsf(Math.abs(remUsd)*rate)+')</b>';
    }else if(remUsd<=0.01){
      statusHtml='<b class="ok">Cubre el 100 % de la obligación con el proveedor</b>';
    }else{
      statusHtml='<b class="warn">Pago parcial · Resta por pagar: '+usd(remUsd)+' ('+bsf(remUsd*rate)+')</b>';
    }
    sumEl.innerHTML=
      '<span>Total Pago Mixto: <b>'+usd(sumUsd)+'</b> ('+bsf(sumUsd*rate)+')</span>'+
      '<span style="margin-left:14px">'+statusHtml+'</span>';
  };

  const renderDetailBox=()=>{
    const box=$('#cxpDetail',el), item=(S.cxp||[]).find(x=>x.id===curId);
    if(!item){box.innerHTML='<span class="dim">Seleccione una obligación para registrar un pago simple o mixto al proveedor o consultar comprobantes.</span>';return;}
    const bal=r2(Math.max(0,item.total-item.paid)), rate=S.cfg.rate;
    const mOpts='<option value="MIXTO"'+(payMode==='MIXTO'?' selected':'')+'>★ Pago Mixto (Múltiples métodos de pago)</option>'+
      METHODS.map(m=>'<option value="'+esc(m.id)+'"'+(payMode===m.id?' selected':'')+'>'+esc(m.name)+' ('+m.cur+')</option>').join('');
    const hist=(item.payments||[]).map(p=>'<tr><td>'+fmtDT(p.ts)+'</td><td>'+esc(p.method)+'</td><td class="mono">'+esc(p.ref||'-')+'</td><td class="r">'+nf(p.amountUsd)+'</td><td class="r">'+nf(p.amountBs)+'</td><td>'+esc(p.note||'')+'</td></tr>').join('')||'<tr><td colspan="6" class="dim">Sin pagos registrados todavía.</td></tr>';

    let formHtml='';
    if(bal<0.01){
      formHtml='<div class="dim" style="margin-bottom:6px">Esta obligación con el proveedor ya está pagada en su totalidad.</div>';
    }else if(payMode!=='MIXTO'){
      formHtml=
        '<div class="invbar" style="margin-bottom:6px">'+
          '<label>Medio de pago</label><select class="fld" id="pgMethod" style="max-width:235px">'+mOpts+'</select>'+
          '<label>Monto US$</label><input class="fld r" id="pgUsd" value="'+nf(bal)+'" style="max-width:92px" inputmode="decimal">'+
          '<label>Equiv. Bs.</label><input class="fld r" id="pgBs" value="'+nf(bal*rate)+'" style="max-width:105px" inputmode="decimal">'+
          '<label>Comprobante</label><input class="fld" id="pgRef" placeholder="Nº transf. / ref." style="max-width:115px">'+
          '<label>Nota</label><input class="fld" id="pgNote" placeholder="Pago a proveedor">'+
          '<button class="btn mini2" id="pgSwitchMixBtn" title="Distribuir el pago entre varios medios de pago">Pago Mixto…</button>'+
          '<button class="btn mini2" id="pgBuyZelleBtn" style="background:#0D3B2E;color:#4ADE80;border-color:#166534;font-weight:700" title="Comprar saldo Zelle a intermediario para pagar directo al proveedor">⚡ Pagar con Compra Zelle…</button>'+
          '<button class="btn primary" id="pgSaveBtn">Registrar Pago</button>'+
        '</div>';
    }else{
      const mixRows=METHODS.map(m=>{
        const st=mixState[m.id]||{usd:0,bs:0,ref:''};
        const isUsd=m.cur==='USD';
        return '<tr>'+
          '<td><b>'+esc(m.name)+'</b></td>'+
          '<td class="c"><span class="sku-tag">'+(isUsd?'US$':'Bs.')+'</span></td>'+
          '<td class="r" style="width:125px"><input class="fld r cxp-mix-usd" data-m="'+esc(m.id)+'" value="'+(st.usd>0?nf(st.usd):'')+'" placeholder="0,00" inputmode="decimal"></td>'+
          '<td class="r" style="width:135px"><input class="fld r cxp-mix-bs" data-m="'+esc(m.id)+'" value="'+(st.bs>0?nf(st.bs):'')+'" placeholder="0,00" inputmode="decimal"></td>'+
          '<td style="width:155px"><input class="fld mono cxp-mix-ref" data-m="'+esc(m.id)+'" value="'+esc(st.ref||'')+'" placeholder="Nº op. / ref. / recibo"></td>'+
          '<td class="c" style="width:85px"><button class="btn mini2" data-cxp-fill="'+esc(m.id)+'" title="Asignar el saldo restante a este medio de pago">Restante</button></td>'+
        '</tr>';
      }).join('');
      formHtml=
        '<div style="background:var(--alt);border:1px solid var(--lo);padding:6px 8px;margin-bottom:6px">'+
          '<div class="invbar" style="margin-bottom:6px">'+
            '<label>Medio de pago</label><select class="fld" id="pgMethod" style="max-width:250px;font-weight:700">'+mOpts+'</select>'+
            '<label>Nota general</label><input class="fld" id="pgNote" placeholder="Pago mixto a '+esc(item.supplier.name)+'">'+
            '<button class="btn mini2" id="cxpMixClear">Limpiar montos</button>'+
            '<button class="btn primary" id="pgSaveMixBtn">Registrar Pago Mixto</button>'+
          '</div>'+
          '<div class="gridwrap" style="max-height:155px;margin-bottom:5px"><table class="grid">'+
            '<thead><tr><th>Medio de Pago Interviniente</th><th class="c" style="width:65px">Moneda</th><th class="r">Monto en US$</th><th class="r">Monto en Bs. (Tasa '+nf(rate)+')</th><th>Comprobante / Referencia</th><th class="c">Asignar</th></tr></thead>'+
            '<tbody>'+mixRows+'</tbody>'+
          '</table></div>'+
          '<div class="row" id="cxpMixSum" style="justify-content:space-between;font-size:11px;padding:2px 4px"></div>'+
        '</div>';
    }

    box.innerHTML=
      '<div class="gtitle">Pagos a Proveedor — '+esc(item.doc)+' · '+esc(item.supplier.name)+' (Saldo Pendiente: '+usd(bal)+' / '+bsf(bal*rate)+')</div>'+
      formHtml+
      '<div class="gridwrap" style="max-height:110px"><table class="grid"><thead><tr><th>Fecha</th><th>Medio de Pago</th><th>Comprobante</th><th class="r">Equiv. US$</th><th class="r">Monto Bs.</th><th>Observación</th></tr></thead><tbody>'+hist+'</tbody></table></div>';

    if(payMode==='MIXTO'&&bal>=0.01)updateMixSummary(bal);
  };

  el.addEventListener('change',e=>{
    if(e.target.id==='cxpState'){fState=e.target.value;draw();return;}
    if(e.target.id==='pgMethod'){
      payMode=e.target.value;
      renderDetailBox();
    }
  });
  el.addEventListener('input',e=>{
    if(e.target.id==='cxpQ'){fQ=e.target.value;draw();return;}
    const rate=S.cfg.rate||1;
    if(e.target.id==='pgUsd'){
      const v=pn(e.target.value);
      const bsInp=$('#pgBs',el);if(bsInp)bsInp.value=v>0?nf(r2(v*rate)):'';
      return;
    }
    if(e.target.id==='pgBs'){
      const v=pn(e.target.value);
      const usdInp=$('#pgUsd',el);if(usdInp)usdInp.value=v>0?nf(r2(v/rate)):'';
      return;
    }
    if(e.target.classList.contains('cxp-mix-usd')){
      const mid=e.target.dataset.m, u=Math.max(0,pn(e.target.value));
      mixState[mid]=mixState[mid]||{usd:0,bs:0,ref:''};
      mixState[mid].usd=r2(u);
      mixState[mid].bs=r2(u*rate);
      const bsInp=el.querySelector('.cxp-mix-bs[data-m="'+mid+'"]');
      if(bsInp)bsInp.value=u>0?nf(mixState[mid].bs):'';
      const item=(S.cxp||[]).find(x=>x.id===curId);
      if(item)updateMixSummary(r2(Math.max(0,item.total-item.paid)));
      return;
    }
    if(e.target.classList.contains('cxp-mix-bs')){
      const mid=e.target.dataset.m, b=Math.max(0,pn(e.target.value));
      mixState[mid]=mixState[mid]||{usd:0,bs:0,ref:''};
      mixState[mid].bs=r2(b);
      mixState[mid].usd=r2(b/rate);
      const usdInp=el.querySelector('.cxp-mix-usd[data-m="'+mid+'"]');
      if(usdInp)usdInp.value=b>0?nf(mixState[mid].usd):'';
      const item=(S.cxp||[]).find(x=>x.id===curId);
      if(item)updateMixSummary(r2(Math.max(0,item.total-item.paid)));
      return;
    }
    if(e.target.classList.contains('cxp-mix-ref')){
      const mid=e.target.dataset.m;
      mixState[mid]=mixState[mid]||{usd:0,bs:0,ref:''};
      mixState[mid].ref=e.target.value;
    }
  });
  el.addEventListener('click',e=>{
    const tr=e.target.closest('tr[data-id]');
    if(tr){curId=tr.dataset.id;resetMix();draw();return;}
    if(e.target.id==='cxpNewBtn'){newCxpManualDlg();return;}
    if(e.target.id==='pgSwitchMixBtn'){payMode='MIXTO';renderDetailBox();return;}
    if(e.target.id==='pgBuyZelleBtn'){newOperacionCambiariaDlg({cxpId:curId},()=>{cxpDlg(curId);});return;}
    if(e.target.id==='cxpMixClear'){resetMix();renderDetailBox();return;}
    const fillBtn=e.target.closest('[data-cxp-fill]');
    if(fillBtn){
      const mid=fillBtn.dataset.cxpFill;
      const item=(S.cxp||[]).find(x=>x.id===curId);if(!item)return;
      const bal=r2(Math.max(0,item.total-item.paid));
      const otherUsd=r2(METHODS.reduce((a,m)=>a+(m.id!==mid&&mixState[m.id]?mixState[m.id].usd:0),0));
      const rem=r2(Math.max(0,bal-otherUsd));
      mixState[mid]=mixState[mid]||{usd:0,bs:0,ref:''};
      mixState[mid].usd=rem;
      mixState[mid].bs=r2(rem*S.cfg.rate);
      renderDetailBox();
      return;
    }
    if(e.target.id==='pgSaveBtn'){
      const item=(S.cxp||[]).find(x=>x.id===curId);if(!item)return;
      const bal=r2(Math.max(0,item.total-item.paid));
      const rawAmt=pn($('#pgUsd',el).value);
      if(rawAmt<=0){msg('Indique un monto de pago válido mayor a cero.','bad');return;}
      if(rawAmt-bal>0.01){msg('El monto ingresado ('+usd(rawAmt)+') supera el saldo por pagar ('+usd(bal)+').','bad');return;}
      const amt=Math.min(bal,rawAmt);
      const mId=$('#pgMethod',el).value;
      const m=METHODS.find(x=>x.id===mId)||METHODS[5];
      item.paid=r2(item.paid+amt);
      item.payments=item.payments||[];
      item.payments.push({
        ts:Date.now(),method:m.name,cur:m.cur,
        amountUsd:amt,amountBs:r2(amt*S.cfg.rate),
        ref:$('#pgRef',el).value.trim()||'OP-'+pad(item.payments.length+1,4),
        note:$('#pgNote',el).value.trim()||'Pago a proveedor'
      });
      if(item.purchaseNo){
        const comp=(S.purchases||[]).find(x=>x.no===item.purchaseNo);
        if(comp)comp.paid=item.paid;
      }
      save();draw();
      msg('Pago de '+usd(amt)+' registrado para '+item.supplier.name+'.');
      return;
    }
    if(e.target.id==='pgSaveMixBtn'){
      const item=(S.cxp||[]).find(x=>x.id===curId);if(!item)return;
      const bal=r2(Math.max(0,item.total-item.paid));
      const active=METHODS.filter(m=>mixState[m.id]&&mixState[m.id].usd>=0.01);
      if(!active.length){msg('Ingrese el monto en al menos un medio de pago para el pago mixto.','bad');return;}
      const totalMix=r2(active.reduce((a,m)=>a+mixState[m.id].usd,0));
      if(totalMix-bal>0.01){
        msg('La suma del pago mixto ('+usd(totalMix)+') excede el saldo pendiente de la obligación ('+usd(bal)+'). Ajuste los montos.','bad');
        return;
      }
      const ts=Date.now();
      const baseNote=($('#pgNote',el)?$('#pgNote',el).value.trim():'')||(active.length>1?'Pago mixto ('+active.length+' medios)':'Pago a proveedor');
      item.payments=item.payments||[];
      const batchNo=item.payments.length+1;
      active.forEach((m,idx)=>{
        const st=mixState[m.id];
        const tag=active.length>1?'[Mixto '+(idx+1)+'/'+active.length+'] ':'';
        item.payments.push({
          ts,
          method:tag+m.name,
          cur:m.cur,
          amountUsd:r2(st.usd),
          amountBs:r2(st.bs||st.usd*S.cfg.rate),
          ref:(st.ref||'').trim()||('OPM-'+pad(batchNo,3)+'-'+(idx+1)),
          note:baseNote
        });
      });
      item.paid=r2(Math.min(item.total,item.paid+totalMix));
      if(item.purchaseNo){
        const comp=(S.purchases||[]).find(x=>x.no===item.purchaseNo);
        if(comp)comp.paid=item.paid;
      }
      resetMix();
      save();draw();
      msg('Pago mixto por '+usd(totalMix)+' ('+active.length+' medios) registrado para '+item.supplier.name+'.');
    }
  });

  openWin({
    title:'Cuentas por Pagar (CxP) y Obligaciones con Proveedores',
    w:980,body:el,
    foot:[
      {label:'Ir a Compras (F10)',left:true,fn:()=>{comprasDlg();return false;}},
      {label:'Cerrar',primary:true}
    ],
    onEnter:()=>{},onOpen:()=>{draw();}
  });
}

function newCxpManualDlg(){
  const supOpts=S.suppliers.map(s=>'<option value="'+esc(s.rif)+'">'+esc(s.name)+' ('+esc(s.rif)+')</option>').join('');
  const el=h('<div class="form"><div class="newgrid">'+
    '<div class="f wide"><label for="mpSup">Proveedor / Beneficiario</label><select class="fld" id="mpSup">'+supOpts+'</select></div>'+
    '<div class="f"><label for="mpDoc">Nº Factura / Documento</label><input class="fld mono" id="mpDoc" value="F-'+pad(S.cxp.length+501,5)+'"></div>'+
    '<div class="f"><label for="mpAmt">Monto Total US$</label><input class="fld r" id="mpAmt" inputmode="decimal" placeholder="0,00"></div>'+
    '<div class="f"><label for="mpDue">Fecha Vencimiento</label><input class="fld" type="date" id="mpDue" value="'+isoD(Date.now()+15*86400000)+'"></div>'+
    '<div class="f wide"><label for="mpConc">Concepto (Compra, flete, servicio, alquiler...)</label><input class="fld" id="mpConc" placeholder="Ej: Servicio de transporte de mercancía"></div>'+
  '</div></div>');
  openWin({title:'Registrar Obligación en Cuentas por Pagar (CxP)',w:540,body:el,foot:[
    {label:'Cancelar',fn:()=>{cxpDlg();return false;}},
    {label:'Guardar CxP',primary:true,fn:()=>{
      const rif=$('#mpSup',el).value, sup=S.suppliers.find(s=>s.rif===rif)||S.suppliers[0];
      const amt=pn($('#mpAmt',el).value);
      if(!amt){msg('Indique el monto en US$.','bad');return false;}
      const id='CXP-'+pad(S.cxp.length+1,4);
      S.cxp.push({
        id,purchaseNo:null,doc:$('#mpDoc',el).value.trim()||id,
        supplier:Object.assign({},sup),
        concept:$('#mpConc',el).value.trim()||'Obligación con proveedor',
        ts:Date.now(),dueTs:parseIsoD($('#mpDue',el).value),
        total:amt,paid:0,payments:[]
      });
      save();cxpDlg(id);msg('Cuenta por pagar registrada.');return false;
    }}
  ]});
}

/* ==========================================================================
   MÓDULO DE OPERACIONES CAMBIARIAS Y COMPRA DE DIVISAS (USD / ZELLE)
   Trazabilidad completa: Compra de USD en efectivo a persona natural,
   Compra de USD Zelle con pago directo a proveedor (triangulación CxP),
   Compra de Zelle propio y canje de divisas con comprobantes oficiales.
   ========================================================================== */
