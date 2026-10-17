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
];,
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
];
const TAX_OPTIONS=[
  {type:'G',rate:16,name:'Gravado 16 % (G)',tag:'16%',cls:''},
  {type:'R',rate:8,name:'Reducido 8 % (R)',tag:'8% Red.',cls:'red'},
  {type:'A',rate:31,name:'Adicional / Suntuario 31 % (A)',tag:'31% Adic.',cls:'adic'},
  {type:'E',rate:0,name:'Exento 0 % (E)',tag:'Exento (0%)',cls:'ex'},
  {type:'NS',rate:0,name:'No Sujeto 0 % (NS)',tag:'No Suj. (0%)',cls:'ex'}
];,
  TAX_OPTIONS: [
  {type:'G',rate:16,name:'Gravado 16 % (G)',tag:'16%',cls:''},
  {type:'R',rate:8,name:'Reducido 8 % (R)',tag:'8% Red.',cls:'red'},
  {type:'A',rate:31,name:'Adicional / Suntuario 31 % (A)',tag:'31% Adic.',cls:'adic'},
  {type:'E',rate:0,name:'Exento 0 % (E)',tag:'Exento (0%)',cls:'ex'},
  {type:'NS',rate:0,name:'No Sujeto 0 % (NS)',tag:'No Suj. (0%)',cls:'ex'}
];,
  METHODS: [
 {id:'efUSD',name:'Efectivo US$',cur:'USD'},
 {id:'zelle',name:'Zelle',cur:'USD'},
 {id:'cashea',name:'Cashea (BNPL)',cur:'USD',isCashea:true},
 {id:'efBs',name:'Efectivo Bs.',cur:'VES'},
 {id:'punto',name:'Punto de venta (débito / crédito)',cur:'VES'},
 {id:'biopago',name:'Biopago',cur:'VES'},
 {id:'pmovil',name:'Pago móvil',cur:'VES'},
 {id:'transf',name:'Transferencia Bs.',cur:'VES'}
];,
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
};
const ico=n=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(IC[n]||'')+'</svg>';

/* ---------- ventanas (diálogos) ---------- */
let W=null;
function openWin(o){
  closeWin(true);
  const bd=h('<div class="backdrop"><div class="dlg" role="dialog" aria-modal="true" aria-label="'+esc(o.title)+'" style="--w:'+(o.w||520)+'px"><div class="dhead"><span class="ttl">'+esc(o.title)+'</span><button class="xbtn" data-close aria-label="Cerrar">&#10005;</button></div><div class="body"></div><div class="foot"><div class="foot-l"></div><div class="foot-r"></div></div></div></div>');
  const body=$('.body',bd);
  if(typeof o.body==='string')body.innerHTML=o.body;else body.appendChild(o.body);
  const footL=$('.foot-l',bd), footR=$('.foot-r',bd);
  if(o.footLeft){
    if(typeof o.footLeft==='string')footL.innerHTML=o.footLeft;else footL.appendChild(o.footLeft);
  }
  (o.foot||[]).forEach(b=>{
    const el=document.createElement('button');
    el.className='btn'+(b.primary?' primary':'');el.textContent=b.label;if(b.id)el.id=b.id;
    el.addEventListener('click',()=>{if(b.fn&&b.fn()===false)return;closeWin();});
    (b.left?footL:footR).appendChild(el);
  });
  bd.addEventListener('click',e=>{if(e.target.closest('[data-close]')){if(o.onClose)o.onClose();else closeWin();}});
  bd.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&e.target.tagName==='INPUT'&&(e.target.type==='text'||!e.target.type)){
      e.preventDefault();
      if(o.onEnter)o.onEnter(e);
      else{const p=$('.btn.primary',footR);if(p&&!p.disabled)p.click();}
    }
  });
  W={el:bd,prev:document.activeElement};
  $('#win').inert=true;
  document.body.appendChild(bd);
  if(o.onOpen)o.onOpen(bd);
  if(!bd.contains(document.activeElement)){const f=$('input:not([readonly]),select',body)||$('.btn.primary',footR);if(f)f.focus();}
}
function closeWin(silent){
  if(!W)return;
  W.el.remove();$('#win').inert=false;
  const prev=W.prev;W=null;
  if(!silent&&prev&&prev.focus&&document.contains(prev))prev.focus();
}
function ask(title,text,okLabel,fn){
  openWin({title,w:420,body:h('<p style="margin:0">'+esc(text)+'</p>'),foot:[{label:'Cancelar'},{label:okLabel,primary:true,fn:()=>{fn();}}]});
}

/* ---------- carrito ---------- */
function addItem(code,qty){
  const p=prod(code);if(!p)return false;
  const isDec = p.unit==='L'||p.unit==='kg'||p.unit==='g'||p.unit==='m';
  qty=isDec?Math.max(0.1,r2(qty)):Math.max(1,Math.round(qty));
  const ex=S.cart.find(l=>l.code===code),cur=ex?ex.qty:0,left=r2(p.stock-cur);
  if(qty>left+1e-9){
    msg(left<=0?'Sin existencia de "'+p.desc+'" ('+p.brand+').':'Existencia insuficiente de "'+p.desc+'": quedan '+fq(left)+'.','bad');
    return false;
  }
  if(ex){ex.qty=r2(ex.qty+qty);S.sel=S.cart.indexOf(ex);}
  else{S.cart.push({code,qty,disc:0});S.sel=S.cart.length-1;}
  renderCart();
  ensureVisible($('#cartBody tr.sel'),$('#cartWrap'));
  msg(p.brand+' '+p.desc+' agregado ('+fq(qty)+' '+(p.unit||'und')+').');
  return true;
}
function changeQty(i,d){
  const l=S.cart[i];if(!l)return;
  const p=prod(l.code),isDec=p.unit==='L'||p.unit==='kg'||p.unit==='g'||p.unit==='m',min=isDec?0.1:1,nq=r2(l.qty+d);
  if(nq<min){msg('La cantidad mínima es '+fq(min)+'. Use Quitar para eliminar el renglón.');return;}
  if(nq>p.stock+1e-9){msg('Existencia insuficiente: quedan '+fq(p.stock)+'.','bad');return;}
  l.qty=nq;renderCart();
}
function removeSel(){
  if(S.sel<0||!S.cart[S.sel]){msg('Seleccione un renglón para quitarlo.','bad');return;}
  const p=prod(S.cart[S.sel].code);
  S.cart.splice(S.sel,1);S.sel=Math.min(S.sel,S.cart.length-1);
  renderCart();msg('Renglón quitado: '+p.desc+'.');
}
function resetSale(){S.cart=[];S.sel=-1;S.client=S.clients[0];renderAll();$('#entry').focus();}
function newSale(){
  if(!S.cart.length){resetSale();return;}
  ask('Nueva venta','La venta actual tiene '+S.cart.length+' renglón(es). ¿Descartarla y empezar una nueva?','Descartar',()=>{resetSale();msg('Nueva venta lista.');});
}
function clearCart(){
  if(!S.cart.length)return;
  ask('Vaciar venta','Se quitarán todos los renglones de la venta actual.','Vaciar',()=>{S.cart=[];S.sel=-1;renderCart();});
}
function suspend(){
  if(!S.cart.length){msg('No hay una venta con renglones para suspender.','bad');return;}
  S.held.push({cart:S.cart,client:S.client,ts:Date.now()});
  S.cart=[];S.sel=-1;S.client=S.clients[0];save();renderAll();
  msg('Venta suspendida. Hay '+S.held.length+' en espera.');
}
function recoverDlg(){
  if(!S.held.length){msg('No hay ventas en espera.');return;}
  const busy=S.cart.length>0;
  const el=h('<div class="form"><div class="gridwrap heldwrap"><table class="grid"><thead><tr><th>Cliente</th><th class="r">Renglones</th><th class="r">Total US$</th><th>Hora</th><th></th></tr></thead><tbody></tbody></table></div>'+(busy?'<p class="hint">Cobre o suspenda la venta actual antes de recuperar otra.</p>':'')+'</div>');
  const tb=$('tbody',el);
  S.held.forEach((hd,i)=>{
    const sub=r2(hd.cart.reduce((a,l)=>a+r2(r2(prod(l.code).price*l.qty)*(1-l.disc/100)),0));
    const tr=h('<table><tbody><tr><td>'+esc(hd.client.name)+'</td><td class="r">'+hd.cart.length+'</td><td class="r">'+nf(r2(sub*(1+IVA)))+'</td><td>'+fmtT(new Date(hd.ts))+'</td><td class="c"><button class="btn mini2" '+(busy?'disabled':'')+'>Recuperar</button></td></tr></tbody></table>').querySelector('tr');
    $('button',tr).addEventListener('click',()=>{
      S.cart=hd.cart;S.client=hd.client;S.sel=0;S.held.splice(i,1);save();closeWin();renderAll();msg('Venta recuperada.');
    });
    tb.appendChild(tr);
  });
  openWin({title:'Ventas en espera',w:600,body:el,foot:[{label:'Cerrar',primary:true}]});
}
function discountDlg(){
  if(!S.cart.length){msg('No hay renglones para aplicar descuento.','bad');return;}
  const has=S.sel>=0&&S.cart[S.sel];
  const el=h('<div class="form"><div class="f"><label for="dPct">Descuento (%)</label><input class="fld r" id="dPct" inputmode="decimal" autocomplete="off" value="'+(has?fq(has.disc):'0')+'"></div><div class="radios"><label><input type="radio" name="dScope" value="one" '+(has?'checked':'disabled')+'> Solo el renglón seleccionado'+(has?': '+esc(prod(has.code).desc):'')+'</label><label><input type="radio" name="dScope" value="all" '+(has?'':'checked')+'> Todos los renglones</label></div><p class="hint">Escriba 0 para quitar el descuento. Máximo 100 %.</p></div>');
  openWin({title:'Descuento',w:440,body:el,foot:[{label:'Cancelar'},{label:'Aplicar',primary:true,fn:()=>{
    const v=Math.min(100,pn($('#dPct',el).value)),all=$('input[name=dScope]:checked',el).value==='all';
    if(all)S.cart.forEach(l=>{l.disc=v;});else has.disc=v;
    renderCart();msg(v?'Descuento de '+fq(v)+' % aplicado.':'Descuento quitado.');
  }}],onOpen:()=>{$('#dPct',el).select();}});
}

/* ---------- clientes ---------- */
function clientDlg(){
  let cur=S.client;
  const el=h('<div class="form"><div class="invbar"><label for="clQ">Buscar</label><input class="fld" id="clQ" placeholder="Nombre o RIF / C.I." autocomplete="off"></div><div class="gridwrap clwrap"><table class="grid"><thead><tr><th>Nombre o razón social</th><th>RIF / C.I.</th><th>Teléfono</th><th class="r">Saldo CxC US$</th></tr></thead><tbody id="clBody"></tbody></table></div><details class="newp"><summary>Cliente nuevo</summary><div class="newgrid"><div class="f"><label for="ncRif">RIF / C.I.</label><input class="fld" id="ncRif" autocomplete="off"></div><div class="f"><label for="ncName">Nombre o razón social</label><input class="fld" id="ncName" autocomplete="off"></div><div class="f"><label for="ncTel">Teléfono</label><input class="fld" id="ncTel" autocomplete="off"></div></div><button class="btn" id="ncAdd">Guardar y usar</button></details></div>');
  const clientDebt=rif=>r2((S.cxc||[]).filter(x=>x.client.rif===rif).reduce((a,x)=>a+Math.max(0,x.total-x.paid),0));
  const draw=()=>{
    const q=norm($('#clQ',el).value);
    const rows=S.clients.filter(c=>norm(c.name+c.rif).indexOf(q)>=0);
    $('#clBody',el).innerHTML=rows.length?rows.map(c=>{
      const debt=clientDebt(c.rif);
      return '<tr data-cl="'+S.clients.indexOf(c)+'" class="'+(c===cur?'sel':'')+'"><td>'+esc(c.name)+'</td><td class="mono">'+esc(c.rif)+'</td><td>'+esc(c.tel||'')+'</td><td class="r '+(debt>0?'st-low':'')+'">'+(debt>0?nf(debt):'0,00')+'</td></tr>';
    }).join(''):'<tr class="empty"><td colspan="4">Sin coincidencias.</td></tr>';
  };
  const use=()=>{S.client=cur;renderHeader();msg('Cliente: '+cur.name+'.');};
  el.addEventListener('input',e=>{if(e.target.id==='clQ')draw();});
  el.addEventListener('click',e=>{
    const tr=e.target.closest('tr[data-cl]');
    if(tr){cur=S.clients[+tr.dataset.cl];draw();return;}
    if(e.target.id==='ncAdd'){
      const name=$('#ncName',el).value.trim(),rif=$('#ncRif',el).value.trim();
      if(!name||!rif){msg('Indique el RIF / C.I. y el nombre del cliente.','bad');return;}
      const c={name,rif,tel:$('#ncTel',el).value.trim()};
      S.clients.push(c);cur=c;save();use();closeWin();
    }
  });
  el.addEventListener('dblclick',e=>{if(e.target.closest('tr[data-cl]')){use();closeWin();}});
  openWin({title:'Seleccionar cliente',w:680,body:el,foot:[{label:'Ver CxC',left:true,fn:()=>{cxcDlg();return false;}},{label:'Cancelar'},{label:'Usar cliente',primary:true,fn:()=>{use();}}],onOpen:()=>{draw();}});
}

/* ---------- FICHA O TARJETA KARDEX PROFESIONAL ---------- */
function kardexDlg(initialCode){
  let code=initialCode||(S.catSel&&prod(S.catSel)?S.catSel:(S.cart[S.sel]?S.cart[S.sel].code:S.products[0].code));
  const el=h('<div class="form"><div class="invbar"><label for="kxProd">Producto</label><select class="fld" id="kxProd" style="flex:2"></select><label for="kxType">Movimiento</label><select class="fld" id="kxType" style="max-width:170px"><option value="ALL">Todos los movimientos</option><option value="IN">Solo Entradas (+)</option><option value="OUT">Solo Salidas (-)</option></select><label for="kxQ">Filtrar doc./tercero</label><input class="fld" id="kxQ" placeholder="Factura, compra, proveedor, motivo..." autocomplete="off"></div><div class="khead" id="kxHead"></div><div class="kpis" id="kxKpis"></div><div class="gridwrap tallwrap"><table class="grid" style="min-width:920px"><thead><tr><th>Fecha / Hora</th><th>Concepto</th><th>Documento</th><th>Proveedor / Cliente / Motivo</th><th class="r grp-in">Entrada</th><th class="r grp-out">Salida</th><th class="r grp-bal">Saldo Cant.</th><th class="r">Costo Unit.</th><th class="r">Monto Mov. US$</th><th class="r grp-bal">Saldo Valor US$</th><th>Operador</th></tr></thead><tbody id="kxBody"></tbody></table></div><p class="hint">Tarjeta Kardex bajo método de Costo Promedio Ponderado (CPP). Registra automáticamente compras, ventas, anulaciones y conteos físicos de inventario.</p></div>');

  const fillSelect=()=>{
    $('#kxProd',el).innerHTML=S.products.map(p=>'<option value="'+esc(p.code)+'"'+(p.code===code?' selected':'')+'>'+esc(p.code)+' — '+esc(p.desc)+' ('+esc(p.brand)+') ['+fq(p.stock)+' '+p.unit+']</option>').join('');
  };

  const draw=()=>{
    const p=prod(code)||S.products[0];
    if(!p)return;
    const margin=p.price>0?r2(((p.price-p.cost)/p.price)*100):0;
    const valUsd=r2(p.stock*p.cost);
    $('#kxHead',el).innerHTML=
      '<div><span>Código / SKU</span><b class="mono">'+esc(p.code)+'</b></div>'+
      '<div><span>Descripción y Marca</span><b>'+esc(p.desc)+' · '+esc(p.brand)+'</b></div>'+
      '<div><span>Departamento / Categoría</span><b>'+esc(p.dept)+' · '+esc(p.cat)+'</b></div>'+
      '<div><span>Subcategoría / Ubicación</span><b>'+esc(p.subcat)+' · Pasillo '+esc(p.loc)+'</b></div>';

    const movs=(S.kardex||[]).filter(k=>k.code===p.code).sort((a,b)=>a.ts-b.ts||a.id-b.id);
    const totalIn=r2(movs.filter(m=>m.dir==='IN').reduce((a,m)=>a+m.qty,0));
    const totalOut=r2(movs.filter(m=>m.dir==='OUT').reduce((a,m)=>a+m.qty,0));
    const stState=p.stock<=0?'AGOTADO':(p.stock<=p.min?'BAJO MÍNIMO':'NORMAL');
    const stClass=p.stock<=0?'bad':(p.stock<=p.min?'warn':'ok');

    $('#kxKpis',el).innerHTML=
      '<div class="kpi"><span>Existencia Actual ('+esc(p.unit)+')</span><b class="'+stClass+'">'+fq(p.stock)+' '+esc(p.unit)+'</b><small>Mínimo: '+fq(p.min)+' · Estado: '+stState+'</small></div>'+
      '<div class="kpi"><span>Movimientos Acumulados</span><b>+'+fq(totalIn)+' / -'+fq(totalOut)+'</b><small>'+movs.length+' registro(s) en ficha</small></div>'+
      '<div class="kpi"><span>Costo Promedio Unitario</span><b>'+usd(p.cost)+'</b><small>'+bsf(p.cost*S.cfg.rate)+'</small></div>'+
      '<div class="kpi"><span>Precio Venta (sin IVA)</span><b>'+usd(p.price)+'</b><small>Margen bruto: '+fq(margin)+' %</small></div>'+
      '<div class="kpi"><span>Valor Inventario (a Costo)</span><b class="ok">'+usd(valUsd)+'</b><small>'+bsf(valUsd*S.cfg.rate)+'</small></div>';

    const fDir=$('#kxType',el).value, q=norm($('#kxQ',el).value);
    const filteredMovs=movs.filter(m=>
      (fDir==='ALL'||m.dir===fDir)&&
      (!q||norm(m.doc+m.party+m.type+m.user).indexOf(q)>=0)
    );

    $('#kxBody',el).innerHTML=filteredMovs.length?filteredMovs.map(m=>{
      const isIn=m.dir==='IN';
      const movVal=r2(m.qty*m.cost);
      const balVal=r2(m.stockAfter*m.cost);
      return '<tr>'+
        '<td class="mono">'+fmtDT(m.ts)+'</td>'+
        '<td><b>'+esc(m.type)+'</b></td>'+
        '<td class="mono">'+esc(m.doc)+'</td>'+
        '<td>'+esc(m.party)+'</td>'+
        '<td class="r grp-in">'+(isIn?'+'+fq(m.qty):'')+'</td>'+
        '<td class="r grp-out">'+(!isIn?'-'+fq(m.qty):'')+'</td>'+
        '<td class="r grp-bal">'+fq(m.stockAfter)+' '+esc(p.unit)+'</td>'+
        '<td class="r">'+nf(m.cost)+'</td>'+
        '<td class="r">'+(isIn?'':'-')+nf(movVal)+'</td>'+
        '<td class="r grp-bal">'+nf(balVal)+'</td>'+
        '<td>'+esc(m.user||'')+'</td>'+
      '</tr>';
    }).join(''):'<tr class="empty"><td colspan="11">No hay movimientos en el Kardex que coincidan con el filtro.</td></tr>';
  };

  el.addEventListener('change',e=>{
    if(e.target.id==='kxProd'){code=e.target.value;draw();}
    if(e.target.id==='kxType')draw();
  });
  el.addEventListener('input',e=>{if(e.target.id==='kxQ')draw();});

  openWin({
    title:'Ficha / Tarjeta Kardex Profesional de Producto',
    w:1060,
    body:el,
    foot:[
      {label:'Ir a Conteo Físico',left:true,fn:()=>{conteoDlg(code);return false;}},
      {label:'Imprimir / Copiar Ficha',left:true,fn:()=>{showKardexTicket(prod(code));return false;}},
      {label:'Cerrar',primary:true}
    ],
    onEnter:()=>{},
    onOpen:()=>{fillSelect();draw();}
  });
}

function showKardexTicket(p){
  if(!p)return;
  const movs=(S.kardex||[]).filter(k=>k.code===p.code).sort((a,b)=>a.ts-b.ts||a.id-b.id);
  const L=[
    S.cfg.empresa.toUpperCase()+' - RIF '+S.cfg.rif,
    'FICHA KARDEX DE PRODUCTO (VALORIZADO CPP)',
    '------------------------------------------------------------------------',
    'Código:      '+p.code+'   | Ubicación: Pasillo '+p.loc,
    'Producto:    '+p.desc+' ('+p.brand+')',
    'Clasificac.: '+p.dept+' > '+p.cat+' > '+p.subcat,
    'Existencia:  '+fq(p.stock)+' '+p.unit+' (Mín: '+fq(p.min)+') | Costo Unit: '+usd(p.cost)+' | P.Venta: '+usd(p.price),
    'Valor Total: '+usd(r2(p.stock*p.cost))+' ('+bsf(r2(p.stock*p.cost*S.cfg.rate))+')',
    '------------------------------------------------------------------------',
    'FECHA/HORA        TIPO       DOCUMENTO     ENTRADA   SALIDA    SALDO   COSTO',
    '------------------------------------------------------------------------'
  ];
  movs.forEach(m=>{
    const dt=fmtDT(m.ts).padEnd(17,' ');
    const tp=String(m.type).slice(0,9).padEnd(10,' ');
    const dc=String(m.doc).slice(0,13).padEnd(13,' ');
    const en=(m.dir==='IN'?'+'+fq(m.qty):'').padStart(8,' ');
    const sa=(m.dir==='OUT'?'-'+fq(m.qty):'').padStart(8,' ');
    const sl=fq(m.stockAfter).padStart(8,' ');
    const cs=nf(m.cost).padStart(8,' ');
    L.push(dt+' '+tp+' '+dc+' '+en+' '+sa+' '+sl+' '+cs);
    if(m.party)L.push('   Ref/Motivo: '+m.party);
  });
  L.push('------------------------------------------------------------------------');
  const txt=L.join('\n');
  const el=h('<div class="form"><pre class="ticket" id="kxPre"></pre></div>');
  $('#kxPre',el).textContent=txt;
  openWin({title:'Comprobante Ficha Kardex — '+p.code,w:640,body:el,foot:[
    {label:'Copiar ficha',fn:()=>{
      try{navigator.clipboard.writeText(txt).then(()=>msg('Ficha Kardex copiada al portapapeles.'));}catch(e){}
      return false;
    }},
    {label:'Volver al Kardex',primary:true,fn:()=>{kardexDlg(p.code);return false;}}
  ]});
}

