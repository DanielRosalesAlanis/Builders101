import { Link, useLocation, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../context/AppContext'
import Encabezado from '../components/Encabezado'
import Portada from '../components/Portada'
import Historial from '../components/Historial'
import { IconoEnviar, IconoUbicacion } from '../components/Iconos'
import { abreviar, diaMes, fechaHora } from '../utils/formato'

export default function DetalleBoleto() {
  const { id } = useParams()
  const { state } = useLocation()
  const { boletos, eventos, billetera } = useApp()

  const boleto = boletos.find((b) => b.id === id)
  const evento = boleto && eventos.find((ev) => ev.id === boleto.eventoId)

  if (!boleto || !evento) {
    return (
      <>
        <Encabezado titulo="Detalle del boleto" atras />
        <p className="vacio">No encontramos este boleto. <Link to="/boletos">Ir a mis boletos</Link></p>
      </>
    )
  }

  const esMio = boleto.dueno === billetera
  const usado = boleto.estado === 'usado'
  const { dia, mes } = diaMes(evento.fecha)

  return (
    <>
      <Encabezado titulo="Detalle del boleto" atras />

      {state?.recienComprado && (
        <p className="alerta alerta--exito" role="status">
          ¡Listo! Tu boleto quedó registrado a tu nombre en la red.
        </p>
      )}
      {!esMio && (
        <p className="alerta" role="status">
          Este boleto ya no está en tu cuenta. Su dueño actual es <span className="mono">{abreviar(boleto.dueno)}</span>.
        </p>
      )}

      <div className="boleto-layout">
        <article className={`boleto ${usado ? 'boleto--usado' : ''}`}>
          <div className="boleto__arriba">
            <Portada evento={evento} />
            <h2 className="boleto__titulo">{evento.titulo}</h2>
            <p className="meta meta--grande">
              <IconoUbicacion width={16} height={16} /> {evento.recinto}
            </p>
          </div>

          <div className="boleto__corte" aria-hidden="true" />

          <div className="boleto__abajo">
            <div className="boleto__qr">
              {esMio && !usado ? (
                <QRCodeSVG value={`TRUSTTIX:${boleto.id}`} size={176} level="M" marginSize={0} />
              ) : (
                <span className="boleto__sello">{usado ? 'USADO' : 'TRANSFERIDO'}</span>
              )}
            </div>
            <p className="boleto__folio mono">{boleto.id}</p>
            <div className="boleto__pie">
              <div className="fecha-grande">
                <strong>{dia}</strong>
                <span>{mes} · {evento.hora}</span>
              </div>
              <span className={`estado estado--${boleto.estado}`}>
                {usado ? `Usado ${fechaHora(boleto.usadoEn)}` : 'Válido'}
              </span>
            </div>
          </div>
        </article>

        <aside className="boleto-lateral">
          <div className="acciones">
            {esMio && !usado && (
              <Link to={`/boletos/${boleto.id}/transferir`} className="boton boton--contorno">
                <IconoEnviar width={16} height={16} /> Transferir
              </Link>
            )}
            <Link to={`/eventos/${evento.id}`} className="boton boton--claro">Ver evento</Link>
          </div>

          <section className="tarjeta">
            <h3 className="tarjeta__titulo">Registro del boleto</h3>
            <p className="nota">Muestra este QR en la entrada. Cada boleto solo puede entrar una vez.</p>
            <Historial boleto={boleto} />
          </section>
        </aside>
      </div>
    </>
  )
}
