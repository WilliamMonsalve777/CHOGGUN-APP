/* ================= Datos semilla de CHOGGUN ================= */
const FORMATS = {
  novela:     {label:'Novela',      emoji:'📖', cls:''},
  relato:     {label:'Relato',      emoji:'✍️', cls:'green'},
  manga:      {label:'Manga',       emoji:'🎌', cls:'red'},
  comic:      {label:'Cómic',       emoji:'💥', cls:'purple'},
  ilustracion:{label:'Ilustración', emoji:'🎨', cls:'blue'},
  foro:       {label:'Foro',        emoji:'💬', cls:'gray'},
};
const GENRES = ['Fantasía','Ciencia ficción','Terror','Misterio','Romance','Drama','Comedia','Acción','Aventura','Realismo mágico','Slice of life','Histórica','Infantil','Cyberpunk','Épica','Poesía'];
const ROLES = ['Escritor/a','Ilustrador/a','Lector/a'];
const COLLABS = ['Coautoría','Portadas','Ilustrar capítulos','Guion de cómic','Webcomic','Beta reader / Feedback','Traducción'];
const CREDIT_ROLES = ['Coautor/a','Ilustración','Portada','Guion','Color','Edición','Traducción'];
const LICENSES = ['Todos los derechos reservados','CC BY 4.0','CC BY-NC 4.0','CC BY-NC-ND 4.0'];
const REPORT_REASONS = ['Spam o publicidad','Acoso o lenguaje ofensivo','Contenido sexual no etiquetado','Violencia gráfica','Plagio / infracción de derechos de autor','Información falsa','Otro motivo'];
const BAD_WORDS = ['idiota','estupido','estúpido','imbecil','imbécil','basura','maldito','maldita','inutil','inútil','asqueroso','tarado','tarada','gonorrea','malparido','hpta','mierda','lárgate','largate','odio a','muérete','muerete'];

const COMMUNITIES_SEED = [
  {id:'novelas',name:'Novelas',icon:'📚',cat:'Historias',color:'#f5b942',members:18420,desc:'Novelas por capítulos de todos los géneros. Publica, lee y comenta.'},
  {id:'relatos',name:'Relatos Cortos',icon:'✍️',cat:'Historias',color:'#3fb37f',members:12880,desc:'Microficción, cuentos y retos semanales de escritura.'},
  {id:'creacion',name:'Creación Literaria',icon:'🖋️',cat:'Historias',color:'#e04848',members:9310,desc:'Técnica, consejos, worldbuilding y críticas constructivas.'},
  {id:'colaboraciones',name:'Colaboraciones',icon:'🤝',cat:'Historias',color:'#5ab8e8',members:7640,desc:'Encuentra escritores e ilustradores para tu próximo proyecto.'},
  {id:'manga',name:'Manga',icon:'🎌',cat:'Visual',color:'#e04848',members:24300,desc:'Manga original hecho en Latinoamérica. ¡Muestra tus páginas!'},
  {id:'comic',name:'Cómic',icon:'💥',cat:'Visual',color:'#9b7cf0',members:11250,desc:'Cómics, tiras y webcomics de autor.'},
  {id:'ilustracion',name:'Ilustración',icon:'🎨',cat:'Visual',color:'#5ab8e8',members:21900,desc:'Portadas, concept art, personajes y fan art.'},
  {id:'arte',name:'Arte Digital',icon:'🖌️',cat:'Visual',color:'#ff8a5c',members:15870,desc:'Procesos, herramientas, pinceles y debates sobre arte.'},
  {id:'anime',name:'Anime',icon:'🍜',cat:'Entretenimiento',color:'#ff9ecd',members:28300,desc:'Series, temporadas, recomendaciones y el universo anime.'},
  {id:'peliculas',name:'Películas',icon:'🎬',cat:'Entretenimiento',color:'#f5b942',members:19800,desc:'Estrenos, clásicos, críticas y directores.'},
  {id:'videojuegos',name:'Videojuegos',icon:'🎮',cat:'Entretenimiento',color:'#3fb37f',members:56700,desc:'Novedades, consolas, eSports e indies.'},
  {id:'musica',name:'Música',icon:'🎵',cat:'Otros',color:'#c39bff',members:22400,desc:'Géneros, álbumes, artistas y descubrimientos musicales.'},
  {id:'tecnologia',name:'Tecnología',icon:'⚡',cat:'Otros',color:'#ffd166',members:34100,desc:'Herramientas para creadores, IA, apps y gadgets.'},
];

