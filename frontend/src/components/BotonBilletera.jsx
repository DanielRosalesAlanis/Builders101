import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { abreviar } from '../utils/formato'
import { IconoBilletera } from './Iconos'

// Botón de conexión con Freighter.
export default function BotonBilletera({ grande = false }) {
  const { billetera, conectarBilletera } = useApp()
  const [conectando, setConectando] = useState(false)
  const [error, setError] = useState('')

  if (billetera) {
    return (
      <span className={`billetera billetera--conectada ${grande ? 'billetera--grande' : ''}`} title={billetera}>
        <span className="billetera__punto" aria-hidden="true" />
        {abreviar(billetera)}
      </span>
    )
  }

  const conectar = async () => {
    setError('')
    setConectando(true)
    try {
      await conectarBilletera()
    } catch (e) {
      if (grande) setError(e.message)
      else window.alert(e.message)
    }
    setConectando(false)
  }

  const boton = (
    <button
      type="button"
      className={`billetera ${grande ? 'boton boton--claro boton--bloque' : ''}`}
      onClick={conectar}
      disabled={conectando}
    >
      <IconoBilletera width={16} height={16} />
      {conectando ? 'Conectando…' : grande ? 'Conectar billetera Freighter' : 'Conectar'}
    </button>
  )

  if (!grande) return boton
  return (
    <div className="billetera-bloque">
      {boton}
      {error && <p className="alerta alerta--error" role="alert">{error}</p>}
    </div>
  )
}
