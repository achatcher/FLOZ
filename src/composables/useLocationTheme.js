/**
 * Location-Based Theme Composable
 *
 * Provides reactive theming system that automatically applies location-specific
 * branding, colors, typography, and visual styles based on the current location
 * configuration. This allows the same codebase to have completely different
 * visual identities for different markets.
 *
 * Usage in components:
 * ```vue
 * <script setup>
 * import { useLocationTheme } from '@/composables/useLocationTheme'
 * const { theme, branding, applyTheme } = useLocationTheme()
 * </script>
 * ```
 */

import { ref, computed, onMounted, watch } from 'vue'
import { getLocationConfig } from '@/config/locations'

/**
 * CSS Custom Properties Manager
 * Dynamically updates CSS variables based on location configuration
 */
class ThemeManager {
  constructor() {
    this.root = document.documentElement
    this.appliedTheme = null
  }

  /**
   * Apply Location Theme to DOM
   * Updates CSS custom properties to match location configuration
   */
  applyLocationTheme(locationConfig) {
    const { theme } = locationConfig

    // ===== COLOR SYSTEM =====
    // Primary brand colors
    this.setProperty('--color-primary', theme.colors.primary)
    this.setProperty('--color-primary-dark', theme.colors.primaryDark)
    this.setProperty('--color-accent', theme.colors.accent || theme.colors.primary)

    // Background colors
    this.setProperty('--color-bg-primary', theme.colors.background)
    this.setProperty('--color-bg-secondary', theme.colors.backgroundSecondary)

    // Text colors
    this.setProperty('--color-text-primary', theme.colors.text)
    this.setProperty('--color-text-secondary', theme.colors.textSecondary)

    // State colors
    this.setProperty('--color-success', theme.colors.success || '#4CAF50')
    this.setProperty('--color-warning', theme.colors.warning || '#FF9800')
    this.setProperty('--color-error', theme.colors.error || '#F44336')

    // ===== TYPOGRAPHY SYSTEM =====
    this.setProperty('--font-primary', theme.fonts.primary)
    this.setProperty('--font-heading', theme.fonts.heading)
    this.setProperty('--font-luxury', theme.fonts.luxury)

    // ===== VISUAL STYLE SYSTEM =====
    if (theme.style) {
      this.setProperty('--border-radius', theme.style.borderRadius || '8px')

      // Shadow intensity mapping
      const shadowIntensity = this.getShadowIntensity(theme.style.shadowIntensity)
      this.setProperty('--shadow-sm', shadowIntensity.small)
      this.setProperty('--shadow-md', shadowIntensity.medium)
      this.setProperty('--shadow-lg', shadowIntensity.large)

      // Gradient styles
      const gradients = this.getGradientStyles(theme.style.gradientStyle, theme.colors)
      Object.entries(gradients).forEach(([key, value]) => {
        this.setProperty(`--gradient-${key}`, value)
      })
    }

    // ===== BUSINESS TIER COLORS =====
    // Apply business tier colors for consistent branding
    if (locationConfig.businessCategories?.tiers) {
      Object.entries(locationConfig.businessCategories.tiers).forEach(([tier, config]) => {
        this.setProperty(`--color-tier-${tier}`, config.color)
      })
    }

    this.appliedTheme = locationConfig.id

    // Store theme preference for consistency across sessions
    localStorage.setItem('appliedTheme', locationConfig.id)
  }

  /**
   * Set CSS Custom Property
   * Safely updates CSS variables with fallback handling
   */
  setProperty(property, value) {
    if (value && this.root) {
      this.root.style.setProperty(property, value)
    }
  }

  /**
   * Get Shadow Intensity Mapping
   * Returns shadow values based on intensity preference
   */
  getShadowIntensity(intensity = 'medium') {
    const shadowMappings = {
      light: {
        small: '0 1px 2px rgba(0, 0, 0, 0.05)',
        medium: '0 1px 3px rgba(0, 0, 0, 0.1)',
        large: '0 4px 6px rgba(0, 0, 0, 0.1)'
      },
      medium: {
        small: '0 1px 3px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
        large: '0 10px 15px rgba(0, 0, 0, 0.1)'
      },
      heavy: {
        small: '0 2px 4px rgba(0, 0, 0, 0.2)',
        medium: '0 8px 16px rgba(0, 0, 0, 0.15)',
        large: '0 20px 25px rgba(0, 0, 0, 0.1)'
      }
    }

    return shadowMappings[intensity] || shadowMappings.medium
  }

  /**
   * Generate Gradient Styles
   * Creates CSS gradients based on theme style and colors
   */
  getGradientStyles(style = 'modern', colors) {
    const { primary, primaryDark, accent } = colors

    const gradientStyles = {
      luxury: {
        primary: `linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%)`,
        hero: `linear-gradient(135deg, ${primary}20 0%, ${primaryDark}40 100%)`,
        card: `linear-gradient(145deg, ${colors.background} 0%, ${colors.backgroundSecondary} 100%)`
      },
      modern: {
        primary: `linear-gradient(90deg, ${primary} 0%, ${accent} 100%)`,
        hero: `linear-gradient(120deg, ${primary}10 0%, ${accent}20 100%)`,
        card: `linear-gradient(180deg, ${colors.background} 0%, ${colors.backgroundSecondary} 100%)`
      },
      minimal: {
        primary: primary,
        hero: `linear-gradient(180deg, ${colors.background} 0%, ${colors.backgroundSecondary} 100%)`,
        card: colors.backgroundSecondary
      }
    }

    return gradientStyles[style] || gradientStyles.modern
  }
}