const USERS_SEED = [
  {username:'choggun',name:'Equipo CHOGGUN',role:'Moderación',avatar:'logo',bio:'Cuenta oficial. Retos semanales, novedades y moderación de la comunidad. ⚔️',genres:['Fantasía','Comedia'],collab:[],official:true,likesYou:0},
  {username:'camila_ilustra',name:'Camila Torres',role:'Ilustrador/a',bio:'Especialista en arte manga, portadas y personajes. Bogotá 🇨🇴',genres:['Fantasía','Romance','Aventura','Acción'],collab:['Portadas','Ilustrar capítulos','Webcomic'],likesYou:1},
  {username:'diego_luna',name:'Diego Luna',role:'Escritor/a',bio:'Creador de mundos, novelas oscuras y guiones. Me gusta que me den duro en los comentarios.',genres:['Terror','Ciencia ficción','Misterio'],collab:['Coautoría','Guion de cómic'],likesYou:1},
  {username:'sara_mendez',name:'Sara Méndez',role:'Ilustrador/a',bio:'Experta en estilo cartoon y arte infantil. Tiras cómicas los viernes.',genres:['Comedia','Infantil','Slice of life'],collab:['Portadas','Webcomic','Ilustrar capítulos'],likesYou:0.6},
  {username:'luis_herrera',name:'Luis Herrera',role:'Escritor/a',bio:'Narrador épico, amante de las historias de fantasía. Buscando ilustrador/a para mi saga.',genres:['Fantasía','Épica','Aventura','Misterio'],collab:['Coautoría','Beta reader / Feedback'],likesYou:1},
  {username:'valen_rios',name:'Valentina Ríos',role:'Escritor/a',bio:'Realismo mágico con olor a café y lluvia bogotana. Guionista de Café Cósmico.',genres:['Realismo mágico','Romance','Drama','Comedia'],collab:['Guion de cómic','Coautoría'],likesYou:0.7},
  {username:'kenji_bog',name:'Kenji Rodríguez',role:'Ilustrador/a',avatar:'gato',bio:'Mangaka de fin de semana. Autor de Ronin de Papel. Tinta, pantallas y café.',genres:['Acción','Aventura','Fantasía','Ciencia ficción'],collab:['Webcomic','Ilustrar capítulos'],likesYou:0.8},
  {username:'mateo_gil',name:'Mateo Gil',role:'Lector/a',avatar:'rana',bio:'Lector compulsivo y beta reader. Te digo con cariño dónde se cae tu trama.',genres:['Misterio','Terror','Ciencia ficción'],collab:['Beta reader / Feedback'],likesYou:0.9},
  {username:'ana_pardo',name:'Ana Pardo',role:'Ilustrador/a',bio:'Concept art cyberpunk. Neón, lluvia y ciudades imposibles.',genres:['Cyberpunk','Ciencia ficción','Acción'],collab:['Portadas','Ilustrar capítulos'],likesYou:0.5},
  {username:'sofia_letras',name:'Sofía Castaño',role:'Escritor/a',bio:'Poesía y microrrelatos. Traduzco del inglés y del portugués.',genres:['Poesía','Drama','Romance'],collab:['Traducción','Beta reader / Feedback'],likesYou:0.6},
  {username:'tomas_ink',name:'Tomás Rincón',role:'Ilustrador/a',bio:'Colorista de cómics y entintador. Fan de lo histórico y lo épico.',genres:['Histórica','Épica','Aventura'],collab:['Webcomic','Portadas'],likesYou:0.7},
];

const H = 3600e3;
const NOW0 = Date.now();

