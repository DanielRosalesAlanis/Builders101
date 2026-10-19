import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Encabezado from '../components/Encabezado'
import Disponibilidad from '../components/Disponibilidad'
import BotonBilletera from '../components/BotonBilletera'
import { IconoMas } from '../components/Iconos'
import { fechaCorta } from '../utils/formato'

export default function Organizador() {
  const { eventos, billetera } = useApp()
  const mios = eventos.filter((ev) => billetera && ev.organizador === billetera)

  return (
    <>
      <Encabezado titulo="Mis eventos" atras />

      {!billetera ? (
        <div className="vacio vacio--caja">
          <p>Conecta la billetera con la que organizas tus eventos.</p>
          <BotonBilletera grande />
        </div>
      ) : (
        <>
          <Link to="/organizador/crear" className="boton boton--claro boton--bloque">
            <IconoMas width={18} height={18} /> Crear evento
          </Link>

          {mios.length === 0 ? (
            <p className="vacio">Aún no has creado eventos con esta cuenta. La capacidad que definas quedará fija en el contrato.</p>
          ) : (
            <ul className="lista">
              {mios.map((ev) => (
                <li key={ev.id} className="tarjeta lista__item">
                  <Link to={`/eventos/${ev.id}`} className="lista__titulo">{ev.titulo}</Link>
                  <p className="nota">{ev.recinto} · {fechaCorta(ev)}</p>
                  <Disponibilidad evento={ev} detallada />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}
