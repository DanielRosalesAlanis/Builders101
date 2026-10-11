import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Encabezado from '../components/Encabezado'
import { IconoCheck, IconoX } from '../components/Iconos'
import { abreviar, fechaHora } from '../utils/formato'

// Escáner de la puerta. En esta entrega el escaneo se simula escribiendo o
// eligiendo el número de boleto; la lectura con cámara llega con el contrato.
export default function Escaner() {
  const { eventoId } = useParams()
  const { eventos, boletos, consultarBoleto, registrarEntrada } = useApp()
  const [codigo, setCodigo] = useState('')
  const [lectura, setLectura] = useState(null)
  const [registrando, setRegistrando] = useState(false)
  const [registrado, setRegistrado] = useState(false)

  const evento = eventos.find((ev) => ev.id === eventoId)
  if (!evento) {
    return (
      <>
        <Encabezado titulo="Escáner" atras billetera={false} />
        <p className="vacio">Evento no encontrado. <Link to="/acceso">Elegir otro</Link></p>
      </>
    )
  }

  const deEsteEvento = boletos.filter((b) => b.eventoId === evento.id)

  const escanear = (valor) => {
    const id = valor.trim().toUpperCase()
    if (!id) return
    setCodigo(id)
    setRegistrado(false)
    const r = consultarBoleto(id)
    if (!r) setLectura({ tipo: 'inexistente', id })
    else if (r.evento.id !== evento.id) setLectura({ tipo: 'otro', id, evento: r.evento })
    else if (r.boleto.estado === 'usado') setLectura({ tipo: 'usado', id, boleto: r.boleto })
    else setLectura({ tipo: 'valido', id, boleto: r.boleto })
  }

  const entrar = async () => {
    setRegistrando(true)
    try {
      await registrarEntrada(lectura.id)
      setRegistrado(true)
    } catch (e) {
      setLectura({ tipo: 'usado', id: lectura.id, boleto: consultarBoleto(lectura.id)?.boleto, error: e.message })
    }
    setRegistrando(false)
  }

  const valido = lectura?.tipo === 'valido'

  return (
    <>
      <Encabezado titulo="Escáner" atras billetera={false} />
      <p className="introduccion"><strong>{evento.titulo}</strong> · {evento.recinto}</p>

      <div className="escaner">
        <div className="escaner__visor" aria-hidden="true">
          <span className="escaner__linea" />
        </div>
        <form
          className="buscador"
          onSubmit={(e) => {
            e.preventDefault()
            escanear(codigo)
          }}
        >
          <label className="sr-only" htmlFor="codigo">Código del boleto</label>
          <input id="codigo" className="mono" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="TTX-000000" autoComplete="off" />
          <button type="submit" className="boton boton--claro boton--chico">Escanear</button>
        </form>
        {deEsteEvento.length > 0 && (
          <div className="ejemplos">
            <span>Simular QR:</span>
            {deEsteEvento.map((b) => (
              <button key={b.id} type="button" className="chip chip--chico" onClick={() => escanear(b.id)}>
                {b.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {lectura && (
        <div className={`resultado resultado--${valido ? 'valido' : 'invalido'}`} role="status">
          <span className="resultado__icono">{valido ? <IconoCheck width={44} height={44} /> : <IconoX width={44} height={44} />}</span>
          {lectura.tipo === 'valido' && !registrado && (
            <>
              <h2>Boleto válido</h2>
              <p>Dueño: <span className="mono">{abreviar(lectura.boleto.dueno)}</span></p>
              <button type="button" className="boton boton--claro boton--bloque" onClick={entrar} disabled={registrando}>
                {registrando ? 'Registrando…' : 'Registrar entrada'}
              </button>
            </>
          )}
          {lectura.tipo === 'valido' && registrado && (
            <>
              <h2>Entrada registrada</h2>
              <p>{lectura.id} quedó marcado como usado. Si se vuelve a escanear, será rechazado.</p>
            </>
          )}
          {lectura.tipo === 'usado' && (
            <>
              <h2>Ya utilizado</h2>
              <p>{lectura.id} ya entró al evento. No permitir el acceso.</p>
              {lectura.boleto?.usadoEn && <p className="nota">Entrada registrada: {fechaHora(lectura.boleto.usadoEn)}</p>}
            </>
          )}
          {lectura.tipo === 'otro' && (
            <>
              <h2>Boleto de otro evento</h2>
              <p>{lectura.id} es para {lectura.evento.titulo}.</p>
            </>
          )}
          {lectura.tipo === 'inexistente' && (
            <>
              <h2>Boleto inexistente</h2>
              <p>{lectura.id} no está en el registro. Puede ser una copia o un boleto falso.</p>
            </>
          )}
        </div>
      )}
    </>
  )
}
