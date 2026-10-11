import { useNavigate } from 'react-router-dom'
import Logo from './Logo'
import BotonBilletera from './BotonBilletera'
import { IconoAtras } from './Iconos'

// Encabezado de cada pantalla: logo (o flecha de regreso), título y billetera.
export default function Encabezado({ titulo, atras = false, billetera = true }) {
  const navigate = useNavigate()
  return (
    <header className="encabezado">
      {atras ? (
        <button type="button" className="encabezado__atras" onClick={() => navigate(-1)} aria-label="Regresar">
          <IconoAtras width={24} height={24} />
        </button>
      ) : (
        <Logo size={44} className="encabezado__logo" />
      )}
      <h1 className="encabezado__titulo">{titulo}</h1>
      {billetera && <BotonBilletera />}
    </header>
  )
}
