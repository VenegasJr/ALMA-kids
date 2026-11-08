/**
 * =========================================================================
 * 🏷️ ALMA KIDS - CATÁLOGO OFICIAL 2026 DE PRODUCTOS Y PRECIOS
 * =========================================================================
 * Sincronizado 100% con el diseño oficial de Canva:
 * https://www.canva.com/design/DAG161rnq4Y/lAAt-2ca7zx2ZlUqGP6LKw
 * 
 * 📝 ¿CÓMO EDITAR UN PRECIO O PAUSAR UN PRODUCTO?
 * 1. Busca el producto en la lista.
 * 2. Modifica el valor numérico en "precio: XXXXX" (solo números, sin puntos ni $).
 * 3. Para ocultar un juego temporalmente, cambia 'activo: true' por 'activo: false'.
 * 4. Guarda el archivo ¡y la web se actualizará automáticamente!
 * =========================================================================
 */

window.CATALOGO_PRODUCTOS = [
    // -------------------------------------------------------------------------
    // 👑 CATEGORÍA: PACKS Y SETS TODO INCLUIDO
    // -------------------------------------------------------------------------
    {
        id: "pack-grand-peque",
        tamanoEspacio: "amplio",
        nombre: 'SET "GRAND-PEQUE" (Tope de Gama)',
        categoria: "packs",
        categoriaNombre: "Pack VIP Completo",
        precio: 210000,
        badge: "👑 EXPERIENCIA MÁXIMA GRAND",
        destacado: true,
        imagen: "imagenes/set-grand-peque-catalogo.webp",
        imagenModal: "imagenes/set-grand-peque-catalogo.webp",
        altImagen: "Castillo, carpa tipi, piscina y motricidad del set Grand-Peque",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "6.0m × 6.0m mínimo (Castillo: 5.0m × 4.0m × 2.80m)",
        edadesRecomendadas: "2 a 7 años",
        resumen: "El set más grande, majestuoso y fotografiable de ALMA Kids. Combina el imponente Castillo Grand-Peque blanco con plaza blanda completa, motricidad, saltarines, tipi y máquina de burbujas.",
        incluye: [
            "1. Castillo Inflable 'GRAND-PEQUE' (5.0m × 4.0m × 2.80m)",
            "2. Piscina blanca de espuma con pelotas (1.50m × 1.50m × 0.40m)",
            "3. Set de Motricidad sensorial (Escala + túnel + cuña)",
            "4. Saltarín o Balancín Unicornio",
            "5. Saltarín o Balancín Caballo café",
            "6. Carpa Tipi decorativa aesthetic",
            "7. Cojines decorativos (01 und, 02 a elección)",
            "8. Alfombra para carpa tipi (Celeste, Gris o Rosa)",
            "9. Máquina de burbujas profesional + líquido 700ml",
            "10. Alfombra Tatami protectora 8.64 m² (Rosa/Blanco o Beige/Gris)",
            "11. Rincón zapatero para mantener el orden",
            "12. Montaje y retiro puntual a cargo del equipo"
        ],
        requisitos: "Superficie amplia nivelada de 6x6m limpia y seca. Conexión eléctrica a ≤10m. No incluye decoración."
    },
    {
        id: "pack-maximo",
        tamanoEspacio: "mediano",
        nombre: 'SET "MÁXIMO" Todo Incluido',
        categoria: "packs",
        categoriaNombre: "Pack Todo Incluido",
        precio: 160000,
        badge: "🏆 EL MÁS COMPLETO",
        destacado: true,
        imagen: "imagenes/producto-pack-maximo-real.jpg",
        imagenModal: "imagenes/producto-pack-maximo-real.jpg",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "3.5m × 2.5m mínimo",
        edadesRecomendadas: "1 a 6 años",
        resumen: "La experiencia favorita de las familias: incluye 12 componentes premium combinando castillo inflable con piscina, piscina de espuma independiente, motricidad, saltarines, tipi y burbujas.",
        incluye: [
            "1. Castillo Inflable 'ROSA' o 'PEQUE' con piscina incluida (2.8m × 2.53m × 2.30m)",
            "2. Piscina blanca de espuma con pelotas (1.50m × 1.50m × 0.40m)",
            "3. Set de Motricidad sensorial (Escala + túnel + cuña)",
            "4. Saltarín o Balancín Unicornio (a elección)",
            "5. Saltarín o Balancín Caballo café (a elección)",
            "6. Carpa Tipi decorativa",
            "7. Cojines decorativos (01 und, 02 a elección)",
            "8. Alfombra para tipi (Celeste, Gris o Rosa)",
            "9. Máquina de burbujas profesional + líquido 700ml",
            "10. Alfombra Tatami 8.64 m² (Rosa/Blanco o Beige/Gris)",
            "11. Rincón zapatero para calzado",
            "12. Montaje, sanitización y retiro incluidos"
        ],
        requisitos: "Superficie limpia, seca y nivelada. Punto de corriente a ≤10m. No incluye decoración."
    },
    {
        id: "set-alma-magic",
        nombre: 'SET "ALMA MAGIC"',
        categoria: "packs",
        categoriaNombre: "Pack Inflable + Plaza",
        precio: 150000,
        badge: "✨ DIVERSIÓN MÁGICA",
        destacado: true,
        imagen: "imagenes/set-alma-magic-catalogo.webp",
        imagenModal: "imagenes/set-alma-magic-catalogo.webp",
        altImagen: "Montaje del set ALMA Magic con castillo, piscina y motricidad",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "3.5m × 2.5m mínimo",
        edadesRecomendadas: "1 a 6 años",
        resumen: "Diversión mágica con castillo inflable 'PEQUE' con piscina integrada, piscina blanca de espuma independiente, motricidad suave sensorial, saltarines y tatami extendido.",
        incluye: [
            "1. Piscina blanca de espuma de pelotas (1.50m × 1.50m × 0.40m)",
            "2. Set de Motricidad: Escala + túnel + cuña",
            "3. Saltarín o Balancín Unicornio",
            "4. Saltarín o Balancín Caballo café",
            "5. Castillo Inflable 'PEQUE' con piscina incluida",
            "6. Alfombra Tatami 8.64 m² incluida (Rosa/Blanco o Beige/Gris)",
            "7. Rincón zapatero",
            "8. Montaje y retiro de los juegos"
        ],
        requisitos: "Punto de corriente a ≤10m. Superficie limpia, seca y nivelada. No incluye decoración."
    },
    {
        id: "set-alma-active",
        nombre: 'SET "ALMA ACTIVE"',
        categoria: "packs",
        categoriaNombre: "Pack Plaza Blanda & Tipi",
        precio: 130000,
        badge: "🔥 FAVORITO PLAZA BLANDA",
        destacado: true,
        imagen: "imagenes/set-magic.webp",
        imagenModal: "imagenes/set-magic.webp",
        altImagen: "Montaje del set ALMA Active con piscina, motricidad y carpa tipi",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "3.5m × 2.5m mínimo",
        edadesRecomendadas: "6 meses a 5 años",
        resumen: "El set sensorial más completo sin necesidad de turbina eléctrica: piscina de pelotas blanca, set de motricidad, saltarines, carpa tipi con cojines y alfombra tatami.",
        incluye: [
            "1. Piscina blanca de espuma con pelotas (1.50m × 1.50m × 0.40m)",
            "2. Set de Motricidad sensorial (Escala + túnel + cuña)",
            "3. Saltarín unicornio",
            "4. Saltarín caballo café",
            "5. Carpa Tipi decorativa",
            "6. Cojines decorativos (01 und, 02 a elección)",
            "7. Alfombra para carpa tipi (Celeste, Gris o Rosa)",
            "8. Alfombra Tatami 8.64 m² incluida (Rosa/Blanco o Beige/Gris)",
            "9. Rincón zapatero",
            "10. Montaje y retiro de los juegos"
        ],
        requisitos: "Superficie limpia, seca y nivelada. No requiere conexión eléctrica. No incluye decoración."
    },
    {
        id: "set-duo",
        nombre: 'SET "DUO" (Castillo + Piscina)',
        categoria: "packs",
        categoriaNombre: "Pack Dúo Clásico",
        precio: 120000,
        badge: "🎈 DÚO FAVORITO",
        destacado: false,
        imagen: "imagenes/producto-set-duo-real.jpg",
        imagenModal: "imagenes/producto-set-duo-real.jpg",
        altImagen: "Castillo inflable Grand-Peque y piscina de pelotas del Set Dúo",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "3.5m × 2.5m mínimo",
        edadesRecomendadas: "1 a 6 años",
        resumen: "La combinación clásica más cotizada: Castillo inflable a elección ('PEQUE' o 'ROSA') con piscina integrada más una piscina de espuma blanca independiente con tatami y zapatero.",
        incluye: [
            "1. Castillo Inflable modelo 'PEQUE' o 'ROSA' con piscina incluida",
            "2. Piscina de pelotas de espuma blanca (1.50m × 1.50m × 0.40m)",
            "3. Alfombra Tatami 4.32 m² incluida (Rosa/Blanco o Beige/Gris)",
            "4. Rincón zapatero",
            "5. Montaje y retiro de los juegos incluidos"
        ],
        requisitos: "Conexión eléctrica a ≤10m. Superficie limpia, seca y nivelada. No incluye decoración."
    },
    {
        id: "pack-alma-mini-play",
        tamanoEspacio: "compacto",
        nombre: 'SET "ALMA MINI PLAY"',
        categoria: "packs",
        categoriaNombre: "Especial Primera Infancia",
        precio: 100000,
        badge: "👶 ESPECIAL BEBÉS",
        destacado: true,
        imagen: "imagenes/producto-set-mini-play-real.jpg",
        imagenModal: "imagenes/producto-set-mini-play-real.jpg",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "2.5m × 2.5m mínimo",
        edadesRecomendadas: "6 meses a 3 años",
        resumen: "Diseñado especialmente para cumpleaños de 1 a 3 años y baby showers: piscina blanca de espuma, motricidad sensorial, cojines y alfombra tatami acolchada de 8.64m².",
        incluye: [
            "1. Set de Motricidad sensorial (Escala + túnel + cuña)",
            "2. Piscina blanca de espuma con pelotas (1.50m × 1.50m × 0.40m)",
            "3. Alfombra Tatami 8.64 m² incluida (Rosa/Blanco o Beige/Gris)",
            "4. Rincón zapatero",
            "5. Cojines decorativos (01 und, 02 a elección)",
            "6. Alfombra suave (Celeste, Gris o Rosa)",
            "7. Montaje y retiro de los juegos"
        ],
        requisitos: "Espacio de 2.5m × 2.5m limpio y nivelado. No requiere electricidad. No incluye decoración."
    },

    // -------------------------------------------------------------------------
    // 🏰 CATEGORÍA: CASTILLOS INFLABLES
    // -------------------------------------------------------------------------
    {
        id: "castillo-grand-peque",
        nombre: "Castillo Inflable GRAND-PEQUE Blanco",
        categoria: "castillos",
        categoriaNombre: "Castillo Inflable",
        precio: 90000,
        badge: "📸 TOP FOTOGRAFÍA",
        destacado: true,
        imagen: "imagenes/producto-castillo-grand-peque-real.jpg",
        imagenModal: "imagenes/producto-castillo-grand-peque-real.jpg",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "Juego: 5.0m × 4.0m × 2.80m (Espacio mín: 6m × 6m)",
        edadesRecomendadas: "2 a 7 años",
        resumen: "El castillo más amplio e imponente. Blanco impoluto neutral, ideal para guirnaldas de globos, decoraciones chic y fotografías inolvidables.",
        incluye: [
            "1. Castillo Inflable 'GRAND-PEQUE' (5m × 4m × 2.80m)",
            "2. Turbina eléctrica de inflado continuo y silencioso",
            "3. Alfombra Tatami 4.32 m² incluida (Rosa/Blanco o Beige/Gris)",
            "4. Rincón zapatero",
            "5. Montaje y retiro puntual a cargo del equipo"
        ],
        requisitos: "Conexión eléctrica de 220V a ≤10m. Superficie limpia, seca y nivelada de 6x6m. No incluye decoración."
    },
    {
        id: "castillo-rosa",
        nombre: "Castillo Inflable ROSA Pastel",
        categoria: "castillos",
        categoriaNombre: "Castillo Inflable",
        precio: 75000,
        badge: "💖 ELEGANTE Y TIERNO",
        destacado: false,
        imagen: "imagenes/castillo-rosa.png",
        imagenModal: "imagenes/castillo-rosa.png",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "Juego: 2.8m × 2.53m × 2.30m (Espacio mín: 2.5m × 2.5m)",
        edadesRecomendadas: "1 a 6 años",
        resumen: "El favorito de las niñas: diseño sofisticado en rosa pastel con piscina de pelotas integrada. Muy fotogénico y seguro para capturar recuerdos mágicos.",
        incluye: [
            "1. Castillo Inflable 'ROSA' con piscina integrada",
            "2. Pelotas a elección en tonos pastel",
            "3. Turbina eléctrica y protecciones de seguridad",
            "4. Alfombra Tatami 4.32 m² incluida (Rosa/Blanco o Beige/Gris)",
            "5. Rincón zapatero",
            "6. Montaje y retiro de castillo"
        ],
        requisitos: "Punto de corriente a ≤10m. Espacio limpio y nivelado de 2.5x2.5m. No incluye decoración."
    },
    {
        id: "castillo-peque",
        nombre: "Castillo Inflable PEQUE Neutro",
        categoria: "castillos",
        categoriaNombre: "Castillo Inflable",
        precio: 75000,
        badge: "🎯 CLÁSICO VERSÁTIL",
        destacado: false,
        imagen: "imagenes/producto-castillo-peque-real.jpg",
        imagenModal: "imagenes/producto-castillo-peque-real.jpg",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "Juego: 2.90m × 2.80m × 2.30m (Espacio mín: 2.5m × 2.5m)",
        edadesRecomendadas: "1 a 6 años",
        resumen: "Tonos neutros elegantes (blanco y beige) con piscina cuadrada integrada. Combina perfecto con cualquier paleta o temática de celebración.",
        incluye: [
            "1. Castillo Inflable 'PEQUE' con piscina cuadrada incluida",
            "2. Pelotas a elección",
            "3. Turbina eléctrica y anclajes",
            "4. Alfombra Tatami 4.32 m² incluida (Rosa/Blanco o Beige/Gris)",
            "5. Rincón zapatero",
            "6. Montaje y retiro de castillo"
        ],
        requisitos: "Punto de corriente a ≤10m. Superficie limpia y nivelada. No incluye decoración."
    },

    // -------------------------------------------------------------------------
    // 🧸 CATEGORÍA: PLAZA BLANDA & PISCINAS
    // -------------------------------------------------------------------------
    {
        id: "piscina-pelotas-espuma",
        nombre: "Piscina de Pelotas Blanca de Espuma",
        categoria: "plaza",
        categoriaNombre: "Plaza Blanda",
        precio: 65000,
        badge: "👶 100% ESPUMA SEGURA",
        destacado: false,
        imagen: "imagenes/producto-piscina-rosa-clean.jpg",
        imagenModal: "imagenes/producto-piscina-rosa-clean.jpg",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "1.50m × 1.50m × 0.40m (Espacio mín: 2m × 2m)",
        edadesRecomendadas: "Desde 6 meses",
        resumen: "Transforma cualquier celebración en un espacio de diversión segura y encantadora con nuestra piscina de pelotas blanca de espuma suave de alta densidad.",
        incluye: [
            "1. Piscina blanca de espuma de pelotas (1.50m × 1.50m × 0.40m)",
            "2. Pelotas no tóxicas en colores a elección (Rosa, Celeste, Blanco, Transparentes)",
            "3. Alfombra Tatami 4.32 m² incluida (Rosa/Blanco o Beige/Gris)",
            "4. Rincón zapatero",
            "5. Montaje y retiro de piscina"
        ],
        requisitos: "Superficie limpia, seca y nivelada. No incluye decoración."
    },
    {
        id: "set-motricidad",
        nombre: "Set Túnel de Motricidad Sensorial",
        categoria: "plaza",
        categoriaNombre: "Plaza Blanda",
        precio: 30000,
        badge: "🧠 ESTIMULACIÓN TEMPRANA",
        destacado: false,
        imagen: "imagenes/portada-plaza-motricidad.webp",
        imagenModal: "imagenes/portada-plaza-motricidad.webp",
        duracion: "4 horas de juego",
        medidasEspacio: "2.0m × 1.5m",
        edadesRecomendadas: "1 a 4 años",
        resumen: "Favorece el gateo, equilibrio, coordinación y exploración segura de los más pequeños en un entorno 100% acolchado y lavable.",
        incluye: [
            "1. Escala de gateo acolchada",
            "2. Túnel sensorial de motricidad",
            "3. Cuña de equilibrio y deslizamiento",
            "4. Montaje y retiro incluidos"
        ],
        requisitos: "Superficie plana y limpia."
    },

    // -------------------------------------------------------------------------
    // 🎈 CATEGORÍA: SERVICIOS ADICIONALES & MAGIA
    // -------------------------------------------------------------------------
    {
        id: "maquina-burbujas",
        nombre: "Máquina de Burbujas",
        categoria: "adicionales",
        categoriaNombre: "Efectos & Magia",
        precio: 16000,
        etiquetaPrecio: "Solo arriendo de la máquina",
        suplemento: { nombre: "Líquido de burbujas (1 L)", precio: 6000 },
        badge: "🫧 EFECTO MÁGICO",
        destacado: false,
        imagen: "imagenes/maquina-burbujas-arriendo.webp",
        imagenModal: "imagenes/maquina-burbujas-arriendo.webp",
        altImagen: "Máquina de burbujas sola, como aparece en el catálogo de ALMA Kids",
        duracion: "3 horas de uso continuo",
        medidasEspacio: "Compacto",
        edadesRecomendadas: "Todas las edades",
        resumen: "Arriendo de la máquina de burbujas para tu evento. El líquido se vende por separado.",
        incluye: [
            "Máquina de burbujas automática de alto caudal",
            "Instalación y prueba operativa"
        ],
        requisitos: "Punto de corriente a 1 m o menos. Superficie limpia, seca y nivelada."
    },
    {
        id: "carpa-tipi",
        nombre: "Carpa Tipi Decorativa Aesthetic",
        categoria: "adicionales",
        categoriaNombre: "Rincón Boho",
        precio: 17000,
        badge: "🏕️ RINCÓN BOHO",
        destacado: false,
        imagen: "imagenes/producto-carpa-tipi-real.jpg",
        imagenModal: "imagenes/producto-carpa-tipi-real.jpg",
        duracion: "4 horas de uso",
        medidasEspacio: "1.60m de altura × 1.20m de base",
        edadesRecomendadas: "1 a 6 años",
        resumen: "Rincón cálido de descanso, lectura o fotos aesthetic con estructura en madera natural, telas con estrellas, cojines y alfombra suave.",
        incluye: [
            "Carpa Tipi en madera natural y lino estampado",
            "Alfombra suave a elección (Celeste, Gris o Rosa)",
            "Cojines decorativos a tono",
            "Montaje y retiro incluidos"
        ],
        requisitos: "Espacio protegido del viento."
    },
    {
        id: "saltarin-balancin",
        nombre: "Saltarines & Balancines Infantiles",
        categoria: "adicionales",
        categoriaNombre: "Juegos Individuales",
        precio: 16000,
        badge: "🦄 DIVERSIÓN PURA",
        destacado: false,
        imagen: "imagenes/saltarines-catalogo.webp",
        imagenModal: "imagenes/saltarines-catalogo.webp",
        altImagen: "Caballo saltarín y unicornio balancín del catálogo",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "Compacto",
        edadesRecomendadas: "1 a 4 años",
        resumen: "Juguetes ergonómicos y seguros para estimular el equilibrio y la motricidad: Caballo saltarín café ($16.000), Unicornio balancín ($18.000) o Caballo balancín café ($18.000).",
        incluye: [
            "Saltarín o Balancín a elección limpio y sanitizado",
            "Material suave y de alta resistencia",
            "Uso durante toda la duración del arriendo"
        ],
        requisitos: "Superficie plana."
    },
    {
        id: "cartel-bienvenida",
        nombre: "Cartel de Bienvenida Personalizado",
        categoria: "adicionales",
        categoriaNombre: "Papelería & Deco",
        precio: 25000,
        etiquetaPrecio: "Precio desde",
        badge: "🎨 PERSONALIZADO",
        destacado: false,
        imagen: "imagenes/cartel-bienvenida-catalogo.webp",
        imagenModal: "imagenes/cartel-bienvenida-ejemplos.webp",
        altImagen: "Ejemplos de carteles de bienvenida del catálogo de ALMA Kids",
        duracion: "Recuerdo para la familia",
        medidasEspacio: "60×90 cm / 80×120 cm / 100×150 cm",
        edadesRecomendadas: "Todas las edades",
        resumen: "Personaliza el cartel de tu evento con nombre, temática y colores exclusivos (Princesas, Dinosaurios, Safari, Autos, Espacio, etc.).",
        incluye: [
            "Diseño temático exclusivo con el nombre y datos del festejado",
            "Opción Pequeño 60 × 90 cm ($25.000)",
            "Opción Mediano 80 × 120 cm ($35.000)",
            "Opción Grande 100 × 150 cm ($45.000)",
            "Confirmación previa de diseño y tiempos de entrega"
        ],
        requisitos: "Solicitar con al menos 10 días de anticipación."
    },
    {
        id: "supervision-monitor",
        nombre: "Supervisión Profesional por Monitor",
        categoria: "adicionales",
        categoriaNombre: "Tranquilidad Total",
        precio: 30000,
        etiquetaPrecio: "Valor del servicio",
        badge: "🛡️ TRANQUILIDAD PADRES",
        destacado: false,
        imagen: "imagenes/supervision-monitor.svg",
        imagenModal: "imagenes/supervision-monitor.svg",
        altImagen: "Ilustración del servicio de supervisión, con un ojo dentro de un escudo",
        duracion: "4 horas de evento",
        medidasEspacio: "No aplica",
        edadesRecomendadas: "Todas las edades",
        resumen: "¿Quieres relajarte? Agrega supervisión profesional con un monitor dedicado exclusivamente a velar por el orden, turnos y seguridad de los niños.",
        incluye: [
            "Personal capacitado y comprometido",
            "Control de capacidad máxima y turnos en los juegos",
            "Asistencia a los más pequeños al subir y bajar",
            "Acompañamiento continuo durante 4 horas"
        ],
        requisitos: "Coordinar con anticipación a la fecha del evento."
    }
];

// Hacer disponible globalmente en todos los contextos
if (typeof window !== 'undefined') {
    window.CATALOGO_PRODUCTOS = window.CATALOGO_PRODUCTOS || [];
}
var CATALOGO_PRODUCTOS = (typeof window !== 'undefined') ? window.CATALOGO_PRODUCTOS : [];