const CH_FAROLES = [
{title:'Capítulo 1 · El farolero',text:`Nadie en Ciudad Ceniza recordaba quién había encendido el primer farol, pero todos sabían quién apagaba el último. Se llamaba Elías Vargas, tenía diecisiete años y un abrigo dos tallas más grande que había heredado de su abuelo, junto con el oficio.

Cada noche recorría las calles empedradas con una pértiga de bronce y una lámpara de aceite. Los faroles de la ciudad no eran comunes: guardaban, en lugar de fuego, pequeños recuerdos que la gente olvidaba. Un cumpleaños, una canción, el olor del pan de la abuela. Mientras ardían, nadie podía perderlos del todo.

Aquella noche, al llegar a la plaza del reloj, Elías encontró el farol número cuarenta y dos roto. El vidrio estaba en el suelo, esparcido como escarcha, y la llama había desaparecido. No se había apagado: se la habían llevado.

—Eso no es posible —murmuró, agachándose. Entre los cristales había una pluma negra, larga como un antebrazo, que todavía estaba tibia.

Desde la torre del reloj, algo lo observaba. Elías no lo vio, pero lo sintió: ese frío particular que se te mete por la nuca cuando alguien pronuncia tu nombre en una habitación vacía.

Esa noche, por primera vez en cien años, un farolero de Ciudad Ceniza volvió a casa sin haber terminado su ronda.`},
{title:'Capítulo 2 · La biblioteca de las cosas olvidadas',text:`La biblioteca municipal abría a las ocho, pero Inés Montoya llegaba a las seis. Le gustaba el silencio de los pasillos antes de que el mundo despertara, y sobre todo le gustaba el sótano, donde guardaban los registros de los faroles.

Cuando Elías golpeó la puerta trasera con la pluma negra envuelta en un pañuelo, Inés supo de inmediato que su mañana tranquila había terminado.

—¿De dónde sacaste eso? —preguntó, sin saludar.

—Del farol cuarenta y dos. Alguien se llevó la llama.

Inés lo hizo pasar. Bajaron por una escalera de caracol que crujía como un barco viejo hasta llegar a un archivo infinito de cajones numerados. Ella abrió el cuarenta y dos y sacó una ficha amarillenta.

—Aquí dice que el farol guardaba un recuerdo de toda la ciudad —leyó en voz baja—. El nombre del río.

Elías frunció el ceño. Iba a decir que el río se llamaba… pero la palabra no llegó. Se le quedó atascada en algún lugar entre la garganta y la memoria, como una llave que ya no entra en su cerradura.

—No me acuerdo —susurró.

—Nadie se va a acordar —dijo Inés, y por primera vez pareció asustada—. Ese es el problema.`},
{title:'Capítulo 3 · Plumas en la torre',text:`Subir a la torre del reloj estaba prohibido desde que el mecanismo se detuvo, hace treinta años. Elías y Inés lo hicieron a medianoche, con una linterna, una cuerda y el valor prestado de quien ya no tiene nada que perder.

Los escalones estaban cubiertos de plumas negras. Cientos. Miles. Formaban un camino que subía en espiral hasta la cámara de los engranajes, donde una luz ámbar parpadeaba sin ruido.

Allí estaban las llamas robadas. Flotaban dentro de frascos de vidrio, ordenadas en estanterías como frutas en conserva. Elías reconoció algunas sin saber por qué: la risa de una niña en la calle de las Gardenias, la última carta de un soldado, la receta del ajiaco de la señora Rocío.

Y en el centro, encaramada sobre el péndulo detenido, los esperaba una criatura hecha de sombra y alas. Tenía ojos de farol y la voz de todas las personas que alguna vez habían olvidado algo importante.

—Llegas tarde, farolero —dijo—. Tu abuelo nunca llegaba tarde.

Elías apretó la pértiga de bronce. Por primera vez entendió que el abrigo enorme no era una herencia. Era una promesa.

(Continuará…)`}
];