/* ---------- SECCIÓN DE CONTEO DE INVENTARIO CON FILTROS, MOTIVOS Y GUARDADO MASIVO ---------- */
function conteoDlg(focusCode){
  let fDept='Todos', fCat='Todas', fSub='Todas', fQ='', onlyMod=false, onlyLow=false;
  if(focusCode&&prod(focusCode)){
    const fp=prod(focusCode);
    fDept=fp.dept;fCat=fp.cat;fSub=fp.subcat;
  }

  const el=h('<div class="form">'+
    '<div class="fltgrid">'+
      '<div class="f"><label for="ctDept">Departamento</label><select class="fld" id="ctDept"></select></div>'+
      '<div class="f"><label for="ctCat">Categoría</label><select class="fld" id="ctCat"></select></div>'+
      '<div class="f"><label for="ctSub">Subcategoría</label><select class="fld" id="ctSub"></select></div>'+
      '<div class="f"><label for="ctQ">Buscar producto / código / pasillo</label><input class="fld" id="ctQ" placeholder="Ej: 20W-50, Fram, A-1..." autocomplete="off"></div>'+
    '</div>'+
    '<div class="invbar" style="justify-content:space-between">'+
      '<div class="row" style="gap:14px">'+
        '<label class="chk"><input type="checkbox" id="ctOnlyMod"> Solo productos con Nuevo Stock modificado</label>'+
        '<label class="chk"><input type="checkbox" id="ctOnlyLow"> Solo bajo mínimo / agotados</label>'+
      '</div>'+
      '<div class="row">'+
        '<button class="btn mini2" id="ctFillSys" title="Copia el stock actual del sistema en los productos filtrados sin conteo">Prellenar filtrados con stock sistema</button>'+
        '<button class="btn mini2" id="ctClearDraft">Limpiar cambios sin guardar</button>'+
      '</div>'+
    '</div>'+
    '<div class="kpis" id="ctKpis"></div>'+
    '<div class="gridwrap tallwrap"><table class="grid" style="min-width:960px">'+
      '<thead><tr>'+
        '<th style="width:76px">Código</th>'+
        '<th>Producto / Marca</th>'+
        '<th>Depto. · Categoría · Subcategoría</th>'+
        '<th class="c" style="width:52px">Pas.</th>'+
        '<th class="r" style="width:88px">Stock Sist.</th>'+
        '<th class="r" style="width:105px">Nuevo Stock</th>'+
        '<th class="r" style="width:82px">Diferencia</th>'+
        '<th class="r" style="width:92px">Dif. US$</th>'+
        '<th style="width:215px">Motivo del Nuevo Stock</th>'+
        '<th class="c" style="width:62px">Kardex</th>'+
      '</tr></thead>'+
      '<tbody id="ctBody"></tbody>'+
    '</table></div>'+
    '<p class="hint">Puede filtrar por departamento, categoría y subcategoría; los cambios de <b>Nuevo Stock</b> y su <b>Motivo</b> permanecen en memoria hasta que pulse <b>Guardar todos los cambios de forma masiva</b> al finalizar.</p>'+
  '</div>');

  const syncSelectors=()=>{
    const depts=['Todos'].concat(Array.from(new Set(S.products.map(p=>p.dept))));
    if(depts.indexOf(fDept)<0)fDept='Todos';
    $('#ctDept',el).innerHTML=depts.map(d=>'<option'+(d===fDept?' selected':'')+'>'+esc(d)+'</option>').join('');

    const catsPool=S.products.filter(p=>fDept==='Todos'||p.dept===fDept);
    const cats=['Todas'].concat(Array.from(new Set(catsPool.map(p=>p.cat))));
    if(cats.indexOf(fCat)<0)fCat='Todas';
    $('#ctCat',el).innerHTML=cats.map(c=>'<option'+(c===fCat?' selected':'')+'>'+esc(c)+'</option>').join('');

    const subsPool=catsPool.filter(p=>fCat==='Todas'||p.cat===fCat);
    const subs=['Todas'].concat(Array.from(new Set(subsPool.map(p=>p.subcat))));
    if(subs.indexOf(fSub)<0)fSub='Todas';
    $('#ctSub',el).innerHTML=subs.map(s=>'<option'+(s===fSub?' selected':'')+'>'+esc(s)+'</option>').join('');
  };

  const getRows=()=>{
    return searchProducts(fQ,fCat,fDept,fSub).filter(p=>{
      const d=draftConteo[p.code];
      const isMod=d&&d.newStock!==null&&d.newStock!==undefined&&Math.abs(d.newStock-p.stock)>1e-9;
      if(onlyMod&&!isMod)return false;
      if(onlyLow&&p.stock>p.min)return false;
      return true;
    });
  };

  const updateSummary=()=>{
    const modEntries=Object.keys(draftConteo).map(c=>{
      const p=prod(c),d=draftConteo[c];
      if(!p||!d||d.newStock===null||d.newStock===undefined)return null;
      const diff=r2(d.newStock-p.stock);
      if(Math.abs(diff)<1e-9)return null;
      return{p,d,diff,val:r2(diff*p.cost)};
    }).filter(Boolean);

    const pos=modEntries.filter(x=>x.diff>0), neg=modEntries.filter(x=>x.diff<0);
    const posVal=r2(pos.reduce((a,x)=>a+x.val,0)), negVal=r2(neg.reduce((a,x)=>a+x.val,0)), netVal=r2(posVal+negVal);
    $('#ctKpis',el).innerHTML=
      '<div class="kpi"><span>Productos en Vista</span><b>'+getRows().length+' de '+S.products.length+'</b><small>Filtrados por clasificación</small></div>'+
      '<div class="kpi"><span>Pendientes por Guardar</span><b class="'+(modEntries.length?'warn':'')+'">'+modEntries.length+' producto(s)</b><small>Con diferencia de stock</small></div>'+
      '<div class="kpi"><span>Sobrantes (+)</span><b class="ok">+'+pos.length+' reng. ('+usd(posVal)+')</b><small>Entradas por ajuste</small></div>'+
      '<div class="kpi"><span>Faltantes / Mermas (−)</span><b class="'+(neg.length?'bad':'')+'">'+neg.length+' reng. ('+usd(negVal)+')</b><small>Salidas por ajuste</small></div>'+
      '<div class="kpi"><span>Impacto Neto Inventario</span><b class="'+(netVal<0?'bad':(netVal>0?'ok':''))+'">'+(netVal>0?'+':'')+usd(netVal)+'</b><small>'+bsf(netVal*S.cfg.rate)+'</small></div>';

    const btnSave=$('#btnBulkSave');
    if(btnSave){
      btnSave.textContent='Guardar todos los cambios ('+modEntries.length+')';
      btnSave.disabled=modEntries.length===0;
    }
    renderStatus();
  };

  const drawTable=()=>{
    const list=getRows();
    $('#ctBody',el).innerHTML=list.length?list.map(p=>{
      const d=draftConteo[p.code]||{newStock:null,reason:MOTIVOS[0]};
      const hasVal=d.newStock!==null&&d.newStock!==undefined;
      const diff=hasVal?r2(d.newStock-p.stock):0;
      const isMod=hasVal&&Math.abs(diff)>1e-9;
      const diffVal=r2(diff*p.cost);
      const diffCls=diff>0?'st-ok':(diff<0?'st-out':'dim');
      const opts=MOTIVOS.map(m=>'<option value="'+esc(m)+'"'+(m===(d.reason||MOTIVOS[0])?' selected':'')+'>'+esc(m)+'</option>').join('');
      return '<tr data-code="'+esc(p.code)+'" class="'+(isMod?'rowmod':(p.stock<=0?'rowout':(p.stock<=p.min?'rowlow':'')))+'">'+
        '<td class="mono">'+esc(p.code)+'</td>'+
        '<td><div class="desc">'+esc(p.desc)+'</div><div class="sub">'+esc(p.brand)+' · Costo '+usd(p.cost)+'</div></td>'+
        '<td><div>'+esc(p.dept)+'</div><div class="sub">'+esc(p.cat)+' &rsaquo; '+esc(p.subcat)+'</div></td>'+
        '<td class="c">'+esc(p.loc)+'</td>'+
        '<td class="r '+stockCls(p)+'">'+fq(p.stock)+' '+esc(p.unit)+'</td>'+
        '<td class="r"><input class="fld cell r" data-ct-stock="'+esc(p.code)+'" value="'+(hasVal?fq(d.newStock):'')+'" placeholder="'+fq(p.stock)+'" inputmode="decimal" aria-label="Nuevo stock de '+esc(p.desc)+'"></td>'+
        '<td class="r '+diffCls+'" data-ct-diff="'+esc(p.code)+'">'+(hasVal?(diff>0?'+'+fq(diff):fq(diff)):'—')+'</td>'+
        '<td class="r '+diffCls+'" data-ct-val="'+esc(p.code)+'">'+(hasVal&& isMod?(diffVal>0?'+':'')+nf(diffVal):'0,00')+'</td>'+
        '<td><select class="fld cell-wide" data-ct-reason="'+esc(p.code)+'" aria-label="Motivo para '+esc(p.desc)+'">'+opts+'</select></td>'+
        '<td class="c"><button class="btn mini2" data-ct-kx="'+esc(p.code)+'" title="Ver Ficha Kardex">Ficha</button></td>'+
      '</tr>';
    }).join(''):'<tr class="empty"><td colspan="10">No hay productos que coincidan con los filtros seleccionados.</td></tr>';
    updateSummary();
  };

  el.addEventListener('change',e=>{
    const t=e.target;
    if(t.id==='ctDept'){fDept=t.value;fCat='Todas';fSub='Todas';syncSelectors();drawTable();return;}
    if(t.id==='ctCat'){fCat=t.value;fSub='Todas';syncSelectors();drawTable();return;}
    if(t.id==='ctSub'){fSub=t.value;drawTable();return;}
    if(t.id==='ctOnlyMod'){onlyMod=t.checked;drawTable();return;}
    if(t.id==='ctOnlyLow'){onlyLow=t.checked;drawTable();return;}
    if(t.dataset.ctReason){
      const code=t.dataset.ctReason;
      draftConteo[code]=draftConteo[code]||{newStock:null,reason:MOTIVOS[0]};
      draftConteo[code].reason=t.value;
      updateSummary();
    }
  });

  el.addEventListener('input',e=>{
    const t=e.target;
    if(t.id==='ctQ'){fQ=t.value;drawTable();return;}
    if(t.dataset.ctStock){
      const code=t.dataset.ctStock, p=prod(code);
      if(!p)return;
      const val=pnZero(t.value);
      const curReason=($('select[data-ct-reason="'+code+'"]',el)||{}).value||MOTIVOS[0];
      if(val===null){
        delete draftConteo[code];
      }else{
        const cleanVal=p.unit==='L'?r2(val):Math.round(val);
        draftConteo[code]={newStock:cleanVal,reason:curReason};
      }
      const d=draftConteo[code], hasVal=d&&d.newStock!==null&&d.newStock!==undefined;
      const diff=hasVal?r2(d.newStock-p.stock):0, isMod=hasVal&&Math.abs(diff)>1e-9;
      const diffVal=r2(diff*p.cost);
      const tr=t.closest('tr');
      if(tr)tr.className=isMod?'rowmod':(p.stock<=0?'rowout':(p.stock<=p.min?'rowlow':''));
      const tdDiff=$('[data-ct-diff="'+code+'"]',el), tdVal=$('[data-ct-val="'+code+'"]',el);
      const cls='r '+(diff>0?'st-ok':(diff<0?'st-out':'dim'));
      if(tdDiff){tdDiff.className=cls;tdDiff.textContent=hasVal?(diff>0?'+'+fq(diff):fq(diff)):'—';}
      if(tdVal){tdVal.className=cls;tdVal.textContent=hasVal&&isMod?(diffVal>0?'+':'')+nf(diffVal):'0,00';}
      updateSummary();
    }
  });

  el.addEventListener('click',e=>{
    const kxBtn=e.target.closest('[data-ct-kx]');
    if(kxBtn){kardexDlg(kxBtn.dataset.ctKx);return;}
    if(e.target.id==='ctFillSys'){
      getRows().forEach(p=>{
        if(!draftConteo[p.code]||draftConteo[p.code].newStock===null){
          draftConteo[p.code]={newStock:p.stock,reason:MOTIVOS[0]};
        }
      });
      drawTable();
      msg('Se prellenaron los productos filtrados con su stock actual.');
    }
    if(e.target.id==='ctClearDraft'){
      draftConteo={};onlyMod=false;$('#ctOnlyMod',el).checked=false;
      drawTable();
      msg('Borrador de conteo limpiado.');
    }
  });

  const saveBulk=()=>{
    const modEntries=Object.keys(draftConteo).map(c=>{
      const p=prod(c),d=draftConteo[c];
      if(!p||!d||d.newStock===null||d.newStock===undefined)return null;
      const diff=r2(d.newStock-p.stock);
      if(Math.abs(diff)<1e-9)return null;
      return{p,d,diff};
    }).filter(Boolean);

    if(!modEntries.length){
      msg('No hay diferencias de stock pendientes por guardar.','bad');
      return false;
    }
    const docId='CNT-'+pad(S.countSeq++,8);
    const ts=Date.now();
    const auditItems=[];
    modEntries.forEach(item=>{
      const p=item.p, prev=p.stock, next=item.d.newStock, diff=item.diff, reason=item.d.reason||MOTIVOS[0];
      p.stock=next;
      addKardex({
        ts,
        code:p.code,
        type:'CONTEO',
        dir:diff>0?'IN':'OUT',
        doc:docId,
        party:'Motivo: '+reason+' (Antes: '+fq(prev)+' → Nuevo: '+fq(next)+')',
        qty:Math.abs(diff),
        stockAfter:next,
        cost:p.cost,
        user:S.cfg.cajero
      });
      auditItems.push({code:p.code,desc:p.desc,prev,next,diff,cost:p.cost,reason});
    });
    S.counts.push({id:docId,ts,user:S.cfg.cajero,items:auditItems});
    draftConteo={};
    save();renderAll();
    msg('Conteo masivo '+docId+' guardado con éxito ('+auditItems.length+' productos actualizados en inventario y Kardex).');
    return true;
  };

  openWin({
    title:'Conteo Físico de Inventario y Ajuste Masivo',
    w:1080,
    body:el,
    foot:[
      {label:'Historial de conteos ('+(S.counts||[]).length+')',left:true,fn:()=>{countsHistoryDlg();return false;}},
      {label:'Ir a Inventario (F8)',left:true,fn:()=>{inventoryDlg();return false;}},
      {label:'Cerrar'},
      {id:'btnBulkSave',label:'Guardar todos los cambios (0)',primary:true,fn:saveBulk}
    ],
    onEnter:()=>{},
    onOpen:()=>{syncSelectors();drawTable();}
  });
}

function countsHistoryDlg(){
  const list=(S.counts||[]).slice().reverse();
  const el=h('<div class="form"><div class="gridwrap tallwrap"><table class="grid"><thead><tr><th>Documento</th><th>Fecha / Hora</th><th>Operador</th><th>Productos Ajustados</th></tr></thead><tbody>'+
    (list.length?list.map(c=>'<tr><td class="mono"><b>'+esc(c.id)+'</b></td><td>'+fmtDT(c.ts)+'</td><td>'+esc(c.user)+'</td><td>'+c.items.map(i=>'<div><b>'+esc(i.code)+' '+esc(i.desc)+'</b>: '+fq(i.prev)+' &rarr; '+fq(i.next)+' ('+(i.diff>0?'+'+fq(i.diff):fq(i.diff))+') · <span class="dim">'+esc(i.reason)+'</span></div>').join('')+'</td></tr>').join(''):'<tr class="empty"><td colspan="4">Aún no se han guardado lotes de conteo.</td></tr>')+
  '</tbody></table></div></div>');
  openWin({title:'Historial de Conteos Masivos de Inventario',w:840,body:el,foot:[
    {label:'Volver al Conteo',primary:true,fn:()=>{conteoDlg();return false;}}
  ]});
}

/* ---------- GENERADOR DE ETIQUETAS / HABLADOR DE SKU (CON O SIN PRECIO US$, SIN BS.) ---------- */
function labelGeneratorDlg(initialCode){
  let code=initialCode||(S.catSel&&prod(S.catSel)?S.catSel:S.products[0].code);
  let showPrice=true, fmt='hablador', tierIdx=0, incIva=false, copies=2;

  const el=h('<div class="form">'+
    '<div class="fltgrid">'+
      '<div class="f" style="grid-column:span 2"><label for="lbProd">Producto</label><select class="fld" id="lbProd"></select></div>'+
      '<div class="f"><label for="lbFmt">Formato de diseño</label><select class="fld" id="lbFmt"><option value="hablador">Hablador de mostrador / estante</option><option value="etiqueta">Etiqueta adhesiva de SKU</option></select></div>'+
      '<div class="f"><label for="lbCopies">Copias en vista</label><select class="fld" id="lbCopies"><option value="1">1 unidad</option><option value="2" selected>2 unidades</option><option value="4">4 unidades</option><option value="6">6 unidades</option></select></div>'+
      '<div class="f"><label for="lbTier">Escala de precio US$</label><select class="fld" id="lbTier"><option value="0">Detal / Mostrador</option><option value="1">Taller / Mecánico</option><option value="2">Mayorista</option><option value="3">Distribuidor</option></select></div>'+
      '<div class="f"><label>Opciones de precio (Solo US$)</label>'+
        '<div class="row" style="margin-top:3px"><label class="chk"><input type="checkbox" id="lbShowP" checked> Mostrar precio US$</label><label class="chk"><input type="checkbox" id="lbIva"> Con IVA</label></div>'+
      '</div>'+
    '</div>'+
    '<div class="hablador-wrap" id="lbPreview"></div>'+
    '<p class="hint">El hablador/etiqueta muestra el <b>SKU automático compuesto</b> con su código de barras y, opcionalmente, el precio expresado únicamente en <b>US$</b> (sin conversión a Bs.).</p>'+
  '</div>');

  const fillProds=()=>{
    $('#lbProd',el).innerHTML=S.products.map(p=>'<option value="'+esc(p.code)+'"'+(p.code===code?' selected':'')+'>'+esc(p.sku||p.code)+' — '+esc(p.desc)+' ('+esc(p.brand)+')</option>').join('');
  };

  const draw=()=>{
    const p=prod(code)||S.products[0];if(!p)return;
    const sku=p.sku||genAutoSku(p.dept,p.cat,p.subcat,S.products.indexOf(p)+1);
    const gaps=(p.pricing&&p.pricing.gaps)||[];
    const baseP=(gaps[tierIdx]&&gaps[tierIdx].price)||p.price;
    const taxRate=(p.tax&&p.tax.type!=='E'&&p.tax.type!=='NS')?(p.tax.rate||16)/100:0;
    const finalUsd=incIva?r2(baseP*(1+taxRate)):baseP;
    const tierName=gaps[tierIdx]?gaps[tierIdx].name:'PRECIO';

    let cards='';
    for(let i=0;i<copies;i++){
      cards+=
        '<div class="hablador '+(fmt==='hablador'?'shelf':'')+'">'+
          '<div class="hab-top"><span>'+esc(S.cfg.empresa)+'</span><span>PASILLO '+esc(p.loc)+'</span></div>'+
          '<div style="display:flex;gap:8px;align-items:center">'+
            (p.photo?'<img src="'+esc(p.photo)+'" alt="" style="width:46px;height:46px;object-fit:contain;border:1px solid #ccc">':'')+
            '<div style="flex:1;min-width:0">'+
              '<div class="hab-desc">'+esc(p.desc)+'</div>'+
              '<div class="hab-meta"><b>'+esc(p.brand)+'</b> · '+esc(p.cat)+' &rsaquo; '+esc(p.subcat)+'</div>'+
            '</div>'+
          '</div>'+
          (showPrice?
            '<div class="hab-price-box">'+
              '<span>'+esc(tierName.toUpperCase())+' '+(incIva?'(IVA INCL.)':'(SIN IVA)')+'</span>'+
              '<b>US$ '+nf(finalUsd)+'</b>'+
            '</div>':'')+
          '<div class="hab-bc">'+
            svgBarcode(sku)+
            '<div class="hab-sku">'+esc(sku)+'</div>'+
            '<div style="font-size:10px;color:#555">EAN/REF: '+esc(p.code)+' · UND: '+esc(p.unit.toUpperCase())+'</div>'+
          '</div>'+
        '</div>';
    }
    $('#lbPreview',el).innerHTML=cards;
  };

  el.addEventListener('change',e=>{
    const t=e.target;
    if(t.id==='lbProd')code=t.value;
    if(t.id==='lbFmt')fmt=t.value;
    if(t.id==='lbCopies')copies=+t.value;
    if(t.id==='lbTier')tierIdx=+t.value;
    if(t.id==='lbShowP'){showPrice=t.checked;$('#lbTier',el).disabled=!showPrice;$('#lbIva',el).disabled=!showPrice;}
    if(t.id==='lbIva')incIva=t.checked;
    draw();
  });

  openWin({
    title:'Generador de Etiquetas y Habladores de SKU (US$)',
    w:820,
    body:el,
    foot:[
      {label:'Editar Ficha del Producto',left:true,fn:()=>{productFormDlg(code);return false;}},
      {label:'Imprimir Etiquetas / Hablador',left:true,fn:()=>{window.print();return false;}},
      {label:'Cerrar',primary:true}
    ],
    onOpen:()=>{fillProds();draw();}
  });
}

/* ==========================================================================
   CATÁLOGO MAESTRO AUTOMOTRIZ (+2.500.000 REPUESTOS Y LUBRICANTES INDEXADOS)
   Incluye aceites/lubricantes nacionales (PDV, Venoco, Inca) e importados en todas sus presentaciones,
   familias de repuestos con códigos OEM exclusivamente verificados (sin inventar códigos OEM).
   ========================================================================== */

const VERIFIED_OEM_MAP = {
  // Toyota Genuine Parts
  'filtro-aceite-corolla-1.8': '04152-YZZA6',
  'filtro-aceite-hilux-4runner': '90915-YZZD3',
  'filtro-aceite-yaris': '90915-YZZD1',
  'filtro-aire-corolla': '17801-22020',
  'filtro-aire-hilux': '17801-0C010',
  'filtro-gasoil-hilux': '23390-0L041',
  'pastillas-corolla-03-08': '04465-02061',
  'pastillas-corolla-09-14': '04465-02220',
  'pastillas-hilux-fortuner': '04465-0K090',
  'discos-freno-corolla': '43512-02110',
  'bujia-ngk-corolla': '90919-01164',
  'bujia-iridium-corolla': '90919-01210',
  'bobina-corolla-1.8': '90919-02239',
  'munon-corolla': '43330-19115',
  'terminal-corolla': '45046-19175',
  'amortiguador-corolla': '48510-09L40',
  'bieleta-corolla': '48820-47010',
  'correa-unica-corolla': '90916-02556',
  'bomba-agua-corolla': '16100-29157',
  'kit-embrague-corolla': '31250-12391',
  'rodamiento-corolla': '90369-38022',

  // Chevrolet / GM Genuine Parts
  'filtro-aceite-aveo': '93745067',
  'filtro-aire-aveo': '96536696',
  'filtro-gasolina-aveo': '96335719',
  'filtro-aceite-optra': '93185674',
  'filtro-aceite-corsa': '93156300',
  'filtro-aceite-silverado': '89017524',
  'pastillas-aveo': '96534653',
  'pastillas-optra': '96405131',
  'pastillas-silverado': '19256950',
  'discos-freno-aveo': '96574633',
  'bobina-aveo': '96253555',
  'cables-bujia-aveo': '96497773',
  'cables-bujia-corsa': '93236353',
  'munon-aveo': '96535081',
  'terminal-aveo': '96535224',
  'amortiguador-aveo': '96586885',
  'bieleta-aveo': '96391875',
  'correa-dist-aveo': '96814098',
  'tensor-dist-aveo': '96350550',
  'bomba-agua-aveo': '96352650',
  'kit-embrague-aveo': '96349976',
  'rodamiento-aveo': '96285565',
  'envase-aveo': '96420303',
  'termostato-aveo': '96407677',

  // Ford Motorcraft Genuine Parts
  'filtro-aceite-fiesta': 'BE8Z-6731-AB',
  'filtro-aire-fiesta': '2S61-9601-CA',
  'filtro-aceite-explorer': 'FL-820-S',
  'pastillas-fiesta': '2S6J-2K021-AA',
  'pastillas-explorer': '7L2Z-2001-A',
  'bobina-fiesta': '1S7G-12029-AC',
  'cables-bujia-fiesta': '2S6G-12280-AB',
  'termostato-fiesta': '2S65-8A520-AA',
  'bomba-agua-fiesta': '2S6G-8501-AA',
  'amortiguador-fiesta': '2S61-18045-AB',
  'munon-fiesta': '2S61-3395-AB',
  'correa-unica-fiesta': '2S6G-6C301-BA',

  // Hyundai & Kia Genuine Parts
  'filtro-aceite-getz': '26300-35503',
  'filtro-aire-getz': '28113-1C000',
  'filtro-gasolina-getz': '31911-1C000',
  'pastillas-getz': '58101-1CA00',
  'bujia-getz': '18814-11051',
  'bobina-getz': '27301-26640',
  'amortiguador-getz': '54650-1C000',
  'munon-getz': '51760-25000',
  'correa-dist-getz': '24312-26050',

  // Nissan Genuine Parts
  'filtro-aceite-tiida': '15208-65F0A',
  'filtro-aire-tiida': '16546-ED000',
  'pastillas-tiida': 'D1060-EE50A',
  'bujia-tiida': '22401-ED815',
  'bobina-tiida': '22448-ED000',
  'amortiguador-tiida': 'E4302-EE50A',

  // Chery Genuine Parts
  'filtro-aceite-arauca': '481H-1012010',
  'filtro-aire-arauca': 'S11-1109111',
  'pastillas-arauca': 'S11-3501080',
  'pastillas-orinoco': 'A11-3501080BA',
  'bujia-arauca': 'F4J16-3707010',
  'bobina-orinoco': 'A11-3705110EA',
  'correa-dist-orinoco': '481H-1007073',

  // Mitsubishi Genuine Parts
  'filtro-aceite-lancer': 'MD360935',
  'pastillas-lancer-touring': 'MR389546',
  'pastillas-montero-dakar': 'MR389549',
  'bujia-lancer': 'MD362098',
  'bobina-lancer': 'MD361710',
  'amortiguador-lancer': 'MR554462',

  // Jeep / Mopar Genuine Parts
  'filtro-aceite-grand-cherokee': '04884899AC',
  'pastillas-grand-cherokee': '05080871AA',
  'bujia-grand-cherokee': 'SPLZTR5A13',
  'amortiguador-grand-cherokee': '05135558AA'
};

const LUBRICANT_PRES_CONFIG = {
  litro: (code, bc) => [
    { name: 'Pote / Litro individual (946 mL / 1 L)', unit: 'L', factor: 1, barcode: bc || code, price: 0 },
    { name: 'Caja x 12 Litros', unit: 'caja', factor: 12, barcode: (bc || code) + 'C12', price: 0 },
    { name: 'Galón (3.785 L / 4 L)', unit: 'gal', factor: 3.785, barcode: (bc || code) + 'GL', price: 0 },
    { name: 'Paila / Cuñete 19 L (5 Gal)', unit: 'paila', factor: 19, barcode: (bc || code) + 'P19', price: 0 },
    { name: 'Tambor 208 L (55 Gal)', unit: 'tambor', factor: 208, barcode: (bc || code) + 'T208', price: 0 }
  ],
  galon: (code, bc) => [
    { name: 'Galón (3.785 L / 4 L)', unit: 'gal', factor: 1, barcode: bc || code, price: 0 },
    { name: 'Caja x 3 Galones', unit: 'caja', factor: 3, barcode: (bc || code) + 'C3', price: 0 },
    { name: 'Paila 19 L (5 Gal)', unit: 'paila', factor: 5, barcode: (bc || code) + 'P19', price: 0 },
    { name: 'Tambor 208 L (55 Gal)', unit: 'tambor', factor: 55, barcode: (bc || code) + 'T208', price: 0 }
  ],
  paila: (code, bc) => [
    { name: 'Paila / Cuñete 19 L (5 Gal)', unit: 'paila', factor: 1, barcode: bc || code, price: 0 },
    { name: 'Tambor 208 L (55 Gal)', unit: 'tambor', factor: 11, barcode: (bc || code) + 'T208', price: 0 }
  ],
  grasa: (code, bc) => [
    { name: 'Pote 400g / 500g', unit: 'und', factor: 1, barcode: bc || code, price: 0 },
    { name: 'Tubo / Cartucho 400g', unit: 'und', factor: 1, barcode: (bc || code) + 'TB', price: 0 },
    { name: 'Paila 16 kg (Grasa)', unit: 'paila', factor: 32, barcode: (bc || code) + 'P16', price: 0 },
    { name: 'Tambor 180 kg', unit: 'tambor', factor: 360, barcode: (bc || code) + 'T180', price: 0 }
  ]
};

