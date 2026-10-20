# MVP funcional

**Nombre del proyecto:** TrustTix

**Repositorio:** [Builders101](https://github.com/DanielRosalesAlanis/Builders101)

---

## Contenido

1. Evidencia verificable
2. Qué construimos esta semana
3. Aprendizajes y ajustes priorizados
4. Riesgos y pendientes
5. Plan de validación con usuarios

---

## 1. Evidencia verificable

Todo lo siguiente es público: cualquier persona puede abrirlo y comprobarlo.

| Qué | Enlace |
| --- | --- |
| **Producto en línea** | [trust-tix.vercel.app](https://trust-tix.vercel.app) |
| **Video del producto funcionando y pitch** | [TrustTix Pitch en YouTube](https://youtu.be/CMXeEDqdBbc) |
| **Reel del Challenge #4** | [Reel en Instagram](https://www.instagram.com/reel/DeqCfrTRxWp/) |
| **Contrato TrustTix en Stellar Testnet** | [CDL3FPYBY7HDNFDCCJMUZ4OLWHXWX7AXZ3WWFFM7YYHKA3O3LDRGYK4R](https://stellar.expert/explorer/testnet/contract/CDL3FPYBY7HDNFDCCJMUZ4OLWHXWX7AXZ3WWFFM7YYHKA3O3LDRGYK4R) |
| **Despliegue del contrato** | [Transacción de despliegue](https://stellar.expert/explorer/testnet/tx/59c37322141a38b4f37dc2ff91a84baf47656b201f5bac64df44d1e9b0b14bae) |
| **Código del contrato** | [`contracts/trusttix/src/lib.rs`](../../contracts/trusttix/src/lib.rs) y sus pruebas en [`test.rs`](../../contracts/trusttix/src/test.rs) |
| **Registro de transacciones de ejemplo** | [`contracts/scripts/transacciones.md`](../../contracts/scripts/transacciones.md) (47 enlaces: eventos creados, compras, transferencias y entradas) |

### Un recorrido completo, transacción por transacción

Es la misma historia que se ve en el video: un organizador crea un evento, Ana compra, le transfiere el boleto a Luis y Luis entra.

| Paso | Función del contrato | Transacción |
| --- | --- | --- |
| El organizador crea "Festival TrustTix" (50 lugares, 10 XLM) | `crear_evento` → evento 9 | [c9eb6d39…d3a39e](https://stellar.expert/explorer/testnet/tx/c9eb6d39be7296dc03b67440b30bc6297da8841727f3882c9e5273ce51d3a39e) |
| Ana compra un boleto: paga 10 XLM y recibe el boleto en la misma transacción | `comprar` → boleto 40 | [3ed05e41…880c2d](https://stellar.expert/explorer/testnet/tx/3ed05e41029ce1a39964c2e8a8b4a175b6158f99197c434e89f09f4d2e880c2d) |
| Ana le transfiere el boleto a Luis | `transferir` | [9e6fb3fc…6eeff9](https://stellar.expert/explorer/testnet/tx/9e6fb3fc752c40d9e49313eacc1ee4f987f084be091fd050cf31c108186eeff9) |
| En la puerta se registra la entrada de Luis | `registrar_entrada` | [f02cdc80…697dd8](https://stellar.expert/explorer/testnet/tx/f02cdc8086f149d0164b0220408bff16f3c7d27d68d6abf1dd3a13e71f697dd8) |
| Compra hecha desde la app con la billetera Freighter de un integrante | `comprar` → boleto 36 | [16487d7f…280adc6](https://stellar.expert/explorer/testnet/tx/16487d7f5c54e79c9988c131365d405516e6c50500f428d943081f9eb280adc6) |

Un segundo intento de entrada con el mismo boleto es rechazado por el contrato (`Error(Contract, #5)`, boleto ya usado), así que no genera transacción.

**Para comprobarlo en la app:** en la pantalla **Verificar** se puede buscar `TTX-000040` y se verá que pertenece a Luis y que ya fue usado.

---

## 2. Qué construimos esta semana

En el Entregable 3 elegimos la **opción A: contrato propio**. Esta semana el contrato quedó escrito, probado, desplegado en Testnet y conectado al front.

| Parte | Qué hace | Dónde está |
| --- | --- | --- |
| **Contrato TrustTix (Soroban, Rust)** | Guarda eventos con capacidad fija, emite boletos únicos, cobra en XLM y paga al organizador en la misma transacción, permite transferir solo al dueño, autoriza personal de acceso y registra una sola entrada por boleto | `contracts/trusttix/` |
| **Pruebas del contrato** | 7 pruebas automáticas, incluidas las que deben fallar: evento agotado, comprador sin saldo, transferencia por alguien que no es el dueño y doble entrada | `contracts/trusttix/src/test.rs` |
| **Conexión del front con Stellar** | Billetera Freighter (conexión, red Testnet y firma), lectura del contrato por Stellar RPC y envío de transacciones firmadas | `frontend/src/stellar/` |
| **Resto del back** | No hace falta un servidor: la validez de cada boleto vive en el contrato. Los datos descriptivos de los eventos (imagen, dirección, descripción) se guardan en el front | `frontend/src/context/AppContext.jsx` y `frontend/src/data/eventos.js` |
| **Escáner de acceso** | Lee el QR del boleto con la cámara, consulta el contrato y registra la entrada firmada por el personal autorizado | `frontend/src/pages/Escaner.jsx` |

**Funciones del contrato:**

| Función | Quién la usa | Regla que hace cumplir la red |
| --- | --- | --- |
| `crear_evento` | Organizador | La capacidad queda fija desde el inicio |
| `autorizar_personal` / `quitar_personal` | Organizador | Solo el organizador decide quién registra entradas |
| `comprar` | Asistente | Cobra y emite el boleto en una sola transacción; se rechaza si no quedan lugares |
| `transferir` | Dueño del boleto | Solo el dueño actual, y nunca un boleto ya usado |
| `registrar_entrada` | Personal de acceso | Solo personal autorizado; un segundo intento se rechaza |
| `consultar_evento`, `consultar_boleto`, `boletos_de`, `es_personal`, `total_eventos`, `total_boletos` | Cualquiera | Lecturas públicas y gratuitas |

**Ajuste respecto al Blueprint:** el pago se hace en **XLM de Testnet** en lugar de USDC, porque USDC en Testnet exige que cada cuenta abra una línea de confianza (trustline) y consiga saldo de prueba. El mecanismo es el mismo (Stellar Asset Contract), así que pasar a USDC solo cambia la dirección del token al desplegar.

---

## 3. Aprendizajes y ajustes priorizados

> Qué aprendió el equipo y qué cambios hará, ordenados por impacto y esfuerzo. Qué se ajusta antes del cierre y qué queda pendiente. Extensión: 150 a 300 palabras.

Pendiente.

---

## 4. Riesgos y pendientes

> Riesgos identificados antes del cierre y qué queda por resolver. Extensión: 200 a 400 palabras.

Pendiente.

---

## 5. Plan de validación con usuarios

> Cómo validarán el producto con sus usuarios a futuro: a quiénes, con qué métodos, qué hipótesis comprobarán y con qué criterio sabrán que se cumplen. Extensión: 200 a 500 palabras.

Pendiente.
