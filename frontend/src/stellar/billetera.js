import {
  getAddress,
  getNetworkDetails,
  isAllowed,
  isConnected,
  requestAccess,
  signTransaction,
} from '@stellar/freighter-api'
import { RED } from './config'

// Conexión con la extensión Freighter.
//
// Modo grabación: cuando un navegador automatizado inyecta
// window.__TRUSTTIX_DEMO__, la app usa esa cuenta de prueba en lugar de
// Freighter. Solo sirve para grabar demos; las llaves nunca están en la app.
const demo = () => (typeof window !== 'undefined' ? window.__TRUSTTIX_DEMO__ : undefined)

export async function freighterInstalado() {
  try {
    const r = await isConnected()
    return Boolean(r.isConnected)
  } catch {
    return false
  }
}

async function revisarRed() {
  const red = await getNetworkDetails()
  if (red.error) throw new Error(red.error.message ?? 'No se pudo leer la red de Freighter.')
  if (red.networkPassphrase !== RED) {
    throw new Error('Freighter no está en Testnet. Cámbiala a "Test Net" en la configuración de la extensión.')
  }
}

// Pide permiso al usuario y devuelve su dirección.
export async function conectar() {
  if (demo()) return demo().cuenta()
  if (!(await freighterInstalado())) {
    throw new Error('No encontramos Freighter. Instala la extensión desde freighter.app y recarga la página.')
  }
  const r = await requestAccess()
  if (r.error || !r.address) throw new Error(r.error?.message ?? 'Freighter rechazó la conexión.')
  await revisarRed()
  return r.address
}

// Si el usuario ya dio permiso antes, recupera la dirección sin preguntar.
export async function reconectar() {
  try {
    if (demo()) return await demo().cuenta()
    if (!(await freighterInstalado())) return null
    const permitido = await isAllowed()
    if (!permitido.isAllowed) return null
    const r = await getAddress()
    return r.address || null
  } catch {
    return null
  }
}

// Firma usada por el cliente del contrato.
export async function firmar(xdr, opciones = {}) {
  if (demo()) {
    const cuenta = await demo().cuenta()
    return { signedTxXdr: await demo().firmar(xdr), signerAddress: cuenta }
  }
  const r = await signTransaction(xdr, { networkPassphrase: RED, address: opciones.address })
  if (r.error) throw new Error(r.error.message ?? 'Se canceló la firma en Freighter.')
  return { signedTxXdr: r.signedTxXdr, signerAddress: r.signerAddress }
}
