/**
 * ALMA Kids - Sistema de Seguimiento de Cotizaciones
 * Sistema completo de gestión y seguimiento de solicitudes
 */

class QuoteTrackingSystem {
    constructor() {
        this.quotes = JSON.parse(localStorage.getItem('almakids_quotes')) || [];
        this.analytics = JSON.parse(localStorage.getItem('almakids_analytics')) || {
            totalQuotes: 0,
            conversionRate: 0,
            popularServices: {},
            busyDates: {},
            customerData: {}
        };
        this.init();
    }

    init() {
        this.setupQuoteTracking();
        this.setupDateConflictDetection();
        this.setupAdminPanel();
        this.setupAnalytics();
        this.setupNotificationSystem();
        this.setupDataExport();
        console.log('🎪 ALMA Kids: Sistema de seguimiento activado');
    }

    // ========================================
    // SEGUIMIENTO DE COTIZACIONES
    // ========================================

    trackQuote(formData) {
        const quoteId = this.generateQuoteId();
        const timestamp = Date.now();
        
        const quote = {
            id: quoteId,
            timestamp: timestamp,
            date: new Date().toISOString(),
            customerInfo: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            },
            eventDetails: {
                date: formData.eventDate,
                startTime: formData.startTime,
                endTime: formData.endTime,
                location: formData.location,
                serviceType: formData.serviceType,
                decoration: formData.decoration,
                additionalMessage: formData.additionalMessage
            },
            cart: window.almakidsCart ? [...window.almakidsCart] : [],
            status: 'pending',
            source: 'website_form',
            deviceInfo: this.getDeviceInfo(),
            sessionData: this.getSessionData()
        };

        // Verificar conflictos de fecha
        const conflicts = this.checkDateConflicts(formData.eventDate, formData.startTime);
        if (conflicts.length > 0) {
            quote.dateConflicts = conflicts;
            this.showConflictWarning(conflicts);
        }

        // Guardar cotización
        this.quotes.push(quote);
        this.saveQuotes();
        
        // Actualizar analytics
        this.updateAnalytics(quote);
        
        // Mostrar información de seguimiento
        this.showTrackingInfo(quote);
        