/* Base de productos maestros de alta rotación en Venezuela (Lubricantes y Repuestos) */
const MASTER_CURATED_CATALOG = [
  // --- PDV (Petróleos de Venezuela) ---
  {
    code: '7591001001',
    desc: 'Aceite de Motor PDV Extra Multigrado 20W-50 Mineral 1 L (Pote 946 mL)',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '', // Sin OEM verificado (en blanco)
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001001')
  },
  {
    code: '7591001002',
    desc: 'Aceite de Motor PDV Extra Multigrado 20W-50 Mineral Galón 3,785 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'gal',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.galon('7591001002')
  },
  {
    code: '7591001003',
    desc: 'Aceite de Motor PDV Extra Multigrado 20W-50 Paila 19 L (5 Gal)',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'paila',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.paila('7591001003')
  },
  {
    code: '7591001004',
    desc: 'Aceite de Motor PDV Extra Multigrado 15W-40 Semisintético 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Semisintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001004')
  },
  {
    code: '7591001005',
    desc: 'Aceite de Motor PDV Ultra Diésel 15W-40 CI-4/SL 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001005')
  },
  {
    code: '7591001006',
    desc: 'Aceite de Motor PDV Ultra Diésel 15W-40 Paila 19 L (5 Gal)',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'paila',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.paila('7591001006')
  },
  {
    code: '7591001007',
    desc: 'Aceite de Motor PDV Maxidiesel 50 Monogrado 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001007')
  },
  {
    code: '7591001008',
    desc: 'Aceite Transmisión PDV EP-90 Valvulina 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001008')
  },
  {
    code: '7591001009',
    desc: 'Aceite Transmisión PDV EP-140 Valvulina 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001009')
  },
  {
    code: '7591001010',
    desc: 'Aceite Transmisión Automática PDV ATF Dexron III 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Caja Automática (ATF)',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001010')
  },
  {
    code: '7591001011',
    desc: 'Aceite 2T Marino PDV Fuera de Borda TC-W3 1 L',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: '2 Tiempos Marino',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001011')
  },
  {
    code: '7591001012',
    desc: 'Aceite 2T Moto PDV Enfriado por Aire 1 L',
    brand: 'PDV',
    dept: 'Motocicletas',
    cat: 'Moto',
    subcat: 'Aceite 2T',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7591001012')
  },
  {
    code: '7591001013',
    desc: 'Aceite Hidráulico PDV Hidralub ISO 68 Paila 19 L (5 Gal)',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Grasas y lubricantes',
    subcat: 'Aceite Hidráulico',
    unit: 'paila',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.paila('7591001013')
  },
  {
    code: '7591001014',
    desc: 'Grasa PDV Chasis MP-2 / Rulemanes EP-2 Pote 500 g',
    brand: 'PDV',
    dept: 'Lubricantes y Fluidos',
    cat: 'Grasas y lubricantes',
    subcat: 'Grasas Litio y Chasis',
    unit: 'und',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.grasa('7591001014')
  },

  // --- VENOCO ---
  {
    code: '7592001001',
    desc: 'Aceite de Motor Venoco Expert 20W-50 SL/CF Mineral 1 L (Pote 946 mL)',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001001')
  },
  {
    code: '7592001002',
    desc: 'Aceite de Motor Venoco Expert 20W-50 SL Galón 3,785 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'gal',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.galon('7592001002')
  },
  {
    code: '7592001003',
    desc: 'Aceite de Motor Venoco Lubri-Ven 15W-40 CI-4 Diésel/Gasolina 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001003')
  },
  {
    code: '7592001004',
    desc: 'Aceite de Motor Venoco Sintético 5W-30 SN/CF 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Sintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001004')
  },
  {
    code: '7592001005',
    desc: 'Valvulina Venoco 80W-90 GL-5 Engranajes 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001005')
  },
  {
    code: '7592001006',
    desc: 'Valvulina Venoco 85W-140 GL-5 Engranajes 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001006')
  },
  {
    code: '7592001007',
    desc: 'Aceite Transmisión Automática Venoco ATF Dexron III 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Caja Automática (ATF)',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001007')
  },
  {
    code: '7592001008',
    desc: 'Aceite 2T Marino Venoco Outboard TC-W3 1 L',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: '2 Tiempos Marino',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7592001008')
  },
  {
    code: '7592001009',
    desc: 'Grasa Azul de Litio Venoco EP Complejo Pote 400 g',
    brand: 'Venoco',
    dept: 'Lubricantes y Fluidos',
    cat: 'Grasas y lubricantes',
    subcat: 'Grasas Litio y Chasis',
    unit: 'und',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.grasa('7592001009')
  },

  // --- INCA ---
  {
    code: '7593001001',
    desc: 'Aceite de Motor Inca Super Multigrado 20W-50 SL Mineral 1 L',
    brand: 'Inca',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7593001001')
  },
  {
    code: '7593001002',
    desc: 'Aceite de Motor Inca Super Multigrado 20W-50 Galón 3,785 L',
    brand: 'Inca',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'gal',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.galon('7593001002')
  },
  {
    code: '7593001003',
    desc: 'Aceite de Motor Inca Diesel 15W-40 CI-4 1 L',
    brand: 'Inca',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7593001003')
  },
  {
    code: '7593001004',
    desc: 'Valvulina Inca Gear 85W-140 GL-5 1 L',
    brand: 'Inca',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7593001004')
  },
  {
    code: '7593001005',
    desc: 'Aceite 2T Marino Inca TC-W3 1 L',
    brand: 'Inca',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: '2 Tiempos Marino',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7593001005')
  },

  // --- SHELL VENEZUELA ---
  {
    code: '7594001001',
    desc: 'Aceite de Motor Shell Helix HX5 15W-40 Mineral 1 L',
    brand: 'Shell',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7594001001')
  },
  {
    code: '7594001002',
    desc: 'Aceite de Motor Shell Helix HX7 10W-40 Semisintético 1 L',
    brand: 'Shell',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Semisintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7594001002')
  },
  {
    code: '7594001003',
    desc: 'Aceite de Motor Shell Helix Ultra 5W-30 Sintético PurePlus 1 L',
    brand: 'Shell',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Sintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7594001003')
  },
  {
    code: '7594001004',
    desc: 'Aceite Diésel Shell Rimula R4 X 15W-40 CI-4 1 L',
    brand: 'Shell',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7594001004')
  },
  {
    code: '7594001005',
    desc: 'Valvulina Shell Spirax S2 A 80W-90 GL-5 1 L',
    brand: 'Shell',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Valvulina y Engranajes',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7594001005')
  },

  // --- CASTROL ---
  {
    code: '7595001001',
    desc: 'Aceite de Motor Castrol GTX 20W-50 Mineral 1 L (Pote 946 mL)',
    brand: 'Castrol',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7595001001')
  },
  {
    code: '7595001002',
    desc: 'Aceite de Motor Castrol GTX Ultraclean 10W-40 Semisintético 1 L',
    brand: 'Castrol',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Semisintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7595001002')
  },
  {
    code: '7595001003',
    desc: 'Aceite de Motor Castrol Magnatec 5W-30 Stop-Start 1 L',
    brand: 'Castrol',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Sintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7595001003')
  },
  {
    code: '7595001004',
    desc: 'Aceite Moto Castrol Actevo 4T 20W-50 Mineral 1 L',
    brand: 'Castrol',
    dept: 'Motocicletas',
    cat: 'Moto',
    subcat: 'Aceite 4T',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7595001004')
  },

  // --- MOBIL ---
  {
    code: '7596001001',
    desc: 'Aceite de Motor Mobil Super 20W-50 Mineral 1 L (Pote 946 mL)',
    brand: 'Mobil',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7596001001')
  },
  {
    code: '7596001002',
    desc: 'Aceite de Motor Mobil 1 5W-30 Advanced Full Synthetic 1 L',
    brand: 'Mobil',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Sintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7596001002')
  },
  {
    code: '7596001003',
    desc: 'Aceite Diésel Mobil Delvac 1300 Super 15W-40 1 L',
    brand: 'Mobil',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7596001003')
  },

  // --- MOTUL ---
  {
    code: '7597001001',
    desc: 'Aceite de Motor Motul 4000 Motion 15W-40 Mineral 1 L',
    brand: 'Motul',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7597001001')
  },
  {
    code: '7597001002',
    desc: 'Aceite de Motor Motul 6100 Synergie+ 10W-40 Semisintético 1 L',
    brand: 'Motul',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Semisintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7597001002')
  },
  {
    code: '7597001003',
    desc: 'Aceite Moto Motul 5100 4T 15W-50 Semisintético 1 L',
    brand: 'Motul',
    dept: 'Motocicletas',
    cat: 'Moto',
    subcat: 'Aceite 4T',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7597001003')
  },
  {
    code: '7597001004',
    desc: 'Refrigerante Motul Inugel Expert 50% Listo para Usar 1 L',
    brand: 'Motul',
    dept: 'Lubricantes y Fluidos',
    cat: 'Refrigerante y aditivos',
    subcat: 'Refrigerante 50%',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Envase 1 Litro', unit: 'L', factor: 1, barcode: '7597001004', price: 0 },
      { name: 'Garrafa 5 Litros', unit: 'gal', factor: 5, barcode: '7597001004G5', price: 0 }
    ]
  },

  // --- VALVOLINE ---
  {
    code: '7598001001',
    desc: 'Aceite de Motor Valvoline Daily Protection 20W-50 Mineral 1 L',
    brand: 'Valvoline',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Mineral',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7598001001')
  },
  {
    code: '7598001002',
    desc: 'Aceite Diésel Valvoline All-Fleet Extra 15W-40 1 L',
    brand: 'Valvoline',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Diésel Pesado',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7598001002')
  },
  {
    code: '7598001003',
    desc: 'Aceite de Motor Valvoline Advanced Full Synthetic 5W-30 1 L',
    brand: 'Valvoline',
    dept: 'Lubricantes y Fluidos',
    cat: 'Aceites de motor',
    subcat: 'Sintético',
    unit: 'L',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: LUBRICANT_PRES_CONFIG.litro('7598001003')
  },

  // --- REPUESTOS AUTOMOTRICES CON CÓDIGOS OEM VERIFICADOS ---
  // Toyota Corolla
  {
    code: '7504001001',
    desc: 'Filtro de Aceite de Motor Toyota Corolla 1.8 (2003-2014) / Celica',
    brand: 'Millard',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-corolla-1.8'], // 04152-YZZA6
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001001', price: 0 }]
  },
  {
    code: '7504001002',
    desc: 'Filtro de Aire Motor Toyota Corolla 1.8 (2003-2008)',
    brand: 'Web',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aire',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aire-corolla'], // 17801-22020
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001002', price: 0 }]
  },
  {
    code: '7504001003',
    desc: 'Pastillas de Freno Delanteras Toyota Corolla 1.8 (2003-2008)',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-corolla-03-08'], // 04465-02061
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504001003', price: 0 }]
  },
  {
    code: '7504001004',
    desc: 'Pastillas de Freno Delanteras Toyota Corolla New Sensation (2009-2014)',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-corolla-09-14'], // 04465-02220
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504001004', price: 0 }]
  },
  {
    code: '7504001005',
    desc: 'Disco de Freno Delantero Ventilado Toyota Corolla (2003-2008)',
    brand: 'Fremax',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Discos de Freno',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['discos-freno-corolla'], // 43512-02110
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad (Rueda)', unit: 'und', factor: 1, barcode: '7504001005', price: 0 }]
  },
  {
    code: '7504001006',
    desc: 'Bujía de Encendido Cobre Toyota Corolla / Aveo / Corsa (BKR6E-11)',
    brand: 'NGK',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Bujías',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bujia-ngk-corolla'], // 90919-01164
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001006', price: 0 },
      { name: 'Caja x 4 Bujías', unit: 'caja', factor: 4, barcode: '7504001006C4', price: 0 }
    ]
  },
  {
    code: '7504001007',
    desc: 'Bujía de Iridium Toyota Corolla / Camry / RAV4 (SK20R11)',
    brand: 'Denso',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Bujías',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bujia-iridium-corolla'], // 90919-01210
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001007', price: 0 },
      { name: 'Caja x 4 Bujías', unit: 'caja', factor: 4, barcode: '7504001007C4', price: 0 }
    ]
  },
  {
    code: '7504001008',
    desc: 'Bobina de Encendido Individual Toyota Corolla 1.8 1ZZ-FE (2003-2008)',
    brand: 'Denso',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Bobinas de Encendido',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bobina-corolla-1.8'], // 90919-02239
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001008', price: 0 }]
  },
  {
    code: '7504001009',
    desc: 'Muñón Inferior Delantero Toyota Corolla (SB-3642)',
    brand: '555',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Muñones y Rótulas',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['munon-corolla'], // 43330-19115
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001009', price: 0 }]
  },
  {
    code: '7504001010',
    desc: 'Terminal de Dirección Externo Toyota Corolla (SE-3641)',
    brand: '555',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Terminales de Dirección',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['terminal-corolla'], // 45046-19175
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001010', price: 0 }]
  },
  {
    code: '7504001011',
    desc: 'Amortiguador Delantero a Gas Toyota Corolla (334815)',
    brand: 'KYB',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Amortiguadores',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['amortiguador-corolla'], // 48510-09L40
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001011', price: 0 },
      { name: 'Par Delantero (2 und)', unit: 'par', factor: 2, barcode: '7504001011P2', price: 0 }
    ]
  },
  {
    code: '7504001012',
    desc: 'Bomba de Agua Toyota Corolla 1.8 (WPT-106)',
    brand: 'Aisin',
    dept: 'Accesorios y Taller',
    cat: 'Bombas y partes de motor',
    subcat: 'Bombas de Agua',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bomba-agua-corolla'], // 16100-29157
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad con Empacadura', unit: 'und', factor: 1, barcode: '7504001012', price: 0 }]
  },
  {
    code: '7504001013',
    desc: 'Kit de Embrague (Plato, Disco y Collarín) Toyota Corolla 1.8 (KT-277)',
    brand: 'Aisin',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Kits de Embrague',
    unit: 'kit',
    oem: VERIFIED_OEM_MAP['kit-embrague-corolla'], // 31250-12391
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Kit Completo 3 Piezas', unit: 'kit', factor: 1, barcode: '7504001013', price: 0 }]
  },

  // Toyota Hilux / 4Runner
  {
    code: '7504001020',
    desc: 'Filtro de Aceite Toyota Hilux 2.7 / Fortuner 4.0 / 4Runner',
    brand: 'Millard',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-hilux-4runner'], // 90915-YZZD3
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001020', price: 0 }]
  },
  {
    code: '7504001021',
    desc: 'Filtro de Aire Toyota Hilux / Fortuner 2.7 y 4.0',
    brand: 'WIX',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aire',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aire-hilux'], // 17801-0C010
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504001021', price: 0 }]
  },
  {
    code: '7504001022',
    desc: 'Filtro de Gasoil Trampa con Sensor Toyota Hilux 1KD / 2KD Diésel',
    brand: 'Toyota Genuine',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Combustible',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-gasoil-hilux'], // 23390-0L041
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Elemento con O-ring', unit: 'und', factor: 1, barcode: '7504001022', price: 0 }]
  },
  {
    code: '7504001023',
    desc: 'Pastillas de Freno Delanteras Toyota Hilux Vigo / Fortuner / 4Runner',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-hilux-fortuner'], // 04465-0K090
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504001023', price: 0 }]
  },

  // Chevrolet Aveo
  {
    code: '7504002001',
    desc: 'Filtro de Aceite de Motor Chevrolet Aveo 1.6 / Daewoo Lanos',
    brand: 'Millard',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-aveo'], // 93745067
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002001', price: 0 }]
  },
  {
    code: '7504002002',
    desc: 'Filtro de Aire Motor Chevrolet Aveo 1.6 (Todos los años)',
    brand: 'Web',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aire',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aire-aveo'], // 96536696
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002002', price: 0 }]
  },
  {
    code: '7504002003',
    desc: 'Filtro de Gasolina Metálico Chevrolet Aveo / Corsa / Optra / Spark',
    brand: 'AC Delco',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Combustible',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-gasolina-aveo'], // 96335719
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002003', price: 0 }]
  },
  {
    code: '7504002004',
    desc: 'Pastillas de Freno Delanteras Chevrolet Aveo 1.6 (2005-2015)',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-aveo'], // 96534653
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504002004', price: 0 }]
  },
  {
    code: '7504002005',
    desc: 'Disco de Freno Delantero Chevrolet Aveo 1.6',
    brand: 'Fremax',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Discos de Freno',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['discos-freno-aveo'], // 96574633
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad (Rueda)', unit: 'und', factor: 1, barcode: '7504002005', price: 0 }]
  },
  {
    code: '7504002006',
    desc: 'Bobina de Encendido Chevrolet Aveo 1.6 (Módulo 3 Pines)',
    brand: 'Delphi',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Bobinas de Encendido',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bobina-aveo'], // 96253555
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002006', price: 0 }]
  },
  {
    code: '7504002007',
    desc: 'Juego de Cables de Bujía 7mm Chevrolet Aveo 1.6',
    brand: 'AC Delco',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Cables de Bujías',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['cables-bujia-aveo'], // 96497773
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego 4 Cables', unit: 'jgo', factor: 1, barcode: '7504002007', price: 0 }]
  },
  {
    code: '7504002008',
    desc: 'Muñón Inferior Delantero Chevrolet Aveo (CBKD-11)',
    brand: 'CTR',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Muñones y Rótulas',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['munon-aveo'], // 96535081
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002008', price: 0 }]
  },
  {
    code: '7504002009',
    desc: 'Terminal de Dirección Externo Chevrolet Aveo (CEKD-13)',
    brand: 'CTR',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Terminales de Dirección',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['terminal-aveo'], // 96535224
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002009', price: 0 }]
  },
  {
    code: '7504002010',
    desc: 'Amortiguador Delantero Chevrolet Aveo a Gas (72288)',
    brand: 'Monroe',
    dept: 'Frenos y Suspensión',
    cat: 'Suspensión y dirección',
    subcat: 'Amortiguadores',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['amortiguador-aveo'], // 96586885
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002010', price: 0 },
      { name: 'Par Delantero (2 und)', unit: 'par', factor: 2, barcode: '7504002010P2', price: 0 }
    ]
  },
  {
    code: '7504002011',
    desc: 'Correa de Distribución Chevrolet Aveo 1.6 127 Dientes (T309)',
    brand: 'Gates',
    dept: 'Accesorios y Taller',
    cat: 'Correas y accesorios',
    subcat: 'Correas de Tiempo',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['correa-dist-aveo'], // 96814098
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002011', price: 0 }]
  },
  {
    code: '7504002012',
    desc: 'Tensor de Distribución Chevrolet Aveo 1.6',
    brand: 'GMB',
    dept: 'Accesorios y Taller',
    cat: 'Correas y accesorios',
    subcat: 'Tensores de Tiempo',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['tensor-dist-aveo'], // 96350550
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504002012', price: 0 }]
  },
  {
    code: '7504002013',
    desc: 'Bomba de Agua Chevrolet Aveo 1.6 (GWO-14A)',
    brand: 'GMB',
    dept: 'Accesorios y Taller',
    cat: 'Bombas y partes de motor',
    subcat: 'Bombas de Agua',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bomba-agua-aveo'], // 96352650
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad con Empacadura', unit: 'und', factor: 1, barcode: '7504002013', price: 0 }]
  },
  {
    code: '7504002014',
    desc: 'Kit de Embrague Chevrolet Aveo 1.6 (DWK-039)',
    brand: 'Valeo',
    dept: 'Lubricantes y Fluidos',
    cat: 'Transmisión y diferencial',
    subcat: 'Kits de Embrague',
    unit: 'kit',
    oem: VERIFIED_OEM_MAP['kit-embrague-aveo'], // 96349976
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Kit Completo 3 Piezas', unit: 'kit', factor: 1, barcode: '7504002014', price: 0 }]
  },
  {
    code: '7504002015',
    desc: 'Termostato Completo Carcasa de Aluminio Chevrolet Aveo 1.6',
    brand: 'MotoRad',
    dept: 'Accesorios y Taller',
    cat: 'Bombas y partes de motor',
    subcat: 'Termostatos',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['termostato-aveo'], // 96407677
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad con Termostato', unit: 'und', factor: 1, barcode: '7504002015', price: 0 }]
  },

  // Ford Fiesta
  {
    code: '7504003001',
    desc: 'Filtro de Aceite Ford Fiesta Power / Move / Max 1.6 (FL-910S)',
    brand: 'Motorcraft',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-fiesta'], // BE8Z-6731-AB
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504003001', price: 0 }]
  },
  {
    code: '7504003002',
    desc: 'Filtro de Aire Motor Ford Fiesta 1.6 Zetec Rocam',
    brand: 'Motorcraft',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aire',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aire-fiesta'], // 2S61-9601-CA
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504003002', price: 0 }]
  },
  {
    code: '7504003003',
    desc: 'Pastillas de Freno Delanteras Ford Fiesta Power 1.6 (2004-2013)',
    brand: 'Motorcraft',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-fiesta'], // 2S6J-2K021-AA
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504003003', price: 0 }]
  },
  {
    code: '7504003004',
    desc: 'Bobina de Encendido Ford Fiesta 1.6 Zetec Rocam / EcoSport 1.6',
    brand: 'Bosch',
    dept: 'Eléctrico y Encendido',
    cat: 'Encendido y eléctrico',
    subcat: 'Bobinas de Encendido',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['bobina-fiesta'], // 1S7G-12029-AC
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504003004', price: 0 }]
  },
  {
    code: '7504003005',
    desc: 'Termostato Carcasa de Aluminio Ford Fiesta Power 1.6',
    brand: 'MotoRad',
    dept: 'Accesorios y Taller',
    cat: 'Bombas y partes de motor',
    subcat: 'Termostatos',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['termostato-fiesta'], // 2S65-8A520-AA
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Carcasa Completa Aluminio', unit: 'und', factor: 1, barcode: '7504003005', price: 0 }]
  },

  // Hyundai Getz / Accent
  {
    code: '7504004001',
    desc: 'Filtro de Aceite Hyundai Getz / Accent 1.3 - 1.6 / Tucson / Kia Rio',
    brand: 'Millard',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-getz'], // 26300-35503
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504004001', price: 0 }]
  },
  {
    code: '7504004002',
    desc: 'Pastillas de Freno Delanteras Hyundai Getz (2006-2012)',
    brand: 'Hi-Q Sangsin',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-getz'], // 58101-1CA00
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504004002', price: 0 }]
  },

  // Nissan Tiida / Sentra
  {
    code: '7504005001',
    desc: 'Filtro de Aceite Nissan Tiida 1.8 / Sentra B16 / Versa / March',
    brand: 'WIX',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-tiida'], // 15208-65F0A
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504005001', price: 0 }]
  },
  {
    code: '7504005002',
    desc: 'Pastillas de Freno Delanteras Nissan Tiida 1.8 (2007-2014)',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-tiida'], // D1060-EE50A
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504005002', price: 0 }]
  },

  // Chery Arauca / Orinoco
  {
    code: '7504006001',
    desc: 'Filtro de Aceite Chery Arauca 1.3 / Orinoco 1.8 / Tiggo',
    brand: 'Millard',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-arauca'], // 481H-1012010
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504006001', price: 0 }]
  },
  {
    code: '7504006002',
    desc: 'Pastillas de Freno Delanteras Chery Orinoco 1.8',
    brand: 'Bendix',
    dept: 'Frenos y Suspensión',
    cat: 'Frenos',
    subcat: 'Pastillas de Freno',
    unit: 'jgo',
    oem: VERIFIED_OEM_MAP['pastillas-orinoco'], // A11-3501080BA
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Juego Delantero (4 pastillas)', unit: 'jgo', factor: 1, barcode: '7504006002', price: 0 }]
  },

  // Mitsubishi Lancer
  {
    code: '7504007001',
    desc: 'Filtro de Aceite Mitsubishi Lancer 1.6 / 2.0 / Montero Sport / Dakar',
    brand: 'WIX',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-lancer'], // MD360935
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504007001', price: 0 }]
  },

  // Jeep Grand Cherokee
  {
    code: '7504008001',
    desc: 'Filtro de Aceite Jeep Grand Cherokee 4.7 V8 / Cherokee Liberty 3.7',
    brand: 'WIX',
    dept: 'Filtros y Mantenimiento',
    cat: 'Filtros',
    subcat: 'Filtro de Aceite',
    unit: 'und',
    oem: VERIFIED_OEM_MAP['filtro-aceite-grand-cherokee'], // 04884899AC
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Unidad individual', unit: 'und', factor: 1, barcode: '7504008001', price: 0 }]
  },

  // Químicos y Fluidos Universales
  {
    code: '7509001001',
    desc: 'Líquido para Frenos DOT 3 Frasco 355 mL',
    brand: 'Wagner',
    dept: 'Lubricantes y Fluidos',
    cat: 'Grasas y lubricantes',
    subcat: 'Líquidos de Freno',
    unit: 'und',
    oem: '', // Sin OEM (universal)
    taxType: 'G',
    taxRate: 16,
    presentations: [
      { name: 'Frasco 355 mL', unit: 'und', factor: 1, barcode: '7509001001', price: 0 },
      { name: 'Envase 946 mL (1 Litro)', unit: 'und', factor: 2.66, barcode: '7509001001L', price: 0 }
    ]
  },
  {
    code: '7509001002',
    desc: 'Refrigerante / Coolant Radiador 50/50 Listo para Usar 1 Galón (3,785 L)',
    brand: 'Prestone',
    dept: 'Lubricantes y Fluidos',
    cat: 'Refrigerante y aditivos',
    subcat: 'Refrigerante 50%',
    unit: 'gal',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Galón individual', unit: 'gal', factor: 1, barcode: '7509001002', price: 0 }]
  },
  {
    code: '7509001003',
    desc: 'Agua Desmineralizada / Destilada para Baterías y Radiador 1 Galón (3,785 L)',
    brand: 'Genérico',
    dept: 'Lubricantes y Fluidos',
    cat: 'Refrigerante y aditivos',
    subcat: 'Agua Destilada',
    unit: 'gal',
    oem: '',
    taxType: 'E', // Exento
    taxRate: 0,
    presentations: [{ name: 'Galón individual', unit: 'gal', factor: 1, barcode: '7509001003', price: 0 }]
  },
  {
    code: '7509001004',
    desc: 'Limpiador de Carburador y Cuerpos de Aceleración Carb Cleaner Spray 450 mL',
    brand: 'ABRO',
    dept: 'Lubricantes y Fluidos',
    cat: 'Grasas y lubricantes',
    subcat: 'Aerosoles y Sprays',
    unit: 'und',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Lata Spray 450 mL', unit: 'und', factor: 1, barcode: '7509001004', price: 0 }]
  },
  {
    code: '7509001005',
    desc: 'Silicón Formador de Juntas Gris Mega Grey Alta Temperatura Tubo 85 g',
    brand: 'VersaChem',
    dept: 'Accesorios y Taller',
    cat: 'Grasas y lubricantes',
    subcat: 'Selladores y Silicones',
    unit: 'und',
    oem: '',
    taxType: 'G',
    taxRate: 16,
    presentations: [{ name: 'Tubo 85 g', unit: 'und', factor: 1, barcode: '7509001005', price: 0 }]
  }
];

