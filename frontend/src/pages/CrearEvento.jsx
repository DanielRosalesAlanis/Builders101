import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CATEGORIAS } from '../data/eventos'
import Encabezado from '../components/Encabezado'
import BotonBilletera from '../components/BotonBilletera'
import { aStroops } from '../utils/formato'

const VACIO = {
  titulo: '',
  categoria: 'Conciertos',
  recinto: '',
  ciudad: 'Cuernavaca, Mor.',
  direccion: '',
  fecha: '',
  hora: '20:00',
  capacidad: '',
  precioXLM: '',
  descripcion: '',
}

export default function CrearEvento() {
  const { billetera, crearEvento } = useApp()
  const navigate = useNavigate()
  const [datos, setDatos] = useState(VACIO)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const cambiar = (campo) => (e) => setDatos((d) => ({ ...d, [campo]: e.target.value }))

  const enviar = async (e) => {
    e.preventDefault()
    const capacidad = Number(datos.capacidad)
    const precioXLM = Number(datos.precioXLM || 0)
    if (!Number.isInteger(capacidad) || capacidad < 1) {
      setError('La capacidad debe ser un número entero mayor que cero.')
      return
    }
    if (!(precioXLM >= 0)) {
      setError('El precio no puede ser negativo.')
      return
    }
    setError('')
    setEnviando(true)
    try {
      const { id } = await crearEvento({ ...datos, capacidad, precio: aStroops(precioXLM) })
      navigate(`/eventos/${id}`)
    } catch (err) {
      setError(err.message)
      setEnviando(false)
    }
  }

  return (
    <>
      <Encabezado titulo="Crear evento" atras />

      {!billetera ? (
        <div className="vacio vacio--caja">
          <p>El evento se registra con la cuenta de tu billetera, que será la única que pueda administrarlo.</p>
          <BotonBilletera grande />
        </div>
      ) : (
        <form className="formulario tarjeta" onSubmit={enviar}>
          <label className="campo">
            <span>Nombre del evento</span>
            <input required value={datos.titulo} onChange={cambiar('titulo')} placeholder="Ej. Noche de rock" />
          </label>
          <div className="campo-doble">
            <label className="campo">
              <span>Categoría</span>
              <select value={datos.categoria} onChange={cambiar('categoria')}>
                {CATEGORIAS.filter((c) => c !== 'Todos').map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="campo">
              <span>Ciudad</span>
              <input required value={datos.ciudad} onChange={cambiar('ciudad')} />
            </label>
          </div>
          <label className="campo">
            <span>Recinto</span>
            <input required value={datos.recinto} onChange={cambiar('recinto')} placeholder="Ej. Jardín Borda" />
          </label>
          <label className="campo">
            <span>Dirección</span>
            <input required value={datos.direccion} onChange={cambiar('direccion')} />
          </label>
          <div className="campo-doble">
            <label className="campo">
              <span>Fecha</span>
              <input required type="date" value={datos.fecha} onChange={cambiar('fecha')} />
            </label>
            <label className="campo">
              <span>Hora</span>
              <input required type="time" value={datos.hora} onChange={cambiar('hora')} />
            </label>
          </div>
          <div className="campo-doble">
            <label className="campo">
              <span>Capacidad máxima</span>
              <input required type="number" min="1" step="1" inputMode="numeric" value={datos.capacidad} onChange={cambiar('capacidad')} />
            </label>
            <label className="campo">
              <span>Precio en XLM (0 = gratis)</span>
              <input type="number" min="0" step="0.1" inputMode="decimal" value={datos.precioXLM} onChange={cambiar('precioXLM')} placeholder="0" />
            </label>
          </div>
          <label className="campo">
            <span>Descripción</span>
            <textarea rows={3} value={datos.descripcion} onChange={cambiar('descripcion')} />
          </label>

          <p className="sello">
            <span>
              <strong>La capacidad no se podrá aumentar después.</strong> El contrato rechazará cualquier venta por encima de ese número.
            </span>
          </p>

          {error && <p className="alerta alerta--error" role="alert">{error}</p>}

          <button type="submit" className="boton boton--claro boton--bloque" disabled={enviando}>
            {enviando ? 'Esperando a la red…' : 'Firmar y crear evento'}
          </button>
        </form>
      )}
    </>
  )
}
