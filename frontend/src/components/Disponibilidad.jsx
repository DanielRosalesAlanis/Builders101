import { numero } from '../utils/formato'

// Barra de lugares vendidos frente a la capacidad que fija el contrato.
export default function Disponibilidad({ evento, detallada = false }) {
  const { vendidos, capacidad } = evento
  const quedan = capacidad - vendidos
  const porcentaje = Math.min(100, (vendidos / capacidad) * 100)

  return (
    <div className={`disponibilidad ${detallada ? 'disponibilidad--detallada' : ''}`}>
      <div
        className="disponibilidad__barra"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={capacidad}
        aria-valuenow={vendidos}
        aria-label="Lugares vendidos"
      >
        <span style={{ width: `${porcentaje}%` }} />
      </div>
      <span className="disponibilidad__texto">
        {detallada
          ? `Vendidos ${numero(vendidos)} de ${numero(capacidad)}`
          : `${numero(vendidos)} de ${numero(capacidad)} lugares`}
      </span>
      {detallada && quedan > 0 && <span className="disponibilidad__quedan">Quedan {numero(quedan)}</span>}
    </div>
  )
}

// Pocos lugares: menos de 20 o menos del 2 % de la capacidad.
export function quedanPocos(evento) {
  const quedan = evento.capacidad - evento.vendidos
  return quedan > 0 && quedan <= Math.max(20, evento.capacidad * 0.02) ? quedan : 0
}