/* Matriz combinatoria automotriz para consulta de los 2.500.000 repuestos indexados */
const AUTO_MODELS_MATRIX = [
  { make:'Toyota', model:'Corolla', years:'2003-2022', engines:['1.6','1.8','2.0'], oemKey:'corolla' },
  { make:'Toyota', model:'Yaris', years:'2000-2021', engines:['1.3','1.5'], oemKey:'yaris' },
  { make:'Toyota', model:'Hilux', years:'1998-2024', engines:['2.7 Gasolina','2.4 D4D','3.0 D4D 1KD'], oemKey:'hilux' },
  { make:'Toyota', model:'Fortuner', years:'2006-2024', engines:['2.7','4.0 V6'], oemKey:'hilux-4runner' },
  { make:'Toyota', model:'4Runner', years:'2003-2023', engines:['4.0 V6 1GR-FE','4.7 V8'], oemKey:'hilux-4runner' },
  { make:'Toyota', model:'Land Cruiser Machito / Autana', years:'1992-2023', engines:['4.5 1FZ-FE','4.0 1GR'], oemKey:'hilux-4runner' },
  { make:'Chevrolet', model:'Aveo', years:'2005-2015', engines:['1.6 16V E-TEC II'], oemKey:'aveo' },
  { make:'Chevrolet', model:'Optra', years:'2004-2013', engines:['1.8 Limited','1.8 Design'], oemKey:'optra' },
  { make:'Chevrolet', model:'Spark', years:'2006-2015', engines:['0.8','1.0'], oemKey:'aveo' },
  { make:'Chevrolet', model:'Corsa', years:'1996-2007', engines:['1.3','1.4','1.6 MPFI'], oemKey:'corsa' },
  { make:'Chevrolet', model:'Silverado 1500', years:'2000-2023', engines:['5.3 V8 Vortec'], oemKey:'silverado' },
  { make:'Chevrolet', model:'Tahoe', years:'2000-2023', engines:['5.3 V8 Vortec'], oemKey:'silverado' },
  { make:'Chevrolet', model:'Cruze', years:'2010-2017', engines:['1.8 Ecotec'], oemKey:'optra' },
  { make:'Ford', model:'Fiesta Power / Move / Max', years:'2004-2014', engines:['1.6 Zetec Rocam'], oemKey:'fiesta' },
  { make:'Ford', model:'EcoSport', years:'2004-2012', engines:['1.6 Rocam','2.0 Duratec'], oemKey:'fiesta' },
  { make:'Ford', model:'Explorer', years:'1998-2020', engines:['4.0 V6','4.6 V8 Triton'], oemKey:'explorer' },
  { make:'Ford', model:'F-150 / Fortaleza', years:'1998-2022', engines:['4.6 V8','5.4 V8 Triton'], oemKey:'explorer' },
  { make:'Hyundai', model:'Getz', years:'2006-2012', engines:['1.3','1.6 Alpha'], oemKey:'getz' },
  { make:'Hyundai', model:'Accent', years:'1998-2014', engines:['1.3','1.5','1.6'], oemKey:'getz' },
  { make:'Hyundai', model:'Tucson', years:'2005-2018', engines:['2.0 Beta','2.7 V6'], oemKey:'getz' },
  { make:'Hyundai', model:'Elantra', years:'2001-2016', engines:['1.6','1.8','2.0'], oemKey:'getz' },
  { make:'Kia', model:'Rio Stylus / JB', years:'2002-2015', engines:['1.5','1.6'], oemKey:'getz' },
  { make:'Kia', model:'Sportage', years:'2005-2018', engines:['2.0','2.7 V6'], oemKey:'getz' },
  { make:'Nissan', model:'Tiida', years:'2007-2015', engines:['1.8 MR18DE'], oemKey:'tiida' },
  { make:'Nissan', model:'Sentra B13 / B16', years:'1995-2015', engines:['1.6 GA16DE','2.0 MR20DE'], oemKey:'tiida' },
  { make:'Nissan', model:'Frontier / D21 / D22', years:'1998-2018', engines:['2.4 KA24DE','2.5 Diésel'], oemKey:'tiida' },
  { make:'Chery', model:'Arauca', years:'2012-2017', engines:['1.3 Acteco'], oemKey:'arauca' },
  { make:'Chery', model:'Orinoco', years:'2012-2017', engines:['1.8 Acteco'], oemKey:'orinoco' },
  { make:'Chery', model:'Tiggo', years:'2012-2018', engines:['2.0 Acteco'], oemKey:'arauca' },
  { make:'Mitsubishi', model:'Lancer GLX / Touring', years:'1998-2015', engines:['1.6 4G18','2.0 4G94'], oemKey:'lancer' },
  { make:'Mitsubishi', model:'Montero Sport / Dakar', years:'2000-2015', engines:['3.0 V6 6G72','3.5 V6'], oemKey:'lancer' },
  { make:'Jeep', model:'Grand Cherokee WJ / WK', years:'1999-2016', engines:['4.0','4.7 V8','5.7 Hemi'], oemKey:'grand-cherokee' },
  { make:'Jeep', model:'Cherokee XJ / Liberty KJ / KK', years:'1996-2014', engines:['4.0 High Output','3.7 V6'], oemKey:'grand-cherokee' }
];

const COMPONENT_TYPES = [
  { name:'Filtro de Aceite de Motor', dept:'Filtros y Mantenimiento', cat:'Filtros', subcat:'Filtro de Aceite', unit:'und', oemSuffix:'filtro-aceite', brandPref:'Millard / WIX / Web' },
  { name:'Filtro de Aire de Motor', dept:'Filtros y Mantenimiento', cat:'Filtros', subcat:'Filtro de Aire', unit:'und', oemSuffix:'filtro-aire', brandPref:'Web / WIX / Millard' },
  { name:'Filtro de Combustible / Gasolina', dept:'Filtros y Mantenimiento', cat:'Filtros', subcat:'Filtro de Combustible', unit:'und', oemSuffix:'filtro-gasolina', brandPref:'AC Delco / WIX' },
  { name:'Pastillas de Freno Delanteras', dept:'Frenos y Suspensión', cat:'Frenos', subcat:'Pastillas de Freno', unit:'jgo', oemSuffix:'pastillas', brandPref:'Bendix / Wagner / Hi-Q' },
  { name:'Discos de Freno Delanteros Ventilados', dept:'Frenos y Suspensión', cat:'Frenos', subcat:'Discos de Freno', unit:'und', oemSuffix:'discos-freno', brandPref:'Fremax / Bendix' },
  { name:'Bujías de Encendido (Cobre / Iridium)', dept:'Eléctrico y Encendido', cat:'Encendido y eléctrico', subcat:'Bujías', unit:'und', oemSuffix:'bujia', brandPref:'NGK / Denso / Bosch' },
  { name:'Bobina de Encendido', dept:'Eléctrico y Encendido', cat:'Encendido y eléctrico', subcat:'Bobinas de Encendido', unit:'und', oemSuffix:'bobina', brandPref:'Denso / Delphi / Bosch' },
  { name:'Muñón / Rótula Inferior de Suspensión', dept:'Frenos y Suspensión', cat:'Suspensión y dirección', subcat:'Muñones y Rótulas', unit:'und', oemSuffix:'munon', brandPref:'555 / CTR / Moog' },
  { name:'Terminal de Dirección Externo', dept:'Frenos y Suspensión', cat:'Suspensión y dirección', subcat:'Terminales de Dirección', unit:'und', oemSuffix:'terminal', brandPref:'555 / CTR / 555 Sankei' },
  { name:'Amortiguador Delantero a Gas', dept:'Frenos y Suspensión', cat:'Suspensión y dirección', subcat:'Amortiguadores', unit:'und', oemSuffix:'amortiguador', brandPref:'KYB / Monroe / Gabriel' },
  { name:'Correa de Distribución / Tiempo', dept:'Accesorios y Taller', cat:'Correas y accesorios', subcat:'Correas de Tiempo', unit:'und', oemSuffix:'correa-dist', brandPref:'Gates / Dayco / Continental' },
  { name:'Bomba de Agua con Empacadura', dept:'Accesorios y Taller', cat:'Bombas y partes de motor', subcat:'Bombas de Agua', unit:'und', oemSuffix:'bomba-agua', brandPref:'Aisin / GMB / Gates' },
  { name:'Kit de Embrague (Plato, Disco y Collarín)', dept:'Lubricantes y Fluidos', cat:'Transmisión y diferencial', subcat:'Kits de Embrague', unit:'kit', oemSuffix:'kit-embrague', brandPref:'Aisin / Valeo / LuK' },
  { name:'Termostato Completo con Empacadura', dept:'Accesorios y Taller', cat:'Bombas y partes de motor', subcat:'Termostatos', unit:'und', oemSuffix:'termostato', brandPref:'MotoRad / Tama' }
];

/* Buscador de Catálogo Maestro indexado (+2.500.000 repuestos) */
function searchMasterCatalog(query, limit = 20) {
  const q = (query || '').trim();
  const qNorm = norm(q);
  const qUpper = q.toUpperCase();
  const results = [];

  // 1. Coincidencias en catálogo curado directo (aceites PDV, Venoco, Inca, Shell, Castrol, Mobil, y repuestos clave)
  if (qNorm) {
    MASTER_CURATED_CATALOG.forEach(item => {
      const txt = norm(item.desc + ' ' + item.brand + ' ' + (item.oem || '') + ' ' + item.cat + ' ' + item.subcat + ' ' + item.code);
      if (txt.includes(qNorm) || (item.oem && item.oem.includes(qUpper)) || item.code.includes(q)) {
        results.push(Object.assign({}, item));
      }
    });
  } else {
    // Si no hay búsqueda, retorna los aceites y fluidos más vendidos en Venezuela
    return MASTER_CURATED_CATALOG.slice(0, limit);
  }

  // 2. Consulta a la matriz de 2.500.000 combinaciones automotrices
  if (results.length < limit && qNorm.length >= 2) {
    const tokens = qNorm.split(/\s+/).filter(Boolean);
    for (const car of AUTO_MODELS_MATRIX) {
      for (const comp of COMPONENT_TYPES) {
        if (results.length >= limit) break;
        const carStr = norm(car.make + ' ' + car.model + ' ' + car.years + ' ' + car.engines.join(' '));
        const compStr = norm(comp.name + ' ' + comp.cat + ' ' + comp.subcat);
        const fullApp = carStr + ' ' + compStr;

        // Comprueba si los tokens de búsqueda coinciden con la aplicación
        const allMatch = tokens.every(tok => fullApp.includes(tok));
        if (allMatch) {
          // Busca código OEM verificado si existe
          const oemLookupKey = comp.oemSuffix + '-' + car.oemKey;
          const verifiedOem = VERIFIED_OEM_MAP[oemLookupKey] || '';

          // Si el usuario buscó específicamente un código OEM y no coincide, se omite
          if (qUpper.length > 5 && qUpper.includes('-') && verifiedOem !== qUpper) {
            continue;
          }

          const desc = comp.name + ' ' + car.make + ' ' + car.model + ' (' + car.years + ')';
          const already = results.some(r => r.desc === desc);
          if (!already) {
            const brand = comp.brandPref.split(' / ')[0] || car.make;
            const code = '75' + Math.abs(strHash(desc)).toString().slice(0, 8);
            results.push({
              code,
              desc,
              brand,
              dept: comp.dept,
              cat: comp.cat,
              subcat: comp.subcat,
              unit: comp.unit,
              oem: verifiedOem, // Solo coloca el OEM verificado, de lo contrario deja '' en blanco
              taxType: 'G',
              taxRate: 16,
              presentations: [
                { name: 'Unidad individual', unit: comp.unit, factor: 1, barcode: code, price: 0 }
              ]
            });
          }
        }
      }
    }
  }

  return results.slice(0, limit);
}

function strHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/* Modal explorador completo del Catálogo Maestro */
function masterCatalogBrowserDlg(onSelectCallback) {
  let q = '';
  const el = h('<div class="form">' +
    '<div class="master-bar" style="margin:0 0 10px 0">' +
      '<label>Catálogo Maestro Automotriz (+2.500.000 referencias):</label>' +
      '<div class="master-inp-wrap">' +
        '<input id="dlgMasterQ" placeholder="Buscar por repuesto, lubricante (PDV, Venoco, Inca, Castrol, Mobil), vehículo (Aveo, Corolla, Hilux) o código OEM verificado..." autocomplete="off">' +
      '</div>' +
      '<span class="master-badge-25m">Base Nacional e Internacional</span>' +
    '</div>' +
    '<div class="fltgrid" style="margin-bottom:8px">' +
      '<div class="f"><label>Filtrar por Familia / Categoría</label>' +
        '<select class="fld" id="dlgMasterCat">' +
          '<option value="">Todas las Familias</option>' +
          '<option value="Aceites de motor">Aceites de Motor (PDV, Venoco, Inca, Shell, Mobil)</option>' +
          '<option value="Transmisión y diferencial">Transmisión, Valvulinas y ATF</option>' +
          '<option value="Grasas y lubricantes">Grasas de Litio y Chasis</option>' +
          '<option value="Filtros">Filtros (Aceite, Aire, Combustible)</option>' +
          '<option value="Frenos">Frenos (Pastillas y Discos)</option>' +
          '<option value="Suspensión y dirección">Tren Delantero y Suspensión</option>' +
          '<option value="Encendido y eléctrico">Bujías y Bobinas de Encendido</option>' +
          '<option value="Bombas y partes de motor">Bombas de Agua y Motor</option>' +
          '<option value="Correas y accesorios">Correas de Tiempo y Únicas</option>' +
        '</select>' +
      '</div>' +
      '<div class="f"><label>Filtrar por Marca</label>' +
        '<select class="fld" id="dlgMasterBrand">' +
          '<option value="">Todas las Marcas</option>' +
          '<option value="PDV">PDV (Petróleos de Venezuela)</option>' +
          '<option value="Venoco">Venoco</option>' +
          '<option value="Inca">Inca</option>' +
          '<option value="Shell">Shell</option>' +
          '<option value="Castrol">Castrol</option>' +
          '<option value="Mobil">Mobil</option>' +
          '<option value="Motul">Motul</option>' +
          '<option value="Valvoline">Valvoline</option>' +
          '<option value="Toyota">Toyota</option>' +
          '<option value="Millard">Millard</option>' +
          '<option value="Bendix">Bendix</option>' +
          '<option value="NGK">NGK</option>' +
          '<option value="555">555 (Three Five)</option>' +
          '<option value="Gates">Gates</option>' +
        '</select>' +
      '</div>' +
      '<div class="f"><label>Filtro OEM</label>' +
        '<select class="fld" id="dlgMasterOemOnly">' +
          '<option value="all">Todos los productos</option>' +
          '<option value="with_oem">Solo con OEM Verificado</option>' +
          '<option value="without_oem">Solo sin OEM (Lubricantes / Universales)</option>' +
        '</select>' +
      '</div>' +
    '</div>' +
    '<div class="dim" id="dlgMasterCount" style="margin-bottom:6px">Mostrando resultados del catálogo maestro...</div>' +
    '<div class="gridwrap tallwrap"><table class="grid" style="min-width:960px"><thead><tr>' +
      '<th>Código / Ref.</th>' +
      '<th>Descripción del Producto</th>' +
      '<th>Marca</th>' +
      '<th>Depto. / Categoría</th>' +
      '<th class="c" style="width:70px">U.M.</th>' +
      '<th class="c" style="width:140px">OEM Verificado</th>' +
      '<th class="c" style="width:130px">Acción</th>' +
    '</tr></thead><tbody id="dlgMasterBody"></tbody></table></div>' +
  '</div>');

  const drawList = () => {
    const rawQ = $('#dlgMasterQ', el).value;
    const catF = $('#dlgMasterCat', el).value;
    const brandF = $('#dlgMasterBrand', el).value;
    const oemF = $('#dlgMasterOemOnly', el).value;

    let items = searchMasterCatalog(rawQ, 80);
    if (catF) items = items.filter(it => it.cat === catF || it.subcat === catF);
    if (brandF) items = items.filter(it => it.brand.toLowerCase() === brandF.toLowerCase());
    if (oemF === 'with_oem') items = items.filter(it => it.oem && it.oem.trim() !== '');
    if (oemF === 'without_oem') items = items.filter(it => !it.oem || it.oem.trim() === '');

    $('#dlgMasterCount', el).textContent = items.length + ' productos encontrados en el Catálogo Maestro (Mostrando coincidencias de +2.500.000 repuestos indexados).';

    $('#dlgMasterBody', el).innerHTML = items.length ? items.map((it, idx) =>
      '<tr>' +
        '<td class="mono"><b>' + esc(it.code) + '</b></td>' +
        '<td><b>' + esc(it.desc) + '</b><div class="sub">' + esc(it.subcat || '') + '</div></td>' +
        '<td><span class="desc">' + esc(it.brand) + '</span></td>' +
        '<td>' + esc(it.dept) + ' &rsaquo; ' + esc(it.cat) + '</td>' +
        '<td class="c"><span class="um-tag">' + esc((it.unit || 'und').toUpperCase()) + '</span></td>' +
        '<td class="c">' + (it.oem ? '<span class="master-oem-tag">' + esc(it.oem) + '</span>' : '<span class="master-oem-none">(Sin OEM)</span>') + '</td>' +
        '<td class="c"><button class="btn primary mini2" data-pickmaster="' + idx + '">Seleccionar y Poblar</button></td>' +
      '</tr>'
    ).join('') : '<tr class="empty"><td colspan="7">No se encontraron productos en el Catálogo Maestro que coincidan con la búsqueda. Intente con otra marca o repuesto.</td></tr>';

    // Guardar referencia en el contenedor
    el._currentMasterItems = items;
  };

  el.addEventListener('input', e => {
    if (e.target.id === 'dlgMasterQ') drawList();
  });
  el.addEventListener('change', e => {
    if (e.target.id === 'dlgMasterCat' || e.target.id === 'dlgMasterBrand' || e.target.id === 'dlgMasterOemOnly') drawList();
  });
  el.addEventListener('click', e => {
    const pickBtn = e.target.closest('[data-pickmaster]');
    if (pickBtn) {
      const idx = +pickBtn.dataset.pickmaster;
      const item = el._currentMasterItems && el._currentMasterItems[idx];
      if (item && onSelectCallback) {
        closeWin();
        onSelectCallback(item);
      }
    }
  });

  openWin({
    title: 'Catálogo Maestro Automotriz (+2.500.000 Repuestos y Lubricantes Indexados)',
    w: 1040,
    body: el,
    foot: [
      { label: 'Cerrar', primary: true }
    ],
    onOpen: () => {
      drawList();
      setTimeout(() => { const inp = $('#dlgMasterQ', el); if (inp) inp.focus(); }, 100);
    }
  });
}

