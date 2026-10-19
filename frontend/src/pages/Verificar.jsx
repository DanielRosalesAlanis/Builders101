import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useBoleto } from '../hooks/useBoleto'
import Encabezado from '../components/Encabezado'
import { IconoBuscar, IconoCheck, IconoExterno, IconoX } from '../components/Iconos'
import { enlaceContrato, enlaceCuenta } from '../stellar/config'
import { abreviar, fechaCorta, fechaHora, folio, leerFolio } from '../utils/formato'

// Verificación pública: no requiere sesión ni billetera. Lee el contrato.
export default function Verificar() {
  const { billetera, usuario } = useApp()
  const [params, setParams] = useSearchParams()
  const consulta = params.get('id')
  const [texto, setTexto] = useState(consulta ?? '')
  const idBoleto = consulta ? leerFolio(consulta) : null
  const { cargando, datos, error } = useBoleto(idBoleto)

  const buscar = (e) => {
    e.preventDefault()
    const id = leerFolio(texto)
    if (id) setParams({ id: folio(id) })
  }

  const ejemplos = [1, 2, 3].map(folio)

  return (
    <>
      <Encabezado titulo="Verificar" billetera={Boolean(usuario)} />
      <p className="introduccion">
        ¿Vas a comprar un boleto en reventa? Antes de pagar, confirma en la red quién es el dueño y si ya fue usado.
      </p>

      <form className="buscador buscador--grande" onSubmit={buscar}>
        <label className="sr-only" htmlFor="folio">Número de boleto</label>
        <input
          id="folio"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Número de boleto, ej. TTX-000001"
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

      {idBoleto && cargando && <p className="vacio">Consultando el contrato en Stellar…</p>}

      {idBoleto && !cargando && error && <p className="alerta alerta--error">{error}</p>}

      {idBoleto && !cargando && !error && !datos && (
        <div className="resultado resultado--invalido">
          <span className="resultado__icono"><IconoX width={40} height={40} /></span>
          <h2>Boleto inexistente</h2>
          <p>No hay ningún boleto {folio(idBoleto)} en el registro. No lo compres.</p>
        </div>
      )}

      {datos && !cargando && (
        <div className={`resultado resultado--${datos.boleto.estado === 'usado' ? 'invalido' : 'valido'}`}>
          <span className="resultado__icono">
            {datos.boleto.estado === 'usado' ? <IconoX width={40} height={40} /> : <IconoCheck width={40} height={40} />}
          </span>
          <h2>{datos.boleto.estado === 'usado' ? 'Boleto ya utilizado' : 'Boleto válido'}</h2>
          <dl className="resumen">
            <div><dt>Boleto</dt><dd className="mono">{folio(datos.boleto.id)}</dd></div>
            <div><dt>Evento</dt><dd>{datos.evento.titulo}</dd></div>
            <div><dt>Fecha</dt><dd>{fechaCorta(datos.evento)}</dd></div>
            <div>
              <dt>Dueño actual</dt>
              <dd className="mono">
                {datos.boleto.dueno === billetera ? (
                  'Tú'
                ) : (
                  <a href={enlaceCuenta(datos.boleto.dueno)} target="_blank" rel="noreferrer">{abreviar(datos.boleto.dueno)}</a>
                )}
              </dd>
            </div>
            {datos.boleto.usadoEn && <div><dt>Entró</dt><dd>{fechaHora(datos.boleto.usadoEn)}</dd></div>}
          </dl>
          <p className="nota">
            {datos.boleto.estado === 'usado'
              ? 'Este boleto ya entró al evento. No puede volver a usarse.'
              : 'Si compras en reventa, pide que te lo transfieran a tu cuenta y vuelve a verificar: el dueño debe cambiar a tu dirección.'}
          </p>
          <a className="enlace enlace--externo" href={enlaceContrato()} target="_blank" rel="noreferrer">
            Dato leído del contrato TrustTix en Stellar Testnet <IconoExterno width={12} height={12} />
          </a>
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
