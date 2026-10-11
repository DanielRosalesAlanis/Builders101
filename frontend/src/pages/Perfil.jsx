import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Encabezado from '../components/Encabezado'
import BotonBilletera from '../components/BotonBilletera'
import { IconoCalendario, IconoEscaner } from '../components/Iconos'

export default function Perfil() {
  const { usuario, billetera, misBoletos, desconectarBilletera, cerrarSesion, reiniciarDemo } = useApp()
  const navigate = useNavigate()

  return (
    <>
      <Encabezado titulo="Perfil" billetera={false} />

      <section className="tarjeta perfil">
        <span className="perfil__avatar" aria-hidden="true">{usuario.nombre[0]}</span>
        <div>
          <h2 className="perfil__nombre">{usuario.nombre}</h2>
          <p className="nota">{usuario.correo}</p>
        </div>
      </section>

      <section className="tarjeta">
        <h3 className="tarjeta__titulo">Billetera</h3>
        {billetera ? (
          <>
            <p className="mono rompe">{billetera}</p>
            <p className="nota">Freighter · Stellar Testnet · {misBoletos.length} boleto(s)</p>
            <button type="button" className="boton boton--contorno" onClick={desconectarBilletera}>Desconectar</button>
          </>
        ) : (
          <>
            <p className="nota">Conecta tu billetera para comprar, ver y transferir boletos.</p>
            <BotonBilletera grande />
          </>
        )}
      </section>

      <section className="menu">
        <Link to="/organizador" className="menu__opcion">
          <IconoCalendario />
          <span><strong>Panel del organizador</strong><small>Crea eventos con capacidad protegida</small></span>
        </Link>
        <Link to="/acceso" className="menu__opcion">
          <IconoEscaner />
          <span><strong>App de acceso</strong><small>Escanea boletos en la puerta</small></span>
        </Link>
      </section>

      <div className="acciones acciones--columna">
        <button type="button" className="boton boton--contorno" onClick={reiniciarDemo}>Reiniciar datos de la demo</button>
        <button type="button" className="boton boton--peligro" onClick={() => { cerrarSesion(); navigate('/login') }}>
          Cerrar sesión
        </button>
      </div>
    </>
  )
}
