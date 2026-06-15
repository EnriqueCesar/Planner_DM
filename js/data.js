const DM_DATA = {
  startDate:'2026-06-22', endDate:'2026-12-31',
  home:{name:'Casa Enrique',lat:19.495011552638733,lng:-99.05194197935396,maps:'https://maps.app.goo.gl/WL9ib7upfuD1gz8Y9'},
  stores:[
    {cc:'38333',name:'Izcalli Mega',short:'Mega',manager:'Brandon Garcia Salinas',domain:'APROPIACION',tier:'C2',cluster:'Izcalli',lat:19.64697760988644,lng:-99.20715190398433,maps:'https://maps.app.goo.gl/XNEcUhMZmuSBdazW8',priority:2,visitsMonth:3,open:'06:20'},
    {cc:'38339',name:'San Marcos',short:'San Marcos',manager:'Diego Conde Merino',domain:'APROPIACION',tier:'C2',cluster:'Izcalli',lat:19.670907256797065,lng:-99.20315595767177,maps:'https://maps.app.goo.gl/eRFCorrPHzL6Wn4q7',priority:2,visitsMonth:3,open:'06:45'},
    {cc:'38368',name:'Luna Park',short:'Luna',manager:'Joel Herrera Evaristo',domain:'APRENDIZAJE',tier:'C2',cluster:'Izcalli',lat:19.657409844647916,lng:-99.21026354232822,maps:'https://maps.app.goo.gl/8wR4qKjAGonVGLft9',priority:3,visitsMonth:4,open:'06:45'},
    {cc:'38862',name:'San Miguel Izcalli',short:'San Miguel',manager:'Daniela Peralta Meraz',domain:'ASESORAMIENTO',tier:'C2',cluster:'Izcalli',lat:19.688366847575164,lng:-99.21400635767179,maps:'https://maps.app.goo.gl/yaaGX4bMJmsHEaNQ8',priority:1,visitsMonth:3,open:'06:45'},
    {cc:'38894',name:'Galerias Perinorte',short:'Perinorte',manager:'Marlene Alejandra García Uribe',domain:'APROPIACION',tier:'C1',cluster:'Perinorte',lat:19.60223726760007,lng:-99.19096960000002,maps:'https://maps.app.goo.gl/WzWpSXzTWMYbYj3e8',priority:2,visitsMonth:3,open:'07:00'},
    {cc:'38401',name:'Coacalco',short:'Coacalco',manager:'Brenda Karina Hernández Miguel',domain:'APROPIACION',tier:'C2',cluster:'Coacalco',lat:19.628726747313067,lng:-99.12410375767182,maps:'https://maps.app.goo.gl/8my5q1qD4mZiBXYD7',priority:2,visitsMonth:3,open:'07:45'},
    {cc:'38604',name:'Cosmopol',short:'Cosmopol',manager:'Maria Mercedes Guerra Santander',domain:'ASESORAMIENTO',tier:'C1',cluster:'Coacalco',lat:19.632055752582385,lng:-99.1257806,maps:'https://maps.app.goo.gl/rjpDKDj1zg3bjBg27',priority:1,visitsMonth:3,open:'07:45'},
    {cc:'43193',name:'Cosmopol N1',short:'Cosmo N1',manager:'Luis Javier Perez Mojica',domain:'APRENDIZAJE',tier:'C1',cluster:'Coacalco',lat:19.632072034272348,lng:-99.12441873300072,maps:'https://www.google.com/maps/?q=19.632067,-99.124408',priority:3,visitsMonth:4,open:'07:45'},
    {cc:'38456',name:'Plaza las Flores',short:'Las Flores',manager:'Ramon Espinoza Macias',domain:'APROPIACION',tier:'C2',cluster:'Ecatepec',lat:19.63640228103232,lng:-99.09608838684989,maps:'https://maps.app.goo.gl/c31NpiPME2nXybsn8',priority:2,visitsMonth:3,open:'07:15'},
    {cc:'38515',name:'Patio Ecatepec',short:'Patio Ecatepec',manager:'Jenny Lizbeth Muñoz Castillo',domain:'APRENDIZAJE',tier:'C2',cluster:'Ecatepec',lat:19.606304666961204,lng:-99.0459673865077,maps:'https://maps.app.goo.gl/j9zzsZGDaqXx6UtNA',priority:3,visitsMonth:4,open:'06:15'}
  ],
  campaigns:[
    {name:'World Cup',planningStart:'2026-03-30',planningEnd:'2026-06-07',campaignStart:'2026-05-25',campaignEnd:'2026-07-19'},
    {name:'Summer',planningStart:'2026-06-01',planningEnd:'2026-07-19',campaignStart:'2026-07-20',campaignEnd:'2026-08-30',launch:'2026-07-20'},
    {name:'Fall',planningStart:'2026-08-03',planningEnd:'2026-08-30',campaignStart:'2026-08-31',campaignEnd:'2026-11-02'},
    {name:'Xmas',planningStart:'2026-09-21',planningEnd:'2026-11-02',campaignStart:'2026-11-03',campaignEnd:'2027-01-04'}
  ],
  conversationPeriods:[
    {q:'Q3',name:'CDD Julio',start:'2026-07-01',end:'2026-07-31'},
    {q:'Q4',name:'CDD Octubre',start:'2026-10-01',end:'2026-10-31'}
  ],
  colors:{'VPP/SOA':'#006241','System Check':'#d7823b','Conexión rápida':'#2597b8','CDD':'#7251c6','Administrativo':'#c39a3c','Traslado':'#6e7d80','Comida':'#765041','Adaptación':'#8a9798','Bloqueo':'#39444f','Arranque campaña':'#00a862'},
  visitTypes:['VPP/SOA','System Check','Conexión rápida','CDD','Administrativo','Traslado','Comida','Adaptación','Arranque campaña'],
  approachFocus:{
    APRENDIZAJE:'Enseñar aptitudes, claridad de estándares, seguimiento cercano, hombro a hombro y validación de avances.',
    APROPIACION:'Retar prioridades, observar ejecución, dar coaching puntual y fortalecer autonomía del SM.',
    ASESORAMIENTO:'Aprovechar como referente, validar consistencia, compartir buenas prácticas y elevar al portafolio.'
  }
};
