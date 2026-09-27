# Problem Brief

## Decisión del problema

### Problema elegido

> El problema ganador en una frase, sin mencionar blockchain, y quién lo propuso.

Se venden más boletos de avión o entradas a conciertos de los que hay capacidad real, dejando sin lugar a personas que compraron de forma legítima. Propuesto por Laura Andrea Basurto Ocampo (Andrea).

### Por qué elegimos este

>Qué inclinó al equipo por este problema frente a los demás, según los criterios de la Sesión 1.

Elegimos este problema porque, comparado con las demás propuestas, es el que más claramente cumple los criterios de la Sesión 1: existe un intermediario único (la aerolínea o la plataforma de boletos) que hoy concentra toda la confianza sobre quién tiene derecho a un lugar, y un histórico inalterable resolvería directamente el fraude por duplicación. A diferencia de las propuestas de permisos municipales o becas, donde blockchain jugaría un rol de respaldo o trazabilidad sobre un proceso que sigue dependiendo de una entidad central, en este caso blockchain resuelve el núcleo del problema: la unicidad verificable de un derecho. Además, es un problema con evidencia cotidiana y fácil de explicar sin necesidad de conocimiento técnico previo, lo que facilita validarlo con usuarios reales durante el curso.

### Propuestas descartadas

>Cada propuesta considerada, quién la propuso y el motivo del descarte.

- **Pagos unificados de transporte público con Stellar**, propuesta por Daniel Rosales Alanis. Se descartó porque requiere integrarse con múltiples operadores de transporte y sistemas de cobro heredados en cada ciudad, lo que amplía demasiado el alcance para el tiempo del curso, y porque el criterio de "eliminar intermediario" es más débil: los operadores seguirían necesitando liquidar en moneda fiat con reguladores locales.
- **Permisos digitales para vendedores ambulantes de Jiutepec**, propuesta por David Eliaquim Diaz Hernandez. Se descartó porque depende en gran medida de que el municipio adopte y mantenga el sistema como única entidad emisora, y buena parte del valor (verificación de vigencia, datos personales del vendedor) sigue centralizado en la base de datos municipal; el rol de blockchain queda acotado a un respaldo de integridad del historial, más que a resolver una necesidad de confianza distribuida entre partes que no confían entre sí.
- **Distribución correcta de becas**, propuesta por Gael Damián Hernández Carranza. Se descartó porque la causa raíz del problema (que la beca no llegue a quien realmente la necesita) depende de los criterios y procesos de decisión de cada institución, no de la falta de un registro confiable; blockchain podría aportar trazabilidad sobre en qué se gasta una beca ya asignada, pero no resuelve directamente el criterio de elegibilidad, que es el núcleo del problema.

### Cómo tomamos la decisión

>Cómo llegó el equipo al acuerdo: votación, consenso tras debate u otro.

Debatimos las propuestas en sesión de equipo, evaluamos cada una contra los criterios de la Sesión 1 y votamos. El problema de boletos obtuvo mayoría de votos por su alcance acotado y evidencia clara.

---

## Problem Brief

### Encabezado

>Nombre del proyecto y una frase que describa el problema.

**TrustTix** — Un sistema que evita que un mismo boleto de avión o concierto sea vendido a más de una persona.

### Equipo y roles

>Integrantes con su usuario de GitHub, rol asumido por cada persona, responsable de las entregas y canal de coordinación interna.

| Nombre | Usuario de GitHub | Rol |
|---|---|---|
| Daniel Rosales Alanis | DanielRosalesAlanis | Coordinación / entregas |
| David Eliaquim Diaz Hernandez | EliaquimTek | Developer |
| Gael Damián Hernández Carranza | XxDamian-hc2006xX | Documentación |
| Laura Andrea Basurto Ocampo | oumandy2106 | Desarrollo de producto |

Responsable de las entregas: Daniel Rosales Alanis. 

Canal de coordinación interna: Grupo de WhatsApp.

### Problema y evidencia

