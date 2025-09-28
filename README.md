# 🎪 ALMA Kids - Entretenciones Infantiles

![ALMA Kids Logo](imagenes/ALMA%20kids%20Logo%20web.png)

## 📋 Descripción del Proyecto

**ALMA Kids Entretenciones Infantiles Ltda.** es una empresa especializada en entretenimiento infantil, ofreciendo servicios de arriendo de juegos inflables, plaza blanda y decoración con globos metalizados para fiestas infantiles en Machalí y toda la Región de O'Higgins.

### 🎯 Misión
Crear recuerdos mágicos, únicos y divertidos para toda la vida, transformando cualquier espacio en un mundo de diversión, descubrimiento, aventura sana y segura para nuestros pequeños de 6 meses a 7 años.

## 🌟 Servicios Principales

### 🏰 Castillo Inflable
- Ideal para niños de 6 meses a 7 años
- Materiales seguros y certificados
- Diseño con colores neutros
- Supervisión adulta requerida

### 🏊‍♀️ Plaza Blanda
- Zona de juegos segura con pelotas
- Medidas: 150x150x40cm
- Disponible en colores azules y rosadas
- Estimulación sensorial y desarrollo motor

### 🎈 Globos Metalizados
- Más de 68 diseños únicos
- Temáticas: superhéroes, princesas, animales, deportes
- Decoración personalizada
- Alta calidad y durabilidad

## 🚀 Características del Sitio Web

### ✨ Funcionalidades
- **Diseño Responsivo**: Optimizado para móviles, tablets y desktop
- **PWA (Progressive Web App)**: Instalable en dispositivos móviles
- **Sistema de Carrito**: Cotización interactiva de servicios
- **Modal de Imágenes**: Galería con navegación avanzada
- **Formulario de Contacto**: Integración con EmailJS
- **Integración WhatsApp**: Botón flotante para contacto directo
- **SEO Optimizado**: Schema markup y meta tags completos
- **Analytics**: Google Analytics 4 integrado
- **Accesibilidad**: Cumple estándares WCAG

### 🛠️ Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con animaciones
- **JavaScript ES6+**: Funcionalidades interactivas
- **EmailJS**: Sistema de correos
- **Google Maps**: Integración de ubicaciones
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografía Poppins

## 📁 Estructura del Proyecto

```
ALMA-kids-Web/
├── 📄 index.html              # Página principal
├── 📄 eventos.html            # Página de eventos
├── 📄 globos-metalizados.html # Catálogo de globos
├── 📄 faq.html               # Preguntas frecuentes
├── 📄 manifest.json          # Configuración PWA
├── 🎨 styles.css             # Estilos principales
├── 🎨 animations.css         # Animaciones CSS
├── 🎨 visual-fixes.css       # Correcciones visuales
├── 🎨 layout-fixes.css       # Correcciones de layout
├── ⚡ script.js              # JavaScript principal
├── ⚡ animations.js          # Sistema de animaciones
├── ⚡ form-enhancer.js       # Mejoras del formulario
├── ⚡ email-system.js        # Sistema de correos
├── ⚡ google-maps-integration.js # Integración mapas
├── ⚡ emergency-functions.js # Funciones de emergencia
├── 📱 sw.js                  # Service Worker
├── 🖼️ imagenes/              # Imágenes principales
├── 🎈 imagenes globos decoracion/ # Catálogo de globos
└── 📄 robots.txt             # Configuración SEO
```

## 🌍 Cobertura de Servicios

### 🏠 Zona Principal
- **Machalí** (Base de operaciones)

### 🚚 Zonas de Cobertura
- Rancagua
- Rengo
- Coya
- Codegua
- Olivar
- Gultro
- Los Lirios
- Graneros

## 📞 Información de Contacto

### 📱 Teléfonos
- **WhatsApp**: [+56 9 6907 3306](https://wa.me/56969073306)
- **Teléfono**: +56 9 2060 9796

### 📧 Email
- **Contacto**: info.almakids@gmail.com

### 🕒 Horarios
- **Atención**: Lunes a Domingo 8:00 - 20:00 hrs

### 🌐 Redes Sociales
- **Instagram**: [@alma.kidscl](https://www.instagram.com/alma.kidscl)
- **Facebook**: [ALMA Kids](https://www.facebook.com/profile.php?id=61580273574247)

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos
- Navegador web moderno
- Servidor web (opcional para desarrollo local)

### 🔧 Instalación Local
1. Clona el repositorio:
```bash
git clone https://github.com/VenegasJr/ALMA-kids.git
```

2. Navega al directorio:
```bash
cd ALMA-kids
```

3. Abre el archivo `index.html` en tu navegador o usa un servidor local:
```bash
# Con Python
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

## 🎨 Personalización

### 🖼️ Imágenes
- Reemplaza las imágenes en la carpeta `imagenes/`
- Mantén las proporciones recomendadas
- Optimiza las imágenes para web

### 🎨 Colores
Los colores principales están definidos en `styles.css`:
- **Primario**: #E91E63 (Rosa)
- **Secundario**: #FFF0F5 (Rosa claro)
- **Acento**: #4CAF50 (Verde)

### 📧 Configuración de Email
Configura EmailJS en `emailjs-config.js`:
```javascript
const EMAILJS_SERVICE_ID = 'tu_service_id';
const EMAILJS_TEMPLATE_ID = 'tu_template_id';
const EMAILJS_PUBLIC_KEY = 'tu_public_key';
```

## 📊 SEO y Performance

### 🔍 Optimizaciones SEO
- Schema markup estructurado
- Meta tags optimizados
- Sitemap XML incluido
- Robots.txt configurado
- URLs amigables

### ⚡ Performance
- Lazy loading de imágenes
- Minificación de CSS/JS
- Service Worker para caché
- Optimización de recursos

## 🛡️ Seguridad

### 🔒 Características de Seguridad
- Validación de formularios
- Sanitización de inputs
- HTTPS requerido en producción
- Headers de seguridad

## 📱 PWA (Progressive Web App)

### ✨ Características PWA
- Instalable en dispositivos móviles
- Funciona offline
- Service Worker para caché
- Manifest configurado
- Shortcuts de acceso rápido

## 🤝 Contribución

### 📝 Cómo Contribuir
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 🐛 Reportar Bugs
Si encuentras algún bug, por favor:
1. Verifica que no haya sido reportado anteriormente
2. Crea un issue con descripción detallada
3. Incluye pasos para reproducir el problema
4. Adjunta capturas de pantalla si es necesario

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **ALMA Kids** por confiar en nosotros para su presencia digital
- **Comunidad** de desarrolladores por las librerías utilizadas
- **Clientes** por sus valiosos comentarios y sugerencias

## 📈 Roadmap

### 🔮 Próximas Funcionalidades
- [ ] Sistema de reservas online
- [ ] Galería de fotos de eventos
- [ ] Testimonios de clientes
- [ ] Blog de consejos para fiestas
- [ ] App móvil nativa
- [ ] Sistema de pagos online
- [ ] Chat en vivo
- [ ] Calendario de disponibilidad

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:
- **Email**: info.almakids@gmail.com
- **WhatsApp**: [+56 9 6907 3306](https://wa.me/56969073306)

---

**© 2025 ALMA Kids Entretenciones Infantiles Ltda. Todos los derechos reservados.**

*¡Donde los sueños se inflan y la diversión nunca termina!* 🎪✨
