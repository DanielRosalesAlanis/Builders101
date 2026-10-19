import { contract } from '@stellar/stellar-sdk'
import { CONTRATO_ID, RED, RPC_URL } from './config'
import { firmar } from './billetera'

// Llamadas al contrato TrustTix. Las consultas se simulan contra la red
// (gratis, sin firma); las acciones se firman con Freighter y se envían.

const MENSAJES = {
  1: 'Ese evento no existe en la red.',
  2: 'Ese boleto no existe en la red.',
  3: 'Ya no quedan lugares. La red rechazó la compra y no se cobró nada.',
  4: 'Solo el dueño actual puede transferir este boleto.',
  5: 'Este boleto ya fue utilizado.',
  6: 'Tu cuenta no está autorizada para registrar entradas en este evento.',
  7: 'La capacidad debe ser mayor que cero.',
  8: 'El precio no puede ser negativo.',
  9: 'No puedes transferirte el boleto a ti mismo.',
}

let especificacion = null

async function cliente(direccion) {
  const opciones = {
    contractId: CONTRATO_ID,
    networkPassphrase: RED,
    rpcUrl: RPC_URL,
    publicKey: direccion ?? undefined,
    signTransaction: direccion ? firmar : undefined,
  }
  if (!especificacion) {
    const base = await contract.Client.from(opciones)
    especificacion = base.spec
    if (!direccion) return base
  }
  return new contract.Client(especificacion, opciones)
}

function traducir(error, tx) {
  const textos = [error?.message, String(error ?? ''), String(tx?.simulation?.error ?? '')]
  for (const t of textos) {
    const m = /Error\(Contract, #(\d+)\)/.exec(t)
    if (m && MENSAJES[m[1]]) return new Error(MENSAJES[m[1]])
  }
  if (/balance|underfunded|insufficient/i.test(textos.join(' '))) {
    return new Error('No tienes saldo suficiente en XLM para esta compra.')
  }
  if (/User declined|rejected|cancel/i.test(textos.join(' '))) {
    return new Error('Cancelaste la firma en Freighter.')
  }
  return error instanceof Error ? error : new Error(String(error))
}

// Convierte Ok/Err del SDK en un valor o en un error legible.
function valor(tx, resultado) {
  if (resultado && typeof resultado.isErr === 'function') {
    if (resultado.isErr()) throw traducir(null, tx)
    return resultado.unwrap()
  }
  return resultado
}

async function leer(metodo, args = {}) {
  const c = await cliente()
  let tx
  try {
    tx = await c[metodo](args)
    return valor(tx, tx.result)
  } catch (e) {
    throw traducir(e, tx)
  }
}

async function escribir(direccion, metodo, args) {
  const c = await cliente(direccion)
  let tx
  try {
    tx = await c[metodo](args)
    valor(tx, tx.result) // detecta errores del contrato antes de pedir la firma
    const enviada = await tx.signAndSend()
    const hash = enviada.sendTransactionResponse?.hash ?? enviada.getTransactionResponse?.txHash
    return { resultado: valor(tx, enviada.result), hash }
  } catch (e) {
    throw traducir(e, tx)
  }
}

// ---------- Consultas ----------

export const totalEventos = () => leer('total_eventos').then(Number)
export const totalBoletos = () => leer('total_boletos').then(Number)
export const consultarEvento = (id) => leer('consultar_evento', { evento_id: id })
export const consultarBoleto = (id) => leer('consultar_boleto', { boleto_id: id })
export const boletosDe = (cuenta) => leer('boletos_de', { cuenta }).then((l) => l.map(Number))
export const esPersonal = (eventoId, cuenta) => leer('es_personal', { evento_id: eventoId, cuenta })

// ---------- Acciones firmadas ----------

export const crearEvento = (organizador, { nombre, recinto, fecha, capacidad, precio }) =>
  escribir(organizador, 'crear_evento', { organizador, nombre, recinto, fecha, capacidad, precio })

export const comprar = (comprador, eventoId) =>
  escribir(comprador, 'comprar', { comprador, evento_id: eventoId })

export const transferir = (de, boletoId, a) =>
  escribir(de, 'transferir', { boleto_id: boletoId, de, a })

export const registrarEntrada = (personal, boletoId) =>
  escribir(personal, 'registrar_entrada', { boleto_id: boletoId, personal })

export const autorizarPersonal = (organizador, eventoId, cuenta) =>
  escribir(organizador, 'autorizar_personal', { evento_id: eventoId, cuenta })
