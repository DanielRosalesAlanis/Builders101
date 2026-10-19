import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Encabezado from '../components/Encabezado'
import Portada from '../components/Portada'
import Disponibilidad from '../components/Disponibilidad'
import BotonBilletera from '../components/BotonBilletera'
import Modal from '../components/Modal'
import { IconoCalendario, IconoEscudo, IconoUbicacion } from '../components/Iconos'
import { abreviar, diaMes, fechaLarga, numero, precio } from '../utils/formato'
import { enlaceCuenta } from '../stellar/config'

export default function DetalleEvento() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { eventos, billetera, misBoletos, comprar, cargando } = useApp()
  const [confirmando, setConfirmando] = useState(false)
  const [firmando, setFirmando] = useState(false)
  const [error, setError] = useState('')

  const evento = eventos.find((ev) => ev.id === Number(id))
  if (!evento && cargando) {
    return (
      <>
        <Encabezado titulo="Detalles" atras />
        <p className="vacio">Leyendo el evento desde Stellar…</p>
      </>
    )
  }
  if (!evento) {
    return (
      <>
        <Encabezado titulo="Detalles" atras />
        <p className="vacio">Este evento no existe. <Link to="/inicio">Volver al inicio</Link></p>
      </>
    )
  }

  const miBoleto = misBoletos.find((b) => b.eventoId === evento.id)
  const agotado = evento.vendidos >= evento.capacidad
  const { dia, mes } = diaMes(evento.fecha)
  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${evento.recinto}, ${evento.direccion}`)}`

  const confirmarCompra = async () => {
    setError('')
    setFirmando(true)
    try {
      const { boletoId, hash } = await comprar(evento.id)
      navigate(`/boletos/${boletoId}`, { state: { recienComprado: true, hash } })
    } catch (e) {
      setError(e.message)
      setFirmando(false)
    }
  }

  let accion
  if (miBoleto) {
    accion = <Link to={`/boletos/${miBoleto.id}`} className="boton boton--claro">Ver mi boleto</Link>
  } else if (agotado) {
    accion = <span className="boton boton--apagado" aria-disabled="true">Agotado</span>
  } else if (!billetera) {
    accion = <BotonBilletera grande />
  } else {
    accion = (
      <button type="button" className="boton boton--claro" onClick={() => setConfirmando(true)}>
        {evento.precio === 0n ? 'Obtener boleto' : 'Comprar boleto'}
      </button>
    )
  }

  return (
    <>
      <Encabezado titulo="Detalles" atras />

      <article className="detalle">
        <div className="detalle__columna">
          <div className="detalle__portada">
            <Portada evento={evento} alta />
          </div>

          <section className="detalle__bloque detalle__acerca">
            <h3 className="detalle__subtitulo">Acerca del evento</h3>
            <p className="detalle__descripcion">{evento.descripcion}</p>
          </section>

          <section className="detalle__bloque detalle__ubicacion">
            <h3 className="detalle__subtitulo">Ubicación</h3>
            <div className="detalle__lugar">
              <a href={mapa} target="_blank" rel="noreferrer" className="mapa" aria-label="Abrir en Google Maps">
                <span className="mapa__pin" aria-hidden="true" />
                <span className="mapa__etiqueta">{evento.recinto}</span>
              </a>
              <div>
                <p className="detalle__recinto">{evento.recinto}</p>
                <p className="detalle__direccion">{evento.direccion}</p>
                <a href={mapa} target="_blank" rel="noreferrer" className="enlace">Abrir en Google Maps</a>
              </div>
            </div>
          </section>
        </div>

        <div className="detalle__columna">
          <header className="detalle__cabecera">
            <span className="etiqueta-categoria">{evento.categoria}</span>
            <h2 className="detalle__titulo">{evento.titulo}</h2>
            <p className="meta meta--grande">
              <IconoUbicacion width={16} height={16} /> {evento.recinto} · {evento.ciudad}
            </p>
          </header>

          <dl className="datos detalle__bloque">
            <div>
              <dt><IconoCalendario width={14} height={14} /> Fecha</dt>
              <dd>{fechaLarga(evento)}</dd>
            </div>
            <div>
              <dt>Organiza</dt>
              <dd>
                {evento.organizadorNombre ?? <span className="mono">{abreviar(evento.organizador)}</span>}
                <a className="verificado" href={enlaceCuenta(evento.organizador)} target="_blank" rel="noreferrer" title="Cuenta del organizador registrada en el contrato">
                  <IconoEscudo width={13} height={13} /> Verificado
                </a>
              </dd>
            </div>
          </dl>

          <section className="detalle__bloque detalle__lugares">
            <h3 className="detalle__subtitulo">Lugares</h3>
            <Disponibilidad evento={evento} detallada />
            <p className="sello">
              <IconoEscudo width={18} height={18} />
              <span>
                <strong>Capacidad protegida.</strong> Este evento no puede vender más de {numero(evento.capacidad)} boletos:
                la regla está en el contrato, no en la boletera.
              </span>
            </p>
          </section>

          <div className="detalle__compra">
            <div className="fecha-grande">
              <strong>{dia}</strong>
              <span>{mes}</span>
            </div>
            <div className="precio precio--grande">
              {precio(evento.precio)}
              {evento.precio > 0n && <span className="precio__usdc">Se paga en XLM de Testnet</span>}
            </div>
            {accion}
          </div>
        </div>
      </article>

      {confirmando && (
        <Modal titulo="Confirma en tu billetera" onCerrar={() => !firmando && setConfirmando(false)}>
          <dl className="resumen">
            <div><dt>Evento</dt><dd>{evento.titulo}</dd></div>
            <div><dt>Boletos</dt><dd>1</dd></div>
            <div><dt>Total</dt><dd>{precio(evento.precio)}</dd></div>
            <div><dt>Desde</dt><dd className="mono">{abreviar(billetera)}</dd></div>
            <div><dt>Red</dt><dd>Stellar Testnet</dd></div>
          </dl>
          <p className="nota">
            Freighter te pedirá firmar. El pago y la emisión del boleto ocurren en una sola transacción: si una falla, la otra no sucede.
          </p>
          {error && <p className="alerta alerta--error" role="alert">{error}</p>}
          <div className="modal__acciones">
            <button type="button" className="boton boton--contorno" onClick={() => setConfirmando(false)} disabled={firmando}>
              Cancelar
            </button>
            <button type="button" className="boton boton--claro" onClick={confirmarCompra} disabled={firmando}>
              {firmando ? 'Esperando a la red…' : evento.precio === 0n ? 'Firmar' : 'Firmar y pagar'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
