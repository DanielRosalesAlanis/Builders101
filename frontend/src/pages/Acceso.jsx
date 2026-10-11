import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CUENTA_ACCESO } from '../data/eventos'
import Encabezado from '../components/Encabezado'
import { abreviar, fechaCorta } from '../utils/formato'

// Inicio de la app de acceso: el personal elige el evento en el que trabaja.
export default function Acceso() {
  const { eventos } = useApp()

  return (
    <>
      <Encabezado titulo="Acceso" atras billetera={false} />
      <p className="introduccion">
        Cuenta de personal autorizada: <span className="mono">{abreviar(CUENTA_ACCESO)}</span>. Elige el evento en el que estás trabajando.
      </p>
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
