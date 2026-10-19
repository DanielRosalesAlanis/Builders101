import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import QrScanner from 'qr-scanner'
import { useApp } from '../context/AppContext'
import Encabezado from '../components/Encabezado'
import BotonBilletera from '../components/BotonBilletera'
import { IconoCheck, IconoEscaner, IconoExterno, IconoX } from '../components/Iconos'
import { enlaceTx } from '../stellar/config'
import { abreviar, fechaHora, folio, leerFolio } from '../utils/formato'

// Escáner de la puerta: lee el QR con la cámara (o el número escrito),
// consulta el boleto en el contrato y registra la entrada con una firma.
export default function Escaner() {
  const { eventoId } = useParams()
  const id = Number(eventoId)
  const { eventos, billetera, consultarBoleto, registrarEntrada, esPersonal, boletosDeEvento } = useApp()
  const [codigo, setCodigo] = useState('')
  const [lectura, setLectura] = useState(null)
  const [consultando, setConsultando] = useState(false)
  const [registrando, setRegistrando] = useState(false)
  const [autorizado, setAutorizado] = useState(null)
  const [ejemplos, setEjemplos] = useState([])
  const [camara, setCamara] = useState(false)
  const [errorCamara, setErrorCamara] = useState('')
  const video = useRef(null)
  const lector = useRef(null)
  const resultado = useRef(null)

  const evento = eventos.find((ev) => ev.id === id)

  // Al leer un boleto, el resultado se desplaza a la vista para que el personal lo vea sin deslizar.
  useEffect(() => {
    if (lectura) resultado.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [lectura])

  useEffect(() => {
    let vigente = true
    esPersonal(id).then((v) => vigente && setAutorizado(v)).catch(() => vigente && setAutorizado(false))
    boletosDeEvento(id).then((l) => vigente && setEjemplos(l.slice(-6))).catch(() => {})
    return () => {
      vigente = false
    }
  }, [id, esPersonal, boletosDeEvento])

  const escanear = useCallback(
    async (valor) => {
      const boletoId = leerFolio(valor)
      if (!boletoId) return
      setCodigo(folio(boletoId))
      setConsultando(true)
      setLectura(null)
      try {
        const r = await consultarBoleto(boletoId)
        if (!r) setLectura({ tipo: 'inexistente', id: boletoId })
        else if (r.evento.id !== id) setLectura({ tipo: 'otro', id: boletoId, evento: r.evento })
        else if (r.boleto.estado === 'usado') setLectura({ tipo: 'usado', id: boletoId, boleto: r.boleto })
        else setLectura({ tipo: 'valido', id: boletoId, boleto: r.boleto })
      } catch (e) {
        setLectura({ tipo: 'error', id: boletoId, mensaje: e.message })
      }
      setConsultando(false)
    },
    [consultarBoleto, id],
  )

  // Cámara: se enciende con el botón y se apaga al leer un código.
  useEffect(() => {
    if (!camara || !video.current) return undefined
    const escaner = new QrScanner(
      video.current,
      (resultado) => {
        setCamara(false)
        escanear(resultado.data)
      },
      { returnDetailedScanResult: true, preferredCamera: 'environment', highlightScanRegion: false, maxScansPerSecond: 8 },
    )
    lector.current = escaner
    escaner.start().catch((e) => {
      setErrorCamara(`No pudimos abrir la cámara: ${e?.message ?? e}`)
      setCamara(false)
    })
    return () => {
      escaner.stop()
      escaner.destroy()
      lector.current = null
    }
  }, [camara, escanear])

  const entrar = async () => {
    setRegistrando(true)
    try {
      const hash = await registrarEntrada(lectura.id)
      setLectura((l) => ({ ...l, tipo: 'registrado', hash }))
    } catch (e) {
      setLectura((l) => ({ ...l, tipo: /utilizado/.test(e.message) ? 'usado' : 'error', mensaje: e.message }))
    }
    setRegistrando(false)
  }

  if (!evento) {
    return (
      <>
        <Encabezado titulo="Escáner" atras billetera={false} />
        <p className="vacio">Leyendo el evento… <Link to="/acceso">Elegir otro</Link></p>
      </>
    )
  }

  const valido = lectura?.tipo === 'valido' || lectura?.tipo === 'registrado'

  return (
    <>
      <Encabezado titulo="Escáner" atras billetera={false} />
      <p className="introduccion"><strong>{evento.titulo}</strong> · {evento.recinto}</p>

      {!billetera && (
        <div className="vacio vacio--caja">
          <p>Conecta la billetera del personal para registrar entradas.</p>
          <BotonBilletera grande />
        </div>
      )}
      {billetera && autorizado === false && (
        <p className="alerta alerta--error">
          La cuenta <span className="mono">{abreviar(billetera)}</span> no está autorizada en este evento. Puedes revisar boletos, pero
          solo el organizador o su personal autorizado pueden registrar entradas.
        </p>
      )}
      {billetera && autorizado && <p className="alerta alerta--exito">Cuenta autorizada por el organizador para este evento.</p>}

      <div className="escaner">
        <div className={`escaner__visor ${camara ? 'escaner__visor--activo' : ''}`}>
          <video ref={video} className="escaner__video" muted playsInline />
          {!camara && <span className="escaner__linea" aria-hidden="true" />}
        </div>
        <button type="button" className="boton boton--contorno" onClick={() => { setErrorCamara(''); setCamara((c) => !c) }}>
          <IconoEscaner width={18} height={18} /> {camara ? 'Apagar cámara' : 'Escanear con la cámara'}
        </button>
        {errorCamara && <p className="alerta alerta--error">{errorCamara}</p>}

        <form
          className="buscador"
          onSubmit={(e) => {
            e.preventDefault()
            escanear(codigo)
          }}
        >
          <label className="sr-only" htmlFor="codigo">Código del boleto</label>
          <input id="codigo" className="mono" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="TTX-000000" autoComplete="off" />
          <button type="submit" className="boton boton--claro boton--chico" disabled={consultando}>
            {consultando ? 'Leyendo…' : 'Revisar'}
          </button>
        </form>
        {ejemplos.length > 0 && (
          <div className="ejemplos">
            <span>Boletos de este evento:</span>
            {ejemplos.map((b) => (
              <button key={b.id} type="button" className="chip chip--chico" onClick={() => escanear(String(b.id))}>
                {folio(b.id)}
              </button>
            ))}
          </div>
        )}
      </div>

      {lectura && (
        <div ref={resultado} className={`resultado resultado--${valido ? 'valido' : 'invalido'}`} role="status">
          <span className="resultado__icono">{valido ? <IconoCheck width={44} height={44} /> : <IconoX width={44} height={44} />}</span>
          {lectura.tipo === 'valido' && (
            <>
              <h2>Boleto válido</h2>
              <p>Dueño: <span className="mono">{abreviar(lectura.boleto.dueno)}</span></p>
              <button type="button" className="boton boton--claro boton--bloque" onClick={entrar} disabled={registrando || !autorizado}>
                {registrando ? 'Esperando a la red…' : 'Registrar entrada'}
              </button>
            </>
          )}
          {lectura.tipo === 'registrado' && (
            <>
              <h2>Entrada registrada</h2>
              <p>{folio(lectura.id)} quedó marcado como usado en el contrato. Si se vuelve a escanear, será rechazado.</p>
              <a className="enlace enlace--externo" href={enlaceTx(lectura.hash)} target="_blank" rel="noreferrer">
                Ver la transacción <IconoExterno width={12} height={12} />
              </a>
            </>
          )}
          {lectura.tipo === 'usado' && (
            <>
              <h2>Ya utilizado</h2>
              <p>{folio(lectura.id)} ya entró al evento. No permitir el acceso.</p>
              {lectura.boleto?.usadoEn && <p className="nota">Entrada registrada: {fechaHora(lectura.boleto.usadoEn)}</p>}
            </>
          )}
          {lectura.tipo === 'otro' && (
            <>
              <h2>Boleto de otro evento</h2>
              <p>{folio(lectura.id)} es para {lectura.evento.titulo}.</p>
            </>
          )}
          {lectura.tipo === 'inexistente' && (
            <>
              <h2>Boleto inexistente</h2>
              <p>{folio(lectura.id)} no está en el registro. Puede ser una copia o un boleto falso.</p>
            </>
          )}
          {lectura.tipo === 'error' && (
            <>
              <h2>No se pudo completar</h2>
              <p>{lectura.mensaje}</p>
            </>
          )}
        </div>
      )}
    </>
  )
}
