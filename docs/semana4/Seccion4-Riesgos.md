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
