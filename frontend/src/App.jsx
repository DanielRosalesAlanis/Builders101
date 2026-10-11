import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Navegacion from './components/Navegacion'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import DetalleEvento from './pages/DetalleEvento'
import MisBoletos from './pages/MisBoletos'
import DetalleBoleto from './pages/DetalleBoleto'
import Transferir from './pages/Transferir'
import Verificar from './pages/Verificar'
import Perfil from './pages/Perfil'
import Organizador from './pages/Organizador'
import CrearEvento from './pages/CrearEvento'
import Acceso from './pages/Acceso'
import Escaner from './pages/Escaner'

function Plantilla() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <div className="plantilla">
      <Navegacion />
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  )
}

function ConSesion({ children }) {
  const { usuario } = useApp()
  const location = useLocation()
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Plantilla />}>
        {/* La verificación es pública: cualquiera puede consultar un boleto. */}
        <Route path="/verificar" element={<Verificar />} />
        <Route path="/inicio" element={<ConSesion><Inicio /></ConSesion>} />
        <Route path="/eventos/:id" element={<ConSesion><DetalleEvento /></ConSesion>} />
        <Route path="/boletos" element={<ConSesion><MisBoletos /></ConSesion>} />
        <Route path="/boletos/:id" element={<ConSesion><DetalleBoleto /></ConSesion>} />
        <Route path="/boletos/:id/transferir" element={<ConSesion><Transferir /></ConSesion>} />
        <Route path="/perfil" element={<ConSesion><Perfil /></ConSesion>} />
        <Route path="/organizador" element={<ConSesion><Organizador /></ConSesion>} />
        <Route path="/organizador/crear" element={<ConSesion><CrearEvento /></ConSesion>} />
        <Route path="/acceso" element={<ConSesion><Acceso /></ConSesion>} />
        <Route path="/acceso/:eventoId" element={<ConSesion><Escaner /></ConSesion>} />
      </Route>
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}
