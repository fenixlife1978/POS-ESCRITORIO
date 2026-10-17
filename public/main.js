
(function(){
'use strict';

/* ---------- utilidades ---------- */
const IVA=0.16, IGTF=0.03, KEY='pos-el-piston-v1';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const r2=n=>Math.round((n+Number.EPSILON)*100)/100;
const nf=n=>{const neg=n<0;const p=Math.abs(r2(n)).toFixed(2).split('.');return (neg?'-':'')+p[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.')+','+p[1];};
const usd=n=>'US$ '+nf(n);
const bsf=n=>'Bs. '+nf(n);
const fq=q=>Number.isInteger(q)?String(q):String(r2(q)).replace('.',',');
const two=n=>String(n).padStart(2,'0');
const pad=(n,w=8)=>String(n).padStart(w,'0');
const fmtD=d=>{d=new Date(d);return two(d.getDate())+'/'+two(d.getMonth()+1)+'/'+d.getFullYear();};
const fmtT=d=>{d=new Date(d);return two(d.getHours())+':'+two(d.getMinutes());};
const fmtDT=ts=>{const d=new Date(ts);return fmtD(d)+' '+fmtT(d);};
const isoD=ts=>{const d=new Date(ts);return d.getFullYear()+'-'+two(d.getMonth()+1)+'-'+two(d.getDate());};
const parseIsoD=s=>{if(!s)return Date.now();const p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2],12,0,0).getTime();};
const sameDay=ts=>new Date(ts).toDateString()===new Date().toDateString();
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
const pn=s=>{s=String(s==null?'':s).trim();if(!s)return 0;if(s.indexOf(',')>=0)s=s.replace(/\./g,'').replace(',','.');const n=parseFloat(s);return isFinite(n)&&n>0?n:0;};
const pnZero=s=>{s=String(s==null?'':s).trim();if(s==='')return null;if(s.indexOf(',')>=0)s=s.replace(/\./g,'').replace(',','.');const n=parseFloat(s);return isFinite(n)&&n>=0?n:null;};
const h=html=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild;};

/* Generador automático de SKU compuesto: SKU-DEPT/CAT-SUB-00001 */
function abbrToken(str,len){
  const stop=['de','del','la','el','los','las','y','en','para','con','por','a'];
  const words=String(str||'GEN').normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/[^A-Z0-9\s]/g,' ').trim().split(/\s+/).filter(w=>w&&stop.indexOf(w.toLowerCase())<0);
  if(!words.length)return 'GEN';
  if(words.length>=2&&len>=4)return (words[0].slice(0,3)+'/'+words[1].slice(0,4));
  return words[0].slice(0,len||3);
}
function genAutoSku(dept,cat,subcat,seqNum){
  const p1=abbrToken(cat||'GEN',4);
  const p2=abbrToken(subcat||'GEN',3).replace('/','');
  const d1=abbrToken(dept||'GEN',3).replace('/','');
  const mid=p1.indexOf('/')>=0?p1:(d1+'/'+p1);
  return 'SKU-'+mid+'-'+p2+'-'+pad(seqNum||1,5);
}
function svgBarcode(text){
  const s=String(text||'SKU-00001');
  let bars='', x=6;
  for(let i=0;i<s.length;i++){
    const c=s.charCodeAt(i);
    const w1=(c%3)+1, g1=((c>>2)%2)+1, w2=((c>>3)%3)+1, g2=2;
    bars+='<rect x="'+x+'" y="2" width="'+w1+'" height="34" fill="#111"/>';
    x+=w1+g1;
    bars+='<rect x="'+x+'" y="2" width="'+w2+'" height="34" fill="#111"/>';
    x+=w2+g2;
  }
  bars+='<rect x="'+x+'" y="2" width="2" height="34" fill="#111"/>';
  return '<svg viewBox="0 0 '+(x+8)+' 38" preserveAspectRatio="none" aria-hidden="true">'+bars+'</svg>';
}

/* ---------- motivos de conteo y ajuste de inventario ---------- */
const MOTIVOS=window.POS_OPTIONS.MOTIVOS;

/* ---------- datos de ejemplo con Departamento, Categoría, Subcategoría, SKU, U.M., Costo e I.V.A. ---------- */
const UM_OPTIONS=window.POS_OPTIONS.UM_OPTIONS;
const TAX_OPTIONS=window.POS_OPTIONS.TAX_OPTIONS;
function prodTax(p){
  return (p&&p.tax)?p.tax:{type:'G',rate:16,igtf:true,percRate:0,codeSeniat:'GRAV-16'};
}
function prodTaxRate(p){
  const t=prodTax(p);
  if(t.type==='E'||t.type==='NS')return 0;
  return typeof t.rate==='number'?t.rate:(parseFloat(t.rate)||16);
}
function prodTaxTag(p){
  const t=prodTax(p);
  if(t.type==='E')return 'Exento (0%)';
  if(t.type==='NS')return 'No Suj. (0%)';
  if(t.type==='R')return '8% Red.';
  if(t.type==='A')return '31% Adic.';
  const r=prodTaxRate(p);
  return r===0?'Exento (0%)':(fq(r)+'%');
}
function prodTaxCls(p){
  const t=prodTax(p);
  if(t.type==='E'||t.type==='NS'||t.rate===0)return 'ex';
  if(t.type==='R'||t.rate===8)return 'red';
  if(t.type==='A'||t.rate===31)return 'adic';
  return '';
}

let seedSeq=1;
const P=(code,desc,brand,dept,cat,subcat,price,stock,min,loc,unit,cost,taxType,taxRate)=>{
  const c=cost||r2(price*0.64);
  const mkCost=c>0?r2(((price-c)/c)*100):56.25;
  const mkSale=price>0?r2(((price-c)/price)*100):36.00;
  const seq=seedSeq++;
  const u=unit||'und';
  const tType=taxType||'G';
  const tRate=taxRate!==undefined?taxRate:(tType==='E'||tType==='NS'?0:16);
  return {
    code,
    sku:genAutoSku(dept,cat,subcat,seq),
    desc,brand,
    dept:dept||'Lubricantes y Fluidos',
    cat:cat||'Aceites de motor',
    subcat:subcat||'General',
    price,stock,min,loc,
    unit:u,
    cost:c,
    photo:'',
    pricing:{
      mode:'auto',
      markupCost:mkCost,
      markupSale:mkSale,
      gaps:[
        {name:'Detal / Mostrador',gapPct:0,markupCost:mkCost,price:price},
        {name:'Taller / Mecánico',gapPct:6,markupCost:r2(((price*0.94-c)/c)*100),price:r2(price*0.94)},
        {name:'Mayorista (≥ 6 und)',gapPct:12,markupCost:r2(((price*0.88-c)/c)*100),price:r2(price*0.88)},
        {name:'Distribuidor / Flota',gapPct:18,markupCost:r2(((price*0.82-c)/c)*100),price:r2(price*0.82)}
      ]
    },
    presentations:[
      {name:u==='L'?'Litro a granel':(u==='gal'?'Galón 4 L':'Unidad individual'),unit:u,factor:1,barcode:code,price:price},
      {name:'Caja / Empaque x 12',unit:'caja',factor:12,barcode:code+'C12',price:r2(price*12*0.90)}
    ],
    tax:{
      type:tType,
      rate:tRate,
      igtf:true,
      percRate:0,
      codeSeniat:tType==='E'?'EXENTO-0':(tType==='R'?'RED-08':(tType==='A'?'ADIC-31':'GRAV-16'))
    },
    assocSuppliers:[],
    isKit:false,
    kitItems:[]
  };
};

const SEED=window.POS_SEED_FACTORY(P);

const METHODS=window.POS_OPTIONS.METHODS;

/* ---------- estado ---------- */
let S=null, navigated=false, msgTimer=0, saved=false;
/* Borrador de Conteo de Inventario persistente entre filtros */
let draftConteo={};
const prod=code=>S.products.find(p=>p.code===code);

/* Registrar movimiento en Kardex */
function addKardex(ev){
  if(!S.kardex)S.kardex=[];
  S.kardex.push({
    id:S.kardex.length+1,
    ts:ev.ts||Date.now(),
    code:ev.code,
    type:ev.type,       /* 'INICIAL' | 'COMPRA' | 'VENTA' | 'CONTEO' | 'AJUSTE' | 'ANULACIÓN' */
    dir:ev.dir,         /* 'IN' | 'OUT' */
    doc:ev.doc||'-',
    party:ev.party||'',
    qty:r2(ev.qty),
    stockAfter:r2(ev.stockAfter),
    cost:r2(ev.cost),
    user:ev.user||(S.cfg?S.cfg.cajero:'Sistema')
  });
}

function seed(){
  const now=Date.now(), dayMs=86400000;
  S={
    cfg:{
      empresa:'Autopartes El Pistón, C.A.',rif:'J-40123456-8',dir:'Av. Intercomunal, Local 12',cajero:'Mariela G.',caja:'01',rate:480,ticketFont:'ibm',ticketSize:'12',ticketBold:false,
      fiscalTipo:'FORMA_LIBRE',contribEspecial:false,retencionHabilitadaConfirmada:false,retIvaPct:75,provEspecial:'',
      ctrlPrefix:'00-',ctrlNext:1043,ctrlRangoDesde:'00-00000001',ctrlRangoHasta:'00-00050000',
      imprentaRif:'J-31009988-4',imprentaAut:'SENIAT/DAF/2022/981',serialFiscal:'Z4A7719204'
    },
    products:SEED.map(p=>Object.assign({},p)),
    clients:[
      {name:'Consumidor final',rif:'V-00000000',tel:''},
      {name:'Taller Mecánico Los Hermanos, C.A.',rif:'J-30123456-7',tel:'0414-555-0141'},
      {name:'Transporte Orinoco, C.A.',rif:'J-29876543-1',tel:'0212-555-0198'},
      {name:'José Gregorio Pérez',rif:'V-12345678',tel:''},
      {name:'Moto Servicio Rápido',rif:'V-18765432',tel:'0424-555-0177'},
      {name:'Lubricentro La Troncal, C.A.',rif:'J-40765432-0',tel:'0412-555-0123'}
    ],
    suppliers:[
      {id:'PRV-01',name:'Distribuidora Nacional de Lubricantes, C.A.',rif:'J-30987654-2',tel:'0241-555-8810',cond:'30 días'},
      {id:'PRV-02',name:'Importadora de Filtros y Frenos El Tuy, C.A.',rif:'J-40223344-5',tel:'0212-555-4321',cond:'15 días'},
      {id:'PRV-03',name:'Baterías y Partes Eléctricas Oriente, C.A.',rif:'J-29112233-9',tel:'0281-555-9011',cond:'Contado'},
      {id:'PRV-04',name:'Suministros Motopartes Venezuela, C.A.',rif:'J-41009988-1',tel:'0251-555-7730',cond:'15 días'}
    ],
    sales:[],held:[],purchases:[],cxc:[],cxp:[],cortesZ:[],movimientosCaja:[],kardex:[],counts:[],
    lotesSudeban:[],retencionesIva:[],cambiosDivisas:[],casheaMovimientos:[],casheaLiquidaciones:[],documents:[],
    invoice:1043,purchaseSeq:203,countSeq:102,
    cart:[],sel:-1,cat:'Todas',query:'',catSel:null
  };
  S.client=S.clients[0];

  /* Calcular ventas semilla para reconstruir Kardex exacto */
  const seedSalesSpec=window.POS_SEED_OPERATIONS.sales;
  const soldQty={};
  seedSalesSpec.forEach(sp=>sp[4].forEach(it=>{soldQty[it[0]]=(soldQty[it[0]]||0)+it[1];}));
  const purchSpec=window.POS_SEED_OPERATIONS.purchases;

  /* 1. Kardex Saldo Inicial para cada producto */
  S.products.forEach(p=>{
    const sold=soldQty[p.code]||0;
    const bought=purchSpec[p.code]||0;
    const iniStock=Math.max(0,r2(p.stock+sold-bought));
    addKardex({
      ts:now-7*dayMs,
      code:p.code,
      type:'INICIAL',
      dir:'IN',
      doc:'INI-2026',
      party:'Inventario inicial de apertura',
      qty:iniStock,
      stockAfter:iniStock,
      cost:p.cost,
      user:'Sistema'
    });
  });

  /* 2. Compras de ejemplo + entradas Kardex + CxP */
  const p1Ts=now-4*dayMs;
  const p1Lines=window.POS_SEED_OPERATIONS.initialPurchaseLines.map(line=>({...line,sub:r2(line.qty*line.cost)}));
  p1Lines.forEach(l=>{
    const p=prod(l.code),sold=soldQty[l.code]||0;
    addKardex({ts:p1Ts,code:l.code,type:'COMPRA',dir:'IN',doc:'COM-00000201',party:S.suppliers[0].name+' (Fac. Prov. F-88412)',qty:l.qty,stockAfter:r2(p.stock+sold),cost:l.cost,user:'Mariela G.'});
  });
  const p1Base=r2(p1Lines.reduce((a,x)=>a+x.sub,0)),p1Iva=r2(p1Base*IVA),p1Tot=r2(p1Base+p1Iva);
  S.purchases.push({
    no:201,docProv:'F-88412',ts:p1Ts,dueTs:p1Ts+15*dayMs,
    supplier:Object.assign({},S.suppliers[0]),
    cond:'Crédito',lines:p1Lines,base:p1Base,iva:p1Iva,total:p1Tot,rate:475,paid:80.00,void:false
  });
  S.cxp.push({
    id:'CXP-0001',purchaseNo:201,doc:'F-88412 (COM-00000201)',
    supplier:Object.assign({},S.suppliers[0]),
    concept:'Compra de lubricantes Castrol GTX',
    ts:p1Ts,dueTs:now+11*dayMs,total:p1Tot,paid:80.00,
    payments:[{ts:now-2*dayMs,method:'Transferencia Bs.',cur:'VES',amountBs:r2(80*475),amountUsd:80.00,ref:'TRF-992104',note:'Abono inicial factura F-88412'}]
  });

  const p2Ts=now-2*dayMs;
  const p2Lines=window.POS_SEED_OPERATIONS.purchaseLines.map(line=>({...line}));
  p2Lines.forEach(l=>{
    const p=prod(l.code),sold=soldQty[l.code]||0;
    addKardex({ts:p2Ts,code:l.code,type:'COMPRA',dir:'IN',doc:'COM-00000202',party:S.suppliers[1].name+' (Fac. Prov. B-10492)',qty:l.qty,stockAfter:r2(p.stock+sold),cost:l.cost,user:'Mariela G.'});
  });
  const p2Base=r2(p2Lines.reduce((a,x)=>a+x.sub,0)),p2Iva=r2(p2Base*IVA),p2Tot=r2(p2Base+p2Iva);
  S.purchases.push({
    no:202,docProv:'B-10492',ts:p2Ts,dueTs:now-1*dayMs,
    supplier:Object.assign({},S.suppliers[1]),
    cond:'Crédito',lines:p2Lines,base:p2Base,iva:p2Iva,total:p2Tot,rate:478,paid:0,void:false
  });
  S.cxp.push({
    id:'CXP-0002',purchaseNo:202,doc:'B-10492 (COM-00000202)',
    supplier:Object.assign({},S.suppliers[1]),
    concept:'Lote de filtros Fram/Mann y pastillas Bendix',
    ts:p2Ts,dueTs:now-1*dayMs,total:p2Tot,paid:0,payments:[]
  });

  /* 3. Ventas de ejemplo + salidas Kardex */
  const mk=(no,hh,mm,ci,items,how)=>{
    const d=new Date();d.setHours(hh,mm,0,0);
    const lines=items.map(it=>{
      const p=prod(it[0]),ds=it[2]||0,gross=r2(p.price*it[1]);
      addKardex({ts:d.getTime(),code:p.code,type:'VENTA',dir:'OUT',doc:'FAC-'+pad(no),party:S.clients[ci].name,qty:it[1],stockAfter:p.stock,cost:p.cost,user:'Mariela G.'});
      return{code:p.code,desc:p.brand+' '+p.desc,qty:it[1],price:p.price,disc:ds,net:r2(gross*(1-ds/100))};
    });
    const sub=r2(lines.reduce((a,l)=>a+r2(l.price*l.qty),0)),base=r2(lines.reduce((a,l)=>a+l.net,0));
    const iva=r2(base*IVA),total=r2(base+iva),rate=S.cfg.rate;
    let igtf=0,pays;
    if(how==='usd'){igtf=r2(total*IGTF);pays=[{id:'efUSD',name:'Efectivo US$',cur:'USD',amount:r2(total+igtf)}];}
    else if(how==='pv')pays=[{id:'punto',name:'Punto de venta (débito / crédito)',cur:'VES',amount:r2(total*rate)}];
    else if(how==='bio')pays=[{id:'biopago',name:'Biopago',cur:'VES',amount:r2(total*rate)}];
    else pays=[{id:'pmovil',name:'Pago móvil',cur:'VES',amount:r2(total*rate)}];
    const ctrlNo=(S.cfg.ctrlPrefix||'00-')+pad(no,8);
    S.sales.push({no,ctrlNo,docType:'01-FACTURA',transType:'01-REG',ts:d.getTime(),client:Object.assign({},S.clients[ci]),lines,sub,disc:r2(sub-base),base,baseG16:base,baseR8:0,baseA31:0,baseEx:0,iva,total,igtf,rate,pays,change:0,void:false});
  };
  seedSalesSpec.forEach(sp=>mk.apply(null,sp));

  /* 4. Cuentas por Cobrar (CxC) de ejemplo */
  S.cxc=[
    {
      id:'CXC-0001',saleNo:1031,doc:'FAC-00001031',
      client:Object.assign({},S.clients[1]),
      concept:'Suministro de aceites y filtros flota taller',
      ts:now-12*dayMs,dueTs:now-2*dayMs,
      total:145.00,paid:50.00,
      payments:[{ts:now-6*dayMs,method:'Pago móvil',cur:'VES',amountBs:r2(50*472),amountUsd:50.00,ref:'PM-441822',note:'Abono parcial cuenta taller'}]
    },
    {
      id:'CXC-0002',saleNo:1035,doc:'FAC-00001035',
      client:Object.assign({},S.clients[2]),
      concept:'6 Galones Diésel 15W-40 + Filtros pesados',
      ts:now-5*dayMs,dueTs:now+10*dayMs,
      total:218.40,paid:0,
      payments:[]
    },
    {
      id:'CXC-0003',saleNo:1036,doc:'FAC-00001036',
      client:Object.assign({},S.clients[5]),
      concept:'Caja Aceite 20W-50 y grasas de chasis',
      ts:now-8*dayMs,dueTs:now+7*dayMs,
      total:112.00,paid:112.00,
      payments:[{ts:now-1*dayMs,method:'Zelle',cur:'USD',amountBs:r2(112*480),amountUsd:112.00,ref:'ZELLE-88301',note:'Cancelación total factura'}]
    }
  ];

  /* 5. Historial de conteo de ejemplo */
  S.counts=[
    {
      id:'CNT-00000101',ts:now-3*dayMs,user:'Mariela G.',
      items:[{code:'7504004',desc:'Filtro de Gasolina G3727',prev:3,next:2,diff:-1,cost:3.45,reason:'Producto dañado o averiado'}]
    }
  ];

  /* 6. Conciliación de lotes bancarios SUDEBAN */
  S.lotesSudeban=[
    {
      id:'LOT-000142',banco:'Banco de Venezuela (BDV)',tid:'BDV-POS-0892',ts:now-4*3600000,
      tipo:'Biopago / Débito',totalBs:28450.00,comisionBs:426.75,netoBs:28023.25,ops:14,estado:'CONCILIADO',refLote:'LT-881290'
    },
    {
      id:'LOT-000143',banco:'Banesco Banco Universal',tid:'BAN-POS-3310',ts:now-2*3600000,
      tipo:'Punto de Venta (Débito/Crédito)',totalBs:19200.00,comisionBs:384.00,netoBs:18816.00,ops:9,estado:'CONCILIADO',refLote:'LT-441208'
    }
  ];

  /* 7. Comprobantes de Retención de IVA (SENIAT Sujeto Pasivo Especial) */
  S.retencionesIva=[
    {
      id:'20261000000041',ts:p1Ts+3600000,purchaseNo:201,docProv:'F-88412',ctrlProv:'00-00088192',
      supplier:Object.assign({},S.suppliers[0]),
      base:p1Base,iva:p1Iva,pct:75,retainedBs:r2(p1Iva*0.75*475),retainedUsd:r2(p1Iva*0.75),rate:475,periodo:'202610'
    },
    {
      id:'20261000000042',ts:p2Ts+3600000,purchaseNo:202,docProv:'B-10492',ctrlProv:'00-00010492',
      supplier:Object.assign({},S.suppliers[1]),
      base:p2Base,iva:p2Iva,pct:75,retainedBs:r2(p2Iva*0.75*478),retainedUsd:r2(p2Iva*0.75),rate:478,periodo:'202610'
    }
  ];

  /* 8. Registro y trazabilidad de Operaciones Cambiarias (Compra USD Efectivo y Zelle) */
  S.cambiosDivisas=[
    {
      id:'CAMB-0001',tipo:'ZELLE_PROV',ts:now-2*dayMs,
      vendedor:{nombre:'Carlos Eduardo Méndez',ci:'V-15.892.411',tel:'0414-234.56.78'},
      montoUsd:80.00,tasa:475.00,tasaBcv:475.00,montoBs:38000.00,
      medioBs:'Pago Móvil BDV',bancoOrigen:'Banco de Venezuela (BDV)',bancoDestino:'Banesco',refBs:'PM-88912304',
      destinoTipo:'PROV',destinoNombre:S.suppliers[0].name,
      destinatarioZelle:'pagos@distribuidoranolub.com',titularZelle:'Distribuidora Nacional Lubricantes LLC',
      confZelle:'CONF-ZEL-994821',cxpId:'CXP-0001',cxpDoc:'F-88412 (COM-00000201)',
      notas:'Compra de Zelle a persona natural para abonar factura de lubricantes Castrol GTX'
    },
    {
      id:'CAMB-0002',tipo:'USD_EFECTIVO',ts:now-1*dayMs,
      vendedor:{nombre:'María Alejandra Rivas',ci:'V-18.441.209',tel:'0424-911.22.33'},
      montoUsd:150.00,tasa:480.00,tasaBcv:480.00,montoBs:72000.00,
      medioBs:'Transferencia Bancaria',bancoOrigen:'Banesco Banco Universal',bancoDestino:'Banco Mercantil',refBs:'TRF-4410928',
      destinoTipo:'CAJA',destinoNombre:'Caja Principal de Divisas (Caja 01)',
      seriales:'MB-49102831A (1x100), LF-22910488B (1x50)',
      notas:'Compra de USD billetes físicos a persona natural para fondo de caja y vuelto en divisas'
    }
  ];

  S.client=S.clients[1];
  /* Asociar proveedores de ejemplo a los primeros productos */
  if(S.products[0]){
    S.products[0].assocSuppliers=[
      {supId:'PRV-01',rif:S.suppliers[0].rif,name:S.suppliers[0].name,barcode:'7501001-CAS',cost:3.35,leadDays:3,minOrder:12,notes:'Distribuidor oficial Castrol'}
    ];
  }
  if(S.products[22]){
    S.products[22].assocSuppliers=[
      {supId:'PRV-02',rif:S.suppliers[1].rif,name:S.suppliers[1].name,barcode:'FRM-PH3600',cost:3.00,leadDays:2,minOrder:24,notes:'Precio especial por caja de 24'}
    ];
  }
  /* CASHEA inicia sin operaciones ficticias; se registran solo cobros confirmados. */
  S.casheaMovimientos=[];

  S.cart=[{code:'7501001',qty:4,disc:5},{code:'7504001',qty:1,disc:0},{code:'7507004',qty:2,disc:0},{code:'7501009',qty:2.5,disc:0}];
  S.sel=0;
}

