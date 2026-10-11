// Datos de ejemplo. En la siguiente entrega la capacidad, los vendidos y los
// boletos se leerán del contrato TrustTix en Stellar Testnet.

// Tipo de cambio de referencia para mostrar el equivalente en USDC.
export const MXN_POR_USDC = 18.5

// Cuenta que usa la billetera simulada al "conectar Freighter".
export const BILLETERA_DEMO = 'GDEMOTRUSTTIXASISTENTE7Q4ZK2M5RBN3XW6YHPLVC8JDUF4AE9SGNT'

// Cuentas de otras personas, para transferencias y verificaciones de ejemplo.
export const OTRAS_CUENTAS = [
  'GBXAMIGOTRUSTTIX5K7N2QW4RT8YU3PL6MZ9CV1BX4DF7GH2JK5LP8QA',
  'GCREVENDEDORTTX9H3L6P2W5S8D1F4G7J0K3M6N9Q2R5T8V1X4Z7B0C3',
]

// Cuenta del personal de acceso autorizado en los eventos de ejemplo.
export const CUENTA_ACCESO = 'GSTAFFTRUSTTIXPUERTA4B7E1H4K7N0Q3T6W9Z2C5F8I1L4O7R0U3X6Y'

export const CATEGORIAS = ['Todos', 'Eventos', 'Conciertos', 'Teatro']

export const eventosIniciales = [
  {
    id: 'caifanes-teopanzolco',
    imagen: '/eventos/CaifanesBanner.jpg',
    titulo: 'Caifanes en concierto',
    categoria: 'Conciertos',
    recinto: 'Centro Cultural Teopanzolco',
    ciudad: 'Cuernavaca, Mor.',
    direccion: 'Calle Río Balsas 22, Vista Hermosa, 62290 Cuernavaca, Mor.',
    fecha: '2026-11-19',
    hora: '22:00',
    capacidad: 80000,
    vendidos: 24990,
    precioMXN: 2000,
    organizador: 'Teopanzolco Producciones',
    descripcion:
      'Caifanes regresa a Cuernavaca con un recorrido por sus discos clásicos. Acceso general, puertas abren a las 20:00.',
    portada: { fondo: 'linear-gradient(120deg, #2b2f8f 0%, #3b3fb3 55%, #1f6b5e 100%)', texto: 'CAIFANES', estilo: 'rock' },
  },
  {
    id: 'aws-summit-cdmx',
    imagen: '/eventos/AWSBanner.webp',
    titulo: 'AWS Summit Mexico City',
    categoria: 'Eventos',
    recinto: 'Centro CitiBanamex',
    ciudad: 'Ciudad de México',
    direccion: 'Av. del Conscripto 311, Lomas de Sotelo, Hipódromo de las Américas, Miguel Hidalgo, 11610 Ciudad de México, CDMX',
    fecha: '2026-11-27',
    hora: '09:00',
    capacidad: 300,
    vendidos: 250,
    precioMXN: 0,
    organizador: 'Amazon Web Services',
    descripcion:
      'Un día completo de conferencias, talleres y demostraciones sobre nube, datos e inteligencia artificial.',
    portada: { fondo: 'linear-gradient(160deg, #3aa0e0 0%, #6a5cff 45%, #ff3d6e 75%, #ff8a3d 100%)', texto: 'aws summit', estilo: 'tech' },
  },
  {
    id: 'goya-hack-unam',
    imagen: '/eventos/GoyaHackBanner.jpg',
    titulo: 'GOYA HACK · UNAM',
    categoria: 'Eventos',
    recinto: 'Universidad Nacional Autónoma de México',
    ciudad: 'Ciudad de México',
    direccion: 'Av. Universidad 3000, Ciudad Universitaria, Coyoacán, 04510 Ciudad de México, CDMX',
    fecha: '2026-09-21',
    fechaFin: '2026-09-26',
    hora: '10:00',
    capacidad: 500,
    vendidos: 500,
    precioMXN: 0,
    organizador: 'Stellar x BAF',
    descripcion:
      'Hackathon de seis días para construir sobre Stellar. Mentorías, premios y networking con el ecosistema.',
    portada: { fondo: 'linear-gradient(135deg, #0b1020 0%, #121a33 60%, #1b2a55 100%)', texto: 'GOYA HACK', estilo: 'pixel' },
  },
  {
    id: 'bruno-mars-cdmx',
    imagen: '/eventos/BrunoMarsBanner.jpg',
    titulo: 'Bruno Mars en concierto',
    categoria: 'Conciertos',
    recinto: 'Estadio GNP Seguros',
    ciudad: 'Ciudad de México',
    direccion: 'Viaducto Río de la Piedad s/n, Granjas México, Iztacalco, 08400 Ciudad de México, CDMX',
    fecha: '2026-12-07',
    hora: '20:30',
    capacidad: 65000,
    vendidos: 64988,
    precioMXN: 1850,
    organizador: 'Live Nation México',
    descripcion:
      'Bruno Mars regresa a la Ciudad de México con The Romantic Tour. Invitado especial: Anderson .Paak como DJ Pee.Wee.',
    portada: { fondo: 'linear-gradient(135deg, #f4efe6 0%, #e9dcc9 100%)', texto: 'BRUNO MARS', estilo: 'rock' },
  },
  {
    id: 'rey-leon-musical',
    imagen: '/eventos/ReyLeonBanner.avif',
    titulo: 'El Rey León, el musical',
    categoria: 'Teatro',
    recinto: 'Teatro Telcel',
    ciudad: 'Ciudad de México',
    direccion: 'Lago Zurich 245, Ampliación Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX',
    fecha: '2026-12-12',
    hora: '20:00',
    capacidad: 1350,
    vendidos: 870,
    precioMXN: 500,
    organizador: 'OCESA Teatro',
    descripcion:
      'La producción de Disney llega al Teatro Telcel con vestuario, música y escenografía de Broadway. Boletos a partir de $500.',
    portada: { fondo: 'linear-gradient(135deg, #d62f0a 0%, #ff9a00 100%)', texto: 'EL REY LEÓN', estilo: 'fest' },
  },
]

export const boletosIniciales = [
  {
    id: 'TTX-024990',
    eventoId: 'caifanes-teopanzolco',
    dueno: BILLETERA_DEMO,
    estado: 'valido',
    historial: [{ tipo: 'compra', a: BILLETERA_DEMO, fecha: '2026-10-02T18:12:00' }],
  },
  {
    id: 'TTX-000250',
    eventoId: 'aws-summit-cdmx',
    dueno: OTRAS_CUENTAS[1],
    estado: 'valido',
    historial: [{ tipo: 'compra', a: OTRAS_CUENTAS[1], fecha: '2026-10-05T11:40:00' }],
  },
  {
    id: 'TTX-000412',
    eventoId: 'goya-hack-unam',
    dueno: OTRAS_CUENTAS[0],
    estado: 'usado',
    usadoEn: '2026-09-21T10:14:00',
    historial: [
      { tipo: 'compra', a: OTRAS_CUENTAS[1], fecha: '2026-08-01T09:00:00' },
      { tipo: 'transferencia', a: OTRAS_CUENTAS[0], fecha: '2026-08-15T20:30:00' },
      { tipo: 'entrada', fecha: '2026-09-21T10:14:00' },
    ],
  },
]
