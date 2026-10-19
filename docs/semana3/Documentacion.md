# Documentación: Functional Proof

**Nombre del proyecto:** TrustTix

**Repositorio:** [Builders101](https://github.com/DanielRosalesAlanis/Builders101)

---

## Contenido

1. Front construido
2. Decisión técnica
3. Participación del equipo
4. Bloqueos y siguiente paso

---

## 1. Front construido

> Qué pantallas o vistas se implementaron y cómo se conectan con el MVP del Blueprint. Incluir capturas de pantalla o un enlace al front funcionando en caso de estar hosteado el proyecto. Extensión: 400 a 2000 palabras.

El front de TrustTix está en la carpeta `frontend/` del repositorio. Es una aplicación web hecha con React y Vite, pensada primero para celular (mobile first) y adaptable a tablet y escritorio. Implementa de punta a punta el flujo principal del MVP definido en el Product Blueprint: crear un evento con capacidad máxima, comprar un boleto, verlo con su código QR, transferirlo, verificarlo antes de comprarlo en reventa y registrarlo en la puerta del evento.

### Cómo está construido

| Aspecto | Decisión |
| --- | --- |
| Tecnología | React 19, Vite y React Router. El código QR se genera con la librería `qrcode.react`. |
| Diseño | Tema oscuro basado en los bocetos del equipo. Tipografías Golos Text para títulos y Roboto para textos. |
| Responsive | En celular la navegación es una barra inferior y el contenido va en una columna. Desde 640 px las tarjetas se acomodan en dos columnas y desde 960 px la navegación pasa a una barra lateral y el detalle del evento se divide en dos columnas. |
| Datos | Esta semana el front funciona con datos de ejemplo guardados en el navegador. Cada acción ya aplica las mismas reglas que tendrá el contrato, para que la próxima semana solo haya que conectarla a la red. |

Toda la lógica que después vivirá en Stellar está concentrada en un solo archivo (`frontend/src/context/AppContext.jsx`). Cada función de ese archivo corresponde a una función del contrato descrito en el Blueprint: `crearEvento`, `comprar`, `transferir`, `consultarBoleto` y `registrarEntrada`. Las pantallas no saben si los datos vienen del navegador o de la red, así que el cambio de la próxima semana no las afecta.

### Pantallas implementadas y su relación con el MVP

| # | Pantalla | Qué hace | Historia del backlog |
| :---: | --- | --- | :---: |
| 1 | Inicio de sesión | Entrada a la app con el lema "Tu acceso al mundo". El acceso con Google es simulado. | |
| 2 | Inicio | Lista de eventos con buscador y filtros por categoría. Cada tarjeta muestra lugares vendidos frente a la capacidad, precio y el estado del botón (Ver evento, Asistiré o Agotado). | P1 |
| 3 | Detalle del evento | Imagen, descripción, ubicación con mapa, fecha, organizador verificado, barra de lugares, sello de capacidad protegida y la compra. | P1, P2, P4 |
| 4 | Confirmar compra | Hoja que simula la firma en la billetera: evento, total en USDC, cuenta de origen y red. | P2, P3, P4 |
| 5 | Detalle del boleto | Boleto con su código QR, número, fecha, estado y el registro de movimientos. | P9 |
| 6 | Mis boletos | Los boletos que pertenecen a la billetera conectada. | P9 |
| 7 | Transferir | Envía el boleto a otra dirección Stellar. Solo el dueño puede hacerlo y un boleto usado no se puede transferir. | P7 |
| 8 | Verificar | Página pública, sin sesión ni billetera, para revisar dueño, estado e historial de un boleto antes de comprarlo en reventa. | P8 |
| 9 y 10 | Escáner de acceso | El personal elige el evento, escanea el boleto y ve verde si es válido o rojo si ya se usó, no existe o es de otro evento. Al registrar la entrada, el boleto queda marcado como usado. | P5, P6 |
| 11 | Crear evento | Formulario del organizador con capacidad máxima, que el contrato no permitirá rebasar. | P1 |
| 12 | Perfil | Billetera conectada, acceso al panel del organizador y a la app de acceso. | P3 |

### Recorrido por las pantallas

**1. Inicio de sesión e inicio.** La persona entra y ve los eventos principales. La barra de cada tarjeta muestra cuántos lugares quedan, que es el dato que el contrato garantiza. Cuando quedan pocos aparece la etiqueta "Quedan 12" y cuando se acaban el botón cambia a "Agotado".

| Inicio de sesión | Inicio |
| :---: | :---: |
| ![Inicio de sesión](capturas/01-login.png) | ![Inicio](capturas/02-inicio.png) |

**2. Detalle del evento y compra.** El detalle reúne toda la información para decidir. El sello de capacidad protegida explica al usuario, sin tecnicismos, que el evento no puede vender más boletos que su capacidad. Al comprar, la app pide firmar en la billetera; el pago y la emisión del boleto ocurren en una sola operación.

| Detalle del evento | Confirmar compra |
| :---: | :---: |
| ![Detalle del evento](capturas/03-detalle-evento.png) | ![Confirmar compra](capturas/04-confirmar-compra.png) |

**3. Boleto y mis boletos.** El boleto conserva la forma de boleto físico del diseño, con el QR que se presenta en la puerta y el registro de cada movimiento. "Mis boletos" muestra solo los que pertenecen a la billetera conectada.

| Detalle del boleto | Mis boletos |
| :---: | :---: |
| ![Detalle del boleto](capturas/05-boleto.png) | ![Mis boletos](capturas/06-mis-boletos.png) |

**4. Transferir y verificar.** La transferencia mueve el boleto a otra cuenta en el mismo registro, así que nunca existen dos dueños al mismo tiempo. La verificación es pública: cualquiera que vaya a comprar en reventa puede confirmar quién es el dueño y si el boleto ya se usó.

| Transferir | Verificar |
| :---: | :---: |
| ![Transferir](capturas/07-transferir.png) | ![Verificar](capturas/08-verificar.png) |

**5. Acceso en la puerta.** El personal escanea el boleto. Si es válido, registra la entrada; si alguien intenta entrar otra vez con el mismo boleto, el sistema lo rechaza y muestra la hora en que ya entró.

| Boleto válido | Boleto ya utilizado |
| :---: | :---: |
| ![Acceso válido](capturas/09-acceso-valido.png) | ![Acceso usado](capturas/10-acceso-usado.png) |

**6. Organizador y perfil.** El organizador crea eventos indicando la capacidad máxima. Desde el perfil se administra la billetera y se entra al panel del organizador y a la app de acceso.

| Crear evento | Perfil |
| :---: | :---: |
| ![Crear evento](capturas/11-crear-evento.png) | ![Perfil](capturas/12-perfil.png) |

**7. Versión de escritorio.** En pantallas grandes la navegación pasa a una barra lateral, los eventos se muestran en tres columnas y el detalle se divide en dos.

![Inicio en escritorio](capturas/13-escritorio-inicio.png)

![Detalle en escritorio](capturas/14-escritorio-detalle.png)

### Qué está simulado en esta entrega

- **Inicio de sesión con Google:** no usa una cuenta real.
- **Billetera Freighter:** al conectar se usa una cuenta de ejemplo de Stellar Testnet.
- **Escaneo con cámara:** en la app de acceso se escribe o se elige el número de boleto en lugar de leer el QR con la cámara.
- **Datos:** los eventos y boletos viven en el navegador. El botón "Reiniciar datos de la demo" del perfil los regresa a su estado inicial.

Aunque estas piezas están simuladas, las reglas del producto ya funcionan en el front: no se puede comprar si no quedan lugares, solo el dueño puede transferir y un boleto no puede entrar dos veces.

---

## 2. Decisión técnica

> Opción elegida (A. Contrato propio o B. Solución existente del ecosistema), por qué se decidió así y qué se descartó. Apoyado en el uso de Stellar del Blueprint. Extensión: 200 a 500 palabras.

**Opción elegida: A. Contrato propio.**

Vamos a escribir nuestro propio contrato inteligente en Soroban, el entorno de contratos de Stellar, y lo desplegaremos en Testnet. Esta decisión sigue directamente el uso de Stellar definido en el Product Blueprint, donde el contrato TrustTix es el componente central: es quien hace cumplir las reglas que resuelven el problema.

### Qué haría el contrato

El contrato necesita registrar en la red tres cosas:

| Qué registra | Datos |
| --- | --- |
| Eventos | Organizador, capacidad máxima, precio en USDC y boletos vendidos |
| Boletos | Número único, evento al que pertenece, dueño actual y estado (válido o usado) |
| Personal de acceso | Cuentas que el organizador autoriza para registrar entradas en su evento |

Y ejecutar estas funciones, que ya están representadas en el front:

| Función | Regla que hace cumplir la red |
| --- | --- |
| `crear_evento` | Solo el organizador lo crea y la capacidad queda fija |
| `autorizar_personal` | Solo el organizador decide quién escanea en su evento |
| `comprar` | Cobra en USDC y emite el boleto en la misma transacción. Se rechaza si ya no hay lugares |
| `transferir` | Solo el dueño actual puede transferir, y nunca un boleto ya usado |
| `consultar_boleto` | Lectura pública y gratuita del dueño y el estado |
| `registrar_entrada` | Solo personal autorizado. Marca el boleto como usado y rechaza un segundo intento |

### Por qué necesitamos uno propio

Las reglas que resuelven el problema son específicas de TrustTix y ninguna herramienta existente las combina:

1. **Tope de capacidad por evento.** Un activo clásico de Stellar puede representar un boleto, pero no puede impedir que se emitan más boletos que lugares disponibles en un evento.
2. **Estado de "usado".** Un activo solo sabe quién lo tiene, no si ya entró al evento. Sin este estado, un boleto único podría entrar dos veces.
3. **Pago y emisión atómicos.** El contrato puede cobrar el USDC mediante el Stellar Asset Contract y emitir el boleto en la misma operación, de modo que no exista un boleto sin pago ni un pago sin boleto.
4. **Permisos por rol.** El organizador, el dueño del boleto y el personal de acceso pueden hacer cosas distintas, y esas reglas deben estar en la red, no en nuestro servidor.

### Qué descartamos

Descartamos la **opción B**: usar activos clásicos de Stellar con cantidad 1 como boletos. Resuelven la propiedad, pero dejan la capacidad y el estado de usado en una base de datos nuestra, lo que vuelve a concentrar la confianza en un intermediario, justo lo que el criterio de pertinencia del Problem Brief busca evitar.

Sí aprovecharemos piezas del ecosistema dentro del contrato propio: USDC mediante el Stellar Asset Contract, la billetera Freighter para firmar y Stellar RPC para las consultas.

---

## 3. Participación del equipo

> Cada integrante con su usuario de GitHub y explicación de su aporte o responsabilidad en el entregable. Extensión: breve.

| Integrante | Usuario de GitHub | Aporte en esta entrega |
| --- | --- | --- |
| Daniel Rosales Alanis | @DanielRosalesAlanis | Coordinación de la entrega. Diseño de las pantallas, construcción del front en `frontend/` y README con los pasos para ejecutarlo. |
| David Eliaquim Diaz Hernandez | @EliaquimTek | Decisión técnica sobre contratos (sección 2): definió qué registrará y ejecutará el contrato propio en Soroban y por qué se descartó una solución existente. |
| Gael Damián Hernández Carranza | @XxDamian-hc2006xX | Documentación del front construido (sección 1): descripción de cada pantalla, relación con el MVP del Blueprint y capturas. |
| Laura Andrea Basurto Ocampo | @oumandy2106 | Bloqueos y siguiente paso hacia el MVP (sección 4): qué quedó simulado y el plan para conectar el front con el contrato. |

---

## 4. Bloqueos y siguiente paso

> Qué quedó pendiente y cuál es el próximo paso hacia el MVP. Extensión: breve.

### Qué quedó pendiente

- **Contrato.** Por indicación del curso, esta semana solo se documentó la decisión (opción A). El contrato todavía no está escrito ni desplegado.
- **Billetera real.** La conexión con Freighter está simulada con una cuenta de ejemplo.
- **Inicio de sesión.** El acceso con Google es simulado. En el Blueprint el registro sin billetera (correo o huella) quedó fuera del MVP, así que debemos decidir si se conserva o se reemplaza por la conexión directa de la billetera.
- **Escaneo con cámara.** La app de acceso todavía no lee el QR con la cámara del celular; se escribe o se elige el número de boleto.
- **Datos.** Los eventos y boletos se guardan en el navegador, no en la red.

### Siguiente paso hacia el MVP

1. Escribir el contrato TrustTix en Soroban con las funciones `crear_evento`, `autorizar_personal`, `comprar`, `transferir`, `consultar_boleto` y `registrar_entrada`, y desplegarlo en Testnet.
2. Conectar la billetera Freighter mediante Stellar Wallets Kit.
3. Reemplazar las acciones simuladas del front (`frontend/src/context/AppContext.jsx`) por llamadas al contrato, usando USDC de prueba para los pagos.
4. Agregar la lectura del QR con la cámara en la app de acceso.
5. Probar el recorrido completo con usuarios reales en Testnet.
