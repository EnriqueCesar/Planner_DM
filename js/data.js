const PLANNER_DATA = {
  dm: {
    name: 'Enrique César Flores',
    short: 'Enrique',
    start: { name: 'Casa_Enrique', maps: 'https://maps.app.goo.gl/WL9ib7upfuD1gz8Y9', lat: 19.495011552638733, lng: -99.05194197935396 }
  },
  stores: [
    { cc:'38333', name:'Izcalli Mega', manager:'BRANDON GARCIA SALINAS', domain:'APROPIACION', maps:'https://maps.app.goo.gl/XNEcUhMZmuSBdazW8', lat:19.64697760988644, lng:-99.20715190398433 },
    { cc:'38339', name:'San Marcos', manager:'DIEGO CONDE MERINO', domain:'APROPIACION', maps:'https://maps.app.goo.gl/eRFCorrPHzL6Wn4q7', lat:19.670907256797065, lng:-99.20315595767177 },
    { cc:'38368', name:'Luna Park', manager:'JOEL HERRERA EVARISTO', domain:'APRENDIZAJE', maps:'https://maps.app.goo.gl/8wR4qKjAGonVGLft9', lat:19.657409844647916, lng:-99.21026354232822 },
    { cc:'38401', name:'Coacalco', manager:'BRENDA KARINA HERNANDEZ MIGUEL', domain:'APROPIACION', maps:'https://maps.app.goo.gl/8my5q1qD4mZiBXYD7', lat:19.628726747313067, lng:-99.12410375767182 },
    { cc:'38456', name:'Plaza las Flores', manager:'RAMON ESPINOSA MACIAS', domain:'APROPIACION', maps:'https://maps.app.goo.gl/c31NpiPME2nXybsn8', lat:19.63640228103232, lng:-99.09608838684989 },
    { cc:'38515', name:'Patio Ecatepec', manager:'ITZEL DAYANA LLAMAS RAMIREZ', domain:'APRENDIZAJE', maps:'https://maps.app.goo.gl/j9zzsZGDaqXx6UtNA', lat:19.606304666961204, lng:-99.0459673865077 },
    { cc:'38604', name:'Cosmopol', manager:'MARIA MERCEDES GUERRA SANTANDER', domain:'ASESORAMIENTO', maps:'https://maps.app.goo.gl/rjpDKDj1zg3bjBg27', lat:19.632055752582385, lng:-99.1257806 },
    { cc:'38862', name:'San Miguel Izcalli', manager:'DANIELA PERALTA MERAZ', domain:'ASESORAMIENTO', maps:'https://maps.app.goo.gl/yaaGX4bMJmsHEaNQ8', lat:19.688366847575164, lng:-99.21400635767179 },
    { cc:'38894', name:'Galerias Perinorte', manager:'MARLENE ALEJANDRA GARCIA URIBE', domain:'APROPIACION', maps:'https://maps.app.goo.gl/WzWpSXzTWMYbYj3e8', lat:19.60223726760007, lng:-99.19096960000002 },
    { cc:'43193', name:'Cosmopol N1', manager:'LUIS JAVIER PEREZ MOJICA', domain:'APRENDIZAJE', maps:'https://www.google.com/maps/?q=19.632067,-99.124408', lat:19.632072034272348, lng:-99.12441873300072 }
  ],
  campaigns: [
    { name:'Winter', planning:['2025-11-24','2026-01-25'], campaign:['2026-01-05','2026-02-23'], dmToSm:['2025-11-18','2025-11-24'] },
    { name:'Spring', planning:['2026-01-26','2026-03-29'], campaign:['2026-03-09','2026-04-24'], dmToSm:['2026-01-19','2026-01-25'] },
    { name:'World Cup', planning:['2026-03-30','2026-06-07'], campaign:['2026-05-25','2026-07-19'], dmToSm:['2026-03-23','2026-03-29'] },
    { name:'Summer', planning:['2026-06-01','2026-07-19'], campaign:['2026-07-20','2026-08-30'], dmToSm:['2026-06-01','2026-06-07'] },
    { name:'Fall', planning:['2026-08-03','2026-08-30'], campaign:['2026-08-31','2026-11-02'], dmToSm:['2026-07-27','2026-08-02'] },
    { name:'Xmas', planning:['2026-09-21','2026-11-02'], campaign:['2026-11-03','2027-01-04'], dmToSm:['2026-09-14','2026-09-20'] }
  ],
  visitTypes: [
    { id:'VPP', label:'VPP Periodo', className:'vpp', duration:270, objective:'Visita del periodo de planificación + SOA. Validar campaña, estándares, plan de distribución y prioridades.' },
    { id:'COACH', label:'Observe & Coach', className:'coach', duration:90, objective:'Observación en piso, coaching hombro a hombro, distribución, DT, RSA, efectivo, capacitación, WFM o canales.' },
    { id:'QUICK', label:'Conexión rápida', className:'quick', duration:45, objective:'Contacto breve para acelerar resultados, relación con SM/equipo y seguimiento específico.' },
    { id:'DEV', label:'Desempeño y desarrollo', className:'dev', duration:105, objective:'Conversación individual con SM/partner, aspiraciones, CDD, Best Talent o Talent Discussion.' },
    { id:'ADMIN', label:'Administrativo', className:'admin', duration:60, objective:'KPI, gastos, capacitación, planeación, agenda y seguimiento.' }
  ],
  rituals: [
    { title:'KPI Semanal Portafolio', type:'ADMIN', weekday:1, time:'08:30', duration:45, rule:'Todos los lunes antes de 09:30' },
    { title:'Reunión Centro Norte', type:'ADMIN', weekday:2, time:'13:00', duration:90, rule:'Todos los martes. Una vez al mes puede ser física.' },
    { title:'Capacitación DM', type:'ADMIN', weekday:4, time:'16:00', duration:60, rule:'1 vez por semana: Ubits, Attensi u otros' },
    { title:'Ingreso de Gastos', type:'ADMIN', monthDays:[3,4,5,6], time:'17:00', duration:30, rule:'Buscar espacio del 3 al 6' },
    { title:'Factura Parco', type:'ADMIN', monthDay:30, time:'09:00', duration:20, rule:'Recordatorio día 30' }
  ]
};