const CH_SENAL = [
{title:'Capítulo 1 · Frecuencia 88.7',text:`La estación de radio del páramo de Sumapaz llevaba once años sin transmitir cuando Lucía Ardila encendió el equipo por curiosidad. Era técnica de telecomunicaciones, estaba haciendo un inventario aburrido y tenía frío.

La aguja del dial se detuvo sola en 88.7. Hubo estática, luego un silbido, luego una voz de niño que contaba números: tres, nueve, uno, uno, cuatro. Una y otra vez, con una paciencia imposible.

Lucía revisó los cables. El transmisor no estaba conectado a ninguna antena. La radio no debería estar recibiendo nada.

—¿Hola? —dijo, sintiéndose ridícula, al micrófono apagado.

La voz se detuvo. Durante cinco segundos solo hubo viento golpeando las ventanas. Después, el niño respondió:

—Hola, Lucía. Llevamos mucho tiempo esperando que alguien contestara.`},
{title:'Capítulo 2 · Coordenadas',text:`Los números eran coordenadas. Lucía tardó una noche entera en entenderlo, con un mapa del Instituto Geográfico extendido sobre la mesa y tres tazas de tinto frío alrededor.

Tres, nueve, uno, uno, cuatro. Una laguna sin nombre, a dos horas de caminata de la estación, en una zona que los mapas marcaban con una advertencia escueta: terreno inestable.

Llamó a su jefe en Bogotá. Le dijo que la radio funcionaba sola. Él se rió, le dijo que descansara, que el páramo hacía cosas raras con la cabeza de la gente.

Esa noche, la voz del niño no contó números. Cantó una canción de cuna que Lucía conocía perfectamente, porque su mamá se la cantaba cuando era pequeña. Una canción que su mamá había inventado. Una canción que nadie más en el mundo debería conocer.

Al amanecer, Lucía se puso las botas.`}
];

const CH_TREN = [
{title:'El último tren a Monserrate',text:`Doña Carmen vendía obleas al pie del funicular desde antes de que existieran los celulares, y juraba que una vez al año, la primera noche de lluvia de octubre, salía un tren que no figuraba en ningún horario.

—Se lleva a los que tienen algo pendiente allá arriba —decía, untando arequipe con una cuchara de palo—. Y los devuelve cuando lo resuelven.

Martín no creía en esas cosas. Tenía veintiséis años, un trabajo que odiaba y un mensaje sin enviar a su papá guardado en borradores desde hacía tres años. Esa noche de octubre, empapado y sin paraguas, vio el vagón rojo detenerse frente a él con las puertas abiertas.

Adentro olía a canela y a periódico viejo. Solo había un pasajero: un hombre de bigote que leía El Espectador de 1994 y que tenía, exactamente, la cara de su papá a los treinta años.

—Siéntate, mijo —le dijo sin levantar la vista—. La subida es larga y tenemos mucho de qué hablar.

Cuando Martín volvió a bajar, al amanecer, la lluvia había parado. Doña Carmen le guardó una oblea con doble arequipe, sin preguntar nada. Él sacó el celular, abrió los borradores y, por fin, presionó enviar.`}
];

