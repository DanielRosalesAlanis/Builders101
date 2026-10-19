import { useApp } from '../context/AppContext'
import { enlaceContrato, enlaceTx } from '../stellar/config'
import { fechaHora } from '../utils/formato'
import { IconoExterno } from './Iconos'

const TEXTO = {
  compra: 'Compra',
  transferencia: 'Transferencia',
  entrada: 'Entrada registrada',
}

// Movimientos del boleto hechos desde este navegador, cada uno con su
// transacción en el explorador público de Stellar.
export default function Historial({ boleto }) {
  const { registro } = useApp()
  const pasos = registro[boleto.id] ?? []

  return (
    <div className="historial-bloque">
      {pasos.length > 0 && (
        <ol className="historial">
          {pasos.map((h, i) => (
            <li key={i} className="historial__paso">
              <span className="historial__punto" aria-hidden="true" />
              <div>
                <strong>{TEXTO[h.tipo]}</strong>
                <small>{fechaHora(h.fecha)}</small>
                {h.hash && (
                  <a className="enlace enlace--externo" href={enlaceTx(h.hash)} target="_blank" rel="noreferrer">
                    Ver transacción <IconoExterno width={12} height={12} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      <a className="enlace enlace--externo" href={enlaceContrato()} target="_blank" rel="noreferrer">
        Ver el contrato TrustTix en stellar.expert <IconoExterno width={12} height={12} />
      </a>
    </div>
  )
}
