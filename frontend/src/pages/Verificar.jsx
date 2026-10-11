import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Encabezado from '../components/Encabezado'
import Historial from '../components/Historial'
import { IconoBuscar, IconoCheck, IconoX } from '../components/Iconos'
import { abreviar, fechaCorta, fechaHora } from '../utils/formato'

// Verificación pública: no requiere sesión ni billetera.
export default function Verificar() {
  const { consultarBoleto, boletos, billetera, usuario } = useApp()
  const [params, setParams] = useSearchParams()
  const [texto, setTexto] = useState(params.get('id') ?? '')
  const consulta = params.get('id')
  const resultado = consulta ? consultarBoleto(consulta) : undefined

  const buscar = (e) => {
    e.preventDefault()
    if (texto.trim()) setParams({ id: texto.trim().toUpperCase() })
  }

  const ejemplos = boletos.slice(0, 3).map((b) => b.id)

  return (
    <>
      <Encabezado titulo="Verificar" billetera={Boolean(usuario)} />
      <p className="introduccion">
        ¿Vas a comprar un boleto en reventa? Antes de pagar, confirma quién es el dueño y si ya fue usado.
      </p>

      <form className="buscador buscador--grande" onSubmit={buscar}>
        <label className="sr-only" htmlFor="folio">Número de boleto</label>
        <input
          id="folio"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Número de boleto, ej. TTX-024990"
          autoComplete="off"
          className="mono"
        />
        <button type="submit" aria-label="Verificar"><IconoBuscar /></button>
      </form>
      <div className="ejemplos">
        <span>Prueba con:</span>
        {ejemplos.map((id) => (
          <button key={id} type="button" className="chip chip--chico" onClick={() => { setTexto(id); setParams({ id }) }}>
            {id}
          </button>
        ))}
      </div>

      {resultado === null && (
        <div className="resultado resultado--invalido">
          <span className="resultado__icono"><IconoX width={40} height={40} /></span>
          <h2>Boleto inexistente</h2>
          <p>No hay ningún boleto con el número {consulta} en el registro. No lo compres.</p>
        </div>
      )}

      {resultado && (
        <div className={`resultado resultado--${resultado.boleto.estado === 'usado' ? 'invalido' : 'valido'}`}>
          <span className="resultado__icono">
            {resultado.boleto.estado === 'usado' ? <IconoX width={40} height={40} /> : <IconoCheck width={40} height={40} />}
          </span>
          <h2>{resultado.boleto.estado === 'usado' ? 'Boleto ya utilizado' : 'Boleto válido'}</h2>
          <dl className="resumen">
            <div><dt>Evento</dt><dd>{resultado.evento.titulo}</dd></div>
            <div><dt>Fecha</dt><dd>{fechaCorta(resultado.evento)}</dd></div>
            <div>
              <dt>Dueño actual</dt>
              <dd className="mono">{resultado.boleto.dueno === billetera ? 'Tú' : abreviar(resultado.boleto.dueno)}</dd>
            </div>
            {resultado.boleto.usadoEn && <div><dt>Entró</dt><dd>{fechaHora(resultado.boleto.usadoEn)}</dd></div>}
          </dl>
          <p className="nota">
            {resultado.boleto.estado === 'usado'
              ? 'Este boleto ya entró al evento. No puede volver a usarse.'
              : 'Si compras en reventa, pide que te lo transfieran a tu cuenta y vuelve a verificar: el dueño debe cambiar a tu dirección.'}
          </p>
          <Historial boleto={resultado.boleto} />
        </div>
      )}

      {!usuario && (
        <p className="nota nota--centro">
          ¿Quieres comprar boletos? <Link to="/login">Inicia sesión</Link>
        </p>
      )}
    </>
  )
}