        console.log('📊 Nueva cotización registrada:', quoteId);
        return quote;
    }

    checkDateConflicts(eventDate, startTime) {
        const conflicts = this.quotes.filter(quote => {
            return quote.eventDetails.date === eventDate && 
                   quote.status !== 'cancelled' &&
                   this.isTimeConflict(quote.eventDetails.startTime, startTime);
        });

        return conflicts.map(quote => ({
            id: quote.id,
            customerName: quote.customerInfo.name,
            time: quote.eventDetails.startTime,
            location: quote.eventDetails.location,
            service: quote.eventDetails.serviceType
        }));
    }

    isTimeConflict(existingTime, newTime) {
        const existing = this.timeToMinutes(existingTime);
        const newTimeMinutes = this.timeToMinutes(newTime);
        
        // Considerar conflicto si hay menos de 6 horas de diferencia
        const diffHours = Math.abs(existing - newTimeMinutes) / 60;
        return diffHours < 6;
    }

    timeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    showConflictWarning(conflicts) {
        const warningBox = document.createElement('div');
        warningBox.className = 'conflict-warning';
        warningBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FFF3CD, #FCF4A3);
            border: 2px solid #E91E63;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            z-index: 10001;
            max-width: 500px;
            animation: bounceIn 0.5s ease;
        `;

        warningBox.innerHTML = `
            <div style="text-align: center;">
                <div style="
                    background: rgba(233, 30, 99, 0.1);
                    padding: 1rem;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 1rem auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; color: #E91E63;"></i>
                </div>
                
                <h3 style="margin: 0 0 1rem 0; color: #E91E63;">⚠️ Fecha con Solicitudes Previas</h3>
                <p style="margin: 0 0 1.5rem 0; color: #666;">
                    Detectamos ${conflicts.length} solicitud${conflicts.length > 1 ? 'es' : ''} previa${conflicts.length > 1 ? 's' : ''} para esta fecha:
                </p>
                
                <div style="
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    text-align: left;
                ">
                    ${conflicts.map(conflict => `
                        <div style="margin-bottom: 0.5rem; padding: 0.5rem; border-left: 3px solid #E91E63;">
                            <strong>${conflict.customerName}</strong> - ${conflict.time}<br>
                            <small style="color: #666;">${conflict.location}</small>
                        </div>
                    `).join('')}
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="continueWithConflict()" style="
                        background: linear-gradient(135deg, #E91E63, #FF6B9D);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">
                        Continuar Anyway
                    </button>
                    <button onclick="closeConflictWarning()" style="
                        background: #f8f9fa;
                        color: #666;
                        border: 2px solid #ddd;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                    ">
                        Cambiar Fecha
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(warningBox);
    }

    showTrackingInfo(quote) {
        const trackingBox = document.createElement('div');
        trackingBox.className = 'tracking-info';
        trackingBox.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #D4EDDA, #C3E6CB);
            border: 2px solid #27ae60;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(39, 174, 96, 0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
        `;

        trackingBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="
                    background: rgba(39, 174, 96, 0.2);
                    padding: 0.75rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-check-circle" style="color: #27ae60; font-size: 1.5rem;"></i>
                </div>
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: #27ae60;">✅ Cotización Registrada</h4>
                    <p style="margin: 0; color: #155724; font-size: 0.9rem;">
                        <strong>ID:</strong> ${quote.id}<br>
                        <strong>Fecha evento:</strong> ${this.formatDate(quote.eventDetails.date)}<br>
                        <strong>Total cotizaciones hoy:</strong> ${this.getTodayQuotesCount()}
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

        document.body.appendChild(trackingBox);

        // Auto-remove después de 8 segundos
        setTimeout(() => {
            if (trackingBox.parentNode) {
                trackingBox.remove();
            }
        }, 8000);
    }

    // ========================================
    // PANEL DE ADMINISTRACIÓN
    // ========================================

    setupAdminPanel() {
        // Crear botón de acceso al panel admin (solo visible en localhost)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const adminButton = document.createElement('button');
            adminButton.innerHTML = '<i class="fas fa-cog"></i>';
            adminButton.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background: #2c3e50;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                z-index: 9998;
                font-size: 1rem;
            `;
            adminButton.onclick = () => this.openAdminPanel();
            document.body.appendChild(adminButton);
        }
    }

    openAdminPanel() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'adminPanel';
        modal.style.display = 'block';

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header" style="
                    background: linear-gradient(135deg, #2c3e50, #34495e);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 12px 12px 0 0;
                ">
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-chart-line"></i> Panel de Administración ALMA Kids
                    </h3>
                    <button onclick="closeAdminPanel()" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 1.5rem;
                        cursor: pointer;
                    ">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div style="padding: 2rem;">
                    <!-- Dashboard Stats -->
                    <div class="admin-stats" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 1rem;
                        margin-bottom: 2rem;
                    ">
                        <div class="stat-card" style="
                            background: linear-gradient(135deg, #E91E63, #FF6B9D);
                            color: white;
                            padding: 1.5rem;
                            border-radius: 12px;
                            text-align: center;
                        ">
                            <h4 style="margin: 0 0 0.5rem 0;">Total Cotizaciones</h4>
                            <p style="margin: 0; font-size: 2rem; font-weight: bold;">${this.quotes.length}</p>
                        </div>
                        
                        <div class="stat-card" style="
                            background: linear-gradient(135deg, #4CAF50, #45A049);
                            color: white;
                            padding: 1.5rem;
                            border-radius: 12px;
                            text-align: center;
                        ">
                            <h4 style="margin: 0 0 0.5rem 0;">Hoy</h4>
                            <p style="margin: 0; font-size: 2rem; font-weight: bold;">${this.getTodayQuotesCount()}</p>
                        </div>
                        
                        <div class="stat-card" style="
                            background: linear-gradient(135deg, #FF9800, #F57C00);
                            color: white;
                            padding: 1.5rem;
                            border-radius: 12px;
                            text-align: center;
                        ">
                            <h4 style="margin: 0 0 0.5rem 0;">Esta Semana</h4>
                            <p style="margin: 0; font-size: 2rem; font-weight: bold;">${this.getWeekQuotesCount()}</p>
                        </div>
                        
                        <div class="stat-card" style="
                            background: linear-gradient(135deg, #9C27B0, #7B1FA2);
                            color: white;
                            padding: 1.5rem;
                            border-radius: 12px;
                            text-align: center;
                        ">
                            <h4 style="margin: 0 0 0.5rem 0;">Conflictos Detectados</h4>
                            <p style="margin: 0; font-size: 2rem; font-weight: bold;">${this.getConflictsCount()}</p>
                        </div>
                    </div>
                    
                    <!-- Tabs Navigation -->
                    <div class="admin-tabs" style="
                        display: flex;
                        border-bottom: 2px solid #f0f0f0;
                        margin-bottom: 2rem;
                    ">
                        <button class="tab-btn active" onclick="showAdminTab('quotes')" style="
                            background: none;
                            border: none;
                            padding: 1rem 2rem;
                            cursor: pointer;
                            border-bottom: 2px solid #E91E63;
                            color: #E91E63;
                            font-weight: 600;
                        ">
                            📋 Cotizaciones Recientes
                        </button>
                        <button class="tab-btn" onclick="showAdminTab('conflicts')" style="
                            background: none;
                            border: none;
                            padding: 1rem 2rem;
                            cursor: pointer;
                            color: #666;
                        ">
                            ⚠️ Conflictos de Fecha
                        </button>
                        <button class="tab-btn" onclick="showAdminTab('analytics')" style="
                            background: none;
                            border: none;
                            padding: 1rem 2rem;
                            cursor: pointer;
                            color: #666;
                        ">
                            📊 Analytics
                        </button>
                        <button class="tab-btn" onclick="showAdminTab('export')" style="
                            background: none;
                            border: none;
                            padding: 1rem 2rem;
                            cursor: pointer;
                            color: #666;
                        ">
                            📤 Exportar Datos
                        </button>
                    </div>
                    
                    <!-- Tab Content -->
                    <div id="adminTabContent">
                        ${this.renderQuotesTab()}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    renderQuotesTab() {
        const recentQuotes = this.quotes.slice(-10).reverse(); // Últimas 10 cotizaciones
        
        return `
            <div class="quotes-list">
                <h4 style="color: #E91E63; margin-bottom: 1rem;">📋 Últimas Cotizaciones (${recentQuotes.length})</h4>
                
                ${recentQuotes.length === 0 ? 
                    '<p style="text-align: center; color: #666; padding: 2rem;">No hay cotizaciones registradas</p>' :
                    recentQuotes.map(quote => `
                        <div class="quote-item" style="
                            background: white;
                            border: 1px solid #e0e0e0;
                            border-radius: 8px;
                            padding: 1.5rem;
                            margin-bottom: 1rem;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        ">
                            <div style="display: flex; justify-content: between; align-items: flex-start; gap: 1rem;">
                                <div style="flex: 1;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        <span style="
                                            background: ${this.getStatusColor(quote.status)};
                                            color: white;
                                            padding: 0.25rem 0.75rem;
                                            border-radius: 20px;
                                            font-size: 0.75rem;
                                            font-weight: 600;
                                        ">${quote.status.toUpperCase()}</span>
                                        <span style="color: #666; font-size: 0.875rem;">ID: ${quote.id}</span>
                                    </div>
                                    
                                    <h5 style="margin: 0 0 0.5rem 0; color: #2c3e50;">
                                        👤 ${quote.customerInfo.name}
                                    </h5>
                                    
                                    <div style="font-size: 0.875rem; color: #666; line-height: 1.4;">
                                        📅 <strong>${this.formatDate(quote.eventDetails.date)}</strong> a las ${quote.eventDetails.startTime}<br>
                                        📍 ${quote.eventDetails.location}<br>
                                        📞 ${quote.customerInfo.phone}<br>
                                        🎪 ${this.getServiceName(quote.eventDetails.serviceType)}
                                        ${quote.cart.length > 0 ? `<br>🛒 ${quote.cart.length} productos en carrito` : ''}
                                        ${quote.dateConflicts ? `<br>⚠️ ${quote.dateConflicts.length} conflicto(s) detectado(s)` : ''}
                                    </div>
                                </div>
                                
                                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                    <button onclick="viewQuoteDetails('${quote.id}')" style="
                                        background: #E91E63;
                                        color: white;
                                        border: none;
                                        padding: 0.5rem;
                                        border-radius: 6px;
                                        cursor: pointer;
                                        font-size: 0.875rem;
                                    ">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button onclick="contactCustomer('${quote.customerInfo.phone}')" style="
                                        background: #25D366;
                                        color: white;
                                        border: none;
                                        padding: 0.5rem;
                                        border-radius: 6px;
                                        cursor: pointer;
                                        font-size: 0.875rem;
                                    ">
                                        <i class="fab fa-whatsapp"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `;
    }

    renderConflictsTab() {
        const conflicts = this.getAllDateConflicts();
        
        return `
            <div class="conflicts-list">
                <h4 style="color: #E91E63; margin-bottom: 1rem;">⚠️ Conflictos de Fechas Detectados</h4>
                
                ${conflicts.length === 0 ? 
                    '<p style="text-align: center; color: #666; padding: 2rem;">No hay conflictos de fechas detectados</p>' :
                    conflicts.map(conflict => `
                        <div style="
                            background: #FFF3CD;
                            border: 1px solid #E91E63;
                            border-radius: 8px;
                            padding: 1.5rem;
                            margin-bottom: 1rem;
                        ">
                            <h5 style="margin: 0 0 1rem 0; color: #E91E63;">
                                📅 ${this.formatDate(conflict.date)} - ${conflict.quotes.length} solicitudes
                            </h5>
                            
                            ${conflict.quotes.map(quote => `
                                <div style="
                                    background: white;
                                    padding: 1rem;
                                    border-radius: 6px;
                                    margin-bottom: 0.5rem;
                                    border-left: 3px solid #E91E63;
                                ">
                                    <strong>${quote.customerInfo.name}</strong> - ${quote.eventDetails.startTime}<br>
                                    <small style="color: #666;">${quote.eventDetails.location}</small>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')
                }
            </div>
        `;
    }

    // ========================================
    // ANALYTICS Y ESTADÍSTICAS
    // ========================================

    updateAnalytics(quote) {
        this.analytics.totalQuotes++;
        
        // Servicios populares
        const service = quote.eventDetails.serviceType;
        if (service) {
            this.analytics.popularServices[service] = (this.analytics.popularServices[service] || 0) + 1;
        }
        
        // Fechas ocupadas
        const eventDate = quote.eventDetails.date;
        if (eventDate) {
            this.analytics.busyDates[eventDate] = (this.analytics.busyDates[eventDate] || 0) + 1;
        }
        
        // Datos de cliente
        this.analytics.customerData[quote.customerInfo.email] = {
            name: quote.customerInfo.name,
            phone: quote.customerInfo.phone,
            lastQuote: quote.timestamp,
            totalQuotes: (this.analytics.customerData[quote.customerInfo.email]?.totalQuotes || 0) + 1
        };
        
        this.saveAnalytics();
    }

    renderAnalyticsTab() {
        const popularServices = Object.entries(this.analytics.popularServices)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
            
        const busyDates = Object.entries(this.analytics.busyDates)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        return `
            <div class="analytics-content">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <h4 style="color: #E91E63; margin-bottom: 1rem;">🎪 Servicios Más Solicitados</h4>
                        <div style="background: white; padding: 1rem; border-radius: 8px; border: 1px solid #e0e0e0;">
                            ${popularServices.map(([service, count]) => `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    padding: 0.5rem 0;
                                    border-bottom: 1px solid #f0f0f0;
                                ">
                                    <span>${this.getServiceName(service)}</span>
                                    <span style="font-weight: bold; color: #E91E63;">${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="color: #E91E63; margin-bottom: 1rem;">📅 Fechas Más Solicitadas</h4>
                        <div style="background: white; padding: 1rem; border-radius: 8px; border: 1px solid #e0e0e0;">
                            ${busyDates.map(([date, count]) => `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    padding: 0.5rem 0;
                                    border-bottom: 1px solid #f0f0f0;
                                ">
                                    <span>${this.formatDate(date)}</span>
                                    <span style="font-weight: bold; color: #E91E63;">${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Gráfico de tendencias -->
                <div style="margin-top: 2rem;">
                    <h4 style="color: #E91E63; margin-bottom: 1rem;">📈 Tendencias de Cotizaciones</h4>
                    <div style="
                        background: white;
                        padding: 1rem;
                        border-radius: 8px;
                        border: 1px solid #e0e0e0;
                        text-align: center;
                    ">
                        ${this.renderTrendChart()}
                    </div>
                </div>
            </div>
        `;
    }

    renderTrendChart() {
        const last7Days = this.getLast7DaysQuotes();
        
        return `
            <div style="display: flex; align-items: end; justify-content: space-around; height: 150px; gap: 0.5rem;">
                ${last7Days.map((count, index) => {
                    const height = count === 0 ? 10 : (count / Math.max(...last7Days)) * 130 + 20;
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - index));
                    
                    return `
                        <div style="text-align: center;">
                            <div style="
                                background: linear-gradient(to top, #E91E63, #FF6B9D);
                                width: 40px;
                                height: ${height}px;
                                border-radius: 4px 4px 0 0;
                                margin-bottom: 0.5rem;
                                display: flex;
                                align-items: end;
                                justify-content: center;
                                color: white;
                                font-weight: bold;
                                font-size: 0.875rem;
                            ">
                                ${count || ''}
                            </div>
                            <small style="color: #666;">${date.toLocaleDateString('es-CL', {weekday: 'short'})}</small>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // ========================================
    // UTILIDADES Y HELPERS
    // ========================================

    generateQuoteId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `AK-${timestamp}-${random}`.toUpperCase();
    }

    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screen: { width: screen.width, height: screen.height },
            viewport: { width: window.innerWidth, height: window.innerHeight }
        };
    }

    getSessionData() {
        return {
            referrer: document.referrer,
            currentUrl: window.location.href,
            timeOnSite: Date.now() - (window.almakidsSessionStart || Date.now())
        };
    }

    getTodayQuotesCount() {
        const today = new Date().toDateString();
        return this.quotes.filter(quote => 
            new Date(quote.timestamp).toDateString() === today
        ).length;
    }

    getWeekQuotesCount() {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        return this.quotes.filter(quote => quote.timestamp > weekAgo).length;
    }

    getConflictsCount() {
        return this.getAllDateConflicts().length;
    }

    getAllDateConflicts() {
        const dateGroups = {};
        
        this.quotes.forEach(quote => {
            const date = quote.eventDetails.date;
            if (!dateGroups[date]) {
                dateGroups[date] = [];
            }
            dateGroups[date].push(quote);
        });

        return Object.entries(dateGroups)
            .filter(([date, quotes]) => quotes.length > 1)
            .map(([date, quotes]) => ({ date, quotes }));
    }

    getLast7DaysQuotes() {
        const counts = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toDateString();
            
            const count = this.quotes.filter(quote => 
                new Date(quote.timestamp).toDateString() === dateString
            ).length;
            
            counts.push(count);
        }
        return counts;
    }

    getStatusColor(status) {
        const colors = {
            'pending': '#FF9800',
            'confirmed': '#4CAF50',
            'cancelled': '#f44336',
            'completed': '#2196F3'
        };
        return colors[status] || '#9E9E9E';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getServiceName(serviceType) {
        const services = {
            'plaza-blanda-basico': 'Plaza Blanda - Kit Básico',
            'plaza-blanda-premium': 'Plaza Blanda - Kit Premium',
            'inflable-pequeno': 'Inflable Pequeño',
            'inflable-mediano': 'Inflable Mediano',
            'inflable-grande': 'Inflable Grande',
            'combo-plaza-inflable': 'Combo Plaza + Inflable'
        };
        return services[serviceType] || serviceType || 'No especificado';
    }

    // ========================================
    // PERSISTENCIA DE DATOS
    // ========================================

    saveQuotes() {
        localStorage.setItem('almakids_quotes', JSON.stringify(this.quotes));
    }

    saveAnalytics() {
        localStorage.setItem('almakids_analytics', JSON.stringify(this.analytics));
    }

    exportData() {
        const data = {
            quotes: this.quotes,
            analytics: this.analytics,
            exportDate: new Date().toISOString(),
            totalRecords: this.quotes.length
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `almakids-cotizaciones-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        console.log('📤 Datos exportados exitosamente');
    }
}

// Funciones globales para el panel admin
window.closeAdminPanel = function() {
    const modal = document.getElementById('adminPanel');
    if (modal) modal.remove();
};

window.showAdminTab = function(tabName) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.style.borderBottom = 'none';
        tab.style.color = '#666';
    });
    
    event.target.style.borderBottom = '2px solid #E91E63';
    event.target.style.color = '#E91E63';
    
    const content = document.getElementById('adminTabContent');
    const trackingSystem = window.almakidsTracking;
    
    switch(tabName) {
        case 'quotes':
            content.innerHTML = trackingSystem.renderQuotesTab();
            break;
        case 'conflicts':
            content.innerHTML = trackingSystem.renderConflictsTab();
            break;
        case 'analytics':
            content.innerHTML = trackingSystem.renderAnalyticsTab();
            break;
        case 'export':
            content.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h4 style="color: #E91E63;">📤 Exportar Datos</h4>
                    <p>Descarga todos los datos de cotizaciones en formato JSON</p>
                    <button onclick="window.almakidsTracking.exportData()" style="
                        background: linear-gradient(135deg, #E91E63, #FF6B9D);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">
                        <i class="fas fa-download"></i> Descargar Datos
                    </button>
                </div>
            `;
            break;
    }
};

window.viewQuoteDetails = function(quoteId) {
    const quote = window.almakidsTracking.quotes.find(q => q.id === quoteId);
    if (quote) {
        alert(`Detalles de Cotización ${quoteId}:\n\n${JSON.stringify(quote, null, 2)}`);
    }
};

window.contactCustomer = function(phone) {
    const message = '🎪 Hola! Soy de ALMA Kids. Recibimos tu cotización y queremos confirmar los detalles de tu evento.';
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

window.continueWithConflict = function() {
    document.querySelector('.conflict-warning').remove();
};

window.closeConflictWarning = function() {
    document.querySelector('.conflict-warning').remove();
};

// Inicializar sistema de seguimiento
document.addEventListener('DOMContentLoaded', () => {
    window.almakidsTracking = new QuoteTrackingSystem();
    window.almakidsSessionStart = Date.now();
});

// Integrar con el formulario existente
const originalHandleFormSubmit = window.handleFormSubmit;
window.handleFormSubmit = function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Registrar en el sistema de seguimiento
    if (window.almakidsTracking) {
        window.almakidsTracking.trackQuote(data);
    }
    
    // Ejecutar función original si existe
    if (originalHandleFormSubmit) {
        return originalHandleFormSubmit(e);
    }
    
    return handleFormSubmit(e);
};

console.log('🎪 ALMA Kids: Sistema de seguimiento de cotizaciones cargado');