const MANGA_RONIN = [
 {title:'Capítulo 1 · El papel recuerda', pages:[
  {layout:0,panels:[{scene:'city',text:'Bogotá, 2089. La ciudad de los mil grafitis.'},{scene:'face',text:'Me llamo Ren. Doblo papel.'},{scene:'rain',text:'Y el papel... recuerda.'},{scene:'space',text:''}]},
  {layout:1,panels:[{scene:'face2',text:'¡Devuélveme el pergamino!'},{scene:'action',text:'¡ZAS!',shout:true},{scene:'face',text:'Demasiado lento.'},{scene:'city',text:'Esa noche, mil grullas volaron sobre la Séptima.'}]},
  {layout:2,panels:[{scene:'rain',text:'Cada grulla lleva un recuerdo robado.'},{scene:'face',text:'Voy a devolverlos todos.'},{scene:'action',text:'¡VAMOS!',shout:true},{scene:'face2',text:'...¿Quién es ese chico?'}]},
 ]},
 {title:'Capítulo 2 · Grullas de acero', pages:[
  {layout:1,panels:[{scene:'space',text:'El gremio de los Plegadores despierta.'},{scene:'face2',text:'Ren rompió el pacto.'},{scene:'face',text:'Entonces lo cazaremos.'},{scene:'city',text:'Mientras tanto, en La Candelaria...'}]},
  {layout:0,panels:[{scene:'cafe',text:'¿Un tinto antes de la pelea?'},{scene:'face',text:'Siempre.'},{scene:'action',text:'¡BOOM!',shout:true},{scene:'rain',text:'(Continuará)'}]},
 ]},
];
const COMIC_CAFE = [
 {title:'Episodio 1 · Pedido especial', pages:[
  {layout:2,panels:[{scene:'space',text:'Café Cósmico: abierto 24/7 en el borde de la galaxia.'},{scene:'cafe',text:'Un capuchino con polvo de estrellas, por favor.'},{scene:'face',text:'¿Leche de vaca o de nebulosa?'},{scene:'face2',text:'...¿Hay diferencia?'}]},
  {layout:0,panels:[{scene:'cafe',text:'La de nebulosa brilla en la oscuridad.'},{scene:'face2',text:'Me convenciste.'},{scene:'action',text:'¡FSSSH!',shout:true},{scene:'face',text:'Servido. Son 3 lunas.'}]},
  {layout:1,panels:[{scene:'face2',text:'Solo tengo pesos colombianos.'},{scene:'face',text:'Ah, la moneda más exótica del universo.'},{scene:'space',text:'Fin del episodio 1'},{scene:'cafe',text:'¡Vuelve pronto!'}]},
 ]},
];

