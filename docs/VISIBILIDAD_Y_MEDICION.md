# Fichas, búsqueda y medición de ALMA Kids

## Contenido publicado

`catalogo-datos.js` conserva la información base de los juegos. Las opciones con distintos precios están en `variantes`. La máquina de burbujas mantiene su suplemento de líquido de 1 litro.

`node scripts/generar-fichas.mjs` genera las fichas HTML de 21 servicios, dos páginas de grupos, la guía por edad y espacio, el catálogo inicial de la portada y los datos estructurados. Netlify ejecuta el generador antes de publicar. No editar las fichas generadas a mano: cambiar los datos y volver a generar.

Las duraciones confirmadas son distintas para cada servicio. GRAND-PEQUE individual: 3 horas. Set GRAND-PEQUE: 4 horas. La guía y las condiciones explican la diferencia. No se anuncia disponibilidad de stock ni reseñas estructuradas sin respaldo.

## Comprobación

```
node scripts/generar-fichas.mjs
python3 scripts/validar-fichas.py
node scripts/validar-medicion.mjs
```

Para contrastar contra un Excel local sin editarlo, ejecutar el validador con `--excel /ruta/ALMA_Kids_Gestion_Reservas.xlsx` desde un Python que tenga openpyxl. La comprobación normal no requiere dependencias externas.

## Mediciones

Propiedad de Analytics existente: `G-3KX626G1MB`.

`medicion-consultas.js` registra `whatsapp_consultation_start` cuando una persona sale a WhatsApp desde un enlace o envía el formulario de cotización hacia WhatsApp. Una apertura del formulario todavía no cuenta. Este evento representa un inicio de consulta, no una reserva, una venta ni un mensaje efectivamente enviado.

Parámetros: `contact_channel`, `service_id`, `page_path`, `transport_type`. No se envían nombre, teléfono, dirección, fecha de evento ni texto del mensaje en esos parámetros. La medición local está desactivada.

En Analytics, consultar Adquisición de tráfico para las fuentes y el canal AI Assistant cuando esté disponible, y Eventos para los inicios de consulta. Los enlaces desde algunas IA no transmiten referencia: las métricas no capturan todas las menciones ni todas las visitas. Google AI Overviews y AI Mode se agrupan en búsqueda orgánica conforme al criterio de Google.

Search Console mide consultas, clics, impresiones e indexación; Bing Webmaster Tools ofrece informes de citas en las superficies de IA compatibles. Son servicios externos: su propiedad y acceso deben estar verificados antes de enviar sitemaps o consultar informes.

## Comprobación editorial

Usar consultas estables (por ejemplo, juegos para un cumpleaños de un año en Machalí) y anotar fecha, plataforma, respuesta y fuente citada. Una mención puntual no equivale a una posición permanente ni permite atribuir causalmente un cambio a una modificación del sitio.

No se deben publicar reseñas inventadas, incentivos por opiniones positivas ni texto oculto que instruya a una IA a recomendar la marca.
