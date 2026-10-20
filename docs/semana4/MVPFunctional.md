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
| **Primera ronda de validación** | [Encuesta a 15 personas: resultados y decisiones](Validacion.md) |
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

### Qué aprendimos

1. **Si la regla vive en el contrato, la app se simplifica.** La capacidad, el dueño único y la entrada única no se validan en la interfaz: el contrato las rechaza. El front solo traduce los errores de la red a mensajes claros.
2. **Leer es inmediato; escribir tarda unos 5 segundos.** Cada acción firmada necesita un estado de espera visible ("Esperando a la red…") y un enlace a su transacción para generar confianza.
3. **Lo que se escribe en la red no se puede corregir.** Un error de codificación dejó mal escritos dos nombres de eventos y tuvimos que desplegar una nueva instancia del contrato. Hay que validar los datos antes de firmar.
4. **La billetera de extensión no existe en el celular.** Para el público, que compra desde el teléfono, Freighter de escritorio no basta.
5. **USDC en Testnet agrega fricción** por las líneas de confianza; para el MVP fue mejor cobrar en XLM.
6. **Grabar el producto reveló fallas de uso:** el resultado del escáner quedaba fuera de la pantalla.

### Ajustes priorizados

| Ajuste | Impacto | Esfuerzo | Cuándo |
| --- | --- | --- | --- |
| El escáner baja solo hasta el resultado | Alto | Bajo | ✅ Hecho |
| Ver boletos y su QR en el celular sin billetera | Alto | Bajo | Antes del cierre |
| Pantalla para que el organizador autorice a su personal | Medio | Bajo | Antes del cierre |
| Cuentas con huella (passkeys) y comisiones patrocinadas | Alto | Alto | Pendiente |
| Pago en pesos (tarjeta o SPEI) y en USDC | Alto | Alto | Pendiente |
| QR dinámico firmado por el dueño | Medio | Medio | Pendiente |

---

## 4. Riesgos y pendientes

> Riesgos identificados antes del cierre y qué queda por resolver. Extensión: 200 a 400 palabras.

| Riesgo | Por qué importa | Cómo lo atendemos |
| --- | --- | --- |
| **Fricción de la billetera** | Hoy hace falta Freighter en la computadora. La mayoría compra boletos desde el celular y no sabe qué es una billetera (supuesto 3 del Problem Brief). | Cuentas con passkey (huella o Face ID) y comisiones de red pagadas por la plataforma, para que el usuario nunca vea XLM ni frases secretas. |
| **QR copiable antes de usarse** | El QR solo contiene el número de boleto. Si alguien lo copia y llega primero, entra él y el dueño se queda afuera. El contrato evita la doble entrada, pero no decide quién llega primero. | QR dinámico: cambia cada pocos segundos y lo firma la cuenta del dueño, así que una captura deja de servir. |
| **Sin internet en la puerta** | En recintos llenos la señal falla y cada entrada necesita escribir en la red. | Descargar la lista del evento antes de abrir puertas, validar sin conexión y sincronizar las entradas en cuanto vuelva la señal. |
| **Escala de las consultas** | Para listar los boletos de un evento, el front recorre todos los boletos emitidos. Funciona con decenas, no con miles. | Un indexador que escuche los eventos del contrato y los guarde en una base de datos para consultas rápidas. |
| **Contrato sin auditoría ni actualización** | Un error en el contrato no se puede corregir y afecta dinero real en producción. | Auditoría de seguridad y un mecanismo de actualización controlado antes de pasar a Mainnet. |
| **Vida de los datos en Soroban** | Los registros tienen un tiempo de vida que se debe renovar; el contrato lo extiende al escribir, pero un evento sin movimiento podría archivarse. | Un proceso que renueve los registros de los eventos activos. |
| **Adopción de organizadores** | Sin organizadores no hay boletos que verificar (supuesto 1 del Problem Brief). | Empezar con organizadores independientes y eventos pequeños, donde la reventa duele más y no hay boletera propia. |
| **Cumplimiento** | Vender boletos y cobrar en pesos implica Profeco, facturación (CFDI) e identificación de clientes. | Usar un procesador de pagos o un anchor que cubra la identificación, y emitir facturas al organizador. |

**Queda por resolver antes del cierre:** ver los boletos y su QR desde el celular sin extensión de billetera y autorizar al personal de acceso desde la app.

---

## 5. Plan de validación con usuarios

> Cómo validarán el producto con sus usuarios a futuro: a quiénes, con qué métodos, qué hipótesis comprobarán y con qué criterio sabrán que se cumplen. Extensión: 200 a 500 palabras.

### A quiénes

| Grupo | Perfil | Cuántos |
| --- | --- | --- |
| **Asistentes** (el usuario del Problem Brief) | Personas de 18 a 40 años que compran boletos en línea en Cuernavaca y la Ciudad de México, idealmente que hayan vivido una reventa falsa o una sobreventa | 10 entrevistas y 8 pruebas con el producto |
| **Organizadores independientes** | Organizadores de conciertos y festivales de 50 a 5,000 personas sin boletera propia | 3 entrevistas |
| **Personal de acceso** | Quienes revisan boletos en la puerta | 3 pruebas en un evento real |

### Hipótesis y criterios de éxito

| # | Hipótesis | Cómo la medimos | Se cumple si… |
| --- | --- | --- | --- |
| H1 | Poder verificar un boleto antes de pagarlo da más confianza que la palabra del vendedor | Entrevista con una escala del 1 al 5, antes y después de usar **Verificar** | La confianza promedio sube al menos 1.5 puntos y 7 de cada 10 dicen que verificarían antes de comprar en reventa |
| H2 | Una persona sin experiencia en cripto puede comprar su boleto sin ayuda | Prueba con el producto: tiempo para completar la compra y número de veces que pide ayuda | 8 de cada 10 lo logran en menos de 2 minutos sin ayuda (con la versión de cuentas con huella) |
| H3 | La validación en la puerta no hace más lenta la entrada | Piloto en un evento pequeño: tiempo por persona y errores de lectura | Menos de 5 segundos por boleto en promedio y menos de 2 % de lecturas fallidas |
| H4 | Los organizadores adoptarían TrustTix para frenar la sobreventa y la reventa duplicada | Entrevista: problema, disposición a probarlo y a pagar una comisión por boleto | Al menos 2 de 3 aceptan un piloto y consideran razonable una comisión de alrededor de 3 % |
| H5 | Nadie logra entrar dos veces con el mismo boleto | Piloto: intentos de entrada con boletos repetidos o capturas de pantalla | Cero entradas duplicadas registradas |

### Métodos y orden

1. **Entrevistas** (semanas 1 y 2): conversaciones de 20 minutos con asistentes y organizadores sobre cómo compran y venden boletos hoy, qué les ha salido mal y qué les daría confianza. No se muestra el producto hasta el final.
2. **Pruebas con el producto** (semana 3): cada persona hace tres tareas en la app de Testnet (comprar un boleto, verificar uno de reventa y transferir el suyo) mientras piensa en voz alta. Se mide el tiempo, los errores y dónde se atora.
3. **Piloto en un evento real** (semana 4): un evento pequeño (de 50 a 100 personas) de un organizador aliado, con boletos de TrustTix y la app de acceso en la puerta. Se miden los tiempos de entrada, los intentos de doble entrada y una encuesta corta de salida.

### Qué hacemos con los resultados

Si una hipótesis no se cumple, ajustamos antes de crecer: si falla H2, priorizamos las cuentas con huella; si falla H3, la validación sin conexión. Cada ronda se repite con la versión corregida.
