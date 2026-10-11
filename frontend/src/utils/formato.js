import { MXN_POR_USDC } from '../data/eventos'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MESES_LARGOS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function partes(iso) {
  const [a, m, d] = iso.split('-').map(Number)
  return { a, m: m - 1, d }
}

export function diaMes(iso) {
  const { m, d } = partes(iso)
  return { dia: d, mes: MESES[m] }
}

export function fechaCorta(evento) {
  const ini = partes(evento.fecha)
  if (evento.fechaFin) {
    const fin = partes(evento.fechaFin)
    return `${ini.d} a ${fin.d} ${MESES[fin.m]}`
  }
  return `${ini.d} ${MESES[ini.m]} · ${evento.hora} hrs`
}

export function fechaLarga(evento) {
  const ini = partes(evento.fecha)
  if (evento.fechaFin) {
    const fin = partes(evento.fechaFin)
    return `Del ${ini.d} al ${fin.d} de ${MESES_LARGOS[fin.m]} de ${fin.a}`
  }
  return `${ini.d} de ${MESES_LARGOS[ini.m]} de ${ini.a} · ${evento.hora} hrs`
}

export function fechaHora(isoDateTime) {
  const f = new Date(isoDateTime)
  return f.toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export const numero = (n) => n.toLocaleString('es-MX')

export function precio(mxn) {
  return mxn === 0 ? 'Gratis' : `$${numero(mxn)}`
}

export function usdc(mxn) {
  return (mxn / MXN_POR_USDC).toFixed(2)
}

export function abreviar(direccion) {
  if (!direccion) return ''
  return `${direccion.slice(0, 4)}…${direccion.slice(-4)}`
}

export function direccionValida(direccion) {
  return /^G[A-Z0-9]{55}$/.test(direccion.trim())
}
