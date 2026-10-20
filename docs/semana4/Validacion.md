# Validación: primera ronda

**Proyecto:** TrustTix

**Método:** encuesta en línea (Google Forms), anónima, compartida en grupos de WhatsApp del equipo.

**Fecha:** 19 de octubre de 2026 · **Respuestas:** 15

---

## 1. Qué queríamos saber

Antes de enviar la encuesta fijamos qué buscábamos comprobar:

| Pregunta de validación | Por qué importa |
| --- | --- |
| ¿El problema le pasa a personas reales y cercanas? | Si nadie lo vive, no hay producto |
| ¿Hoy existe una forma confiable de verificar un boleto de reventa? | Si ya existe, TrustTix no aporta |
| ¿Qué frenaría el uso de una app como TrustTix? | Define qué construir primero |
| ¿Qué comisión aceptarían pagar? | Pone a prueba el modelo de negocio (3 % por boleto) |

## 2. Quién respondió

| Dato | Resultado |
| --- | --- |
| Edad | 13 de 15 tienen entre 18 y 24 años; 1 es menor de 18 y 1 tiene entre 25 y 34 |
| Frecuencia | 13 de 15 van a 1 o 2 eventos al año; 1 va de 3 a 5 veces; 1 no va |
| Dónde compran | 14 de 15 en boletera oficial; 3 por reventa en redes sociales o conocidos; 2 en taquilla; 1 en apps de reventa |
| Reventa | 3 compraron en reventa y 8 lo han considerado (11 de 15) |

## 3. Resultados

### El problema existe

**7 de 15 (47 %)** vivieron, ellos o alguien cercano, al menos una de estas situaciones:

| Situación | Personas |
| --- | :---: |
| Le vendieron un boleto falso | 4 |
| Sobreventa en un vuelo o evento | 3 |
| No lo dejaron entrar aunque tenía boleto | 2 |
| El mismo boleto se lo vendieron a otra persona | 1 |

Una persona más reportó una cancelación sin reembolso, que no es parte del problema que resuelve TrustTix.

**Qué perdieron:** 4 el dinero del boleto, 3 el evento y 3 tiempo en reclamos.

### Hoy no hay una forma confiable de verificar

**Confianza en que un boleto de reventa sea real** (escala de 1 a 5):

| 1 | 2 | 3 | 4 | 5 | Promedio |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 4 | 6 | 5 | 0 | 0 | **2.1** |

Nadie calificó su confianza por arriba de 3.

**Cómo comprueban hoy que un boleto de reventa es válido:**

| Respuesta | Personas |
| --- | :---: |
| No sabe o nunca lo ha pensado | 4 |
| Confía en el vendedor (personas de confianza, trato en persona, "intento confiar") | 3 |
| Revisa el boleto a simple vista (fechas, asiento, logos, número o QR) | 5 |
| Lo revisa en la página o app oficial | 2 |
| "Realmente no hay algo que lo compruebe" | 1 |

### Qué frenaría el uso

| Barrera | Personas |
| --- | :---: |
| Que no la usen los principales organizadores de eventos | **10** |
| Pagar una comisión alta | 8 |
| Crear una cuenta o billetera digital | **6** |
| Tener que instalar otra app | 4 |
| No confiar en la tecnología | 3 |

### Comisión aceptable

| Comisión máxima por un boleto 100 % verificado | Personas |
| --- | :---: |
| Entre 3 % y 5 % | **13** |
| Hasta 2 % | 2 |
| Nada | 0 |

### Interés declarado

Ante "¿lo usarías?", **13 de 15** respondieron "sí, siempre" y 2 respondieron "no". Lo tomamos como **interés declarado, no como compromiso**: es una opinión sobre el futuro y no basta para validar que la gente verificará en la práctica.

## 4. Lo que dijeron

> "Me estafaron con los boletos por internet para el concierto de BTS; la chava ya no respondía y nos bloqueó a mi amiga y a mí."

> "Únicamente lo compruebo con el mismo boleto, pero 2 veces me falló."

> "He escuchado casos en los que los boletos son clonados o falsos y después la persona que los vende bloquea a quien los compró."

> "Realmente no hay algo que lo compruebe."

## 5. Hipótesis: qué cambió con esta ronda

| # | Hipótesis | Criterio | Resultado | Estado |
| --- | --- | --- | --- | --- |
| P1 | El problema les pasa a personas cercanas al usuario objetivo | Al menos 1 de cada 3 lo vivió o lo conoce de cerca | 7 de 15 (47 %) | ✅ Cierta |
| P2 | Hoy no hay una forma confiable de verificar un boleto de reventa | Confianza promedio de 3 o menos | 2.1 de 5; solo 2 de 15 verifican en una fuente oficial | ✅ Cierta |
| M1 | Una comisión de alrededor de 3 % es aceptable | Al menos 3 de cada 4 aceptan 3 % o más | 13 de 15 (87 %) | ✅ Cierta, como intención |
| H1 | Quien compra en reventa verificará el boleto antes de pagar | 4 de 5 lo verifican sin que se les pida, en una prueba | Aún no se observa: la encuesta solo da interés declarado | ⏳ Pendiente |
| H2 | Una persona sin experiencia completa la compra con billetera sin ayuda | 4 de 5 sin ayuda, en una prueba | 6 de 15 señalan la billetera como barrera | ⚠️ En riesgo |
| H4 | Los organizadores adoptarán TrustTix | 2 de 3 organizadores aceptan un piloto | 10 de 15 usuarios dudarían si no lo usan los organizadores principales | ⚠️ Riesgo principal |

## 6. Qué decidimos

1. **Prioridad 1: quitar la billetera del camino.** Entrar con huella o Face ID (passkeys) y pagar las comisiones de red desde la plataforma, para que nadie tenga que crear una billetera. Responde a la barrera de 6 de 15 personas.
2. **Prioridad 2: conseguir organizadores antes que usuarios.** La barrera más mencionada (10 de 15) es que los organizadores no lo usen. El siguiente paso es un piloto con un organizador independiente de 50 a 100 personas, con el que se pueda mostrar un caso real.
3. **Seguir sin app para instalar.** TrustTix es una página web, lo que ya atiende a las 4 personas que no quieren instalar otra app.
4. **Mantener la comisión del 3 %.** Cae dentro de lo que aceptan 13 de 15 personas.

## 7. Límites de esta ronda

- **Muestra pequeña y cercana:** son 15 personas, casi todas de 18 a 24 años y de la red del equipo.
- **Pocas personas compraron en reventa:** solo 3 de 15, que es el segmento que más nos importa.
- **Opiniones, no conductas:** la encuesta mide lo que la gente dice. Lo que hace se comprueba con pruebas de usabilidad.

## 8. Siguiente ronda

| Qué | Con quién | Criterio |
| --- | --- | --- |
| **Prueba de usabilidad de H1.** Escenario: *"Te ofrecen por WhatsApp un boleto para un concierto a $2,000. Decide si lo compras."* Se observa si entra a Verificar por su cuenta | 5 personas que hayan comprado o considerado comprar en reventa (no del equipo) | 4 de 5 verifican sin que se les pida |
| **Prueba de usabilidad de H2.** Escenario: *"Quieres ir a este evento; consigue tu boleto."* | Las mismas 5 personas | 4 de 5 completan la compra sin ayuda |
| **Entrevistas con organizadores (H4).** Sobre la última vez que tuvieron problemas con reventa o boletos falsos | 3 organizadores independientes | 2 de 3 aceptan un piloto con fecha |

En cada sesión, una persona del equipo dirige sin ayudar y otra anota qué hizo la persona, qué dijo y en qué paso.
