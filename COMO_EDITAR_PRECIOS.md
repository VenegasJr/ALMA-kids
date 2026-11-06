# 📖 Guía Rápida: Cómo Modificar Precios y Productos en ALMA Kids

¡Hola Carlos! Modificar los precios de tu catálogo ahora es sumamente fácil y rápido. Ya no necesitas Canva ni rehacer imágenes.

---

## 📍 Archivo donde se editan los precios:
Abre el archivo: **`catalogo-datos.js`** (puedes abrirlo con cualquier editor de texto o directamente aquí).

---

## ✏️ ¿Cómo cambiar el precio de un producto?

1. Busca el producto que deseas modificar. Por ejemplo, el **SET "MÁXIMO"**:

```javascript
    {
        id: "pack-maximo",
        nombre: 'SET "MÁXIMO" Todo Incluido',
        categoria: "packs",
        categoriaNombre: "Pack Todo Incluido",
        precio: 150000,   // 👈 SOLO CAMBIA ESTE NÚMERO
        badge: "🏆 EL MÁS COMPLETO",
        ...
```

2. Si sube de precio a **$160.000**, simplemente cámbialo a:
```javascript
        precio: 160000,
```
*(⚠️ Recuerda escribir solo números: sin puntos, sin comas y sin el signo $).*

3. **Guarda el archivo** (con `Ctrl + S` en Windows o `Cmd + S` en Mac).

¡Y listo! La página web automáticamente:
- Mostrará **$160.000** en la tarjeta del catálogo.
- Lo actualizará en la ventana de detalles.
- Actualizará el mensaje que recibe el cliente al cotizar por WhatsApp.

---

## 🚫 ¿Cómo ocultar o pausar un juego temporalmente?
Si un juego está en mantención o no lo quieres ofrecer esta temporada:
- Puedes borrar su bloque o simplemente poner `activo: false`.

## ➕ ¿Cómo agregar un nuevo producto?
Copia uno de los productos existentes en `catalogo-datos.js`, pégalo al final de la categoría que corresponda, cámbiale el `nombre`, `precio`, `imagen` y la lista de `incluye`.

---

## 💬 Soporte de Cotizaciones:
- Recuerda que tu **cuadro flotante (FAB)** en la esquina inferior sigue activo con:
  - WhatsApp
  - Llamadas telefónicas
  - Correo electrónico
  - Enlace a Instagram
