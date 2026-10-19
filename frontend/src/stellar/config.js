import { Networks } from '@stellar/stellar-sdk'

// Contrato TrustTix desplegado en Stellar Testnet.
export const CONTRATO_ID =
  import.meta.env.VITE_CONTRATO_ID ?? 'CDL3FPYBY7HDNFDCCJMUZ4OLWHXWX7AXZ3WWFFM7YYHKA3O3LDRGYK4R'

export const RPC_URL = import.meta.env.VITE_RPC_URL ?? 'https://soroban-testnet.stellar.org'
export const RED = Networks.TESTNET

// Unidad mínima de XLM: 1 XLM = 10,000,000 stroops.
export const STROOPS_POR_XLM = 10_000_000n

const EXPLORADOR = 'https://stellar.expert/explorer/testnet'
export const enlaceTx = (hash) => `${EXPLORADOR}/tx/${hash}`
export const enlaceCuenta = (direccion) => `${EXPLORADOR}/account/${direccion}`
export const enlaceContrato = () => `${EXPLORADOR}/contract/${CONTRATO_ID}`
