/**
 * =========================================================================
 * 🏷️ ALMA KIDS - CATÁLOGO DE PRODUCTOS Y PRECIOS EDITABLE
 * =========================================================================
 * 
 * 📝 ¿CÓMO CAMBIAR UN PRECIO O EDITAR UN PRODUCTO?
 * 1. Busca el producto que deseas actualizar en la lista de abajo.
 * 2. Modifica el número en "precio: XXXXX".
 *    👉 Ejemplo: si 'precio: 150000' sube a 160 mil, pon 'precio: 160000'.
 *    ⚠️ Importante: Escribe solo números (sin puntos, sin comas y sin el signo $).
 * 3. Si quieres pausar u ocultar un producto temporalmente, cambia 'activo: true' a 'activo: false'.
 * 4. Guarda el archivo (Ctrl+S o Cmd+S) ¡y la web se actualizará sola!
 * 
 * =========================================================================
 */

const CATALOGO_PRODUCTOS = [
    // -------------------------------------------------------------------------
    // 👑 CATEGORÍA: PACKS TODO INCLUIDO
    // -------------------------------------------------------------------------
    {
        id: "pack-maximo",
        nombre: 'SET "MÁXIMO" Todo Incluido',
        categoria: "packs",
        categoriaNombre: "Pack Todo Incluido",
        precio: 150000,
        badge: "🏆 EL MÁS COMPLETO",
        destacado: true,
        imagen: "imagenes/set-magic.webp",
        imagenModal: "Catalogo ALMA kids Ltda/ALMA MAGIC.png",
        duracion: "4 horas de diversión",
        medidasEspacio: "3.5m × 2.5m mínimo",
        edadesRecomendadas: "1 a 6 años",
        resumen: "La experiencia definitiva con 12 componentes premium para que tu evento sea inolvidable y no te preocupes de nada.",
        incluye: [
            "Castillo Inflable a elección (Rosa o Peque) con piscina",
            "Piscina blanca de espuma con pelotas a elección",
            "Set de Motricidad sensorial (escala + túnel + cuña)",
            "2 Saltarines (unicornio blanco y caballito café)",
            "Carpa Tipi decorativa con alfombra suave",
            "Máquina de burbujas profesional + 700ml de líquido",
            "Cojines decorativos suaves",
            "Alfombra Tatami protectora (Rosa/Blanco o Beige/Gris)",
            "Rincón zapatero para mantener el orden",
            "Montaje, sanitización y retiro puntual incluidos"
        ],
        requisitos: "Terreno plano y limpio, conexión eléctrica a máximo 10 metros."
    },
    {
        id: "set-alma-active",
        nombre: 'SET "ALMA ACTIVE"',
        categoria: "packs",
        categoriaNombre: "Pack Todo Incluido",
        precio: 130000,
        badge: "🔥 MÁS POPULAR",
        destacado: true,
        imagen: "imagenes/set-active.webp",
        imagenModal: "Catalogo ALMA kids Ltda/ALMA ACTIVE.png",
        duracion: "4 horas de diversión",
        medidasEspacio: "3.5m × 2.5m mínimo",
        edadesRecomendadas: "1 a 6 años",
        resumen: "Diversión activa garantizada: combina castillo, piscina, motricidad y saltarines en un solo set estético.",
        incluye: [
            "Castillo Inflable 'PEQUE' o 'ROSA' con piscina integrada",
            "Piscina blanca de espuma con pelotas (1.50m × 1.50m × 0.40m)",
            "Set de Motricidad sensorial (escala + túnel + cuña)",
            "Saltarín unicornio",
            "Saltarín caballo café",
            "Alfombra Tatami protectora",
            "Rincón zapatero",
            "Montaje y retiro a cargo de ALMA Kids"
        ],
        requisitos: "Conexión eléctrica a máx 10m. Espacio libre nivelado."
    },
    {
        id: "set-alma-party",
        nombre: 'SET "ALMA PARTY"',
        categoria: "packs",
        categoriaNombre: "Pack Todo Incluido",
        precio: 110000,
        badge: "🎉 PACK FIESTA",
        destacado: false,
        imagen: "imagenes/Plaza-blanda-castillo-rosas.webp",
        imagenModal: "Catalogo ALMA kids Ltda/CASTILLO INFLABLE ROSA.png",
        duracion: "4 horas de diversión",
        medidasEspacio: "3.0m × 3.0m mínimo",
        edadesRecomendadas: "1 a 6 años",
        resumen: "Especial para celebraciones temáticas: Castillo inflable rosa con set de motricidad y tatami.",
        incluye: [
            "Castillo Inflable Rosa Pastel (2.8m × 2.53m × 2.30m)",
            "Set de Motricidad sensorial (escala + túnel + cuña)",
            "Alfombra Tatami protectora",
            "Rincón zapatero",
            "Montaje y retiro incluidos"
        ],
        requisitos: "Punto de corriente normal de 220V."
    },
    {
        id: "pack-alma-mini-play",
        nombre: 'PACK "ALMA MINI PLAY"',
        categoria: "packs",
        categoriaNombre: "Pack Todo Incluido",
        precio: 90000,
        badge: "👶 ESPECIAL BEBÉS",
        destacado: true,
        imagen: "imagenes/set-mini.webp",
        imagenModal: "Catalogo ALMA kids Ltda/ALMA MINI PLAY.png",
        duracion: "4 horas de uso",
        medidasEspacio: "2.5m × 2.5m mínimo",
        edadesRecomendadas: "6 meses a 3 años",
        resumen: "Diseñado especialmente para los más pequeñitos, cumpleaños de 1 a 3 años y baby showers.",
        incluye: [
            "Piscina blanca de espuma suave con pelotas (1.50m × 1.50m)",
            "Set de Motricidad suave (escala de gateo + túnel + cuña)",
            "Alfombra Tatami protectora",
            "Rincón zapatero",
            "Cojines decorativos y alfombra suave",
            "Montaje y retiro incluido"
        ],
        requisitos: "Espacio techado o al aire libre en piso plano."
    },
    {
        id: "set-alma-plus",
        nombre: 'SET "ALMA PLUS"',
        categoria: "packs",
        categoriaNombre: "Pack Básico",
        precio: 80000,
        badge: "💫 BÁSICO PLUS",
        destacado: false,
        imagen: "imagenes/Nuestra Plaza blanda/Plaza-Blanda-Pelotas-Azules.png",
        imagenModal: "Catalogo ALMA kids Ltda/PISCINA DE PELOTAS.png",
        duracion: "4 horas de diversión",
        medidasEspacio: "2.0m × 2.0m",
        edadesRecomendadas: "6 meses a 4 años",
        resumen: "Piscina de pelotas con tatami y zapatero. Ideal como rincón de juegos o complemento de espacios pequeños.",
        incluye: [
            "Piscina de espuma blanca con pelotas (1.50m × 1.50m)",
            "Alfombra Tatami protectora",
            "Rincón zapatero",
            "Montaje y retiro incluido"
        ],
        requisitos: "Espacio limpio de 2x2 metros."
    },

    // -------------------------------------------------------------------------
    // 🏰 CATEGORÍA: CASTILLOS INFLABLES
    // -------------------------------------------------------------------------
    {
        id: "castillo-grand-peque",
        nombre: "Castillo Grand-Peque Blanco",
        categoria: "castillos",
        categoriaNombre: "Castillo Inflable",
        precio: 90000,
        badge: "📸 TOP FOTOGRAFÍA",
        destacado: true,
        imagen: "imagenes/portada-castillo-blanco.webp",
        imagenModal: "Catalogo ALMA kids Ltda/10.png",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "Juego: 5.0m × 4.0m × 2.8m (Requiere espacio 6m × 6m)",
        edadesRecomendadas: "2 a 7 años",
        resumen: "El castillo más grande e impactante de nuestro catálogo. Blanco impoluto neutral, perfecto para decoraciones chic y fotos inolvidables.",
        incluye: [
            "Castillo Inflable Blanco Impoluto premium",
            "Turbina eléctrica de inflado silenciosa y segura",
            "Pelotas de colores a elección",
            "Alfombra Tatami protectora",
            "Rincón zapatero",
            "Montaje y retiro a cargo del equipo"
        ],
        requisitos: "Conexión eléctrica de 220V a máximo 10 metros. Espacio libre de ramas o cables."
    },
    {
        id: "castillo-rosa",
        nombre: "Castillo Inflable ROSA Pastel",
        categoria: "castillos",
        categoriaNombre: "Castillo Inflable",
        precio: 75000,
        badge: "💖 ELEGANTE Y TIERNO",
        destacado: false,
        imagen: "Catalogo ALMA kids Ltda/CASTILLO INFLABLE ROSA.png",
        imagenModal: "Catalogo ALMA kids Ltda/CASTILLO INFLABLE ROSA.png",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "Juego: 2.8m × 2.5m × 2.3m (Requiere espacio 3.5m × 3.5m)",
        edadesRecomendadas: "1 a 6 años",
        resumen: "Diseño tierno y sofisticado en tono rosa pastel con piscina integrada redonda. Muy fotogénico para temáticas delicadas.",
        incluye: [
            "Castillo Inflable en tono rosa pastel",
            "Piscina integrada redonda con pelotas",
            "Turbina eléctrica y anclajes",
            "Alfombra Tatami y Rincón zapatero",
            "Montaje y retiro incluidos"
        ],
        requisitos: "Conexión eléctrica a máx 10m."
    },
    {
        id: "castillo-peque",
        nombre: "Castillo Inflable PEQUE Neutro",
        categoria: "castillos",
        categoriaNombre: "Castillo Inflable",
        precio: 75000,
        badge: "🎯 CLÁSICO VERSÁTIL",
        destacado: false,
        imagen: "imagenes/castillo-cuadrada.webp",
        imagenModal: "Catalogo ALMA kids Ltda/9.png",
        duracion: "4 horas de uso continuo",
        medidasEspacio: "Juego: 2.9m × 2.8m × 2.3m (Requiere espacio 3.5m × 3.5m)",
        edadesRecomendadas: "1 a 6 años",
        resumen: "Tonos neutros suaves (blanco, gris y beige) con piscina cuadrada integrada. Combina perfecto con cualquier temática.",
        incluye: [
            "Castillo Inflable Peque neutro",
            "Piscina cuadrada integrada con pelotas",
            "Turbina eléctrica y protecciones",
            "Alfombra Tatami y Rincón zapatero",
            "Montaje y retiro incluidos"
        ],
        requisitos: "Punto de corriente a máx 10m."
    },

    // -------------------------------------------------------------------------
    // 🧸 CATEGORÍA: PLAZA BLANDA & PISCINAS
    // -------------------------------------------------------------------------
    {
        id: "piscina-pelotas-espuma",
        nombre: "Piscina de Pelotas de Espuma",
        categoria: "plaza",
        categoriaNombre: "Plaza Blanda",
        precio: 60000,
        badge: "👶 100% ESPUMA SEGURA",
        destacado: false,
        imagen: "Catalogo ALMA kids Ltda/PISCINA DE PELOTAS.png",
        imagenModal: "Catalogo ALMA kids Ltda/PISCINA DE PELOTAS.png",
        duracion: "4 horas de juego",
        medidasEspacio: "1.50m × 1.50m × 0.40m",
        edadesRecomendadas: "Desde 6 meses",
        resumen: "Piscina de espuma suave de alta densidad, no tóxica y segura. Incluye 2 colores base de pelotas a elección.",
        incluye: [
            "Piscina de espuma de alta densidad lavable",
            "Pelotas no tóxicas en 2 colores base a elección",
            "Piso Tatami de protección acolchado",
            "Rincón zapatero",
            "Montaje y retiro incluidos"
        ],
        requisitos: "Espacio plano y seco."
    },
    {
        id: "set-motricidad",
        nombre: "Set de Motricidad Infantil",
        categoria: "plaza",
        categoriaNombre: "Plaza Blanda",
        precio: 25000,
        badge: "🧠 DESARROLLO MOTOR",
        destacado: false,
        imagen: "imagenes/portada-plaza-motricidad.webp",
        imagenModal: "imagenes/portada-plaza-motricidad.webp",
        duracion: "4 horas de juego",
        medidasEspacio: "2.0m × 1.5m",
        edadesRecomendadas: "1 a 4 años",
        resumen: "Favorece el gateo, equilibrio y exploración segura de los más pequeños.",
        incluye: [
            "Escala de motricidad acolchada",
            "Túnel de gateo sensorial",
            "Cuña de equilibrio y deslizamiento",
            "Montaje y retiro incluidos"
        ],
        requisitos: "Superficie plana."
    },

    // -------------------------------------------------------------------------
    // 🎈 CATEGORÍA: SERVICIOS ADICIONALES & MAGIA
    // -------------------------------------------------------------------------
    {
        id: "maquina-burbujas",
        nombre: "Máquina de Burbujas Profesional",
        categoria: "adicionales",
        categoriaNombre: "Efectos & Extras",
        precio: 15000,
        badge: "🫧 EFECTO MÁGICO",
        destacado: false,
        imagen: "imagenes/Maquina-burbuja.webp",
        imagenModal: "imagenes/Maquina-burbuja-.png",
        duracion: "Disponible durante todo el evento",
        medidasEspacio: "Compacto",
        edadesRecomendadas: "Todas las edades",
        resumen: "Más de 2.000 burbujas por minuto para fotos increíbles y momentos mágicos que fascinan a los niños.",
        incluye: [
            "Máquina de burbujas automática",
            "700ml de líquido especial no tóxico e hipoalergénico",
            "Instalación y prueba operativa"
        ],
        requisitos: "Enchufe eléctrico cercano."
    },
    {
        id: "carpa-tipi",
        nombre: "Carpa Tipi Decorativa Aesthetic",
        categoria: "adicionales",
        categoriaNombre: "Efectos & Extras",
        precio: 15000,
        badge: "🏕️ RINCÓN BOHO",
        destacado: false,
        imagen: "Servicios adicionales/carpa-tipi.webp",
        imagenModal: "Servicios adicionales/carpa-tipi-2.jpg",
        duracion: "4 horas de uso",
        medidasEspacio: "1.60m de altura × 1.20m de base",
        edadesRecomendadas: "1 a 6 años",
        resumen: "Rincón cálido de descanso, lectura o juego tranquilo con telas en lino natural, cojines y alfombra suave.",
        incluye: [
            "Carpa Tipi en madera natural y lino",
            "Alfombra suave de piso",
            "Cojines decorativos a tono",
            "Montaje y retiro"
        ],
        requisitos: "Espacio interior o exterior protegido del viento."
    },
    {
        id: "supervision-monitor",
        nombre: "Supervisión Profesional por Monitor",
        categoria: "adicionales",
        categoriaNombre: "Servicio Extra",
        precio: 30000,
        badge: "🛡️ TRANQUILIDAD PADRES",
        destacado: false,
        imagen: "imagenes/otros-servicios.webp",
        imagenModal: "imagenes/otros-servicios.webp",
        duracion: "4 horas de evento",
        medidasEspacio: "No aplica",
        edadesRecomendadas: "Todas las edades",
        resumen: "Monitor dedicado exclusivamente a cuidar la seguridad, turnos y orden de los niños en los juegos.",
        incluye: [
            "Personal capacitado en cuidado infantil",
            "Control de turnos y capacidad máxima",
            "Asistencia a los niños al subir y bajar",
            "Acompañamiento continuo durante 4 horas"
        ],
        requisitos: "Coordinar con anticipación a la fecha del evento."
    }
];

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.CATALOGO_PRODUCTOS = CATALOGO_PRODUCTOS;
}
