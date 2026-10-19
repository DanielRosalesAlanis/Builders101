import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { fechaCorta, numero, precio } from '../utils/formato'
import Disponibilidad, { quedanPocos } from './Disponibilidad'
import Portada from './Portada'
import { IconoCalendario, IconoUbicacion } from './Iconos'

// Tarjeta de evento con estructura fija: título en una línea, recinto y fecha
// en una fila, barra de lugares y pie con precio y botón de ancho constante.
// Así todas las tarjetas se alinean sin importar cuánto texto tengan.
export default function TarjetaEvento({ evento, boleto }) {
  const { misBoletos } = useApp()
  const tengoBoleto = boleto ?? misBoletos.find((b) => b.eventoId === evento.id)
  const agotado = evento.vendidos >= evento.capacidad
  const pocos = quedanPocos(evento)

  let accion
  if (boleto) {
    accion = (
      <Link to={`/boletos/${boleto.id}`} className="boton boton--claro boton--tarjeta">
        {boleto.estado === 'usado' ? 'Ver registro' : 'Ver boleto'}
      </Link>
    )
  } else if (tengoBoleto) {
    accion = (
      <Link to={`/boletos/${tengoBoleto.id}`} className="boton boton--apagado boton--tarjeta">
        Asistiré
      </Link>
    )
  } else if (agotado) {
    accion = (
      <span className="boton boton--apagado boton--tarjeta" aria-disabled="true">
        Agotado
      </span>
    )
  } else {
    accion = (
      <Link to={`/eventos/${evento.id}`} className="boton boton--claro boton--tarjeta">
        Ver evento
      </Link>
    )
  }

  const insignia = !boleto && pocos ? `Quedan ${numero(pocos)}` : null

  return (
    <article className="tarjeta-evento">
      <Link to={`/eventos/${evento.id}`} className="tarjeta-evento__enlace" aria-label={`Ver ${evento.titulo}`}>
        <Portada evento={evento} pestana insignia={insignia} />
      </Link>
      <div className="tarjeta-evento__cuerpo">
        <h3 className="tarjeta-evento__titulo" title={evento.titulo}>
          <Link to={`/eventos/${evento.id}`}>{evento.titulo}</Link>
        </h3>
        <div className="tarjeta-evento__meta">
          <span className="meta" title={evento.recinto}>
            <IconoUbicacion width={13} height={13} />
            <span className="meta__texto">{evento.recinto}</span>
          </span>
          <span className="meta meta--fecha">
            <IconoCalendario width={13} height={13} />
            <span className="meta__texto">{fechaCorta(evento)}</span>
          </span>
        </div>
        <Disponibilidad evento={evento} />
        <div className="tarjeta-evento__pie">
          <span className="precio">
            {boleto ? (
              <span className={`estado estado--${boleto.estado}`}>{boleto.estado === 'usado' ? 'Usado' : 'Válido'}</span>
            ) : (
              precio(evento.precio)
            )}
          </span>
          {accion}
        </div>
      </div>
    </article>
  )
}
