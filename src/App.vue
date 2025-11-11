<!--
  The Hills Guide - Root Application Component

  This is the main application wrapper that provides:
  1. Global error boundary for graceful error handling
  2. Router view with smooth page transitions
  3. Global loading indicator for data operations
  4. Toast notification system for user feedback
  5. Mobile-optimized layout structure

  Architecture:
  - Single Page Application (SPA) with Vue Router
  - Component-based architecture with error boundaries
  - Reactive state management via Pinia stores
  - Mobile-first responsive design with safe area support

  Key Features:
  - Smooth page transitions with fade effects
  - Centralized loading state management
  - Error boundary prevents app crashes
  - Mobile-safe area handling for notched devices
-->

<template>
  <!--
    Main app container with conditional loading class
    The loading class can be used to disable interactions during data loading
  -->
  <div id="app" :class="{ 'loading': isLoading }">

    <!--
      Error Boundary Component
      Catches and handles any JavaScript errors in child components
      Prevents the entire app from crashing due to component errors
      Shows user-friendly error messages instead of blank screens
    -->
    <ErrorBoundary>

      <!--
        Vue Router View with Transitions
        Renders the current route's component with smooth transitions
        Uses slot-scope to access the component for transition wrapping
      -->
      <router-view v-slot="{ Component }">
        <!--
          Fade Transition Between Routes
          - mode="out-in": Wait for old component to fade out before new one fades in
          - Provides smooth navigation experience between pages
          - 200ms duration for snappy mobile performance
        -->
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>

    </ErrorBoundary>

    <!--
      Global Loading Overlay
      Displays when data is being loaded (business directory, events, etc.)
      Prevents user interaction during critical operations
      Uses luxury gold spinner matching brand colors
    -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!--
      Global Toast Notification System
      Provides app-wide notifications for:
      - Success messages (business saved, event added, etc.)
      - Error messages (network failures, invalid actions)
      - Information messages (feature updates, tips)
      - Warning messages (offline mode, permission requests)

      Usage in components:
      this.$refs.toastRef.show('Message', 'success')
    -->
    <Toast ref="toastRef" />

  </div>
</template>

<script setup>
/**
 * Root Component Setup
 *
 * Manages the overall application state and provides global functionality
 * Uses Composition API for modern, reactive component development
 */

// ===== CORE VUE IMPORTS =====
import { ref, computed } from 'vue'

// ===== STORE MANAGEMENT =====
// Business store manages loading states for the entire application
// When businesses are loading, the global loading indicator appears
import { useBusinessStore } from '@/stores/businessStore'

// ===== UI COMPONENTS =====
// Global components that provide app-wide functionality
import ErrorBoundary from '@/components/UI/ErrorBoundary.vue'  // Error handling
import Toast from '@/components/UI/Toast.vue'                  // Notifications

// ===== REACTIVE STATE =====
// Get business store instance for loading state management
const businessStore = useBusinessStore()

// Template ref for accessing toast component methods
const toastRef = ref(null)

// ===== COMPUTED PROPERTIES =====
/**
 * Global Loading State
 *
 * Computed property that reflects the overall app loading state
 * Currently tied to business store loading, but can be expanded
 * to include other store loading states (events, user data, etc.)
 *
 * @returns {boolean} True when any critical data is loading
 */
const isLoading = computed(() => businessStore.loading)

// Future enhancement: Combined loading state from multiple stores
// const isLoading = computed(() =>
//   businessStore.loading || eventsStore.loading || userStore.loading
// )

</script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-gold: #D4AF37;
  --primary-dark: #B8941F;
  --background-luxury: #0A0A0A;
  --text-white: #ffffff;
  --text-gold: #D4AF37;
  --text-platinum: #E5E4E2;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--background-luxury);
  color: var(--text-white);
  overflow-x: hidden;
  line-height: 1.5;
}

#app {
  min-height: 100vh;
  position: relative;
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(212, 175, 55, 0.3);
  border-top-color: var(--primary-gold);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Utility Classes */
.text-center {
  text-align: center;
}

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #111;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-gold);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}

/* Mobile Safe Area */
@supports (padding: max(0px)) {
  #app {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}
</style>