function seedWorks(){
  const w = (o)=>Object.assign({votes:{},comments:[],status:'publicado',license:'Todos los derechos reservados',views:0,credits:[],chapters:[],genres:[],mature:false},o);
  return [
    w({id:'w1',type:'novela',title:'La Ciudad de los Faroles Rotos',author:'luis_herrera',credits:[{user:'camila_ilustra',role:'Portada'}],genres:['Fantasía','Misterio'],community:'novelas',synopsis:'En Ciudad Ceniza los faroles guardan los recuerdos que la gente olvida. Cuando alguien empieza a robar sus llamas, un joven farolero y una bibliotecaria deberán subir a la torre prohibida antes de que la ciudad olvide su propio nombre.',chapters:CH_FAROLES,baseVotes:412,views:5230,created:NOW0-26*H,motif:'moon',coverSeed:'faroles7',
      comments:[{id:'c1',user:'mateo_gil',text:'El final del capítulo 3 me dejó sin aire. ¿Cuándo sale el 4? 😭',time:NOW0-20*H,likes:['camila_ilustra','diego_luna'],replies:[{id:'c1r',user:'luis_herrera',text:'¡El próximo viernes! Camila está terminando la ilustración del capítulo.',time:NOW0-19*H,likes:['mateo_gil']}]},{id:'c2',user:'sofia_letras',text:'Me encanta la idea de los faroles que guardan recuerdos. La prosa es muy visual.',time:NOW0-10*H,likes:[]}]}),
    w({id:'w2',type:'manga',title:'Ronin de Papel',author:'kenji_bog',credits:[{user:'diego_luna',role:'Guion'}],genres:['Acción','Ciencia ficción','Aventura'],community:'manga',synopsis:'Bogotá, 2089. Ren es un plegador: puede guardar recuerdos dentro de figuras de papel. Cuando el gremio que lo entrenó empieza a robar memorias, decide devolverlas una grulla a la vez.',chapters:MANGA_RONIN,baseVotes:688,views:9120,created:NOW0-50*H,motif:'city',coverSeed:'ronin3',
      comments:[{id:'c3',user:'camila_ilustra',text:'¡Las onomatopeyas están brutales! El paneleo del capítulo 1 es muy dinámico.',time:NOW0-30*H,likes:['kenji_bog']},{id:'c4',user:'ana_pardo',text:'Bogotá cyberpunk 💛 Si necesitas ayuda con fondos, avísame.',time:NOW0-12*H,likes:[]}]}),
    w({id:'w3',type:'comic',title:'Café Cósmico',author:'sara_mendez',credits:[{user:'valen_rios',role:'Guion'}],genres:['Comedia','Ciencia ficción','Slice of life'],community:'comic',synopsis:'Una cafetería en el borde de la galaxia, una barista con paciencia infinita y clientes que pagan con lunas. Tira cómica semanal.',chapters:COMIC_CAFE,baseVotes:231,views:2810,created:NOW0-8*H,motif:'orbit',coverSeed:'cafe1',color:true,
      comments:[{id:'c5',user:'mateo_gil',text:'"La moneda más exótica del universo" JAJAJA',time:NOW0-5*H,likes:['sara_mendez','valen_rios']}]}),
    w({id:'w4',type:'ilustracion',title:'Guardianes del Páramo',author:'camila_ilustra',genres:['Fantasía','Aventura'],community:'ilustracion',synopsis:'Tres espíritus protectores del páramo de Sumapaz bajo la luna llena. Ilustración digital, 12 horas de trabajo. Abierta a colaborar como portada.',image:{gen:'paramo42'},baseVotes:356,views:4100,created:NOW0-14*H,coverSeed:'paramo42',
      comments:[{id:'c6',user:'luis_herrera',text:'Esto sería la portada perfecta para el libro 2 de los Faroles 👀',time:NOW0-9*H,likes:['camila_ilustra']}]}),
    w({id:'w5',type:'relato',title:'El último tren a Monserrate',author:'valen_rios',genres:['Realismo mágico','Drama'],community:'relatos',synopsis:'Una vez al año, la primera noche de lluvia de octubre, sale un tren que no figura en ningún horario.',chapters:CH_TREN,baseVotes:178,views:1950,created:NOW0-4*H,motif:'waves',coverSeed:'tren2',license:'CC BY-NC 4.0'}),
    w({id:'w6',type:'novela',title:'Señal Perdida',author:'diego_luna',genres:['Terror','Ciencia ficción','Misterio'],community:'novelas',synopsis:'Una técnica de telecomunicaciones enciende una radio abandonada en el páramo. Del otro lado, una voz de niño conoce su nombre.',chapters:CH_SENAL,baseVotes:264,views:3300,created:NOW0-60*H,motif:'forest',coverSeed:'senal9'}),
    w({id:'w7',type:'ilustracion',title:'Neón sobre la Séptima',author:'ana_pardo',genres:['Cyberpunk','Ciencia ficción'],community:'ilustracion',synopsis:'Concept art: la carrera Séptima en 2089, con lluvia ácida y grullas holográficas. Inspirado en Ronin de Papel.',image:{gen:'neon77'},baseVotes:301,views:3600,created:NOW0-33*H,coverSeed:'neon77'}),
    w({id:'f1',type:'foro',title:'Reto semanal #12: un relato de 300 palabras que incluya la palabra "farol"',author:'choggun',community:'relatos',synopsis:'¡Nuevo reto! Tienen hasta el domingo. Los tres relatos más votados salen destacados en Inicio y reciben la insignia de Pluma de Oro. Publiquen con el formato Relato y comenten aquí el enlace. ✍️⚔️',baseVotes:145,views:2200,created:NOW0-2*H,pinned:true,
      comments:[{id:'c7',user:'sofia_letras',text:'¡Me apunto! ¿Cuenta si el farol es metafórico?',time:NOW0-1.5*H,likes:[],replies:[{id:'c7r',user:'choggun',text:'¡Claro que sí! Mientras la palabra aparezca 😉',time:NOW0-1.2*H,likes:['sofia_letras']}]}]}),
    w({id:'f2',type:'foro',title:'Busco ilustrador/a para mi saga de fantasía (paga por proyecto + créditos)',author:'luis_herrera',community:'colaboraciones',synopsis:'Estoy escribiendo el libro 2 de La Ciudad de los Faroles Rotos y busco a alguien para ilustrar la apertura de cada capítulo (12 en total). Estilo pictórico o manga. Créditos compartidos en la ficha de la obra. ¡Escríbanme por Match o por chat!',genres:['Fantasía'],baseVotes:98,views:870,created:NOW0-6*H,
      comments:[{id:'c8',user:'tomas_ink',text:'Te escribí por chat, tengo portafolio de fantasía épica.',time:NOW0-5*H,likes:['luis_herrera']}]}),
    w({id:'f3',type:'foro',title:'Top 10 animes de 2025 según la comunidad',author:'mateo_gil',community:'anime',synopsis:'Hicimos la encuesta y estos son los resultados. La temporada de invierno trajo sorpresas inesperadas: desde isekai hasta slice of life. ¿Cuál fue su favorito?',baseVotes:412,views:6100,created:NOW0-28*H,comments:[]}),
    w({id:'f4',type:'foro',title:'IA generativa: ¿amiga o enemiga del arte?',author:'ana_pardo',community:'arte',synopsis:'El debate sobre inteligencia artificial y creatividad humana sigue siendo el más caliente. ¿Lo usan como referencia, para nada, o creen que debería prohibirse en plataformas de artistas? Debate con respeto, por favor.',baseVotes:167,views:2900,created:NOW0-18*H,
      comments:[{id:'c9',user:'kenji_bog',text:'Para mí el valor está en el proceso. Si no lo dibujaste, no es tuyo.',time:NOW0-16*H,likes:['camila_ilustra','sara_mendez']},{id:'c10',user:'diego_luna',text:'Como escritor la uso para buscar sinónimos y ya. La voz tiene que ser de uno.',time:NOW0-15*H,likes:[]}]}),
    w({id:'f5',type:'foro',title:'¿Cómo manejan los créditos en obras colaborativas?',author:'valen_rios',community:'creacion',synopsis:'En Café Cósmico yo escribo el guion y Sara dibuja. Usamos la sección de créditos de CHOGGUN, pero quiero saber cómo lo hacen otros: ¿porcentajes, contratos, solo nombres? Compartan sus experiencias.',baseVotes:76,views:640,created:NOW0-40*H,comments:[]}),
    w({id:'f6',type:'foro',title:'La mejor consola de 2025',author:'mateo_gil',community:'videojuegos',synopsis:'El debate continúa: PS5 Pro, Xbox Series X, Switch 2 o PC Gaming. ¿Cuál es la tuya y por qué?',baseVotes:89,views:1500,created:NOW0-70*H,comments:[]}),
    w({id:'f7',type:'foro',title:'Estrenos de cine de octubre que valen la pena',author:'sofia_letras',community:'peliculas',synopsis:'Dejo mi lista de lo que vale la pena ver este mes en Bogotá (y lo que no). Agreguen las suyas en los comentarios.',baseVotes:54,views:480,created:NOW0-22*H,comments:[]}),
  ];
}

