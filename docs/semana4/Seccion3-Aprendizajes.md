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
