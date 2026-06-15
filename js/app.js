const D = window.PLANNER_DM_DATA;
const $ = (id) => document.getElementById(id);
const pad = n => String(n).padStart(2,'0');
const dateISO = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const cloneDate = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d,n) => { const x=cloneDate(d); x.setDate(x.getDate()+n); return x; };
const addMinToTime = (hhmm, min) => {
  const [h,m]=hhmm.split(':').map(Number); let t=h*60+m+min; return `${pad(Math.floor(t/60)%24)}:${pad(t%60)}`;
};
const minutesBetween = (a,b) => {
  const [ah,am]=a.split(':').map(Number), [bh,bm]=b.split(':').map(Number); return (bh*60+bm)-(ah*60+am);
};
const monthNames=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const dowNames=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const weekdayShort=['D','L','M','X','J','V','S'];
let state={year:2026, month:6, blocks:[], events:[], generated:false};

function parseISO(s){ const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
function overlapsTime(start,end,bs,be){ return minutesBetween(start,be)>0 && minutesBetween(bs,end)>0; }
function distKm(a,b){
  const R=6371, toRad=x=>x*Math.PI/180;
  const dLat=toRad(b.lat-a.lat), dLng=toRad(b.lng-a.lng);
  const lat1=toRad(a.lat), lat2=toRad(b.lat);
  const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function travelMin(a,b){ return Math.max(15, Math.round(distKm(a,b)*2.4+18)); }
function campaignFor(date){ const iso=dateISO(date); return D.campaigns.find(c=>iso>=c.planningStart && iso<=c.planningEnd) || D.campaigns.find(c=>iso>=c.campaignStart && iso<=c.campaignEnd) || D.campaigns[D.campaigns.length-1]; }
function isBlocked(date){ const iso=dateISO(date); return state.blocks.some(b=>iso>=b.start && iso<=b.end); }
function blockReason(date){ const iso=dateISO(date); const b=state.blocks.find(b=>iso>=b.start && iso<=b.end); return b?.reason || ''; }
function priority(store){
  let p=0; if(store.domain==='APRENDIZAJE') p+=4; if(store.domain==='APROPIACION') p+=2; if(store.tier==='C1') p+=1; if(store.cc==='43193'||store.cc==='38515') p+=2; if(store.type.includes('Mall')) p+=1; return p;
}
function approachFocus(store, type, camp){
  const base = {
    APRENDIZAJE:'enseñar aptitudes, claridad de estándares, acompañamiento hombro a hombro y seguimiento cercano',
    APROPIACION:'retos de ejecución, autonomía, resolución de problemas y consistencia del plan',
    ASESORAMIENTO:'aprovechar mejores prácticas, liderazgo multiplicador y transferencia de capacidades'
  }[store.domain] || 'ejecución y seguimiento';
  const typeFocus = {
    VPP:'priorización, planificación, SOA, calendario del SM y preparación de campaña',
    SYSTEM:'observación en piso, coaching, distribución, inventario, programación, efectivo, RSA o canales digitales',
    QUICK:'conexión, reconocimiento, retiro de obstáculos y validación de avances rápidos',
    CDD:'desarrollo, aspiraciones, retroalimentación honesta y acuerdos de crecimiento'
  }[type] || 'seguimiento';
  return `${typeFocus} · ${base} · ${camp.key}`;
}
function chooseRouteStores(day, candidates, count){
  const clusters=['Coacalco','Ecatepec','Izcalli','Perinorte'];
  const cluster = clusters[day.getDate()%clusters.length];
  let scoped=candidates.filter(s=>s.cluster===cluster);
  if(scoped.length<count) scoped=[...scoped, ...candidates.filter(s=>s.cluster!==cluster)];
  scoped.sort((a,b)=>priority(b)-priority(a));
  let route=[]; let current=D.dm.home;
  while(route.length<count && scoped.length){
    scoped.sort((a,b)=>travelMin(current,a)-travelMin(current,b));
    const next=scoped.shift(); route.push(next); current=next;
  }
  return route;
}
function canUseStore(store, date, lastVisit){
  const last=lastVisit[store.cc]; if(!last) return true;
  const delta=(date-parseISO(last))/(1000*60*60*24);
  return delta>=10;
}
function pushEvent(events, e){ events.push({...e, id:`e${events.length+1}`}); }
function dayStartTime(date){ const dow=date.getDay(); if(dow===1) return '08:00'; if(dow>=2 && dow<=5) return '08:30'; if(dow===6) return '09:00'; if(dow===0) return '10:00'; return '08:30'; }
function isWorkDay(date){ const dow=date.getDay(); if(dow>=1 && dow<=5) return true; if(dow===6) return date.getDate()<=21; if(dow===0) return [5,19].includes(date.getDate()); return false; }
function usedWeekendCount(events, year, month){ return events.filter(e=>{const d=parseISO(e.date); return d.getFullYear()===year&&d.getMonth()===month&&(d.getDay()===0||d.getDay()===6)&&e.store;}).length; }

function buildPlan(){
  const events=[]; const lastVisit={}; const completion={};
  const start=parseISO(D.dm.startDate), end=parseISO(D.dm.endDate);
  let visitQueue=[];
  D.campaigns.forEach(c=>{
    const ps=parseISO(c.planningStart), pe=parseISO(c.planningEnd);
    if(pe < start) return;
    D.stores.forEach(s=>{
      ['VPP','SYSTEM','QUICK'].forEach(t=>visitQueue.push({period:c.key,type:t,store:s,windowStart:dateISO(ps<start?start:ps),windowEnd:c.planningEnd}));
    });
  });
  D.cddPeriods.forEach(p=>{
    const ps=parseISO(p.start), pe=parseISO(p.end); if(pe < start) return;
    D.stores.forEach(s=>visitQueue.push({period:p.quarter,type:'CDD',store:s,windowStart:p.start,windowEnd:p.end}));
  });
  visitQueue.sort((a,b)=> a.windowEnd.localeCompare(b.windowEnd) || priority(b.store)-priority(a.store));

  for(let d=start; d<=end; d=addDays(d,1)){
    const iso=dateISO(d); const dow=d.getDay();
    if(isBlocked(d)){
      pushEvent(events,{date:iso,start:'00:00',end:'23:59',title:`Bloqueo · ${blockReason(d)}`,type:'BLOCK',kind:'Bloqueo',focus:'No programar visitas físicas. Reagendar automáticamente.', color:'#4b5563'});
      continue;
    }
    if(!isWorkDay(d)) continue;
    let current=dayStartTime(d);
    let dayEnd=addMinToTime(current, 600);
    let currentLoc=D.dm.home;
    let dayEvents=[];
    // Traslado a primera tienda se calcula al elegir tienda, pero no debe romper llegada.
    if(dow===1){
      pushEvent(dayEvents,{date:iso,start:'08:30',end:'09:00',title:'KPI Semanal Portafolio',type:'ADMIN',kind:'Administrativo',focus:'Validar captura de KPIs antes de 09:30 y definir foco de tiendas.', color:D.visitTypes.ADMIN.color});
      current='09:00';
    }
    if(dow===2){
      pushEvent(dayEvents,{date:iso,start:'13:00',end:'14:30',title:'Reunión Centro Norte',type:'ADMIN',kind:'Administrativo',focus:'Espacio reservado; no agendar visitas en este horario.', color:D.visitTypes.ADMIN.color});
    }
    if(d.getDate()===30){
      pushEvent(dayEvents,{date:iso,start:'09:00',end:'09:30',title:'Factura Parco',type:'ADMIN',kind:'Administrativo',focus:'Enviar correo / seguimiento de factura Parco.', color:D.visitTypes.ADMIN.color});
    }
    if(d.getDate()>=3 && d.getDate()<=6){
      pushEvent(dayEvents,{date:iso,start:'17:00',end:'17:30',title:'Ingreso de Gastos',type:'ADMIN',kind:'Administrativo',focus:'Captura mensual de gastos.', color:D.visitTypes.ADMIN.color});
    }
    if(dow===4){
      pushEvent(dayEvents,{date:iso,start:'16:30',end:'17:30',title:'Capacitación DM',type:'ADMIN',kind:'Administrativo',focus:'Ubits, Attensi u otros recursos de desarrollo.', color:D.visitTypes.ADMIN.color});
    }
    if(dow===1 && Math.ceil(d.getDate()/7)%2===0){
      pushEvent(dayEvents,{date:iso,start:'13:00',end:'14:00',title:'Reunión virtual portafolio',type:'ADMIN',kind:'Administrativo',focus:'Portafolio total o tiendas bottom según indicador.', color:D.visitTypes.ADMIN.color});
    }
    if(dow===3 && Math.ceil(d.getDate()/7)===2){
      pushEvent(dayEvents,{date:iso,start:'10:00',end:'12:00',title:'Reunión Portafolio · Coacalco',type:'ADMIN',kind:'Portafolio',store:D.stores.find(s=>s.cc==='38401'),focus:'Resultados, alineación de portafolio y compromisos.', color:'#7b3f98'});
    }
    if(dow===5 && Math.ceil(d.getDate()/7)%2===1){
      pushEvent(dayEvents,{date:iso,start:'12:00',end:'13:30',title:'Panel Portafolio',type:'ADMIN',kind:'Portafolio',focus:'Espacio quincenal de análisis y soporte en ruta.', color:'#7b3f98'});
    }

    // Select pending visits inside due window and not repeated within 10 days.
    let available=visitQueue.filter(v=>!v.done && iso>=v.windowStart && iso<=v.windowEnd && canUseStore(v.store,d,lastVisit));
    // If urgent (window end near) relax 10-day rule.
    if(available.length<2){
      available=visitQueue.filter(v=>!v.done && iso>=v.windowStart && iso<=v.windowEnd && ((parseISO(v.windowEnd)-d)/(86400000)<=7 || canUseStore(v.store,d,lastVisit)));
    }
    available.sort((a,b)=> a.windowEnd.localeCompare(b.windowEnd) || priority(b.store)-priority(a.store));
    const maxVisits=(dow===0?2:(dow===6?2:3));
    const selected=[]; const usedStores=new Set();
    const mixOrder=['VPP','SYSTEM','QUICK','CDD'];
    mixOrder.forEach(type=>{
      if(selected.length>=maxVisits) return;
      const pool=available.filter(v=>v.type===type && !usedStores.has(v.store.cc));
      const route=chooseRouteStores(d, pool.map(v=>v.store), 1);
      if(route.length){ const v=pool.find(x=>x.store.cc===route[0].cc); selected.push(v); usedStores.add(v.store.cc); }
    });
    for(const v of available){ if(selected.length>=maxVisits) break; if(!usedStores.has(v.store.cc)){ selected.push(v); usedStores.add(v.store.cc);} }

    // place visits in time slots, avoiding admin meeting.
    let placed=0;
    for(const v of selected){
      const vt=D.visitTypes[v.type];
      let travel=travelMin(currentLoc, v.store);
      let depart=addMinToTime(current, -travel);
      // At start day, current is arrival time already; include commute before start as visible.
      if(placed===0){
        pushEvent(dayEvents,{date:iso,start:depart,end:current,title:`Traslado · Casa → ${v.store.name}`,type:'TRAVEL',kind:'Traslado',store:v.store,focus:`Salida sugerida para estar en tienda a las ${current}.`, color:D.visitTypes.TRAVEL.color});
      } else {
        pushEvent(dayEvents,{date:iso,start:current,end:addMinToTime(current,travel),title:`Traslado · ${currentLoc.name} → ${v.store.name}`,type:'TRAVEL',kind:'Traslado',store:v.store,focus:'Espacio entre tiendas. No compactar.', color:D.visitTypes.TRAVEL.color});
        current=addMinToTime(current,travel);
      }
      let startTime=current, endTime=addMinToTime(startTime, vt.duration);
      if(dow===2 && overlapsTime(startTime,endTime,'13:00','14:30')){
        if(minutesBetween(startTime,'13:00')>30){
          // leave adaptation until meeting
          pushEvent(dayEvents,{date:iso,start:startTime,end:'13:00',title:'Adaptación a lo inesperado',type:'BUFFER',kind:'Buffer',focus:'Espacio intencional para seguimiento, validaciones o ajuste de ruta.', color:D.visitTypes.BUFFER.color});
        }
        current='14:30'; startTime=current; endTime=addMinToTime(startTime, vt.duration);
      }
      if(!dayEvents.some(e=>e.type==='LUNCH') && minutesBetween('12:00',startTime)<=0){
        pushEvent(dayEvents,{date:iso,start:startTime,end:addMinToTime(startTime,60),title:'Comida',type:'LUNCH',kind:'Comida',focus:'1 hora de comida diaria.', color:D.visitTypes.LUNCH.color});
        current=addMinToTime(startTime,60); startTime=current; endTime=addMinToTime(startTime, vt.duration);
      }
      if(minutesBetween(endTime,dayEnd)<0) continue;
      pushEvent(dayEvents,{date:iso,start:startTime,end:endTime,title:`${vt.label} · ${v.store.cc} ${v.store.name}`,type:v.type,kind:vt.category,store:v.store,period:v.period,focus:approachFocus(v.store,v.type,campaignFor(d)), color:vt.color});
      current=endTime; currentLoc=v.store; lastVisit[v.store.cc]=iso; v.done=true; placed++;
    }
    if(!dayEvents.some(e=>e.type==='LUNCH') && dow>=1 && dow<=6){
      const lunchStart = minutesBetween(current,'13:30')>0 ? current : '13:30';
      if(minutesBetween(lunchStart,dayEnd)>=60) pushEvent(dayEvents,{date:iso,start:lunchStart,end:addMinToTime(lunchStart,60),title:'Comida',type:'LUNCH',kind:'Comida',focus:'1 hora de comida diaria.', color:D.visitTypes.LUNCH.color});
    }
    // Add buffer: 4 hours per week split. One hour on work days when possible.
    if(dow>=1 && dow<=5){
      const last = dayEvents.filter(e=>e.start!=='00:00').sort((a,b)=>a.end.localeCompare(b.end)).at(-1);
      let bs = last ? last.end : current;
      if(minutesBetween(bs,dayEnd)>=60) pushEvent(dayEvents,{date:iso,start:bs,end:addMinToTime(bs,60),title:'Adaptación a lo inesperado',type:'BUFFER',kind:'Buffer',focus:'Espacio intencional para resolver imprevistos, ajustar plan o capturar notas de visita.', color:D.visitTypes.BUFFER.color});
    }
    events.push(...dayEvents);
  }
  state.events=events.sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start));
  state.generated=true;
  renderAll();
}
function escapeHtml(s){ return String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
function renderAll(){ renderKPIs(); renderMonth(); renderTimeline(); renderStores(); renderDetail(); }
function renderKPIs(){
  const month=Number($('month').value), year=Number($('year').value);
  const ev=state.events.filter(e=>{const d=parseISO(e.date); return d.getFullYear()===year && d.getMonth()===month;});
  const physical=ev.filter(e=>e.store && ['VPP','SYSTEM','QUICK','CDD'].includes(e.type));
  const covered=new Set(physical.map(e=>e.store.cc));
  const vpp=physical.filter(e=>e.type==='VPP').length;
  const cdd=physical.filter(e=>e.type==='CDD').length;
  const wk=physical.filter(e=>{const dow=parseISO(e.date).getDay(); return dow===0||dow===6;}).length;
  $('kpis').innerHTML=`
    <div class="kpi"><span>Visitas físicas mes</span><b>${physical.length}</b></div>
    <div class="kpi"><span>Tiendas cubiertas</span><b>${covered.size}/10</b></div>
    <div class="kpi"><span>VPP / SOA</span><b>${vpp}</b></div>
    <div class="kpi"><span>CDD</span><b>${cdd}</b></div>
    <div class="kpi"><span>Fin de semana</span><b>${wk}</b></div>`;
}
function renderMonth(){
  const year=Number($('year').value), month=Number($('month').value);
  $('calendarTitle').textContent=`Agenda · ${monthNames[month]} ${year}`;
  const first=new Date(year,month,1); const start=addDays(first,-((first.getDay()+6)%7));
  const monthEvents=state.events.filter(e=>{const d=parseISO(e.date); return d.getFullYear()===year && d.getMonth()===month;});
  let html='<div class="weekdays"><b>L</b><b>M</b><b>X</b><b>J</b><b>V</b><b>S</b><b>D</b></div><div class="calgrid">';
  for(let i=0;i<42;i++){
    const d=addDays(start,i); const iso=dateISO(d); const dim=d.getMonth()!==month?' muted':'';
    const dayEv=state.events.filter(e=>e.date===iso).slice(0,5);
    html+=`<div class="day${dim}"><strong>${d.getDate()}</strong>${dayEv.map(e=>`<span class="pill" style="background:${e.color||'#777'}" title="${escapeHtml(e.focus)}">${e.start} ${escapeHtml(e.title)}</span>`).join('')}</div>`;
  }
  html+='</div>'; $('calendar').innerHTML=html;
}
function renderTimeline(){
  const events=filteredEvents();
  $('timeline').innerHTML=events.slice(0,80).map(e=>{
    const store=e.store?`${e.store.cc} · ${e.store.name}<small>${e.store.manager}<br>${e.store.domain} · ${e.store.tier} · ${e.store.type}</small>`:'-';
    const maps=e.store?`<a target="_blank" href="${e.store.maps}">Maps</a><small>${e.store.cluster}</small>`:'Actividad administrativa';
    return `<tr><td>${fmtDate(e.date)}</td><td>${e.start}<br>${e.end}</td><td><b>${escapeHtml(e.title)}</b><small>${e.period||''}</small></td><td>${store}</td><td><span class="tag" style="--c:${e.color||'#777'}">${e.kind}</span></td><td>${escapeHtml(e.focus)}</td><td>${maps}</td></tr>`;
  }).join('');
}
function filteredEvents(){
  const year=Number($('year').value), month=Number($('month').value), type=$('type').value, store=$('store').value, q=($('search').value||'').toLowerCase();
  return state.events.filter(e=>{const d=parseISO(e.date); if(d.getFullYear()!==year||d.getMonth()!==month)return false; if(type!=='ALL'&&e.type!==type)return false; if(store!=='ALL'&&e.store?.cc!==store)return false; const hay=(e.title+' '+(e.focus||'')+' '+(e.store?.name||'')+' '+(e.store?.manager||'')).toLowerCase(); return hay.includes(q);});
}
function fmtDate(iso){ const d=parseISO(iso); return `${dowNames[d.getDay()]} ${pad(d.getDate())} ${monthNames[d.getMonth()].slice(0,3)}`; }
function renderStores(){
  $('stores').innerHTML=D.stores.map(s=>`<article class="storecard ${s.domain.toLowerCase()}"><h4>${s.cc} · ${s.name}</h4><p>${s.manager}</p><b>${s.domain}</b><small>${s.cluster} · ${s.tier} · ${s.seats} seats</small></article>`).join('');
}
function renderDetail(){
  const month=Number($('month').value), year=Number($('year').value);
  const camp=D.campaigns.filter(c=>{const s=parseISO(c.planningStart), e=parseISO(c.campaignEnd); return (s.getFullYear()<year||s.getMonth()<=month)&&(e.getFullYear()>year||e.getMonth()>=month);});
  $('intent').innerHTML=`<h3>Intencionalidad del mes</h3>${camp.map(c=>`<div class="intent"><b>${c.key}</b><p><strong>Planificación:</strong> ${c.planningStart} a ${c.planningEnd}</p><p><strong>Campaña:</strong> ${c.campaignStart} a ${c.campaignEnd}</p></div>`).join('')}<div class="intent light"><b>Regla DM 360°</b><p>Ideal: 1 visita por tienda por semana. Mínimo: no pasar más de 10 días sin contacto físico o táctico.</p><p>En cada periodo: VPP/SOA, System Check/Observe & Coach, Conexión rápida y CDD cuando aplique por trimestre.</p></div>`;
}
function addBlock(){
  const start=$('blockStart').value, end=$('blockEnd').value, reason=$('blockReason').value||'Bloqueo'; if(!start||!end) return;
  state.blocks.push({start,end,reason}); buildPlan();
}
function exportICS(scope='month'){
  const year=Number($('year').value), month=Number($('month').value);
  const ev=state.events.filter(e=> scope==='year' || (parseISO(e.date).getFullYear()===year && parseISO(e.date).getMonth()===month));
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Planner DM v3//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
  ev.forEach((e,i)=>{
    const d=e.date.replaceAll('-',''); const st=e.start.replace(':','')+'00'; const en=e.end.replace(':','')+'00';
    const desc=(e.focus||'').replace(/\n/g,' ').replace(/,/g,';');
    lines.push('BEGIN:VEVENT',`UID:planner-dm-v3-${d}-${i}@planner`, `DTSTAMP:${d}T060000Z`, `DTSTART:${d}T${st}`, `DTEND:${d}T${en}`, `SUMMARY:${e.title}`, `DESCRIPTION:${desc}`, e.store?`LOCATION:${e.store.name}`:'LOCATION:', 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  const blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'}); const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download=scope==='year'?'Planner_DM_2026.ics':`Planner_DM_${monthNames[month]}_${year}.ics`; a.click(); URL.revokeObjectURL(a.href);
}
function init(){
  $('year').innerHTML='<option>2026</option>';
  $('month').innerHTML=monthNames.map((m,i)=>`<option value="${i}" ${i===6?'selected':''}>${m}</option>`).join('');
  $('type').innerHTML='<option value="ALL">Todas</option>'+Object.entries(D.visitTypes).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('');
  $('store').innerHTML='<option value="ALL">Todas</option>'+D.stores.map(s=>`<option value="${s.cc}">${s.cc} · ${s.name}</option>`).join('');
  ['year','month','type','store','search'].forEach(id=>$(id).addEventListener('input',renderAll));
  $('generate').addEventListener('click',buildPlan); $('blockBtn').addEventListener('click',addBlock);
  $('icsMonth').addEventListener('click',()=>exportICS('month')); $('icsYear').addEventListener('click',()=>exportICS('year'));
  buildPlan();
}
document.addEventListener('DOMContentLoaded',init);
