import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BILLETERA_DEMO, boletosIniciales, eventosIniciales } from '../data/eventos'

// Estado simulado de la app. Cada acción imita una función del contrato
// TrustTix (crear_evento, comprar, transferir, consultar_boleto,
// registrar_entrada) y aplica las mismas reglas que hará cumplir la red.

const CLAVE = 'trusttix-demo-v4'
const AppContext = createContext(null)

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado) return JSON.parse(guardado)
  } catch {
    // Sin almacenamiento disponible: se usa el estado inicial.
  }
  return null
}

function estadoInicial() {
  return {
    usuario: null,
    billetera: null,
    eventos: eventosIniciales,
    boletos: boletosIniciales,
  }
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

export function AppProvider({ children }) {
  const [estado, setEstado] = useState(() => cargar() ?? estadoInicial())

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado))
    } catch {
      // Se ignora: la demo sigue funcionando sin persistencia.
    }
  }, [estado])

  const iniciarSesion = useCallback(() => {
    setEstado((e) => ({ ...e, usuario: { nombre: 'Invitado TrustTix', correo: 'invitado@trusttix.app' } }))
  }, [])

  const cerrarSesion = useCallback(() => {
    setEstado((e) => ({ ...e, usuario: null, billetera: null }))
  }, [])

  const conectarBilletera = useCallback(async () => {
    await esperar(600)
    setEstado((e) => ({ ...e, billetera: BILLETERA_DEMO }))
  }, [])

  const desconectarBilletera = useCallback(() => {
    setEstado((e) => ({ ...e, billetera: null }))
  }, [])

  const reiniciarDemo = useCallback(() => {
    setEstado((e) => ({ ...estadoInicial(), usuario: e.usuario }))
  }, [])

  // comprar: cobra y emite el boleto en una sola operación. Falla si no hay lugares.
  const comprar = useCallback(
    async (eventoId) => {
      await esperar(1200)
      const evento = estado.eventos.find((ev) => ev.id === eventoId)
      if (!estado.billetera) throw new Error('Conecta tu billetera para comprar.')
      if (!evento || evento.vendidos >= evento.capacidad) {
        throw new Error('Ya no quedan lugares. La red rechazó la compra y no se cobró nada.')
      }
      let id
      do {
        id = `TTX-${String(Math.floor(Math.random() * 1e6)).padStart(6, '0')}`
      } while (estado.boletos.some((b) => b.id === id))
      const boleto = {
        id,
        eventoId,
        dueno: estado.billetera,
        estado: 'valido',
        historial: [{ tipo: 'compra', a: estado.billetera, fecha: new Date().toISOString() }],
      }
      setEstado((e) => ({
        ...e,
        eventos: e.eventos.map((ev) => (ev.id === eventoId ? { ...ev, vendidos: ev.vendidos + 1 } : ev)),
        boletos: [...e.boletos, boleto],
      }))
      return boleto
    },
    [estado.billetera, estado.eventos, estado.boletos],
  )

  // transferir: solo el dueño, y solo si el boleto no se ha usado.
  const transferir = useCallback(
    async (boletoId, destino) => {
      await esperar(1000)
      const boleto = estado.boletos.find((b) => b.id === boletoId)
      if (!boleto) throw new Error('El boleto no existe.')
      if (boleto.dueno !== estado.billetera) throw new Error('Solo el dueño actual puede transferir este boleto.')
      if (boleto.estado === 'usado') throw new Error('Un boleto usado ya no se puede transferir.')
      if (destino === estado.billetera) throw new Error('No puedes transferirte el boleto a ti mismo.')
      setEstado((e) => ({
        ...e,
        boletos: e.boletos.map((b) =>
          b.id === boletoId
            ? { ...b, dueno: destino, historial: [...b.historial, { tipo: 'transferencia', a: destino, fecha: new Date().toISOString() }] }
            : b,
        ),
      }))
    },
    [estado.billetera, estado.boletos],
  )

  // consultar_boleto: lectura pública, no requiere billetera.
  const consultarBoleto = useCallback(
    (boletoId) => {
      const id = boletoId.trim().toUpperCase().replace(/^TRUSTTIX:/, '')
      const boleto = estado.boletos.find((b) => b.id === id)
      if (!boleto) return null
      return { boleto, evento: estado.eventos.find((ev) => ev.id === boleto.eventoId) }
    },
    [estado.boletos, estado.eventos],
  )

  // registrar_entrada: marca el boleto como usado. Un segundo intento se rechaza.
  const registrarEntrada = useCallback(
    async (boletoId) => {
      await esperar(800)
      const boleto = estado.boletos.find((b) => b.id === boletoId)
      if (!boleto) throw new Error('El boleto no existe.')
      if (boleto.estado === 'usado') throw new Error('Este boleto ya fue utilizado.')
      const ahora = new Date().toISOString()
      setEstado((e) => ({
        ...e,
        boletos: e.boletos.map((b) =>
          b.id === boletoId
            ? { ...b, estado: 'usado', usadoEn: ahora, historial: [...b.historial, { tipo: 'entrada', fecha: ahora }] }
            : b,
        ),
      }))
    },
    [estado.boletos],
  )

  // crear_evento: la capacidad queda fija desde el inicio.
  const crearEvento = useCallback(
    async (datos) => {
      await esperar(1000)
      const id = `${datos.titulo.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`
      const evento = {
        ...datos,
        id,
        vendidos: 0,
        organizador: estado.usuario?.nombre ?? 'Organizador',
        organizadorCuenta: estado.billetera,
        portada: {
          fondo: 'linear-gradient(135deg, #3a3a3c 0%, #1c1c1e 100%)',
          texto: datos.titulo.toUpperCase(),
          estilo: 'nuevo',
        },
      }
      setEstado((e) => ({ ...e, eventos: [evento, ...e.eventos] }))
      return evento
    },
    [estado.usuario, estado.billetera],
  )

  const valor = useMemo(
    () => ({
      ...estado,
      misBoletos: estado.billetera ? estado.boletos.filter((b) => b.dueno === estado.billetera) : [],
      iniciarSesion,
      cerrarSesion,
      conectarBilletera,
      desconectarBilletera,
      reiniciarDemo,
      comprar,
      transferir,
      consultarBoleto,
      registrarEntrada,
      crearEvento,
    }),
    [estado, iniciarSesion, cerrarSesion, conectarBilletera, desconectarBilletera, reiniciarDemo, comprar, transferir, consultarBoleto, registrarEntrada, crearEvento],
  )

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