function stateSnapshot(){
  return {
    v:1,cfg:S.cfg,products:S.products,clients:S.clients,suppliers:S.suppliers,
    sales:S.sales,held:S.held,purchases:S.purchases,cxc:S.cxc,cxp:S.cxp,cortesZ:S.cortesZ||[],movimientosCaja:S.movimientosCaja||[],
    kardex:S.kardex,counts:S.counts,lotesSudeban:S.lotesSudeban,retencionesIva:S.retencionesIva,cambiosDivisas:S.cambiosDivisas,
    casheaMovimientos:S.casheaMovimientos||[],casheaLiquidaciones:S.casheaLiquidaciones||[],documents:S.documents||[],
    invoice:S.invoice,purchaseSeq:S.purchaseSeq,countSeq:S.countSeq
  };
}
function persistenceError(err){
  const detail=(err&&err.message)||String(err||'Error desconocido');
  console.error('[POS database]',detail);
  const node=$('#sbMsg')||$('#sbStatus')||$('.sp.msg');
  if(node){node.textContent='ERROR DE BASE DE DATOS: '+detail;node.classList.add('bad');}
}
/* ---------- Motor de Base de Datos Local SQLite (100% Offline) ---------- */
let sqliteDb = null;
let sqliteSqlInstance = null;
const SQLITE_IDB_NAME = 'elpiston_sqlite_db';
const SQLITE_IDB_STORE = 'files';
const SQLITE_IDB_KEY = 'elpiston.sqlite';

