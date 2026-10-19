import { StrKey } from '@stellar/stellar-sdk'
import { STROOPS_POR_XLM } from '../stellar/config'

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

export function fechaHora(valor) {
  const f = typeof valor === 'number' ? new Date(valor * 1000) : new Date(valor)
  return f.toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export const numero = (n) => Number(n).toLocaleString('es-MX')

// Precio en stroops (BigInt) a texto en XLM.
export function xlm(stroops) {
  const v = BigInt(stroops)
  const enteros = v / STROOPS_POR_XLM
  const resto = v % STROOPS_POR_XLM
  if (resto === 0n) return numero(enteros)
  return (Number(v) / Number(STROOPS_POR_XLM)).toLocaleString('es-MX', { maximumFractionDigits: 7 })
}

export const precio = (stroops) => (BigInt(stroops) === 0n ? 'Gratis' : `${xlm(stroops)} XLM`)

export const aStroops = (xlmTexto) => BigInt(Math.round(Number(xlmTexto || 0) * 10_000_000))

export const folio = (id) => `TTX-${String(id).padStart(6, '0')}`

// Acepta "TTX-000012", "12" o el contenido del QR "TRUSTTIX:TTX-000012".
export function leerFolio(texto) {
  const m = /(\d+)\s*$/.exec(String(texto).trim())
  return m ? Number(m[1]) : null
}

export function abreviar(direccion) {
  if (!direccion) return ''
  return `${direccion.slice(0, 4)}…${direccion.slice(-4)}`
}

export const direccionValida = (direccion) => StrKey.isValidEd25519PublicKey(direccion.trim())