>Enunciado del problema en una frase, sin mencionar blockchain. Contexto, frecuencia y alcance. Evidencia mínima de que el problema existe.

Se venden más boletos de avión o entradas a conciertos de los que hay capacidad real, y personas que compraron de forma legítima terminan sin acceso al vuelo o evento que ya pagaron. En el caso de vuelos, la sobreventa (overbooking) es una práctica deliberada de gestión de ingresos de las aerolíneas: venden más boletos que asientos disponibles apostando a que algunos pasajeros no se presenten, y cuando eso no ocurre, alguien se queda sin lugar. En conciertos y eventos masivos, el problema es distinto pero relacionado: el mismo lugar o boleto puede revenderse varias veces en mercados secundarios poco regulados, y el comprador solo descubre el fraude al llegar a la puerta. Ambos casos afectan a un volumen considerable de personas: la sobreventa es una práctica habitual y documentada en la industria aérea, y la reventa fraudulenta de boletos es uno de los reclamos más comunes en eventos de alta demanda. La evidencia de este problema es fácil de encontrar en la experiencia propia o de conocidos y en las quejas públicas que aerolíneas y plataformas de boletos reciben de forma recurrente en redes sociales y medios.

### Usuario y actores

>Quién sufre el problema y qué necesita resolver. Cómo lo resuelve hoy y qué le cuesta. Demás actores que intervienen.

El usuario afectado es el pasajero o asistente que compró su boleto de forma legítima y necesita tener la certeza de que su lugar le pertenece únicamente a él, sin depender de la buena fe del vendedor. Hoy, cuando el problema ocurre, la aerolínea resuelve ofreciendo compensación económica, reacomodo en otro vuelo o vouchers, lo que le cuesta al pasajero horas o incluso días de espera, y no siempre lo lleva a su destino en el horario original. En conciertos, la plataforma o el personal de acceso simplemente niega la entrada al boleto duplicado, y el afectado pierde el dinero pagado y la experiencia, que no se puede recuperar. Otros actores del flujo incluyen: la aerolínea o el organizador del evento (emisor original del boleto), las plataformas de reventa (que facilitan transferencias sin verificar unicidad), y el personal de acceso o counter (que valida el boleto en el punto de entrada, hoy contra una base de datos centralizada que puede tener inconsistencias).

### Flujo actual de valor

>Recorrido paso a paso de cómo se mueve hoy el dinero, la información o el activo, desde el origen hasta el destino. Intermediarios explícitos. Obligaciones normativas.

1. La aerolínea o el organizador del evento define el inventario de boletos y lo carga en su sistema de venta interno.
2. El sistema de venta (propio o de un tercero autorizado) pone los boletos a la venta, a veces por encima de la capacidad real (sobreventa) como práctica de gestión de ingresos.
3. El comprador paga y recibe un boleto o confirmación, generalmente en formato digital, emitido y validado únicamente por el sistema del emisor.
4. En el caso de eventos, el comprador puede revender o transferir su boleto en plataformas de reventa, que rara vez verifican en tiempo real con el emisor original si ese boleto ya fue usado o revendido antes.
5. El día del vuelo o evento, el personal de acceso valida el boleto contra la base de datos centralizada del emisor.
6. Si hay sobreventa o duplicación, el sistema detecta el conflicto solo en este último paso, cuando ya es demasiado tarde para el afectado.

El paso 2 (venta de boletos) suele estar sujeto a regulación de protección al consumidor y, en el caso de vuelos, a normativa de transporte aéreo que regula la compensación por denegación de embarque, pero no impide la sobreventa en sí.

### Fricciones identificadas

>Puntos concretos donde el flujo falla, se encarece o se demora. Paso, causa, a quién afecta.

