import { useCallback, useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'

// Lee un boleto y su evento directamente del contrato.
export function useBoleto(id) {
  const { consultarBoleto } = useApp()
  const [estado, setEstado] = useState({ cargando: true, datos: null, error: '' })

  const recargar = useCallback(async () => {
    if (!id) {
      setEstado({ cargando: false, datos: null, error: '' })
      return
    }
    setEstado((e) => ({ ...e, cargando: true }))
    try {
      const datos = await consultarBoleto(id)
      setEstado({ cargando: false, datos, error: '' })
    } catch (e) {
      setEstado({ cargando: false, datos: null, error: e.message })
    }
  }, [id, consultarBoleto])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { ...estado, recargar }
}
