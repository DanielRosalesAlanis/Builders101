import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Logo from '../components/Logo'
import { LogoGoogle } from '../components/Iconos'

export default function Login() {
  const { usuario, iniciarSesion } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.desde ?? '/inicio'

  if (usuario) return <Navigate to={destino} replace />

  const entrar = () => {
    iniciarSesion()
    navigate(destino, { replace: true })
  }

  return (
    <main className="login">
      <div className="login__marca">
        <Logo size={150} />
        <h1 className="login__lema">
          <strong>TU ACCESO</strong>
          <span>AL MUNDO</span>
        </h1>
      </div>
      <div className="login__acciones">
        <button type="button" className="boton boton--claro boton--bloque boton--google" onClick={entrar}>
          <LogoGoogle />
          Ingresa con Google
        </button>
        <p className="login__nota">Versión de demostración: el inicio de sesión es simulado.</p>
      </div>
    </main>
  )
}
