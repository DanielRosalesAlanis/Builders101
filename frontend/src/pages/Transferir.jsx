import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { OTRAS_CUENTAS } from '../data/eventos'
import Encabezado from '../components/Encabezado'
import { IconoCheck } from '../components/Iconos'
import { abreviar, direccionValida } from '../utils/formato'

export default function Transferir() {
  const { id } = useParams()
  const { boletos, eventos, billetera, transferir } = useApp()
  const [destino, setDestino] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [hecho, setHecho] = useState(false)

  const boleto = boletos.find((b) => b.id === id)
  const evento = boleto && eventos.find((ev) => ev.id === boleto.eventoId)

  if (!boleto || !evento) {
    return (
      <>
        <Encabezado titulo="Transferir" atras />
        <p className="vacio">No encontramos este boleto.</p>
      </>
    )
  }

  if (hecho) {
    return (
      <>
        <Encabezado titulo="Transferir" />
        <div className="resultado resultado--valido">
          <span className="resultado__icono"><IconoCheck width={40} height={40} /></span>
          <h2>Boleto transferido</h2>
          <p>
            {boleto.id} ahora pertenece a <span className="mono">{abreviar(destino)}</span>. Ya no aparece en tu cuenta.
          </p>
          <Link to="/boletos" className="boton boton--claro">Ir a mis boletos</Link>
        </div>
      </>
    )
  }

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    const limpio = destino.trim()
    if (!direccionValida(limpio)) {
      setError('La dirección debe empezar con G y tener 56 caracteres.')
      return
    }
    setEnviando(true)
    try {
      await transferir(boleto.id, limpio)
      setHecho(true)
    } catch (err) {
      setError(err.message)
      setEnviando(false)
    }
  }

  const puede = boleto.dueno === billetera && boleto.estado !== 'usado'

  return (
    <>
      <Encabezado titulo="Transferir" atras />
      <form className="formulario tarjeta" onSubmit={enviar}>
        <p className="formulario__contexto">
          <strong>{evento.titulo}</strong>
          <span className="mono">{boleto.id}</span>
        </p>

        {!puede && (
          <p className="alerta alerta--error" role="alert">
            {boleto.estado === 'usado' ? 'Un boleto usado ya no se puede transferir.' : 'Solo el dueño actual puede transferir este boleto.'}
          </p>
        )}

        <label className="campo">
          <span>Dirección Stellar de quien recibe</span>
          <input
            value={destino}
            onChange={(e) => setDestino(e.target.value.toUpperCase())}
            placeholder="G..."
            autoComplete="off"
            spellCheck="false"
            className="mono"
            disabled={!puede}
          />
        </label>
        <button type="button" className="enlace" onClick={() => setDestino(OTRAS_CUENTAS[0])} disabled={!puede}>
          Usar una cuenta de ejemplo
        </button>

        <p className="nota">
          Al transferir, el boleto sale de tu cuenta y pasa a la otra persona en el mismo registro. Nunca existen dos dueños al mismo tiempo.
        </p>

        {error && <p className="alerta alerta--error" role="alert">{error}</p>}

        <button type="submit" className="boton boton--claro boton--bloque" disabled={!puede || enviando}>
          {enviando ? 'Firmando…' : 'Firmar y transferir'}
        </button>
      </form>
    </>
  )
}