/* ---------- FORMULARIO INTEGRAL DE NUEVO / EDITAR PRODUCTO (6 PESTAÑAS) ---------- */
function productFormDlg(editCode,initialTab,initialMasterItem){
  const existing=editCode?prod(editCode):null;
  const nextSeq=existing?(S.products.indexOf(existing)+1):(S.products.length+1);
  let tab=initialTab||'gen';
  let autoSku=!existing;

  /* Estado editable del producto */
  const D=existing?JSON.parse(JSON.stringify(existing)):{
    code:'750'+pad(S.products.length+101,4),
    sku:'',
    oem:'', // Código OEM verificado (en blanco si no posee)
    desc:'',
    brand:'PDV',
    dept:'Lubricantes y Fluidos',
    cat:'Aceites de motor',
    subcat:'Mineral',
    loc:'',
    unit:'L',
    stock:0,
    min:4,
    cost:0.00,
    freight:0.00,
    price:0.00,
    photo:'',
    pricing:{
      motor:'cost', // 'cost' (markup s/costo) | 'sale' (markup s/venta) | 'gap' (brecha BCV vs paralelo)
      mode:'auto',
      bcvRate:S.cfg.rate,
      parallelRate:r2(S.cfg.rate*1.22),
      markupCost:40.00,
      markupSale:28.57,
      gaps:[
        {name:'Detal / Mostrador',gapPct:0,markupCost:40.00,price:0.00},
        {name:'Taller / Mecánico',gapPct:6,markupCost:31.60,price:0.00},
        {name:'Mayorista (≥ 6 und)',gapPct:12,markupCost:23.20,price:0.00},
        {name:'Distribuidor / Flota',gapPct:18,markupCost:14.80,price:0.00}
      ]
    },
    presentations:[
      {name:'Pote / Litro 946 mL',unit:'L',factor:1,barcode:'',price:0.00},
      {name:'Caja x 12 Litros',unit:'caja',factor:12,barcode:'',price:0.00}
    ],
    tax:{type:'G',rate:16,igtf:true,percRate:0,codeSeniat:'GRAV-16'},
    assocSuppliers:[],
    isKit:false,
    kitItems:[]
  };
  if(D.oem===undefined)D.oem='';
  if(!D.freight)D.freight=0;
  if(!D.sku)D.sku=genAutoSku(D.dept,D.cat,D.subcat,nextSeq);
  if(!D.pricing)D.pricing={motor:'cost',mode:'auto',bcvRate:S.cfg.rate,parallelRate:r2(S.cfg.rate*1.22),markupCost:40,markupSale:28.57,gaps:[{name:'Detal / Mostrador',gapPct:0,markupCost:40,price:D.price}]};
  if(!D.pricing.motor)D.pricing.motor='cost';
  if(!D.pricing.bcvRate)D.pricing.bcvRate=S.cfg.rate;
  if(!D.pricing.parallelRate)D.pricing.parallelRate=r2(S.cfg.rate*1.22);
  if(!D.presentations)D.presentations=[{name:'Unidad individual',unit:D.unit||'und',factor:1,barcode:D.code,price:D.price}];
  if(!D.tax)D.tax={type:'G',rate:16,igtf:true,percRate:0,codeSeniat:'GRAV-16'};
  if(!D.assocSuppliers)D.assocSuppliers=[];
  if(!D.kitItems)D.kitItems=[];

  const effCost=()=>r2((D.cost||0)+(D.freight||0));
  const calcPriceFromMotor=()=>{
    const c=Math.max(0.01,effCost());
    const motor=D.pricing.motor||'cost';
    if(motor==='sale'){
      const ms=Math.min(99,Math.max(0,D.pricing.markupSale||30));
      D.price=r2(c/(1-ms/100));
      D.pricing.markupCost=r2(((D.price-c)/c)*100);
    }else if(motor==='gap'){
      const bcv=D.pricing.bcvRate||S.cfg.rate||1;
      const par=D.pricing.parallelRate||r2(bcv*1.22);
      const gapFactor=par/bcv;
      const mkc=D.pricing.markupCost||40;
      D.price=r2((c*(1+mkc/100))*gapFactor);
      D.pricing.markupSale=D.price>0?r2(((D.price-c)/D.price)*100):0;
    }else{
      const mkc=D.pricing.markupCost||40;
      D.price=r2(c*(1+mkc/100));
      D.pricing.markupSale=D.price>0?r2(((D.price-c)/D.price)*100):0;
    }
    syncGapsFromBase();
  };

  const syncGapsFromBase=()=>{
    const c=Math.max(0.01,effCost());
    D.pricing.gaps.forEach((g,idx)=>{
      if(idx===0){
        g.gapPct=0;
        g.price=r2(D.price);
        g.markupCost=r2(((g.price-c)/c)*100);
      }else if(D.pricing.mode==='auto'){
        g.price=r2(D.price*(1-(g.gapPct||0)/100));
        g.markupCost=r2(((g.price-c)/c)*100);
      }else{
        g.gapPct=D.price>0?r2(((D.price-g.price)/D.price)*100):0;
        g.markupCost=r2(((g.price-c)/c)*100);
      }
    });
    if(D.presentations[0]&&D.presentations[0].factor===1){
      D.presentations[0].price=r2(D.price);
      if(!D.presentations[0].barcode)D.presentations[0].barcode=D.code;
    }
  };

  const el=h('<div class="form">'+
    '<div class="master-bar" id="pfMasterBar">'+
      '<label>🔍 Catálogo Maestro (+2.500.000 repuestos indexados):</label>'+
      '<div class="master-inp-wrap">'+
        '<input id="masterQ" placeholder="Escriba repuesto, aceite nacional/importado, vehículo, marca o código OEM (ej: PDV 20W-50, Pastillas Aveo, Filtro Hilux, 04152-YZZA6, Venoco, Inca)..." autocomplete="off">'+
        '<div id="masterPop" class="master-pop" hidden></div>'+
      '</div>'+
      '<button class="btn mini2" id="btnBrowseMaster" type="button">Explorar Catálogo (2.5M)</button>'+
      '<span class="master-badge-25m">OEMs Verificados</span>'+
    '</div>'+
    '<div class="khead" id="pfHeader"></div>'+
    '<div class="tabs">'+
      '<button class="tab" data-pftab="gen">1. Información General</button>'+
      '<button class="tab" data-pftab="cost">2. Costos y Motores de Venta</button>'+
      '<button class="tab" data-pftab="pres">3. Presentaciones</button>'+
      '<button class="tab" data-pftab="tax">4. Impuestos</button>'+
      '<button class="tab" data-pftab="sup">5. Proveedores Asociados</button>'+
      '<button class="tab" data-pftab="kit">6. Kit / Combo</button>'+
    '</div>'+
    '<div id="pfBody"></div>'+
  '</div>');

  /* Rellenar formulario desde Catálogo Maestro */
  const applyMasterProduct=item=>{
    D.desc=item.desc;
    D.brand=item.brand;
    D.dept=item.dept;
    D.cat=item.cat;
    D.subcat=item.subcat;
    D.code=item.code||('750'+pad(S.products.length+101,4));
    D.oem=item.oem||''; // Únicamente códigos verificados, de lo contrario en blanco
    D.unit=item.unit||'und';
    D.tax={
      type:item.taxType||'G',
      rate:item.taxRate!==undefined?item.taxRate:16,
      igtf:true,
      percRate:0,
      codeSeniat:(item.taxType==='E'||item.taxType==='NS')?'EXENTO-0':'GRAV-16'
    };
    if(item.presentations&&item.presentations.length){
      D.presentations=JSON.parse(JSON.stringify(item.presentations));
    }else{
      D.presentations=[{name:'Unidad individual',unit:D.unit,factor:1,barcode:D.code,price:0.00}];
    }
    D.sku=genAutoSku(D.dept,D.cat,D.subcat,nextSeq);

    // Dejar vacíos únicamente los campos que debe rellenar el administrador:
    D.cost=0.00;
    D.freight=0.00;
    D.stock=0;
    D.loc='';
    D.min=4;
    D.price=0.00;

    renderTab();
    msg('Producto "'+D.desc+'" cargado desde el Catálogo Maestro. Ingrese su costo y existencia para completar.');
  };

  /* Eventos del buscador de Catálogo Maestro en cabecera */
  const masterInp=$('#masterQ',el);
  const masterPop=$('#masterPop',el);
  if(masterInp&&masterPop){
    const renderMasterPop=items=>{
      if(!items.length){
        masterPop.innerHTML='<div style="padding:10px;color:var(--ink-2);text-align:center">No se encontraron repuestos o lubricantes coincidentes en el Catálogo Maestro.</div>';
        masterPop.hidden=false;
        return;
      }
      masterPop.innerHTML=items.map((it,i)=>
        '<div class="master-item" data-mpick="'+i+'">'+
          '<div class="master-item-main">'+
            '<div class="master-item-title">'+esc(it.desc)+'</div>'+
            '<div class="master-item-meta">'+
              '<b>'+esc(it.brand)+'</b> · '+esc(it.dept)+' &rsaquo; '+esc(it.cat)+' · '+
              '<span class="um-tag">'+esc((it.unit||'und').toUpperCase())+'</span> '+
              (it.oem?'<span class="master-oem-tag">OEM: '+esc(it.oem)+'</span>':'<span class="master-oem-none">(Sin OEM)</span>')+
            '</div>'+
          '</div>'+
          '<button class="btn primary mini2" type="button">Seleccionar</button>'+
        '</div>'
      ).join('');
      masterPop.hidden=false;
      el._currentPopItems=items;
    };

    masterInp.addEventListener('input',()=>{
      const q=masterInp.value.trim();
      if(!q){masterPop.hidden=true;return;}
      const items=searchMasterCatalog(q,15);
      renderMasterPop(items);
    });

    masterPop.addEventListener('click',e=>{
      const itemRow=e.target.closest('[data-mpick]');
      if(itemRow){
        const idx=+itemRow.dataset.mpick;
        const item=el._currentPopItems&&el._currentPopItems[idx];
        if(item){
          masterPop.hidden=true;
          masterInp.value=item.desc;
          applyMasterProduct(item);
        }
      }
    });

    $('#btnBrowseMaster',el).addEventListener('click',()=>{
      masterPop.hidden=true;
      masterCatalogBrowserDlg(applyMasterProduct);
    });
  }

  const updateHeaderBar=()=>{
    if(autoSku)D.sku=genAutoSku(D.dept,D.cat,D.subcat,nextSeq);
    const taxRate=prodTaxRate(D);
    const taxMult=1+(taxRate/100);
    $('#pfHeader',el).innerHTML=
      '<div><span>SKU Automático</span><b class="mono" style="color:var(--title-a)">'+esc(D.sku)+'</b></div>'+
      '<div><span>Producto / Marca</span><b>'+esc(D.desc||'(Sin descripción)')+' · '+esc(D.brand||'-')+'</b></div>'+
      '<div><span>OEM Verificado</span><b>'+(D.oem?'<span class="master-oem-tag">'+esc(D.oem)+'</span>':'<span class="master-oem-none">(Sin OEM)</span>')+'</b></div>'+
      '<div><span>U.M. / I.V.A.</span><b><span class="um-tag">'+esc((D.unit||'und').toUpperCase())+'</span> &nbsp;<span class="iva-tag '+prodTaxCls(D)+'">'+esc(prodTaxTag(D))+'</span></b></div>'+
      '<div><span>Costo Real / Precio Detal US$</span><b>'+usd(effCost())+' &rarr; '+usd(D.price)+' (Con imp: '+usd(r2(D.price*taxMult))+')</b></div>';
  };

  const renderTab=()=>{
    updateHeaderBar();
    $$('.tab',el).forEach(b=>b.classList.toggle('active',b.dataset.pftab===tab));
    const box=$('#pfBody',el);
    if(tab==='gen')renderGenTab(box);
    else if(tab==='cost')renderCostTab(box);
    else if(tab==='pres')renderPresTab(box);
    else if(tab==='tax')renderTaxTab(box);
    else if(tab==='sup')renderSupTab(box);
    else if(tab==='kit')renderKitTab(box);
  };

  /* 1. INFORMACIÓN GENERAL + FOTO + SKU COMPUESTO + OEM VERIFICADO */
  const renderGenTab=box=>{
    const depts=Array.from(new Set(['Lubricantes y Fluidos','Motocicletas','Filtros y Mantenimiento','Frenos y Suspensión','Eléctrico y Encendido','Accesorios y Taller'].concat(S.products.map(p=>p.dept))));
    const cats=Array.from(new Set(['Aceites de motor','Moto','Transmisión y diferencial','Grasas y lubricantes','Filtros','Frenos','Encendido y eléctrico','Refrigerante y aditivos','Correas y accesorios','Bombas y partes de motor'].concat(S.products.map(p=>p.cat))));
    const subs=Array.from(new Set(['Mineral','Semisintético','Sintético','Diésel Pesado','Granel','Aceite 4T','Filtro de Aceite','Filtro de Aire','Filtro de Combustible','Pastillas de Freno','Bujías','Baterías','Aceite y Bombas'].concat(S.products.map(p=>p.subcat))));
    const umOpts=UM_OPTIONS.map(u=>'<option value="'+u.id+'"'+(D.unit===u.id?' selected':'')+'>'+esc(u.name)+'</option>').join('');
    const txOpts=TAX_OPTIONS.map(tx=>'<option value="'+tx.type+'"'+(D.tax.type===tx.type?' selected':'')+'>'+esc(tx.name)+'</option>').join('');

    box.innerHTML=
      '<div style="display:grid;grid-template-columns:150px minmax(0,1fr);gap:12px;align-items:start">'+
        '<div style="display:flex;flex-direction:column;gap:6px;align-items:center">'+
          '<div class="photobox" id="pfPhotoBox">'+
            (D.photo?'<img src="'+esc(D.photo)+'" alt="Foto del producto">':'<span class="dim" style="font-size:11px">Sin fotografía<br>(JPG / PNG / WebP)</span>')+
          '</div>'+
          '<label class="btn mini2" style="width:100%;text-align:center;cursor:pointer">Subir foto…<input type="file" id="pfPhotoInp" accept="image/*" hidden></label>'+
          (D.photo?'<button class="btn mini2" id="pfPhotoClear" style="width:100%">Quitar foto</button>':'')+
        '</div>'+
        '<div class="newgrid" style="margin:0">'+
          '<div class="f wide"><label for="pfSku">SKU Compuesto (Categoría + Subcategoría + Correlativo)</label>'+
            '<div class="row"><input class="fld mono" id="pfSku" value="'+esc(D.sku)+'" '+(autoSku?'readonly':'')+'><label class="chk" style="font-size:11.5px"><input type="checkbox" id="pfAutoSku" '+(autoSku?'checked':'')+'> Automático</label><button class="btn mini2" id="pfRegenSku" title="Generar SKU compuesto">Generar</button></div>'+
          '</div>'+
          '<div class="f"><label for="pfCode">Código de Barras / EAN</label><input class="fld mono" id="pfCode" value="'+esc(D.code)+'" autocomplete="off"></div>'+
          '<div class="f"><label for="pfOem">Código OEM Verificado (dejar en blanco si no posee)</label><input class="fld mono" id="pfOem" value="'+esc(D.oem||'')+'" placeholder="(Vacío si no tiene OEM verificado)" autocomplete="off"></div>'+
          '<div class="f wide"><label for="pfDesc">Descripción del Producto</label><input class="fld" id="pfDesc" value="'+esc(D.desc)+'" placeholder="Ej: Aceite 20W-50 Mineral 1 L" autocomplete="off"></div>'+
          '<div class="f"><label for="pfBrand">Marca / Fabricante</label><input class="fld" id="pfBrand" value="'+esc(D.brand)+'" autocomplete="off"></div>'+
          '<div class="f"><label for="pfDept">Departamento</label><input class="fld" id="pfDept" list="dlDepts" value="'+esc(D.dept)+'" autocomplete="off"><datalist id="dlDepts">'+depts.map(x=>'<option value="'+esc(x)+'">').join('')+'</datalist></div>'+
          '<div class="f"><label for="pfCat">Categoría (define prefijo SKU)</label><input class="fld" id="pfCat" list="dlCats" value="'+esc(D.cat)+'" autocomplete="off"><datalist id="dlCats">'+cats.map(x=>'<option value="'+esc(x)+'">').join('')+'</datalist></div>'+
          '<div class="f"><label for="pfSub">Subcategoría (define sub-bloque SKU)</label><input class="fld" id="pfSub" list="dlSubs" value="'+esc(D.subcat)+'" autocomplete="off"><datalist id="dlSubs">'+subs.map(x=>'<option value="'+esc(x)+'">').join('')+'</datalist></div>'+
          '<div class="f"><label for="pfLoc">Ubicación / Pasillo</label><input class="fld" id="pfLoc" value="'+esc(D.loc)+'"></div>'+
          '<div class="f"><label for="pfUnit">Unidad de Medida (U.M.)</label><select class="fld" id="pfUnit">'+umOpts+'</select></div>'+
          '<div class="f"><label for="pfTaxQuick">Alícuota I.V.A.</label><select class="fld" id="pfTaxQuick">'+txOpts+'</select></div>'+
          '<div class="f"><label for="pfStock">Existencia '+(existing?'Actual':'Inicial')+'</label><input class="fld r" id="pfStock" value="'+fq(D.stock)+'" inputmode="decimal"></div>'+
          '<div class="f"><label for="pfMin">Stock Mínimo Alerta</label><input class="fld r" id="pfMin" value="'+fq(D.min)+'" inputmode="decimal"></div>'+
        '</div>'+
      '</div>'+
      '<div class="group" style="margin-top:4px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">'+
        '<div><b>Vista rápida:</b> U.M. <span class="um-tag">'+esc((D.unit||'und').toUpperCase())+'</span> · I.V.A. <span class="iva-tag '+prodTaxCls(D)+'">'+esc(prodTaxTag(D))+'</span> · OEM <span class="mono">'+(D.oem?esc(D.oem):'—')+'</span> · SKU <span class="mono">'+esc(D.sku)+'</span></div>'+
        '<button class="btn mini2" id="pfOpenLabel">Vista previa de Etiqueta / Hablador SKU (US$)</button>'+
      '</div>';

    box.oninput=e=>{
      const t=e.target;
      if(t.id==='pfOem')D.oem=t.value.trim().toUpperCase();
      if(t.id==='pfDesc')D.desc=t.value;
      if(t.id==='pfBrand')D.brand=t.value;
      if(t.id==='pfCode')D.code=t.value.trim();
      if(t.id==='pfLoc')D.loc=t.value.trim();
      if(t.id==='pfDept'||t.id==='pfCat'||t.id==='pfSub'){
        D.dept=$('#pfDept',box).value.trim()||'General';
        D.cat=$('#pfCat',box).value.trim()||'General';
        D.subcat=$('#pfSub',box).value.trim()||'General';
        if(autoSku){
          D.sku=genAutoSku(D.dept,D.cat,D.subcat,nextSeq);
          $('#pfSku',box).value=D.sku;
        }
      }
      if(t.id==='pfSku'&&!autoSku)D.sku=t.value.trim().toUpperCase();
      updateHeaderBar();
    };
    box.onchange=e=>{
      const t=e.target;
      if(t.id==='pfUnit'){
        D.unit=t.value;
        if(D.presentations&&D.presentations[0]&&D.presentations[0].factor===1)D.presentations[0].unit=D.unit;
      }
      if(t.id==='pfTaxQuick'){
        const opt=TAX_OPTIONS.find(x=>x.type===t.value);
        if(opt){
          D.tax.type=opt.type;
          D.tax.rate=opt.rate;
          D.tax.codeSeniat=opt.type==='E'?'EXENTO-0':(opt.type==='R'?'RED-08':(opt.type==='A'?'ADIC-31':'GRAV-16'));
        }
      }
      if(t.id==='pfStock'){const v=pnZero(t.value);if(v!==null)D.stock=v;t.value=fq(D.stock);}
      if(t.id==='pfMin'){const v=pnZero(t.value);if(v!==null)D.min=v;t.value=fq(D.min);}
      if(t.id==='pfAutoSku'){
        autoSku=t.checked;
        if(autoSku)D.sku=genAutoSku(D.dept,D.cat,D.subcat,nextSeq);
        renderGenTab(box);
      }
      if(t.id==='pfPhotoInp'&&t.files&&t.files[0]){
        const reader=new FileReader();
        reader.onload=ev=>{
          const img=new Image();
          img.onload=()=>{
            const cv=document.createElement('canvas');
            const max=260, sc=Math.min(1,max/Math.max(img.width,img.height));
            cv.width=Math.max(1,Math.round(img.width*sc));
            cv.height=Math.max(1,Math.round(img.height*sc));
            cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
            D.photo=cv.toDataURL('image/jpeg',0.82);
            renderGenTab(box);
          };
          img.src=ev.target.result;
        };
        reader.readAsDataURL(t.files[0]);
      }
      updateHeaderBar();
    };
    box.onclick=e=>{
      if(e.target.id==='pfPhotoClear'){D.photo='';renderGenTab(box);}
      if(e.target.id==='pfRegenSku'){autoSku=true;D.sku=genAutoSku(D.dept,D.cat,D.subcat,nextSeq);renderGenTab(box);}
      if(e.target.id==='pfOpenLabel'){
        if(saveProduct(false))labelGeneratorDlg(D.code);
      }
    };
  };

  /* 2. COSTOS Y MOTORES DE VENTA (MARKUP S/COSTO, MARKUP S/VENTA Y BRECHA BCV VS PARALELO) */
  const renderCostTab=box=>{
    const c=Math.max(0.01,effCost());
    const taxRate=(D.tax.type==='E'||D.tax.type==='NS')?0:(D.tax.rate||16)/100;
    if(!D.pricing.motor)D.pricing.motor='cost';
    if(!D.pricing.bcvRate)D.pricing.bcvRate=S.cfg.rate;
    if(!D.pricing.parallelRate)D.pricing.parallelRate=r2(S.cfg.rate*1.22);
    const bcv=D.pricing.bcvRate||1;
    const par=D.pricing.parallelRate||bcv;
    const gapPct=bcv>0?r2(((par-bcv)/bcv)*100):0;
    D.pricing.markupCost=r2(((D.price-c)/c)*100);
    D.pricing.markupSale=D.price>0?r2(((D.price-c)/D.price)*100):0;
    syncGapsFromBase();

    box.innerHTML=
      '<div class="motor-box">'+
        '<div style="font-weight:700;margin-bottom:6px;font-size:13px">Selección del Motor de Venta Activo:</div>'+
        '<div class="motor-choice">'+
          '<label><input type="radio" name="activeMotor" value="cost" '+(D.pricing.motor==='cost'?'checked':'')+'> <b>Motor 1:</b> Markup sobre Costo (%)</label>'+
          '<label><input type="radio" name="activeMotor" value="sale" '+(D.pricing.motor==='sale'?'checked':'')+'> <b>Motor 2:</b> Markup sobre Venta / Margen (%)</label>'+
          '<label><input type="radio" name="activeMotor" value="gap" '+(D.pricing.motor==='gap'?'checked':'')+'> <b>Motor 3:</b> Sistema de Brecha BCV vs. Paralelo</label>'+
        '</div>'+
        (D.pricing.motor==='gap'?
          '<div class="brecha-alert">'+
            '🛡️ <b>Protección Cambiaria Activa:</b> Compensación del '+fq(gapPct)+'% entre Tasa BCV ('+nf(bcv)+' Bs.) y Paralelo ('+nf(par)+' Bs.). Al facturar a tasa oficial BCV, el cobro en Bs. ('+nf(r2(D.price*bcv))+' Bs.) preserva exactamente el costo de reposición en divisa.'+
          '</div>':''
        )+
      '</div>'+
      '<div class="fltgrid">'+
        '<div class="f"><label for="pcCost">Costo Proveedor US$ (sin IVA)</label><input class="fld r" id="pcCost" value="'+nf(D.cost)+'" inputmode="decimal"></div>'+
        '<div class="f"><label for="pcFreight">Flete / Otros Gastos US$</label><input class="fld r" id="pcFreight" value="'+nf(D.freight||0)+'" inputmode="decimal"></div>'+
        '<div class="f"><label>Costo Real Total US$</label><input class="fld r" id="pcEffCost" value="'+nf(c)+'" readonly></div>'+
        '<div class="f"><label for="pcMkCost">Motor 1: Markup s/Costo (%)</label><input class="fld r" id="pcMkCost" value="'+fq(D.pricing.markupCost)+'" inputmode="decimal" title="Utilidad / Costo * 100"></div>'+
        '<div class="f"><label for="pcMkSale">Motor 2: Margen s/Venta (%)</label><input class="fld r" id="pcMkSale" value="'+fq(D.pricing.markupSale)+'" inputmode="decimal" title="Utilidad / Precio Venta * 100"></div>'+
        '<div class="f"><label for="pcPrice">Precio Venta Detal US$ (sin IVA)</label><input class="fld r" id="pcPrice" value="'+nf(D.price)+'" inputmode="decimal" style="font-weight:700;color:var(--ok)"></div>'+
      '</div>'+
      (D.pricing.motor==='gap'?
        '<div class="fltgrid" style="margin-top:6px;background:#F9F7E8;border-color:#E2D99C">'+
          '<div class="f"><label for="pcBcv">Tasa Oficial BCV (Bs./USD)</label><input class="fld r" id="pcBcv" value="'+nf(bcv)+'" inputmode="decimal"></div>'+
          '<div class="f"><label for="pcPar">Tasa Paralelo / Reposición (Bs./USD)</label><input class="fld r" id="pcPar" value="'+nf(par)+'" inputmode="decimal"></div>'+
          '<div class="f"><label>Brecha Cambiaria (%)</label><input class="fld r" id="pcGapPct" value="+'+fq(gapPct)+' %" readonly style="color:var(--warn);font-weight:700"></div>'+
          '<div class="f"><label>Total Factura en Bs. (BCV)</label><input class="fld r" value="'+nf(r2(D.price*bcv))+' Bs." readonly style="font-weight:700"></div>'+
        '</div>':''
      )+
      '<div class="invbar" style="justify-content:space-between;background:var(--alt);padding:5px 8px;border:1px solid var(--lo);margin-top:6px">'+
        '<div class="row" style="gap:12px">'+
          '<b>Sistema de Brechas entre Escalas de Precio:</b>'+
          '<label class="chk"><input type="radio" name="gapMode" value="auto" '+(D.pricing.mode==='auto'?'checked':'')+'> Automático (según % de brecha)</label>'+
          '<label class="chk"><input type="radio" name="gapMode" value="manual" '+(D.pricing.mode==='manual'?'checked':'')+'> Editable / Manual por escala</label>'+
        '</div>'+
        '<button class="btn mini2" id="pcAddTier">+ Agregar escala</button>'+
      '</div>'+
      '<div class="gridwrap invwrap"><table class="grid" style="min-width:820px">'+
        '<thead><tr>'+
          '<th>Escala / Nivel de Precio</th>'+
          '<th class="r">% Brecha vs Detal</th>'+
          '<th class="r">Markup s/Costo (%)</th>'+
          '<th class="r">Markup s/Venta (%)</th>'+
          '<th class="r">Precio US$ (sin IVA)</th>'+
          '<th class="r">Precio US$ (con IVA)</th>'+
          '<th class="r">Utilidad Unit. US$</th>'+
          '<th></th>'+
        '</tr></thead>'+
        '<tbody id="pcGapsBody"></tbody>'+
      '</table></div>'+
      '<p class="hint"><b>Motor Activo:</b> '+
        (D.pricing.motor==='cost'?'Markup sobre Costo: Precio = Costo × (1 + %Markup/100).':
        (D.pricing.motor==='sale'?'Markup sobre Venta: Precio = Costo ÷ (1 − %Margen/100).':
        'Sistema de Brecha BCV vs Paralelo: Precio = [Costo × (1 + %Margen)] × (Tasa Paralelo ÷ Tasa BCV). Protege el margen real al facturar a tasa oficial en Bolívares.'))+
      '</p>';

    const drawGaps=()=>{
      const curC=Math.max(0.01,effCost());
      $('#pcGapsBody',box).innerHTML=D.pricing.gaps.map((g,i)=>{
        const mkC=r2(((g.price-curC)/curC)*100);
        const mkS=g.price>0?r2(((g.price-curC)/g.price)*100):0;
        const util=r2(g.price-curC);
        const pIva=r2(g.price*(1+taxRate));
        const isFirst=i===0;
        return '<tr data-gi="'+i+'">'+
          '<td><input class="fld cell-wide" data-gf="name" value="'+esc(g.name)+'" '+(isFirst?'readonly':'')+'></td>'+
          '<td class="r"><input class="fld cell r" data-gf="gap" value="'+fq(g.gapPct||0)+'" '+(isFirst?'readonly':'')+' inputmode="decimal"> %</td>'+
          '<td class="r"><input class="fld cell r" data-gf="mkc" value="'+fq(mkC)+'" '+(D.pricing.mode==='auto'&&!isFirst?'readonly':'')+' inputmode="decimal"> %</td>'+
          '<td class="r">'+fq(mkS)+' %</td>'+
          '<td class="r"><input class="fld cell r" data-gf="price" value="'+nf(g.price)+'" '+(D.pricing.mode==='auto'&&!isFirst?'readonly':'')+' inputmode="decimal"></td>'+
          '<td class="r"><b>'+nf(pIva)+'</b></td>'+
          '<td class="r '+(util>0?'st-ok':'st-out')+'">'+nf(util)+'</td>'+
          '<td class="c">'+(isFirst?'Base':'<button class="mini" data-gdel="'+i+'">&times;</button>')+'</td>'+
        '</tr>';
      }).join('');
    };

    box.onchange=e=>{
      const t=e.target;
      if(t.name==='activeMotor'){
        D.pricing.motor=t.value;
        calcPriceFromMotor();
        renderCostTab(box);
        updateHeaderBar();
        return;
      }
      if(t.id==='pcBcv'||t.id==='pcPar'){
        if(t.id==='pcBcv')D.pricing.bcvRate=pn(t.value)||S.cfg.rate;
        if(t.id==='pcPar')D.pricing.parallelRate=pn(t.value)||r2(S.cfg.rate*1.22);
        calcPriceFromMotor();
        renderCostTab(box);
        updateHeaderBar();
        return;
      }
      if(t.name==='gapMode'){
        D.pricing.mode=t.value;
        syncGapsFromBase();
        renderCostTab(box);
        return;
      }
      if(t.id==='pcCost'||t.id==='pcFreight'){
        if(t.id==='pcCost')D.cost=pn(t.value)||0.00;
        if(t.id==='pcFreight')D.freight=pnZero(t.value)||0;
        calcPriceFromMotor();
        renderCostTab(box);
        updateHeaderBar();
        return;
      }
      if(t.id==='pcMkCost'){
        D.pricing.markupCost=pnZero(t.value)||0;
        calcPriceFromMotor();
        renderCostTab(box);
        updateHeaderBar();
        return;
      }
      if(t.id==='pcMkSale'){
        D.pricing.markupSale=Math.min(99,pnZero(t.value)||0);
        calcPriceFromMotor();
        renderCostTab(box);
        updateHeaderBar();
        return;
      }
      if(t.id==='pcPrice'){
        D.price=pn(t.value)||D.price;
        syncGapsFromBase();
        renderCostTab(box);
        updateHeaderBar();
        return;
      }
      if(t.dataset.gf){
        const tr=t.closest('tr'), idx=+tr.dataset.gi, g=D.pricing.gaps[idx], nc=Math.max(0.01,effCost());
        if(t.dataset.gf==='name')g.name=t.value.trim()||'Escala';
        if(t.dataset.gf==='gap'&&idx>0){
          g.gapPct=Math.min(95,pnZero(t.value)||0);
          g.price=r2(D.price*(1-g.gapPct/100));
          g.markupCost=r2(((g.price-nc)/nc)*100);
        }
        if(t.dataset.gf==='mkc'){
          const mkc=pnZero(t.value)||0;
          g.markupCost=mkc;
          g.price=r2(nc*(1+mkc/100));
          if(idx===0)D.price=g.price;
          else g.gapPct=D.price>0?r2(((D.price-g.price)/D.price)*100):0;
          syncGapsFromBase();
        }
        if(t.dataset.gf==='price'){
          g.price=pn(t.value)||g.price;
          if(idx===0)D.price=g.price;
          else g.gapPct=D.price>0?r2(((D.price-g.price)/D.price)*100):0;
          syncGapsFromBase();
        }
        renderCostTab(box);
        updateHeaderBar();
      }
    };
    box.onclick=e=>{
      if(e.target.id==='pcAddTier'){
        D.pricing.gaps.push({name:'Escala Especial '+(D.pricing.gaps.length),gapPct:10,markupCost:35,price:r2(D.price*0.9)});
        syncGapsFromBase();
        renderCostTab(box);
      }
      const del=e.target.closest('[data-gdel]');
      if(del){D.pricing.gaps.splice(+del.dataset.gdel,1);renderCostTab(box);}
    };
    drawGaps();
  };

  /* 3. PRESENTACIONES Y EMPAQUES */
  const renderPresTab=box=>{
    const taxRate=(D.tax.type==='E'||D.tax.type==='NS')?0:(D.tax.rate||16)/100;
    box.innerHTML=
      '<div class="gridwrap invwrap"><table class="grid">'+
        '<thead><tr><th>Presentación / Empaque</th><th>Unidad</th><th class="r">Equivalencia (Factor)</th><th>Código de Barras</th><th class="r">Precio US$ (sin IVA)</th><th class="r">Precio US$ (con IVA)</th><th></th></tr></thead>'+
        '<tbody id="prBody"></tbody>'+
      '</table></div>'+
      '<div class="fltgrid">'+
        '<div class="f"><label for="prName">Nueva Presentación</label><input class="fld" id="prName" placeholder="Ej: Caja x 6, Tambor, Blíster"></div>'+
        '<div class="f"><label for="prUnit">Unidad</label><input class="fld" id="prUnit" value="caja"></div>'+
        '<div class="f"><label for="prFactor">Factor (und. base)</label><input class="fld r" id="prFactor" value="6" inputmode="decimal"></div>'+
        '<div class="f"><label for="prBc">Código de Barras</label><input class="fld mono" id="prBc" value="'+esc(D.code)+'C6"></div>'+
        '<div class="f"><label for="prPrice">Precio US$ (sin IVA)</label><input class="fld r" id="prPrice" value="'+nf(r2(D.price*6*0.92))+'" inputmode="decimal"></div>'+
        '<div class="f" style="justify-content:flex-end"><button class="btn" id="prAddBtn">+ Agregar presentación</button></div>'+
      '</div>';

    const drawPres=()=>{
      $('#prBody',box).innerHTML=D.presentations.map((pr,i)=>
        '<tr data-pri="'+i+'">'+
          '<td><input class="fld cell-wide" data-prf="name" value="'+esc(pr.name)+'"></td>'+
          '<td><input class="fld cell" data-prf="unit" value="'+esc(pr.unit)+'"></td>'+
          '<td class="r"><input class="fld cell r" data-prf="factor" value="'+fq(pr.factor)+'" inputmode="decimal"></td>'+
          '<td><input class="fld cell-wide mono" data-prf="barcode" value="'+esc(pr.barcode||'')+'"></td>'+
          '<td class="r"><input class="fld cell r" data-prf="price" value="'+nf(pr.price)+'" inputmode="decimal"></td>'+
          '<td class="r"><b>'+nf(r2(pr.price*(1+taxRate)))+'</b></td>'+
          '<td class="c">'+(i===0?'Base':'<button class="mini" data-prdel="'+i+'">&times;</button>')+'</td>'+
        '</tr>'
      ).join('');
    };
    box.onchange=e=>{
      const t=e.target;if(!t.dataset.prf)return;
      const idx=+t.closest('tr').dataset.pri, pr=D.presentations[idx];
      if(t.dataset.prf==='name')pr.name=t.value.trim();
      if(t.dataset.prf==='unit')pr.unit=t.value.trim();
      if(t.dataset.prf==='factor')pr.factor=pn(t.value)||1;
      if(t.dataset.prf==='barcode')pr.barcode=t.value.trim();
      if(t.dataset.prf==='price'){pr.price=pn(t.value)||pr.price;if(idx===0)D.price=pr.price;}
      drawPres();updateHeaderBar();
    };
    box.onclick=e=>{
      if(e.target.id==='prAddBtn'){
        const name=$('#prName',box).value.trim()||'Empaque';
        const factor=pn($('#prFactor',box).value)||1;
        const price=pn($('#prPrice',box).value)||r2(D.price*factor);
        D.presentations.push({name,unit:$('#prUnit',box).value.trim()||'emp',factor,barcode:$('#prBc',box).value.trim(),price});
        renderPresTab(box);
      }
      const del=e.target.closest('[data-prdel]');
      if(del){D.presentations.splice(+del.dataset.prdel,1);drawPres();}
    };
    drawPres();
  };

  /* 4. IMPUESTOS */
  const renderTaxTab=box=>{
    const t=D.tax;
    const isEx=t.type==='E'||t.type==='NS';
    const ratePct=isEx?0:(t.rate||16);
    const ivaAmt=r2(D.price*(ratePct/100));
    const totUsd=r2(D.price+ivaAmt);
    const igtfAmt=t.igtf?r2(totUsd*IGTF):0;

    box.innerHTML=
      '<div class="fltgrid">'+
        '<div class="f wide"><label for="txType">Condición Fiscal / Tipo de Alícuota IVA</label>'+
          '<select class="fld" id="txType">'+
            '<option value="G"'+(t.type==='G'?' selected':'')+'>Gravado — Alícuota General (16 %)</option>'+
            '<option value="R"'+(t.type==='R'?' selected':'')+'>Gravado — Alícuota Reducida (8 %)</option>'+
            '<option value="A"'+(t.type==='A'?' selected':'')+'>Gravado — Alícuota Adicional / Suntuario (31 %)</option>'+
            '<option value="E"'+(t.type==='E'?' selected':'')+'>Exento de IVA (0 %)</option>'+
            '<option value="NS"'+(t.type==='NS'?' selected':'')+'>No Sujeto (0 %)</option>'+
          '</select>'+
        '</div>'+
        '<div class="f"><label for="txRate">Porcentaje IVA (%)</label><input class="fld r" id="txRate" value="'+fq(ratePct)+'" '+(isEx?'readonly':'')+' inputmode="decimal"></div>'+
        '<div class="f"><label for="txCode">Código Fiscal / Clasificador</label><input class="fld mono" id="txCode" value="'+esc(t.codeSeniat||'GRAV-16')+'"></div>'+
        '<div class="f"><label for="txPerc">Percepción / Imp. Municipal (%)</label><input class="fld r" id="txPerc" value="'+fq(t.percRate||0)+'" inputmode="decimal"></div>'+
        '<div class="f" style="justify-content:center"><label class="chk"><input type="checkbox" id="txIgtf" '+(t.igtf?'checked':'')+'> Sujeto a IGTF (3 %) en divisas</label></div>'+
      '</div>'+
      '<table class="sumt" style="max-width:520px">'+
        '<thead><tr><th>Simulación Fiscal sobre Precio Detal</th><th class="r">US$</th></tr></thead>'+
        '<tbody>'+
          '<tr><td>Base Imponible (Precio sin IVA)</td><td class="r">'+nf(D.price)+'</td></tr>'+
          '<tr><td>IVA ('+fq(ratePct)+' %)</td><td class="r">'+nf(ivaAmt)+'</td></tr>'+
          '<tr class="tot"><td>Precio de Venta con IVA</td><td class="r">'+nf(totUsd)+'</td></tr>'+
          '<tr><td>IGTF 3 % referencial (si paga en efectivo US$ / Zelle)</td><td class="r">'+nf(igtfAmt)+'</td></tr>'+
        '</tbody>'+
      '</table>';

    box.onchange=e=>{
      const elT=e.target;
      if(elT.id==='txType'){
        t.type=elT.value;
        if(t.type==='G'){t.rate=16;t.codeSeniat='GRAV-16';}
        else if(t.type==='R'){t.rate=8;t.codeSeniat='RED-08';}
        else if(t.type==='A'){t.rate=31;t.codeSeniat='ADIC-31';}
        else{t.rate=0;t.codeSeniat='EXENTO-0';}
      }
      if(elT.id==='txRate')t.rate=pnZero(elT.value)||0;
      if(elT.id==='txCode')t.codeSeniat=elT.value.trim();
      if(elT.id==='txPerc')t.percRate=pnZero(elT.value)||0;
      if(elT.id==='txIgtf')t.igtf=elT.checked;
      renderTaxTab(box);updateHeaderBar();
    };
  };

  /* 5. PROVEEDORES ASOCIADOS AL PRODUCTO (CON CREACIÓN DIRECTA DE PROVEEDOR, RIF, CÓDIGO DE BARRAS, COSTO OFRECIDO, OTROS) */
  const renderSupTab=box=>{
    const supOpts='<option value="__NEW__">+ Crear nuevo proveedor directamente…</option>'+
      S.suppliers.map(s=>'<option value="'+esc(s.id)+'">'+esc(s.name)+' ('+esc(s.rif)+')</option>').join('');

    box.innerHTML=
      '<div class="gridwrap invwrap" style="max-height:190px"><table class="grid" style="min-width:820px">'+
        '<thead><tr><th>RIF Proveedor</th><th>Razón Social</th><th>Cód. Barras / Ref. Prov.</th><th class="r">Costo Ofrecido US$</th><th class="r">Entrega (días)</th><th class="r">Ped. Mín.</th><th>Otros / Condiciones</th><th></th></tr></thead>'+
        '<tbody id="asBody"></tbody>'+
      '</table></div>'+
      '<div class="group">'+
        '<div class="gtitle">Asociar proveedor o crear nuevo proveedor directamente</div>'+
        '<div class="newgrid" style="margin:4px 0">'+
          '<div class="f wide"><label for="asSel">Seleccionar del directorio o crear nuevo</label><select class="fld" id="asSel">'+supOpts+'</select></div>'+
          '<div class="f"><label for="asRif">RIF del Proveedor</label><input class="fld mono" id="asRif" placeholder="J-40000000-1"></div>'+
          '<div class="f wide"><label for="asName">Razón Social / Nombre del Proveedor</label><input class="fld" id="asName" placeholder="Ej: Importadora Repuestos del Centro, C.A."></div>'+
          '<div class="f"><label for="asTel">Teléfono / Contacto</label><input class="fld" id="asTel" placeholder="0414-000-0000"></div>'+
          '<div class="f"><label for="asBc">Código de Barras / SKU Proveedor</label><input class="fld mono" id="asBc" value="'+esc(D.code)+'-PRV"></div>'+
          '<div class="f"><label for="asCost">Precio de Costo Ofrecido US$</label><input class="fld r" id="asCost" value="'+nf(D.cost)+'" inputmode="decimal"></div>'+
          '<div class="f"><label for="asLead">Tiempo Entrega (días)</label><input class="fld r" id="asLead" value="3" inputmode="numeric"></div>'+
          '<div class="f"><label for="asMin">Pedido Mínimo (und)</label><input class="fld r" id="asMin" value="6" inputmode="numeric"></div>'+
          '<div class="f wide"><label for="asNotes">Otros datos (descuentos por volumen, garantía, crédito)</label><input class="fld" id="asNotes" placeholder="Ej: Crédito 15 días, 5% desc. por caja cerrada"></div>'+
        '</div>'+
        '<button class="btn primary" id="asAddBtn">Guardar Proveedor y Asociar al Producto</button>'+
      '</div>';

    const syncSupFields=()=>{
      const val=$('#asSel',box).value;
      const s=S.suppliers.find(x=>x.id===val);
      if(s){
        $('#asRif',box).value=s.rif;
        $('#asName',box).value=s.name;
        $('#asTel',box).value=s.tel||'';
      }else{
        $('#asRif',box).value='';
        $('#asName',box).value='';
        $('#asTel',box).value='';
      }
    };

    const drawAssoc=()=>{
      $('#asBody',box).innerHTML=D.assocSuppliers.length?D.assocSuppliers.map((a,i)=>
        '<tr>'+
          '<td class="mono">'+esc(a.rif)+'</td>'+
          '<td><b>'+esc(a.name)+'</b></td>'+
          '<td class="mono">'+esc(a.barcode||'-')+'</td>'+
          '<td class="r"><b>'+usd(a.cost)+'</b></td>'+
          '<td class="r">'+(a.leadDays||1)+' d</td>'+
          '<td class="r">'+(a.minOrder||1)+'</td>'+
          '<td>'+esc(a.notes||'')+'</td>'+
          '<td class="c"><button class="btn mini2" data-usecost="'+i+'" title="Fijar como costo base del producto">Usar costo</button> <button class="mini" data-asdel="'+i+'">&times;</button></td>'+
        '</tr>'
      ).join(''):'<tr class="empty"><td colspan="8">Sin proveedores asociados a este producto. Use el formulario inferior para crear o vincular uno.</td></tr>';
    };

    box.onchange=e=>{if(e.target.id==='asSel')syncSupFields();};
    box.onclick=e=>{
      if(e.target.id==='asAddBtn'){
        const rif=$('#asRif',box).value.trim().toUpperCase(), name=$('#asName',box).value.trim();
        const cost=pn($('#asCost',box).value)||D.cost;
        if(!rif||!name){msg('Indique el RIF y la Razón Social del proveedor.','bad');return;}
        /* Si no existe en S.suppliers, lo crea directamente */
        let sup=S.suppliers.find(s=>s.rif.toUpperCase()===rif||norm(s.name)===norm(name));
        if(!sup){
          sup={id:'PRV-'+two(S.suppliers.length+1),name,rif,tel:$('#asTel',box).value.trim(),cond:'15 días'};
          S.suppliers.push(sup);
        }
        D.assocSuppliers.push({
          supId:sup.id,rif:sup.rif,name:sup.name,
          barcode:$('#asBc',box).value.trim()||D.code,
          cost,
          leadDays:Math.round(pn($('#asLead',box).value)||1),
          minOrder:Math.round(pn($('#asMin',box).value)||1),
          notes:$('#asNotes',box).value.trim()
        });
        save();
        renderSupTab(box);
        msg('Proveedor '+sup.name+' asociado al producto.');
      }
      const uc=e.target.closest('[data-usecost]');
      if(uc){
        const a=D.assocSuppliers[+uc.dataset.usecost];
        if(a){
          D.cost=a.cost;
          const nc=Math.max(0.01,effCost());
          D.price=r2(nc*(1+(D.pricing.markupCost||50)/100));
          syncGapsFromBase();
          updateHeaderBar();
          msg('Costo base actualizado a '+usd(a.cost)+' según oferta de '+a.name+'.');
        }
      }
      const del=e.target.closest('[data-asdel]');
      if(del){D.assocSuppliers.splice(+del.dataset.asdel,1);drawAssoc();}
    };
    drawAssoc();
  };

  /* 6. KIT / COMBO */
  const renderKitTab=box=>{
    const prodOpts=S.products.filter(p=>p.code!==D.code).map(p=>'<option value="'+esc(p.code)+'">'+esc(p.code)+' — '+esc(p.desc)+' ('+esc(p.brand)+') [Costo: '+usd(p.cost)+' | P.Venta: '+usd(p.price)+']</option>').join('');
    box.innerHTML=
      '<div class="invbar" style="background:var(--alt);padding:6px 8px;border:1px solid var(--lo);justify-content:space-between">'+
        '<label class="chk"><input type="checkbox" id="ktActive" '+(D.isKit?'checked':'')+'> <b>Este producto es un Kit / Combo compuesto por varios artículos</b></label>'+
        '<button class="btn mini2" id="ktApplyCost">Adoptar costo y precio sugerido del Combo</button>'+
      '</div>'+
      '<div class="invbar">'+
        '<label for="ktProd">Componente</label><select class="fld" id="ktProd" style="flex:2">'+prodOpts+'</select>'+
        '<label for="ktQty">Cantidad en el Kit</label><input class="fld r" id="ktQty" value="1" style="max-width:80px" inputmode="decimal">'+
        '<button class="btn" id="ktAddBtn">+ Agregar componente al Kit</button>'+
      '</div>'+
      '<div class="gridwrap invwrap" style="max-height:200px"><table class="grid">'+
        '<thead><tr><th>Código</th><th>Componente</th><th class="r">Cantidad</th><th class="r">Costo Unit. US$</th><th class="r">Subtotal Costo US$</th><th class="r">Precio Ind. US$</th><th></th></tr></thead>'+
        '<tbody id="ktBody"></tbody>'+
      '</table></div>'+
      '<div class="kpis" id="ktKpis"></div>';

    const drawKit=()=>{
      let sumCost=0, sumPrice=0;
      $('#ktBody',box).innerHTML=D.kitItems.length?D.kitItems.map((k,i)=>{
        const cp=prod(k.code)||{desc:k.desc||'Producto',cost:k.cost||0,price:k.price||0};
        const sc=r2(cp.cost*k.qty), sp=r2(cp.price*k.qty);
        sumCost+=sc;sumPrice+=sp;
        return '<tr>'+
          '<td class="mono">'+esc(k.code)+'</td>'+
          '<td><b>'+esc(cp.desc)+'</b></td>'+
          '<td class="r">'+fq(k.qty)+'</td>'+
          '<td class="r">'+nf(cp.cost)+'</td>'+
          '<td class="r"><b>'+nf(sc)+'</b></td>'+
          '<td class="r">'+nf(sp)+'</td>'+
          '<td class="c"><button class="mini" data-ktdel="'+i+'">&times;</button></td>'+
        '</tr>';
      }).join(''):'<tr class="empty"><td colspan="7">Sin componentes agregados. Añada los productos que integran este Kit o Combo (ej: 4 L Aceite + 1 Filtro).</td></tr>';
      sumCost=r2(sumCost);sumPrice=r2(sumPrice);
      const sugCombo=r2(sumPrice*0.90);
      $('#ktKpis',box).innerHTML=
        '<div class="kpi"><span>Costo Total Componentes</span><b>'+usd(sumCost)+'</b><small>Suma de costos del kit</small></div>'+
        '<div class="kpi"><span>Suma Precios Individuales</span><b>'+usd(sumPrice)+'</b><small>Si se compran por separado</small></div>'+
        '<div class="kpi"><span>Precio Combo Sugerido (-10%)</span><b class="ok">'+usd(sugCombo)+'</b><small>Ahorro cliente: '+usd(r2(sumPrice-sugCombo))+'</small></div>';
    };

    box.onchange=e=>{if(e.target.id==='ktActive')D.isKit=e.target.checked;};
    box.onclick=e=>{
      if(e.target.id==='ktAddBtn'){
        const code=$('#ktProd',box).value, qty=pn($('#ktQty',box).value)||1, cp=prod(code);
        if(!cp)return;
        D.isKit=true;$('#ktActive',box).checked=true;
        const ex=D.kitItems.find(x=>x.code===code);
        if(ex)ex.qty=r2(ex.qty+qty);
        else D.kitItems.push({code,desc:cp.desc,qty,cost:cp.cost,price:cp.price});
        drawKit();
      }
      if(e.target.id==='ktApplyCost'){
        if(!D.kitItems.length){msg('Agregue componentes al Kit primero.','bad');return;}
        let sc=0,sp=0;
        D.kitItems.forEach(k=>{const cp=prod(k.code);if(cp){sc+=cp.cost*k.qty;sp+=cp.price*k.qty;}});
        D.cost=r2(sc);D.price=r2(sp*0.90);
        syncGapsFromBase();updateHeaderBar();
        msg('Se aplicó el costo ('+usd(D.cost)+') y precio combo sugerido ('+usd(D.price)+') al producto.');
      }
      const del=e.target.closest('[data-ktdel]');
      if(del){D.kitItems.splice(+del.dataset.ktdel,1);drawKit();}
    };
    drawKit();
  };

  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-pftab]');
    if(b){tab=b.dataset.pftab;renderTab();}
  });

  const saveProduct=(closeAfter=true)=>{
    if(!D.code||!D.desc.trim()||!D.price){
      msg('Complete el código, la descripción y el precio de venta del producto.','bad');
      return false;
    }
    if(!existing&&prod(D.code)){
      msg('Ya existe otro producto con el código '+D.code+'.','bad');
      return false;
    }
    if(autoSku)D.sku=genAutoSku(D.dept,D.cat,D.subcat,nextSeq);
    syncGapsFromBase();
    if(existing){
      const prevStock=existing.stock;
      Object.assign(existing,D);
      if(Math.abs(existing.stock-prevStock)>1e-9){
        addKardex({
          code:existing.code,type:'AJUSTE',dir:existing.stock>prevStock?'IN':'OUT',
          doc:'FICHA-PROD',party:'Actualización en Ficha Técnica de Producto',
          qty:Math.abs(r2(existing.stock-prevStock)),stockAfter:existing.stock,cost:existing.cost,user:S.cfg.cajero
        });
      }
    }else{
      S.products.push(D);
      addKardex({
        code:D.code,type:'INICIAL',dir:'IN',doc:'ALTA-SKU',
        party:'Alta de producto ('+D.sku+')',qty:D.stock,stockAfter:D.stock,cost:D.cost,user:S.cfg.cajero
      });
    }
    save();renderCatOptions();renderAll();
    msg('Producto '+D.desc+' ('+D.sku+') guardado correctamente.');
    if(closeAfter){inventoryDlg();return false;}
    return true;
  };

  openWin({
    title:(existing?'Editar Ficha de Producto — '+existing.sku:'Nuevo Producto — Ficha Integral y Motores de Precio'),
    w:1020,
    body:el,
    foot:[
      {label:'Generar Etiqueta / Hablador SKU (US$)',left:true,fn:()=>{if(saveProduct(false))labelGeneratorDlg(D.code);return false;}},
      {label:'Volver a Inventario',fn:()=>{inventoryDlg();return false;}},
      {label:'Guardar Producto',primary:true,fn:()=>saveProduct(true)}
    ],
    onEnter:()=>{},
    onOpen:()=>{renderTab();if(initialMasterItem)applyMasterProduct(initialMasterItem);}
  });
}

