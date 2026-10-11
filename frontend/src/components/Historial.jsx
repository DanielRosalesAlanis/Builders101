import { useApp } from '../context/AppContext'
import { abreviar, fechaHora } from '../utils/formato'

const TEXTO = {
  compra: 'Compra',
  transferencia: 'Transferencia',
  entrada: 'Entrada registrada',
}

// Movimientos del boleto tal como quedarían en el registro de la red.
export default function Historial({ boleto }) {
  const { billetera } = useApp()
  return (
    <ol className="historial">
      {boleto.historial.map((h, i) => (
        <li key={i} className="historial__paso">
          <span className="historial__punto" aria-hidden="true" />
          <div>
            <strong>{TEXTO[h.tipo]}</strong>
            {h.a && <span className="mono"> a {h.a === billetera ? 'tu cuenta' : abreviar(h.a)}</span>}
            <small>{fechaHora(h.fecha)}</small>
          </div>
        </li>
      ))}
    </ol>
  )
}
