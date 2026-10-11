// Banner del evento. Si el evento trae `imagen`, se usa la imagen; si no,
// se dibuja una portada con el degradado y el texto del evento.
// `pestana` agrega la pestaña oscura recortada que aparece en el diseño y
// `insignia` muestra una etiqueta en la esquina superior derecha.
export default function Portada({ evento, pestana = false, alta = false, insignia = null }) {
  const { portada, imagen, titulo } = evento
  return (
    <div className={`portada ${alta ? 'portada--alta' : ''} ${pestana ? 'portada--pestana' : ''}`}>
      {imagen ? (
        <img src={imagen} alt={titulo} className="portada__imagen" />
      ) : (
        <div
          className={`portada__arte portada__arte--${portada.estilo}`}
          style={{ background: portada.fondo, '--largo': Math.max(portada.texto.length, 6) }}
        >
          <span className="portada__texto">{portada.texto}</span>
        </div>
      )}
      {insignia && <span className="portada__insignia">{insignia}</span>}
      {pestana && <span className="portada__pestana" aria-hidden="true" />}
    </div>
  )
}