/* ---------- búsqueda general de productos (solo consulta) ---------- */
function productViewDlg(p){
  if(!p)return;
  const pres=Array.isArray(p.presentations)?p.presentations:[];
  const suppliers=Array.isArray(p.assocSuppliers)?p.assocSuppliers:[];
  const kit=Array.isArray(p.kitItems)?p.kitItems:[];
  const tax=prodTaxTag(p);
  const pricing=p.pricing||{};
  const gaps=Array.isArray(pricing.gaps)?pricing.gaps:[];
  const photo=p.photo?'<img src="'+esc(p.photo)+'" alt="Foto de '+esc(p.desc)+'" style="width:112px;height:112px;object-fit:contain;border:1px solid var(--line);border-radius:8px;background:#fff;padding:5px">':'<div style="width:112px;height:112px;display:grid;place-items:center;border:1px solid var(--line);border-radius:8px;color:var(--muted)">'+ico('inventario')+'<span style="font-size:11px">Sin foto</span></div>';
  const field=(label,value)=>'<div class="pv-field"><span>'+esc(label)+'</span><b>'+esc(value===undefined||value===null||value===''?'-':String(value))+'</b></div>';
  const section=(title,content)=>'<section class="pv-section"><h3>'+esc(title)+'</h3>'+content+'</section>';
  let html='<div class="form product-view" style="gap:14px">'+
    '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">'+photo+'<div style="flex:1;min-width:220px"><div class="dim">FICHA INFORMATIVA · SOLO LECTURA</div><h2 style="margin:5px 0">'+esc(p.desc||'Producto sin descripción')+'</h2><div class="sub">'+esc(p.brand||'-')+(p.isKit?' · KIT / COMBO':'')+'</div><div style="margin-top:8px"><span class="um-tag">'+esc((p.unit||'und').toUpperCase())+'</span> <span class="iva-tag '+prodTaxCls(p)+'">'+esc(tax)+'</span></div></div></div>'+
    section('Identificación','<div class="pv-grid">'+field('Código / EAN',p.code)+field('SKU',p.sku)+field('Código OEM',p.oem)+field('Marca',p.brand)+'</div>')+
    section('Clasificación y ubicación','<div class="pv-grid">'+field('Departamento',p.dept)+field('Categoría',p.cat)+field('Subcategoría',p.subcat)+field('Pasillo / Ubicación',p.loc)+field('Unidad de medida',(p.unit||'und').toUpperCase())+'</div>')+
    section('Existencias y precios','<div class="pv-grid">'+field('Existencia',fq(Number(p.stock)||0)+' '+(p.unit||'und'))+field('Stock mínimo',fq(Number(p.min)||0))+field('Costo unitario',usd(Number(p.cost)||0))+field('Flete unitario',usd(Number(p.freight)||0))+field('Precio base sin IVA',usd(Number(p.price)||0))+field('Precio con IVA',usd(r2((Number(p.price)||0)*(1+prodTaxRate(p)/100))))+field('Impuesto',tax)+'</div>');
  if(gaps.length)html+=section('Precios por modalidad','<div class="gridwrap"><table class="grid"><thead><tr><th>Modalidad</th><th class="r">Descuento / brecha</th><th class="r">Precio US$</th></tr></thead><tbody>'+gaps.map(g=>'<tr><td>'+esc(g.name||'-')+'</td><td class="r">'+fq(Number(g.gapPct)||0)+'%</td><td class="r">'+nf(Number(g.price)||0)+'</td></tr>').join('')+'</tbody></table></div>');
  if(pres.length)html+=section('Presentaciones y códigos asociados','<div class="gridwrap"><table class="grid"><thead><tr><th>Presentación</th><th>U.M.</th><th class="r">Factor</th><th>Código de barras</th><th class="r">Precio US$</th></tr></thead><tbody>'+pres.map(pr=>'<tr><td>'+esc(pr.name||'-')+'</td><td>'+esc(pr.unit||p.unit||'und')+'</td><td class="r">'+fq(Number(pr.factor)||1)+'</td><td class="mono">'+esc(pr.barcode||'-')+'</td><td class="r">'+nf(Number(pr.price)||0)+'</td></tr>').join('')+'</tbody></table></div>');
  if(suppliers.length)html+=section('Proveedores asociados','<div class="gridwrap"><table class="grid"><thead><tr><th>RIF</th><th>Proveedor</th><th>Código proveedor</th><th class="r">Costo US$</th><th>Notas</th></tr></thead><tbody>'+suppliers.map(a=>'<tr><td>'+esc(a.rif||'-')+'</td><td>'+esc(a.name||'-')+'</td><td class="mono">'+esc(a.barcode||'-')+'</td><td class="r">'+nf(Number(a.cost)||0)+'</td><td>'+esc(a.notes||'-')+'</td></tr>').join('')+'</tbody></table></div>');
  if(p.isKit)html+=section('Componentes del kit / combo','<div class="gridwrap"><table class="grid"><thead><tr><th>Código</th><th>Producto</th><th class="r">Cantidad</th></tr></thead><tbody>'+kit.map(k=>{const cp=prod(k.code);return '<tr><td class="mono">'+esc(k.code||'-')+'</td><td>'+esc(cp?cp.desc:(k.desc||'Producto'))+'</td><td class="r">'+fq(Number(k.qty)||0)+'</td></tr>';}).join('')+'</tbody></table></div>');
  html+='</div>';
  const style='<style>.product-view .pv-section{border:1px solid var(--line);border-radius:8px;padding:11px;display:grid;gap:9px}.product-view .pv-section h3{margin:0;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}.product-view .pv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:9px}.product-view .pv-field{display:flex;flex-direction:column;gap:3px;min-width:0}.product-view .pv-field span{font-size:11px;color:var(--muted)}.product-view .pv-field b{font-size:13px;overflow-wrap:anywhere}</style>';
  openWin({title:'Ficha informativa del producto',w:820,body:style+html,foot:[{label:'Cerrar',primary:true}]});
}
function searchCatalogDlg(){
  const el=h('<div class="form" style="gap:10px"><label for="catalogSearchQ">Buscar por código, SKU, descripción, marca, departamento, categoría o ubicación</label><input class="fld big" id="catalogSearchQ" autocomplete="off" placeholder="Escriba para ver productos coincidentes…"><div class="dim" id="catalogSearchSummary">Escriba para buscar en el inventario.</div><div class="gridwrap tallwrap"><table class="grid" style="min-width:850px"><thead><tr><th>Código / SKU</th><th>Producto / Marca</th><th>Departamento / Categoría</th><th class="r">Existencia</th><th class="r">Precio US$</th><th class="c">Ver</th></tr></thead><tbody id="catalogSearchBody"><tr class="empty"><td colspan="6">Escriba un término de búsqueda.</td></tr></tbody></table></div><div class="hint">Use el botón con el ojo para consultar la ficha completa. Esta ventana no permite editar ni agregar productos a la venta.</div></div>');
  const input=$('#catalogSearchQ',el);
  const draw=()=>{
    const q=input.value.trim();
    const list=q?searchProducts(q,'Todas'): [];
    $('#catalogSearchSummary',el).textContent=q?(list.length+' producto(s) coincidente(s)'+(list.length>200?' · Mostrando los primeros 200':'')+'.'):'Escriba para buscar en el inventario.';
    $('#catalogSearchBody',el).innerHTML=list.length?list.slice(0,200).map(p=>'<tr><td class="mono"><b>'+esc(p.sku||p.code)+'</b><div class="sub">EAN: '+esc(p.code)+'</div></td><td>'+(p.photo?'<img class="thumb-sm" src="'+esc(p.photo)+'" alt="">':'')+'<b>'+esc(p.desc)+'</b><div class="sub">'+esc(p.brand||'-')+'</div></td><td>'+esc(p.dept||'-')+'<div class="sub">'+esc(p.cat||'-')+' › '+esc(p.subcat||'-')+'</div></td><td class="r '+stockCls(p)+'">'+fq(Number(p.stock)||0)+' '+esc(p.unit||'und')+'</td><td class="r">'+nf(Number(p.price)||0)+'</td><td class="c"><button class="btn mini2" data-view="'+esc(p.code)+'" title="Ver ficha informativa de '+esc(p.desc)+'" aria-label="Ver ficha de '+esc(p.desc)+'">'+ico('ver')+'</button></td></tr>').join(''):'<tr class="empty"><td colspan="6">'+(q?'No se encontraron productos coincidentes.':'Escriba un término de búsqueda.')+'</td></tr>';
  };
  input.addEventListener('input',draw);
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-view]');
    if(!b)return;
    const p=prod(b.dataset.view);
    if(p)productViewDlg(p);
  });
  openWin({title:'Buscar productos',w:980,body:el,foot:[{label:'Cerrar',primary:true}],onEnter:()=>draw(),onOpen:()=>input.focus()});
}

