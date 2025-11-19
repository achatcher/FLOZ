// utils/constants.js
// Constants that use the centralized app configuration

// Default values - these will be used if app-config.json is not loaded yet
const DEFAULT_CENTER = { lat: 34.8526, lng: -82.3940 } // Greenville, SC
const DEFAULT_ZOOM_LEVEL = 15

// Get app configuration from localStorage cache (faster than async fetch)
const getCachedAppConfig = () => {
  try {
    const cached = localStorage.getItem('app-config')
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

// Export location-aware constants with fallbacks
export const getLocationCenter = () => {
  const config = getCachedAppConfig()
  return config?.app?.location?.coordinates || DEFAULT_CENTER
}

export const getDefaultZoom = () => {
  const config = getCachedAppConfig()
  return config?.pages?.map?.defaultZoom || DEFAULT_ZOOM_LEVEL
}

// Static fallback zoom (for backward compatibility)
export const DEFAULT_ZOOM = 15

export const AD_TYPES = {
  INTERSTITIAL: 'interstitial',
  BANNER: 'banner',
  INLINE: 'inline'
}

export const BADGE_TYPES = {
  ON_THE_WATER: 'On The Water',
  NEW: 'New',
  FEATURED: 'Featured',
  POPULAR: 'Popular'
}

export const BUSINESS_TIERS = {
  SIGNATURE: 'signature',
  PREMIER: 'premier',
  CURATED: 'curated'
}

export const TIER_LABELS = {
  [BUSINESS_TIERS.SIGNATURE]: 'SIGNATURE',
  [BUSINESS_TIERS.PREMIER]: 'PREMIER',
  [BUSINESS_TIERS.CURATED]: 'CURATED'
}

export const BUSINESS_CATEGORIES = {
  COCKTAIL_HOUR: 'cocktail hour',
  DINING: 'dining',
  SHOPPING: 'shopping',
  WELLNESS: 'wellness',
  ENTERTAINMENT: 'entertainment'
}

// Static colors (for backward compatibility)
export const COLORS = {
  PRIMARY_GOLD: '#D4AF37',
  PRIMARY_DARK: '#B8941F',
  BACKGROUND_BLACK: '#000000',
  TEXT_WHITE: '#ffffff',
  TEXT_GRAY: 'rgba(255, 255, 255, 0.6)'
}
