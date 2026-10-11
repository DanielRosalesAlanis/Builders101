import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Encabezado from '../components/Encabezado'
import TarjetaEvento from '../components/TarjetaEvento'
import BotonBilletera from '../components/BotonBilletera'

export default function MisBoletos() {
  const { billetera, misBoletos, eventos } = useApp()

  if (!billetera) {
    return (
      <>
        <Encabezado titulo="Mis boletos" billetera={false} />
        <div className="vacio vacio--caja">
          <p>Tus boletos viven en tu billetera. Conéctala para verlos.</p>
          <BotonBilletera grande />
        </div>
      </>
    )
  }

  return (
    <>
      <Encabezado titulo="Mis boletos" />
      {misBoletos.length === 0 ? (
        <div className="vacio vacio--caja">
          <p>Todavía no tienes boletos.</p>
          <Link to="/inicio" className="boton boton--claro">Explorar eventos</Link>
        </div>
      ) : (
        <div className="rejilla">
          {misBoletos.map((b) => (
            <TarjetaEvento key={b.id} evento={eventos.find((ev) => ev.id === b.eventoId)} boleto={b} />
          ))}
        </div>
      )}
    </>
  )
}