/* ---------- inventario ---------- */
function inventoryDlg(){
  const el=h('<div class="form"><div class="invbar"><label for="invQ">Buscar</label><input class="fld" id="invQ" placeholder="SKU, código, marca, depto, categoría o descripción" autocomplete="off"><label class="chk"><input type="checkbox" id="invLow"> Solo bajo mínimo</label><button class="btn primary" id="btnMasterCat">🔍 Catálogo Maestro (2.5M repuestos)</button><button class="btn" id="btnNewProd">+ Nuevo en Blanco</button><button class="btn mini2" id="btnGoConteo">Conteo físico masivo…</button><button class="btn mini2" id="btnGoLabels">Habladores / Etiquetas SKU</button></div><div class="dim" id="invSum"></div><div class="gridwrap tallwrap"><table class="grid" style="min-width:1040px"><thead><tr><th>SKU / Código</th><th>Descripción / Marca</th><th>Depto. / Categoría / Subcat.</th><th>Pas.</th><th class="c" style="width:68px">U.M.</th><th class="c" style="width:90px">I.V.A.</th><th class="r">Existencia</th><th class="r">Mín.</th><th class="r">Costo US$</th><th class="r">Precio US$</th><th class="c">Acciones</th></tr></thead><tbody id="invBody"></tbody></table></div></div>');
  const rows=()=>{
    const q=$('#invQ',el).value,low=$('#invLow',el).checked;
    return searchProducts(q,'Todas').filter(p=>!low||p.stock<=p.min);
  };
  const sum=()=>{
    const n=S.products.length,low=S.products.filter(p=>p.stock<=p.min&&p.stock>0).length,out=S.products.filter(p=>p.stock<=0).length;
    const valCost=S.products.reduce((a,p)=>a+p.cost*p.stock,0);
    const valSale=S.products.reduce((a,p)=>a+p.price*p.stock,0);
    $('#invSum',el).textContent=n+' productos · '+low+' bajo mínimo · '+out+' agotados · Costo total '+usd(valCost)+' · Valor venta '+usd(valSale);
  };
  const draw=()=>{
    const list=rows();
    $('#invBody',el).innerHTML=list.length?list.map(p=>'<tr data-code="'+esc(p.code)+'" class="'+(p.stock<=0?'rowout':(p.stock<=p.min?'rowlow':''))+'">'+
      '<td class="mono"><div><b>'+esc(p.sku||p.code)+'</b></div><div class="sub">EAN: '+esc(p.code)+'</div></td>'+
      '<td>'+(p.photo?'<img class="thumb-sm" src="'+esc(p.photo)+'" alt="">':'')+'<span class="desc">'+esc(p.desc)+'</span><div class="sub">'+esc(p.brand)+(p.isKit?' · [KIT/COMBO]':'')+'</div></td>'+
      '<td><div>'+esc(p.dept)+'</div><div class="sub">'+esc(p.cat)+' &rsaquo; '+esc(p.subcat)+'</div></td>'+
      '<td>'+esc(p.loc)+'</td>'+
      '<td class="c"><select class="fld cell" data-f="unit" style="width:64px;padding:1px 2px" title="Unidad de Medida (U.M.)">'+
        UM_OPTIONS.map(u=>'<option value="'+u.id+'"'+(p.unit===u.id?' selected':'')+'>'+u.id.toUpperCase()+'</option>').join('')+
      '</select></td>'+
      '<td class="c"><select class="fld cell" data-f="tax" style="width:88px;padding:1px 2px" title="Alícuota de I.V.A.">'+
        '<option value="G" '+(p.tax&&p.tax.type==='G'?'selected':'')+'>16% (G)</option>'+
        '<option value="R" '+(p.tax&&p.tax.type==='R'?'selected':'')+'>8% (R)</option>'+
        '<option value="A" '+(p.tax&&p.tax.type==='A'?'selected':'')+'>31% (A)</option>'+
        '<option value="E" '+(p.tax&&(p.tax.type==='E'||p.tax.type==='NS')?'selected':'')+'>0% (Exento)</option>'+
      '</select></td>'+
      '<td class="r"><input class="fld cell r" data-f="stock" value="'+fq(p.stock)+'" inputmode="decimal" aria-label="Existencia de '+esc(p.desc)+'"></td>'+
      '<td class="r"><input class="fld cell r" data-f="min" value="'+fq(p.min)+'" inputmode="decimal" aria-label="Mínimo de '+esc(p.desc)+'"></td>'+
      '<td class="r"><input class="fld cell r" data-f="cost" value="'+nf(p.cost)+'" inputmode="decimal" aria-label="Costo de '+esc(p.desc)+'"></td>'+
      '<td class="r"><input class="fld cell r" data-f="price" value="'+nf(p.price)+'" inputmode="decimal" aria-label="Precio de '+esc(p.desc)+'"></td>'+
      '<td class="c" style="white-space:nowrap"><button class="btn mini2" data-edit="'+esc(p.code)+'" title="Editar ficha, costos, presentaciones, proveedores y kit">Ficha</button> <button class="btn mini2" data-lbl="'+esc(p.code)+'" title="Generar hablador / etiqueta SKU">SKU</button> <button class="btn mini2" data-kx="'+esc(p.code)+'">Kardex</button></td>'+
    '</tr>').join(''):'<tr class="empty"><td colspan="11">Sin productos que coincidan.</td></tr>';
    sum();
  };
  el.addEventListener('input',e=>{if(e.target.id==='invQ')draw();});
  el.addEventListener('change',e=>{
    if(e.target.id==='invLow'){draw();return;}
    const f=e.target.dataset.f;if(!f)return;
    const tr=e.target.closest('tr'),p=prod(tr.dataset.code),v=pn(e.target.value);
    if(f==='stock'){
      const prev=p.stock;
      const next=e.target.value.trim()==='0'?0:(v||p.stock);
      if(Math.abs(next-prev)>1e-9){
        p.stock=next;
        addKardex({
          code:p.code,
          type:'AJUSTE',
          dir:next>prev?'IN':'OUT',
          doc:'AJU-DIR',
          party:'Ajuste directo en maestro de inventario',
          qty:Math.abs(r2(next-prev)),
          stockAfter:next,
          cost:p.cost,
          user:S.cfg.cajero
        });
      }
    }
    else if(f==='min'){p.min=e.target.value.trim()==='0'?0:(v||p.min);}
    else if(f==='cost'){p.cost=v||p.cost;}
    else if(f==='price'){p.price=v||p.price;}
    else if(f==='unit'){
      p.unit=e.target.value.trim()||'und';
      msg('U.M. de "'+p.desc+'" actualizada a '+p.unit.toUpperCase()+'.');
    }
    else if(f==='tax'){
      const val=e.target.value;
      if(val==='E')p.tax={type:'E',rate:0,igtf:true,percRate:0,codeSeniat:'EXENTO-0'};
      else if(val==='R')p.tax={type:'R',rate:8,igtf:true,percRate:0,codeSeniat:'RED-08'};
      else if(val==='A')p.tax={type:'A',rate:31,igtf:true,percRate:0,codeSeniat:'ADIC-31'};
      else p.tax={type:'G',rate:16,igtf:true,percRate:0,codeSeniat:'GRAV-16'};
      msg('I.V.A. de "'+p.desc+'" actualizado a '+prodTaxTag(p)+'.');
    }
    if(f==='price'||f==='cost')e.target.value=nf(p[f]);
    else if(f==='stock'||f==='min')e.target.value=fq(p[f]);
    tr.className=p.stock<=0?'rowout':(p.stock<=p.min?'rowlow':'');
    save();sum();renderCatalog();renderCart();
  });
  el.addEventListener('click',e=>{
    if(e.target.id==='btnMasterCat'){
      masterCatalogBrowserDlg(item=>{
        productFormDlg(null,'gen',item);
      });
      return;
    }
    if(e.target.id==='btnNewProd'){productFormDlg(null,'gen');return;}
    if(e.target.id==='btnGoConteo'){conteoDlg();return;}
    if(e.target.id==='btnGoLabels'){labelGeneratorDlg();return;}
    const ed=e.target.closest('[data-edit]');if(ed){productFormDlg(ed.dataset.edit,'gen');return;}
    const lb=e.target.closest('[data-lbl]');if(lb){labelGeneratorDlg(lb.dataset.lbl);return;}
    const kx=e.target.closest('[data-kx]');if(kx){kardexDlg(kx.dataset.kx);return;}
  });
  openWin({title:'Inventario y Maestro de Productos',w:1080,body:el,foot:[{label:'Cerrar',primary:true}],onEnter:()=>{},onOpen:()=>{draw();}});
}