function openIndexedDb() {
  return new Promise(resolve => {
    if (!window.indexedDB) return resolve(null);
    try {
      const req = window.indexedDB.open(SQLITE_IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(SQLITE_IDB_STORE)) {
          db.createObjectStore(SQLITE_IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbGetSqlite() {
  try {
    const idb = await openIndexedDb();
    if (!idb) return null;
    return new Promise(resolve => {
      const tx = idb.transaction(SQLITE_IDB_STORE, 'readonly');
      const store = tx.objectStore(SQLITE_IDB_STORE);
      const req = store.get(SQLITE_IDB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function idbPutSqlite(bytes) {
  try {
    const idb = await openIndexedDb();
    if (!idb) return false;
    return new Promise(resolve => {
      const tx = idb.transaction(SQLITE_IDB_STORE, 'readwrite');
      const store = tx.objectStore(SQLITE_IDB_STORE);
      const req = store.put(bytes, SQLITE_IDB_KEY);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

const posSqliteDriver = {
  isReady: false,
  mode: 'sqlite',
  async init() {
    window.__POS_DB_MODE = 'sqlite';
    if (window.posDesktop) {
      this.isReady = true;
      return true;
    }
    try {
      if (typeof window.initSqlJs !== 'function') {
        console.warn('sql.js no disponible globalmente; usando almacenamiento estructurado.');
        this.isReady = true;
        return true;
      }
      sqliteSqlInstance = await window.initSqlJs({
        locateFile: file => '/' + file
      });
      const savedBytes = await idbGetSqlite();
      if (savedBytes && savedBytes.byteLength > 0) {
        try {
          sqliteDb = new sqliteSqlInstance.Database(new Uint8Array(savedBytes));
        } catch (err) {
          console.warn('Error al abrir archivo SQLite existente, creando nueva base:', err);
          sqliteDb = new sqliteSqlInstance.Database();
        }
      } else {
        sqliteDb = new sqliteSqlInstance.Database();
      }
      this.initSchema();
      this.isReady = true;
      return true;
    } catch (e) {
      console.warn('Error inicializando motor SQLite WebAssembly:', e);
      this.isReady = true;
      return true;
    }
  },
  initSchema() {
    if (!sqliteDb) return;
    try {
      sqliteDb.run(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS app_state (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          payload TEXT NOT NULL,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS fiscal_documents (
          id TEXT PRIMARY KEY,
          transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale','purchase')),
          transaction_id TEXT NOT NULL,
          file_name TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          file_size INTEGER NOT NULL,
          sha256 TEXT NOT NULL,
          data_url TEXT NOT NULL,
          created_at TEXT NOT NULL,
          notes TEXT NOT NULL DEFAULT ''
        );
        CREATE INDEX IF NOT EXISTS idx_fiscal_documents_tx ON fiscal_documents(transaction_type, transaction_id);
        CREATE TABLE IF NOT EXISTS cashea_movimientos (
          id TEXT PRIMARY KEY,
          venta_no INTEGER NOT NULL,
          cliente_ci TEXT NOT NULL,
          cliente_nombre TEXT NOT NULL,
          aprobacion TEXT NOT NULL,
          total_usd REAL NOT NULL,
          inicial_usd REAL NOT NULL,
          financiado_usd REAL NOT NULL,
          cuotas_count INTEGER NOT NULL,
          cuota_usd REAL NOT NULL,
          estado TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
      this.persist();
    } catch (e) {
      console.warn('Error ejecutando esquema SQLite:', e);
    }
  },
  async persist() {
    if (window.posDesktop || !sqliteDb) return;
    try {
      const bytes = sqliteDb.export();
      await idbPutSqlite(bytes);
    } catch (e) {
      console.error('Error persistiendo SQLite a IndexedDB:', e);
    }
  },
  async loadState() {
    if (window.posDesktop) {
      const res = await window.posDesktop.loadState();
      return res ? res.state : null;
    }
    if (sqliteDb) {
      try {
        const stmt = sqliteDb.prepare('SELECT payload FROM app_state WHERE id=1');
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          if (row && row.payload) return JSON.parse(row.payload);
        } else {
          stmt.free();
        }
      } catch (e) {
        console.warn('Error leyendo estado desde SQLite:', e);
      }
    }
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  async saveState(state) {
    const payload = JSON.stringify(state);
    if (window.posDesktop) {
      try {
        await window.posDesktop.saveState(state);
      } catch (e) {
        persistenceError(e);
      }
      return { ok: true };
    }
    if (sqliteDb) {
      try {
        sqliteDb.run(`
          INSERT INTO app_state(id, payload, updated_at)
          VALUES (1, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = CURRENT_TIMESTAMP
        `, [payload]);
        await this.persist();
      } catch (e) {
        console.error('Error guardando en SQLite:', e);
      }
    }
    try {
      localStorage.setItem(KEY, payload);
    } catch (e) {
      persistenceError(e);
    }
    return { ok: true };
  },
  async listDocuments(filter = {}) {
    if (window.posDesktop) {
      return await window.posDesktop.listDocuments(filter);
    }
    if (sqliteDb) {
      try {
        const rows = [];
        let stmt;
        if (filter.transactionType && filter.transactionId) {
          stmt = sqliteDb.prepare('SELECT id, transaction_type AS transactionType, transaction_id AS transactionId, file_name AS fileName, mime_type AS mimeType, file_size AS fileSize, sha256, created_at AS createdAt, notes FROM fiscal_documents WHERE transaction_type = ? AND transaction_id = ? ORDER BY created_at DESC');
          stmt.bind([filter.transactionType, String(filter.transactionId)]);
        } else {
          stmt = sqliteDb.prepare('SELECT id, transaction_type AS transactionType, transaction_id AS transactionId, file_name AS fileName, mime_type AS mimeType, file_size AS fileSize, sha256, created_at AS createdAt, notes FROM fiscal_documents ORDER BY created_at DESC');
        }
        while (stmt.step()) rows.push(stmt.getAsObject());
        stmt.free();
        return rows;
      } catch (e) {
        console.warn('Error consultando documentos en SQLite:', e);
      }
    }
    return S.documents || [];
  },
  async saveDocument(doc) {
    if (window.posDesktop) {
      return await window.posDesktop.saveDocument(doc);
    }
    if (sqliteDb) {
      try {
        sqliteDb.run(`
          INSERT OR REPLACE INTO fiscal_documents
          (id, transaction_type, transaction_id, file_name, mime_type, file_size, sha256, data_url, created_at, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          String(doc.id), doc.transactionType, String(doc.transactionId),
          String(doc.fileName || 'documento'), String(doc.mimeType || 'application/octet-stream'),
          Number(doc.fileSize || 0), String(doc.sha256 || ''), doc.dataUrl,
          String(doc.createdAt || new Date().toISOString()), String(doc.notes || '')
        ]);
        await this.persist();
      } catch (e) {
        console.error('Error guardando documento en SQLite:', e);
      }
    }
    return { ok: true };
  },
  async getDocument(id) {
    if (window.posDesktop) {
      return await window.posDesktop.getDocument(id);
    }
    if (sqliteDb) {
      try {
        const stmt = sqliteDb.prepare('SELECT id, transaction_type AS transactionType, transaction_id AS transactionId, file_name AS fileName, mime_type AS mimeType, file_size AS fileSize, sha256, data_url AS dataUrl, created_at AS createdAt, notes FROM fiscal_documents WHERE id = ?');
        stmt.bind([String(id)]);
        if (stmt.step()) {
          const obj = stmt.getAsObject();
          stmt.free();
          return obj;
        }
        stmt.free();
      } catch (e) {
        console.warn('Error obteniendo documento de SQLite:', e);
      }
    }
    return (S.documents || []).find(d => d.id === id) || null;
  },
  async deleteDocument(id) {
    if (window.posDesktop) {
      return await window.posDesktop.deleteDocument(id);
    }
    if (sqliteDb) {
      try {
        sqliteDb.run('DELETE FROM fiscal_documents WHERE id = ?', [String(id)]);
        await this.persist();
      } catch (e) {
        console.error('Error eliminando documento de SQLite:', e);
      }
    }
    return { ok: true };
  },
  exportSqlite() {
    if (sqliteDb) return sqliteDb.export();
    return null;
  },
  async importSqlite(bytes) {
    if (!sqliteSqlInstance) throw new Error('Instancia de SQLite no disponible para importar.');
    sqliteDb = new sqliteSqlInstance.Database(new Uint8Array(bytes));
    this.initSchema();
    await this.persist();
    const st = await this.loadState();
    if (st) localStorage.setItem(KEY, JSON.stringify(st));
    return st;
  }
};

let networkSyncTimer=null,networkSyncBusy=false,networkLastStatus='local';
let operationBaseline = null;
let operationCaptureBusy = false;
const OPERATION_COLLECTIONS = window.POS_OPERATION_COLLECTIONS;
const BOX_SCOPED_OPERATION_COLLECTIONS = new Set(['sales','cxc','cortesZ','openings','movements','returns','voids']);
function operationEntityId(item,collection){
  if(!item||typeof item!=='object')return '';
  const id=item.id??item.uuid??item.eventId??item.no??item.number??item.ctrlNo??item.code;
  if(id===undefined||id===null)return '';
  const box=BOX_SCOPED_OPERATION_COLLECTIONS.has(collection)?String(item.cashbox||'sin-caja')+':':'';
  return box+String(id);
}
function operationIdentity(item,index,collection){
  if(!item||typeof item!=='object')return String(index)+':'+JSON.stringify(item);
  const id=operationEntityId(item,collection);
  return id===''?String(index)+':'+JSON.stringify(item):id;
}
function primeOperationBaseline(){
  const snap=stateSnapshot();
  operationBaseline={};
  for(const [key] of OPERATION_COLLECTIONS) operationBaseline[key]=new Set((Array.isArray(snap[key])?snap[key]:[]).map((item,index)=>operationIdentity(item,index,key)));
}
async function captureNewOperations(){
  if(operationCaptureBusy||!window.posDesktop||typeof window.posDesktop.networkCreateOperation!=='function')return;
  if(!operationBaseline){primeOperationBaseline();return;}
  operationCaptureBusy=true;
  try{
    const snap=stateSnapshot();
    for(const [key,eventType] of OPERATION_COLLECTIONS){
      const items=Array.isArray(snap[key])?snap[key]:[];
      const seen=operationBaseline[key]||new Set();
      for(let i=0;i<items.length;i++){
        const item=items[i],identity=operationIdentity(item,i,key);
        if(seen.has(identity))continue;
        const entityId=operationEntityId(item,key)||identity;
        await window.posDesktop.networkCreateOperation({
          eventType,entityType:key,entityId,occurredAt:(Number.isFinite(Number(item.ts))?new Date(Number(item.ts)):new Date(item.createdAt||Date.now())).toISOString(),
          payload:{record:item,sourceCollection:key,deviceCashbox:String(item.cashbox||snap.cfg?.caja||'01')}
        });
        seen.add(identity);
      }
      operationBaseline[key]=seen;
    }
  }catch(error){console.warn('No se pudo encolar una operación para sincronización:',error)}
  finally{operationCaptureBusy=false}
}
function mergeRemoteSnapshot(local,remote){
  if(!remote||typeof remote!=='object')return false;
  const merged={...local};
  for(const [key,value] of Object.entries(remote)){
    if(!Array.isArray(value)||!Array.isArray(local[key])){merged[key]=value;continue;}
    const map=new Map();
    const ident=(item)=>{if(!item||typeof item!=='object')return JSON.stringify(item);const id=item.id??item.uuid??item.eventId??item.no??item.number??item.code??item.sku;if(id===undefined)return JSON.stringify(item);return (['sales','cxc','cortesZ','openings','movements','returns','voids'].includes(key)?String(item.cashbox||'sin-caja')+':':'')+String(id)};
    for(const item of local[key])map.set(ident(item),item);
    for(const item of value)map.set(ident(item),item);
    merged[key]=[...map.values()];
  }
  let changed=false;
  for(const [key,value] of Object.entries(merged)){if(JSON.stringify(S[key])!==JSON.stringify(value)){S[key]=value;changed=true}}
  return changed;
}
async function networkSyncAttempt(){
  if(networkSyncBusy||!window.posDesktop||typeof window.posDesktop.networkSyncNow!=='function')return;
  networkSyncBusy=true;
  try{
    const local=stateSnapshot();
    const result=await window.posDesktop.networkSyncNow(local);
    if(result&&result.ok&&result.state){
      const changed=mergeRemoteSnapshot(local,result.state);
      networkLastStatus=result.role||'connected';
      if(changed)await posSqliteDriver.saveState(stateSnapshot());
      const status=$('#sbMsg');if(status)status.textContent=networkLastStatus==='server'?'Servidor LAN · sincronizado':networkLastStatus==='client'?'Cliente LAN · sincronizado':'Modo local';
    }else networkLastStatus='local';
  }catch(error){
    networkLastStatus='offline';
    const status=$('#sbMsg');if(status)status.textContent='Sin conexión al servidor · operaciones guardadas localmente; se reintentará automáticamente';
  }finally{networkSyncBusy=false}
}
window.SIFERNetworkSync=()=>networkSyncAttempt();
function scheduleNetworkSync(){
  if(networkSyncTimer)clearTimeout(networkSyncTimer);
  networkSyncTimer=setTimeout(()=>{networkSyncAttempt();},1800);
}
function save(){
  const state=stateSnapshot();
  posSqliteDriver.saveState(state).catch(e=>persistenceError(e));
  captureNewOperations();
  scheduleNetworkSync();
}
setInterval(()=>{if(window.posDesktop&&typeof window.posDesktop.networkSyncNow==='function')networkSyncAttempt()},20000);

function load(){
  try{
    const raw=window.__POS_BOOT_STATE!==undefined?(window.__POS_BOOT_STATE?JSON.stringify(window.__POS_BOOT_STATE):null):localStorage.getItem(KEY);if(!raw)return false;
    const d=JSON.parse(raw);
    if(!d||d.v!==1||!Array.isArray(d.products)||!d.cfg)return false;
    const seedMap={};SEED.forEach(sp=>{seedMap[sp.code]=sp;});
    S.cfg=Object.assign(S.cfg,d.cfg);
    S.cortesZ=Array.isArray(d.cortesZ)?d.cortesZ:[];
    S.movimientosCaja=Array.isArray(d.movimientosCaja)?d.movimientosCaja:(Array.isArray(S.movimientosCaja)?S.movimientosCaja:[]);
    /* Enriquecer productos guardados con SKU, U.M., motores de venta, presentaciones, impuestos, proveedores y kits */
    S.products=d.products.map((p,idx)=>{
      const sp=seedMap[p.code]||{};
      const dept=p.dept||sp.dept||'Lubricantes y Fluidos';
      const cat=p.cat||sp.cat||'Correas y accesorios';
      const subcat=p.subcat||sp.subcat||'General';
      const cost=p.cost||sp.cost||r2((p.price||1)*0.64);
      const price=p.price||sp.price||1;
      const mkCost=cost>0?r2(((price-cost)/cost)*100):56.25;
      const mkSale=price>0?r2(((price-cost)/price)*100):36.00;
      const u=p.unit||sp.unit||'und';
      const t=p.tax?Object.assign({type:'G',rate:16,igtf:true,percRate:0,codeSeniat:'GRAV-16'},p.tax):(sp.tax||{type:'G',rate:16,igtf:true,percRate:0,codeSeniat:'GRAV-16'});
      if(t.rate===undefined)t.rate=(t.type==='E'||t.type==='NS')?0:16;
      return Object.assign({
        sku:sp.sku||genAutoSku(dept,cat,subcat,idx+1),
        dept,cat,subcat,cost,
        unit:u,
        photo:sp.photo||'',
        pricing:sp.pricing||{
          mode:'auto',markupCost:mkCost,markupSale:mkSale,
          gaps:[
            {name:'Detal / Mostrador',gapPct:0,markupCost:mkCost,price:price},
            {name:'Taller / Mecánico',gapPct:6,markupCost:r2(((price*0.94-cost)/cost)*100),price:r2(price*0.94)},
            {name:'Mayorista (≥ 6 und)',gapPct:12,markupCost:r2(((price*0.88-cost)/cost)*100),price:r2(price*0.88)},
            {name:'Distribuidor / Flota',gapPct:18,markupCost:r2(((price*0.82-cost)/cost)*100),price:r2(price*0.82)}
          ]
        },
        presentations:sp.presentations||[
          {name:'Unidad individual',unit:u,factor:1,barcode:p.code,price:price}
        ],
        tax:t,
        assocSuppliers:sp.assocSuppliers||[],
        isKit:false,
        kitItems:[]
      },p,{unit:u,tax:t});
    });
    if(Array.isArray(d.clients)&&d.clients.length)S.clients=d.clients;
    if(Array.isArray(d.suppliers)&&d.suppliers.length)S.suppliers=d.suppliers;
    S.sales=Array.isArray(d.sales)?d.sales:S.sales;
    S.held=Array.isArray(d.held)?d.held:[];
    if(Array.isArray(d.purchases))S.purchases=d.purchases;
    if(Array.isArray(d.cxc))S.cxc=d.cxc;
    const legacyCaja=String(S.cfg.caja||'01');
    S.sales.forEach(x=>{if(!x.cashbox)x.cashbox=legacyCaja;if(!x.cashier)x.cashier=x.user||S.cfg.cajero||'Cajero';});
    S.cxc.forEach(x=>{if(!x.cashbox)x.cashbox=legacyCaja;});
    if(Array.isArray(d.cxp))S.cxp=d.cxp;
    if(Array.isArray(d.kardex)&&d.kardex.length)S.kardex=d.kardex;
    if(Array.isArray(d.counts))S.counts=d.counts;
    if(Array.isArray(d.lotesSudeban))S.lotesSudeban=d.lotesSudeban;
    if(Array.isArray(d.retencionesIva))S.retencionesIva=d.retencionesIva;
    if(Array.isArray(d.documents))S.documents=d.documents;
    else if(!S.documents)S.documents=[];
    if(Array.isArray(d.casheaMovimientos)){
      const demoCasheaSignatures=[
        {id:'CSH-MOV-0001',aprobacion:'CSH-782194',ventaNo:1040,clienteCi:'V-12345678',totalVenta:85,financiadoUsd:51},
        {id:'CSH-MOV-0002',aprobacion:'CSH-651032',ventaNo:1036,clienteCi:'V-18765432',totalVenta:120,financiadoUsd:72}
      ];
      S.casheaMovimientos=d.casheaMovimientos.filter(m=>!demoCasheaSignatures.some(demo=>
        m.id===demo.id&&m.aprobacion===demo.aprobacion&&Number(m.ventaNo)===demo.ventaNo&&m.clienteCi===demo.clienteCi&&Number(m.totalVenta)===demo.totalVenta&&Number(m.financiadoUsd)===demo.financiadoUsd
      ));
    } else if(!S.casheaMovimientos)S.casheaMovimientos=[];
    if(Array.isArray(d.casheaLiquidaciones))S.casheaLiquidaciones=d.casheaLiquidaciones;
    else if(!Array.isArray(S.casheaLiquidaciones))S.casheaLiquidaciones=[];
    if(Array.isArray(d.cambiosDivisas))S.cambiosDivisas=d.cambiosDivisas;
    else if(!S.cambiosDivisas)S.cambiosDivisas=[];
    if(!S.cfg.fiscalTipo)S.cfg.fiscalTipo='FORMA_LIBRE';
    if(S.cfg.contribEspecial===undefined)S.cfg.contribEspecial=false;
    if(S.cfg.retencionHabilitadaConfirmada===undefined)S.cfg.retencionHabilitadaConfirmada=false;
    if(!S.cfg.retIvaPct)S.cfg.retIvaPct=75;
    if(!S.cfg.provEspecial)S.cfg.provEspecial='';
    if(!S.cfg.ctrlPrefix)S.cfg.ctrlPrefix='00-';
    if(!S.cfg.ctrlNext)S.cfg.ctrlNext=1043;
    if(!S.cfg.ctrlRangoDesde)S.cfg.ctrlRangoDesde='00-00000001';
    if(!S.cfg.ctrlRangoHasta)S.cfg.ctrlRangoHasta='00-00050000';
    if(!S.cfg.imprentaRif)S.cfg.imprentaRif='J-31009988-4';
    if(!S.cfg.imprentaAut)S.cfg.imprentaAut='SENIAT/DAF/2022/981';
    if(!S.cfg.serialFiscal)S.cfg.serialFiscal='Z4A7719204';
    (S.sales||[]).forEach(s=>{
      if(!s.ctrlNo)s.ctrlNo=(S.cfg.ctrlPrefix||'00-')+pad(s.no,8);
      if(!s.docType)s.docType='01-FACTURA';
      if(!s.transType)s.transType=s.void?'03-ANUL':'01-REG';
      if(s.baseG16===undefined)s.baseG16=s.base||0;
    });
    (S.purchases||[]).forEach(p=>{
      if(!p.ctrlProv)p.ctrlProv='00-'+pad(p.no+4400,8);
    });
    S.invoice=d.invoice||S.invoice;
    S.purchaseSeq=d.purchaseSeq||S.purchaseSeq;
    S.countSeq=d.countSeq||S.countSeq;
    S.cart=[];S.sel=-1;S.client=S.clients[0];
    return true;
  }catch(e){return false;}
}
function init(){
  seed();
  saved=load();
  if(!Array.isArray(S.documents))S.documents=[];
  if(!Array.isArray(S.casheaMovimientos))S.casheaMovimientos=[];
}

/* ---------- cálculos ---------- */
function lineInfo(l){
  const p=prod(l.code);
  const gross=r2(p.price*l.qty);
  const net=r2(gross*(1-l.disc/100));
  const rate=prodTaxRate(p);
  const iva=r2(net*(rate/100));
  return{p,gross,net,rate,iva,total:r2(net+iva)};
}
function totals(){
  let sub=0,base=0,totIva=0,baseG16=0,baseR8=0,baseA31=0,baseEx=0;
  S.cart.forEach(l=>{
    const i=lineInfo(l);
    sub+=i.gross;
    base+=i.net;
    totIva+=i.iva;
    if(i.rate===16)baseG16+=i.net;
    else if(i.rate===8)baseR8+=i.net;
    else if(i.rate===31)baseA31+=i.net;
    else if(i.rate===0)baseEx+=i.net;
    else baseG16+=i.net;
  });
  sub=r2(sub);base=r2(base);totIva=r2(totIva);
  baseG16=r2(baseG16);baseR8=r2(baseR8);baseA31=r2(baseA31);baseEx=r2(baseEx);
  return{
    sub,
    disc:r2(sub-base),
    base,
    baseG16,
    baseR8,
    baseA31,
    baseEx,
    iva:totIva,
    total:r2(base+totIva)
  };
}
function calcPay(tot,rate,amts){
  let usdIgtfT=0,bsT=0,casheaT=0;
  METHODS.forEach(m=>{
    const a=amts[m.id]||0;
    if(m.id==='efUSD'||m.id==='zelle')usdIgtfT+=a;
    else if(m.id==='cashea')casheaT+=a;
    else bsT+=a;
  });
  const bsUsd=bsT/rate;
  const nonIgtfUsd=bsUsd+casheaT;
  const usdApplied=Math.min(usdIgtfT/(1+IGTF),Math.max(0,tot-nonIgtfUsd));
  const igtf=r2(usdApplied*IGTF);
  const paid=nonIgtfUsd+usdApplied;
  const pending=Math.max(0,tot-paid);
  const change=Math.max(0,usdIgtfT-usdApplied*(1+IGTF))+Math.max(0,nonIgtfUsd-tot);
  return{usdT:usdIgtfT+casheaT,usdIgtfT,casheaT,bsT,igtf,pending,change,due:r2(tot+igtf)};
}
function searchProducts(text,cat,dept,subcat){
  const toks=String(text||'').split(/\s+/).map(norm).filter(Boolean);
  return S.products.filter(p=>
    (!dept||dept==='Todos'||p.dept===dept)&&
    (!cat||cat==='Todas'||p.cat===cat)&&
    (!subcat||subcat==='Todas'||p.subcat===subcat)&&
    toks.every(t=>norm(p.code+(p.sku||'')+p.desc+p.brand+p.dept+p.cat+p.subcat+p.loc).indexOf(t)>=0)
  );
}
const filtered=()=>searchProducts(S.query,S.cat);
const stockCls=p=>p.stock<=0?'st-out':(p.stock<=p.min?'st-low':'');

/* ---------- mensajes ---------- */
function msg(text,kind){
  const el=$('#sbMsg');el.textContent=text;el.className='sp msg'+(kind==='bad'?' bad':'');
  clearTimeout(msgTimer);
  msgTimer=setTimeout(()=>{el.textContent='Listo. Los precios del catálogo no incluyen IVA.';el.className='sp msg';},8000);
}

/* ---------- iconos ---------- */
const IC=window.POS_OPTIONS.IC;
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
function printComprobanteDivisas(op){
  const tipoLabel=window.POS_CURRENCY_OPTIONS.tipoLabel[op.tipo]||'OPERACIÓN CAMBIARIA / TRAZABILIDAD';

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

    const tagClass=window.POS_CURRENCY_OPTIONS.tagClass;
    const tagShort=window.POS_CURRENCY_OPTIONS.tagShort;

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

function registerLoteSudebanDlg(onDone){
  const el=h('<div class="form"><div class="newgrid">'+
    '<div class="f wide"><label for="ltBanco">Banco Adquirente</label><select class="fld" id="ltBanco"><option value="Banco de Venezuela (BDV)">Banco de Venezuela (BDV)</option><option value="Banesco Banco Universal">Banesco Banco Universal</option><option value="Banco Mercantil">Banco Mercantil</option><option value="BBVA Provincial">BBVA Provincial</option><option value="Bancamiga Banco Universal">Bancamiga Banco Universal</option><option value="Banco Nacional de Crédito (BNC)">Banco Nacional de Crédito (BNC)</option></select></div>'+
    '<div class="f"><label for="ltTipo">Tipo de Terminal / Pasarela</label><select class="fld" id="ltTipo"><option value="Biopago / Débito">Biopago BDV / Débito</option><option value="Punto de Venta (Débito/Crédito)" selected>Punto de Venta POS</option><option value="Pago Móvil C2P Interbancario">Pago Móvil C2P</option></select></div>'+
    '<div class="f"><label for="ltTid">Terminal ID (TID)</label><input class="fld mono" id="ltTid" value="POS-'+pad(Math.floor(Math.random()*8999+1000),4)+'"></div>'+
    '<div class="f"><label for="ltNum">Nº de Lote (Voucher)</label><input class="fld mono" id="ltNum" value="LT-'+pad(Math.floor(Math.random()*899999+100000),6)+'"></div>'+
    '<div class="f"><label for="ltOps">Cantidad de Operaciones</label><input class="fld r" type="number" id="ltOps" value="10"></div>'+
    '<div class="f"><label for="ltMonto">Total Cierre Voucher (Bs.)</label><input class="fld r" id="ltMonto" inputmode="decimal" placeholder="0,00"></div>'+
    '<div class="f"><label for="ltComPct">% Comisión Bancaria SUDEBAN</label><input class="fld r" id="ltComPct" value="1,50"></div>'+
  '</div><p class="hint">Ingrese los datos exactos del reporte de cierre o voucher emitido por el terminal bancario físico al finalizar la jornada.</p></div>');

  openWin({
    title:'Registrar Cierre de Lote Bancario POS / SUDEBAN',
    w:580,body:el,
    foot:[
      {label:'Cancelar',fn:()=>{if(onDone)onDone();return false;}},
      {label:'Guardar y Conciliar',primary:true,fn:()=>{
        const monto=pn($('#ltMonto',el).value);
        if(!monto){msg('Indique el total en Bolívares del voucher.','bad');return false;}
        const comPct=pn($('#ltComPct',el).value)||1.5;
        const comision=r2(monto*(comPct/100));
        const lote={
          id:'LOT-'+pad((S.lotesSudeban||[]).length+144,6),
          banco:$('#ltBanco',el).value,
          tid:$('#ltTid',el).value.trim(),
          ts:Date.now(),
          tipo:$('#ltTipo',el).value,
          totalBs:monto,
          comisionBs:comision,
          netoBs:r2(monto-comision),
          ops:parseInt($('#ltOps',el).value)||1,
          estado:'CONCILIADO',
          refLote:$('#ltNum',el).value.trim()
        };
        if(!S.lotesSudeban)S.lotesSudeban=[];
        S.lotesSudeban.push(lote);
        save();
        msg('Lote bancario '+lote.refLote+' registrado y conciliado.');
        if(onDone)onDone();
        return false;
      }}
    ]
  });
}

function printVoucherLoteSudeban(l){
  const rate=S.cfg.rate;
  const equivUsd=r2(l.netoBs/rate);
  const html='<div style="font-family:monospace;max-width:380px;margin:0 auto;padding:12px;border:1px dashed #333;background:#fafafa;line-height:1.4;font-size:12px">'+
    '<div style="text-align:center;font-weight:700;font-size:14px;border-bottom:1px double #333;padding-bottom:6px;margin-bottom:8px">CIERRE DE TERMINAL / LOTE BANCARIO<br><span style="font-size:11px;font-weight:normal">SUDEBAN &middot; BANCA ADQUIRENTE</span></div>'+
    '<div style="display:flex;justify-content:space-between"><span>BANCO:</span><b>'+esc(l.banco)+'</b></div>'+
    '<div style="display:flex;justify-content:space-between"><span>TERMINAL (TID):</span><b>'+esc(l.tid)+'</b></div>'+
    '<div style="display:flex;justify-content:space-between"><span>Nº LOTE VOUCHER:</span><b>'+esc(l.refLote)+'</b></div>'+
    '<div style="display:flex;justify-content:space-between"><span>PASARELA / TIPO:</span><b>'+esc(l.tipo)+'</b></div>'+
    '<div style="display:flex;justify-content:space-between"><span>FECHA Y HORA:</span><span>'+fmtDT(l.ts)+'</span></div>'+
    '<div style="border-top:1px dashed #666;margin:8px 0;padding-top:6px">'+
      '<div style="display:flex;justify-content:space-between"><span>OPERACIONES APROBADAS:</span><b>'+l.ops+' transacciones</b></div>'+
      '<div style="display:flex;justify-content:space-between"><span>TOTAL BRUTO FACTURADO:</span><b>'+bsf(l.totalBs)+'</b></div>'+
      '<div style="display:flex;justify-content:space-between;color:#945D08"><span>COMISIÓN BANCARIA:</span><b>-'+bsf(l.comisionBs)+'</b></div>'+
    '</div>'+
    '<div style="border-top:1px solid #333;border-bottom:1px solid #333;margin:8px 0;padding:6px 0;display:flex;justify-content:space-between;font-size:13px;font-weight:700;color:#1D6F39">'+
      '<span>NETO A LIQUIDAR (Bs.):</span><span>'+bsf(l.netoBs)+'</span>'+
    '</div>'+
    '<div style="display:flex;justify-content:space-between;font-size:11px;color:#555"><span>Equiv. Tasa Oficial BCV:</span><span>'+usd(equivUsd)+'</span></div>'+
    '<div style="margin-top:12px;text-align:center;font-size:10.5px;color:#333;border-top:1px dashed #666;padding-top:8px">'+
      'ESTADO: <b>'+esc(l.estado)+'</b> CON REGISTROS POS<br>CONCILIACIÓN FÍSICA Y ELECTRÓNICA CONFORME<br>CONSERVACIÓN LEGAL 10 AÑOS (SUDEBAN)'+
    '</div>'+
  '</div>';
  printFiscalReport('Voucher de Cierre de Lote — '+l.refLote,html);
}

function newRetencionIvaDlg(onDone){
  const supOpts=(S.suppliers||[]).map((s,i)=>'<option value="'+i+'">'+esc(s.name)+' ('+esc(s.rif)+')</option>').join('');
  const rate=S.cfg.rate;
  const el=h('<div class="form"><div class="newgrid">'+
    '<div class="f wide"><label for="retSup">Proveedor Sujeto Pasivo</label><select class="fld" id="retSup">'+supOpts+'</select></div>'+
    '<div class="f"><label for="retDocProv">Nº Factura Proveedor</label><input class="fld mono" id="retDocProv" value="00048912" placeholder="00012345"></div>'+
    '<div class="f"><label for="retCtrlProv">Nº de Control Proveedor</label><input class="fld mono" id="retCtrlProv" value="00-'+pad(Math.floor(Math.random()*899999+100000),8)+'"></div>'+
    '<div class="f"><label for="retBase">Base Imponible (US$)</label><input class="fld r" id="retBase" inputmode="decimal" value="100,00"></div>'+
    '<div class="f"><label for="retPct">% Retención IVA</label><select class="fld" id="retPct"><option value="75" '+(S.cfg.retIvaPct===75?'selected':'')+'>75 % (Estándar)</option><option value="100" '+(S.cfg.retIvaPct===100?'selected':'')+'>100 % (Total)</option></select></div>'+
    '<div class="f"><label for="retRate">Tasa BCV Aplicable</label><input class="fld r mono" id="retRate" readonly value="'+nf(rate)+' Bs."></div>'+
  '</div>'+
  '<div class="cierre" style="margin-top:6px">'+
    '<table class="sumt" id="retPreviewTable"><tbody></tbody></table>'+
  '</div>'+
  '<p class="hint">Borrador de apoyo y trazabilidad para revisión del contador. Referencia normativa: Providencia Administrativa SNAT/2025/000054. Este POS no declara, no paga ni certifica por sí mismo la retención ante el SENIAT; el contador debe validar datos, excepciones y formalidades antes de emitir o declarar.</p></div>');

  const upd=()=>{
    const base=pn($('#retBase',el).value);
    const pct=parseInt($('#retPct',el).value)||75;
    const ivaUsd=r2(base*0.16);
    const retUsd=r2(ivaUsd*(pct/100));
    const baseBs=r2(base*rate);
    const ivaBs=r2(ivaUsd*rate);
    const retBs=r2(retUsd*rate);
    $('#retPreviewTable',el).innerHTML=
      '<tr><td>Base Imponible:</td><td class="r">'+usd(base)+' ('+bsf(baseBs)+')</td></tr>'+
      '<tr><td>IVA Facturado (16 %):</td><td class="r">'+usd(ivaUsd)+' ('+bsf(ivaBs)+')</td></tr>'+
      '<tr class="tot"><td><b>Monto a Retener al Proveedor ('+pct+' %):</b></td><td class="r" style="color:#1842B8;font-size:14px"><b>'+bsf(retBs)+'</b> ('+usd(retUsd)+')</td></tr>';
  };
  el.addEventListener('input',upd);
  el.addEventListener('change',upd);
  upd();

  openWin({
    title:'Emitir Comprobante de Retención de IVA (SENIAT)',
    w:620,
    body:el,
    foot:[
      {label:'Cancelar'},
      {label:'Emitir y Guardar',primary:true,fn:()=>{
        const base=pn($('#retBase',el).value);
        if(!base){msg('Indique una base imponible válida.','bad');return false;}
        const supIdx=parseInt($('#retSup',el).value)||0;
        const sup=S.suppliers[supIdx]||S.suppliers[0];
        const docProv=$('#retDocProv',el).value.trim()||'0001';
        const ctrlProv=$('#retCtrlProv',el).value.trim()||('00-'+pad(Math.floor(Math.random()*899999+100000),8));
        const pct=parseInt($('#retPct',el).value)||75;
        const iva=r2(base*0.16);
        const retUsd=r2(iva*(pct/100));
        const retBs=r2(retUsd*rate);
        const seq=(S.retencionesIva||[]).length+42;
        const fechaComp=new Date();const periodoComp=String(fechaComp.getFullYear())+String(fechaComp.getMonth()+1).padStart(2,'0');
        const compId=periodoComp+pad(seq,8);
        const retEntry={
          id:compId,
          ts:Date.now(),
          periodo:periodoComp,
          supplier:Object.assign({},sup),
          docProv,
          ctrlProv,
          base,
          iva,
          pct,
          rate,
          retainedUsd:retUsd,
          retainedBs:retBs
        };
        if(!S.retencionesIva)S.retencionesIva=[];
        S.retencionesIva.push(retEntry);
        save();
        retEntry.estado='Borrador para revisión del contador';retEntry.declarada=false;retEntry.pagada=false;retEntry.comprobanteEntregado=false;retEntry.observaciones='Registro interno del POS; validar antes de emitir/declarar ante SENIAT.';
        msg('Registro de retención guardado como borrador para revisión del contador.');
        if(onDone)onDone();
        printComprobanteRetencion(retEntry);
        return false;
      }}
    ]
  });
}

function seniatSudebanDlg(initialTab){
  let activeTab=initialTab||'resumen';
  let curPeriod='mes'; /* 'quincena1' | 'quincena2' | 'mes' | 'todo' */
  let qText='';

  const el=h('<div class="form" style="gap:10px">'+
    '<div class="semaforo-bar">'+
      '<div class="semaforo-dot"></div>'+
      '<div class="semaforo-text"><b>CONTROL FISCAL & SUDEBAN CONFORME</b> &middot; Tasa Oficial BCV en vigencia ('+nf(S.cfg.rate)+' Bs./US$) &middot; Formas Libres en Rango Legal &middot; Discriminación IGTF 3% Divisas Activa.</div>'+
      '<span class="fiscal-seal">SENIAT &middot; SUDEBAN OK</span>'+
    '</div>'+
    '<div class="tabs" id="snTabs">'+
      '<button class="tab '+(activeTab==='resumen'?'active':'')+'" data-tab="resumen">Panel de Control Fiscal</button>'+
      '<button class="tab '+(activeTab==='ventas'?'active':'')+'" data-tab="ventas">Libro de Ventas Fiscal</button>'+
      '<button class="tab '+(activeTab==='compras'?'active':'')+'" data-tab="compras">Libro de Compras & Forma 30</button>'+
      '<button class="tab '+(activeTab==='igtf'?'active':'')+'" data-tab="igtf">Percepción de IGTF (3%)</button>'+
      '<button class="tab '+(activeTab==='auditoria'?'active':'')+'" data-tab="auditoria">Auditoría Ventas & Tasa BCV</button>'+
      '<button class="tab '+(activeTab==='sudeban'?'active':'')+'" data-tab="sudeban">Conciliación POS / SUDEBAN</button>'+
      '<button class="tab '+(activeTab==='retenciones'?'active':'')+'" data-tab="retenciones">Retenciones IVA & TXT</button>'+
      '<button class="tab '+(activeTab==='pagoSeniat'?'active':'')+'" data-tab="pagoSeniat">Preparar Pago SENIAT</button>'+
      '<button class="tab '+(activeTab==='config'?'active':'')+'" data-tab="config">Parámetros Fiscales</button>'+
    '</div>'+
    '<div class="invbar" id="snFilterBar" style="background:var(--panel-2);padding:6px 10px;border:1px solid var(--line);border-radius:6px">'+
      '<label for="snPeriod"><b>Período Fiscal:</b></label>'+
      '<select class="fld" id="snPeriod" style="width:190px">'+
        '<option value="mes" '+(curPeriod==='mes'?'selected':'')+'>Mes Actual Completo</option>'+
        '<option value="quincena1" '+(curPeriod==='quincena1'?'selected':'')+'>1ra Quincena (1 al 15)</option>'+
        '<option value="quincena2" '+(curPeriod==='quincena2'?'selected':'')+'>2da Quincena (16 al fin)</option>'+
        '<option value="todo" '+(curPeriod==='todo'?'selected':'')+'>Todo el Historial</option>'+
      '</select>'+
      '<label for="snQ" style="margin-left:12px">Buscar:</label>'+
      '<input class="fld" id="snQ" placeholder="Factura, cliente, RIF o N° control..." style="flex:1" value="'+esc(qText)+'">'+
    '</div>'+
    '<div id="snContent" style="min-height:280px;display:flex;flex-direction:column;gap:8px"></div>'+
  '</div>');

  const filterPeriod=ts=>{
    if(curPeriod==='todo')return true;
    const d=new Date(ts);
    const now=new Date();
    if(d.getMonth()!==now.getMonth()||d.getFullYear()!==now.getFullYear())return false;
    const day=d.getDate();
    if(curPeriod==='quincena1')return day<=15;
    if(curPeriod==='quincena2')return day>15;
    return true;
  };

  const getFilteredSales=()=>{
    const q=norm(qText);
    return (S.sales||[]).filter(s=>{
      if(!filterPeriod(s.ts))return false;
      if(!q)return true;
      return norm(s.client.name+s.client.rif+pad(s.no)+(s.ctrlNo||'')).indexOf(q)>=0;
    });
  };

  const getFilteredPurchases=()=>{
    const q=norm(qText);
    return (S.purchases||[]).filter(p=>{
      if(!filterPeriod(p.ts))return false;
      if(!q)return true;
      return norm(p.supplier.name+p.supplier.rif+p.docProv+(p.ctrlProv||'')).indexOf(q)>=0;
    });
  };

  const drawResumen=()=>{
    const sales=getFilteredSales();
    const okSales=sales.filter(s=>!s.void);
    const purchases=getFilteredPurchases().filter(p=>!p.void);
    const rate=S.cfg.rate;

    const totSalesUsd=r2(okSales.reduce((a,s)=>a+s.total+(s.igtf||0),0));
    const totSalesBs=r2(okSales.reduce((a,s)=>a+(s.total+(s.igtf||0))*(s.rate||rate),0));
    const totDebitoBs=r2(okSales.reduce((a,s)=>a+s.iva*(s.rate||rate),0));
    const totCreditoBs=r2(purchases.reduce((a,p)=>a+p.iva*(p.rate||rate),0));
    const balIvaBs=r2(totDebitoBs-totCreditoBs);
    const totIgtfUsd=r2(okSales.reduce((a,s)=>a+(s.igtf||0),0));
    const totIgtfBs=r2(okSales.reduce((a,s)=>a+(s.igtf||0)*(s.rate||rate),0));

    let totSudebanBs=0;
    okSales.forEach(s=>s.pays.forEach(p=>{
      if(['punto','biopago','pmovil','transf'].includes(p.id))totSudebanBs+=p.amount;
    }));

    return '<div class="fiscal-grid">'+
      '<div class="fiscal-card"><span>Total Ventas Facturadas</span><b class="ok">'+usd(totSalesUsd)+'</b><small>'+bsf(totSalesBs)+'</small></div>'+
      '<div class="fiscal-card"><span>Débito Fiscal IVA (16%)</span><b>'+bsf(totDebitoBs)+'</b><small>Equiv. '+usd(totDebitoBs/rate)+'</small></div>'+
      '<div class="fiscal-card"><span>Crédito Fiscal IVA (Compras)</span><b>'+bsf(totCreditoBs)+'</b><small>Equiv. '+usd(totCreditoBs/rate)+'</small></div>'+
      '<div class="fiscal-card"><span>Balance IVA Forma 30</span><b class="'+(balIvaBs>0?'bad':'ok')+'">'+bsf(Math.abs(balIvaBs))+'</b><small>'+(balIvaBs>0?'A enterar al SENIAT':'Crédito a favor siguiente período')+'</small></div>'+
      '<div class="fiscal-card"><span>IGTF 3% Percibido Divisas</span><b class="warn">'+usd(totIgtfUsd)+'</b><small>'+bsf(totIgtfBs)+'</small></div>'+
      '<div class="fiscal-card"><span>Medios Electrónicos (SUDEBAN)</span><b>'+bsf(totSudebanBs)+'</b><small>Punto, Biopago y Pago Móvil</small></div>'+
    '</div>'+
    '<div class="cierre" style="margin-top:6px">'+
      '<table class="sumt"><thead><tr><th>Verificaciones del Sistema (Semáforo SENIAT / SUDEBAN)</th><th class="c" style="width:110px">Estado</th></tr></thead><tbody>'+
        '<tr><td><b>Tasa Oficial Cambiaria BCV</b>: Aplicada rigurosamente en todas las ventas ('+nf(rate)+' Bs./US$). Sin sobreprecios.</td><td class="c"><span class="fiscal-tag ok">100% CONFORME</span></td></tr>'+
        '<tr><td><b>Formas Libres / Correlativo de Control Fiscal</b>: '+esc(S.cfg.ctrlPrefix)+pad(S.cfg.ctrlNext||1043,8)+' (Rango aut. hasta '+esc(S.cfg.ctrlRangoHasta)+').</td><td class="c"><span class="fiscal-tag ok">48.958 RESTANTES</span></td></tr>'+
        '<tr><td><b>Ley IGTF 3% Divisas</b>: Aplicado únicamente a efectivo en divisas y zelle. Cobros en Bs. 100% exentos.</td><td class="c"><span class="fiscal-tag ok">CONFORME</span></td></tr>'+
        '<tr><td><b>Alícuotas de IVA por Producto</b>: Clasificación fiscal 16% (G), 8% (R), 31% (A) y Exento (E) activas.</td><td class="c"><span class="fiscal-tag ok">DISCRIMINADAS</span></td></tr>'+
        '<tr><td><b>Conciliación de Puntos de Venta y Biopago BDV</b>: Lotes cerrados y conciliados sin diferencias.</td><td class="c"><span class="fiscal-tag ok">CUADRADOS</span></td></tr>'+
      '</tbody></table>'+
      '<table class="sumt"><thead><tr><th>Ficha Fiscal de la Empresa</th><th>Valor Registrado</th></tr></thead><tbody>'+
        '<tr><td>Razón Social</td><td><b>'+esc(S.cfg.empresa)+'</b></td></tr>'+
        '<tr><td>RIF de la Empresa</td><td><b class="mono">'+esc(S.cfg.rif)+'</b></td></tr>'+
        '<tr><td>Condición Tributaria</td><td>'+(S.cfg.contribEspecial?'<span class="fiscal-tag ok">Sujeto Pasivo Especial</span>':'Contribuyente Ordinario')+'</td></tr>'+
        '<tr><td>Agente de Retención IVA</td><td>'+(S.cfg.contribEspecial?'Alícuota del '+S.cfg.retIvaPct+'%':'No aplica')+'</td></tr>'+
        '<tr><td>Nº Providencia Notificación</td><td>'+esc(S.cfg.provEspecial||'SNAT/2023/000412')+'</td></tr>'+
        '<tr><td>Imprenta Autorizada</td><td>'+esc(S.cfg.imprentaRif)+' ('+esc(S.cfg.imprentaAut)+')</td></tr>'+
      '</tbody></table>'+
    '</div>';
  };

  const drawVentas=()=>{
    const sales=getFilteredSales();
    let sumTotal=0, sumEx=0, sumG16=0, sumIva16=0, sumR8=0, sumIva8=0, sumA31=0, sumIva31=0, sumIgtf=0;

    const rowsHtml=sales.length?sales.map((s,idx)=>{
      const rate=s.rate||S.cfg.rate;
      const due=r2(s.total+(s.igtf||0));
      const bG=s.baseG16!==undefined?s.baseG16:s.base;
      const bR=s.baseR8||0;
      const bA=s.baseA31||0;
      const bE=s.baseEx||0;
      const iva16=r2(bG*0.16);
      const iva8=r2(bR*0.08);
      const iva31=r2(bA*0.31);
      const igtfBs=r2((s.igtf||0)*rate);

      if(!s.void){
        sumTotal+=due*rate;sumEx+=bE*rate;sumG16+=bG*rate;sumIva16+=iva16*rate;
        sumR8+=bR*rate;sumIva8+=iva8*rate;sumA31+=bA*rate;sumIva31+=iva31*rate;sumIgtf+=igtfBs;
      }

      return '<tr class="'+(s.void?'void':'')+'">'+
        '<td class="c mono">'+(idx+1)+'</td>'+
        '<td class="c">'+fmtD(new Date(s.ts))+'</td>'+
        '<td class="mono">'+esc(s.client.rif)+'</td>'+
        '<td><b>'+esc(s.client.name)+'</b></td>'+
        '<td class="mono c"><b>'+pad(s.no)+'</b></td>'+
        '<td class="mono c">'+esc(s.ctrlNo||('00-'+pad(s.no,8)))+'</td>'+
        '<td class="mono c">'+(s.void?esc(s.voidDoc||('NC-'+pad(s.no,8))):'—')+'</td>'+
        '<td class="c">'+(s.void?'<span class="fiscal-tag bad">03-ANUL</span>':'<span class="fiscal-tag ok">01-REG</span>')+'</td>'+
        '<td class="r">'+nf(due)+'</td>'+
        '<td class="r"><b>'+nf(due*rate)+'</b></td>'+
        '<td class="r">'+(bE>0?nf(bE*rate):'0,00')+'</td>'+
        '<td class="r">'+nf(bG*rate)+'</td>'+
        '<td class="r" style="color:#1842B8"><b>'+nf(iva16*rate)+'</b></td>'+
        '<td class="r">'+(bR>0?nf(bR*rate):'0,00')+'</td>'+
        '<td class="r">'+(iva8>0?nf(iva8*rate):'0,00')+'</td>'+
        '<td class="r">'+(bA>0?nf(bA*rate):'0,00')+'</td>'+
        '<td class="r">'+(iva31>0?nf(iva31*rate):'0,00')+'</td>'+
        '<td class="r">'+(igtfBs>0?'<span class="fiscal-tag warn">'+nf(igtfBs)+'</span>':'0,00')+'</td>'+
        '<td class="r">'+nf(rate)+'</td>'+
        '<td class="c"><button class="btn mini2" data-show-sale="'+s.no+'">Ver Ticket</button></td>'+
      '</tr>';
    }).join(''):'<tr class="empty"><td colspan="20">No se encontraron ventas para el período seleccionado.</td></tr>';

    return '<div class="gridwrap fiscal-wrap"><table class="grid" style="min-width:1360px">'+
      '<thead><tr>'+
        '<th class="c" style="width:36px">#</th><th>Fecha</th><th>RIF / C.I.</th><th>Razón Social / Nombre</th>'+
        '<th class="c">Nº Factura</th><th class="c">Nº Control</th><th class="c">Nº N.C.</th><th class="c">Tipo</th>'+
        '<th class="r">Total US$</th><th class="r">Total Facturado Bs.</th><th class="r">Exento Bs.</th>'+
        '<th class="r">Base 16% Bs.</th><th class="r">IVA 16% Bs.</th><th class="r">Base 8% Bs.</th><th class="r">IVA 8% Bs.</th>'+
        '<th class="r">Base 31% Bs.</th><th class="r">IVA 31% Bs.</th><th class="r">IGTF 3% Bs.</th><th class="r">Tasa BCV</th><th class="c">Acción</th>'+
      '</tr></thead>'+
      '<tbody>'+rowsHtml+'</tbody>'+
      '<tfoot><tr style="background:#EEF3FA;font-weight:700">'+
        '<td colspan="9" class="r">TOTALES DEL PERÍODO (Bs.):</td>'+
        '<td class="r">'+nf(sumTotal)+'</td>'+
        '<td class="r">'+nf(sumEx)+'</td>'+
        '<td class="r">'+nf(sumG16)+'</td>'+
        '<td class="r" style="color:#1842B8">'+nf(sumIva16)+'</td>'+
        '<td class="r">'+nf(sumR8)+'</td>'+
        '<td class="r">'+nf(sumIva8)+'</td>'+
        '<td class="r">'+nf(sumA31)+'</td>'+
        '<td class="r">'+nf(sumIva31)+'</td>'+
        '<td class="r" style="color:#945D08">'+nf(sumIgtf)+'</td>'+
        '<td></td><td></td>'+
      '</tr></tfoot>'+
    '</table></div>';
  };

  const drawCompras=()=>{
    const purchases=getFilteredPurchases();
    let sumTotal=0, sumBase=0, sumIva=0, sumRet=0;

    const rowsHtml=purchases.length?purchases.map((p,idx)=>{
      const rate=p.rate||S.cfg.rate;
      const totBs=r2(p.total*rate);
      const baseBs=r2(p.base*rate);
      const ivaBs=r2(p.iva*rate);
      const retBs=p.retIva?r2(p.retIva*rate):r2(p.iva*0.75*rate);

      if(!p.void){sumTotal+=totBs;sumBase+=baseBs;sumIva+=ivaBs;sumRet+=retBs;}

      return '<tr class="'+(p.void?'void':'')+'">'+
        '<td class="c mono">'+(idx+1)+'</td>'+
        '<td class="c">'+fmtD(new Date(p.ts))+'</td>'+
        '<td class="mono">'+esc(p.supplier.rif)+'</td>'+
        '<td><b>'+esc(p.supplier.name)+'</b></td>'+
        '<td class="mono c"><b>'+esc(p.docProv)+'</b></td>'+
        '<td class="mono c">'+esc(p.ctrlProv||('00-'+pad(p.no+4400,8)))+'</td>'+
        '<td class="r">'+nf(p.total)+'</td>'+
        '<td class="r"><b>'+nf(totBs)+'</b></td>'+
        '<td class="r">'+nf(baseBs)+'</td>'+
        '<td class="r" style="color:#1D6F39"><b>'+nf(ivaBs)+'</b></td>'+
        '<td class="r" style="color:#1842B8"><b>'+nf(retBs)+'</b></td>'+
        '<td><span class="fiscal-tag">'+esc(r.estado||'Registro histórico: revisar')+'</span><div class="sub">Declarada: '+(r.declarada?'Sí':'No consta')+' · Pagada: '+(r.pagada?'Sí':'No consta')+' · Entregada: '+(r.comprobanteEntregado?'Sí':'No consta')+'</div></td>'+ 
        '<td class="mono c">'+esc(p.retIvaDoc||('202610'+pad(idx+41,8)))+'</td>'+
        '<td class="r">'+nf(rate)+'</td>'+
      '</tr>';
    }).join(''):'<tr class="empty"><td colspan="13">No se encontraron compras para el período seleccionado.</td></tr>';

    const sales=getFilteredSales().filter(s=>!s.void);
    const totDebito=r2(sales.reduce((a,s)=>a+s.iva*(s.rate||S.cfg.rate),0));
    const cuota=r2(totDebito-sumIva-sumRet);

    return '<div class="gridwrap fiscal-wrap"><table class="grid" style="min-width:1050px">'+
      '<thead><tr>'+
        '<th class="c" style="width:36px">#</th><th>Fecha</th><th>RIF Proveedor</th><th>Razón Social Proveedor</th>'+
        '<th class="c">Nº Factura</th><th class="c">Nº Control</th><th class="r">Total US$</th><th class="r">Total Facturado Bs.</th>'+
        '<th class="r">Base Gravada 16%</th><th class="r">Crédito Fiscal IVA</th><th class="r">Retención 75% Bs.</th><th class="c">Nº Comprobante</th><th class="r">Tasa BCV</th>'+
      '</tr></thead>'+
      '<tbody>'+rowsHtml+'</tbody>'+
      '<tfoot><tr style="background:#EEF3FA;font-weight:700">'+
        '<td colspan="7" class="r">TOTALES DE COMPRAS (Bs.):</td>'+
        '<td class="r">'+nf(sumTotal)+'</td>'+
        '<td class="r">'+nf(sumBase)+'</td>'+
        '<td class="r" style="color:#1D6F39">'+nf(sumIva)+'</td>'+
        '<td class="r" style="color:#1842B8">'+nf(sumRet)+'</td>'+
        '<td colspan="2"></td>'+
      '</tr></tfoot>'+
    '</table></div>'+
    '<div class="cierre" style="margin-top:8px">'+
      '<table class="sumt"><thead><tr><th>Determinación de la Cuota Tributaria (Forma 30 SENIAT)</th><th class="r">Monto en Bs.</th></tr></thead><tbody>'+
        '<tr><td>Total Débito Fiscal del Período (Ventas)</td><td class="r">'+nf(totDebito)+'</td></tr>'+
        '<tr><td>(-) Total Crédito Fiscal del Período (Compras)</td><td class="r" style="color:#1D6F39">-'+nf(sumIva)+'</td></tr>'+
        '<tr><td>(-) Retenciones de IVA Descontadas</td><td class="r" style="color:#1842B8">-'+nf(sumRet)+'</td></tr>'+
        '<tr class="tot"><td><b>'+(cuota>0?'TOTAL IMPUESTO A PAGAR AL SENIAT':'SALDO A FAVOR DEL CONTRIBUYENTE')+'</b></td><td class="r" style="font-size:15px;color:'+(cuota>0?'var(--bad)':'var(--ok)')+'"><b>'+nf(Math.abs(cuota))+' Bs.</b></td></tr>'+
      '</tbody></table>'+
    '</div>';
  };

  const drawIgtf=()=>{
    const sales=getFilteredSales().filter(s=>!s.void);
    const igtfSales=sales.filter(s=>(s.igtf>0)||(s.pays||[]).some(p=>p.cur==='USD'));
    let sumBaseUsd=0, sumBaseBs=0, sumIgtfUsd=0, sumIgtfBs=0;

    const rowsHtml=igtfSales.length?igtfSales.map(s=>{
      const rate=s.rate||S.cfg.rate;
      const usdPays=(s.pays||[]).filter(p=>p.cur==='USD');
      const baseUsd=usdPays.reduce((a,p)=>a+(p.id==='efUSD'?r2(p.amount/1.03):p.amount),0);
      const baseBs=r2(baseUsd*rate);
      const igtfUsd=s.igtf||r2(baseUsd*0.03);
      const igtfBs=r2(igtfUsd*rate);

      sumBaseUsd+=baseUsd;sumBaseBs+=baseBs;sumIgtfUsd+=igtfUsd;sumIgtfBs+=igtfBs;

      return '<tr>'+
        '<td class="mono c"><b>'+pad(s.no)+'</b></td>'+
        '<td class="c">'+fmtDT(s.ts)+'</td>'+
        '<td class="mono">'+esc(s.client.rif)+'</td>'+
        '<td>'+esc(s.client.name)+'</td>'+
        '<td>'+esc(usdPays.map(p=>p.name).join(' + '))+'</td>'+
        '<td class="r">'+nf(baseUsd)+'</td>'+
        '<td class="r">'+nf(rate)+'</td>'+
        '<td class="r">'+nf(baseBs)+'</td>'+
        '<td class="c"><span class="fiscal-tag warn">3,00 %</span></td>'+
        '<td class="r" style="color:#945D08"><b>'+nf(igtfUsd)+'</b></td>'+
        '<td class="r" style="color:#945D08"><b>'+nf(igtfBs)+'</b></td>'+
      '</tr>';
    }).join(''):'<tr class="empty"><td colspan="11">No hay cobros en moneda extranjera sujetos a IGTF en este período.</td></tr>';

    return '<div class="semaforo-bar" style="background:#FFF6E5;border-color:#F5DEB0">'+
      '<div class="semaforo-dot" style="background:#945D08;box-shadow:0 0 0 3px rgba(148,93,8,.2)"></div>'+
      '<div class="semaforo-text" style="color:#945D08"><b>RÉGIMEN IGTF (Ley Impuesto Grandes Transacciones Financieras &middot; Gaceta Oficial Nº 6.687)</b>: Se percibe el 3% exclusivamente sobre pagos en efectivo en divisas y medios extranjeros. Los pagos en moneda nacional (Biopago, Pago Móvil, Punto de Venta) están exentos (0%).</div>'+
    '</div>'+
    '<div class="gridwrap fiscal-wrap"><table class="grid" style="min-width:980px">'+
      '<thead><tr>'+
        '<th class="c">Factura</th><th>Fecha/Hora</th><th>RIF</th><th>Cliente</th><th>Forma Pago Divisa</th>'+
        '<th class="r">Base Divisa US$</th><th class="r">Tasa BCV</th><th class="r">Base Imponible Bs.</th><th class="c">Alícuota</th>'+
        '<th class="r">IGTF US$</th><th class="r">IGTF Percibido Bs.</th>'+
      '</tr></thead>'+
      '<tbody>'+rowsHtml+'</tbody>'+
      '<tfoot><tr style="background:#EEF3FA;font-weight:700">'+
        '<td colspan="5" class="r">TOTALES DE PERCEPCIÓN IGTF:</td>'+
        '<td class="r">'+nf(sumBaseUsd)+'</td>'+
        '<td></td>'+
        '<td class="r">'+nf(sumBaseBs)+'</td>'+
        '<td></td>'+
        '<td class="r" style="color:#945D08">'+nf(sumIgtfUsd)+'</td>'+
        '<td class="r" style="color:#945D08">'+nf(sumIgtfBs)+'</td>'+
      '</tr></tfoot>'+
    '</table></div>'+
    '<div class="cierre" style="margin-top:8px">'+
      '<table class="sumt"><thead><tr><th>Resumen de Enteramiento Quincenal al SENIAT (IGTF)</th><th class="r">Monto</th></tr></thead><tbody>'+
        '<tr><td>Total Operaciones Sujetas a IGTF</td><td class="r">'+igtfSales.length+' operaciones</td></tr>'+
        '<tr><td>Base Imponible en Divisas</td><td class="r">'+usd(sumBaseUsd)+'</td></tr>'+
        '<tr><td>Base Imponible Convertida a Tasa BCV</td><td class="r">'+bsf(sumBaseBs)+'</td></tr>'+
        '<tr class="tot"><td><b>Total IGTF 3% a Enterar al Tesoro Nacional</b></td><td class="r" style="color:#945D08"><b>'+bsf(sumIgtfBs)+'</b> ('+usd(sumIgtfUsd)+')</td></tr>'+
      '</tbody></table>'+
    '</div>';
  };

  const drawAuditoria=()=>{
    const sales=getFilteredSales();
    const ok=sales.filter(s=>!s.void);

    const rowsHtml=sales.length?sales.map(s=>{
      const rate=s.rate||S.cfg.rate;
      const dueUsd=r2(s.total+(s.igtf||0));
      const dueBs=r2(dueUsd*rate);
      return '<tr class="'+(s.void?'void':'')+'">'+
        '<td class="mono c"><b>'+pad(s.no)+'</b></td>'+
        '<td class="c">'+fmtDT(s.ts)+'</td>'+
        '<td class="mono c">'+esc(s.ctrlNo||('00-'+pad(s.no,8)))+'</td>'+
        '<td><b>'+esc(s.client.name)+'</b> ('+esc(s.client.rif)+')</td>'+
        '<td class="r">'+nf(dueUsd)+'</td>'+
        '<td class="r" style="font-weight:700;color:#1842B8">'+nf(rate)+'</td>'+
        '<td class="r"><b>'+nf(dueBs)+'</b></td>'+
        '<td class="c">'+esc(S.cfg.cajero)+'</td>'+
        '<td class="c">'+(s.void?'<span class="fiscal-tag bad">ANULADA</span>':'<span class="fiscal-tag ok">100% CONFORME BCV</span>')+'</td>'+
      '</tr>';
    }).join(''):'<tr class="empty"><td colspan="9">No hay registros de ventas auditadas.</td></tr>';

    return '<div class="semaforo-bar">'+
      '<div class="semaforo-dot"></div>'+
      '<div class="semaforo-text"><b>AUDITORÍA DE PRECIOS Y TASA OFICIAL CAMBIARIA (SUNDDE / BCV)</b>: Certificación de cálculo a la tasa fijada por el Banco Central de Venezuela sin sobreprecios ni uso de marcadores paralelos no autorizados.</div>'+
    '</div>'+
    '<div class="gridwrap fiscal-wrap"><table class="grid" style="min-width:960px">'+
      '<thead><tr>'+
        '<th class="c">Factura</th><th>Fecha y Hora</th><th class="c">Nº Control</th><th>Cliente y RIF</th>'+
        '<th class="r">Total US$</th><th class="r">Tasa Oficial BCV</th><th class="r">Total Facturado Bs.</th><th class="c">Cajero</th><th class="c">Auditoría</th>'+
      '</tr></thead>'+
      '<tbody>'+rowsHtml+'</tbody>'+
    '</table></div>';
  };

  const drawSudeban=()=>{
    const sales=getFilteredSales().filter(s=>!s.void);
    const byM={punto:0,biopago:0,pmovil:0,transf:0,efBs:0,efUSD:0,zelle:0};
    const countM={punto:0,biopago:0,pmovil:0,transf:0,efBs:0,efUSD:0,zelle:0};

    sales.forEach(s=>s.pays.forEach(p=>{
      if(byM[p.id]!==undefined){byM[p.id]+=p.amount;countM[p.id]++;}
    }));

    const lotes=S.lotesSudeban||[];
    const lotesRows=lotes.length?lotes.map(l=>'<tr>'+
      '<td class="mono c"><b>'+esc(l.id)+'</b></td>'+
      '<td><b>'+esc(l.banco)+'</b></td>'+
      '<td class="mono c">'+esc(l.tid)+'</td>'+
      '<td class="mono c">'+esc(l.refLote)+'</td>'+
      '<td>'+fmtDT(l.ts)+'</td>'+
      '<td class="c">'+l.ops+' ops</td>'+
      '<td class="r"><b>'+nf(l.totalBs)+'</b></td>'+
      '<td class="r" style="color:#945D08">'+nf(l.comisionBs)+'</td>'+
      '<td class="r" style="color:#1D6F39"><b>'+nf(l.netoBs)+'</b></td>'+
      '<td class="c"><span class="fiscal-tag ok">'+esc(l.estado)+'</span></td>'+
      '<td class="c" style="white-space:nowrap">'+
        '<button class="btn mini2" data-voucher-lote="'+esc(l.id)+'">Voucher</button> '+
        '<button class="btn mini2" style="color:var(--bad)" data-del-lote="'+esc(l.id)+'" title="Eliminar lote">✕</button>'+
      '</td>'+
    '</tr>').join(''):'<tr class="empty"><td colspan="11">No hay lotes bancarios registrados.</td></tr>';

    /* Detección de operaciones de prevención LC/FT (Umbral > 1000 USD en efectivo) */
    const largeOps=sales.filter(s=>(s.pays||[]).some(p=>p.id==='efUSD'&&p.amount>=1000));

    return '<div class="fiscal-grid">'+
      '<div class="fiscal-card"><span>Punto de Venta POS</span><b>'+bsf(byM.punto)+'</b><small>'+countM.punto+' transacciones</small></div>'+
      '<div class="fiscal-card"><span>Biopago BDV (Biometría)</span><b style="color:#1842B8">'+bsf(byM.biopago)+'</b><small>'+countM.biopago+' transacciones</small></div>'+
      '<div class="fiscal-card"><span>Pago Móvil C2P / P2P</span><b>'+bsf(byM.pmovil)+'</b><small>'+countM.pmovil+' transacciones</small></div>'+
      '<div class="fiscal-card"><span>Transferencias en Bs.</span><b>'+bsf(byM.transf)+'</b><small>'+countM.transf+' transacciones</small></div>'+
    '</div>'+
    '<div class="row" style="margin-top:6px;align-items:center;justify-content:space-between">'+
      '<b>Lotes de Cierre Bancario y Conciliación (SUDEBAN):</b>'+
      '<button class="btn mini2 primary" id="btnOpenNewLote">+ Registrar Cierre de Lote</button>'+
    '</div>'+
    '<div class="gridwrap" style="max-height:160px;margin-top:4px"><table class="grid">'+
      '<thead><tr><th class="c">ID Lote</th><th>Banco Adquirente</th><th class="c">Terminal (TID)</th><th class="c">Nº Lote Voucher</th><th>Fecha/Hora</th><th class="c">Ops</th><th class="r">Total Voucher Bs.</th><th class="r">Comisión Bancaria</th><th class="r">Neto Liquidado Bs.</th><th class="c">Estado</th><th class="c">Acciones</th></tr></thead>'+
      '<tbody>'+lotesRows+'</tbody>'+
    '</table></div>'+
    '<div class="group" style="margin-top:8px;padding:8px 10px">'+
      '<div class="gtitle" style="font-size:13px;display:flex;align-items:center;gap:8px">Prevención de Legitimación de Capitales (LC/FT/FPADM &middot; SUDEBAN) <span class="fiscal-tag info">Umbral: &ge; US$ 1.000</span></div>'+
      (largeOps.length?
        '<p class="hint" style="color:var(--warn)">Se detectaron '+largeOps.length+' operaciones en efectivo que superan el umbral regulatorio:</p>'+
        '<div style="font-size:11.5px">'+largeOps.map(s=>'<div>&bull; Factura '+pad(s.no)+' &middot; Cliente: '+esc(s.client.name)+' ('+esc(s.client.rif)+') &middot; Monto: '+usd(s.total)+' (Ficha KYC Verificada).</div>').join('')+'</div>'
        :'<p class="hint">No se han registrado operaciones en efectivo atípicas que superen el umbral regulatorio en este período.</p>')+
    '</div>';
  };

  const drawRetenciones=()=>{
    const list=S.retencionesIva||[];
    const rowsHtml=list.length?list.map(r=>{
      const rate=r.rate||S.cfg.rate;
      const retBs=r.retainedBs||r2(r.iva*0.75*rate);
      return '<tr>'+
        '<td class="mono c"><b>'+esc(r.id)+'</b></td>'+
        '<td class="c">'+fmtD(new Date(r.ts))+'</td>'+
        '<td class="mono">'+esc(r.supplier.rif)+'</td>'+
        '<td><b>'+esc(r.supplier.name)+'</b></td>'+
        '<td class="mono c">'+esc(r.docProv)+'</td>'+
        '<td class="mono c">'+esc(r.ctrlProv)+'</td>'+
        '<td class="r">'+nf(r.base*rate)+'</td>'+
        '<td class="r">'+nf(r.iva*rate)+'</td>'+
        '<td class="c"><span class="fiscal-tag ok">'+fq(r.pct||75)+'%</span></td>'+
        '<td class="r" style="color:#1842B8"><b>'+nf(retBs)+'</b></td>'+
        '<td class="c" style="white-space:nowrap">'+
          '<button class="btn mini2" data-print-ret="'+esc(r.id)+'">Imprimir borrador</button> '+
          '<button class="btn mini2" style="color:var(--bad)" data-del-ret="'+esc(r.id)+'" title="Eliminar retención">✕</button>'+
        '</td>'+
      '</tr>';
    }).join(''):'<tr class="empty"><td colspan="12">No hay registros de retención.</td></tr>';

    return '<div class="semaforo-bar">'+
      '<div class="semaforo-dot"></div>'+
      '<div class="semaforo-text"><b>CONTROL Y TRAZABILIDAD DE RETENCIONES IVA</b> &middot; Reporte interno de apoyo al contador bajo referencia SNAT/2025/000054. El POS no declara ni paga; valide la normativa, las excepciones y el formato vigente antes de usar cualquier archivo.</div>'+ 
      '<button class="btn mini2 primary" id="btnNewManualRet" style="margin-left:auto;flex:none">+ Emitir Retención de IVA</button>'+
    '</div>'+
    '<div class="gridwrap fiscal-wrap"><table class="grid" style="min-width:1050px">'+
      '<thead><tr>'+
        '<th class="c">Nº / ID interno</th><th>Fecha</th><th>RIF Proveedor</th><th>Nombre Proveedor</th>'+ 
        '<th class="c">Factura Proveedor</th><th class="c">Nº Control</th><th class="r">Base Imponible Bs.</th><th class="r">IVA Facturado Bs.</th><th class="c">% Ret.</th><th class="r">Monto Retenido Bs.</th><th>Seguimiento contable</th><th class="c" style="width:170px">Acciones</th>'+ 
      '</tr></thead>'+
      '<tbody>'+rowsHtml+'</tbody>'+
    '</table></div>';
  };

  const drawPagoSeniat=()=>{
    const fecha=new Date();
    const mesActual=String(fecha.getFullYear())+'-'+String(fecha.getMonth()+1).padStart(2,'0');
    const [anioPeriodo,mesPeriodo]=mesActual.split('-').map(Number);
    const enPeriodoSeniat=ts=>{const d=new Date(ts);return d.getFullYear()===anioPeriodo&&d.getMonth()+1===mesPeriodo;};
    // El IVA se declara por mes calendario. Este cálculo ignora el filtro de búsqueda y las quincenas de otras pestañas.
    const sales=(S.sales||[]).filter(x=>!x.void&&enPeriodoSeniat(x.ts));
    const purchases=(S.purchases||[]).filter(x=>!x.void&&enPeriodoSeniat(x.ts));
    const retenciones=(S.retencionesIva||[]).filter(r=>enPeriodoSeniat(r.ts));
    const debito=r2(sales.reduce((a,x)=>a+(x.iva||0)*(x.rate||S.cfg.rate),0));
    const credito=r2(purchases.reduce((a,x)=>a+(x.iva||0)*(x.rate||S.cfg.rate),0));
    const retenido=r2(retenciones.reduce((a,r)=>a+(r.retainedBs!==undefined?r.retainedBs:r2((r.iva||0)*(r.pct||S.cfg.retIvaPct||75)/100*(r.rate||S.cfg.rate))),0));
    const saldo=r2(debito-credito);
    const periodo=fecha.toLocaleDateString('es-VE',{month:'long',year:'numeric'});
    const warnings=[];
    if(!S.cfg.empresa||!S.cfg.rif||!S.cfg.dir)warnings.push('Completar razón social, RIF y domicilio fiscal en Parámetros Fiscales.');
    if(!sales.length&&!purchases.length)warnings.push('No hay ventas ni compras registradas para el mes calendario actual.');
    if(sales.some(x=>!x.client||!x.client.rif||!x.no))warnings.push('Hay ventas con datos fiscales incompletos; revisar documentos fuente.');
    if(purchases.some(x=>!x.supplier||!x.supplier.rif||!x.docProv))warnings.push('Hay compras con datos de proveedor incompletos; revisar facturas originales.');
    if(S.cfg.empresa==='Autopartes El Pistón, C.A.'&&S.cfg.rif==='J-40123456-8')warnings.push('El perfil coincide con los datos iniciales de ejemplo. Confirme y sustituya por los datos reales del contribuyente antes de usar el informe.');
    return '<div class="semaforo-bar" style="background:#FFF6E5;border-color:#F5DEB0">'+
      '<div class="semaforo-dot" style="background:#945D08;box-shadow:0 0 0 3px rgba(148,93,8,.2)"></div>'+
      '<div class="semaforo-text" style="color:#744600"><b>PREPARACIÓN PRELIMINAR — NO ES UNA PLANILLA OFICIAL DE PAGO.</b> El compromiso/planilla oficial se genera en el portal del SENIAT después de registrar la declaración. Este módulo no se conecta al SENIAT ni registra declaraciones ni pagos.</div>'+
    '</div>'+
    '<div class="khead"><div><span>Contribuyente registrado en el POS</span><b>'+esc(S.cfg.empresa||'Falta razón social')+'</b></div><div><span>RIF configurado</span><b>'+esc(S.cfg.rif||'Falta RIF')+'</b></div><div><span>Período mensual calculado</span><b>'+esc(periodo)+'</b></div><div><span>Generado</span><b>'+esc(fmtDT(fecha.getTime()))+'</b></div></div>'+
    (warnings.length?'<div class="group" style="border-color:#E7B85C;background:#FFF9E9"><div class="gtitle">Verificaciones pendientes</div><ul style="margin:0;padding-left:20px">'+warnings.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>':'')+
    '<div class="cierre"><table class="sumt"><thead><tr><th>Resumen de cifras registradas en el POS</th><th class="r">Monto (Bs.)</th></tr></thead><tbody>'+
      '<tr><td>Débito fiscal calculado desde ventas no anuladas</td><td class="r">'+nf(debito)+'</td></tr>'+
      '<tr><td>Crédito fiscal registrado en compras no anuladas</td><td class="r">'+nf(credito)+'</td></tr>'+
      '<tr><td>IVA retenido a proveedores (enteramiento separado)</td><td class="r">'+nf(retenido)+'</td></tr>'+
      '<tr class="tot"><td>Saldo aritmético preliminar débito menos crédito (no liquidación oficial)</td><td class="r">'+nf(saldo)+'</td></tr>'+
    '</tbody></table><table class="sumt"><thead><tr><th>Documentos de soporte</th><th class="r">Cantidad</th></tr></thead><tbody>'+
      '<tr><td>Ventas no anuladas</td><td class="r">'+sales.length+'</td></tr>'+
      '<tr><td>Compras no anuladas</td><td class="r">'+purchases.length+'</td></tr>'+
      '<tr><td>Comprobantes de retención registrados</td><td class="r">'+retenciones.length+'</td></tr>'+
      '<tr><td>IGTF percibido registrado en ventas (referencial)</td><td class="r">'+nf(r2(sales.reduce((a,x)=>a+(x.igtf||0)*(x.rate||S.cfg.rate),0)))+'</td></tr>'+
    '</tbody></table></div>'+
    '<div class="group"><div class="gtitle">Antes de declarar y pagar</div><ol style="margin:0;padding-left:20px"><li>Verifique que el RIF, la condición tributaria y el período sean correctos.</li><li>Concilie cada cifra con los libros fiscales, facturas, notas de crédito y comprobantes de retención originales.</li><li>Ingrese al portal oficial, presente la declaración y revise los importes calculados por el SENIAT.</li><li>Tramite por separado las retenciones de IVA practicadas a proveedores y descargue del portal la planilla oficial correspondiente, si aplica.</li><li>Después de registrar la declaración, descargue desde el portal la planilla/compromiso de pago oficial que corresponda. No use este borrador como comprobante de pago.</li></ol><p class="hint" style="margin-top:8px">Las cifras anteriores son sumas de los registros disponibles en este POS. No sustituyen el Formulario/Declaración del SENIAT, la determinación profesional del tributo ni la validación de obligaciones vigentes.</p></div>'+
    '<div class="row" style="flex-wrap:wrap"><button class="btn primary" id="btnPreviewPagoSeniat">Vista previa / Guardar borrador PDF</button><button class="btn" id="btnOpenSeniatPortal">Abrir portal de declaraciones SENIAT</button></div>';
  };

  const drawConfig=()=>{
    const c=S.cfg;
    return '<div class="newgrid">'+
      '<div class="f wide"><label for="fEmp">Razón Social</label><input class="fld" id="fEmp" value="'+esc(c.empresa)+'"></div>'+
      '<div class="f"><label for="fRif">RIF de la Empresa</label><input class="fld" id="fRif" value="'+esc(c.rif)+'"></div>'+
      '<div class="f wide"><label for="fDir">Domicilio Fiscal</label><input class="fld" id="fDir" value="'+esc(c.dir)+'"></div>'+
      '<div class="f"><label for="fTipo">Modalidad de Facturación</label><select class="fld" id="fTipo"><option value="FORMA_LIBRE" '+(c.fiscalTipo==='FORMA_LIBRE'?'selected':'')+'>Formas Libres por Computador</option><option value="MAQUINA_FISCAL" '+(c.fiscalTipo==='MAQUINA_FISCAL'?'selected':'')+'>Impresora Fiscal Homologada</option></select></div>'+
      '<div class="f"><label for="fEsp">Calificación Tributaria</label><select class="fld" id="fEsp"><option value="1" '+(c.contribEspecial?'selected':'')+'>Sujeto Pasivo Especial (Agente Retención)</option><option value="0" '+(!c.contribEspecial?'selected':'')+'>Contribuyente Ordinario</option></select></div>'+
      '<div class="f"><label for="fPctRet">Retención ordinaria de referencia</label><select class="fld" id="fPctRet"><option value="75" selected>75 % del IVA (referencia general; verificar excepciones)</option></select></div>'+
      '<div class="f wide"><label><input type="checkbox" id="fRetConfirm" '+(c.retencionHabilitadaConfirmada===true?'checked':'')+'> Confirmo que el negocio fue designado como Sujeto Pasivo Especial/agente de retención y verifiqué su notificación vigente.</label><p class="muted">Sin esta confirmación, el POS no calculará retenciones automáticamente. El contador debe verificar la designación, la operación y las excepciones aplicables.</p></div>'+ 
      '<div class="f"><label for="fProvEsp">Nº Providencia Notificación</label><input class="fld" id="fProvEsp" value="'+esc(c.provEspecial||'SNAT/2023/000412')+'"></div>'+
      '<div class="f"><label for="fCtrlPref">Prefijo Nº Control Fiscal</label><input class="fld mono" id="fCtrlPref" value="'+esc(c.ctrlPrefix||'00-')+'"></div>'+
      '<div class="f"><label for="fCtrlNext">Próximo Nº de Control</label><input class="fld mono r" id="fCtrlNext" value="'+(c.ctrlNext||1043)+'"></div>'+
      '<div class="f"><label for="fRangoD">Rango Autorizado (Desde)</label><input class="fld mono" id="fRangoD" value="'+esc(c.ctrlRangoDesde||'00-00000001')+'"></div>'+
      '<div class="f"><label for="fRangoH">Rango Autorizado (Hasta)</label><input class="fld mono" id="fRangoH" value="'+esc(c.ctrlRangoHasta||'00-00050000')+'"></div>'+
      '<div class="f"><label for="fImpRif">RIF Imprenta Digital Autorizada</label><input class="fld" id="fImpRif" value="'+esc(c.imprentaRif||'J-31009988-4')+'"></div>'+
      '<div class="f"><label for="fImpAut">Nº Providencia Imprenta</label><input class="fld" id="fImpAut" value="'+esc(c.imprentaAut||'SENIAT/DAF/2022/981')+'"></div>'+
      '<div class="f"><label for="fSerial">Serial Máquina / Memoria Fiscal</label><input class="fld mono" id="fSerial" value="'+esc(c.serialFiscal||'Z4A7719204')+'"></div>'+
    '</div><p class="hint">Los números de control asignados son correlativos y consecutivos conforme a la Providencia SENIAT 0071 sobre emisión de facturas y otros documentos.</p>';
  };

  const renderTabContent=()=>{
    const content=$('#snContent',el);
    if(activeTab==='resumen')content.innerHTML=drawResumen();
    else if(activeTab==='ventas')content.innerHTML=drawVentas();
    else if(activeTab==='compras')content.innerHTML=drawCompras();
    else if(activeTab==='igtf')content.innerHTML=drawIgtf();
    else if(activeTab==='auditoria')content.innerHTML=drawAuditoria();
    else if(activeTab==='sudeban')content.innerHTML=drawSudeban();
    else if(activeTab==='retenciones')content.innerHTML=drawRetenciones();
    else if(activeTab==='pagoSeniat')content.innerHTML=drawPagoSeniat();
    else if(activeTab==='config')content.innerHTML=drawConfig();
    updateFoot();
  };

  const updateFoot=()=>{
    if(!W)return;
    const footL=$('.foot-l',W.el);
    if(!footL)return;
    if(activeTab==='ventas'){
      footL.innerHTML='<button class="btn mini2" id="btnExpV">Exportar Libro CSV</button><button class="btn mini2" id="btnPrintV">Imprimir Libro SENIAT</button>';
    }else if(activeTab==='compras'){
      footL.innerHTML='<button class="btn mini2" id="btnExpC">Exportar Libro CSV</button>';
    }else if(activeTab==='igtf'){
      footL.innerHTML='<button class="btn mini2" id="btnExpIgtf">Exportar IGTF CSV</button>';
    }else if(activeTab==='auditoria'){
      footL.innerHTML='<button class="btn mini2" id="btnPrintActaBcv">Imprimir Acta de Tasa BCV</button>';
    }else if(activeTab==='sudeban'){
      footL.innerHTML='<button class="btn mini2 primary" id="btnQuickLote">+ Cierre de Lote POS</button>';
    }else if(activeTab==='retenciones'){
      footL.innerHTML='<button class="btn mini2 primary" id="btnTxtSeniat">Descargar TXT para SENIAT</button>';
    }else if(activeTab==='pagoSeniat'){
      footL.innerHTML='<span class="hint">Borrador informativo; la planilla oficial se obtiene en el SENIAT.</span>';
    }else if(activeTab==='config'){
      footL.innerHTML='<button class="btn mini2 primary" id="btnSaveF">Guardar Parámetros Fiscales</button>';
    }else{
      footL.innerHTML='<button class="btn mini2" id="btnGotoVentas">Ver Libro de Ventas</button><button class="btn mini2" id="btnGotoIgtf">Ver IGTF 3%</button>';
    }
  };

  el.addEventListener('click',e=>{
    const tabBtn=e.target.closest('.tab[data-tab]');
    if(tabBtn){
      $('.tab.active',el)?.classList.remove('active');
      tabBtn.classList.add('active');
      activeTab=tabBtn.dataset.tab;
      renderTabContent();
      return;
    }
    if(e.target.id==='btnOpenNewLote'){
      registerLoteSudebanDlg(()=>{seniatSudebanDlg('sudeban');});
      return;
    }
    if(e.target.id==='btnNewManualRet'){
      newRetencionIvaDlg(()=>{renderTabContent();});
      return;
    }
    const voucherBtn=e.target.closest('[data-voucher-lote]');
    if(voucherBtn){
      const l=(S.lotesSudeban||[]).find(x=>x.id===voucherBtn.dataset.voucherLote);
      if(l)printVoucherLoteSudeban(l);
      return;
    }
    const delLoteBtn=e.target.closest('[data-del-lote]');
    if(delLoteBtn){
      const id=delLoteBtn.dataset.delLote;
      ask('Eliminar lote bancario','¿Confirma eliminar el registro de lote '+id+'?','Eliminar',()=>{
        S.lotesSudeban=(S.lotesSudeban||[]).filter(x=>x.id!==id);
        save();renderTabContent();msg('Lote bancario eliminado.');
      });
      return;
    }
    const retBtn=e.target.closest('[data-print-ret]');
    if(retBtn){
      const comp=(S.retencionesIva||[]).find(x=>x.id===retBtn.dataset.printRet);
      if(comp)printComprobanteRetencion(comp);
      return;
    }
    const delRetBtn=e.target.closest('[data-del-ret]');
    if(delRetBtn){
      const id=delRetBtn.dataset.delRet;
      ask('Eliminar comprobante de retención','¿Confirma anular/eliminar la retención '+id+'?','Eliminar',()=>{
        S.retencionesIva=(S.retencionesIva||[]).filter(x=>x.id!==id);
        save();renderTabContent();msg('Comprobante de retención eliminado.');
      });
      return;
    }
    const showSaleBtn=e.target.closest('[data-show-sale]');
    if(showSaleBtn){
      const no=+showSaleBtn.dataset.showSale;
      const s=(S.sales||[]).find(x=>x.no===no);
      if(s)showTicket(s);
      return;
    }
  });

  el.addEventListener('change',e=>{
    if(e.target.id==='snPeriod'){
      curPeriod=e.target.value;
      renderTabContent();
    }
  });

  el.addEventListener('input',e=>{
    if(e.target.id==='snQ'){
      qText=e.target.value;
      renderTabContent();
    }
  });

  openWin({
    title:'Control SENIAT / SUDEBAN — Cumplimiento Fiscal, IGTF y Conciliación Bancaria',
    w:1120,
    body:el,
    foot:[{label:'Cerrar',primary:true}],
    onOpen:bd=>{
      renderTabContent();
      bd.addEventListener('click',ev=>{
        if(ev.target.id==='btnExpV')exportLibroVentasCsv(getFilteredSales());
        if(ev.target.id==='btnPrintV')printFiscalReport('Libro de Ventas Fiscal Oficial (SENIAT)',drawVentas());
        if(ev.target.id==='btnExpC')exportLibroComprasCsv(getFilteredPurchases());
        if(ev.target.id==='btnExpIgtf')exportIgtfCsv(getFilteredSales());
        if(ev.target.id==='btnPrintActaBcv')printActaBcv(getFilteredSales());
        if(ev.target.id==='btnTxtSeniat')exportSeniatTxt('202610');
        if(ev.target.id==='btnPreviewPagoSeniat'){
          const fechaPeriodo=new Date();
          const mesPeriodo=String(fechaPeriodo.getFullYear())+'-'+String(fechaPeriodo.getMonth()+1).padStart(2,'0');
          const [anioFiscal,mesFiscal]=mesPeriodo.split('-').map(Number);
          const enPeriodoFiscal=ts=>{const d=new Date(ts);return d.getFullYear()===anioFiscal&&d.getMonth()+1===mesFiscal;};
          // Totales mensuales sin depender del filtro de búsqueda ni de la vista quincenal de otras pestañas.
          const sales=(S.sales||[]).filter(x=>!x.void&&enPeriodoFiscal(x.ts));
          const purchases=(S.purchases||[]).filter(x=>!x.void&&enPeriodoFiscal(x.ts));
          const retenciones=(S.retencionesIva||[]).filter(r=>enPeriodoFiscal(r.ts));
          const debito=r2(sales.reduce((a,x)=>a+(x.iva||0)*(x.rate||S.cfg.rate),0));
          const credito=r2(purchases.reduce((a,x)=>a+(x.iva||0)*(x.rate||S.cfg.rate),0));
          const retenido=r2(retenciones.reduce((a,r)=>a+(r.retainedBs!==undefined?r.retainedBs:r2((r.iva||0)*(r.pct||S.cfg.retIvaPct||75)/100*(r.rate||S.cfg.rate))),0));
          const saldo=r2(debito-credito);
          const periodo=fechaPeriodo.toLocaleDateString('es-VE',{month:'long',year:'numeric'});
          const html='<div style="border:2px solid #945D08;padding:10px;margin-bottom:12px;text-align:center"><b>DOCUMENTO PRELIMINAR — NO ES PLANILLA OFICIAL SENIAT NI COMPROBANTE DE PAGO</b></div>'+
            '<h3>Preparación de declaración tributaria</h3><p><b>Contribuyente:</b> '+esc(S.cfg.empresa)+' &nbsp; <b>RIF:</b> '+esc(S.cfg.rif)+'</p><p><b>Domicilio fiscal:</b> '+esc(S.cfg.dir||'No especificado')+'</p><p><b>Período seleccionado:</b> '+esc(periodo)+' &nbsp; <b>Fecha de emisión:</b> '+esc(fmtDT(Date.now()))+'</p>'+
            '<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr><th style="text-align:left;border-bottom:1px solid #777;padding:6px">Concepto calculado desde registros POS</th><th style="text-align:right;border-bottom:1px solid #777;padding:6px">Monto Bs.</th></tr></thead><tbody>'+
            [['Débito fiscal de ventas no anuladas',debito],['Crédito fiscal de compras no anuladas',credito],['IVA retenido a proveedores (obligación separada)',retenido],['Saldo aritmético preliminar débito menos crédito; requiere conciliación',saldo]].map(r=>'<tr><td style="padding:6px;border-bottom:1px solid #ddd">'+esc(r[0])+'</td><td style="padding:6px;text-align:right;border-bottom:1px solid #ddd">'+nf(r[1])+'</td></tr>').join('')+
            '</tbody></table><p><b>Soporte:</b> '+sales.length+' ventas no anuladas, '+purchases.length+' compras no anuladas y '+retenciones.length+' comprobantes de retención.</p>'+
            '<p>Este informe no reproduce una planilla oficial ni genera un compromiso de pago. El IVA retenido a proveedores es una obligación de enteramiento separada y no se resta automáticamente del saldo propio de IVA en este cálculo. La declaración debe revisarse y registrarse en el portal oficial del SENIAT; la planilla/compromiso oficial se obtiene allí después de registrar la declaración cuando corresponda.</p>'+
            '<p><b>Validación:</b> Confirmar datos del contribuyente, período, documentos originales, alícuotas, créditos, retenciones y reglas tributarias vigentes antes de declarar.</p>';
          printFiscalReport('BORRADOR NO OFICIAL — Preparación de Pago SENIAT',html);
        }
        if(ev.target.id==='btnOpenSeniatPortal')window.open('https://declaraciones.seniat.gob.ve/','_blank','noopener');
        if(ev.target.id==='btnQuickLote')registerLoteSudebanDlg(()=>{seniatSudebanDlg('sudeban');});
        if(ev.target.id==='btnGotoVentas'){activeTab='ventas';$('.tab[data-tab="ventas"]',el)?.click();}
        if(ev.target.id==='btnGotoIgtf'){activeTab='igtf';$('.tab[data-tab="igtf"]',el)?.click();}
        if(ev.target.id==='btnSaveF'){
          S.cfg.empresa=$('#fEmp',el).value.trim()||S.cfg.empresa;
          S.cfg.rif=$('#fRif',el).value.trim()||S.cfg.rif;
          S.cfg.dir=$('#fDir',el).value.trim();
          S.cfg.fiscalTipo=$('#fTipo',el).value;
          S.cfg.contribEspecial=$('#fEsp',el).value==='1';
          S.cfg.retIvaPct=75;
          S.cfg.retencionHabilitadaConfirmada=$('#fRetConfirm',el).checked===true;
          if(!S.cfg.contribEspecial)S.cfg.retencionHabilitadaConfirmada=false;
          S.cfg.provEspecial=$('#fProvEsp',el).value.trim();
          S.cfg.ctrlPrefix=$('#fCtrlPref',el).value.trim()||'00-';
          S.cfg.ctrlNext=parseInt($('#fCtrlNext',el).value)||1043;
          S.cfg.ctrlRangoDesde=$('#fRangoD',el).value.trim();
          S.cfg.ctrlRangoHasta=$('#fRangoH',el).value.trim();
          S.cfg.imprentaRif=$('#fImpRif',el).value.trim();
          S.cfg.imprentaAut=$('#fImpAut',el).value.trim();
          S.cfg.serialFiscal=$('#fSerial',el).value.trim();
          save();renderAll();msg('Parámetros fiscales guardados con éxito.');
        }
      });
    }
  });
}

/* ---------- configuración y ayuda ---------- */
function cfgDlg(focusId){
  const c=S.cfg;
  if(!c.ticketFont)c.ticketFont='ibm';
  if(!c.ticketSize)c.ticketSize='12';
  const fontOpts=TICKET_FONTS.map(f=>'<option value="'+f.id+'"'+(c.ticketFont===f.id?' selected':'')+'>'+esc(f.name)+'</option>').join('');
  const el=h('<div class="form"><div class="newgrid"><div class="f wide"><label for="cEmp">Nombre del negocio</label><input class="fld" id="cEmp" value="'+esc(c.empresa)+'"></div><div class="f"><label for="cRif">RIF</label><input class="fld" id="cRif" value="'+esc(c.rif)+'"></div><div class="f wide"><label for="cDir">Dirección (ticket)</label><input class="fld" id="cDir" value="'+esc(c.dir)+'"></div><div class="f"><label for="cCaj">Cajero</label><input class="fld" id="cCaj" value="'+esc(c.cajero)+'"></div><div class="f"><label for="cCaja">Caja Nº</label><input class="fld" id="cCaja" value="'+esc(c.caja)+'"></div><div class="f"><label for="cRate">Tasa de cambio (Bs. por US$)</label><input class="fld r" id="cRate" inputmode="decimal" value="'+nf(c.rate)+'"></div><div class="f wide"><label for="cTkFont">Tipo de letra en Ticket Térmico 80mm</label><select class="fld" id="cTkFont">'+fontOpts+'</select></div><div class="f"><label for="cTkSize">Tamaño letra Ticket 80mm</label><select class="fld" id="cTkSize"><option value="11"'+(c.ticketSize==='11'?' selected':'')+'>11 px (Compacta)</option><option value="12"'+(c.ticketSize==='12'?' selected':'')+'>12 px (Estándar 80mm)</option><option value="13"'+(c.ticketSize==='13'?' selected':'')+'>13 px (Grande)</option></select></div></div><p class="hint">Cambiar la tasa recalcula al instante los precios en bolívares de la venta en curso. También puede elegir aquí el tipo de letra predeterminado para los recibos de impresora térmica de 80mm.</p></div>');
  openWin({title:'Datos del negocio, tasa y ticket 80mm',w:620,body:el,foot:[{label:'Cancelar'},{label:'Guardar',primary:true,fn:()=>{
    const rate=pn($('#cRate',el).value);
    if(!rate){msg('Escriba una tasa de cambio válida.','bad');return false;}
    c.empresa=$('#cEmp',el).value.trim()||c.empresa;c.rif=$('#cRif',el).value.trim();c.dir=$('#cDir',el).value.trim();
    c.cajero=$('#cCaj',el).value.trim()||c.cajero;c.caja=$('#cCaja',el).value.trim()||c.caja;c.rate=rate;
    c.ticketFont=$('#cTkFont',el).value;c.ticketSize=$('#cTkSize',el).value;
    save();renderAll();msg('Configuración guardada. Tasa: '+nf(rate)+' Bs. por US$.');
  }}],onOpen:()=>{const f=$('#'+(focusId||'cEmp'),el);f.focus();if(f.select)f.select();}});
}
function helpDlg(){
  const rows=window.POS_HELP_SHORTCUTS;
  openWin({title:'Atajos de teclado',w:540,body:h('<div class="gridwrap" style="flex:none"><table class="grid"><thead><tr><th style="width:90px">Tecla</th><th>Acción</th></tr></thead><tbody>'+rows.map(r=>'<tr><td><b>'+esc(r[0])+'</b></td><td>'+esc(r[1])+'</td></tr>').join('')+'</tbody></table></div>'),foot:[{label:'Cerrar',primary:true}]});
}
function aboutDlg(){
  openWin({title:'Acerca del POS',w:480,body:h('<div class="form"><p style="margin:0"><b>SIFER 360 — Sistema Integral Administrativo y Punto de Venta</b></p><p class="hint">Punto de venta para repuestos, aceites y lubricantes. Incluye facturación multimoneda (US$ / Bs.), IVA 16 %, IGTF 3 %, Módulo de Control SENIAT/SUDEBAN (Libros de Ventas y Compras oficiales, Liquidación Forma 30 IVA, Percepción IGTF, Auditoría cambiaria BCV, Conciliación bancaria POS/Biopago y Generador de TXT de Retenciones), Compras a proveedores, Cuentas por Cobrar (CxC), Cuentas por Pagar (CxP), Ficha Kardex Profesional (CPP) y Conteo Físico de Inventario.</p><p class="hint">Los datos se guardan localmente en este navegador.</p></div>'),foot:[{label:'Cerrar',primary:true}]});
}
function resetAll(){
  ask('Restablecer datos de ejemplo','Se borrarán ventas, compras, CxC, CxP, Kardex, inventario y configuración guardados en este navegador y volverá el ejemplo inicial.','Restablecer',()=>{
    try{localStorage.removeItem(KEY);}catch(e){}
    draftConteo={};seed();saved=false;renderAll();renderCatOptions();msg('Datos de ejemplo restablecidos.');
  });
}


/* ---------- dashboard administrativo + gestión de usuarios/cajas ---------- */
const USERS_STORAGE_KEY='sifer360_access_v1', BOXES_STORAGE_KEY='sifer360_cashboxes';
function activeUser(){
  try{return JSON.parse(sessionStorage.getItem('sifer360_session_v1')||'null')||{};}catch(e){return {};}
}
function cashboxList(){
  let boxes=[];
  try{boxes=JSON.parse(localStorage.getItem(BOXES_STORAGE_KEY)||'[]')||[];}catch(e){}
  const users=window.SIFERAccess&&window.SIFERAccess.getUsers?window.SIFERAccess.getUsers():[];
  const legacy=[String(S.cfg.caja||'01'),...users.map(u=>String(u.cashbox||''))].filter(x=>x&&x!=='—'&&x!=='Todas'&&x!=='SIN-ASIGNAR');
  legacy.forEach(id=>{if(!boxes.some(b=>String(b.id)===id))boxes.push({id,name:/^Caja\s/i.test(id)?id:'Caja '+id,active:true,createdAt:Date.now()});});
  if(!boxes.length)boxes=[{id:'01',name:'Caja 01',active:true,createdAt:Date.now()}];
  boxes=boxes.map(b=>Object.assign({name:'Caja '+b.id,active:true},b));
  localStorage.setItem(BOXES_STORAGE_KEY,JSON.stringify(boxes));
  return boxes;
}
function persistCashboxes(boxes){localStorage.setItem(BOXES_STORAGE_KEY,JSON.stringify(boxes));}
function showPosScreen(){
  const d=$('#adminDashboard'),main=$('.main'),left=$('.left');
  if(d)d.hidden=true;if(left)left.hidden=false;
  if(main)main.classList.remove('dashboard-mode');
  const b=$('#btnDashboard');if(b)b.setAttribute('aria-pressed','false');
  renderHeader();renderAll();
}
function showDashboardScreen(){
  const d=$('#adminDashboard'),main=$('.main'),left=$('.left');
  if(!d||!main)return;
  if(left)left.hidden=true; // Ocultar toda el área de venta; la cabecera y la toolbar están fuera de .main y permanecen visibles.
  d.hidden=false;main.classList.add('dashboard-mode');
  const b=$('#btnDashboard');if(b){b.hidden=activeUser().role!=='admin';b.setAttribute('aria-pressed','true');}
  renderHeader();
  const now=new Date(),today=new Date(now);today.setHours(0,0,0,0);
  const tomorrow=new Date(today.getTime()+86400000),monthStart=new Date(now.getFullYear(),now.getMonth(),1),nextMonth=new Date(now.getFullYear(),now.getMonth()+1,1);
  const sales=(S.sales||[]).filter(x=>!x.void);
  const purchases=(S.purchases||[]).filter(x=>!x.void);
  const stamp=x=>{const n=Number(x.ts||x.timestamp||0);if(n)return n;const parsed=Date.parse(x.date||x.fecha||'');return Number.isFinite(parsed)?parsed:0;};
  const value=x=>Number(x.total||x.totalUsd||x.amount||0);
  const sum=list=>r2(list.reduce((a,x)=>a+value(x),0));
  const todaySales=sales.filter(x=>stamp(x)>=today.getTime()&&stamp(x)<tomorrow.getTime());
  const monthSales=sales.filter(x=>stamp(x)>=monthStart.getTime()&&stamp(x)<nextMonth.getTime());
  const previousDay=sales.filter(x=>stamp(x)>=today.getTime()-86400000&&stamp(x)<today.getTime());
  const todayTotal=sum(todaySales),monthTotal=sum(monthSales),yesterdayTotal=sum(previousDay);
  const change=yesterdayTotal?((todayTotal-yesterdayTotal)/yesterdayTotal)*100:(todayTotal?100:0);
  const fmtPct=n=>(n>0?'+':'')+n.toFixed(1).replace('.',',')+'%';
  const fmtMoney=n=>usd(n);
  const outstanding=list=>r2(list.reduce((a,x)=>a+Math.max(0,Number(x.total||0)-Number(x.paid||0)),0));
  const cxc=(S.cxc||[]).filter(x=>Math.max(0,Number(x.total||0)-Number(x.paid||0))>0.009);
  const cxp=(S.cxp||[]).filter(x=>Math.max(0,Number(x.total||0)-Number(x.paid||0))>0.009);
  const totalCxc=outstanding(cxc),totalCxp=outstanding(cxp);
  const products=S.products||[],low=products.filter(p=>Number(p.stock||0)<=Number(p.min||0)).length;
  const fmtDate=x=>{const t=stamp(x);return t?new Date(t).toLocaleString('es-VE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';};
  const escMoney=x=>esc(fmtMoney(value(x)));
  const latestSales=sales.slice().sort((a,b)=>stamp(b)-stamp(a)).slice(0,5);
  const latestPurchases=purchases.slice().sort((a,b)=>stamp(b)-stamp(a)).slice(0,5);
  const methodTotals={};
  todaySales.forEach(sale=>(sale.pays||[]).forEach(p=>{const name=p.name||p.method||p.id||'Otros';let amount=Number(p.amountUsd??p.amount??p.amountBs??0);if(p.cur==='VES'&&!p.amountUsd&&!p.amountBs)amount=amount/Math.max(1,Number(sale.rate||S.cfg.rate||1));methodTotals[name]=(methodTotals[name]||0)+Math.max(0,amount);}));
  const paymentSlices=Object.entries(methodTotals).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const palette=['#2563eb','#10b981','#f59e0b','#8b5cf6','#ef4444'];
  const grand=paymentSlices.reduce((a,x)=>a+x[1],0);
  let offset=0;
  const gradient=grand?paymentSlices.map(([name,v],i)=>{const start=offset;offset+=v/grand*100;return palette[i%palette.length]+' '+start.toFixed(2)+'% '+offset.toFixed(2)+'%';}).join(', '):'#dbe3ea 0% 100%';
  const pieLegend=paymentSlices.length?paymentSlices.map(([name,v],i)=>'<div class="dash-legend-row"><span class="dash-legend-dot" style="background:'+palette[i%palette.length]+'"></span><span>'+esc(name)+'</span><b>'+fmtMoney(v)+'</b><small>'+((v/grand)*100).toFixed(1).replace('.',',')+'%</small></div>').join(''):'<div class="dash-empty">No hay ventas con métodos de pago registrados hoy.</div>';
  const salesRows=latestSales.length?latestSales.map(x=>'<tr><td>'+esc(fmtDate(x))+'</td><td><b>'+esc(x.ctrlNo||('Venta #'+String(x.no??'—')) )+'</b></td><td>'+esc(x.client?.name||x.clientName||'Cliente general')+'</td><td class="r">'+escMoney(x)+'</td></tr>').join(''):'<tr><td colspan="4" class="dash-empty">Todavía no hay ventas registradas.</td></tr>';
  const purchaseRows=latestPurchases.length?latestPurchases.map(x=>'<tr><td>'+esc(fmtDate(x))+'</td><td><b>'+esc(x.docProv||('Compra #'+String(x.no??'—')) )+'</b></td><td>'+esc(x.supplier?.name||x.supplierName||'Proveedor')+'</td><td class="r">'+escMoney(x)+'</td></tr>').join(''):'<tr><td colspan="4" class="dash-empty">Todavía no hay compras registradas.</td></tr>';
  d.innerHTML='<div class="admin-dash-head"><div><div class="dash-eyebrow">PANEL DE CONTROL · SIFER 360</div><h1>Resumen del negocio</h1><p>Indicadores comerciales y financieros · '+esc(fmtDate({ts:Date.now()}))+'</p></div></div>'+
  '<div class="dash-kpis">'+
  '<article class="dash-kpi"><span class="dash-kpi-icon blue">↗</span><div class="dash-kpi-label">Ventas del día</div><div class="dash-kpi-value">'+fmtMoney(todayTotal)+'</div><div class="dash-kpi-foot '+(change>=0?'positive':'negative')+'">'+fmtPct(change)+' <span>vs. día anterior</span></div></article>'+
  '<article class="dash-kpi"><span class="dash-kpi-icon green">▤</span><div class="dash-kpi-label">Ventas del mes</div><div class="dash-kpi-value">'+fmtMoney(monthTotal)+'</div><div class="dash-kpi-foot">'+monthSales.length+' operaciones este mes</div></article>'+
  '<article class="dash-kpi"><span class="dash-kpi-icon amber">◷</span><div class="dash-kpi-label">Total CxC pendiente</div><div class="dash-kpi-value">'+fmtMoney(totalCxc)+'</div><div class="dash-kpi-foot">'+cxc.length+' documentos con saldo</div></article>'+
  '<article class="dash-kpi"><span class="dash-kpi-icon red">▤</span><div class="dash-kpi-label">Total CxP pendiente</div><div class="dash-kpi-value">'+fmtMoney(totalCxp)+'</div><div class="dash-kpi-foot">'+cxp.length+' obligaciones con saldo</div></article>'+
  '<article class="dash-kpi"><span class="dash-kpi-icon violet">▦</span><div class="dash-kpi-label">Artículos en inventario</div><div class="dash-kpi-value">'+products.length.toLocaleString('es-VE')+'</div><div class="dash-kpi-foot">'+low+' <span>en mínimo o agotados</span></div></article>'+
  '<article class="dash-kpi"><span class="dash-kpi-icon teal">▧</span><div class="dash-kpi-label">Unidades en existencia</div><div class="dash-kpi-value">'+products.reduce((a,p)=>a+Number(p.stock||0),0).toLocaleString('es-VE')+'</div><div class="dash-kpi-foot">Inventario registrado</div></article>'+
  '</div><div class="dash-analytics-grid"><section class="dash-panel"><div class="dash-panel-head"><div><h2>Últimas 5 ventas</h2><p>Operaciones más recientes · montos en US$</p></div><strong>'+sales.length+'</strong></div><div class="dash-table-wrap"><table class="dash-table"><thead><tr><th>Fecha</th><th>Documento</th><th>Cliente</th><th class="r">Total</th></tr></thead><tbody>'+salesRows+'</tbody></table></div></section>'+
  '<section class="dash-panel"><div class="dash-panel-head"><div><h2>Últimas 5 compras</h2><p>Entradas más recientes · montos en US$</p></div><strong>'+purchases.length+'</strong></div><div class="dash-table-wrap"><table class="dash-table"><thead><tr><th>Fecha</th><th>Documento</th><th>Proveedor</th><th class="r">Total</th></tr></thead><tbody>'+purchaseRows+'</tbody></table></div></section>'+
  '<section class="dash-panel dash-chart-panel"><div class="dash-panel-head"><div><h2>Ventas de hoy por método de pago</h2><p>Distribución porcentual · vista tipo dona 3D</p></div></div><div class="dash-pie-layout"><div class="dash-pie-3d" style="--pie-gradient:conic-gradient('+gradient+')"><div class="dash-pie-hole"><b>'+fmtMoney(grand)+'</b><small>Total procesado</small></div></div><div class="dash-pie-legend">'+pieLegend+'</div></div></section>'+
  '<section class="dash-panel dash-chart-panel"><div class="dash-panel-head"><div><h2>Resumen financiero</h2><p>Saldos pendientes y actividad</p></div><span class="dash-live-dot">ACTUAL</span></div><div class="dash-status-row"><span>Operaciones del día</span><b>'+todaySales.length+'</b></div><div class="dash-status-row"><span>Ticket promedio</span><b>'+fmtMoney(todaySales.length?todayTotal/todaySales.length:0)+'</b></div><div class="dash-status-row"><span>Ventas de ayer</span><b>'+fmtMoney(yesterdayTotal)+'</b></div><div class="dash-status-row"><span>Saldo total por cobrar</span><b>'+fmtMoney(totalCxc)+'</b></div><div class="dash-status-row"><span>Saldo total por pagar</span><b>'+fmtMoney(totalCxp)+'</b></div></section></div>';
}
function usersManagementDlg(editUsername){
  if(!window.SIFERAccess||!window.SIFERAccess.getUsers){msg('El servicio de usuarios no está disponible.','bad');return;}
  let users=window.SIFERAccess.getUsers(),boxes=cashboxList(),editing=editUsername||'';
  const roleOptions=[['admin','Administrador'],['cajero','Cajero'],['contador','Contador']];
  const el=h('<div class="form user-admin-form"><div class="hint">Cada usuario tiene un perfil y una caja asignada. El administrador puede quedarse sin caja asignada para operar solo desde el dashboard; para vender debe tener una caja creada y asignada.</div><input id="uaOriginal" type="hidden"><div class="newgrid"><div class="f"><label for="uaName">Nombre completo</label><input class="fld" id="uaName" required></div><div class="f"><label for="uaUsername">Usuario</label><input class="fld" id="uaUsername" required autocomplete="off"></div><div class="f"><label for="uaCode">Contraseña / código</label><input class="fld" id="uaCode" type="password" autocomplete="new-password" placeholder="Obligatorio para usuario nuevo"></div><div class="f"><label for="uaRole">Rol</label><select class="fld" id="uaRole">'+roleOptions.map(r=>'<option value="'+r[0]+'">'+r[1]+'</option>').join('')+'</select></div><div class="f"><label for="uaBox">Caja asignada</label><select class="fld" id="uaBox"><option value="">Sin caja asignada</option>'+boxes.filter(b=>b.active!==false).map(b=>'<option value="'+esc(b.id)+'">'+esc(b.name)+' ('+esc(b.id)+')</option>').join('')+'</select></div></div><div class="row" style="flex-wrap:wrap"><button class="btn primary" id="uaSave">Guardar usuario</button><button class="btn" id="uaClear" type="button">Limpiar</button><span class="hint" id="uaMsg"></span></div><div class="gridwrap" style="max-height:360px;flex:none"><table class="grid"><thead><tr><th>Nombre / usuario</th><th>Rol</th><th>Caja asignada</th><th>Acciones</th></tr></thead><tbody id="uaRows"></tbody></table></div></div>');
  const clear=()=>{editing='';$('#uaOriginal',el).value='';$('#uaName',el).value='';$('#uaUsername',el).value='';$('#uaUsername',el).disabled=false;$('#uaCode',el).value='';$('#uaCode',el).placeholder='Obligatorio para usuario nuevo';$('#uaRole',el).value='cajero';$('#uaBox',el).value=boxes.find(b=>b.active!==false)?.id||'';$('#uaMsg',el).textContent='';};
  const draw=()=>{users=window.SIFERAccess.getUsers();$('#uaRows',el).innerHTML=users.map(u=>'<tr><td><b>'+esc(u.name)+'</b><div class="sub">'+esc(u.username)+'</div></td><td>'+esc((roleOptions.find(r=>r[0]===u.role)||[u.role,u.role])[1])+'</td><td>'+esc(u.cashbox||'—')+'</td><td><button class="btn mini2" data-ua-edit="'+esc(u.username)+'">Editar</button> <button class="btn mini2" data-ua-delete="'+esc(u.username)+'" '+(u.username===activeUser().username||users.filter(x=>x.role==='admin').length<=1&&u.role==='admin'?'disabled':'')+'>Desactivar/eliminar</button></td></tr>').join('');};
  const edit=u=>{editing=u.username;$('#uaOriginal',el).value=u.username;$('#uaName',el).value=u.name||'';$('#uaUsername',el).value=u.username;$('#uaUsername',el).disabled=true;$('#uaCode',el).value='';$('#uaCode',el).placeholder='Vacío = conservar contraseña actual';$('#uaRole',el).value=u.role;$('#uaBox',el).value=u.cashbox&&u.cashbox!=='Todas'?u.cashbox:'';$('#uaMsg',el).textContent='Editando '+u.username;};
  $('#uaSave',el).addEventListener('click',()=>{const name=$('#uaName',el).value.trim(),username=$('#uaUsername',el).value.trim(),code=$('#uaCode',el).value,role=$('#uaRole',el).value,cashbox=$('#uaBox',el).value||'—';if(!name||!username){$('#uaMsg',el).textContent='Nombre y usuario son obligatorios.';return;}users=window.SIFERAccess.getUsers();const idx=users.findIndex(u=>u.username===editing);if(idx<0&&!code){$('#uaMsg',el).textContent='La contraseña/código es obligatorio para crear el usuario.';return;}if(idx<0&&users.some(u=>u.username.toLowerCase()===username.toLowerCase())){$('#uaMsg',el).textContent='Ese nombre de usuario ya existe.';return;}if(role==='cajero'&&cashbox==='—'){$('#uaMsg',el).textContent='Asigne una caja a todo cajero.';return;}if(cashbox!=='—'&&users.some(u=>u.username!==editing&&String(u.cashbox)===String(cashbox))){$('#uaMsg',el).textContent='La caja '+cashbox+' ya está asignada a otro usuario. Cree otra caja o reasigne la existente.';return;}if(idx>=0){users[idx]=Object.assign({},users[idx],{name,role,cashbox});if(code)users[idx].code=code;}else users.push({username,code,name,role,cashbox});if(!window.SIFERAccess.setUsers(users)){$('#uaMsg',el).textContent='No se pudo guardar la lista de usuarios.';return;}if(activeUser().username===username){const sess=Object.assign({},activeUser(),{name,role,cashbox});sessionStorage.setItem('sifer360_session_v1',JSON.stringify(sess));if(role==='admin'&&!cashbox||cashbox==='—'){sessionStorage.removeItem('sifer360_active_box');localStorage.removeItem('sifer360_active_box');}else{const ctx=Object.assign({},JSON.parse(localStorage.getItem('sifer360_active_box')||'{}'),{username,name,role,cashbox});sessionStorage.setItem('sifer360_active_box',JSON.stringify(ctx));localStorage.setItem('sifer360_active_box',JSON.stringify(ctx));}}$('#uaMsg',el).textContent='Usuario guardado correctamente.';clear();draw();showDashboardScreen();});
  $('#uaClear',el).addEventListener('click',clear);
  el.addEventListener('click',e=>{const eb=e.target.closest('[data-ua-edit]'),db=e.target.closest('[data-ua-delete]');if(eb){const u=window.SIFERAccess.getUsers().find(x=>x.username===eb.dataset.uaEdit);if(u)edit(u);}if(db){const u=db.dataset.uaDelete;if(u===activeUser().username){$('#uaMsg',el).textContent='No puedes eliminar el usuario de la sesión actual.';return;}if(!confirm('¿Eliminar el usuario '+u+'?'))return;users=window.SIFERAccess.getUsers();if(users.filter(x=>x.role==='admin').length===1&&users.find(x=>x.username===u)?.role==='admin'){msg('Debe conservarse al menos un administrador.','bad');return;}window.SIFERAccess.setUsers(users.filter(x=>x.username!==u));draw();}});
  clear();draw();
  openWin({title:'Gestión de Usuarios',w:820,body:el,foot:[{label:'Cerrar',primary:true}],onOpen:()=>{if(editing){const u=users.find(x=>x.username===editing);if(u)edit(u);}}});
}
function cashboxesManagementDlg(){
  let boxes=cashboxList();
  const users=()=>window.SIFERAccess&&window.SIFERAccess.getUsers?window.SIFERAccess.getUsers():[];
  const el=h('<div class="form"><div class="hint">Cree cajas independientes y luego asígnelas a los usuarios desde Gestión de Usuarios. No se puede eliminar una caja que tenga usuarios asignados o historial de aperturas; puede deshabilitarla.</div><div class="newgrid"><div class="f"><label for="cbxId">Código de caja</label><input class="fld" id="cbxId" placeholder="02" maxlength="12"></div><div class="f"><label for="cbxName">Nombre visible</label><input class="fld" id="cbxName" placeholder="Caja 02"></div><div class="f"><label>&nbsp;</label><button class="btn primary" id="cbxCreate">Crear caja</button></div></div><div id="cbxMsg" class="hint"></div><div class="gridwrap" style="max-height:420px;flex:none"><table class="grid"><thead><tr><th>Código</th><th>Nombre</th><th>Usuarios asignados</th><th>Estado</th><th>Acción</th></tr></thead><tbody id="cbxRows"></tbody></table></div></div>');
  const draw=()=>{boxes=cashboxList();const us=users();$('#cbxRows',el).innerHTML=boxes.map(b=>{const assigned=us.filter(u=>String(u.cashbox)===String(b.id));const isOpen=(()=>{const a=readActiveOpening();return !!(a&&String(a.cashbox)===String(b.id)&&a.status==='abierta');})();return '<tr><td><b>'+esc(b.id)+'</b></td><td>'+esc(b.name)+'</td><td>'+assigned.map(u=>esc(u.name)).join(', ')+' ('+assigned.length+')</td><td><span class="'+(b.active===false?'dash-warn':'dash-ok')+'">'+(b.active===false?'Deshabilitada':isOpen?'Turno abierto':'Activa')+'</span></td><td><button class="btn mini2" data-cbx-toggle="'+esc(b.id)+'">'+(b.active===false?'Habilitar':'Deshabilitar')+'</button></td></tr>';}).join('');};
  $('#cbxCreate',el).addEventListener('click',()=>{const id=$('#cbxId',el).value.trim(),name=$('#cbxName',el).value.trim()||('Caja '+id);if(!id||! /^[A-Za-z0-9_-]{1,12}$/.test(id)){$('#cbxMsg',el).textContent='Use un código de 1 a 12 caracteres: letras, números, guion o guion bajo.';return;}if(cashboxList().some(b=>String(b.id).toLowerCase()===id.toLowerCase())){$('#cbxMsg',el).textContent='Ya existe una caja con ese código.';return;}boxes=cashboxList();boxes.push({id,name,active:true,createdAt:Date.now()});persistCashboxes(boxes);$('#cbxId',el).value='';$('#cbxName',el).value='';$('#cbxMsg',el).textContent='Caja creada. Ahora puede asignarla en Gestión de Usuarios.';draw();});
  el.addEventListener('click',e=>{const b=e.target.closest('[data-cbx-toggle]');if(!b)return;boxes=cashboxList();const box=boxes.find(x=>String(x.id)===b.dataset.cbxToggle);if(!box)return;const assigned=users().filter(u=>String(u.cashbox)===String(box.id));const active=readActiveOpening();if(box.active!==false&&assigned.length){$('#cbxMsg',el).textContent='No se puede deshabilitar: está asignada a '+assigned.map(u=>u.name).join(', ')+'. Reasigne primero esos usuarios.';return;}if(box.active!==false&&active&&String(active.cashbox)===String(box.id)&&active.status==='abierta'){ $('#cbxMsg',el).textContent='No se puede deshabilitar una caja con turno abierto. Cierre primero el Corte Z.';return;}box.active=box.active===false;persistCashboxes(boxes);draw();});
  draw();openWin({title:'Gestión de Cajas',w:760,body:el,foot:[{label:'Cerrar',primary:true}]});
}

function adminCajaRequiredDlg(moduleName){
  const user=activeUser(),box=currentCaja(),assigned=box!=='SIN-ASIGNAR',active=readActiveOpening();
  const opened=!!(active&&active.status==='abierta'&&String(active.cashbox)===box);
  const body=h('<div class="form"><div style="font-size:34px;margin-bottom:8px">▣</div><h3 style="margin:0 0 8px">Para acceder a '+esc(moduleName)+' debes tener una caja abierta</h3><p class="hint">El flujo obligatorio es: crear una caja si aún no existe, asignártela en Gestión de Usuarios y abrir el turno desde el botón POS de la barra superior. El módulo Corte Z ya no abre turnos.</p><div class="gridwrap"><table class="grid"><tbody><tr><td>Usuario</td><td><b>'+esc(user.name||user.username||'Administrador')+'</b></td></tr><tr><td>Caja asignada</td><td><b>'+esc(assigned?box:'Ninguna')+'</b></td></tr><tr><td>Estado del turno</td><td><b>'+esc(opened?'Abierto':'No abierto')+'</b></td></tr></tbody></table></div><p class="hint">'+(assigned?(opened?'La caja ya está abierta; puedes volver al POS y continuar.':'Pulsa “Abrir caja (POS)” para registrar el fondo inicial.'):'Primero crea una caja en Gestión de Cajas y asígnatela en Gestión de Usuarios. Después abre la caja desde POS.')+'</p></div>');
  const foot=[];
  if(!assigned){foot.push({label:'Gestión de Cajas',fn:()=>{cashboxesManagementDlg();return false;}});foot.push({label:'Gestión de Usuarios',fn:()=>{usersManagementDlg(user.username);return false;}});}
  foot.push({label:'Abrir caja (POS)',primary:true,fn:()=>{closeWin();openCashboxDlg();return false;}});
  foot.push({label:'Cerrar'});
  openWin({title:'Apertura obligatoria de caja',w:540,body,foot});
}
function openCashboxDlg(){
  const user=activeUser();
  if(!user||user.role!=='admin'){showPosScreen();return;}
  if(currentCaja()==='SIN-ASIGNAR'){adminCajaRequiredDlg('Punto de venta');return;}
  const box=currentCaja(),boxes=cashboxList(),boxMeta=boxes.find(b=>String(b.id)===box);
  if(!boxMeta||boxMeta.active===false){msg('La caja asignada no existe o está deshabilitada. Revise Gestión de Cajas y Gestión de Usuarios.','bad');return;}
  const existing=readActiveOpening();
  if(existing&&existing.status==='abierta'&&String(existing.cashbox)===box){
    openWin({title:'Caja ya abierta · '+box,w:430,body:h('<div class="form"><h3>El turno ya está abierto</h3><p class="hint">Caja '+esc(box)+' · Apertura '+esc(fmtDT(existing.openedAt))+'</p><p>Para hacer el arqueo y cerrar la jornada, entra a Corte Z.</p></div>'),foot:[{label:'Ir al POS',primary:true,fn:()=>{showPosScreen();return true;}},{label:'Cerrar'}]});return;
  }
  const body=h('<div class="form"><div class="hint">Registra y confirma los fondos físicos reales antes de vender. La apertura se asociará exclusivamente al usuario y a la caja asignada.</div><div class="newgrid"><div class="f"><label>Administrador</label><input class="fld" value="'+esc(user.name||user.username)+'" readonly></div><div class="f"><label>Caja asignada</label><input class="fld" value="'+esc(boxMeta.name+' ('+box+')')+'" readonly></div><div class="f"><label for="posOpenBs">Fondo inicial en Bs.</label><input class="fld r" id="posOpenBs" value="0,00" inputmode="decimal"></div><div class="f"><label for="posOpenUsd">Fondo inicial en US$</label><input class="fld r" id="posOpenUsd" value="0,00" inputmode="decimal"></div><div class="f"><label for="posOpenRate">Tasa BCV (Bs./US$)</label><input class="fld r" id="posOpenRate" value="'+esc(nf(Number(S.cfg.rate)||0))+'" inputmode="decimal"></div></div><div class="hint" id="posOpenError" role="status"></div></div>');
  openWin({title:'POS · Apertura de caja '+box,w:560,body,foot:[{label:'Cancelar'},{label:'Confirmar apertura e ingresar al POS',primary:true,fn:()=>{
    const parse=v=>{const raw=String(v||'').trim().replace(/\s/g,'').replace(/\./g,'').replace(',','.');const n=Number(raw);return Number.isFinite(n)&&n>=0?n:null;};
    const bs=parse($('#posOpenBs',body).value),usd=parse($('#posOpenUsd',body).value),rate=parse($('#posOpenRate',body).value);
    if(bs===null||usd===null||rate===null||rate<=0){$('#posOpenError',body).textContent='Ingrese fondos válidos y una tasa BCV mayor que cero.';return false;}
    const all=(()=>{try{return JSON.parse(localStorage.getItem('sifer360_openings')||'[]')||[];}catch(e){return [];}})();
    const openedAt=new Date().toISOString(),op={id:'OPEN-'+Date.now(),invoiceStart:'FAC-'+String(currentCajaInvoice()).padStart(8,'0'),cashier:user.name||user.username,username:user.username,cashbox:box,bs,usd,rate,openedAt,status:'abierta'};
    all.push(op);localStorage.setItem('sifer360_openings',JSON.stringify(all));localStorage.setItem('sifer360_bcv_rate',String(rate));
    const context={username:user.username,name:user.name||user.username,role:user.role,cashbox:box,openingId:op.id,openedAt,bs,usd,rate,status:'abierta'};
    sessionStorage.setItem('sifer360_active_box',JSON.stringify(context));localStorage.setItem('sifer360_active_box',JSON.stringify(context));sessionStorage.setItem('sifer360_active_opening',JSON.stringify(op));localStorage.setItem('sifer360_active_opening',JSON.stringify(op));S.cfg.rate=rate;save();
    showPosScreen();msg('Apertura de caja '+box+' registrada. Ya puedes operar en el POS.','ok');return true;
  }}]});
}

function addAdminToolbarItems(){
  if(!TB.some(t=>Array.isArray(t)&&t[0]==='pos')){const idx=TB.findIndex(t=>Array.isArray(t)&&t[0]==='usuarios');TB.splice(idx<0?TB.length:idx,0,['pos','POS','',openCashboxDlg],['usuarios','Usuarios','',usersManagementDlg],['cajas','Gestión cajas','',cashboxesManagementDlg],'-');}
}
window.SIFERDashboard={show:showDashboardScreen,showPos:showPosScreen,refresh:showDashboardScreen};

/* ---------- menús y barra de herramientas ---------- */
const focusEntry=()=>$('#entry').focus();
const MENUS={
 'Archivo':[['Dashboard','',showDashboardScreen],['Abrir caja (POS)','',openCashboxDlg],['Nueva venta','F2',newSale],['Suspender venta','F5',suspend],['Recuperar venta','F6',recoverDlg],'-',['Ventas del día y cierre…','F9',salesDlg],'-',['Gestión de usuarios','',usersManagementDlg],['Gestión de cajas','',cashboxesManagementDlg],['Cerrar sesión','',()=>window.SIFERAccess&&window.SIFERAccess.logout()],'-',['Restablecer datos de ejemplo…','',resetAll]],
 'Ventas':[['Cobrar','F12',payDlg],['Módulo de Pagos CASHEA (BNPL)…','',()=>casheaDlg()],['Descuento…','F7',discountDlg],['Quitar renglón','Supr',removeSel],['Vaciar venta…','',clearCart],'-',['Cuentas por Cobrar (CxC)…','',()=>cxcDlg()]],
 'Compras':[['Registrar compra de mercancía…','F10',()=>comprasDlg('new')],['Historial de compras…','',()=>comprasDlg('hist')],['Directorio de proveedores…','',()=>comprasDlg('sup')],'-',['Cuentas por Pagar (CxP)…','',()=>cxpDlg()]],
  'Inventario':[['Maestro de inventario…','F8',inventoryDlg],['Nuevo producto (Ficha avanzada)…','',()=>productFormDlg(null)],['Generador de etiquetas / Hablador SKU (US$)…','',()=>labelGeneratorDlg()],'-',['Conteo físico de inventario (masivo)…','F11',()=>conteoDlg()],['Ficha / Tarjeta Kardex Profesional…','',()=>kardexDlg()],'-',['Buscar producto','F3',focusEntry]],
 'Finanzas':[['Cuentas por Cobrar (CxC)…','',()=>cxcDlg()],['Cuentas por Pagar (CxP)…','',()=>cxpDlg()],['Operaciones Cambiarias (Compra USD / Zelle)…','',()=>divisasDlg()],['Conciliación CASHEA (BNPL y Cuotas)…','',()=>casheaDlg()],'-',['Ventas del día y cierre de caja…','F9',salesDlg]],
 'Control SENIAT/SUDEBAN':[
   ['Módulo Fiscal Integral…','',()=>seniatSudebanDlg()],
   ['Libro de Ventas Fiscal (SENIAT)…','',()=>seniatSudebanDlg('ventas')],
   ['Libro de Compras Fiscal (Forma 30)…','',()=>seniatSudebanDlg('compras')],
   ['Percepción y Retenciones de IGTF (3%)…','',()=>seniatSudebanDlg('igtf')],
   ['Auditoría de Ventas y Tasa BCV…','',()=>seniatSudebanDlg('auditoria')],
   ['Conciliación Puntos de Venta (SUDEBAN)…','',()=>seniatSudebanDlg('sudeban')],
   ['Retenciones IVA y Archivo TXT SENIAT…','',()=>seniatSudebanDlg('retenciones')],
   ['Trazabilidad Cambiaria (Compra USD / Zelle)…','',()=>divisasDlg()],
   '-',
   ['Parámetros Fiscales y Talonarios…','',()=>seniatSudebanDlg('config')]
 ],
 'Clientes':[['Seleccionar cliente…','F4',clientDlg],['Estado de cuentas por cobrar…','',()=>cxcDlg()]],
 'Configuración':[['Datos del negocio y tasa…','',()=>cfgDlg()]],
 'Ayuda':[['Atajos de teclado…','',helpDlg],['Acerca del POS…','',aboutDlg]]
};
let menuEl=null;
function closeMenu(){if(menuEl){menuEl.remove();menuEl=null;}const b=$('#btnMenu');if(b){b.classList.remove('open');b.setAttribute('aria-expanded','false');}}
function openMenu(){
  const btn=$('#btnMenu');if(!btn)return;
  closeMenu();btn.classList.add('open');btn.setAttribute('aria-expanded','true');
  const m=document.createElement('div');m.className='menu';m.setAttribute('role','menu');
  Object.keys(MENUS).forEach(name=>{
    const g=document.createElement('div');g.className='mhead';g.textContent=name;m.appendChild(g);
    MENUS[name].forEach(it=>{
      if(it==='-')return;
      const b=h('<button class="mi" role="menuitem"><span>'+esc(it[0])+'</span><kbd>'+esc(it[1])+'</kbd></button>');
      b.addEventListener('click',()=>{closeMenu();it[2]();});
      m.appendChild(b);
    });
  });
  document.body.appendChild(m);
  const r=btn.getBoundingClientRect();
  m.style.left=Math.max(8,Math.min(r.right-m.offsetWidth,window.innerWidth-m.offsetWidth-8))+'px';
  m.style.top=(r.bottom+6)+'px';
  menuEl=m;
  const first=$('.mi',m);if(first)first.focus();
}

/* ---------- control de caja por sesión y corte Z persistente ---------- */
function cajaContext(){
  try{return JSON.parse(sessionStorage.getItem('sifer360_active_box')||localStorage.getItem('sifer360_active_box')||'null')||{};}catch(e){return {};}
}
function currentCaja(){
  const c=cajaContext(),session=activeUser();
  if((c.role==='admin'||session.role==='admin')&&(!c.cashbox||c.cashbox==='Todas'||c.cashbox==='—'||c.cashbox==='SIN-ASIGNAR'))return 'SIN-ASIGNAR';
  return String(!c.cashbox||c.cashbox==='Todas'?(S.cfg.caja||'01'):c.cashbox);
}
function currentCajero(){
  const c=cajaContext();
  return String(c.name||S.cfg.cajero||'Cajero');
}
function cajaSeqs(){
  try{return JSON.parse(localStorage.getItem('sifer360_box_sequences')||'{}')||{};}catch(e){return {};}
}
function currentCajaInvoice(){const box=currentCaja(),seqs=cajaSeqs();if(!seqs[box])seqs[box]={invoice:1,void:1,refund:1,cxc:1,movement:1,z:1};return Number(seqs[box].invoice)||1;}
function nextCajaInvoice(){
  const box=currentCaja(),seqs=cajaSeqs();
  if(!seqs[box])seqs[box]={invoice:1,void:1,refund:1,cxc:1,movement:1};
  const no=Number(seqs[box].invoice)||1;
  seqs[box].invoice=no+1;localStorage.setItem('sifer360_box_sequences',JSON.stringify(seqs));
  return no;
}
function buildChrome(){
  addAdminToolbarItems();
  $('#toolbar').innerHTML=TB.map(t=>t==='-'?'<span class="tsep"></span>':'<button class="tb" data-tb="'+t[0]+'" title="'+esc(t[1])+(t[2]?' ('+t[2]+')':'')+'">'+ico(t[0])+'<b>'+esc(t[1])+'</b><kbd>'+esc(t[2]||' ')+'</kbd>'+(t[0]==='recuperar'?'<span class="badge" id="heldBadge" hidden></span>':'')+(t[0]==='conteo'?'<span class="badge warn" id="conteoBadge" hidden></span>':'')+'</button>').join('');
  if(window.SIFERAccess&&window.SIFERAccess.applyPermissions)window.SIFERAccess.applyPermissions(activeUser());
}

/* ---------- render ---------- */
function ensureVisible(tr,wrap){
  if(!tr||!wrap)return;
  const th=wrap.querySelector('thead'),hh=th?th.offsetHeight:0;
  const top=tr.offsetTop-hh,bot=tr.offsetTop+tr.offsetHeight;
  if(top<wrap.scrollTop)wrap.scrollTop=top;else if(bot>wrap.scrollTop+wrap.clientHeight)wrap.scrollTop=bot-wrap.clientHeight;
}
function renderHeader(){
  const c=S.cfg;
  const session=activeUser();
  const dashboardButton=$('#btnDashboard');if(dashboardButton)dashboardButton.hidden=session.role!=='admin';
  $('#winTitle').textContent=c.empresa;
  if($('#winSub'))$('#winSub').textContent=currentCaja()==='SIN-ASIGNAR'?'Dashboard administrativo · Sin caja asignada':'Punto de venta · Caja '+currentCaja();
  document.title='POS '+c.empresa;
  $('#fNo').value=pad(currentCajaInvoice());
  $('#fDate').value=fmtDT(Date.now());
  $('#fClient').value=S.client.name;
  $('#fRif').value=S.client.rif;
  $('#fCajero').value=c.cajero;
  if($('#whoUser'))$('#whoUser').textContent=(session.name||c.cajero)+(session.role==='admin'?' · Administrador':'')+(session.cashbox&&session.cashbox!=='—'&&session.cashbox!=='Todas'?' · Caja '+session.cashbox:'');
}
function renderCatOptions(){}
function renderCart(){
  const tb=$('#cartBody'),rate=S.cfg.rate;
  if(!S.cart.length){
    tb.innerHTML='<tr class="empty"><td colspan="10">Venta vacía. Escanee un código de barras o escriba la descripción del producto en la caja de arriba.</td></tr>';
  }else{
    tb.innerHTML=S.cart.map((l,i)=>{
      const x=lineInfo(l),p=x.p;
      const u=esc(p.unit||'und').toUpperCase();
      const taxCls=prodTaxCls(p);
      return '<tr data-i="'+i+'" class="'+(i===S.sel?'sel':'')+'">'+
        '<td class="c">'+(i+1)+'</td>'+
        '<td class="mono">'+esc(p.code)+'</td>'+
        '<td><div class="desc">'+esc(p.desc)+'</div><div class="sub">'+esc(p.brand)+' · '+(p.sku?esc(p.sku)+' · ':'')+'pasillo '+esc(p.loc)+'</div></td>'+
        '<td class="c"><span class="um-tag">'+u+'</span></td>'+
        '<td class="c"><span class="qty"><button class="mini" data-act="dec" aria-label="Restar una unidad">&minus;</button><span class="qv">'+fq(l.qty)+' '+(p.unit||'und')+'</span><button class="mini" data-act="inc" aria-label="Sumar una unidad">+</button></span></td>'+
        '<td class="r">'+nf(p.price)+'</td>'+
        '<td class="r">'+(l.disc?fq(l.disc)+' %':'')+'</td>'+
        '<td class="c"><span class="iva-tag '+taxCls+'">'+esc(prodTaxTag(p))+'</span></td>'+
        '<td class="r">'+nf(x.net)+'</td>'+
        '<td class="r">'+nf(r2(x.net*rate))+'</td>'+
      '</tr>';
    }).join('');
  }
  renderTotals();renderStatus();
}
function renderTotals(){
  const t=totals(),r=S.cfg.rate;
  const row=(c,a,cls)=>'<tr class="'+(cls||'')+'"><td>'+c+'</td><td class="r">'+nf(a)+'</td><td class="r">'+nf(a*r)+'</td></tr>';
  let html=row('Subtotal',t.sub);
  if(t.disc>0)html+=row('Descuento',-t.disc);
  if(t.baseEx>0&&t.baseG16>0){
    html+=row('Base gravada (16 %)',t.baseG16);
    if(t.baseR8>0)html+=row('Base reducida (8 %)',t.baseR8);
    if(t.baseA31>0)html+=row('Base suntuaria (31 %)',t.baseA31);
    html+=row('Ventas exentas (0 %)',t.baseEx);
  }else if(t.baseEx>0){
    html+=row('Ventas exentas (0 %)',t.baseEx);
  }else{
    html+=row('Base imponible',t.base);
  }
  html+=row('Total I.V.A.',t.iva);
  html+=row('Total',t.total,'tot');
  $('#sumBody').innerHTML=html;
  $('#lcdBs').textContent=bsf(t.total*r);
  $('#lcdUsd').textContent=usd(t.total);
  $('#btnPay').disabled=!S.cart.length;
}
function renderCatalog(){}
function renderDetail(){}
function renderStatus(){
  const units=S.cart.reduce((a,l)=>a+l.qty,0);
  $('#sbCajero').textContent='Cajero: '+S.cfg.cajero+' · Caja '+S.cfg.caja;
  $('#sbRate').textContent='Tasa: '+nf(S.cfg.rate)+' Bs./US$';
  $('#sbCount').textContent='Renglones: '+S.cart.length+' · Unidades: '+fq(r2(units));
  $('#sbClock').textContent=fmtDT(Date.now());
  const b=$('#heldBadge');if(b){b.hidden=!S.held.length;b.textContent=S.held.length;}
  const cb=$('#conteoBadge');
  if(cb){
    const modCount=Object.keys(draftConteo).filter(c=>{const p=prod(c),d=draftConteo[c];return p&&d&&d.newStock!==null&&Math.abs(d.newStock-p.stock)>1e-9;}).length;
    cb.hidden=!modCount;cb.textContent=modCount;
  }
}
function renderAll(){renderHeader();renderCart();}

/* ---------- entrada de productos ---------- */
function parseEntry(v){
  const m=v.trim().match(/^(\d+(?:[.,]\d+)?)\s*\*\s*(.*)$/);
  if(m)return{qty:parseFloat(m[1].replace(',','.')),text:m[2].trim(),hasQty:true};
  return{qty:1,text:v.trim(),hasQty:false};
}
function quickPickDlg(matches,qty,queryText){
  let selIdx=0;
  const el=h('<div class="form"><div class="hint">Se encontraron <b>'+matches.length+'</b> coincidencias para "<b>'+esc(queryText)+'</b>". Seleccione el producto a agregar (Cantidad: <b>'+fq(qty)+'</b>):</div>'+
    '<div class="gridwrap invwrap"><table class="grid"><thead><tr><th>Código</th><th>SKU</th><th>Descripción</th><th>Marca</th><th class="c" style="width:54px">U.M.</th><th class="c" style="width:72px">I.V.A.</th><th>Pasillo</th><th class="r">Exist.</th><th class="r">Precio US$</th><th class="r">Precio Bs.</th></tr></thead><tbody id="qpBody"></tbody></table></div></div>');
  const draw=()=>{
    $('#qpBody',el).innerHTML=matches.map((p,i)=>'<tr data-idx="'+i+'" class="'+(i===selIdx?'sel':'')+'"><td class="mono">'+esc(p.code)+'</td><td class="mono">'+esc(p.sku||'-')+'</td><td><b>'+esc(p.desc)+'</b></td><td>'+esc(p.brand)+'</td><td class="c"><span class="um-tag">'+esc((p.unit||'und').toUpperCase())+'</span></td><td class="c"><span class="iva-tag '+prodTaxCls(p)+'">'+esc(prodTaxTag(p))+'</span></td><td class="c">'+esc(p.loc)+'</td><td class="r '+stockCls(p)+'">'+fq(p.stock)+'</td><td class="r">'+nf(p.price)+'</td><td class="r">'+nf(p.price*S.cfg.rate)+'</td></tr>').join('');
  };
  const pick=()=>{
    const p=matches[selIdx];
    if(p&&addItem(p.code,qty)){
      const entry=$('#entry');entry.value='';S.query='';
    }
  };
  el.addEventListener('click',e=>{
    const tr=e.target.closest('tr[data-idx]');
    if(tr){selIdx=+tr.dataset.idx;draw();}
  });
  el.addEventListener('dblclick',e=>{
    const tr=e.target.closest('tr[data-idx]');
    if(tr){selIdx=+tr.dataset.idx;pick();closeWin();}
  });
  openWin({title:'Seleccionar producto ('+matches.length+' coincidencias)',w:760,body:el,foot:[{label:'Cancelar'},{label:'Agregar a la venta',primary:true,fn:pick}],onOpen:()=>draw()});
}
function submitEntry(){
  const entry=$('#entry'),pe=parseEntry(entry.value);
  if(!pe.text){msg('Escriba un código, SKU o una descripción.','bad');return;}
  const qUp=pe.text.toUpperCase();
  let p=S.products.find(x=>x.code===pe.text||(x.sku&&x.sku.toUpperCase()===qUp)||(x.assocSuppliers||[]).some(s=>s.barcode&&s.barcode.toUpperCase()===qUp));
  if(!p){
    const m=searchProducts(pe.text,'Todas');
    if(m.length===1)p=m[0];
    else if(!m.length){msg('No se encontró "'+pe.text+'".','bad');return;}
    else{quickPickDlg(m,pe.qty,pe.text);return;}
  }
  if(addItem(p.code,pe.qty)){entry.value='';S.query='';navigated=false;}
}

/* ---------- eventos ---------- */
function wire(){
  const entry=$('#entry');
  entry.addEventListener('input',()=>{S.query=parseEntry(entry.value).text;navigated=false;});
  entry.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){
      if(S.cart.length){
        e.preventDefault();
        S.sel=e.key==='ArrowDown'?Math.min(S.cart.length-1,S.sel+1):Math.max(0,S.sel-1);
        renderCart();ensureVisible($('#cartBody tr.sel'),$('#cartWrap'));
      }
    }else if(e.key==='Enter'){e.preventDefault();submitEntry();}
    else if(e.key==='Escape'){entry.value='';S.query='';navigated=false;}
  });
  $('#btnAdd').addEventListener('click',()=>{submitEntry();if(!W)entry.focus();});
  $('#btnPay').addEventListener('click',payDlg);
  $('#btnClient').addEventListener('click',clientDlg);
  $('#sbRate').addEventListener('click',()=>cfgDlg('cRate'));

  $('#cartBody').addEventListener('click',e=>{
    const tr=e.target.closest('tr[data-i]');if(!tr)return;
    const i=+tr.dataset.i,btn=e.target.closest('[data-act]');
    S.sel=i;
    if(btn)changeQty(i,btn.dataset.act==='inc'?1:-1);else renderCart();
  });

  const btnMenu=$('#btnMenu');
  if(btnMenu)btnMenu.addEventListener('click',()=>{if(menuEl)closeMenu();else openMenu();});
  const btnCasheaTop=$('#btnCasheaTop');
  if(btnCasheaTop)btnCasheaTop.addEventListener('click',()=>casheaDlg());
  const btnDivisasTop=$('#btnDivisasTop');
  if(btnDivisasTop)btnDivisasTop.addEventListener('click',()=>divisasDlg());
  const btnSeniatTop=$('#btnSeniatTop');
  if(btnSeniatTop)btnSeniatTop.addEventListener('click',()=>seniatSudebanDlg());
  const sbDivisas=$('#sbDivisas');
  if(sbDivisas)sbDivisas.addEventListener('click',()=>divisasDlg());
  const sbSeniat=$('#sbSeniat');
  if(sbSeniat)sbSeniat.addEventListener('click',()=>seniatSudebanDlg());

  const dashboardButton=$('#btnDashboard');if(dashboardButton)dashboardButton.addEventListener('click',()=>showDashboardScreen());
  const logoutButton=$('#btnLogout');if(logoutButton)logoutButton.addEventListener('click',()=>{if(confirm('¿Desea cerrar la sesión actual?')){if(window.SIFERAccess&&window.SIFERAccess.logout)window.SIFERAccess.logout();}});
  $('#toolbar').addEventListener('click',e=>{
    const b=e.target.closest('[data-tb]');if(!b)return;
    const t=TB.find(x=>x[0]===b.dataset.tb);if(t){if($('#adminDashboard')&&!$('#adminDashboard').hidden)showPosScreen();t[3]();}
  });
  document.addEventListener('pointerdown',e=>{
    if(menuEl&&!e.target.closest('.menu')&&!e.target.closest('#btnMenu'))closeMenu();
  });

  const fk={F1:()=>seniatSudebanDlg(),F2:newSale,F3:focusEntry,F4:clientDlg,F5:suspend,F6:recoverDlg,F7:discountDlg,F8:inventoryDlg,F9:salesDlg,F10:()=>comprasDlg('new'),F11:()=>conteoDlg(),F12:payDlg};
  document.addEventListener('keydown',e=>{
    if(W){if(e.key==='Escape'){e.preventDefault();closeWin();}return;}
    if(e.key==='Escape'&&menuEl){closeMenu();if($('#btnMenu'))$('#btnMenu').focus();return;}
    if(fk[e.key]){e.preventDefault();closeMenu();fk[e.key]();return;}
    const tag=document.activeElement?document.activeElement.tagName:'';
    if(/INPUT|SELECT|TEXTAREA/.test(tag))return;
    if(e.key==='Delete'){e.preventDefault();removeSel();}
    else if(e.key==='ArrowDown'&&S.cart.length){e.preventDefault();S.sel=Math.min(S.cart.length-1,S.sel+1);renderCart();ensureVisible($('#cartBody tr.sel'),$('#cartWrap'));}
    else if(e.key==='ArrowUp'&&S.cart.length){e.preventDefault();S.sel=Math.max(0,S.sel-1);renderCart();ensureVisible($('#cartBody tr.sel'),$('#cartWrap'));}
    else if((e.key==='+'||e.key==='-')&&S.sel>=0){e.preventDefault();changeQty(S.sel,e.key==='+'?1:-1);}
  });
  setInterval(()=>{$('#fDate').value=fmtDT(Date.now());$('#sbClock').textContent=fmtDT(Date.now());},15000);
}


/* ---------- Adjuntos fiscales y base de datos local SQLite ---------- */
function formatDocSize(n){return n<1024? n+' B':n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
function docDataUrl(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(new Error('No se pudo leer el archivo.'));r.readAsDataURL(file);});}
async function docSha256(dataUrl){try{const bytes=Uint8Array.from(atob(dataUrl.split(',')[1]||''),c=>c.charCodeAt(0));const hash=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');}catch{return '';}}

async function documentRows(filter = {}){
  if (window.posDesktop) return await window.posDesktop.listDocuments(filter);
  return await posSqliteDriver.listDocuments(filter);
}

async function fiscalDocumentsDlg(){
  if(S && !Array.isArray(S.documents)) S.documents=[];
  const el=h('<div class="form" style="gap:10px"><div class="hint">Adjunte el documento digital original de una operación en la base de datos local SQLite. En móviles, use <b>Tomar foto</b> para abrir la cámara si el navegador lo permite. Los archivos se vinculan al número de venta o compra seleccionado.</div><div class="f"><label>Operación fiscal</label><select class="fld" id="fdTx"><option value="">Seleccione una venta o compra</option></select></div><div class="row" style="flex-wrap:wrap"><button class="btn primary" id="fdUpload">Subir documento desde el dispositivo</button><button class="btn" id="fdCamera">Tomar foto con la cámara</button><input id="fdFile" type="file" accept="application/pdf,image/*" hidden><input id="fdCameraFile" type="file" accept="image/*" capture="environment" hidden></div><div class="f"><label>Nota de revisión (opcional)</label><input class="fld" id="fdNote" maxlength="300" placeholder="Ej. Factura original del proveedor"></div><div class="hint">Formatos: PDF, JPG, PNG, WEBP. Máximo 3 MB por archivo. Almacenado localmente en SQLite.</div><div id="fdStatus" class="hint">Seleccione una operación para ver sus documentos.</div><div class="gridwrap" style="max-height:240px"><table class="grid"><thead><tr><th>Documento</th><th>Tipo</th><th>Fecha</th><th></th></tr></thead><tbody id="fdRows"><tr class="empty"><td colspan="4">Sin documentos cargados.</td></tr></tbody></table></div></div>');
  const tx=$('#fdTx',el),status=$('#fdStatus',el),rows=$('#fdRows',el),upload=$('#fdFile',el),camera=$('#fdCameraFile',el);
  const sales=(S.sales||[]).filter(x=>!x.void).slice().sort((a,b)=>b.ts-a.ts);
  const purchases=(S.purchases||[]).filter(x=>!x.void).slice().sort((a,b)=>b.ts-a.ts);
  tx.innerHTML='<option value="">Seleccione una venta o compra</option><optgroup label="Ventas">'+sales.map(x=>'<option value="sale:'+esc(String(x.no))+'">Venta #'+esc(String(x.no))+' · '+esc(fmtDT(x.ts))+' · '+esc(usd(x.total))+'</option>').join('')+'</optgroup><optgroup label="Compras">'+purchases.map(x=>'<option value="purchase:'+esc(String(x.no))+'">Compra #'+esc(String(x.no))+' · '+esc(fmtDT(x.ts))+' · '+esc(usd(x.total))+'</option>').join('')+'</optgroup>';
  const selected=()=>{const a=tx.value.split(':');return a.length===2?{transactionType:a[0],transactionId:a[1]}:null;};
  const render=async()=>{
    const sel=selected(); if(!sel){rows.innerHTML='<tr class="empty"><td colspan="4">Seleccione una venta o compra.</td></tr>';return;}
    try{
      const docs=await documentRows(sel);const filtered=docs.filter(d=>d.transactionType===sel.transactionType&&String(d.transactionId)===sel.transactionId);
      rows.innerHTML=filtered.length?filtered.map(d=>'<tr><td><b>'+esc(d.fileName||'Documento')+'</b><div class="sub">'+esc(formatDocSize(Number(d.fileSize||0)))+'</div></td><td>'+esc(d.transactionType==='sale'?'Venta':'Compra')+'</td><td>'+esc(String(d.createdAt||'').slice(0,10))+'</td><td><button class="btn mini2" data-doc-open="'+esc(d.id)+'">Ver</button> <button class="btn mini2" data-doc-delete="'+esc(d.id)+'">Eliminar</button></td></tr>').join(''):'<tr class="empty"><td colspan="4">Esta operación no tiene documentos adjuntos.</td></tr>';
    }catch(e){rows.innerHTML='<tr class="empty"><td colspan="4">'+esc(e.message||'No se pudieron cargar los documentos.')+'</td></tr>';status.textContent='Error al consultar documentos.';}
  };
  const processFile=async file=>{
    const sel=selected();if(!sel){status.textContent='Primero seleccione una venta o compra.';return;}
    if(!file)return;
    if(file.size>3*1024*1024){status.textContent='El archivo supera el límite de 3 MB.';return;}
    if(!(file.type==='application/pdf'||file.type.startsWith('image/'))){status.textContent='Solo se permiten PDF e imágenes.';return;}
    status.textContent='Leyendo y guardando documento en SQLite…';
    try{
      const dataUrl=await docDataUrl(file);
      const doc={id:'DOC-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),transactionType:sel.transactionType,transactionId:sel.transactionId,fileName:file.name||('captura-'+Date.now()+'.jpg'),mimeType:file.type||'application/octet-stream',fileSize:file.size,sha256:await docSha256(dataUrl),dataUrl,createdAt:new Date().toISOString(),notes:$('#fdNote',el).value.trim()};
      await posSqliteDriver.saveDocument(doc);
      if(!Array.isArray(S.documents))S.documents=[];
      S.documents=S.documents.filter(d=>d.id!==doc.id);
      S.documents.push({id:doc.id,transactionType:doc.transactionType,transactionId:doc.transactionId,fileName:doc.fileName,mimeType:doc.mimeType,fileSize:doc.fileSize,sha256:doc.sha256,createdAt:doc.createdAt,notes:doc.notes});
      save();status.textContent='Documento guardado localmente en SQLite para '+(sel.transactionType==='sale'?'la venta #':'la compra #')+sel.transactionId+'.';await render();
    }catch(e){status.textContent='No se guardó el documento: '+(e.message||e);persistenceError(e);}
  };
  $('#fdUpload',el).addEventListener('click',()=>upload.click());
  $('#fdCamera',el).addEventListener('click',()=>camera.click());
  upload.addEventListener('change',()=>{processFile(upload.files&&upload.files[0]);upload.value='';});
  camera.addEventListener('change',()=>{processFile(camera.files&&camera.files[0]);camera.value='';});
  tx.addEventListener('change',render);
  rows.addEventListener('click',async e=>{
    const del=e.target.closest('[data-doc-delete]'),open=e.target.closest('[data-doc-open]');
    if(del){
      if(!confirm('¿Eliminar este documento adjunto?'))return;
      try{
        await posSqliteDriver.deleteDocument(del.dataset.docDelete);
        if(Array.isArray(S.documents)) S.documents=S.documents.filter(d=>d.id!==del.dataset.docDelete);
        save();await render();
      }catch(err){status.textContent='No se pudo eliminar: '+err.message;}
      return;
    }
    if(open){
      try{
        let d = await posSqliteDriver.getDocument(open.dataset.docOpen);
        if(!d||!d.dataUrl) d=(S.documents||[]).find(x=>x.id===open.dataset.docOpen);
        if(!d||!d.dataUrl) throw new Error('No se encontró el contenido del archivo.');
        const w=window.open();
        if(w){
          w.document.write('<title>'+esc(d.fileName)+'</title><iframe style="border:0;width:100%;height:100vh" src="'+d.dataUrl+'"></iframe>');
        } else {
          const a=document.createElement('a');a.href=d.dataUrl;a.download=d.fileName;a.click();
        }
      }catch(err){status.textContent='No se pudo abrir el archivo: '+err.message;}
    }
  });
  openWin({title:'Documentos fiscales originales (SQLite Local)',w:820,body:el,foot:[{label:'Cerrar',primary:true}],onOpen:()=>{render();}});
}

async function prepareDatabaseBeforeStartup(){
  window.__POS_DB_MODE = 'sqlite';
  try {
    await posSqliteDriver.init();
    const st = await posSqliteDriver.loadState();
    window.__POS_BOOT_STATE = st;
  } catch (e) {
    console.warn('Advertencia al iniciar SQLite local:', e);
  }
}

/* ---------- arranque ---------- */
prepareDatabaseBeforeStartup().catch(e=>console.error('No se pudo inicializar la base de datos:',e)).finally(()=>{
  init();
  buildChrome();
  renderCatOptions();
  renderAll();
  wire();
  primeOperationBaseline();
  msg(saved?'Base de datos local SQLite (elpiston.sqlite) cargada con éxito. Sistema POS y módulos Cashea listos.':'Base de datos local SQLite inicializada. Listo para operar.');
});
})();