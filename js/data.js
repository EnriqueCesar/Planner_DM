window.PLANNER_DM_DATA = {
  dm: {
    name: 'Enrique César Flores',
    role: 'Gerente de Distrito',
    startDate: '2026-06-22',
    endDate: '2026-12-31',
    home: { name: 'Casa Enrique', lat: 19.495011552638733, lng: -99.05194197935396, maps: 'https://maps.app.goo.gl/WL9ib7upfuD1gz8Y9' }
  },
  campaigns: [
    { key:'WORLD CUP', planningStart:'2026-03-30', planningEnd:'2026-06-07', campaignStart:'2026-05-25', campaignEnd:'2026-07-19', color:'#0b5d46' },
    { key:'SUMMER', planningStart:'2026-06-01', planningEnd:'2026-07-19', campaignStart:'2026-07-20', campaignEnd:'2026-08-30', color:'#00754a' },
    { key:'FALL', planningStart:'2026-08-03', planningEnd:'2026-08-30', campaignStart:'2026-08-31', campaignEnd:'2026-11-02', color:'#6b7f2a' },
    { key:'XMAS', planningStart:'2026-09-21', planningEnd:'2026-11-02', campaignStart:'2026-11-03', campaignEnd:'2027-01-04', color:'#9b1b30' }
  ],
  cddPeriods: [
    { quarter:'Q1', month:'Enero', start:'2026-01-01', end:'2026-01-31' },
    { quarter:'Q2', month:'Abril', start:'2026-04-01', end:'2026-04-30' },
    { quarter:'Q3', month:'Julio', start:'2026-07-01', end:'2026-07-31' },
    { quarter:'Q4', month:'Octubre', start:'2026-10-01', end:'2026-10-31' }
  ],
  stores: [
    {cc:'38333', name:'Izcalli Mega', manager:'Brandon Garcia Salinas', domain:'APROPIACION', tier:'C2', type:'C-Retail-Hypermarket', seats:45, cluster:'Izcalli', lat:19.64697760988644, lng:-99.20715190398433, maps:'https://maps.app.goo.gl/XNEcUhMZmuSBdazW8', open:'06:20', close:'22:15'},
    {cc:'38339', name:'San Marcos', manager:'Diego Conde Merino', domain:'APROPIACION', tier:'C2', type:'C-Retail-Hypermarket', seats:75, cluster:'Izcalli', lat:19.670907256797065, lng:-99.20315595767177, maps:'https://maps.app.goo.gl/eRFCorrPHzL6Wn4q7', open:'06:45', close:'22:15'},
    {cc:'38368', name:'Luna Park', manager:'Joel Herrera Evaristo', domain:'APRENDIZAJE', tier:'C2', type:'K-Retail-Mall', seats:45, cluster:'Izcalli', lat:19.657409844647916, lng:-99.21026354232822, maps:'https://maps.app.goo.gl/8wR4qKjAGonVGLft9', open:'06:45', close:'22:15'},
    {cc:'38401', name:'Coacalco', manager:'Brenda Karina Hernández Miguel', domain:'APROPIACION', tier:'C2', type:'C-Retail-Hypermarket', seats:53, cluster:'Coacalco', lat:19.628726747313067, lng:-99.12410375767182, maps:'https://maps.app.goo.gl/8my5q1qD4mZiBXYD7', open:'07:45', close:'22:15'},
    {cc:'38456', name:'Plaza las Flores', manager:'Ramon Espinosa Macias', domain:'APROPIACION', tier:'C2', type:'K-Retail-Hypermarket', seats:37, cluster:'Ecatepec', lat:19.63640228103232, lng:-99.09608838684989, maps:'https://maps.app.goo.gl/c31NpiPME2nXybsn8', open:'07:15', close:'22:15'},
    {cc:'38515', name:'Patio Ecatepec', manager:'Itzel Dayana Llamas Ramirez', domain:'APRENDIZAJE', tier:'C2', type:'C-Retail-Hypermarket', seats:36, cluster:'Ecatepec', lat:19.606304666961204, lng:-99.0459673865077, maps:'https://maps.app.goo.gl/j9zzsZGDaqXx6UtNA', open:'06:15', close:'22:15'},
    {cc:'38604', name:'Cosmopol', manager:'Maria Mercedes Guerra Santander', domain:'ASESORAMIENTO', tier:'C1', type:'K-Retail-Mall', seats:68, cluster:'Coacalco', lat:19.632055752582385, lng:-99.1257806, maps:'https://maps.app.goo.gl/rjpDKDj1zg3bjBg27', open:'07:45', close:'22:15'},
    {cc:'38862', name:'San Miguel Izcalli', manager:'Daniela Peralta Meraz', domain:'ASESORAMIENTO', tier:'C2', type:'C-Retail-Hypermarket', seats:66, cluster:'Izcalli', lat:19.688366847575164, lng:-99.21400635767179, maps:'https://maps.app.goo.gl/yaaGX4bMJmsHEaNQ8', open:'06:45', close:'22:15'},
    {cc:'38894', name:'Galerias Perinorte', manager:'Marlene Alejandra García Uribe', domain:'APROPIACION', tier:'C1', type:'C-Retail-Mall', seats:35, cluster:'Perinorte', lat:19.60223726760007, lng:-99.19096960000002, maps:'https://maps.app.goo.gl/WzWpSXzTWMYbYj3e8', open:'07:00', close:'22:00'},
    {cc:'43193', name:'Cosmopol N1', manager:'Luis Javier Perez Mojica', domain:'APRENDIZAJE', tier:'C1', type:'K-Retail-Mall', seats:8, cluster:'Coacalco', lat:19.632072034272348, lng:-99.12441873300072, maps:'https://www.google.com/maps/?q=19.632067,-99.124408', open:'07:45', close:'22:15'}
  ],
  visitTypes: {
    VPP: { label:'VPP + SOA', duration:270, color:'#006241', category:'Visita Periodo', required:true, objective:'Alineación de periodo, estándares, SOA, prioridades de campaña y plan operativo.' },
    SYSTEM: { label:'System Check / Observe & Coach', duration:90, color:'#d77a34', category:'Observe & Coach', required:true, objective:'Observación en piso, coaching, ejecución de estándares, inventario, distribución, capacitación, programación, efectivo, RSA o canales.' },
    QUICK: { label:'Conexión rápida', duration:45, color:'#219ebc', category:'Conexión', required:true, objective:'Contacto breve para desarrollar relaciones, validar avance, retirar obstáculos y acelerar resultados.' },
    CDD: { label:'Conversación de desempeño (CDD)', duration:105, color:'#5e3db3', category:'Desarrollo', required:true, objective:'Conversación individual de desarrollo, aspiraciones, retroalimentación y acuerdos.' },
    ADMIN: { label:'Administrativo', duration:60, color:'#b08a2e', category:'Administrativo' },
    BUFFER: { label:'Adaptación a lo inesperado', duration:60, color:'#839192', category:'Buffer' },
    TRAVEL: { label:'Traslado', duration:45, color:'#6c757d', category:'Traslado' },
    LUNCH: { label:'Comida', duration:60, color:'#6d4c41', category:'Comida' }
  }
};
