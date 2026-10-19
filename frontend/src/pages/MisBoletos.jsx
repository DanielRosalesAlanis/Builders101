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

  const conEvento = misBoletos
    .map((b) => ({ boleto: b, evento: eventos.find((ev) => ev.id === b.eventoId) }))
    .filter((x) => x.evento)

  return (
    <>
      <Encabezado titulo="Mis boletos" />
      {conEvento.length === 0 ? (
        <div className="vacio vacio--caja">
          <p>Todavía no tienes boletos en esta cuenta.</p>
          <Link to="/inicio" className="boton boton--claro">Explorar eventos</Link>
        </div>
      ) : (
        <div className="rejilla">
          {conEvento.map(({ boleto, evento }) => (
            <TarjetaEvento key={boleto.id} evento={evento} boleto={boleto} />
          ))}
        </div>
      )}
    </>
  )
}
