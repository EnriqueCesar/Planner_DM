
const $ = id => document.getElementById(id);
let DATA, allEvents = [], blocks = [];
const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const typeClass = t => (t||'').split(' ')[0].replace('&','');

function parseDate(s){ const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
function fmtDate(d){ return d.toISOString().slice(0,10); }
function addDays(d,n){ const x=new Date(d); x.setDate(x.getDate()+n); return x; }
function dowMon(d){ return (d.getDay()+6)%7; }
function inRange(d,a,b){ const x=fmtDate(d); return x>=a && x<=b; }
function minToTime(min){ return String(Math.floor(min/60)).padStart(2,'0')+':'+String(min%60).padStart(2,'0'); }
function timeToMin(t){ const [h,m]=t.split(':').map(Number); return h*60+m; }
function distanceKm(a,b){
  const R=6371, toRad=v=>v*Math.PI/180;
  const dLat=toRad(b.lat-a.lat), dLng=toRad(b.lng-a.lng);
  const s=Math.sin(dLat/2)**2+Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(s));
}
function travelMin(a,b){ return Math.max(18, Math.round(distanceKm(a,b)/28*60)+12); }
function activeCampaign(dateStr){
  return DATA.campaigns.find(c=>dateStr>=c.planningStart && dateStr<=c.planningEnd) ||
         DATA.campaigns.find(c=>dateStr>=c.campaignStart && dateStr<=c.campaignEnd) ||
         DATA.campaigns.find(c=>dateStr<=c.campaignEnd) || DATA.campaigns.at(-1);
}
function priorityScore(s){
  let score = s.domain==='APRENDIZAJE'?90:s.domain==='APROPIACION'?60:35;
  if(s.seniority<0.5) score+=18; else if(s.seniority<1.5) score+=10;
  if(s.format.includes('Mall') || s.name.includes('Plaza') || s.name.includes('Galerias')) score+=6;
  return score;
}
function visitFocus(store, type, campaign){
  const focus = DATA.approachFocus[store.domain] || [];
  const base = {
    'VPP': 'planeación, SOA, estándares, prioridades de campaña y plan de acción',
    'Observe & Coach': 'observación en piso, coaching, distribución, brechas operativas y ejecución',
    'Conexión rápida': 'relación, seguimiento puntual, conexión con partners y aceleración de resultados',
    'Desarrollo': 'conversación de desempeño, aspiraciones, feedback y próximos compromisos',
    'System Check': 'inventario, procesos, seguridad, efectivo, WFM, RSA o canales digitales'
  }[type] || 'seguimiento integral de portafolio';
  return `${base} · ${focus.slice(0,3).join(', ')} · ${campaign.name}`;
}
function event(title,date,start,end,type,store=null,focus='',route=''){
  return {title,date,start,end,type,store,focus,route};
}
function isBlocked(dateStr){ return blocks.some(b=>dateStr>=b.start && dateStr<=b.end); }
function blockReason(dateStr){ const b=blocks.find(b=>dateStr>=b.start && dateStr<=b.end); return b?b.reason:''; }
function addAdminEvents(events){
  for(let d=parseDate(DATA.settings.startDate); d<=parseDate(DATA.settings.endDate); d=addDays(d,1)){
    const ds=fmtDate(d), wd=dowMon(d), day=d.getDate();
    if(isBlocked(ds)){ events.push(event(blockReason(ds),ds,'09:00','18:00','Bloqueo',null,'Bloqueo total del día. Sin visitas físicas.','')); continue; }
    if(wd===0) events.push(event('KPI Semanal Portafolio',ds,'08:30','09:30','Administrativo',null,'Validar llenado de KPIs del portafolio antes de 09:30','Actividad administrativa'));
    if(wd===1) events.push(event('Reunión Centro Norte',ds,'13:00','14:30','Administrativo',null,'Reunión semanal Teams. No programar visitas en este horario.','Actividad administrativa'));
    if(wd===0 && Math.floor((day-1)/7)%2===0) events.push(event('Reunión Virtual Portafolio',ds,'10:00','10:45','Administrativo',null,'Alineación quincenal con portafolio / bottom indicador','Virtual'));
    if(wd===2 && day>=1 && day<=7) events.push(event('Reunión Portafolio Física',ds,'10:00','11:30','Desarrollo',DATA.stores.find(s=>s.cc==='38401'),'Resultados, alineación y prioridades del portafolio','Sede Coacalco'));
    if(wd===3) events.push(event('Capacitación DM',ds,'16:00','17:00','Administrativo',null,'Ubits, Attensi u otros cursos de desarrollo','Actividad administrativa'));
    if(day>=3 && day<=6) events.push(event('Ingreso de Gastos',ds,'17:00','17:30','Administrativo',null,'Buscar espacio del 3 al 6','Actividad administrativa'));
    if(day===30) events.push(event('Factura Parco',ds,'09:00','09:30','Administrativo',null,'Recordatorio correo factura Parco','Actividad administrativa'));
    if(wd===4) events.push(event('Espacio para lo inesperado',ds,'15:00','16:00','Inesperado',null,'Reserva semanal para contingencias, llamadas, ajustes o urgencias','Buffer'));
    if(wd>=0 && wd<=4) events.push(event('Comida',ds,'14:30','15:30','Comida',null,'1 hora de comida diaria',''));
  }
}
function monthWeekendTarget(year, month){
  let weekends=0;
  const last=new Date(year,month+1,0).getDate();
  for(let d=1;d<=last;d++){ const wd=new Date(year,month,d).getDay(); if(wd===6) weekends++; }
  return weekends>=5?3:2;
}
function strategicTypeForDate(ds, store, lastType){
  const a=DATA.strategicActivities.find(x=>ds>=x.start && ds<=x.end && ['VPP','Observe & Coach','System Check','Desarrollo'].includes(x.type));
  if(a){
    if(a.type==='System Check') return store.domain==='APRENDIZAJE'?'Observe & Coach':'System Check';
    return a.type==='Desarrollo'?'Desarrollo':a.type;
  }
  const n = lastType[store.cc] || 0;
  const cycle = ['Observe & Coach','Conexión rápida','Observe & Coach','Desarrollo'];
  lastType[store.cc]=n+1;
  return cycle[n%cycle.length];
}
function buildSchedule(){
  let events=[]; addAdminEvents(events);
  const stores=[...DATA.stores].sort((a,b)=>priorityScore(b)-priorityScore(a));
  const lastVisit={}; const lastType={}; const storeCounts={};
  stores.forEach(s=>{ lastVisit[s.cc]=null; storeCounts[s.cc]=0; });
  const start=parseDate(DATA.settings.startDate), end=parseDate(DATA.settings.endDate);
  const weekendWorked={};
  for(let d=new Date(start); d<=end; d=addDays(d,1)){
    const ds=fmtDate(d), wd=dowMon(d);
    if(isBlocked(ds)) continue;
    const ym=ds.slice(0,7); weekendWorked[ym]=weekendWorked[ym]||0;
    let capacity = wd<=4 ? (wd===1?1:2) : 0; // Tuesday only one due CN meeting.
    if(wd>=5){
      const target=monthWeekendTarget(d.getFullYear(), d.getMonth());
      const isGoodWeekend = (wd===5 && weekendWorked[ym]<target) || (wd===6 && weekendWorked[ym]<target && weekendWorked[ym]===0);
      if(isGoodWeekend){ capacity=1; weekendWorked[ym]++; }
    }
    if(capacity===0) continue;
    let selected=[];
    const eligible=stores.filter(s=>{
      if(selected.find(x=>x.cc===s.cc)) return false;
      if(!lastVisit[s.cc]) return true;
      return (parseDate(ds)-parseDate(lastVisit[s.cc]))/(864e5) >= 7;
    }).sort((a,b)=>{
      const da=lastVisit[a.cc]? (parseDate(ds)-parseDate(lastVisit[a.cc]))/864e5 : 99;
      const db=lastVisit[b.cc]? (parseDate(ds)-parseDate(lastVisit[b.cc]))/864e5 : 99;
      return (db+priorityScore(b)/100)-(da+priorityScore(a)/100);
    });
    selected=eligible.slice(0,capacity);
    if(!selected.length) continue;
    let current = DATA.dm.home;
    let slots = wd===1 ? [['09:30','12:00']] : [['09:30','12:00'],['15:30','17:30']];
    if(wd>=5) slots=[['10:00','11:30']];
    if(wd===4) slots=[['09:30','12:00'],['13:00','14:30']]; // leave Friday buffer
    selected.forEach((store,i)=>{
      const [st,en]=slots[i]||slots[0];
      const tm = travelMin(current,store);
      const travelEnd=timeToMin(st), travelStart=Math.max(timeToMin('08:00'), travelEnd-tm);
      events.push(event(`Traslado a ${store.name}`,ds,minToTime(travelStart),st,'Traslado',store,`Traslado estimado ${tm} min. De ${current.name||'punto'} a ${store.name}`,store.maps));
      const camp=activeCampaign(ds);
      let type=strategicTypeForDate(ds,store,lastType);
      const title = `${type} | ${store.cc} ${store.name}${wd>=5?' | Fin de semana operativo':''}`;
      events.push(event(title,ds,st,en,type,store,visitFocus(store,type,camp),store.maps));
      lastVisit[store.cc]=ds; storeCounts[store.cc]=(storeCounts[store.cc]||0)+1;
      current=store;
    });
  }
  // Add mandatory campaign start evaluations.
  DATA.campaigns.forEach(c=>{
    if(c.campaignStart>=DATA.settings.startDate && c.campaignStart<=DATA.settings.endDate && !isBlocked(c.campaignStart)){
      events.push(event(`Evaluación Arranque ${c.name}`,c.campaignStart,'09:30','12:00','VPP',DATA.stores.find(s=>s.cc==='38401'),`Arranque de campaña: validar preparación, experiencia, inventario y conexión.`, 'Sede sugerida por ruta'));
    }
  });
  events.sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start));
  return events;
}
function currentEvents(){
  const y=+$('year').value, m=+$('month').value;
  const type=$('typeFilter').value, store=$('storeFilter').value, q=$('search').value.toLowerCase().trim();
  return allEvents.filter(e=>{
    const d=parseDate(e.date);
    if(d.getFullYear()!=y || d.getMonth()!=m) return false;
    if(type!=='Todos' && e.type!==type) return false;
    if(store!=='Todas' && (!e.store || e.store.cc!==store)) return false;
    if(q && !(`${e.title} ${e.type} ${e.focus} ${e.store?e.store.name+' '+e.store.manager:''}`.toLowerCase().includes(q))) return false;
    return true;
  });
}
function render(){
  const y=+$('year').value, m=+$('month').value, ev=currentEvents();
  $('calTitle').textContent=`Agenda · ${monthNames[m]} ${y}`;
  renderCampaign(y,m); renderPriority(); renderRoute(); renderKpis(ev,y,m); renderCalendar(ev,y,m); renderTable(ev);
}
function renderCampaign(y,m){
  const mid=`${y}-${String(m+1).padStart(2,'0')}-15`;
  const c=activeCampaign(mid);
  $('campaignBox').innerHTML=`<div class="campaign"><b>${c.name}</b><p><strong>Planificación:</strong> ${c.planningStart} a ${c.planningEnd}</p><p><strong>Campaña:</strong> ${c.campaignStart} a ${c.campaignEnd}</p><p><strong>DM a SM:</strong> ${c.dmToSm}</p></div>`;
}
function renderPriority(){
  $('priorityBox').innerHTML = DATA.stores.slice().sort((a,b)=>priorityScore(b)-priorityScore(a)).map(s=>{
    const p=priorityScore(s), cls=p>=90?'high':p>=66?'mid':'low', txt=p>=90?'Alta':p>=66?'Media':'Baja';
    return `<div class="priority"><strong>${s.cc} · ${s.name}<span class="badge ${cls}">${txt}</span></strong><small>${s.manager}<br>${s.domain} · ${s.seniority} años tienda</small></div>`;
  }).join('');
}
function renderRoute(){
  const groups = {};
  DATA.stores.forEach(s=>{groups[s.cluster]=groups[s.cluster]||[];groups[s.cluster].push(s.name)});
  $('routeBox').innerHTML = Object.entries(groups).map(([k,v])=>`<div class="route"><b>${k}</b><br>Casa → ${v.join(' → ')}</div>`).join('');
}
function renderKpis(ev,y,m){
  const visits=ev.filter(e=>e.store && !['Traslado','Comida','Bloqueo','Inesperado'].includes(e.type));
  const covered=new Set(visits.map(e=>e.store.cc));
  const vpp=visits.filter(e=>e.type==='VPP').length;
  const weekend=visits.filter(e=>{const wd=dowMon(parseDate(e.date)); return wd>=5}).length;
  const risk=DATA.stores.filter(s=>{
    const last=allEvents.filter(e=>e.store?.cc===s.cc && !['Traslado','Comida','Bloqueo','Inesperado'].includes(e.type) && e.date<=`${y}-${String(m+1).padStart(2,'0')}-31`).at(-1);
    if(!last) return true;
    return (new Date(y,m+1,0)-parseDate(last.date))/864e5>10;
  }).length;
  $('kVisits').textContent=visits.length; $('kCovered').textContent=`${covered.size}/${DATA.stores.length}`; $('kVpp').textContent=vpp; $('kWeekend').textContent=weekend; $('kRisk').textContent=risk;
}
function renderCalendar(ev,y,m){
  const cal=$('calendar'); cal.innerHTML='';
  const first=new Date(y,m,1), start=addDays(first,-dowMon(first));
  for(let i=0;i<42;i++){
    const d=addDays(start,i), ds=fmtDate(d), div=document.createElement('div');
    div.className='day'+(d.getMonth()!==m?' out':'');
    div.innerHTML=`<div class="daynum">${d.getDate()}</div>`;
    ev.filter(e=>e.date===ds).slice(0,6).forEach(e=>{
      const x=document.createElement('div'); x.className=`event ${typeClass(e.type)}`; x.title=`${e.start}-${e.end} ${e.title}\n${e.focus}`; x.textContent=`${e.start} ${e.title}`; div.appendChild(x);
    });
    cal.appendChild(div);
  }
}
function renderTable(ev){
  $('agendaRows').innerHTML = ev.map(e=>{
    const d=parseDate(e.date);
    const f=d.toLocaleDateString('es-MX',{weekday:'short',day:'2-digit',month:'short'});
    return `<tr><td>${f}</td><td>${e.start}<br>${e.end}</td><td><b>${e.title}</b></td><td>${e.store?`${e.store.cc} · ${e.store.name}<small>${e.store.manager}</small>`:'-'}</td><td>${e.type}</td><td>${e.focus}</td><td>${e.route?.startsWith('http')?`<a class="maps" href="${e.route}" target="_blank">Maps</a>`:e.route||''}</td></tr>`;
  }).join('');
}
function downloadICS(events, name){
  const pad=n=>String(n).padStart(2,'0');
  const dtstamp = new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Planner DM 2.0//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
  events.forEach((e,i)=>{
    const ds=e.date.replace(/-/g,'');
    const st=ds+'T'+e.start.replace(':','')+'00';
    const en=ds+'T'+e.end.replace(':','')+'00';
    lines.push('BEGIN:VEVENT',`UID:planner-dm-${e.date}-${i}@planner`, `DTSTAMP:${dtstamp}`, `DTSTART:${st}`, `DTEND:${en}`, `SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc((e.focus||'')+' '+(e.store?e.store.manager:'')+' '+(e.route||''))}`, e.store?`LOCATION:${esc(e.store.name)}`:'LOCATION:', 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  const blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); URL.revokeObjectURL(a.href);
}
function esc(s){ return String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;'); }
function initControls(){
  $('year').innerHTML='<option>2026</option>';
  $('month').innerHTML=monthNames.map((m,i)=>`<option value="${i}" ${i===6?'selected':''}>${m}</option>`).join('');
  const types=['Todos','VPP','Observe & Coach','Conexión rápida','Desarrollo','System Check','Administrativo','Bloqueo','Traslado','Comida','Inesperado'];
  $('typeFilter').innerHTML=types.map(t=>`<option>${t}</option>`).join('');
  $('storeFilter').innerHTML='<option value="Todas">Todas</option>'+DATA.stores.map(s=>`<option value="${s.cc}">${s.cc} · ${s.name}</option>`).join('');
  ['year','month','typeFilter','storeFilter','search'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change', render));
  $('btnGenerate').onclick=()=>{ allEvents=buildSchedule(); render(); };
  $('btnIcsMonth').onclick=()=>downloadICS(currentEvents().filter(e=>!['Traslado','Comida','Inesperado'].includes(e.type)),`Planner_DM_${monthNames[+$('month').value]}_2026.ics`);
  $('btnIcsYear').onclick=()=>downloadICS(allEvents.filter(e=>!['Traslado','Comida','Inesperado'].includes(e.type)),`Planner_DM_2026.ics`);
  $('addBlock').onclick=()=>{ 
    if(!$('blockStart').value||!$('blockEnd').value) return alert('Selecciona rango de bloqueo.');
    blocks.push({start:$('blockStart').value,end:$('blockEnd').value,reason:$('blockReason').value||'Bloqueo'});
    allEvents=buildSchedule(); render();
  };
  $('btnToday').onclick=()=>{ $('search').value='APRENDIZAJE'; render(); };
}
fetch('data/planner_data.json').then(r=>r.json()).then(d=>{DATA=d; initControls(); allEvents=buildSchedule(); render();});