- **Fricción 1 — Sobreventa en el paso 2:** la aerolínea vende más boletos que asientos disponibles porque su sistema de inventario no está ligado a una verificación pública de capacidad; afecta directamente al pasajero que llega y no tiene lugar.
- **Fricción 2 — Reventa sin verificación en el paso 4:** las plataformas de reventa no consultan al emisor original en el momento de la transferencia, lo que permite vender el mismo boleto más de una vez; afecta al comprador secundario, que no puede saber si el boleto es válido hasta llegar al evento.
- **Fricción 3 — Detección tardía en el paso 5-6:** el conflicto (boleto duplicado o sobreventa) solo se detecta en el punto de acceso, cuando el afectado ya invirtió tiempo y dinero en llegar; esto le cuesta la experiencia completa, que no es recuperable con una compensación económica.

### Oportunidad e hipótesis

>Oportunidad priorizada, con el motivo de la elección. Hipótesis inicial de por qué blockchain podría mejorar ese punto.

Priorizamos la fricción 3 (detección tardía del conflicto) porque es la que genera el mayor daño al usuario: para cuando se descubre el problema, ya no hay forma de evitar la pérdida de tiempo, dinero o experiencia. Si se puede prevenir en el origen, haciendo imposible que un mismo lugar tenga dos dueños válidos simultáneamente, las fricciones 1 y 2 dejan de tener forma de materializarse. Hipótesis: si cada boleto se emite como un token único, vinculado a un identificador del comprador, en un registro compartido y visible por todos los actores del flujo (emisor, plataformas de reventa, personal de acceso), ningún actor podría emitir o transferir el mismo lugar dos veces, y cualquiera podría verificar la validez de un boleto en cualquier momento del proceso, no solo en la puerta. Para el usuario, esto cambiaría la experiencia de "confiar en que mi boleto es válido" a "poder comprobarlo yo mismo, en cualquier momento, sin depender de la aerolínea o la plataforma".

### Criterio de pertinencia

>Por qué el caso requiere un registro distribuido y no una base de datos tradicional o una integración entre sistemas existentes.

Este caso requiere un registro distribuido porque intervienen varias partes que no confían entre sí y que hoy no comparten infraestructura: la aerolínea o el organizador del evento, las plataformas de reventa (muchas veces de terceros) y el personal de acceso. Una base de datos tradicional resolvería el problema solo si todos estos actores aceptaran depender de un único sistema centralizado controlado por uno de ellos, lo cual no ocurre hoy porque cada uno opera su propia plataforma y no tiene incentivo para ceder el control de su inventario a otro. Una integración punto a punto entre sistemas sería frágil y costosa de mantener a medida que se suman nuevas plataformas de reventa. Un registro distribuido resuelve esto porque ninguna de las partes necesita confiar en la infraestructura de la otra: todas consultan y escriben sobre el mismo histórico compartido e inalterable, lo que hace imposible, no solo prohibido por contrato, que el mismo lugar se asigne dos veces. Esto se apoya directamente en el criterio de varias partes que no confían entre sí necesitando compartir un mismo registro, y en el criterio de eliminar el intermediario (el emisor original) que hoy concentra en solitario la confianza sobre la validez de cada boleto.

### Supuestos y riesgos

>Dos o tres supuestos que tendrían que ser ciertos para que la hipótesis funcione, y qué podría invalidarla.

1. **Supuesto:** las aerolíneas y organizadores de eventos estarían dispuestos a emitir sus boletos sobre un registro compartido en lugar de su sistema propietario actual. **Riesgo:** si ningún emisor grande adopta el sistema, la solución no tiene inventario real que verificar y pierde utilidad frente al usuario.
2. **Supuesto:** el personal de acceso y las plataformas de reventa pueden integrarse técnicamente para consultar el registro en tiempo real durante el evento o embarque. **Riesgo:** si la verificación es más lenta o compleja que el proceso actual, el sistema podría generar más fricción operativa en el punto de acceso en lugar de menos.
3. **Supuesto:** los usuarios finales (pasajeros o asistentes) están dispuestos y son capaces de usar una billetera digital o identificador vinculado a blockchain para reclamar su boleto. **Riesgo:** si la fricción de adopción para el usuario común es alta, el sistema podría resolver el fraude pero fallar en la experiencia de uso, limitando su adopción real.
