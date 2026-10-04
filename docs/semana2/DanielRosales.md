# Historias de usuario individuales

**Nombre:** Daniel Rosales Alanis

**Usuario de GitHub:** @DanielRosalesAlanis

---

## Mis historias de usuario

> Entre 5 y 7 historias en formato "como [rol] quiero [acción] para [beneficio]", pensadas desde distintos roles o necesidades del producto que el equipo está diseñando.

1. Como asistente a un concierto quiero comprar un boleto que quede registrado a mi nombre como único dueño para tener la certeza de que nadie más puede reclamar mi lugar.
2. Como asistente quiero verificar en cualquier momento la validez de mi boleto desde mi celular para no descubrir un problema hasta llegar a la puerta.
3. Como organizador de eventos quiero definir la capacidad máxima del recinto al crear el evento para que el sistema impida vender más boletos que lugares disponibles.
4. Como personal de acceso quiero escanear el código QR del boleto y obtener una respuesta de válido o inválido en pocos segundos para no generar filas en la entrada.
5. Como comprador en reventa quiero confirmar que el boleto pertenece al vendedor y que no ha sido usado antes de pagar para no ser víctima de una reventa duplicada.
6. Como pasajero de avión quiero que mi asiento quede asignado de forma única al comprar mi boleto para no quedarme sin lugar por sobreventa.

## La más importante y por qué

> Organiza las historias de mayor a menor importancia: en la primera fila va la más importante. En cada fila indica el número de la historia y por qué la ubicaste en esa posición.

| Orden de importancia | Historia # | Por qué |
| :---: | :---: | --- |
| 1 (la más importante) | 1 | Es el núcleo de la hipótesis del Problem Brief: un lugar con un solo dueño verificable. Sin esta historia no existe el producto. |
| 2 | 3 | Ataca la sobreventa en el origen (fricción 1). Si el tope de capacidad lo hace cumplir el sistema, el organizador no puede vender de más aunque quiera. |
| 3 | 4 | El acceso es donde hoy se descubre el conflicto (fricción 3). Si la validación no es rápida, el sistema agrega fricción en lugar de quitarla (riesgo 2 del Problem Brief). |
| 4 | 5 | Cubre la reventa sin verificación (fricción 2), que es donde más fraude sufre el comprador secundario. |
| 5 | 2 | Aporta la promesa de "comprobarlo yo mismo", pero es una consulta que depende de que las historias anteriores ya existan. |
| 6 (la menos importante) | 6 | El caso de aerolíneas es real, pero exige integrarse con sistemas de reservación y normativa aérea, lo que queda fuera del alcance del curso. |
