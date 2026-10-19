import { Link, useLocation, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../context/AppContext'
import { useBoleto } from '../hooks/useBoleto'
import Encabezado from '../components/Encabezado'
import Portada from '../components/Portada'
import Historial from '../components/Historial'
import { IconoEnviar, IconoExterno, IconoUbicacion } from '../components/Iconos'
import { enlaceTx } from '../stellar/config'
import { abreviar, diaMes, fechaHora, folio } from '../utils/formato'

export default function DetalleBoleto() {
  const { id } = useParams()
  const { state } = useLocation()
  const { billetera } = useApp()
  const { cargando, datos, error } = useBoleto(Number(id))

  if (cargando && !datos) {
    return (
      <>
        <Encabezado titulo="Detalle del boleto" atras />
        <p className="vacio">Leyendo el boleto desde Stellar…</p>
      </>
    )
  }

  if (!datos) {
    return (
      <>
        <Encabezado titulo="Detalle del boleto" atras />
        <p className="vacio">{error || 'No encontramos este boleto en la red.'} <Link to="/boletos">Ir a mis boletos</Link></p>
      </>
    )
  }

  const { boleto, evento } = datos
  const esMio = boleto.dueno === billetera
  const usado = boleto.estado === 'usado'
  const { dia, mes } = diaMes(evento.fecha)

  return (
    <>
      <Encabezado titulo="Detalle del boleto" atras />

      {state?.recienComprado && (
        <p className="alerta alerta--exito" role="status">
          ¡Listo! Tu boleto quedó registrado a tu nombre en Stellar.{' '}
          {state.hash && (
            <a className="enlace enlace--externo" href={enlaceTx(state.hash)} target="_blank" rel="noreferrer">
              Ver la transacción <IconoExterno width={12} height={12} />
            </a>
          )}
        </p>
      )}
      {!esMio && (
        <p className="alerta" role="status">
          Este boleto no está en tu cuenta. Su dueño actual es <span className="mono">{abreviar(boleto.dueno)}</span>.
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
                <QRCodeSVG value={`TRUSTTIX:${folio(boleto.id)}`} size={176} level="M" marginSize={0} />
              ) : (
                <span className="boleto__sello">{usado ? 'USADO' : 'AJENO'}</span>
              )}
            </div>
            <p className="boleto__folio mono">{folio(boleto.id)}</p>
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
            <p className="nota">
              Muestra este QR en la entrada. El dueño y el estado se leen del contrato en Stellar Testnet, así que cualquiera puede
              comprobarlos.
            </p>
            <Historial boleto={boleto} />
          </section>
        </aside>
      </div>
    </>
  )
}
