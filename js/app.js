const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
let state = { events: [], blocks: [] };

function dateKey(d){ return d.toISOString().slice(0,10); }
function parseDate(s){ const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
function fmtDate(d){ return d.toLocaleDateString('es-MX',{weekday:'short',day:'2-digit',month:'short'}); }
function addDays(d,n){ const x=new Date(d); x.setDate(x.getDate()+n); return x; }
function isBetween(date, a, b){ const t=dateKey(date); return t>=a && t<=b; }
function dow(d){ return d.getDay()===0?7:d.getDay(); }
function minutesToTime(min){ const h=String(Math.floor(min/60)).padStart(2,'0'); const m=String(min%60).padStart(2,'0'); return `${h}:${m}`; }
function timeToMinutes(t){ const [h,m]=t.split(':').map(Number); return h*60+m; }
function uid(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }

function distanceKm(a,b){ const R=6371, toRad=x=>x*Math.PI/180; const dLat=toRad(b.lat-a.lat), dLng=toRad(b.lng-a.lng); const lat1=toRad(a.lat), lat2=toRad(b.lat); const v=Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(v)); }
function travelMinutes(a,b){ return Math.max(15, Math.round(distanceKm(a,b)/28*60)+8); }
function nearestRoute(stores){ const start=PLANNER_DATA.dm.start; let current=start; const left=[...stores]; const out=[]; while(left.length){ let best=left.map(s=>({s,km:distanceKm(current,s)})).sort((a,b)=>a.km-b.km)[0]; out.push({...best.s, km:best.km, travel:travelMinutes(current,best.s)}); current=best.s; left.splice(left.indexOf(best.s),1); } return out; }

function init(){
  const monthSelect=$('#monthSelect'); monthNames.forEach((m,i)=>monthSelect.insertAdjacentHTML('beforeend',`<option value="${i}">${m}</option>`)); monthSelect.value=new Date().getMonth();
  const vt=$('#visitTypeSelect'); vt.innerHTML='<option value="ALL">Todas</option>'+PLANNER_DATA.visitTypes.map(v=>`<option value="${v.id}">${v.label}</option>`).join('');
  const st=$('#storeSelect'); st.innerHTML='<option value="ALL">Todas</option>'+PLANNER_DATA.stores.map(s=>`<option value="${s.cc}">${s.cc} · ${s.name}</option>`).join('');
  $('#generateBtn').onclick=generate;
  $('#addBlockBtn').onclick=addBlock;
  $('#exportMonthBtn').onclick=()=>downloadICS(filteredEvents(),`Planner_DM_${monthNames[+$('#monthSelect').value]}_2026.ics`);
  $('#exportYearBtn').onclick=()=>{ const y=+$('#yearSelect').value; const ev=[]; for(let m=0;m<12;m++) ev.push(...buildMonth(y,m)); downloadICS(ev,`Planner_DM_Anual_${y}.ics`); };
  $('#searchBox').oninput=render;
  $('#monthSelect').onchange=generate; $('#visitTypeSelect').onchange=render; $('#storeSelect').onchange=render;
  renderStores(); generate();
}

function activeCampaign(date){ return PLANNER_DATA.campaigns.find(c=>isBetween(date,c.planning[0],c.planning[1]) || isBetween(date,c.campaign[0],c.campaign[1]) || isBetween(date,c.dmToSm[0],c.dmToSm[1])) || null; }
function focusForStore(store,type,campaign){
  const byDomain={APRENDIZAJE:'enseñar aptitudes, claridad de estándares y seguimiento cercano',APROPIACION:'retos de ejecución, autonomía y resolución de problemas',ASESORAMIENTO:'aprovechar expertise, compartir mejores prácticas y elevar al portafolio'};
  const typeFocus={VPP:'plan de campaña, SOA, prioridades, inventario y experiencia',COACH:'observación en piso, coaching, distribución y brechas operativas',QUICK:'seguimiento puntual y conexión con equipo',DEV:'conversación de desarrollo, aspiraciones y nivel de dominio',ADMIN:'planeación, KPI y seguimiento'};
  return `${typeFocus[type]||'seguimiento'} · ${byDomain[store.domain]}${campaign?` · ${campaign.name}`:''}`;
}

