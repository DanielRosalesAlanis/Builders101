import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIAS } from '../data/eventos'
import Encabezado from '../components/Encabezado'
import TarjetaEvento from '../components/TarjetaEvento'
import { IconoBuscar, IconoUbicacion } from '../components/Iconos'

const sinAcentos = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Inicio() {
  const { eventos } = useApp()
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todos')

  const visibles = useMemo(() => {
    const q = sinAcentos(busqueda.trim())
    return eventos.filter(
      (ev) =>
        (categoria === 'Todos' || ev.categoria === categoria) &&
        (!q || sinAcentos(`${ev.titulo} ${ev.recinto} ${ev.ciudad}`).includes(q)),
    )
  }, [eventos, busqueda, categoria])

  return (
    <>
      <Encabezado titulo="Inicio" />

      <section className="seccion">
        <h2 className="subtitulo">Principales eventos</h2>
        <p className="ubicacion">
          <IconoUbicacion width={14} height={14} /> Cuernavaca, Mor.
        </p>

        <label className="buscador">
          <span className="sr-only">Buscar eventos</span>
          <input
            type="search"
            placeholder="Buscar eventos"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <IconoBuscar />
        </label>

        <div className="chips" role="tablist" aria-label="Categorías">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={categoria === c}
              className={`chip ${categoria === c ? 'chip--activo' : ''}`}
              onClick={() => setCategoria(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {visibles.length > 0 ? (
        <div className="rejilla">
          {visibles.map((ev) => (
            <TarjetaEvento key={ev.id} evento={ev} />
          ))}
        </div>
      ) : (
        <p className="vacio">No encontramos eventos con esa búsqueda.</p>
      )}
    </>
  )
}