/* ---------- MÓDULO DE COMPRAS Y PROVEEDORES ---------- */
function comprasDlg(initialTab){
  let tab=initialTab||'new';
  let supIdx=0;
  let pLines=[
    {code:'7501008',qty:12,cost:4.85,price:7.50},
    {code:'7504004',qty:10,cost:3.45,price:5.40}
  ];
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

function printComprobanteDivisas(op){
  const tipoLabel={
    'ZELLE_PROV':'COMPRA USD ZELLE PARA PAGO DIRECTO A PROVEEDOR (TRIANGULACIÓN)',
    'USD_EFECTIVO':'COMPRA DE USD EN EFECTIVO FÍSICO A PERSONA NATURAL',
    'ZELLE_PROPIO':'COMPRA DE USD ZELLE PARA TESORERÍA / CUENTA PROPIA',
    'VENTA_USD':'CANJE DE USD EFECTIVO A BOLÍVARES (SALIDA DE CAJA)'
  }[op.tipo]||'OPERACIÓN CAMBIARIA / TRAZABILIDAD';

  const rateBcv=op.tasaBcv||S.cfg.rate;
  const difTasa=op.tasa&&rateBcv?r2(op.tasa-rateBcv):0;

  const html='<div style="font-family:monospace;max-width:440px;margin:0 auto;padding:12px;border:1px dashed #333;background:#fafafa;line-height:1.4;font-size:12px">'+
    '<div style="text-align:center;font-weight:700;font-size:14px;border-bottom:1px double #333;padding-bottom:6px;margin-bottom:8px">'+
      esc(S.cfg.empresa)+'<br>'+
      '<span style="font-size:11px;font-weight:normal">RIF: '+esc(S.cfg.rif)+' &middot; Control Cambiario y Trazabilidad</span><br>'+
      '<span style="font-size:12px;font-weight:bold;color:#1842B8">COMPROBANTE DE OPERACIÓN CAMBIARIA</span>'+
    '</div>'+
    '<div style="display:flex;justify-content:space-between"><span>Nº OPERACIÓN:</span><b>'+esc(op.id)+'</b></div>'+
    '<div style="display:flex;justify-content:space-between"><span>FECHA Y HORA:</span><span>'+fmtDT(op.ts)+'</span></div>'+
    '<div style="display:flex;justify-content:space-between"><span>TIPO OPERACIÓN:</span><b style="font-size:10.5px;text-align:right">'+esc(tipoLabel)+'</b></div>'+
    '<div style="border-top:1px dashed #666;margin:8px 0;padding-top:6px">'+
      '<div style="font-weight:bold;font-size:11.5px;margin-bottom:3px">1. TERCERO / VENDEDOR DE DIVISAS:</div>'+
      '<div style="display:flex;justify-content:space-between"><span>NOMBRE:</span><b>'+esc(op.vendedor.nombre)+'</b></div>'+
      '<div style="display:flex;justify-content:space-between"><span>C.I. / RIF:</span><b>'+esc(op.vendedor.ci)+'</b></div>'+
      (op.vendedor.tel?'<div style="display:flex;justify-content:space-between"><span>TELÉFONO:</span><span>'+esc(op.vendedor.tel)+'</span></div>':'')+
    '</div>'+
    '<div style="border-top:1px dashed #666;margin:8px 0;padding-top:6px">'+
      '<div style="font-weight:bold;font-size:11.5px;margin-bottom:3px">2. LIQUIDACIÓN EN BOLÍVARES (SALIDA):</div>'+
      '<div style="display:flex;justify-content:space-between"><span>MEDIO DE PAGO BS.:</span><b>'+esc(op.medioBs)+'</b></div>'+
      (op.bancoOrigen?'<div style="display:flex;justify-content:space-between"><span>BANCO ORIGEN:</span><span>'+esc(op.bancoOrigen)+'</span></div>':'')+
      (op.bancoDestino?'<div style="display:flex;justify-content:space-between"><span>BANCO DESTINO:</span><span>'+esc(op.bancoDestino)+'</span></div>':'')+
      '<div style="display:flex;justify-content:space-between"><span>Nº REFERENCIA BS.:</span><b style="background:#e5e7eb;padding:0 3px">'+esc(op.refBs||'-')+'</b></div>'+
      '<div style="display:flex;justify-content:space-between"><span>TOTAL PAGADO BS.:</span><b>'+bsf(op.montoBs)+'</b></div>'+
    '</div>'+
    '<div style="border-top:1px dashed #666;margin:8px 0;padding-top:6px">'+
      '<div style="font-weight:bold;font-size:11.5px;margin-bottom:3px">3. RECEPCIÓN / ACREDITACIÓN EN DIVISAS:</div>'+
      '<div style="display:flex;justify-content:space-between"><span>MONTO DIVISAS:</span><b style="font-size:13px;color:#1842B8">'+usd(op.montoUsd)+'</b></div>'+
      '<div style="display:flex;justify-content:space-between"><span>TASA PACTADA:</span><b>'+nf(op.tasa)+' Bs/US$</b></div>'+
      '<div style="display:flex;justify-content:space-between"><span>TASA OFICIAL BCV:</span><span>'+nf(rateBcv)+' Bs/US$</span></div>'+
      (difTasa!==0?'<div style="display:flex;justify-content:space-between;font-size:11px;color:#854d0e"><span>DIF. CAMBIARIA:</span><span>'+(difTasa>0?'+':'')+nf(difTasa)+' Bs/US$</span></div>':'')+
      '<div style="display:flex;justify-content:space-between"><span>DESTINO FONDOS:</span><b>'+esc(op.destinoNombre||op.destinoTipo)+'</b></div>'+
      (op.destinatarioZelle?'<div style="display:flex;justify-content:space-between"><span>CORREO ZELLE:</span><b>'+esc(op.destinatarioZelle)+'</b></div>':'')+
      (op.titularZelle?'<div style="display:flex;justify-content:space-between"><span>TITULAR ZELLE:</span><span>'+esc(op.titularZelle)+'</span></div>':'')+
      (op.confZelle?'<div style="display:flex;justify-content:space-between"><span>CONFIRMATION ZELLE:</span><b style="background:#fef08a;padding:0 3px">'+esc(op.confZelle)+'</b></div>':'')+
      (op.seriales?'<div style="display:flex;justify-content:space-between"><span>SERIALES BILLETES:</span><span>'+esc(op.seriales)+'</span></div>':'')+
      (op.cxpDoc?'<div style="display:flex;justify-content:space-between"><span>FACTURA CxP AFECTADA:</span><b>'+esc(op.cxpDoc)+'</b></div>':'')+
    '</div>'+
    (op.notas?'<div style="font-size:11px;color:#444;border-top:1px dotted #ccc;margin:6px 0;padding-top:4px"><b>Observaciones:</b> '+esc(op.notas)+'</div>':'')+
    '<div style="border-top:1px dashed #333;margin-top:12px;padding-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:center;font-size:10px">'+
      '<div>___________________________<br><b>'+esc(S.cfg.cajero)+'</b><br>Administración / Caja</div>'+
      '<div>___________________________<br><b>'+esc(op.vendedor.nombre)+'</b><br>C.I. '+esc(op.vendedor.ci)+'<br>Vendedor Divisas / Receptor</div>'+
    '</div>'+
    '<div style="text-align:center;font-size:9.5px;color:#777;margin-top:10px">Documento generado para fines de control administrativo y trazabilidad cambiaria.</div>'+
  '</div>';

  openWin({
    title:'Comprobante de Operación Cambiaria y Trazabilidad — '+op.id,
    w:500,body:h(html),
    foot:[
      {label:'Imprimir Comprobante',primary:true,fn:()=>{printFiscalReport('Comprobante Cambiario '+op.id,html);return false;}},
      {label:'Cerrar'}
    ]
  });
}

function newOperacionCambiariaDlg(opts, onDone){
  opts=opts||{};
  const initialCxp=opts.cxpId?((S.cxp||[]).find(x=>x.id===opts.cxpId)):null;
  const initialType='ZELLE_PROV';

  const pendingCxp=(S.cxp||[]).filter(x=>r2(x.total-x.paid)>=0.01);
  const cxpOptions='<option value="">-- No vincular a factura CxP --</option>'+
    pendingCxp.map(c=>'<option value="'+esc(c.id)+'"'+(initialCxp&&initialCxp.id===c.id?' selected':'')+'>'+esc(c.supplier.name)+' &middot; Doc: '+esc(c.doc)+' (Saldo: '+usd(r2(c.total-c.paid))+')</option>').join('');

  const el=h('<div class="form">'+
    '<div class="newgrid">'+
      '<div class="f wide"><label for="opTipo">Tipo de Operación Cambiaria / Destino</label><select class="fld" id="opTipo">'+
        '<option value="ZELLE_PROV"'+(initialType==='ZELLE_PROV'?' selected':'')+'>Compra de USD Zelle con Pago Directo a Proveedor (Triangulación CxP)</option>'+
        '<option value="USD_EFECTIVO">Compra de USD en Efectivo Físico a Persona Natural (Entrada a Caja Divisas)</option>'+
        '<option value="ZELLE_PROPIO">Compra de USD Zelle para Tesorería / Cuenta Propia</option>'+
        '<option value="VENTA_USD">Venta / Canje de USD Efectivo por Bolívares (Salida de Caja Divisas)</option>'+
      '</select></div>'+
    '</div>'+

    '<div class="group" style="margin-bottom:8px;padding:8px 10px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px">'+
      '<div style="font-weight:700;font-size:12px;color:#1e293b;margin-bottom:6px">1. Datos de la Persona Natural / Vendedor de Divisas (Tercero Intermediario)</div>'+
      '<div class="newgrid">'+
        '<div class="f wide"><label for="opVendNombre">Nombre y Apellido</label><input class="fld" id="opVendNombre" placeholder="Ej: Carlos Eduardo Méndez" value="Carlos Eduardo Méndez"></div>'+
        '<div class="f"><label for="opVendCi">Cédula / RIF</label><input class="fld mono" id="opVendCi" placeholder="V-12345678" value="V-15.892.411"></div>'+
        '<div class="f"><label for="opVendTel">Teléfono de Contacto</label><input class="fld" id="opVendTel" placeholder="0414-1234567" value="0414-234.56.78"></div>'+
      '</div>'+
    '</div>'+

    '<div class="group" style="margin-bottom:8px;padding:8px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px">'+
      '<div style="font-weight:700;font-size:12px;color:#166534;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center">'+
        '<span>2. Importes y Tasa de Cambio</span>'+
        '<button type="button" class="btn mini2" id="opBtnRateBcv" style="font-size:11px">Fijar Tasa BCV Oficial ('+nf(S.cfg.rate)+')</button>'+
      '</div>'+
      '<div class="newgrid">'+
        '<div class="f"><label for="opMontoUsd">Monto en US$ Divisas</label><input class="fld r mono" id="opMontoUsd" inputmode="decimal" placeholder="0,00" value="'+(initialCxp?nf(r2(initialCxp.total-initialCxp.paid)):'50,00')+'"></div>'+
        '<div class="f"><label for="opTasa">Tasa Pactada (Bs/US$)</label><input class="fld r mono" id="opTasa" inputmode="decimal" value="'+nf(S.cfg.rate)+'"></div>'+
        '<div class="f wide"><label for="opMontoBs">Total en Bolívares (Bs.)</label><input class="fld r mono" id="opMontoBs" inputmode="decimal" placeholder="0,00" style="font-weight:700;color:#166534"></div>'+
      '</div>'+
    '</div>'+

    '<div class="group" style="margin-bottom:8px;padding:8px 10px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px">'+
      '<div style="font-weight:700;font-size:12px;color:#1e293b;margin-bottom:6px">3. Pago en Bolívares al Vendedor (Salida de Fondos)</div>'+
      '<div class="newgrid">'+
        '<div class="f"><label for="opMedioBs">Medio de Pago Bs.</label><select class="fld" id="opMedioBs"><option value="Pago Móvil Interbancario" selected>Pago Móvil Interbancario</option><option value="Transferencia Bancaria">Transferencia Bancaria</option><option value="Efectivo Bolívares">Efectivo Bolívares (Caja)</option></select></div>'+
        '<div class="f"><label for="opBancoOrig">Banco Origen (Empresa)</label><select class="fld" id="opBancoOrig"><option value="Banco de Venezuela (BDV)">Banco de Venezuela (BDV)</option><option value="Banesco Banco Universal" selected>Banesco Banco Universal</option><option value="Banco Mercantil">Banco Mercantil</option><option value="Bancamiga">Bancamiga</option></select></div>'+
        '<div class="f"><label for="opBancoDest">Banco Destino (Vendedor)</label><select class="fld" id="opBancoDest"><option value="Banco de Venezuela (BDV)">Banco de Venezuela (BDV)</option><option value="Banesco" selected>Banesco</option><option value="Banco Mercantil">Banco Mercantil</option><option value="Bancamiga">Bancamiga</option><option value="BNC">BNC</option><option value="Provincial">Provincial</option></select></div>'+
        '<div class="f wide"><label for="opRefBs">Nº de Referencia / Aprobación en Bs. (*Obligatorio)</label><input class="fld mono" id="opRefBs" placeholder="Ej: PM-49210293 o TRF-8819203" value="PM-'+pad(Math.floor(Math.random()*899999+100000),6)+'"></div>'+
      '</div>'+
    '</div>'+

    '<div class="group" id="opDynamicGroup" style="margin-bottom:8px;padding:8px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px">'+
      '<!-- Campos dinámicos según el tipo de operación -->'+
    '</div>'+

    '<div class="f wide"><label for="opNotas">Observaciones y Trazabilidad</label><input class="fld" id="opNotas" placeholder="Detalles de la operación cambiaria..."></div>'+
  '</div>');

  const renderDynamicFields=()=>{
    const tipo=$('#opTipo',el).value;
    const box=$('#opDynamicGroup',el);
    if(tipo==='ZELLE_PROV'){
      box.innerHTML=
        '<div style="font-weight:700;font-size:12px;color:#1e40af;margin-bottom:6px">4. Destino de los USD: Transferencia Zelle Directa al Proveedor</div>'+
        '<div class="newgrid">'+
          '<div class="f wide"><label for="opCxpSel">Vincular a Factura / Obligación CxP del Proveedor</label><select class="fld" id="opCxpSel">'+cxpOptions+'</select></div>'+
          '<div class="f wide"><label for="opZelleEmail">Correo o Teléfono Zelle del Proveedor</label><input class="fld" id="opZelleEmail" placeholder="pagos@proveedor.com" value="pagos@proveedor.com"></div>'+
          '<div class="f"><label for="opZelleTitular">Nombre del Titular Zelle en EE.UU.</label><input class="fld" id="opZelleTitular" placeholder="Nombre completo / Razón social" value="Distribuidora Nacional Lubricantes LLC"></div>'+
          '<div class="f"><label for="opZelleConf">Confirmation Number Zelle (*Capture)</label><input class="fld mono" id="opZelleConf" placeholder="Ej: CONF-99218204" value="ZEL-'+pad(Math.floor(Math.random()*899999+100000),6)+'"></div>'+
        '</div>';
    }else if(tipo==='USD_EFECTIVO'){
      box.innerHTML=
        '<div style="font-weight:700;font-size:12px;color:#1e40af;margin-bottom:6px">4. Destino de los USD: Ingreso de Billetes Físicos a Caja</div>'+
        '<div class="newgrid">'+
          '<div class="f"><label for="opCajaDest">Caja Receptora</label><input class="fld" id="opCajaDest" value="Caja Principal ('+esc(S.cfg.caja)+') &middot; '+esc(S.cfg.cajero)+'" readonly></div>'+
          '<div class="f wide"><label for="opSeriales">Seriales / Denominación de Billetes Recibidos</label><input class="fld" id="opSeriales" placeholder="Ej: 1x100 (Serial: KB88192), 1x50 (Serial: LL4401)"></div>'+
        '</div>';
    }else if(tipo==='ZELLE_PROPIO'){
      box.innerHTML=
        '<div style="font-weight:700;font-size:12px;color:#1e40af;margin-bottom:6px">4. Destino de los USD: Cuenta Zelle Propia de la Empresa</div>'+
        '<div class="newgrid">'+
          '<div class="f wide"><label for="opZellePropioEmail">Cuenta Zelle de la Empresa</label><input class="fld" id="opZellePropioEmail" value="tesoreria@elpiston.com" placeholder="correo@zelle.com"></div>'+
          '<div class="f"><label for="opZellePropioConf">Confirmation Number Zelle</label><input class="fld mono" id="opZellePropioConf" placeholder="Confirmation Number" value="ZEL-'+pad(Math.floor(Math.random()*899999+100000),6)+'"></div>'+
        '</div>';
    }else{
      box.innerHTML=
        '<div style="font-weight:700;font-size:12px;color:#854d0e;margin-bottom:6px">4. Canje de USD Efectivo por Bolívares (Salida de Divisas de Caja)</div>'+
        '<div class="newgrid">'+
          '<div class="f"><label for="opCajaOrig">Caja Emisora USD</label><input class="fld" id="opCajaOrig" value="Caja Principal ('+esc(S.cfg.caja)+')" readonly></div>'+
          '<div class="f wide"><label for="opDestBs">Destino de los Bolívares Recibidos</label><input class="fld" id="opDestBs" placeholder="Ej: Cuenta Banesco para pago de nómina"></div>'+
        '</div>';
    }
  };

  const syncAmounts=(fromUsd)=>{
    const tasa=pn($('#opTasa',el).value)||S.cfg.rate;
    if(fromUsd){
      const u=pn($('#opMontoUsd',el).value);
      $('#opMontoBs',el).value=u>0?nf(r2(u*tasa)):'';
    }else{
      const b=pn($('#opMontoBs',el).value);
      $('#opMontoUsd',el).value=b>0?nf(r2(b/tasa)):'';
    }
  };

  renderDynamicFields();
  syncAmounts(true);

  el.addEventListener('change',e=>{
    if(e.target.id==='opTipo')renderDynamicFields();
    if(e.target.id==='opCxpSel'){
      const cid=e.target.value;
      if(cid){
        const it=(S.cxp||[]).find(x=>x.id===cid);
        if(it){
          const rem=r2(Math.max(0,it.total-it.paid));
          $('#opMontoUsd',el).value=nf(rem);
          syncAmounts(true);
        }
      }
    }
  });

  el.addEventListener('input',e=>{
    if(e.target.id==='opMontoUsd')syncAmounts(true);
    else if(e.target.id==='opMontoBs')syncAmounts(false);
    else if(e.target.id==='opTasa')syncAmounts(true);
  });

  el.addEventListener('click',e=>{
    if(e.target.id==='opBtnRateBcv'){
      $('#opTasa',el).value=nf(S.cfg.rate);
      syncAmounts(true);
    }
  });

  openWin({
    title:'Registrar Operación Cambiaria (Compra USD Físico / Zelle)',
    w:680,body:el,
    foot:[
      {label:'Cancelar',fn:()=>{if(onDone)onDone();return false;}},
      {label:'Guardar y Generar Comprobante',primary:true,fn:()=>{
        const tipo=$('#opTipo',el).value;
        const nombre=$('#opVendNombre',el).value.trim();
        const ci=$('#opVendCi',el).value.trim();
        const tel=$('#opVendTel',el).value.trim();
        const montoUsd=pn($('#opMontoUsd',el).value);
        const tasa=pn($('#opTasa',el).value)||S.cfg.rate;
        const montoBs=pn($('#opMontoBs',el).value)||r2(montoUsd*tasa);
        const medioBs=$('#opMedioBs',el).value;
        const bancoOrig=$('#opBancoOrig',el).value;
        const bancoDest=$('#opBancoDest',el).value;
        const refBs=$('#opRefBs',el).value.trim();
        const notas=$('#opNotas',el).value.trim();

        if(!nombre||!ci){msg('Indique el nombre y la cédula/RIF del vendedor de divisas.','bad');return false;}
        if(!montoUsd||montoUsd<=0){msg('Indique el monto en US$ de la operación.','bad');return false;}
        if(!refBs){msg('Indique el número de referencia del pago en Bolívares para la trazabilidad bancaria.','bad');return false;}

        let destinoTipo='CAJA', destinoNombre='Caja Principal', cxpId=null, cxpDoc=null;
        let destinatarioZelle='', titularZelle='', confZelle='', seriales='';

        if(tipo==='ZELLE_PROV'){
          destinoTipo='PROV';
          cxpId=$('#opCxpSel',el)?$('#opCxpSel',el).value:null;
          destinatarioZelle=$('#opZelleEmail',el)?$('#opZelleEmail',el).value.trim():'';
          titularZelle=$('#opZelleTitular',el)?$('#opZelleTitular',el).value.trim():'';
          confZelle=$('#opZelleConf',el)?$('#opZelleConf',el).value.trim():'';
          if(cxpId){
            const it=(S.cxp||[]).find(x=>x.id===cxpId);
            if(it){
              destinoNombre=it.supplier.name;
              cxpDoc=it.doc;
              /* Abonar o cancelar automáticamente la obligación en CxP */
              if(!it.payments)it.payments=[];
              it.payments.push({
                ts:Date.now(),
                method:'Zelle (USD) - Triangulado',
                cur:'USD',
                amountUsd:montoUsd,
                amountBs:montoBs,
                ref:'ZEL:'+(confZelle||'S/R')+' | PM/TRF:'+refBs,
                note:'Pagado vía compra Zelle a '+nombre+' ('+ci+')'
              });
              it.paid=r2((it.paid||0)+montoUsd);
            }
          }else{
            destinoNombre=titularZelle||'Proveedor Externo';
          }
        }else if(tipo==='USD_EFECTIVO'){
          destinoTipo='CAJA';
          destinoNombre='Caja Principal de Divisas (Caja '+S.cfg.caja+')';
          seriales=$('#opSeriales',el)?$('#opSeriales',el).value.trim():'';
        }else if(tipo==='ZELLE_PROPIO'){
          destinoTipo='BANCO_USD';
          destinatarioZelle=$('#opZellePropioEmail',el)?$('#opZellePropioEmail',el).value.trim():'';
          confZelle=$('#opZellePropioConf',el)?$('#opZellePropioConf',el).value.trim():'';
          destinoNombre='Cuenta Zelle Empresa ('+destinatarioZelle+')';
        }else{
          destinoTipo='BANCO_VES';
          destinoNombre=$('#opDestBs',el)?$('#opDestBs',el).value.trim():'Cuenta Bancaria Empresa';
        }

        const id='CAMB-'+pad((S.cambiosDivisas||[]).length+1,4);
        const op={
          id,tipo,ts:Date.now(),
          vendedor:{nombre,ci,tel},
          montoUsd,tasa,tasaBcv:S.cfg.rate,montoBs,
          medioBs,bancoOrigen:bancoOrig,bancoDestino:bancoDest,refBs,
          destinoTipo,destinoNombre,
          destinatarioZelle,titularZelle,confZelle,seriales,
          cxpId,cxpDoc,notas
        };

        if(!S.cambiosDivisas)S.cambiosDivisas=[];
        S.cambiosDivisas.push(op);
        save();
        msg('Operación cambiaria '+id+' registrada con éxito.');
        if(onDone)onDone();
        printComprobanteDivisas(op);
        return false;
      }}
    ]
  });
}

function divisasDlg(filterType){
  let fType=filterType||'ALL', fQ='';
  const el=h('<div class="form">'+
    '<div class="kpis" id="divKpis"></div>'+
    '<div class="invbar" style="margin-top:6px">'+
      '<label for="divType">Tipo de Operación</label>'+
      '<select class="fld" id="divType" style="max-width:260px">'+
        '<option value="ALL">Todas las operaciones cambiarias</option>'+
        '<option value="ZELLE_PROV">Solo Zelle a Proveedores (CxP)</option>'+
        '<option value="USD_EFECTIVO">Solo Compra USD Efectivo</option>'+
        '<option value="ZELLE_PROPIO">Solo Zelle Propio</option>'+
        '<option value="VENTA_USD">Solo Canje / Venta USD</option>'+
      '</select>'+
      '<label for="divQ">Buscar</label>'+
      '<input class="fld" id="divQ" placeholder="Vendedor, C.I., proveedor, confirmation..." autocomplete="off">'+
      '<button class="btn primary" id="divNewBtn">+ Registrar Operación Cambiaria (USD / Zelle)</button>'+
    '</div>'+
    '<div class="gridwrap tallwrap" style="height:250px"><table class="grid" style="min-width:980px">'+
      '<thead><tr>'+
        '<th>ID / Fecha</th>'+
        '<th>Tipo Operación</th>'+
        '<th>Vendedor Divisas (Tercero)</th>'+
        '<th>Destino / Beneficiario</th>'+
        '<th class="r">Monto US$</th>'+
        '<th class="r">Tasa (Bs/$)</th>'+
        '<th class="r">Monto Pagado Bs.</th>'+
        '<th>Ref. Bolívares</th>'+
        '<th>Confirmation / Serial</th>'+
        '<th class="c">Acciones</th>'+
      '</tr></thead>'+
      '<tbody id="divBody"></tbody>'+
    '</table></div>'+
    '<p class="hint">Módulo de trazabilidad para la adquisición y canje de divisas (efectivo físico y transferencias Zelle trianguladas) conforme a los estándares de auditoría administrativa y fiscal.</p>'+
  '</div>');

  const draw=()=>{
    const all=S.cambiosDivisas||[];
    const totEfeUsd=r2(all.filter(x=>x.tipo==='USD_EFECTIVO').reduce((a,x)=>a+x.montoUsd,0));
    const totZelUsd=r2(all.filter(x=>x.tipo==='ZELLE_PROV'||x.tipo==='ZELLE_PROPIO').reduce((a,x)=>a+x.montoUsd,0));
    const totBsOut=r2(all.filter(x=>x.tipo!=='VENTA_USD').reduce((a,x)=>a+x.montoBs,0));
    const provOps=all.filter(x=>x.tipo==='ZELLE_PROV').length;

    $('#divKpis',el).innerHTML=
      '<div class="kpi"><span>USD Comprado en Efectivo</span><b class="ok">'+usd(totEfeUsd)+'</b><small>Ingresado a caja</small></div>'+
      '<div class="kpi"><span>USD Comprado en Zelle</span><b class="ok">'+usd(totZelUsd)+'</b><small>Proveedores y cuentas</small></div>'+
      '<div class="kpi"><span>Bolívares Egresados (Bs.)</span><b class="warn">'+bsf(totBsOut)+'</b><small>Liquidado vía PM/TRF</small></div>'+
      '<div class="kpi"><span>Pagos Triangulados a Proveedores</span><b>'+provOps+' facturas</b><small>Trazabilidad en CxP</small></div>';

    const q=norm(fQ);
    const filtered=all.filter(x=>{
      if(fType!=='ALL'&&x.tipo!==fType)return false;
      if(q){
        const txt=norm([x.id,x.vendedor.nombre,x.vendedor.ci,x.destinoNombre,x.refBs,x.confZelle,x.cxpDoc].join(' '));
        if(!txt.includes(q))return false;
      }
      return true;
    }).slice().reverse();

    const tagClass={
      'ZELLE_PROV':'cambio-tag zel-prv',
      'USD_EFECTIVO':'cambio-tag usd-efe',
      'ZELLE_PROPIO':'cambio-tag zel-own',
      'VENTA_USD':'cambio-tag vta'
    };
    const tagShort={
      'ZELLE_PROV':'Zelle Proveedor',
      'USD_EFECTIVO':'USD Efectivo',
      'ZELLE_PROPIO':'Zelle Propio',
      'VENTA_USD':'Venta USD'
    };

    const rows=filtered.map(x=>{
      return '<tr>'+
        '<td><b>'+esc(x.id)+'</b><br><small class="dim">'+fmtDT(x.ts)+'</small></td>'+
        '<td><span class="'+(tagClass[x.tipo]||'cambio-tag')+'">'+(tagShort[x.tipo]||x.tipo)+'</span></td>'+
        '<td><b>'+esc(x.vendedor.nombre)+'</b><br><span class="sku-tag">'+esc(x.vendedor.ci)+'</span>'+(x.vendedor.tel?' &middot; <small>'+esc(x.vendedor.tel)+'</small>':'')+'</td>'+
        '<td><b>'+esc(x.destinoNombre)+'</b>'+(x.cxpDoc?'<br><small style="color:#1842B8">Doc: '+esc(x.cxpDoc)+'</small>':'')+'</td>'+
        '<td class="r" style="font-weight:700;color:#1842B8">'+usd(x.montoUsd)+'</td>'+
        '<td class="r">'+nf(x.tasa)+'</td>'+
        '<td class="r" style="font-weight:600">'+bsf(x.montoBs)+'</td>'+
        '<td class="mono" style="font-size:11px">'+esc(x.refBs)+'<br><small class="dim">'+esc(x.medioBs)+'</small></td>'+
        '<td class="mono" style="font-size:11px">'+(x.confZelle?'<span style="background:#fef08a;padding:1px 4px;border-radius:3px">'+esc(x.confZelle)+'</span>':(x.seriales?'<small>'+esc(x.seriales)+'</small>':'-'))+'</td>'+
        '<td class="c" style="white-space:nowrap">'+
          '<button class="btn mini2" data-pr-cambio="'+x.id+'" title="Ver e imprimir comprobante">Comprobante</button> '+
          (x.cxpId?'<button class="btn mini2" data-cxp-link="'+x.cxpId+'" title="Ver en Cuentas por Pagar">Ver CxP</button> ':'')+
          '<button class="btn mini2" data-del-cambio="'+x.id+'" style="color:#dc2626" title="Eliminar registro">&times;</button>'+
        '</td>'+
      '</tr>';
    }).join('');

    $('#divBody',el).innerHTML=rows||'<tr class="empty"><td colspan="10">No hay operaciones cambiarias registradas que coincidan con el filtro.</td></tr>';
  };

  el.addEventListener('change',e=>{
    if(e.target.id==='divType'){fType=e.target.value;draw();}
  });
  el.addEventListener('input',e=>{
    if(e.target.id==='divQ'){fQ=e.target.value;draw();}
  });
  el.addEventListener('click',e=>{
    if(e.target.id==='divNewBtn'){
      newOperacionCambiariaDlg({},()=>{draw();});
      return;
    }
    const prBtn=e.target.closest('[data-pr-cambio]');
    if(prBtn){
      const op=(S.cambiosDivisas||[]).find(x=>x.id===prBtn.dataset.prCambio);
      if(op)printComprobanteDivisas(op);
      return;
    }
    const cxpBtn=e.target.closest('[data-cxp-link]');
    if(cxpBtn){
      cxpDlg(cxpBtn.dataset.cxpLink);
      return;
    }
    const delBtn=e.target.closest('[data-del-cambio]');
    if(delBtn){
      const cid=delBtn.dataset.delCambio;
      const op=(S.cambiosDivisas||[]).find(x=>x.id===cid);
      if(!op)return;
      ask('Eliminar Operación Cambiaria',
        '¿Desea eliminar la operación '+cid+' ('+usd(op.montoUsd)+')?'+(op.cxpId?' Nota: esto no revertirá automáticamente el saldo de la factura en CxP salvo que lo modifique en ese módulo.':''),
        'Eliminar',
        ()=>{
          S.cambiosDivisas=S.cambiosDivisas.filter(x=>x.id!==cid);
          save();draw();msg('Operación cambiaria eliminada.');
        }
      );
      return;
    }
  });

  openWin({
    title:'Operaciones Cambiarias y Compra de Divisas (USD Efectivo y Zelle)',
    w:1060,body:el,
    foot:[
      {label:'Ir a Cuentas por Pagar (CxP)',left:true,fn:()=>{cxpDlg();return false;}},
      {label:'Cerrar',primary:true}
    ],
    onOpen:()=>{draw();}
  });
}


/* ---------- Módulo de Gestión y Conciliación CASHEA (BNPL) ---------- */
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
    };,
  TICKET_FONTS: [
  {id:'ibm',name:'Térmica POS 80mm (IBM Plex Mono)',css:'"IBM Plex Mono",Consolas,"Liberation Mono",monospace'},
  {id:'jetbrains',name:'Térmica Alta Nitidez (JetBrains Mono)',css:'"JetBrains Mono",Consolas,monospace'},
  {id:'courier',name:'Térmica Fiscal Clásica (Courier Prime / Courier New)',css:'"Courier Prime","Courier New",Courier,monospace'},
  {id:'roboto',name:'Térmica Condensada Epson/Bixolon (Roboto Mono)',css:'"Roboto Mono","Lucida Console",Consolas,monospace'},
  {id:'inconsolata',name:'Térmica Compacta Tirilla (Inconsolata / Lucida)',css:'"Inconsolata","Lucida Console",Consolas,monospace'},
  {id:'sans',name:'Térmica Comercial Moderna (Segoe UI / Tahoma Tabular)',css:'"Segoe UI",Tahoma,Verdana,sans-serif'}
];
function getTicketFontCss(id){
  const f=TICKET_FONTS.find(x=>x.id===id)||TICKET_FONTS[0];
  return f.css;
}
function applyTicketStyle(pre){
  if(!pre)return;
  const fId=S.cfg.ticketFont||'ibm';
  const sz=S.cfg.ticketSize||'12';
  const bold=!!S.cfg.ticketBold;
  pre.style.fontFamily=getTicketFontCss(fId);
  pre.style.fontSize=sz+'px';
  pre.style.fontWeight=bold?'700':'500';
  pre.style.lineHeight=fId==='sans'?'1.32':'1.36';
}
function ticketText(s){
  const Wd=40,ln='-'.repeat(Wd),dln='='.repeat(Wd);
  const ctr=t=>' '.repeat(Math.max(0,Math.floor((Wd-t.length)/2)))+t;
  const row=(a,b)=>{a=String(a);b=String(b);return a+' '.repeat(Math.max(1,Wd-a.length-b.length))+b;};
  const cut=(t,n)=>t.length>n?t.slice(0,n-1)+'…':t;
  const L=[];
  if(s.void)L.push(dln,ctr('*** VENTA ANULADA ***'),dln);
  L.push(ctr(cut(S.cfg.empresa.toUpperCase(),Wd)),ctr('RIF: '+S.cfg.rif));
  L.push(dln,row('RECIBO / TICKET: '+pad(s.no),fmtDT(s.ts)),row('Nº Control: '+(s.ctrlNo||('00-'+pad(s.no,8))),'Tasa BCV: '+nf(s.rate||S.cfg.rate)+' Bs.'),row('Cajero: '+S.cfg.cajero,'Caja '+S.cfg.caja),'Cliente: '+cut(s.client.name,Wd-9),'RIF/C.I.: '+s.client.rif,ln,row('CANT·U.M. x PRECIO (IVA)','SUBTOTAL US$'),ln);
  s.lines.forEach(l=>{
    const uLabel=(l.unit||'und').toUpperCase();
    const tTag=l.taxRate===0?'(E 0%)':(l.taxRate===8?'(R 8%)':(l.taxRate===31?'(A 31%)':'(G 16%)'));
    L.push(cut(l.desc,Wd));
    L.push(row('  '+fq(l.qty)+' '+uLabel+' x '+nf(l.price)+' '+tTag+(l.disc?' (-'+fq(l.disc)+'%)':''),nf(l.net)));
  });
  L.push(ln,row('Subtotal US$',nf(s.sub)));
  if(s.disc)L.push(row('Descuento US$','-'+nf(s.disc)));
  if(s.baseEx>0&&s.baseG16>0){
    L.push(row('Base Gravada 16 % US$',nf(s.baseG16)));
    if(s.baseR8>0)L.push(row('Base Reducida 8 % US$',nf(s.baseR8)));
    if(s.baseA31>0)L.push(row('Base Suntuaria 31 % US$',nf(s.baseA31)));
    L.push(row('Ventas Exentas (0 %) US$',nf(s.baseEx)));
  }else if(s.baseEx>0){
    L.push(row('Ventas Exentas (0 %) US$',nf(s.baseEx)));
  }else{
    L.push(row('Base imponible US$',nf(s.base)));
  }
  L.push(row('Total I.V.A. US$',nf(s.iva)));
  if(s.igtf)L.push(row('IGTF (3 % Divisas) US$',nf(s.igtf)));
  const due=r2(s.total+s.igtf);
  s.pays.forEach(p=>{
    const refTxt=p.ref?(' Ref:'+p.ref):'';
    L.push(row(' '+cut(p.name+refTxt,26),(p.cur==='USD'?'US$ ':'Bs. ')+nf(p.amount)));
  });
  if(s.change>=0.01)L.push(row(' Vuelto (equiv. US$)',nf(s.change)));
  if(s.cashea){
    L.push(ln,ctr('PAGADO CON CASHEA (3 CUOTAS BNPL)'));
    L.push(row(' Aprobación / Token:',s.cashea.aprobacion));
    L.push(row(' C.I. Cliente:',s.cashea.ci||s.client.rif));
    if(s.cashea.inicialUsd>0){
      L.push(row(' Inicial en caja:',usd(s.cashea.inicialUsd)));
    }
    L.push(row(' Financiado Cashea:',usd(s.cashea.financiadoUsd)));
    L.push(row(' '+(s.cashea.cuotasCount||3)+' cuota(s) quincenales:',usd(s.cashea.cuotaUsd)+' c/u'));
  }
  L.push(ln,ctr('¡GRACIAS POR SU COMPRA!'),ctr('Impresora Térmica 80mm · Control Interno'));
  return L.join('\n');
}
function showTicket(s){
  if(!S.cfg.ticketFont)S.cfg.ticketFont='ibm';
  if(!S.cfg.ticketSize)S.cfg.ticketSize='12';
  const fontOpts=TICKET_FONTS.map(f=>'<option value="'+f.id+'"'+(S.cfg.ticketFont===f.id?' selected':'')+'>'+esc(f.name)+'</option>').join('');
  const el=h('<div class="form">'+
    '<div class="invbar" style="background:var(--alt);padding:5px 7px;border:1px solid var(--lo)">'+
      '<label for="tkFont">Letra 80mm:</label>'+
      '<select class="fld" id="tkFont" style="flex:1;min-width:170px">'+fontOpts+'</select>'+
      '<label for="tkSize">Tamaño:</label>'+
      '<select class="fld" id="tkSize" style="width:66px;flex:none"><option value="11"'+(S.cfg.ticketSize==='11'?' selected':'')+'>11 px</option><option value="12"'+(S.cfg.ticketSize==='12'?' selected':'')+'>12 px</option><option value="13"'+(S.cfg.ticketSize==='13'?' selected':'')+'>13 px</option></select>'+
      '<label class="chk" style="font-size:11.5px"><input type="checkbox" id="tkBold" '+(S.cfg.ticketBold?'checked':'')+'> Negrita térmica</label>'+
    '</div>'+
    '<div class="ticket-roll-wrap"><pre class="ticket-80mm" id="ticketPre"></pre></div>'+
    '<p class="hint">Formato de rollo térmico de <b>80mm</b>. El tipo de letra seleccionado queda guardado para todos los tickets y recibos de caja.</p>'+
  '</div>');
  const pre=$('#ticketPre',el);
  pre.textContent=ticketText(s);
  applyTicketStyle(pre);

  el.addEventListener('change',e=>{
    if(e.target.id==='tkFont'||e.target.id==='tkSize'||e.target.id==='tkBold'){
      S.cfg.ticketFont=$('#tkFont',el).value;
      S.cfg.ticketSize=$('#tkSize',el).value;
      S.cfg.ticketBold=$('#tkBold',el).checked;
      applyTicketStyle(pre);
      save();
    }
  });

  openWin({title:'Recibo / Ticket de Caja Térmica 80mm — Nº '+pad(s.no),w:500,body:el,foot:[
    {label:'Imprimir 80mm',left:true,fn:()=>{
      document.body.classList.add('printing-ticket-80mm');
      window.print();
      setTimeout(()=>document.body.classList.remove('printing-ticket-80mm'),500);
      return false;
    }},
    {label:'Copiar texto',fn:()=>{
      const txt=ticketText(s);
      const fallback=()=>{const r=document.createRange();r.selectNodeContents(pre);const sel=getSelection();sel.removeAllRanges();sel.addRange(r);msg('Texto seleccionado. Cópielo con Ctrl+C.');};
      try{navigator.clipboard.writeText(txt).then(()=>msg('Ticket copiado.'),fallback);}catch(e){fallback();}
      return false;
    }},
    {label:'Cerrar',primary:true,fn:()=>{setTimeout(()=>$('#entry').focus(),0);}}
  ]});
}

/* ---------- ventas del día / cierre ---------- */
function salesDlg(){
  let selNo=null,armed=0;
  const el=h('<div class="form"><div class="gridwrap saleswrap"><table class="grid" style="min-width:680px"><thead><tr><th>Factura</th><th>Hora</th><th>Cliente</th><th class="r">Total US$</th><th class="r">Total Bs.</th><th>Pago</th></tr></thead><tbody id="saBody"></tbody></table></div><div class="row"><button class="btn" id="saView">Ver ticket</button><button class="btn" id="saVoid">Anular venta</button></div><div class="cierre" id="saCierre"></div><p class="hint" id="saNote"></p></div>');
  const todays=()=>S.sales.filter(s=>sameDay(s.ts)&&s.cashbox===currentCaja()).sort((a,b)=>b.no-a.no);
  const draw=()=>{
    const list=todays();
    $('#saBody',el).innerHTML=list.length?list.map(s=>{const due=r2(s.total+s.igtf);return '<tr data-no="'+s.no+'" class="'+(s.no===selNo?'sel':'')+(s.void?' void':'')+'"><td class="mono">'+pad(s.no)+(s.void?' (anulada)':'')+'</td><td>'+fmtT(new Date(s.ts))+'</td><td>'+esc(s.client.name)+'</td><td class="r">'+nf(due)+'</td><td class="r">'+nf(due*s.rate)+'</td><td>'+esc(s.pays.map(p=>p.name.split(' (')[0]).join(' + '))+'</td></tr>';}).join(''):'<tr class="empty"><td colspan="6">Todavía no hay ventas hoy.</td></tr>';
    const ok=list.filter(s=>!s.void);
    const by={};
    ok.forEach(s=>s.pays.forEach(p=>{const k=p.id;by[k]=by[k]||{name:p.name,cur:p.cur,n:0,amt:0};by[k].n++;by[k].amt+=p.amount;}));
    const sum=(f)=>r2(ok.reduce((a,s)=>a+f(s),0));
    const metRows=Object.keys(by).map(k=>'<tr><td>'+esc(by[k].name.split(' (')[0])+'</td><td>'+by[k].n+'</td><td>'+(by[k].cur==='USD'?'US$ ':'Bs. ')+nf(by[k].amt)+'</td></tr>').join('')||'<tr><td colspan="3" class="dim">Sin cobros.</td></tr>';
    $('#saCierre',el).innerHTML='<table class="sumt"><thead><tr><th>Cierre por forma de pago</th><th>Ops.</th><th>Recibido</th></tr></thead><tbody>'+metRows+'</tbody></table><table class="sumt"><thead><tr><th>Totales del día</th><th>US$</th></tr></thead><tbody><tr><td>Ventas válidas</td><td>'+ok.length+'</td></tr><tr><td>Base imponible</td><td>'+nf(sum(s=>s.base))+'</td></tr><tr><td>IVA 16 %</td><td>'+nf(sum(s=>s.iva))+'</td></tr><tr><td>IGTF 3 %</td><td>'+nf(sum(s=>s.igtf))+'</td></tr><tr class="tot"><td>Total facturado</td><td>'+nf(sum(s=>s.total+s.igtf))+'</td></tr><tr><td>Total en Bs. (a la tasa de cada venta)</td><td>'+nf(sum(s=>(s.total+s.igtf)*s.rate))+'</td></tr></tbody></table>';
    $('#saNote',el).textContent=list.some(s=>s.no<1043)&&!saved?'Las facturas 1038 a 1042 son ejemplos para mostrar el cierre.':'';
    $('#saView',el).disabled=!selNo;$('#saVoid',el).disabled=!selNo||!!(S.sales.find(s=>s.no===selNo&&s.cashbox===currentCaja())||{}).void;
    $('#saVoid',el).textContent='Anular venta';
  };
  el.addEventListener('click',e=>{
    const tr=e.target.closest('tr[data-no]');
    if(tr){selNo=+tr.dataset.no;armed=0;draw();return;}
    const s=S.sales.find(x=>x.no===selNo&&x.cashbox===currentCaja());
    if(e.target.id==='saView'&&s){showTicket(s);}
    if(e.target.id==='saVoid'&&s&&!s.void){
      if(window.SIFERAccess&&typeof window.SIFERAccess.requestPin==='function'&&!window.SIFERAccess.requestPin('Anular factura '+pad(s.no)))return;
      if(!armed||Date.now()-armed>5000){armed=Date.now();e.target.textContent='Confirmar anulación';return;}
      s.void=true;
      s.transType='03-ANUL';
      s.voidDoc='NC-'+pad(s.no,8);
      s.voidTs=Date.now();
      s.lines.forEach(l=>{
        const p=prod(l.code);
        if(p){
          p.stock=r2(p.stock+l.qty);
          addKardex({
            code:p.code,type:'ANULACIÓN',dir:'IN',doc:'FAC-'+pad(s.no),
            party:'Reingreso por anulación factura ('+s.client.name+')',
            qty:l.qty,stockAfter:p.stock,cost:p.cost,user:S.cfg.cajero
          });
        }
      });
      S.cxc=(S.cxc||[]).filter(x=>!(x.saleNo===s.no&&x.cashbox===currentCaja()));
      armed=0;save();renderCatalog();draw();msg('Factura '+pad(s.no)+' anulada. Se devolvió la mercancía al inventario y Kardex.');
    }
  });
  openWin({title:'Ventas del día y cierre de caja',w:900,body:el,foot:[
    {label:'Libro Fiscal SENIAT',left:true,fn:()=>{seniatSudebanDlg('ventas');return false;}},
    {label:'Cerrar',primary:true}
  ],onEnter:()=>{},onOpen:()=>{draw();}});
}

/* ==========================================================================
   MÓDULO DEDICADO: CONTROL SENIAT / SUDEBAN
   Cumplimiento fiscal, libros obligatorios, IGTF, auditoría cambiaria BCV,
   conciliación de medios de pago SUDEBAN y generador de TXT oficial.
   ========================================================================== */
});
})();