function buildMonth(year,month){
  const events=[]; const first=new Date(year,month,1); const last=new Date(year,month+1,0); const camp=activeCampaign(first)||activeCampaign(last);
  const route=nearestRoute(PLANNER_DATA.stores);
  let cursor=new Date(first); let week=0;
  while(cursor<=last){
    const monday=addDays(cursor,1-dow(cursor));
    const weekStores=route.slice((week*3)%route.length, ((week*3)%route.length)+3);
    const pack=weekStores.length<3?route.slice((week*3)%route.length).concat(route.slice(0,3-weekStores.length)):weekStores;
    const visitDays=[1,3,4,5];
    pack.forEach((store,i)=>{
      const d=addDays(monday, visitDays[i%visitDays.length]-1);
      if(d.getMonth()!==month) return;
      const type = chooseVisitType(d, store, camp, i, week);
      const startMin = i===0?600: (i===1?810:930);
      events.push(makeEvent(d, minutesToTime(startMin), type, store, camp));
    });
    cursor=addDays(monday,7); week++;
  }
  addRituals(events,year,month);
  addWeekendCoverage(events,year,month,route,camp);
  state.blocks.forEach(b=>addBlockEvents(events,b,year,month));
  return events.sort((a,b)=>a.start-b.start);
}
function chooseVisitType(d,store,camp,i,week){
  if(camp && isBetween(d,camp.planning[0],camp.planning[1]) && week%3===0) return 'VPP';
  if(store.domain==='APRENDIZAJE' && week%2===0) return 'COACH';
  if(i===2) return 'QUICK';
  return ['COACH','DEV','QUICK'][week%3];
}
function makeEvent(date,time,type,store,camp){
  const vt=PLANNER_DATA.visitTypes.find(v=>v.id===type); const start=new Date(date); const [h,m]=time.split(':').map(Number); start.setHours(h,m,0,0); const end=new Date(start.getTime()+vt.duration*60000);
  const from=PLANNER_DATA.dm.start; const travel=travelMinutes(from,store);
  return { id:uid(), title:`${vt.label} | ${store.cc} ${store.name}`, start, end, type, store, campaign:camp?.name||'', focus:focusForStore(store,type,camp), route:`${travel} min aprox desde punto de partida`, maps:store.maps };
}
function addRituals(events,year,month){
  const last=new Date(year,month+1,0).getDate();
  for(let d=1; d<=last; d++){
    const date=new Date(year,month,d); const w=dow(date);
    PLANNER_DATA.rituals.forEach(r=>{
      let ok=false; if(r.weekday===w) ok=true; if(r.monthDay===d) ok=true; if(r.monthDays?.includes(d)) ok=true; if(!ok) return;
      const start=new Date(date); const [h,m]=r.time.split(':').map(Number); start.setHours(h,m,0,0); const end=new Date(start.getTime()+r.duration*60000);
      events.push({id:uid(), title:r.title, start,end,type:r.type, store:null, campaign:'', focus:r.rule, route:'Actividad administrativa', maps:''});
    });
  }
  // Reunión portafolio física en Coacalco: segundo miércoles
  const coacalco=PLANNER_DATA.stores.find(s=>s.cc==='38401');
  const d=[...Array(last)].map((_,i)=>new Date(year,month,i+1)).filter(x=>dow(x)===3)[1];
  if(d) events.push(makeEvent(d,'10:00','DEV',coacalco,activeCampaign(d)));
  events[events.length-1].title='Reunión Portafolio Física | Sede Coacalco';
}
function weekendCount(year,month){ let c=0,last=new Date(year,month+1,0).getDate(); for(let d=1;d<=last;d++){ const w=dow(new Date(year,month,d)); if(w===6)c++; } return c; }
function addWeekendCoverage(events,year,month,route,camp){
  const target=weekendCount(year,month)>=5?3:2; const weekends=[]; const last=new Date(year,month+1,0).getDate();
  for(let d=1;d<=last;d++){ const date=new Date(year,month,d); const w=dow(date); if(w===6||w===7) weekends.push(date); }
  const chosen=[]; const sat=weekends.find(d=>dow(d)===6); const sun=weekends.find(d=>dow(d)===7); if(sat)chosen.push(sat); if(sun)chosen.push(sun); while(chosen.length<target && weekends.length) chosen.push(weekends[chosen.length*2]||weekends[0]);
  chosen.slice(0,target).forEach((d,i)=>{ const store=route[(i*3+1)%route.length]; const type=dow(d)===7?'QUICK':'COACH'; const ev=makeEvent(d,'10:00',type,store,camp); ev.title += dow(d)===7?' | Domingo operativo':' | Sábado foco plaza/crítica'; events.push(ev); });
}
function addBlock(){ const a=$('#blockStart').value,b=$('#blockEnd').value,reason=$('#blockReason').value||'Bloqueo de agenda'; if(!a||!b) return alert('Agrega fecha inicio y fin del bloqueo.'); state.blocks.push({a,b,reason}); generate(); }
function addBlockEvents(events,b,year,month){ let d=parseDate(b.a), end=parseDate(b.b); while(d<=end){ if(d.getFullYear()===year && d.getMonth()===month){ const s=new Date(d); s.setHours(9,0,0,0); const e=new Date(d); e.setHours(18,0,0,0); events.push({id:uid(),title:b.reason,start:s,end:e,type:'BLOCK',store:null,campaign:'',focus:'Agenda bloqueada por eventualidad',route:'No programar visitas',maps:''}); } d=addDays(d,1); } }
function filteredEvents(){ const vt=$('#visitTypeSelect').value, st=$('#storeSelect').value, q=($('#searchBox')?.value||'').toLowerCase(); return state.events.filter(e=>(vt==='ALL'||e.type===vt)&&(st==='ALL'||e.store?.cc===st)&&(!q||[e.title,e.store?.name,e.focus,e.route].join(' ').toLowerCase().includes(q))); }
function generate(){ const y=+$('#yearSelect').value,m=+$('#monthSelect').value; state.events=buildMonth(y,m); render(); }
function render(){ renderKpis(); renderCampaign(); renderRoute(); renderCalendar(); renderTable(); }
function renderKpis(){ const ev=filteredEvents(), visits=ev.filter(e=>e.store), stores=new Set(visits.map(e=>e.store.cc)); const weekend=visits.filter(e=>[6,7].includes(dow(e.start))).length; const vpp=ev.filter(e=>e.type==='VPP').length; const coach=ev.filter(e=>e.type==='COACH').length; $('#kpiCards').innerHTML=[['Visitas mes',visits.length],['Tiendas cubiertas',`${stores.size}/10`],['VPP',vpp],['Observe & Coach',coach],['Fin de semana',weekend]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join(''); }
function renderCampaign(){ const m=+$('#monthSelect').value,y=+$('#yearSelect').value,c=activeCampaign(new Date(y,m,15)); $('#campaignCard').innerHTML=c?`<h3>${c.name}</h3><p><strong>Planificación:</strong> ${c.planning.join(' a ')}</p><p><strong>Campaña:</strong> ${c.campaign.join(' a ')}</p><p><strong>DM a SM:</strong> ${c.dmToSm.join(' a ')}</p>`:'<p>Sin campaña activa.</p>'; }
function renderRoute(){ const r=nearestRoute(PLANNER_DATA.stores); $('#routeList').innerHTML=r.map((s,i)=>`<div class="route-item"><strong>${i+1}. ${s.name}</strong><br><small>${s.travel} min aprox · ${s.km.toFixed(1)} km desde punto previo</small><br><a href="${s.maps}" target="_blank">Abrir Maps</a></div>`).join(''); }
function renderCalendar(){ const y=+$('#yearSelect').value,m=+$('#monthSelect').value; $('#calendarTitle').textContent=`Agenda · ${monthNames[m]} ${y}`; const grid=$('#calendarGrid'); grid.innerHTML=''; const first=new Date(y,m,1), start=addDays(first,1-dow(first)); for(let i=0;i<42;i++){ const d=addDays(start,i); const day=document.importNode($('#dayTemplate').content,true); const el=day.querySelector('.day'); if(d.getMonth()!==m) el.classList.add('out'); day.querySelector('.day-num').textContent=d.getDate(); const evs=filteredEvents().filter(e=>dateKey(e.start)===dateKey(d)).slice(0,5); day.querySelector('.events').innerHTML=evs.map(e=>`<div class="event ${e.type==='BLOCK'?'block':(PLANNER_DATA.visitTypes.find(v=>v.id===e.type)?.className||'admin')}" title="${e.title}">${minutesToTime(e.start.getHours()*60+e.start.getMinutes())} ${e.title}</div>`).join(''); grid.appendChild(day); } }
function renderTable(){ const tbody=$('#agendaTable tbody'); tbody.innerHTML=filteredEvents().map(e=>`<tr><td>${fmtDate(e.start)}</td><td>${minutesToTime(e.start.getHours()*60+e.start.getMinutes())}-${minutesToTime(e.end.getHours()*60+e.end.getMinutes())}</td><td><strong>${e.title}</strong></td><td>${e.store?`${e.store.cc} · ${e.store.name}<br><small>${e.store.manager}</small>`:'-'}</td><td>${PLANNER_DATA.visitTypes.find(v=>v.id===e.type)?.label||'Bloqueo'}</td><td>${e.focus}</td><td>${e.maps?`<a class="maps" target="_blank" href="${e.maps}">Maps</a><br>`:''}${e.route}</td></tr>`).join(''); }
function renderStores(){ $('#storeCards').innerHTML=PLANNER_DATA.stores.map(s=>`<div class="store-card"><h3>${s.cc} · ${s.name}</h3><p>${s.manager}</p><span class="pill ${s.domain.toLowerCase()}">${s.domain}</span><p><a class="maps" href="${s.maps}" target="_blank">Abrir Maps</a></p></div>`).join(''); }
function icsDate(d){ return d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z'; }
function escapeICS(s){ return String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;'); }
function toICS(events){ return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Planner_DM//Enrique Cesar//ES','CALSCALE:GREGORIAN',...events.flatMap(e=>['BEGIN:VEVENT',`UID:${e.id}@planner-dm`,`DTSTAMP:${icsDate(new Date())}`,`DTSTART:${icsDate(e.start)}`,`DTEND:${icsDate(e.end)}`,`SUMMARY:${escapeICS(e.title)}`,`DESCRIPTION:${escapeICS(`${e.focus}\nRuta: ${e.route}\nMaps: ${e.maps||''}`)}`,`LOCATION:${escapeICS(e.store?.name||'')}`,'END:VEVENT']),'END:VCALENDAR'].join('\r\n'); }
function downloadICS(events,name){ if(!events.length) return alert('No hay eventos para exportar.'); const blob=new Blob([toICS(events)],{type:'text/calendar;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); URL.revokeObjectURL(a.href); }
init();