const CHAT_SEED = [
  {with:'camila_ilustra',msgs:[{from:'camila_ilustra',text:'¡Hola! Vi que hiciste match conmigo 😊 ¿En qué proyecto estás trabajando?',t:-3*H}]},
  {with:'choggun',msgs:[{from:'choggun',text:'¡Bienvenido/a a CHOGGUN! ⚔️ Aquí puedes publicar novelas, manga, cómics e ilustraciones, y encontrar colaboradores en la pestaña Match. Si ves algo que rompe las normas, usa el botón Reportar.',t:-1*H}]},
];

const AUTO_REPLIES = {
  'Ilustrador/a':['¡Me encanta la idea! ¿Tienes referencias visuales?','Puedo mandarte unos bocetos esta semana ✏️','¿Qué estilo tienes en mente: manga, cartoon o pictórico?','Te paso mi portafolio por aquí 🎨'],
  'Escritor/a':['¡Suena genial! ¿Ya tienes la sinopsis?','Yo me encargo del guion si tú dibujas 😄','¿Cuántos capítulos tienes pensados?','Te mando el primer borrador esta noche 📖'],
  'Lector/a':['¡Lo leo y te doy feedback honesto!','Me encantó el capítulo, pero el ritmo del inicio se siente lento.','¿Cuándo sale lo siguiente? 👀'],
  'Moderación':['Gracias por escribirnos. Un moderador revisará tu mensaje pronto. 🛡️'],
};
