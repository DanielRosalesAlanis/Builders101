import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { metadatos, portadaGenerica } from '../data/eventos'
import * as red from '../stellar/contrato'
import { conectar, reconectar } from '../stellar/billetera'

// Estado de la app. Todo lo que define la validez de un boleto (eventos,
// capacidad, vendidos, dueños y entradas) se lee del contrato TrustTix en
// Testnet. En el navegador solo se guardan la sesión, los datos descriptivos
// de eventos creados aquí y los enlaces a las transacciones hechas desde aquí.

const CLAVE = 'trusttix-v5'
const AppContext = createContext(null)

function cargarLocal() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? {}
  } catch {
    return {}
  }
}

// Une lo que viene de la red con los datos descriptivos.
function armarEvento(id, enRed, metaLocal) {
  const meta = metadatos[id] ?? metaLocal[id] ?? {}
  const [fecha, hora = '00:00'] = enRed.fecha.split('T')
  return {
    id,
    titulo: enRed.nombre,
    recinto: enRed.recinto,
    fecha,
    hora,
    capacidad: Number(enRed.capacidad),
    vendidos: Number(enRed.vendidos),
    precio: BigInt(enRed.precio),
    organizador: enRed.organizador,
    categoria: meta.categoria ?? 'Eventos',
    ciudad: meta.ciudad ?? '',
    direccion: meta.direccion ?? enRed.recinto,
    descripcion: meta.descripcion ?? '',
    organizadorNombre: meta.organizadorNombre ?? null,
    fechaFin: meta.fechaFin,
    imagen: meta.imagen,
    portada: portadaGenerica(enRed.nombre),
  }
}

function armarBoleto(id, enRed) {
  return {
    id,
    eventoId: Number(enRed.evento),
    dueno: enRed.dueno,
    estado: enRed.usado ? 'usado' : 'valido',
    usadoEn: enRed.usado ? Number(enRed.usado_en) : null,
  }
}

