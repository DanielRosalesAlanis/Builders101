import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Encabezado from '../components/Encabezado'
import BotonBilletera from '../components/BotonBilletera'
import { abreviar, fechaCorta } from '../utils/formato'

// Inicio de la app de acceso: el personal elige el evento en el que trabaja.
export default function Acceso() {
  const { eventos, billetera } = useApp()

  return (
    <>
      <Encabezado titulo="Acceso" atras billetera={false} />
      {billetera ? (
        <p className="introduccion">
          Cuenta del personal: <span className="mono">{abreviar(billetera)}</span>. Elige el evento en el que estás trabajando.
          Solo podrás registrar entradas si el organizador autorizó esta cuenta en el contrato.
        </p>
      ) : (
        <div className="vacio vacio--caja">
          <p>Conecta la billetera del personal de acceso.</p>
          <BotonBilletera grande />
        </div>
      )}
      <ul className="lista">
        {eventos.map((ev) => (
          <li key={ev.id}>
            <Link to={`/acceso/${ev.id}`} className="tarjeta lista__item lista__item--enlace">
              <span className="lista__titulo">{ev.titulo}</span>
              <span className="nota">{ev.recinto} · {fechaCorta(ev)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
