window.PLANNER_DATA = {
  version:'5.0',
  startDate:'2026-06-22',
  endDate:'2026-12-31',
  home:{id:'HOME',name:'Casa Enrique',lat:19.495011552638733,lng:-99.05194197935396,map:'https://maps.app.goo.gl/WL9ib7upfuD1gz8Y9'},
  stores:[
    {cc:'38333',short:'Mega',name:'Izcalli Mega',manager:'Brandon Garcia Salinas',domain:'APROPIACION',priority:'media',cluster:'Izcalli',lat:19.64697760988644,lng:-99.20715190398433,map:'https://maps.app.goo.gl/XNEcUhMZmuSBdazW8',format:'C-Retail-Hypermarket'},
    {cc:'38339',short:'San Marcos',name:'San Marcos',manager:'Diego Conde Merino',domain:'APROPIACION',priority:'media',cluster:'Izcalli',lat:19.670907256797065,lng:-99.20315595767177,map:'https://maps.app.goo.gl/eRFCorrPHzL6Wn4q7',format:'C-Retail-Hypermarket'},
    {cc:'38368',short:'Luna',name:'Luna Park',manager:'Joel Herrera Evaristo',domain:'APRENDIZAJE',priority:'alta',cluster:'Izcalli',lat:19.657409844647916,lng:-99.21026354232822,map:'https://maps.app.goo.gl/8wR4qKjAGonVGLft9',format:'K-Retail-Mall'},
    {cc:'38401',short:'Coacalco',name:'Coacalco',manager:'Brenda Karina Hernandez Miguel',domain:'APROPIACION',priority:'media',cluster:'Coacalco',lat:19.628726747313067,lng:-99.12410375767182,map:'https://maps.app.goo.gl/8my5q1qD4mZiBXYD7',format:'C-Retail-Hypermarket'},
    {cc:'38456',short:'Las Flores',name:'Plaza las Flores',manager:'Ramon Espinosa Macias',domain:'APROPIACION',priority:'media',cluster:'Coacalco',lat:19.63640228103232,lng:-99.09608838684989,map:'https://maps.app.goo.gl/c31NpiPME2nXybsn8',format:'K-Retail-Hypermarket'},
    {cc:'38515',short:'Patio',name:'Patio Ecatepec',manager:'Jenny Lizbeth Muñoz Castillo',domain:'APRENDIZAJE',priority:'alta',cluster:'Coacalco',lat:19.606304666961204,lng:-99.0459673865077,map:'https://maps.app.goo.gl/j9zzsZGDaqXx6UtNA',format:'C-Retail-Hypermarket'},
    {cc:'38604',short:'Cosmopol',name:'Cosmopol',manager:'Maria Mercedes Guerra Santander',domain:'ASESORAMIENTO',priority:'estable',cluster:'Coacalco',lat:19.632055752582385,lng:-99.1257806,map:'https://maps.app.goo.gl/rjpDKDj1zg3bjBg27',format:'K-Retail-Mall'},
    {cc:'38862',short:'San Miguel',name:'San Miguel Izcalli',manager:'Daniela Peralta Meraz',domain:'ASESORAMIENTO',priority:'estable',cluster:'Izcalli',lat:19.688366847575164,lng:-99.21400635767179,map:'https://maps.app.goo.gl/yaaGX4bMJmsHEaNQ8',format:'C-Retail-Hypermarket'},
    {cc:'38894',short:'Perinorte',name:'Galerias Perinorte',manager:'Marlene Alejandra Garcia Uribe',domain:'APROPIACION',priority:'media',cluster:'Izcalli',lat:19.60223726760007,lng:-99.19096960000002,map:'https://maps.app.goo.gl/WzWpSXzTWMYbYj3e8',format:'C-Retail-Mall'},
    {cc:'43193',short:'Cosmo N1',name:'Cosmopol N1',manager:'Luis Javier Perez Mojica',domain:'APRENDIZAJE',priority:'alta',cluster:'Coacalco',lat:19.632072034272348,lng:-99.12441873300072,map:'https://www.google.com/maps/?q=19.632067,-99.124408',format:'K-Retail-Mall'}
  ],
  planningPeriods:[
    {id:'summer',name:'Summer',start:'2026-06-01',end:'2026-07-19',campaignStart:'2026-07-20',campaignEnd:'2026-08-30',dmToSm:'2026-05-01 a 2026-05-07'},
    {id:'fall',name:'Fall',start:'2026-08-03',end:'2026-08-30',campaignStart:'2026-08-31',campaignEnd:'2026-11-02',dmToSm:'2026-07-27 a 2026-08-02'},
    {id:'xmas',name:'Xmas',start:'2026-09-21',end:'2026-11-02',campaignStart:'2026-11-03',campaignEnd:'2027-01-04',dmToSm:'2026-09-14 a 2026-09-20'}
  ],
  cddMonths:[6,9],
  visitTypes:[
    {id:'vpp',name:'VPP/SOA',icon:'🟢',duration:270,color:'#006241'},
    {id:'system',name:'Observe & Coach',icon:'🟠',duration:90,color:'#d9823b'},
    {id:'inventory',name:'System Check Inventario',icon:'📦',duration:120,color:'#0f7a5c'},
    {id:'connection',name:'Conexión rápida',icon:'🔵',duration:45,color:'#1f9abc'},
    {id:'cdd',name:'CDD',icon:'🟣',duration:105,color:'#6d4ec2'},
    {id:'travel',name:'Traslado',icon:'🚗',color:'#7d8b8d'},
    {id:'meal',name:'Comida',icon:'🍽️',duration:60,color:'#795144'},
    {id:'adapt',name:'Adaptación a lo inesperado',icon:'🧭',color:'#9ba7a9'},
    {id:'admin',name:'Administrativo',icon:'🗂️',color:'#c39a34'},
    {id:'block',name:'Bloqueo',icon:'⛔',color:'#394b59'},
    {id:'launch',name:'Arranque campaña',icon:'🚀',color:'#009966'}
  ],
  approach:{
    aprendizaje:'Enseñar aptitudes, claridad de estándares, acompañamiento hombro a hombro y seguimiento cercano.',
    apropiacion:'Retar prioridades, observar ejecución, dar coaching puntual y fortalecer autonomía del SM.',
    asesoramiento:'Aprovechar como referente, validar consistencia, compartir buenas prácticas y elevar al portafolio.'
  }
};