// Global theme manager instance
const themeManager = new ThemeManager()

/**
 * Location Theme Composable
 * Main composable function providing reactive theme management
 */
export function useLocationTheme() {
  // Reactive references
  const locationConfig = ref(getLocationConfig())
  const isThemeApplied = ref(false)

  // ===== COMPUTED PROPERTIES =====

  /**
   * Current Theme Configuration
   * Reactive access to current location's theme settings
   */
  const theme = computed(() => locationConfig.value.theme)

  /**
   * Current Branding Configuration
   * Reactive access to current location's branding settings
   */
  const branding = computed(() => locationConfig.value.branding)

  /**
   * Current Geography Configuration
   * Reactive access to current location's geographic settings
   */
  const geography = computed(() => locationConfig.value.geography)

  /**
   * Business Categories Configuration
   * Reactive access to current location's business categorization
   */
  const businessConfig = computed(() => locationConfig.value.businessCategories)

  /**
   * Contact Information
   * Reactive access to current location's contact details
   */
  const contact = computed(() => locationConfig.value.contact)

  /**
   * SEO Configuration
   * Reactive access to current location's SEO settings
   */
  const seoConfig = computed(() => locationConfig.value.seo)

  // ===== THEME MANAGEMENT METHODS =====

  /**
   * Apply Current Theme
   * Applies the current location's theme to the DOM
   */
  const applyTheme = () => {
    try {
      themeManager.applyLocationTheme(locationConfig.value)
      isThemeApplied.value = true

      console.log(`✅ Applied theme for: ${locationConfig.value.name}`)
    } catch (error) {
      console.error('Failed to apply theme:', error)
      isThemeApplied.value = false
    }
  }

  /**
   * Refresh Location Configuration
   * Reloads location config and reapplies theme
   */
  const refreshLocation = () => {
    locationConfig.value = getLocationConfig()
    applyTheme()
  }

  /**
   * Get CSS Variable Value
   * Utility to get current CSS custom property values
   */
  const getCSSVariable = (variable) => {
    if (typeof window !== 'undefined' && document.documentElement) {
      return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
    }
    return null
  }

  /**
   * Generate Dynamic Styles
   * Creates style objects for components using current theme
   */
  const getComponentStyles = (component = 'default') => {
    const styles = {
      default: {
        backgroundColor: getCSSVariable('--color-bg-primary'),
        color: getCSSVariable('--color-text-primary'),
        fontFamily: getCSSVariable('--font-primary')
      },
      card: {
        backgroundColor: getCSSVariable('--color-bg-secondary'),
        borderRadius: getCSSVariable('--border-radius'),
        boxShadow: getCSSVariable('--shadow-md')
      },
      button: {
        backgroundColor: getCSSVariable('--color-primary'),
        color: getCSSVariable('--color-text-primary'),
        borderRadius: getCSSVariable('--border-radius')
      },
      heading: {
        fontFamily: getCSSVariable('--font-heading'),
        color: getCSSVariable('--color-text-primary')
      }
    }

    return styles[component] || styles.default
  }

  // ===== LIFECYCLE MANAGEMENT =====

  // Watch for location config changes and reapply theme
  watch(() => locationConfig.value.id, () => {
    applyTheme()
  }, { immediate: false })

  // Apply theme on component mount
  onMounted(() => {
    applyTheme()
  })

  // ===== RETURN COMPOSABLE API =====
  return {
    // Configuration objects
    locationConfig: readonly(locationConfig),
    theme: readonly(theme),
    branding: readonly(branding),
    geography: readonly(geography),
    businessConfig: readonly(businessConfig),
    contact: readonly(contact),
    seoConfig: readonly(seoConfig),

    // State
    isThemeApplied: readonly(isThemeApplied),

    // Methods
    applyTheme,
    refreshLocation,
    getCSSVariable,
    getComponentStyles,

    // Utility computed properties
    appName: computed(() => branding.value.appName),
    primaryColor: computed(() => theme.value.colors.primary),
    mapCenter: computed(() => geography.value.center),
    businessTiers: computed(() => businessConfig.value.tiers)
  }
}

/**
 * Global Theme Utilities
 * Standalone functions for theme management outside of components
 */
export const themeUtils = {
  /**
   * Apply Theme Globally
   * Apply location theme without using the composable (for main.js, etc.)
   */
  applyGlobalTheme: () => {
    const config = getLocationConfig()
    themeManager.applyLocationTheme(config)
  },

  /**
   * Get Theme Manager Instance
   * Access to the global theme manager for advanced usage
   */
  getThemeManager: () => themeManager,

  /**
   * Validate Theme Configuration
   * Ensures theme config has all required properties
   */
  validateTheme: (theme) => {
    const required = ['colors.primary', 'colors.background', 'colors.text', 'fonts.primary']
    const errors = []

    required.forEach(path => {
      const keys = path.split('.')
      let value = theme

      for (const key of keys) {
        value = value?.[key]
        if (value === undefined) {
          errors.push(`Missing theme property: ${path}`)
          break
        }
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Make readonly function available
import { readonly } from 'vue'