import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Encabezado from '../components/Encabezado'
import BotonBilletera from '../components/BotonBilletera'
import { IconoCalendario, IconoEscaner, IconoExterno } from '../components/Iconos'
import { enlaceContrato, enlaceCuenta } from '../stellar/config'

export default function Perfil() {
  const { usuario, billetera, misBoletos, desconectarBilletera, cerrarSesion } = useApp()
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
            <a className="enlace enlace--externo" href={enlaceCuenta(billetera)} target="_blank" rel="noreferrer">
              Ver mi cuenta en stellar.expert <IconoExterno width={12} height={12} />
            </a>
            <button type="button" className="boton boton--contorno" onClick={desconectarBilletera}>Desconectar</button>
          </>
        ) : (
          <>
            <p className="nota">Conecta Freighter (en Testnet) para comprar, ver y transferir boletos.</p>
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
        <a href={enlaceContrato()} target="_blank" rel="noreferrer" className="menu__opcion">
          <IconoExterno />
          <span><strong>Contrato TrustTix</strong><small>Ver el contrato y sus transacciones en Testnet</small></span>
        </a>
      </section>

      <div className="acciones acciones--columna">
        <button type="button" className="boton boton--peligro" onClick={() => { cerrarSesion(); navigate('/login') }}>
          Cerrar sesión
        </button>
      </div>
    </>
  )
}
