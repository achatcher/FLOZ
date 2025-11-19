/**
 * Multi-Location Lifestyle Directory - Main Application Entry Point
 *
 * This file initializes a scalable Vue 3 application that can be easily adapted
 * for different geographic markets while maintaining consistent functionality.
 * The modular architecture separates location-specific content from core features.
 *
 * Scalable Architecture Overview:
 * 1. Create Vue app instance with Composition API
 * 2. Initialize location-based configuration system
 * 3. Apply location-specific theming and branding
 * 4. Initialize Pinia store management
 * 5. Set up Vue Router for navigation
 * 6. Load modular CSS framework
 * 7. Initialize performance monitoring
 * 8. Set up mobile gesture handling
 * 9. Preload location-specific data
 * 10. Mount application with all utilities available
 *
 * Key Features Initialized:
 * - Multi-location configuration system
 * - Dynamic theming based on location
 * - Modular business categorization
 * - PWA capabilities with service worker
 * - Core Web Vitals monitoring
 * - Mobile touch gestures (swipe, pull-to-refresh)
 * - Offline functionality
 * - App store readiness for any market
 */

// ===== CORE VUE FRAMEWORK =====
import { createApp } from 'vue'           // Vue 3 application factory
import { createPinia } from 'pinia'       // Modern state management
import App from './App.vue'              // Root application component
import router from './router'            // Client-side routing configuration

// ===== APP CONFIGURATION =====
// Centralized app configuration system for easy customization
// Managed through app-config.json and useAppConfig composable

// ===== STYLING SYSTEM =====
// Modular CSS Framework - Complete design system with:
// - Location-based theming via CSS custom properties
// - Mobile-first responsive breakpoints
// - Touch-optimized components (44px+ targets)
// - Dynamic color schemes based on location configuration
// - Performance optimizations for mobile devices
import './assets/styles/main.css'

// ===== MOBILE OPTIMIZATION UTILITIES =====
// Performance monitoring system that tracks:
// - Core Web Vitals (LCP, FID, CLS)
// - Mobile device capabilities
// - Network conditions and battery status
// - Real-time performance metrics for optimization
import { initPerformanceMonitoring } from './utils/performance.js'

// Mobile gesture handling system that provides:
// - Touch gesture recognition (tap, swipe, long press)
// - iOS-style edge swipe navigation
// - Pull-to-refresh functionality
// - Mobile keyboard management
// - Cross-platform gesture support
import { initMobileGestures } from './utils/gestures.js'

// ===== APPLICATION SETUP =====
// Create the main Vue application instance
// Uses Composition API for modern, performant component development
const app = createApp(App)

// Initialize Pinia for state management
// Provides reactive stores for business data, events, and user location
const pinia = createPinia()

// Install plugins in correct order
app.use(pinia)    // State management first (stores depend on this)
app.use(router)   // Routing second (may access stores in route guards)

// ===== DATA STORES INITIALIZATION =====
// Import stores after Pinia is installed to ensure proper initialization
import { useBusinessStore } from './stores/businessStore'
import { useEventsStore } from './stores/eventsStore'

// Get store instances - these will manage application data
const businessStore = useBusinessStore()  // Business directory, search, categories
const eventsStore = useEventsStore()      // Events calendar, featured events

// ===== APP INITIALIZATION =====
// Initialize core app functionality

// ===== PRELOAD CRITICAL DATA =====
// Load essential data before mounting the application
// This prevents loading states on first render and improves perceived performance
Promise.all([
  businessStore.loadData(),      // Load complete business directory
  eventsStore.loadEventsData()   // Load events calendar data
]).then(() => {
  // ===== MOBILE OPTIMIZATION INITIALIZATION =====

  // Initialize performance monitoring system
  // Tracks Core Web Vitals and provides real-time performance insights
  // Available in components as this.$performance
  const performanceMonitor = initPerformanceMonitoring()

  // Initialize mobile gesture system
  // Provides touch gestures, swipe navigation, and mobile interactions
  // Available in components as this.$gestures
  const mobileGestures = initMobileGestures(router)

  // ===== GLOBAL UTILITIES =====
  // Make utilities available to all components via global properties
  // This allows any component to access performance data and gesture handlers
  app.config.globalProperties.$performance = performanceMonitor
  app.config.globalProperties.$gestures = mobileGestures

  // ===== APPLICATION MOUNTING =====
  // Mount the application to the DOM
  // All data is loaded and utilities are initialized at this point
  app.mount('#app')

  // ===== DEVELOPMENT LOGGING =====
  // Log successful initialization in development environment
  // Helps developers confirm all systems are properly initialized
  if (import.meta.env.DEV) {
    console.log('🚀 App initialized successfully')
    console.log('📱 Mobile optimizations active')
    console.log('📊 Performance monitoring enabled')
    console.log('👆 Touch gestures configured')

    // Log loaded data counts for debugging
    console.log(`📄 ${businessStore.businesses.length} businesses loaded`)
    console.log(`📅 ${eventsStore.events.length} events loaded`)
  }
})
