import { NavLink } from 'react-router-dom'
import Logo from './Logo'
import { IconoBoleto, IconoEscudo, IconoInicio, IconoPerfil } from './Iconos'

const ENLACES = [
  { a: '/inicio', texto: 'Inicio', Icono: IconoInicio },
  { a: '/boletos', texto: 'Mis boletos', Icono: IconoBoleto },
  { a: '/verificar', texto: 'Verificar', Icono: IconoEscudo },
  { a: '/perfil', texto: 'Perfil', Icono: IconoPerfil },
]

// En celular es una barra inferior; en pantallas grandes se vuelve barra lateral.
export default function Navegacion() {
  return (
    <nav className="navegacion" aria-label="Principal">
      <div className="navegacion__marca">
        <Logo size={40} />
        <span>TrustTix</span>
      </div>
      {ENLACES.map(({ a, texto, Icono }) => (
        <NavLink key={a} to={a} className="navegacion__enlace">
          <Icono width={22} height={22} />
          <span>{texto}</span>
        </NavLink>
      ))}
    </nav>
  )
}
