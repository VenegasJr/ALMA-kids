# 🗺️ Configuración Google Maps API - ALMA Kids

## 📋 PASOS PARA ACTIVAR GOOGLE MAPS

### 1. Crear Cuenta en Google Cloud Platform
1. Ir a: https://console.cloud.google.com/
2. Iniciar sesión con cuenta de Gmail
3. Crear un nuevo proyecto llamado "ALMA Kids Maps"

### 2. Habilitar APIs Necesarias
En Google Cloud Console, habilitar estas APIs:
- ✅ **Maps JavaScript API**
- ✅ **Places API** 
- ✅ **Geocoding API**
- ✅ **Distance Matrix API** (opcional)

### 3. Crear API Key
1. Ir a "Credenciales" → "Crear credenciales" → "Clave de API"
2. Copiar la clave generada
3. **IMPORTANTE**: Restringir la clave por:
   - **Sitios web**: Agregar `almakids.cl` y `localhost`
   - **APIs**: Solo las APIs habilitadas arriba

### 4. Configurar en el Código
Reemplazar en `google-maps-integration.js` línea 27:
```javascript
// ANTES:
script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&language=es&region=CL`;

// DESPUÉS:
script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY_AQUI&libraries=places&language=es&region=CL`;
```

## 💰 COSTOS Y LÍMITES

### Plan Gratuito (Mensual):
- **Maps JavaScript API**: 28,500 cargas gratuitas
- **Places API**: 17,000 solicitudes gratuitas  
- **Geocoding API**: 40,000 solicitudes gratuitas

### Estimación para ALMA Kids:
- Con 100 cotizaciones/mes ≈ 300 solicitudes API
- **COSTO ESTIMADO: $0 USD/mes** (dentro del límite gratuito)

## 🔧 CONFIGURACIÓN ALTERNATIVA (SIN GOOGLE MAPS)

Si prefieres no usar Google Maps, el sistema tiene **Leaflet/OpenStreetMap** como alternativa gratuita:

### Ventajas de OpenStreetMap:
- ✅ Completamente gratuito
- ✅ Sin límites de uso
- ✅ Sin necesidad de API keys
- ✅ Ya configurado como fallback

### Desventajas:
- ❌ Menos preciso en Chile
- ❌ Sin autocompletado de direcciones
- ❌ Interfaz menos pulida

## 🚀 FUNCIONALIDADES IMPLEMENTADAS

### ✨ Con Google Maps:
- 🗺️ **Mapa interactivo** con zoom y navegación
- 📍 **Selección por clic** en cualquier punto
- 🔍 **Búsqueda de direcciones** con autocompletado
- 📏 **Cálculo automático** de distancia desde Machalí
- 💰 **Costo de traslado** automático basado en distancia
- 🎯 **Marcador de ALMA Kids** siempre visible
- 📱 **Responsive** para móviles

### 📊 Cálculo de Traslado:
- **0-10 km**: GRATIS (zona de cobertura)
- **11-30 km**: $15,000
- **31-50 km**: $25,000  
- **50+ km**: $35,000

### 🎯 Integración Completa:
- ✅ Se integra con el formulario de cotización
- ✅ Guarda coordenadas GPS exactas
- ✅ Genera enlace de Google Maps
- ✅ Muestra distancia y costo en tiempo real
- ✅ Notificaciones visuales profesionales

## 📱 EXPERIENCIA DE USUARIO

### Flujo Completo:
1. Cliente hace clic en botón "Mapa" 🗺️
2. Se abre modal con mapa interactivo
3. Cliente busca o hace clic en ubicación
4. Sistema calcula distancia y costo automáticamente
5. Cliente confirma ubicación
6. Se guarda en formulario con todos los datos

### Información Guardada:
- ✅ Dirección completa formateada
- ✅ Coordenadas GPS (lat, lng)
- ✅ Enlace directo a Google Maps
- ✅ Distancia desde Machalí
- ✅ Costo de traslado calculado

## 🔧 PERSONALIZACIÓN

### Cambiar Ubicación Base de ALMA Kids:
En `google-maps-integration.js` línea 8:
```javascript
this.almakidsLocation = { lat: -34.1833, lng: -70.6500 }; // Machalí actual
```

### Cambiar Costos de Traslado:
En función `calculateDistance()` líneas 380-390:
```javascript
let travelCost = 0;
if (distance <= 10) {
    travelCost = 0;        // Cambiar aquí
} else if (distance <= 30) {
    travelCost = 15000;    // Cambiar aquí
} else if (distance <= 50) {
    travelCost = 25000;    // Cambiar aquí
} else {
    travelCost = 35000;    // Cambiar aquí
}
```

## 🎨 PERSONALIZACIÓN VISUAL

### Colores del Mapa:
El mapa usa los colores de ALMA Kids:
- **Rosa principal**: #E91E63
- **Verde confirmación**: #27ae60
- **Azul información**: #17a2b8

### Responsive:
- **Desktop**: Modal grande con mapa completo
- **Móvil**: Modal adaptado, botones grandes

## ⚡ PRÓXIMAS MEJORAS

1. **Integración con Waze** para rutas optimizadas
2. **Historial de ubicaciones** frecuentes
3. **Sugerencias automáticas** basadas en zona
4. **Mapa de calor** de eventos realizados
5. **Integración con calendario** para mostrar eventos cercanos

---

## 🚀 ACTIVACIÓN INMEDIATA

### Opción 1: Google Maps (Recomendado)
1. Seguir pasos 1-4 arriba
2. Reemplazar API key en el código
3. ¡Listo para usar!

### Opción 2: OpenStreetMap (Gratis)
- Ya está configurado como fallback
- No requiere configuración adicional
- Funciona inmediatamente

---

🗺️ **¡El sistema está listo para hacer que ALMA Kids tenga la mejor experiencia de selección de ubicación del mercado!** ✨


