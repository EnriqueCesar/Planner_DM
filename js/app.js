const D = window.PLANNER_DATA;
const $ = id => document.getElementById(id);
const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const typeMap = Object.fromEntries(D.visitTypes.map(t=>[t.id,t]));
let blocks = JSON.parse(localStorage.getItem('dm360_blocks_v5')||'[]');
let allEvents = [];

function dateKey(d){return d.toISOString().slice(0,10)}
function parse(s){const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
function sameDay(a,b){return dateKey(a)===dateKey(b)}
function minsToTime(min){return `${String(Math.floor(min/60)).padStart(2,'0')}:${String(min%60).padStart(2,'0')}`}
function timeToMins(t){const [h,m]=t.split(':').map(Number);return h*60+m}
function eventDate(e){return parse(e.date)}
function dayOf(d){return (d.getDay()+6)%7} // lunes 0
function inRange(d,s,e){const k=dateKey(d); return k>=s && k<=e}
function storeByCc(cc){return D.stores.find(s=>s.cc===cc)}
function km(a,b){const R=6371, toRad=x=>x*Math.PI/180; const dLat=toRad(b.lat-a.lat), dLon=toRad(b.lng-a.lng); const la1=toRad(a.lat), la2=toRad(b.lat); const h=Math.sin(dLat/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2; return 2*R*Math.asin(Math.sqrt(h));}
function driveMin(a,b){return Math.max(15,Math.round(km(a,b)*2.5+8));}
function nearestOrder(start,stores){let arr=[...stores], cur=start, out=[]; while(arr.length){arr.sort((a,b)=>driveMin(cur,a)-driveMin(cur,b)); const n=arr.shift(); out.push(n); cur=n;} return out;}
function isBlocked(d){return blocks.find(b=>inRange(d,b.start,b.end));}
function monthIndexFromSelect(){return Number($('month').value)}
function currentPeriod(d){return D.planningPeriods.find(p=>inRange(d,p.start,p.end)) || D.planningPeriods.find(p=>inRange(d,p.campaignStart,p.campaignEnd)) || D.planningPeriods[0]}
function periodForTask(d){return D.planningPeriods.find(p=>inRange(d,p.start,p.end))}
function approachFor(store){return D.approach[(store.domain||'').toLowerCase()]||D.approach.apropiacion}
function visitFocus(type, store, period){
  const base = `${approachFor(store)} Formato ${store.format}. Prioridad ${store.priority}.`;
  if(type==='vpp') return `Planeación ${period.name}: prioridades, SOA, distribución, brechas, recursos y acuerdo de seguimiento. ${base}`;
  if(type==='system') return `Observe & Coach: ejecución en piso, coaching al momento, experiencia, programación, canales y estándares. ${base}`;
  if(type==='inventory') return `System Check Inventario: precisión, organización, Daily Record Book, producto correcto, control de residuos y acciones de seguimiento. ${base}`;
  if(type==='connection') return `Conexión rápida: contacto breve, celebrar avances, validar una prioridad crítica y cerrar siguiente acción. ${base}`;
  if(type==='cdd') return `CDD_${store.manager}: conversación de desempeño y desarrollo; aspiraciones, fortalezas, barreras, compromiso y fecha de seguimiento. ${base}`;
  return base;
}
function titleFor(type, store, period){
  if(type==='cdd') return `🟣 CDD_${store.manager.split(' ')[0]} ${store.manager.split(' ')[1]||''} · ${store.cc}`;
  if(type==='vpp') return `🟢 VPP/SOA ${period.name} · ${store.cc} ${store.short}`;
  if(type==='system') return `🟠 Observe & Coach · ${store.cc} ${store.short}`;
  if(type==='inventory') return `📦 Inventario · ${store.cc} ${store.short}`;
  if(type==='connection') return `🔵 Conexión rápida · ${store.cc} ${store.short}`;
  return `${type} · ${store.cc}`;
}
function startOfMonth(y,m){return new Date(y,m,1)}
function endOfMonth(y,m){return new Date(y,m+1,0)}
function getWeekOptions(y,m){
  const start=startOfMonth(y,m), end=endOfMonth(y,m); let weeks=[], cur=addDays(start,-dayOf(start));
  while(cur<=end){const a=new Date(cur), b=addDays(cur,6); weeks.push({id:dateKey(a),label:`${a.getDate()}-${b.getDate()} ${monthNames[b.getMonth()]}`,start:dateKey(a),end:dateKey(b)}); cur=addDays(cur,7);}
  return weeks;
}
function fillSelects(){
  $('year').innerHTML='<option value="2026">2026</option>';
  $('month').innerHTML=monthNames.map((m,i)=>`<option value="${i}">${m}</option>`).join(''); $('month').value=6;
  $('type').innerHTML='<option value="all">Todas</option>'+D.visitTypes.filter(t=>!['travel','meal'].includes(t.id)).map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  $('store').innerHTML='<option value="all">Todas</option>'+D.stores.map(s=>`<option value="${s.cc}">${s.cc} · ${s.name}</option>`).join('');
  updateWeeks();
}
function updateWeeks(){const y=Number($('year').value),m=Number($('month').value); const weeks=getWeekOptions(y,m); $('week').innerHTML='<option value="all">Todas</option>'+weeks.map(w=>`<option value="${w.id}">${w.label}</option>`).join('');}
function makeTasks(){
  let tasks=[];
  D.planningPeriods.forEach(p=>{
    const types=['vpp','system','inventory','connection'];
    types.forEach((type,typeIdx)=>D.stores.forEach((s,idx)=>tasks.push({type,store:s,period:p,windowStart:p.start,windowEnd:p.end,priority:s.priority==='alta'?0:s.priority==='media'?1:2,score:(idx+typeIdx*3)%10})));
  });
  [6,9].forEach(m=>{ // Julio y Octubre
    D.stores.forEach((s,idx)=>tasks.push({type:'cdd',store:s,period:{name:m===6?'Q3 Julio':'Q4 Octubre'},windowStart:`2026-${String(m+1).padStart(2,'0')}-01`,windowEnd:`2026-${String(m+1).padStart(2,'0')}-${m===6?'31':'31'}`,priority:s.priority==='alta'?0:s.priority==='media'?1:2,score:idx}));
  });
  return tasks.sort((a,b)=>a.windowStart.localeCompare(b.windowStart)||a.priority-b.priority||a.score-b.score);
}
function weekendWorkDays(y,m){
  let sats=[], suns=[]; for(let d=startOfMonth(y,m); d<=endOfMonth(y,m); d=addDays(d,1)){if(d.getDay()===6)sats.push(dateKey(d)); if(d.getDay()===0)suns.push(dateKey(d));}
  const pairs=Math.min(sats.length,suns.length), count=pairs>=5?3:2; const preferSun=m%2===0;
  let out=[]; if(count===2){out=[sats[1]||sats[0],suns[2]||suns[0]];} else {out=preferSun?[suns[0],sats[1]||sats[0],suns[3]||suns[1]]:[sats[0],suns[1]||suns[0],sats[3]||sats[1]];} return out.filter(Boolean);
}
function workDays(){
  let days=[]; for(let d=parse(D.startDate); d<=parse(D.endDate); d=addDays(d,1)){
    const dow=d.getDay(); const wknds=weekendWorkDays(d.getFullYear(),d.getMonth());
    if(dow>=1&&dow<=5 || wknds.includes(dateKey(d))) days.push(new Date(d));
  } return days;
}
function addEvent(arr,e){arr.push({...e,id:e.id||crypto.randomUUID()});}
function schedule(){
  let events=[], tasks=makeTasks(), lastVisit={}; const days=workDays();
  days.forEach(d=>{
    const ds=dateKey(d), dow=d.getDay(), block=isBlocked(d); const y=d.getFullYear(), m=d.getMonth();
    if(block){addEvent(events,{date:ds,start:'00:00',end:'23:59',type:'block',title:`⛔ Bloqueo · ${block.reason}`,store:null,focus:'No agendar visitas físicas del DM.',route:''}); return;}
    // fijos no intrusivos
    if(dow===1){addEvent(events,{date:ds,start:'07:45',end:'08:15',type:'admin',title:'🗂️ KPI Semanal Portafolio',focus:'Validar llenado, ranking de prioridades y focos de seguimiento.',route:''});}
    if(dow===3){addEvent(events,{date:ds,start:'16:30',end:'17:30',type:'admin',title:'🛠️ Pendientes de mantenimiento',focus:'Revisar tickets, riesgos, lluvia, equipos críticos y cierre de acuerdos con tiendas.',route:''});}
    if(dow===4){addEvent(events,{date:ds,start:'16:30',end:'17:30',type:'admin',title:'🎓 Capacitación DM',focus:'Ubits, Attensi u otro desarrollo. Conectar aprendizaje con ejecución en tiendas.',route:''});}
    if(d.getDate()===30){addEvent(events,{date:ds,start:'09:00',end:'09:30',type:'admin',title:'🧾 Factura Parco',focus:'Recordatorio mensual de correo factura Parco.',route:''});}
    if(d.getDate()>=3&&d.getDate()<=6 && dow>=1&&dow<=5){addEvent(events,{date:ds,start:'17:30',end:'18:00',type:'admin',title:'🧾 Ingreso de Gastos',focus:'Buscar espacio del 3 al 6 de cada mes.',route:''});}
    if(dow===5 && Math.ceil(d.getDate()/7)%2===0){addEvent(events,{date:ds,start:'16:00',end:'17:30',type:'admin',title:'🟣 Panel Portafolio',focus:'Seguimiento quincenal a prioridades del portafolio desde tienda cercana a la ruta.',route:''});}
    if(dow===1 && Math.ceil(d.getDate()/7)%2===1){addEvent(events,{date:ds,start:'16:00',end:'17:00',type:'admin',title:'💻 Reunión virtual portafolio',focus:'Todo el portafolio o tiendas bottom según indicador.',route:''});}
    if(ds==='2026-07-20'){addEvent(events,{date:ds,start:'06:00',end:'08:30',type:'launch',title:'🚀 Arranque Summer · tienda foco',focus:'Validar producto, POS, exhibición, experiencia, muestras, comunicación y roles desde apertura.',route:'Arranque campaña'});}
    // selección de tareas por ventana y sin repetir tienda <10 días salvo tareas obligatorias de distinto tipo
    let available=tasks.filter(t=>ds>=t.windowStart && ds<=t.windowEnd && (!lastVisit[t.store.cc] || (parse(ds)-parse(lastVisit[t.store.cc]))/86400000>=4));
    const weekend=dow===0||dow===6;
    const maxStops=weekend?2: (dow===2?2:3);
    // priorizar cercanía: tomar cluster alternado y ordenar nearest
    const cluster = (dayOf(d)%2===0)?'Coacalco':'Izcalli';
    available.sort((a,b)=>(a.store.cluster===cluster?0:1)-(b.store.cluster===cluster?0:1)||a.priority-b.priority||a.windowEnd.localeCompare(b.windowEnd));
    let picked=[];
    for(const t of available){
      if(picked.length>=maxStops) break;
      if(picked.some(p=>p.store.cc===t.store.cc)) continue;
      // evitar CDD más de una vez por gerente y no llenar todo el mes: ya es task única
      picked.push(t);
    }
    if(!picked.length) return;
    // ordenar ruta por cercanía real
    const orderedStores=nearestOrder(D.home,picked.map(p=>p.store));
    picked = orderedStores.map(s=>picked.find(p=>p.store.cc===s.cc));
    let firstArrival = weekend ? (m%2===0?13*60:14*60) : (dow===1?8*60+30:(dow===2?9*60: dow===5?9*60:8*60+30));
    let curLoc=D.home, cur=firstArrival;
    // traslado salida antes de llegada
    const travel0=driveMin(curLoc,picked[0].store); addEvent(events,{date:ds,start:minsToTime(cur-travel0),end:minsToTime(cur),type:'travel',title:`🚗 Traslado · Casa → ${picked[0].store.short}`,store:picked[0].store,focus:`${travel0} min aprox`,route:`Casa Enrique → ${picked[0].store.name}`});
    picked.forEach((task,i)=>{
      const s=task.store, vt=typeMap[task.type];
      // martes hueco protegido: si cae 12:30-14:00, saltar a las 14:00
      if(dow===2 && cur < 14*60 && cur+vt.duration > 12*60+30) cur=14*60;
      // comida a media jornada; martes se deja hueco, no evento
      if(!weekend && dow!==2 && cur < 13*60 && cur+vt.duration>13*60){addEvent(events,{date:ds,start:'13:00',end:'14:00',type:'meal',title:'🍽️ Comida',store:s,focus:'Pausa a media jornada.',route:s.name}); cur=14*60;}
      if(weekend && cur < 17*60 && cur+vt.duration>17*60){addEvent(events,{date:ds,start:'17:00',end:'18:00',type:'meal',title:'🍽️ Comida',store:s,focus:'Pausa de jornada de acompañamiento.',route:s.name}); cur=18*60;}
      const start=cur, end=cur+vt.duration;
      addEvent(events,{date:ds,start:minsToTime(start),end:minsToTime(end),type:task.type,title:titleFor(task.type,s,task.period),store:s,focus:visitFocus(task.type,s,task.period),route:s.map,period:task.period.name});
      lastVisit[s.cc]=ds; cur=end; curLoc=s; tasks=tasks.filter(x=>x!==task);
      const next = picked[i+1]?.store;
      if(next){const tm=driveMin(curLoc,next); addEvent(events,{date:ds,start:minsToTime(cur),end:minsToTime(cur+tm),type:'travel',title:`🚗 Traslado · ${curLoc.short} → ${next.short}`,store:next,focus:`${tm} min aprox`,route:`${curLoc.name} → ${next.name}`}); cur+=tm; curLoc=next;}
    });
    const dayEnd = weekend ? (firstArrival===13*60?21*60:22*60) : 18*60+30;
    if(cur+20<dayEnd){addEvent(events,{date:ds,start:minsToTime(cur),end:minsToTime(Math.min(cur+60,dayEnd-30)),type:'adapt',title:'🧭 Adaptación a lo inesperado',focus:'Notas de visita, ajuste de plan, llamada de seguimiento o eventualidad.',route:''}); cur=Math.min(cur+60,dayEnd-30);}
    const ret=driveMin(curLoc,D.home); addEvent(events,{date:ds,start:minsToTime(cur),end:minsToTime(cur+ret),type:'travel',title:`🚗 Traslado · ${curLoc.short} → Casa`,store:curLoc,focus:`${ret} min aprox`,route:`${curLoc.name} → Casa Enrique`});
  });
  allEvents = events.sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start));
}
function filteredEvents(){
  const y=Number($('year').value), m=Number($('month').value), type=$('type').value, store=$('store').value, wk=$('week').value, q=($('search').value+' '+$('detailSearch').value).toLowerCase().trim();
  const weeks=getWeekOptions(y,m); const weekObj=weeks.find(w=>w.id===wk);
  return allEvents.filter(e=>{
    const d=eventDate(e); if(d.getFullYear()!==y||d.getMonth()!==m) return false;
    if(weekObj && !inRange(d,weekObj.start,weekObj.end)) return false;
    if(type!=='all' && e.type!==type) return false;
    if(store!=='all' && e.store?.cc!==store) return false;
    if(q){const blob=[e.title,e.focus,e.store?.name,e.store?.manager,e.type,e.period].join(' ').toLowerCase(); if(!blob.includes(q)) return false;}
    return true;
  });
}
function renderKpis(ev){
  const physical=ev.filter(e=>['vpp','system','inventory','connection','cdd'].includes(e.type));
  const covered=new Set(physical.map(e=>e.store?.cc).filter(Boolean));
  const critical=physical.filter(e=>e.store?.priority==='alta').length;
  const vals=[['Visitas mes',physical.length,'actividades físicas'],['Tiendas cubiertas',`${covered.size}/10`,'portafolio'],['Prioridad alta',critical,'visitas a tiendas críticas'],['VPP/SOA',ev.filter(e=>e.type==='vpp').length,'periodo'],['Inventario',ev.filter(e=>e.type==='inventory').length,'periodo'],['Adaptación',ev.filter(e=>e.type==='adapt').length,'espacios protegidos']];
  $('kpis').innerHTML=vals.map(v=>`<div><small>${v[0]}</small><strong>${v[1]}</strong><span>${v[2]}</span></div>`).join('');
}
function renderIntent(){
  const m=Number($('month').value); const p=currentPeriod(new Date(2026,m,15));
  $('intent').innerHTML=`<div class="intentBlock"><h3>${p.name}</h3><p><b>Planificación:</b> ${p.start} a ${p.end}</p><p><b>Campaña:</b> ${p.campaignStart} a ${p.campaignEnd}</p><p><b>Regla:</b> 1 VPP/SOA, 1 Observe & Coach, 1 Inventario y 1 Conexión por tienda en el periodo.</p></div><div class="intentBlock"><h3>Approach DM</h3><p>Preparar → trabajar hombro a hombro → dar seguimiento. Conversaciones con valentía, pertenencia y enfoque humano.</p><span class="pill high">Alta: Luna, Cosmo N1, Patio</span><span class="pill mid">Media: Apropiación</span><span class="pill good">Estable: Asesoramiento</span></div>`;
}
function renderCalendar(ev){
  const y=Number($('year').value),m=Number($('month').value); $('calendarTitle').textContent=`Agenda · ${monthNames[m]} ${y}`;
  const first=startOfMonth(y,m), start=addDays(first,-dayOf(first)); const cells=[];
  for(let i=0;i<42;i++){const d=addDays(start,i), ds=dateKey(d), dayEvents=ev.filter(e=>e.date===ds); const prot=(d.getDay()===2)?'<div class="protected">Martes 12:30–14:00 libre</div>':'';
    cells.push(`<div class="day ${d.getMonth()!==m?'offMonth':''}"><div class="dateNum">${d.getDate()}</div>${prot}${dayEvents.slice(0,7).map(e=>`<div class="event ${e.type}" title="${e.title}" style="--color:${typeMap[e.type]?.color||'#777'}"><span class="time">${e.start}</span>${e.title}</div>`).join('')}${dayEvents.length>7?`<div class="muted">+${dayEvents.length-7} más</div>`:''}</div>`);
  }
  $('monthGrid').innerHTML=cells.join('');
  $('legend').innerHTML=D.visitTypes.map(t=>`<span style="--c:${t.color}">${t.icon} ${t.name}</span>`).join('');
}
function routeEventsForDay(day){return allEvents.filter(e=>e.date===day && ['travel','vpp','system','inventory','connection','cdd','launch'].includes(e.type));}
function updateRouteSelect(){
  const y=Number($('year').value),m=Number($('month').value); const days=[...new Set(allEvents.filter(e=>{const d=eventDate(e); return d.getFullYear()===y&&d.getMonth()===m&&e.store}).map(e=>e.date))];
  $('routeDay').innerHTML=days.map(ds=>`<option value="${ds}">${ds.slice(8,10)} ${monthNames[m]}</option>`).join('');
}
function renderRoute(){
  const day=$('routeDay').value; const ev=routeEventsForDay(day); const stops=[]; ev.forEach(e=>{if(e.store && !stops.some(s=>s.cc===e.store.cc)) stops.push(e.store)});
  const canvas=$('routeCanvas'), ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#eff9f5'; ctx.fillRect(0,0,canvas.width,canvas.height);
  const pts=[D.home,...D.stores]; const latMin=Math.min(...pts.map(p=>p.lat)),latMax=Math.max(...pts.map(p=>p.lat)),lngMin=Math.min(...pts.map(p=>p.lng)),lngMax=Math.max(...pts.map(p=>p.lng));
  const xy=p=>({x:25+(p.lng-lngMin)/(lngMax-lngMin)*280,y:25+(latMax-p.lat)/(latMax-latMin)*180});
  ctx.lineWidth=3; ctx.strokeStyle='#2d856a'; ctx.beginPath(); [D.home,...stops,D.home].forEach((p,i)=>{const q=xy(p); if(i===0)ctx.moveTo(q.x,q.y); else ctx.lineTo(q.x,q.y)}); ctx.stroke();
  [D.home,...stops].forEach((p,i)=>{const q=xy(p); ctx.fillStyle=i===0?'#c39a34':'#006241'; ctx.beginPath(); ctx.arc(q.x,q.y,6,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#17342d'; ctx.font='10px Arial'; ctx.fillText(p.short||p.name,q.x+7,q.y-7);});
  $('routeSteps').innerHTML=ev.filter(e=>e.type==='travel').map((e,i)=>`<div class="step"><b>${i===0?'Salida':'Parada '+i}</b><span>${e.route||e.title} · ${e.focus}</span></div>`).join('') || '<div class="step"><b>Sin ruta</b><span>No hay visitas en el día seleccionado.</span></div>';
}
function renderDetail(ev){
  $('detailBody').innerHTML=ev.map(e=>`<tr><td>${e.date}</td><td>${e.start}<br>${e.end}</td><td><b>${e.title}</b></td><td>${e.store?`${e.store.cc} · ${e.store.name}<br><span class="muted">${e.store.manager}</span>`:'-'}</td><td><span class="typeBadge" style="--color:${typeMap[e.type]?.color||'#777'}">${typeMap[e.type]?.name||e.type}</span></td><td>${e.focus||''}</td><td>${e.store?.map?`<a href="${e.store.map}" target="_blank">Maps</a><br>`:''}<span class="muted">${e.route||''}</span></td></tr>`).join('');
}
function render(){const ev=filteredEvents(); renderKpis(ev); renderIntent(); renderCalendar(ev); updateRouteSelect(); renderRoute(); renderDetail(ev);}
function addBlock(){const s=$('blockStart').value,e=$('blockEnd').value,reason=$('blockReason').value||'Bloqueo'; if(!s||!e) return alert('Selecciona fecha desde y hasta.'); blocks.push({start:s,end:e,reason}); localStorage.setItem('dm360_blocks_v5',JSON.stringify(blocks)); schedule(); render();}
function icsDate(e,t){return e.date.replaceAll('-','')+'T'+t.replace(':','')+'00'}
function esc(s){return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n')}
function exportICS(scope){
  const ev = scope==='year'?allEvents:filteredEvents();
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Planner DM 360 v5//ES','CALSCALE:GREGORIAN','X-WR-CALNAME:Calendario DM 360'];
  ev.forEach(e=>{lines.push('BEGIN:VEVENT',`UID:${e.id}@dm360-v5`,`DTSTAMP:20260615T120000Z`,`DTSTART:${icsDate(e,e.start)}`,`DTEND:${icsDate(e,e.end)}`,`SUMMARY:${esc(e.title)}`,`DESCRIPTION:${esc((e.focus||'')+'\nRuta: '+(e.route||'')+'\nTipo: '+(typeMap[e.type]?.name||e.type))}`,`LOCATION:${esc(e.store?.name||'')}`,`CATEGORIES:${esc(typeMap[e.type]?.name||e.type)}`,'END:VEVENT')});
  lines.push('END:VCALENDAR'); const blob=new Blob([lines.join('\r\n')],{type:'text/calendar'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=scope==='year'?'Planner_DM_360_2026_v5.ics':`Planner_DM_360_${monthNames[Number($('month').value)]}_2026_v5.ics`; a.click(); URL.revokeObjectURL(a.href);
}
function init(){fillSelects(); schedule(); render(); ['year','month','week','type','store','search','detailSearch','routeDay'].forEach(id=>$(id).addEventListener('change',()=>{if(id==='month')updateWeeks(); render();})); $('search').addEventListener('input',render); $('detailSearch').addEventListener('input',render); $('generate').onclick=()=>{schedule();render();}; $('addBlock').onclick=addBlock; $('exportMonth').onclick=()=>exportICS('month'); $('exportYear').onclick=()=>exportICS('year');}
init();
