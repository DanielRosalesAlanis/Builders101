// Datos descriptivos de los eventos (imagen, categoría, dirección, texto).
// Lo que define la validez de un boleto vive en el contrato: organizador,
// nombre, recinto, fecha, capacidad, vendidos y precio. Aquí solo se guarda
// lo que no hace falta en la red, enlazado por el número de evento.

export const CATEGORIAS = ['Todos', 'Eventos', 'Conciertos', 'Teatro']

// Cuenta de ejemplo para probar transferencias.
export const CUENTA_EJEMPLO = 'GA34IJVLXRTUB2B4WKVDCWEO44UNUTBXVPMCK6UWIKJZL2PEQXBCSTHL'

export const metadatos = {
  1: {
    imagen: '/eventos/CaifanesBanner.jpg',
    categoria: 'Conciertos',
    ciudad: 'Cuernavaca, Mor.',
    direccion: 'Calle Río Balsas 22, Vista Hermosa, 62290 Cuernavaca, Mor.',
    organizadorNombre: 'Teopanzolco Producciones',
    descripcion:
      'Caifanes regresa a Cuernavaca con un recorrido por sus discos clásicos. Acceso general, puertas abren a las 20:00.',
  },
  2: {
    imagen: '/eventos/AWSBanner.webp',
    categoria: 'Eventos',
    ciudad: 'Ciudad de México',
    direccion: 'Av. del Conscripto 311, Lomas de Sotelo, Hipódromo de las Américas, Miguel Hidalgo, 11610 Ciudad de México, CDMX',
    organizadorNombre: 'Amazon Web Services',
    descripcion: 'Un día completo de conferencias, talleres y demostraciones sobre nube, datos e inteligencia artificial.',
  },
  3: {
    imagen: '/eventos/GoyaHackBanner.jpg',
    categoria: 'Eventos',
    ciudad: 'Ciudad de México',
    direccion: 'Av. Universidad 3000, Ciudad Universitaria, Coyoacán, 04510 Ciudad de México, CDMX',
    organizadorNombre: 'Stellar x BAF',
    fechaFin: '2026-09-26',
    descripcion: 'Hackathon de seis días para construir sobre Stellar. Mentorías, premios y networking con el ecosistema.',
  },
  4: {
    imagen: '/eventos/BrunoMarsBanner.jpg',
    categoria: 'Conciertos',
    ciudad: 'Ciudad de México',
    direccion: 'Viaducto Río de la Piedad s/n, Granjas México, Iztacalco, 08400 Ciudad de México, CDMX',
    organizadorNombre: 'Live Nation México',
    descripcion:
      'Bruno Mars regresa a la Ciudad de México con The Romantic Tour. Invitado especial: Anderson .Paak como DJ Pee.Wee.',
  },
  5: {
    imagen: '/eventos/ReyLeonBanner.avif',
    categoria: 'Teatro',
    ciudad: 'Ciudad de México',
    direccion: 'Lago Zurich 245, Ampliación Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX',
    organizadorNombre: 'OCESA Teatro',
    descripcion:
      'La producción de Disney llega al Teatro Telcel con vestuario, música y escenografía de Broadway.',
  },
}

// Portada genérica para eventos sin imagen (por ejemplo, los que se crean desde la app).
export const portadaGenerica = (titulo) => ({
  fondo: 'linear-gradient(135deg, #3a3a3c 0%, #1c1c1e 100%)',
  texto: titulo.toUpperCase(),
  estilo: 'nuevo',
})