export function AppProvider({ children }) {
  const inicial = cargarLocal()
  const [usuario, setUsuario] = useState(inicial.usuario ?? null)
  const [metaLocal, setMetaLocal] = useState(inicial.metaLocal ?? {})
  const [registro, setRegistro] = useState(inicial.registro ?? {})
  const [billetera, setBilletera] = useState(null)
  const [eventos, setEventos] = useState([])
  const [misBoletos, setMisBoletos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorRed, setErrorRed] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ usuario, metaLocal, registro }))
    } catch {
      // Sin almacenamiento: la app sigue funcionando, solo pierde la sesión.
    }
  }, [usuario, metaLocal, registro])

  const anotar = useCallback((boletoId, tipo, hash) => {
    setRegistro((r) => ({ ...r, [boletoId]: [...(r[boletoId] ?? []), { tipo, hash, fecha: new Date().toISOString() }] }))
  }, [])

  const recargarEventos = useCallback(async () => {
    try {
      const total = await red.totalEventos()
      const lista = await Promise.all(
        Array.from({ length: total }, (_, i) => i + 1).map(async (id) => armarEvento(id, await red.consultarEvento(id), metaLocal)),
      )
      setEventos(lista.reverse())
      setErrorRed('')
    } catch (e) {
      setErrorRed(`No pudimos leer la red de Stellar: ${e.message}`)
    } finally {
      setCargando(false)
    }
  }, [metaLocal])

  const recargarMisBoletos = useCallback(async (cuenta = billetera) => {
    if (!cuenta) {
      setMisBoletos([])
      return
    }
    const ids = await red.boletosDe(cuenta)
    const lista = await Promise.all(ids.map(async (id) => armarBoleto(id, await red.consultarBoleto(id))))
    setMisBoletos(lista.reverse())
  }, [billetera])

  useEffect(() => {
    recargarEventos()
  }, [recargarEventos])

  useEffect(() => {
    reconectar().then((cuenta) => cuenta && setBilletera(cuenta))
  }, [])

  useEffect(() => {
    recargarMisBoletos(billetera).catch(() => {})
  }, [billetera, recargarMisBoletos])

  const iniciarSesion = useCallback(() => {
    setUsuario({ nombre: 'Invitado TrustTix', correo: 'invitado@trusttix.app' })
  }, [])

  const cerrarSesion = useCallback(() => {
    setUsuario(null)
    setBilletera(null)
  }, [])

  const conectarBilletera = useCallback(async () => {
    const cuenta = await conectar()
    setBilletera(cuenta)
    return cuenta
  }, [])

  const desconectarBilletera = useCallback(() => setBilletera(null), [])

  // comprar: cobra en XLM y emite el boleto en una sola transacción.
  const comprar = useCallback(
    async (eventoId) => {
      if (!billetera) throw new Error('Conecta tu billetera para comprar.')
      const { resultado, hash } = await red.comprar(billetera, eventoId)
      const boletoId = Number(resultado)
      anotar(boletoId, 'compra', hash)
      await Promise.all([recargarEventos(), recargarMisBoletos()])
      return { boletoId, hash }
    },
    [billetera, anotar, recargarEventos, recargarMisBoletos],
  )

  const transferir = useCallback(
    async (boletoId, destino) => {
      if (!billetera) throw new Error('Conecta tu billetera.')
      const { hash } = await red.transferir(billetera, boletoId, destino)
      anotar(boletoId, 'transferencia', hash)
      await recargarMisBoletos()
      return hash
    },
    [billetera, anotar, recargarMisBoletos],
  )

  // consultar_boleto: lectura pública, no requiere billetera.
  const consultarBoleto = useCallback(
    async (boletoId) => {
      try {
        const boleto = armarBoleto(boletoId, await red.consultarBoleto(boletoId))
        const evento =
          eventos.find((ev) => ev.id === boleto.eventoId) ??
          armarEvento(boleto.eventoId, await red.consultarEvento(boleto.eventoId), metaLocal)
        return { boleto, evento }
      } catch (e) {
        if (/no existe/i.test(e.message)) return null
        throw e
      }
    },
    [eventos, metaLocal],
  )

  const registrarEntrada = useCallback(
    async (boletoId) => {
      if (!billetera) throw new Error('Conecta la billetera del personal de acceso.')
      const { hash } = await red.registrarEntrada(billetera, boletoId)
      anotar(boletoId, 'entrada', hash)
      return hash
    },
    [billetera, anotar],
  )

  const esPersonal = useCallback(
    (eventoId) => (billetera ? red.esPersonal(eventoId, billetera) : Promise.resolve(false)),
    [billetera],
  )

  // Boletos de un evento: recorre todos los emitidos (suficiente para el MVP).
  const boletosDeEvento = useCallback(async (eventoId) => {
    const total = await red.totalBoletos()
    const todos = await Promise.all(
      Array.from({ length: total }, (_, i) => i + 1).map(async (id) => armarBoleto(id, await red.consultarBoleto(id))),
    )
    return todos.filter((b) => b.eventoId === eventoId)
  }, [])

  const crearEvento = useCallback(
    async (datos) => {
      if (!billetera) throw new Error('Conecta tu billetera.')
      const { resultado, hash } = await red.crearEvento(billetera, {
        nombre: datos.titulo,
        recinto: datos.recinto,
        fecha: `${datos.fecha}T${datos.hora}`,
        capacidad: datos.capacidad,
        precio: datos.precio,
      })
      const id = Number(resultado)
      setMetaLocal((m) => ({
        ...m,
        [id]: { categoria: datos.categoria, ciudad: datos.ciudad, direccion: datos.direccion, descripcion: datos.descripcion },
      }))
      await recargarEventos()
      return { id, hash }
    },
    [billetera, recargarEventos],
  )

  const valor = useMemo(
    () => ({
      usuario,
      billetera,
      eventos,
      misBoletos,
      registro,
      cargando,
      errorRed,
      iniciarSesion,
      cerrarSesion,
      conectarBilletera,
      desconectarBilletera,
      recargarEventos,
      recargarMisBoletos,
      comprar,
      transferir,
      consultarBoleto,
      registrarEntrada,
      esPersonal,
      boletosDeEvento,
      crearEvento,
    }),
    [usuario, billetera, eventos, misBoletos, registro, cargando, errorRed, iniciarSesion, cerrarSesion, conectarBilletera, desconectarBilletera, recargarEventos, recargarMisBoletos, comprar, transferir, consultarBoleto, registrarEntrada, esPersonal, boletosDeEvento, crearEvento],
  )

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
