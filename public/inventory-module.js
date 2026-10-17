/* Inventory, catalog, and stock workflows. Dependencias compartidas: estado y utilidades globales de main.js. */
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

/* Mapa OEM cargado desde /catalog-oem.js antes de este archivo. */

/* LUBRICANT_PRES_CONFIG se carga desde /catalog-master-data.js. */

/* Base de productos maestros de alta rotación en Venezuela (Lubricantes y Repuestos) */
/* MASTER_CURATED_CATALOG se carga desde /catalog-master-data.js. */

/* Matriz combinatoria automotriz para consulta de los 2.500.000 repuestos indexados */
/* AUTO_MODELS_MATRIX se carga desde /catalog-automotive-data.js. */

/* COMPONENT_TYPES se carga desde /catalog-automotive-data.js. */

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
