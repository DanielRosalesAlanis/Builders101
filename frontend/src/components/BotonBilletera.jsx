import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { abreviar } from '../utils/formato'
import { IconoBilletera } from './Iconos'

// Botón de conexión con Freighter (simulado en esta entrega).
export default function BotonBilletera({ grande = false }) {
  const { billetera, conectarBilletera } = useApp()
  const [conectando, setConectando] = useState(false)

  if (billetera) {
    return (
      <span className={`billetera billetera--conectada ${grande ? 'billetera--grande' : ''}`} title={billetera}>
        <span className="billetera__punto" aria-hidden="true" />
        {abreviar(billetera)}
      </span>
    )
  }

  const conectar = async () => {
    setConectando(true)
    await conectarBilletera()
    setConectando(false)
  }

  return (
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
}
