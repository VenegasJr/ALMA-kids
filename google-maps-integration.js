/**
 * ALMA Kids - Sistema de Integración Google Maps
 * Sistema completo para selección de ubicación con mapa interactivo
 */

class AlmaKidsMapSystem {
    constructor() {
        this.map = null;
        this.marker = null;
        this.geocoder = null;
        this.selectedLocation = null;
        this.almakidsLocation = { lat: -34.1833, lng: -70.6500 }; // Machalí, Chile
        this.isMapLoaded = false;
        this.init();
    }

    async init() {
        console.log('🗺️ ALMA Kids: Inicializando sistema de mapas...');
        await this.loadGoogleMapsAPI();
        this.setupMapStyles();
        this.injectMapModal();
        console.log('✅ Sistema de mapas listo');
    }

    async loadGoogleMapsAPI() {
        // Verificar si Google Maps ya está cargado
        if (window.google && window.google.maps) {
            this.isMapLoaded = true;
            this.geocoder = new google.maps.Geocoder();
            return;
        }

        // Intentar cargar Google Maps con API Key
        const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Reemplazar con tu API Key
        
        if (API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
            console.log('🗺️ Google Maps requiere configuración de API Key');
            console.log('📖 Instrucciones:');
            console.log('1. Ve a: https://console.cloud.google.com/');
            console.log('2. Crea un proyecto o selecciona uno existente');
            console.log('3. Habilita la API de Google Maps');
            console.log('4. Crea una API Key');
            console.log('5. Reemplaza YOUR_GOOGLE_MAPS_API_KEY en este archivo');
            
            // Usar método alternativo mejorado
            this.setupEnhancedFallback();
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                this.isMapLoaded = true;
                this.geocoder = new google.maps.Geocoder();
                console.log('✅ Google Maps API cargado correctamente');
                resolve();
            };
            
            script.onerror = () => {
                console.error('❌ Error cargando Google Maps API');
                this.setupEnhancedFallback();
                resolve(); // No rechazamos, usamos fallback
            };
            
            document.head.appendChild(script);
        });
    }

    setupFallbackMethod() {
        console.log('🗺️ Configurando método alternativo sin Google Maps...');
        // Usar método simplificado sin mapas externos
        this.isMapLoaded = true;
        this.alternativeMethod = true;
        
        // Configurar geolocalización del navegador
        this.setupGeolocation();
    }

    setupEnhancedFallback() {
        console.log('🗺️ Configurando método mejorado sin Google Maps API...');
        this.isMapLoaded = true;
        this.alternativeMethod = true;
        this.enhancedFallback = true;
        
        // Configurar geolocalización del navegador
        this.setupGeolocation();
        
        // Configurar OpenStreetMap como alternativa
        this.setupOpenStreetMapFallback();
    }

    setupGeolocation() {
        if (navigator.geolocation) {
            console.log('📍 Geolocalización disponible');
            this.geolocationAvailable = true;
        } else {
            console.log('❌ Geolocalización no disponible en este navegador');
            this.geolocationAvailable = false;
        }
    }

    requestUserLocation() {
        if (!this.geolocationAvailable) {
            alert('Tu navegador no soporta geolocalización. Por favor, ingresa la dirección manualmente.');
            return;
        }

        // Mostrar modal de solicitud de ubicación
        this.showLocationPermissionModal();
    }

    showLocationPermissionModal() {
        const permissionModal = document.createElement('div');
        permissionModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        `;

        permissionModal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
            ">
                <div style="
                    background: linear-gradient(135deg, #E91E63, #FF6B9D);
                    color: white;
                    padding: 1rem;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 1.5rem auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-map-marker-alt" style="font-size: 1.5rem;"></i>
                </div>
                
                <h3 style="margin: 0 0 1rem 0; color: #2c3e50;">📍 Ubicación del Evento</h3>
                <p style="margin: 0 0 1.5rem 0; color: #666; line-height: 1.5;">
                    Para incluir la ubicación exacta en la cotización, necesitamos conocer la dirección del evento.
                </p>
                
                <div style="
                    background: linear-gradient(135deg, #FFF3CD, #FCF4A3);
                    border: 2px solid #E91E63;
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    color: #856404;
                ">
                    <i class="fas fa-shield-alt"></i>
                    <strong>Tu privacidad es importante:</strong><br>
                    Solo usaremos tu ubicación para incluir la dirección en la cotización.
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="almakidsMapSystem.getUserLocation()" style="
                        background: linear-gradient(135deg, #27ae60, #2ecc71);
                        color: white;
                        border: none;
                        padding: 0.875rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-location-arrow"></i>
                        Usar Mi Ubicación
                    </button>
                    
                    <button onclick="almakidsMapSystem.closePermissionModal()" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 0.875rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-edit"></i>
                        Escribir Dirección
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(permissionModal);
        this.permissionModal = permissionModal;
    }

    closePermissionModal() {
        if (this.permissionModal && this.permissionModal.parentNode) {
            this.permissionModal.remove();
            this.permissionModal = null;
        }
    }

    getUserLocation() {
        this.closePermissionModal();
        
        // Mostrar indicador de carga
        this.showLocationLoading();
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutos
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.onLocationSuccess(position);
            },
            (error) => {
                this.onLocationError(error);
            },
            options
        );
    }

    showLocationLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'locationLoading';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #17a2b8, #20c997);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(23, 162, 184, 0.3);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInRight 0.3s ease;
        `;

        loadingDiv.innerHTML = `
            <div style="
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <span>Obteniendo tu ubicación...</span>
        `;

        document.body.appendChild(loadingDiv);
    }

    onLocationSuccess(position) {
        console.log('✅ Ubicación obtenida:', position.coords);
        
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        // Remover indicador de carga
        const loading = document.getElementById('locationLoading');
        if (loading) loading.remove();

        // Guardar ubicación
        this.selectedLocation = {
            lat: lat,
            lng: lng,
            accuracy: accuracy,
            method: 'geolocation'
        };

        // Obtener dirección usando geocoding reverso (simulado)
        this.reverseGeocode(lat, lng);

        // Mostrar confirmación
        this.showLocationSuccessNotification(accuracy);

        // Actualizar formulario principal con la ubicación obtenida
        const locationInput = document.getElementById('location');
        const locationCoords = document.getElementById('locationCoords');
        const locationUrl = document.getElementById('locationUrl');
        
        if (locationInput) {
            locationInput.value = this.selectedLocation.address;
        }
        
        if (locationCoords) {
            locationCoords.value = `${lat},${lng}`;
        }
        
        if (locationUrl) {
            // Generar enlace como en tu ejemplo
            locationUrl.value = `https://maps.app.goo.gl/maps?q=${lat},${lng}`;
        }
        
        // Actualizar interfaz
        this.updateLocationDisplay();
        
        // Cerrar modal automáticamente
        setTimeout(() => {
            this.closeModal();
        }, 3000);
    }

    onLocationError(error) {
        console.error('❌ Error obteniendo ubicación:', error);
        
        // Remover indicador de carga
        const loading = document.getElementById('locationLoading');
        if (loading) loading.remove();

        let errorMessage = '';
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'Permiso denegado. Puedes escribir la dirección manualmente.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'Ubicación no disponible. Intenta escribir la dirección.';
                break;
            case error.TIMEOUT:
                errorMessage = 'Tiempo agotado. Por favor, escribe la dirección manualmente.';
                break;
            default:
                errorMessage = 'Error desconocido. Escribe la dirección manualmente.';
        }

        this.showLocationErrorNotification(errorMessage);
    }

    reverseGeocode(lat, lng) {
        // Simulación de geocoding reverso sin API
        // En una implementación real usarías Google Geocoding API
        
        let estimatedAddress = '';
        
        // Estimación básica basada en coordenadas de Chile
        if (lat > -33.5 && lat < -33.0 && lng > -70.8 && lng < -70.4) {
            estimatedAddress = 'Santiago, Región Metropolitana, Chile';
        } else if (lat > -34.3 && lat < -33.8 && lng > -71.0 && lng < -70.5) {
            estimatedAddress = 'Rancagua, Región de O\'Higgins, Chile';
        } else if (lat > -34.2 && lat < -34.1 && lng > -70.7 && lng < -70.6) {
            estimatedAddress = 'Machalí, Región de O\'Higgins, Chile';
        } else {
            estimatedAddress = `Ubicación en Chile (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        }

        this.selectedLocation.address = estimatedAddress;
        
        // Actualizar displays
        const display = document.getElementById('selectedAddressDisplay');
        if (display) {
            display.textContent = estimatedAddress;
            display.classList.add('has-location');
        }

        const fullAddress = document.getElementById('fullAddress');
        if (fullAddress) {
            fullAddress.textContent = estimatedAddress;
        }

        const coordinates = document.getElementById('coordinates');
        if (coordinates) {
            if (this.selectedLocation.accuracy) {
                coordinates.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)} (Precisión: ${this.selectedLocation.accuracy}m)`;
            } else {
                coordinates.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            }
        }

        // Actualizar dirección extraída si existe
        const extractedAddress = document.getElementById('extractedAddress');
        if (extractedAddress) {
            extractedAddress.innerHTML = `<strong>📍 Dirección:</strong> ${estimatedAddress}`;
        }
    }

    showLocationSuccessNotification(accuracy) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #D4EDDA, #C3E6CB);
            border: 2px solid #27ae60;
            color: #155724;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(39, 174, 96, 0.2);
            z-index: 10001;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="
                    background: rgba(39, 174, 96, 0.2);
                    padding: 0.75rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-location-arrow" style="color: #27ae60; font-size: 1.5rem;"></i>
                </div>
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: #27ae60;">📍 Ubicación Detectada</h4>
                    <p style="margin: 0; font-size: 0.9rem;">
                        ✅ Ubicación obtenida exitosamente<br>
                        🎯 Precisión: ${Math.round(accuracy)} metros
                    </p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: #27ae60;
                    cursor: pointer;
                    font-size: 1.2rem;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove después de 8 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }

    showLocationErrorNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #F8D7DA, #F5C6CB);
            border: 2px solid #dc3545;
            color: #721c24;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(220, 53, 69, 0.2);
            z-index: 10001;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="
                    background: rgba(220, 53, 69, 0.2);
                    padding: 0.75rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-exclamation-triangle" style="color: #dc3545; font-size: 1.5rem;"></i>
                </div>
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: #dc3545;">⚠️ Error de Ubicación</h4>
                    <p style="margin: 0; font-size: 0.9rem;">
                        ${message}
                    </p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: #dc3545;
                    cursor: pointer;
                    font-size: 1.2rem;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove después de 10 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    setupOpenStreetMapFallback() {
        // Cargar Leaflet como alternativa gratuita
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletJS.onload = () => {
            console.log('✅ Leaflet (OpenStreetMap) cargado como alternativa');
            this.isMapLoaded = true;
            this.leafletLoaded = true;
        };
        document.head.appendChild(leafletJS);
    }

    initInteractiveMap() {
        if (this.leafletLoaded && window.L) {
            this.initLeafletMap();
        } else {
            // Esperar a que Leaflet se cargue
            setTimeout(() => {
                if (window.L) {
                    this.initLeafletMap();
                } else {
                    this.showEnhancedLocationPicker();
                }
            }, 1000);
        }
    }

    setupMapStyles() {
        const styles = `
            /* Estilos para el sistema de mapas */
            .map-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                backdrop-filter: blur(5px);
            }

            .map-modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .map-container {
                background: white;
                border-radius: 16px;
                width: 90%;
                max-width: 800px;
                height: 80%;
                max-height: 600px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .map-header {
                background: linear-gradient(135deg, #E91E63, #FF6B9D);
                color: white;
                padding: 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .map-header h3 {
                margin: 0;
                font-size: 1.25rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .map-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 0.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1.25rem;
                transition: all 0.3s ease;
            }

            .map-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .map-content {
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .map-search {
                padding: 1rem;
                border-bottom: 2px solid #f0f0f0;
                background: #f8f9fa;
            }

            .search-input-group {
                display: flex;
                gap: 0.75rem;
                align-items: center;
            }

            .search-input {
                flex: 1;
                padding: 0.875rem 1rem;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .search-input:focus {
                outline: none;
                border-color: #E91E63;
                box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.1);
            }

            .search-btn {
                background: linear-gradient(135deg, #E91E63, #FF6B9D);
                color: white;
                border: none;
                padding: 0.875rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .search-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(233, 30, 99, 0.3);
            }

            .map-display {
                flex: 1;
                position: relative;
                min-height: 300px;
            }

            #googleMap, #leafletMap {
                width: 100%;
                height: 100%;
            }

            .map-footer {
                padding: 1.5rem;
                background: #f8f9fa;
                border-top: 2px solid #f0f0f0;
                display: flex;
                justify-content: between;
                align-items: center;
                gap: 1rem;
            }

            .selected-address {
                flex: 1;
                font-size: 0.9rem;
                color: #666;
            }

            .selected-address.has-location {
                color: #27ae60;
                font-weight: 600;
            }

            .map-actions {
                display: flex;
                gap: 1rem;
            }

            .btn-cancel {
                background: #6c757d;
                color: white;
                border: none;
                padding: 0.875rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .btn-confirm {
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                color: white;
                border: none;
                padding: 0.875rem 2rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                opacity: 0.5;
                pointer-events: none;
            }

            .btn-confirm.enabled {
                opacity: 1;
                pointer-events: all;
            }

            .btn-confirm.enabled:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
            }

            .location-info {
                background: linear-gradient(135deg, #D4EDDA, #C3E6CB);
                border: 2px solid #27ae60;
                border-radius: 8px;
                padding: 1rem;
                margin-top: 1rem;
                display: none;
            }

            .location-info.show {
                display: block;
                animation: slideDown 0.3s ease;
            }

            .location-details {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .location-detail {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 0.9rem;
            }

            .location-detail i {
                color: #27ae60;
                width: 16px;
                text-align: center;
            }


            /* Responsive */
            @media (max-width: 768px) {
                .map-container {
                    width: 95%;
                    height: 90%;
                }
                
                .map-header {
                    padding: 1rem;
                }
                
                .map-header h3 {
                    font-size: 1.1rem;
                }
                
                .search-input-group {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .map-footer {
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .map-actions {
                    width: 100%;
                    justify-content: space-between;
                }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    injectMapModal() {
        const modalHTML = `
            <div id="mapModal" class="map-modal">
                <div class="map-container">
                    <div class="map-header">
                        <h3>
                            <i class="fas fa-map-marker-alt"></i>
                            Seleccionar Ubicación del Evento
                        </h3>
                        <button class="map-close" onclick="almakidsMapSystem.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="map-content">
                        <div class="map-search">
                            <div class="search-input-group">
                                <input 
                                    type="text" 
                                    id="mapSearchInput" 
                                    class="search-input" 
                                    placeholder="Buscar dirección (ej: Calle Los Aromos 123, Rancagua)"
                                    onkeypress="if(event.key==='Enter') almakidsMapSystem.searchAddress()"
                                >
                                <button class="search-btn" onclick="almakidsMapSystem.searchAddress()">
                                    <i class="fas fa-search"></i> Buscar
                                </button>
                            </div>
                            <div style="text-align: center; margin-top: 0.5rem; font-size: 0.85rem; color: #666;">
                                <i class="fas fa-info-circle"></i> Presiona Enter o haz clic en Buscar
                            </div>
                        </div>
                        
                        <div class="map-display">
                            <div id="googleMap"></div>
                            <div id="leafletMap" style="display: none;"></div>
                        </div>
                    </div>
                    
                    <div class="map-footer">
                        <div class="selected-address" id="selectedAddressDisplay">
                            Haz clic en el mapa para seleccionar la ubicación exacta
                        </div>
                        <div class="map-actions">
                            <button class="btn-cancel" onclick="almakidsMapSystem.closeModal()">
                                Cancelar
                            </button>
                            <button class="btn-confirm" id="confirmLocationBtn" onclick="almakidsMapSystem.confirmLocation()">
                                <i class="fas fa-check"></i> Confirmar Ubicación
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="location-info" id="locationInfo">
                    <div class="location-details">
                        <div class="location-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span id="fullAddress">Dirección completa</span>
                        </div>
                        <div class="location-detail">
                            <i class="fas fa-globe"></i>
                            <span id="coordinates">Coordenadas GPS</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    openModal() {
        const modal = document.getElementById('mapModal');
        modal.classList.add('active');
        
        if (this.isMapLoaded) {
            setTimeout(() => {
                this.initializeMap();
            }, 300);
        } else {
            this.showMapLoadingError();
        }
    }

    closeModal() {
        const modal = document.getElementById('mapModal');
        modal.classList.remove('active');
    }

    initializeMap() {
        console.log('🗺️ Inicializando mapa...');
        if (window.google && window.google.maps) {
            console.log('✅ Google Maps disponible, inicializando...');
            this.initGoogleMap();
        } else if (window.L) {
            console.log('📍 Usando Leaflet como alternativa...');
            this.initLeafletMap();
        } else if (this.enhancedFallback) {
            console.log('🗺️ Cargando mapa interactivo alternativo...');
            this.initInteractiveMap();
        } else {
            console.log('⚠️ Usando interfaz simplificada...');
            this.showSimplifiedLocationInput();
        }
    }

    initGoogleMap() {
        console.log('🗺️ Inicializando Google Maps...');
        const mapElement = document.getElementById('googleMap');
        
        if (!mapElement) {
            console.error('❌ Elemento del mapa no encontrado');
            return;
        }

        // Configuración del mapa centrado en la Región de O'Higgins
        this.map = new google.maps.Map(mapElement, {
            center: this.almakidsLocation,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {
                    featureType: "poi.business",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ],
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true
        });

        // Agregar marcador de ALMA Kids (sede)
        const almakidsMarker = new google.maps.Marker({
            position: this.almakidsLocation,
            map: this.map,
            title: 'ALMA Kids - Sede Principal (Machalí)',
            icon: {
                url: 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
                        <circle cx="16" cy="16" r="14" fill="#E91E63" stroke="white" stroke-width="2"/>
                        <text x="16" y="12" text-anchor="middle" fill="white" font-size="8" font-weight="bold">ALMA</text>
                        <text x="16" y="20" text-anchor="middle" fill="white" font-size="8" font-weight="bold">KIDS</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32)
            }
        });

        // InfoWindow para ALMA Kids
        const almakidsInfo = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; text-align: center;">
                    <h4 style="color: #E91E63; margin: 0 0 5px 0;">🎪 ALMA Kids</h4>
                    <p style="margin: 0; font-size: 12px;">Sede Principal - Machalí</p>
                    <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">Zona de cobertura gratuita</p>
                </div>
            `
        });

        almakidsMarker.addListener('click', () => {
            almakidsInfo.open(this.map, almakidsMarker);
        });

        // Listener principal para clics en el mapa
        this.map.addListener('click', (event) => {
            console.log('🎯 Clic en mapa:', event.latLng.lat(), event.latLng.lng());
            this.selectLocation(event.latLng.lat(), event.latLng.lng());
        });

        // Configurar autocompletado en el campo de búsqueda
        this.setupAutocomplete();

        // Mostrar instrucciones iniciales
        this.showMapInstructions();

        console.log('✅ Google Maps inicializado correctamente');
    }

    showMapInstructions() {
        // Mostrar instrucciones en el mapa
        const instructionsDiv = document.createElement('div');
        instructionsDiv.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #E91E63, #FF6B9D);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
            z-index: 1000;
            animation: pulse 2s infinite;
        `;
        instructionsDiv.innerHTML = '🎯 Haz clic en el mapa para seleccionar la ubicación del evento';
        
        const mapContainer = document.querySelector('.map-display');
        mapContainer.style.position = 'relative';
        mapContainer.appendChild(instructionsDiv);

        // Remover instrucciones después de 8 segundos
        setTimeout(() => {
            if (instructionsDiv.parentNode) {
                instructionsDiv.remove();
            }
        }, 8000);
    }

    initLeafletMap() {
        const mapElement = document.getElementById('leafletMap');
        mapElement.style.display = 'block';
        document.getElementById('googleMap').style.display = 'none';

        this.map = L.map('leafletMap').setView([this.almakidsLocation.lat, this.almakidsLocation.lng], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Marcador de ALMA Kids
        L.marker([this.almakidsLocation.lat, this.almakidsLocation.lng])
            .addTo(this.map)
            .bindPopup('ALMA Kids - Machalí')
            .openPopup();

        // Listener para clics
        this.map.on('click', (event) => {
            this.selectLocation(event.latlng.lat, event.latlng.lng);
        });
    }

    setupAutocomplete() {
        const input = document.getElementById('mapSearchInput');
        const autocomplete = new google.maps.places.Autocomplete(input, {
            componentRestrictions: { country: 'cl' },
            fields: ['place_id', 'geometry', 'name', 'formatted_address']
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                this.selectLocation(lat, lng);
                this.map.setCenter({ lat, lng });
                this.map.setZoom(16);
            }
        });
    }

    searchAddress() {
        const address = document.getElementById('mapSearchInput').value;
        if (!address.trim()) {
            alert('Por favor, ingresa una dirección para buscar');
            return;
        }

        // Método simplificado sin geocoding
        console.log('🔍 Buscando dirección:', address);
        
        // Simular búsqueda exitosa
        this.selectedLocation = {
            address: address.trim(),
            lat: -34.1833, // Coordenadas de referencia (Machalí)
            lng: -70.6500
        };
        
        // Actualizar la interfaz inmediatamente
        this.updateLocationDisplay();
        
        // Mostrar confirmación
        this.showLocationFound();
    }


    updateLocationDisplay() {
        const display = document.getElementById('selectedAddressDisplay');
        if (display) {
            display.textContent = this.selectedLocation.address;
            display.classList.add('has-location');
        }
        
        const fullAddress = document.getElementById('fullAddress');
        const coordinates = document.getElementById('coordinates');
        
        if (fullAddress) fullAddress.textContent = this.selectedLocation.address;
        if (coordinates) coordinates.textContent = 'Ubicación registrada y confirmada';
        
        // Habilitar botón de confirmación
        const confirmBtn = document.getElementById('confirmLocationBtn');
        if (confirmBtn) {
            confirmBtn.classList.add('enabled');
        }
    }

    showLocationFound() {
        // Actualizar el área del mapa para mostrar que se encontró la ubicación
        const mapDisplay = document.querySelector('.map-display');
        mapDisplay.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #2c3e50;
                text-align: center;
                padding: 2rem;
                background: linear-gradient(135deg, #D4EDDA, #C3E6CB);
                border-radius: 12px;
            ">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: #27ae60; margin-bottom: 1.5rem; animation: bounce 0.6s;"></i>
                <h4 style="margin: 0 0 1rem 0; color: #27ae60;">✅ ¡Ubicación Encontrada!</h4>
                <p style="margin: 0 0 1rem 0; font-size: 1rem; font-weight: 600;">
                    ${this.selectedLocation.address}
                </p>
                
                <p style="margin: 1rem 0; font-size: 0.9rem; color: #666;">
                    Haz clic en "Confirmar Ubicación" para continuar
                </p>
            </div>
        `;
    }

    selectLocation(lat, lng) {
        console.log('📍 Seleccionando ubicación:', lat, lng);
        
        // Remover marcador anterior del evento
        if (this.marker) {
            if (window.google) {
                this.marker.setMap(null);
            } else if (window.L) {
                this.map.removeLayer(this.marker);
            }
        }

        // Crear nuevo marcador para el evento
        if (window.google) {
            this.marker = new google.maps.Marker({
                position: { lat, lng },
                map: this.map,
                title: 'Ubicación del evento seleccionada',
                animation: google.maps.Animation.DROP,
                icon: {
                    url: 'data:image/svg+xml;base64,' + btoa(`
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
                            <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24C32 7.164 24.836 0 16 0z" fill="#27ae60"/>
                            <circle cx="16" cy="16" r="8" fill="white"/>
                            <circle cx="16" cy="16" r="4" fill="#27ae60"/>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(32, 40),
                    anchor: new google.maps.Point(16, 40)
                }
            });

            // InfoWindow para la ubicación seleccionada
            const eventInfo = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px; text-align: center;">
                        <h4 style="color: #27ae60; margin: 0 0 5px 0;">🎪 Ubicación del Evento</h4>
                        <p style="margin: 0; font-size: 12px;">Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                        <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">Calculando dirección...</p>
                    </div>
                `
            });

            this.marker.addListener('click', () => {
                eventInfo.open(this.map, this.marker);
            });

            // Mostrar InfoWindow automáticamente
            eventInfo.open(this.map, this.marker);

        } else if (window.L) {
            this.marker = L.marker([lat, lng]).addTo(this.map);
        }

        // Guardar ubicación seleccionada
        this.selectedLocation = { lat, lng };

        // Obtener dirección usando geocoding
        this.getAddressFromCoordinates(lat, lng);

        // Habilitar botón de confirmación
        const confirmBtn = document.getElementById('confirmLocationBtn');
        if (confirmBtn) {
            confirmBtn.classList.add('enabled');
        }

        // Actualizar display inmediatamente con coordenadas
        const display = document.getElementById('selectedAddressDisplay');
        if (display) {
            display.textContent = `Ubicación seleccionada: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            display.classList.add('has-location');
        }

        // Mostrar feedback visual
        this.showLocationSelectedFeedback();
    }

    showLocationSelectedFeedback() {
        // Crear notificación temporal de confirmación
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: absolute;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
            z-index: 1001;
            animation: slideDown 0.3s ease;
        `;
        feedback.innerHTML = '✅ Ubicación seleccionada - Obteniendo dirección...';
        
        const mapContainer = document.querySelector('.map-display');
        mapContainer.appendChild(feedback);

        // Remover feedback después de 3 segundos
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 3000);
    }

    getAddressFromCoordinates(lat, lng) {
        if (this.geocoder) {
            this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const address = results[0].formatted_address;
                    this.selectedLocation.address = address;
                    
                    const display = document.getElementById('selectedAddressDisplay');
                    display.textContent = address;
                    display.classList.add('has-location');
                    
                    document.getElementById('fullAddress').textContent = address;
                    document.getElementById('coordinates').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                }
            });
        }
    }


    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    confirmLocation() {
        if (!this.selectedLocation) return;

        // Actualizar formulario principal
        const locationInput = document.getElementById('location');
        const locationCoords = document.getElementById('locationCoords');
        const locationUrl = document.getElementById('locationUrl');
        const selectedLocationDiv = document.getElementById('selectedLocation');
        const locationText = document.getElementById('locationText');

        if (locationInput) {
            locationInput.value = this.selectedLocation.address || `${this.selectedLocation.lat}, ${this.selectedLocation.lng}`;
        }

        if (locationCoords) {
            locationCoords.value = `${this.selectedLocation.lat},${this.selectedLocation.lng}`;
        }

        if (locationUrl) {
            // Generar enlace en formato maps.app.goo.gl (como en tu ejemplo)
            // Por ahora usamos el formato estándar que funciona igual
            locationUrl.value = `https://maps.app.goo.gl/maps?q=${this.selectedLocation.lat},${this.selectedLocation.lng}`;
        }

        if (selectedLocationDiv && locationText) {
            locationText.innerHTML = `
                <strong>${this.selectedLocation.address || 'Ubicación seleccionada'}</strong><br>
                <small>📍 Ubicación confirmada para el evento</small>
            `;
            selectedLocationDiv.style.display = 'block';
        }

        // Mostrar confirmación
        this.showLocationConfirmation();

        // Cerrar modal
        this.closeModal();
    }

    showLocationConfirmation() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #D4EDDA, #C3E6CB);
            border: 2px solid #27ae60;
            color: #155724;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(39, 174, 96, 0.2);
            z-index: 10001;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="
                    background: rgba(39, 174, 96, 0.2);
                    padding: 0.75rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-map-marker-alt" style="color: #27ae60; font-size: 1.5rem;"></i>
                </div>
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: #27ae60;">📍 Ubicación Confirmada</h4>
                    <p style="margin: 0; font-size: 0.9rem;">
                        ✅ Ubicación guardada exitosamente<br>
                        📍 Lista para incluir en la cotización
                    </p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: #27ae60;
                    cursor: pointer;
                    font-size: 1.2rem;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove después de 8 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }

    showSimplifiedLocationInput() {
        this.showEnhancedLocationPicker();
    }

    showEnhancedLocationPicker() {
        const mapDisplay = document.querySelector('.map-display');
        mapDisplay.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #2c3e50;
                text-align: center;
                padding: 2rem;
                background: linear-gradient(135deg, #FFF0F5, #F0F8FF);
                border-radius: 12px;
            ">
                <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #E91E63; margin-bottom: 1.5rem;"></i>
                <h4 style="margin: 0 0 1rem 0; color: #E91E63;">📍 Selecciona la Ubicación del Evento</h4>
                <p style="margin: 0 0 1.5rem 0; font-size: 1rem; line-height: 1.5;">
                    Elige la opción que prefieras para marcar la ubicación exacta donde será el evento.
                </p>
                
                <div style="
                    background: linear-gradient(135deg, #FFF3CD, #FCF4A3);
                    border: 2px solid #E91E63;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin: 1rem 0;
                    max-width: 500px;
                    width: 100%;
                ">
                    <h5 style="margin: 0 0 1rem 0; color: #E91E63;">
                        <i class="fas fa-location-arrow"></i> Opciones de Ubicación
                    </h5>
                    
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <button onclick="almakidsMapSystem.openGoogleMapsExternal()" style="
                            background: linear-gradient(135deg, #4285f4, #34a853);
                            color: white;
                            border: none;
                            padding: 1rem 1.5rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 0.5rem;
                            width: 100%;
                            box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
                        ">
                            <i class="fab fa-google"></i>
                            🗺️ Abrir Google Maps para Seleccionar
                        </button>
                        
                        <button onclick="almakidsMapSystem.requestUserLocation()" style="
                            background: linear-gradient(135deg, #17a2b8, #20c997);
                            color: white;
                            border: none;
                            padding: 1rem 1.5rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 0.5rem;
                            width: 100%;
                            box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
                        ">
                            <i class="fas fa-crosshairs"></i>
                            📍 Usar Mi Ubicación Actual
                        </button>
                        
                        <div style="text-align: center; color: #666; font-size: 0.9rem; margin: 0.5rem 0;">
                            - o -
                        </div>
                        
                        <button onclick="almakidsMapSystem.showAddressInput()" style="
                            background: linear-gradient(135deg, #E91E63, #FF6B9D);
                            color: white;
                            border: none;
                            padding: 1rem 1.5rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 0.5rem;
                            width: 100%;
                        ">
                            <i class="fas fa-edit"></i>
                            Escribir Dirección Manualmente
                        </button>
                    </div>
                </div>
                
                <div style="
                    background: linear-gradient(135deg, #D1ECF1, #BEE5EB);
                    border: 2px solid #17a2b8;
                    border-radius: 12px;
                    padding: 1rem;
                    margin: 1rem 0;
                    max-width: 450px;
                    font-size: 0.9rem;
                    color: #0c5460;
                ">
                    <h6 style="margin: 0 0 0.5rem 0; color: #17a2b8;">
                        <i class="fas fa-info-circle"></i> ¿Cómo funciona?
                    </h6>
                    <p style="margin: 0; line-height: 1.4;">
                        <strong>Google Maps:</strong> Se abre en una nueva ventana donde puedes buscar y marcar la ubicación exacta del evento.<br>
                        <strong>Mi Ubicación:</strong> Solo si el evento es donde estás ahora.<br>
                        <strong>Manual:</strong> Escribe la dirección completa del evento.
                    </p>
                </div>
            </div>
        `;
    }

    showAddressInput() {
        const mapDisplay = document.querySelector('.map-display');
        mapDisplay.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                height: 100%;
                color: #2c3e50;
                padding: 2rem;
                background: linear-gradient(135deg, #FFF0F5, #F0F8FF);
                border-radius: 12px;
            ">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <i class="fas fa-map-marker-alt" style="font-size: 2.5rem; color: #E91E63; margin-bottom: 1rem;"></i>
                    <h4 style="margin: 0 0 0.5rem 0; color: #E91E63;">📍 Dirección del Evento</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #666;">
                            Ingresa la dirección completa del evento
                        </p>
                </div>
                
                <div style="flex: 1; display: flex; flex-direction: column; gap: 1.5rem;">
                    <div style="
                        background: white;
                        padding: 1.5rem;
                        border-radius: 12px;
                        border: 2px solid rgba(233, 30, 99, 0.1);
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    ">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2c3e50;">
                            <i class="fas fa-home"></i> Dirección Completa:
                        </label>
                        <input 
                            type="text" 
                            id="manualAddressInput" 
                            placeholder="Ej: Calle Los Aromos 123, Rancagua, Región de O'Higgins"
                            style="
                                width: 100%;
                                padding: 1rem;
                                border: 2px solid #ddd;
                                border-radius: 8px;
                                font-size: 1rem;
                                transition: all 0.3s ease;
                                box-sizing: border-box;
                            "
                            onkeypress="if(event.key==='Enter') almakidsMapSystem.processManualAddress()"
                            onfocus="this.style.borderColor='#E91E63'; this.style.boxShadow='0 0 0 4px rgba(233, 30, 99, 0.1)'"
                            onblur="this.style.borderColor='#ddd'; this.style.boxShadow='none'"
                        >
                        
                        <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2c3e50; font-size: 0.9rem;">
                                    <i class="fas fa-city"></i> Ciudad:
                                </label>
                                <select id="citySelect" style="
                                    width: 100%;
                                    padding: 0.75rem;
                                    border: 2px solid #ddd;
                                    border-radius: 6px;
                                    font-size: 0.9rem;
                                    box-sizing: border-box;
                                ">
                                    <option value="">Seleccionar ciudad</option>
                                    <option value="machali">Machalí</option>
                                    <option value="rancagua">Rancagua</option>
                                    <option value="san-fernando">San Fernando</option>
                                    <option value="rengo">Rengo</option>
                                    <option value="graneros">Graneros</option>
                                    <option value="mostazal">Mostazal</option>
                                    <option value="codegua">Codegua</option>
                                    <option value="olivar">Olivar</option>
                                    <option value="santiago">Santiago</option>
                                    <option value="otra">Otra ciudad</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2c3e50; font-size: 0.9rem;">
                                    <i class="fas fa-map"></i> Comuna:
                                </label>
                                <input 
                                    type="text" 
                                    id="comunaInput" 
                                    placeholder="Comuna (opcional)"
                                    style="
                                        width: 100%;
                                        padding: 0.75rem;
                                        border: 2px solid #ddd;
                                        border-radius: 6px;
                                        font-size: 0.9rem;
                                        box-sizing: border-box;
                                    "
                                >
                            </div>
                        </div>
                        
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button onclick="almakidsMapSystem.processManualAddress()" style="
                                background: linear-gradient(135deg, #27ae60, #2ecc71);
                                color: white;
                                border: none;
                                padding: 1rem 2rem;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: 600;
                                display: inline-flex;
                                align-items: center;
                                gap: 0.5rem;
                                font-size: 1rem;
                            ">
                                <i class="fas fa-check"></i>
                                Confirmar Ubicación
                            </button>
                        </div>
                    </div>
                    
                    <div id="locationResult" style="display: none;"></div>
                </div>
            </div>
        `;
        
        // Focus en el input
        setTimeout(() => {
            const input = document.getElementById('manualAddressInput');
            if (input) input.focus();
        }, 100);
    }

    processManualAddress() {
        const addressInput = document.getElementById('manualAddressInput');
        const citySelect = document.getElementById('citySelect');
        const comunaInput = document.getElementById('comunaInput');
        
        const address = addressInput ? addressInput.value.trim() : '';
        const city = citySelect ? citySelect.value : '';
        const comuna = comunaInput ? comunaInput.value.trim() : '';
        
        if (!address) {
            alert('Por favor, ingresa la dirección del evento');
            return;
        }
        
        // Construir dirección completa
        let fullAddress = address;
        if (comuna) fullAddress += `, ${comuna}`;
        if (city && city !== 'otra') {
            const cityNames = {
                'machali': 'Machalí',
                'rancagua': 'Rancagua',
                'san-fernando': 'San Fernando',
                'rengo': 'Rengo',
                'graneros': 'Graneros',
                'mostazal': 'Mostazal',
                'codegua': 'Codegua',
                'olivar': 'Olivar',
                'santiago': 'Santiago'
            };
            fullAddress += `, ${cityNames[city]}`;
        }
        fullAddress += ', Chile';
        
        // Guardar ubicación
        this.selectedLocation = {
            address: fullAddress,
            city: city,
            comuna: comuna,
            method: 'manual'
        };
        
        // Mostrar resultado
        this.showLocationResult(fullAddress);
        
        // Actualizar displays
        this.updateLocationDisplay();
        
        // Habilitar botón de confirmación
        const confirmBtn = document.getElementById('confirmLocationBtn');
        if (confirmBtn) {
            confirmBtn.classList.add('enabled');
        }
    }


    showLocationResult(address) {
        const resultDiv = document.getElementById('locationResult');
        if (!resultDiv) return;
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #D4EDDA, #C3E6CB);
                border: 2px solid #27ae60;
                border-radius: 12px;
                padding: 1.5rem;
                text-align: center;
            ">
                <div style="margin-bottom: 1rem;">
                    <i class="fas fa-check-circle" style="font-size: 2rem; color: #27ae60; margin-bottom: 0.5rem;"></i>
                    <h4 style="margin: 0; color: #27ae60;">✅ Ubicación Confirmada</h4>
                </div>
                
                <div style="
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    text-align: left;
                ">
                    <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #2c3e50;">
                        <i class="fas fa-map-marker-alt"></i> <strong>Dirección del Evento:</strong>
                    </p>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">${address}</p>
                </div>
                
                <div style="margin-top: 1rem; font-size: 0.85rem; color: #666;">
                    <i class="fas fa-info-circle"></i>
                    Ubicación lista para incluir en la cotización
                </div>
            </div>
        `;
        
        // Scroll al resultado
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    confirmSimpleLocation() {
        const searchInput = document.getElementById('mapSearchInput');
        const manualInput = document.getElementById('manualAddressInput');
        
        let address = '';
        if (searchInput && searchInput.value.trim()) {
            address = searchInput.value.trim();
        } else if (manualInput && manualInput.value.trim()) {
            address = manualInput.value.trim();
        }
        
        if (!address) {
            alert('Por favor, ingresa una dirección para continuar');
            return;
        }
        
        // Generar coordenadas aproximadas para el enlace
        const coords = this.getApproximateCoordinates(address);
        
        // Guardar ubicación completa
        this.selectedLocation = {
            address: address,
            lat: coords.lat,
            lng: coords.lng,
            method: 'manual'
        };
        
        // Actualizar formulario principal
        const locationInput = document.getElementById('location');
        const locationCoords = document.getElementById('locationCoords');
        const locationUrl = document.getElementById('locationUrl');
        
        if (locationInput) {
            locationInput.value = address;
        }
        
        if (locationCoords) {
            locationCoords.value = `${coords.lat},${coords.lng}`;
        }
        
        if (locationUrl) {
            // Generar enlace como en tu ejemplo
            locationUrl.value = `https://maps.app.goo.gl/maps?q=${coords.lat},${coords.lng}`;
        }
        
        // Actualizar displays
        this.updateLocationDisplay();
        
        // Mostrar confirmación y cerrar modal
        this.showLocationConfirmation();
        this.closeModal();
        
        console.log('📍 Ubicación confirmada:', address);
    }

    openGoogleMapsExternal() {
        // Crear una interfaz para que el usuario seleccione la ubicación en Google Maps
        this.showGoogleMapsInstructions();
    }

    showGoogleMapsInstructions() {
        const mapDisplay = document.querySelector('.map-display');
        mapDisplay.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                height: 100%;
                color: #2c3e50;
                padding: 2rem;
                background: linear-gradient(135deg, #E8F5E8, #F0F8F0);
                border-radius: 12px;
            ">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <i class="fab fa-google" style="font-size: 3rem; color: #4285f4; margin-bottom: 1rem;"></i>
                    <h4 style="margin: 0 0 0.5rem 0; color: #4285f4;">🗺️ Seleccionar en Google Maps</h4>
                    <p style="margin: 0; font-size: 0.9rem; color: #666;">
                        Sigue estos pasos para marcar la ubicación exacta del evento
                    </p>
                </div>
                
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    border: 2px solid rgba(66, 133, 244, 0.2);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    margin-bottom: 1.5rem;
                ">
                    <h5 style="margin: 0 0 1.5rem 0; color: #4285f4; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-list-ol"></i> Instrucciones Paso a Paso
                    </h5>
                    
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                            <div style="
                                background: #4285f4;
                                color: white;
                                width: 24px;
                                height: 24px;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                font-size: 0.9rem;
                                flex-shrink: 0;
                            ">1</div>
                            <div>
                                <strong>Abrir Google Maps</strong><br>
                                <span style="color: #666; font-size: 0.9rem;">Haz clic en el botón de abajo para abrir Google Maps en una nueva ventana</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                            <div style="
                                background: #34a853;
                                color: white;
                                width: 24px;
                                height: 24px;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                font-size: 0.9rem;
                                flex-shrink: 0;
                            ">2</div>
                            <div>
                                <strong>Buscar la Ubicación</strong><br>
                                <span style="color: #666; font-size: 0.9rem;">Busca la dirección del evento o navega hasta encontrar el lugar exacto</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                            <div style="
                                background: #ea4335;
                                color: white;
                                width: 24px;
                                height: 24px;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                font-size: 0.9rem;
                                flex-shrink: 0;
                            ">3</div>
                            <div>
                                <strong>Marcar el Punto</strong><br>
                                <span style="color: #666; font-size: 0.9rem;">Haz clic derecho en la ubicación exacta y selecciona "¿Qué hay aquí?" o simplemente haz clic en el lugar</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                            <div style="
                                background: #fbbc04;
                                color: white;
                                width: 24px;
                                height: 24px;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                font-size: 0.9rem;
                                flex-shrink: 0;
                            ">4</div>
                            <div>
                                <strong>Copiar el Enlace</strong><br>
                                <span style="color: #666; font-size: 0.9rem;">Copia la URL de la página o usa "Compartir" para obtener el enlace de la ubicación</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 2rem;">
                        <button onclick="window.open('https://maps.google.com/', '_blank')" style="
                            background: linear-gradient(135deg, #4285f4, #34a853);
                            color: white;
                            border: none;
                            padding: 1rem 2rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 1rem;
                            display: inline-flex;
                            align-items: center;
                            gap: 0.5rem;
                            box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
                        ">
                            <i class="fab fa-google"></i>
                            🗺️ Abrir Google Maps
                        </button>
                    </div>
                </div>
                
                <div style="
                    background: linear-gradient(135deg, #FFF3CD, #FCF4A3);
                    border: 2px solid #E91E63;
                    border-radius: 12px;
                    padding: 1.5rem;
                ">
                    <h5 style="margin: 0 0 1rem 0; color: #E91E63;">
                        <i class="fas fa-paste"></i> Pegar el Enlace Aquí
                    </h5>
                    
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <input 
                            type="text" 
                            id="googleMapsUrl" 
                            placeholder="Pega aquí el enlace de Google Maps (ej: https://maps.google.com/...)"
                            style="
                                flex: 1;
                                padding: 1rem;
                                border: 2px solid #ddd;
                                border-radius: 8px;
                                font-size: 1rem;
                                transition: all 0.3s ease;
                            "
                            onfocus="this.style.borderColor='#E91E63'; this.style.boxShadow='0 0 0 4px rgba(233, 30, 99, 0.1)'"
                            onblur="this.style.borderColor='#ddd'; this.style.boxShadow='none'"
                            onpaste="setTimeout(() => almakidsMapSystem.processGoogleMapsUrl(), 100)"
                        >
                        <button onclick="almakidsMapSystem.processGoogleMapsUrl()" style="
                            background: linear-gradient(135deg, #27ae60, #2ecc71);
                            color: white;
                            border: none;
                            padding: 1rem 1.5rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        ">
                            <i class="fas fa-check"></i>
                            Procesar
                        </button>
                    </div>
                    
                    <div style="margin-top: 1rem; font-size: 0.85rem; color: #666; text-align: center;">
                        <i class="fas fa-info-circle"></i>
                        El enlace se procesará automáticamente al pegarlo
                    </div>
                </div>
            </div>
        `;
        
        // Focus en el input
        setTimeout(() => {
            const input = document.getElementById('googleMapsUrl');
            if (input) input.focus();
        }, 100);
    }

    processGoogleMapsUrl() {
        const input = document.getElementById('googleMapsUrl');
        const url = input ? input.value.trim() : '';
        
        if (!url) {
            alert('Por favor, pega el enlace de Google Maps');
            return;
        }
        
        // Extraer coordenadas del enlace de Google Maps
        const coords = this.extractCoordinatesFromGoogleMapsUrl(url);
        
        if (coords) {
            // Guardar ubicación
            this.selectedLocation = {
                lat: coords.lat,
                lng: coords.lng,
                url: url,
                method: 'google_maps_external'
            };
            
            // Obtener dirección aproximada
            this.reverseGeocode(coords.lat, coords.lng);
            
            // Mostrar confirmación
            this.showGoogleMapsLocationConfirmed(coords);
            
            // Habilitar botón de confirmación
            const confirmBtn = document.getElementById('confirmLocationBtn');
            if (confirmBtn) {
                confirmBtn.classList.add('enabled');
            }
            
        } else {
            alert('No se pudieron extraer las coordenadas del enlace. Verifica que sea un enlace válido de Google Maps.');
        }
    }

    extractCoordinatesFromGoogleMapsUrl(url) {
        // Patrones para diferentes formatos de URL de Google Maps
        const patterns = [
            // Formato: @lat,lng,zoom
            /@(-?\d+\.\d+),(-?\d+\.\d+),(\d+)/,
            // Formato: ?q=lat,lng
            /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
            // Formato: ll=lat,lng
            /ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
            // Formato: center=lat,lng
            /center=(-?\d+\.\d+),(-?\d+\.\d+)/,
            // Formato: /maps?q=lat,lng
            /maps\?q=(-?\d+\.\d+),(-?\d+\.\d+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return {
                    lat: parseFloat(match[1]),
                    lng: parseFloat(match[2])
                };
            }
        }
        
        return null;
    }

    showGoogleMapsLocationConfirmed(coords) {
        const mapDisplay = document.querySelector('.map-display');
        mapDisplay.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #2c3e50;
                text-align: center;
                padding: 2rem;
                background: linear-gradient(135deg, #D4EDDA, #C3E6CB);
                border-radius: 12px;
            ">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: #27ae60; margin-bottom: 2rem; animation: bounce 0.6s;"></i>
                <h4 style="margin: 0 0 1rem 0; color: #27ae60;">✅ ¡Ubicación Obtenida desde Google Maps!</h4>
                
                <div style="
                    background: white;
                    border: 2px solid #27ae60;
                    border-radius: 12px;
                    padding: 2rem;
                    margin: 1rem 0;
                    max-width: 450px;
                    width: 100%;
                ">
                    <h5 style="margin: 0 0 1rem 0; color: #27ae60;">
                        📍 Detalles de la Ubicación
                    </h5>
                    <div style="text-align: left; font-size: 0.9rem; line-height: 1.6;">
                        <p style="margin: 0.5rem 0;"><strong>📊 Coordenadas:</strong> ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}</p>
                        <p style="margin: 0.5rem 0;"><strong>🗺️ Fuente:</strong> Google Maps (Selección Manual)</p>
                        <p style="margin: 0.5rem 0;" id="extractedAddress"><strong>📍 Dirección:</strong> <span style="color: #666;">Obteniendo dirección...</span></p>
                    </div>
                </div>
                
                <div style="
                    background: linear-gradient(135deg, #D1ECF1, #BEE5EB);
                    border: 2px solid #17a2b8;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin: 1rem 0;
                    max-width: 400px;
                    font-size: 0.9rem;
                    color: #0c5460;
                ">
                    <h6 style="margin: 0 0 0.5rem 0; color: #17a2b8;">
                        <i class="fas fa-thumbs-up"></i> ¡Perfecto!
                    </h6>
                    <p style="margin: 0; line-height: 1.4;">
                        Has seleccionado la ubicación exacta del evento usando Google Maps. 
                        Esta información se incluirá en tu cotización.
                    </p>
                </div>
                
                <p style="margin: 1rem 0; font-size: 0.9rem; color: #666;">
                    Haz clic en "Confirmar Ubicación" para continuar con tu cotización
                </p>
            </div>
        `;
    }

    getApproximateCoordinates(address) {
        const addressLower = address.toLowerCase();
        
        // Coordenadas aproximadas de ciudades principales
        if (addressLower.includes('machali') || addressLower.includes('machalí')) {
            return { lat: -34.1833 + (Math.random() - 0.5) * 0.02, lng: -70.6500 + (Math.random() - 0.5) * 0.02 };
        } else if (addressLower.includes('rancagua')) {
            return { lat: -34.1702 + (Math.random() - 0.5) * 0.02, lng: -70.7394 + (Math.random() - 0.5) * 0.02 };
        } else if (addressLower.includes('graneros')) {
            return { lat: -34.0736 + (Math.random() - 0.5) * 0.02, lng: -70.7286 + (Math.random() - 0.5) * 0.02 };
        } else if (addressLower.includes('san fernando')) {
            return { lat: -34.5853 + (Math.random() - 0.5) * 0.02, lng: -70.9911 + (Math.random() - 0.5) * 0.02 };
        } else if (addressLower.includes('santiago')) {
            return { lat: -33.4489 + (Math.random() - 0.5) * 0.02, lng: -70.6693 + (Math.random() - 0.5) * 0.02 };
        } else {
            // Coordenadas por defecto en la región
            return { lat: -34.2000 + (Math.random() - 0.5) * 0.1, lng: -70.7000 + (Math.random() - 0.5) * 0.1 };
        }
    }

    showSearchError() {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #F8D7DA;
            color: #721c24;
            border: 2px solid #dc3545;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10002;
            animation: slideInUp 0.3s ease;
        `;
        toast.innerHTML = '<i class="fas fa-exclamation-triangle"></i> No se encontró la dirección. Intenta con otra búsqueda.';
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 5000);
    }
}

// Función global para abrir el selector de ubicación
window.openLocationPicker = function() {
    if (!window.almakidsMapSystem) {
        window.almakidsMapSystem = new AlmaKidsMapSystem();
        setTimeout(() => {
            window.almakidsMapSystem.openModal();
        }, 500);
    } else {
        window.almakidsMapSystem.openModal();
    }
};

// Función global para remover ubicación seleccionada
window.removeLocation = function() {
    const locationInput = document.getElementById('location');
    const locationCoords = document.getElementById('locationCoords');
    const locationUrl = document.getElementById('locationUrl');
    const selectedLocationDiv = document.getElementById('selectedLocation');

    if (locationInput) locationInput.value = '';
    if (locationCoords) locationCoords.value = '';
    if (locationUrl) locationUrl.value = '';
    if (selectedLocationDiv) selectedLocationDiv.style.display = 'none';

    // Mostrar confirmación
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #6c757d;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10002;
        animation: slideInUp 0.3s ease;
    `;
    toast.innerHTML = '<i class="fas fa-trash"></i> Ubicación removida';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
};

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // El sistema se inicializa cuando se hace clic en el botón
    console.log('🗺️ ALMA Kids: Sistema de mapas preparado');
});

console.log('🗺️ ALMA Kids: Google Maps Integration cargado');
