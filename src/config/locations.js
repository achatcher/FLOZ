/**
 * Multi-Location Configuration System
 *
 * This centralized configuration system allows the application to be easily
 * adapted for different geographic markets while maintaining the same core
 * functionality and user experience.
 *
 * To deploy for a new location:
 * 1. Add a new location configuration object below
 * 2. Update the CURRENT_LOCATION constant
 * 3. Customize branding, categories, and map settings
 * 4. Deploy with location-specific data files
 */

/**
 * Location Configuration Schema
 * Each location object should contain all customizable aspects of the application
 */
const LOCATION_CONFIGS = {
  /**
   * Bloomfield Hills, Michigan - Luxury Lifestyle Directory
   * Current primary market focusing on affluent suburban community
   */
  bloomfield_hills: {
    // ===== BASIC LOCATION INFO =====
    id: 'bloomfield_hills',
    name: 'Bloomfield Hills',
    state: 'Michigan',
    country: 'United States',
    timezone: 'America/Detroit',

    // ===== BRANDING & IDENTITY =====
    branding: {
      appName: 'The Hills Guide',
      tagline: 'Curated Luxury Lifestyle',
      description: 'Exclusive lifestyle guide for discerning residents',
      fullDescription: 'Curated luxury lifestyle guide for discerning residents - exclusive dining, events, and premium services',

      // URL-friendly identifier for marketing and SEO
      urlSlug: 'hills-guide',

      // Social media and marketing handles
      socialHandles: {
        instagram: '@thehillsguide',
        facebook: 'thehillsguide',
        twitter: '@hillsguide'
      }
    },

    // ===== GEOGRAPHIC SETTINGS =====
    geography: {
      // Map center coordinates
      center: {
        lat: 42.5831,
        lng: -83.2455
      },

      // Default zoom level for map view
      defaultZoom: 13,

      // Maximum zoom for detailed street view
      maxZoom: 18,

      // Bounding box for location-based searches
      bounds: {
        north: 42.6200,
        south: 42.5400,
        east: -83.2000,
        west: -83.3000
      },

      // Local area names for address parsing
      localAreas: [
        'Bloomfield Hills',
        'Birmingham',
        'Troy',
        'Royal Oak',
        'Bloomfield Township'
      ]
    },

    // ===== VISUAL THEME =====
    theme: {
      // Primary brand colors (luxury gold theme)
      colors: {
        primary: '#D4AF37',        // Elegant gold
        primaryDark: '#B8941F',    // Darker gold for hover states
        background: '#0A0A0A',     // Rich black background
        backgroundSecondary: '#1A1A1A', // Secondary dark background
        text: '#FFFFFF',           // Primary text color
        textSecondary: '#E5E4E2',  // Secondary text (platinum)
        accent: '#D4AF37',         // Accent color (matches primary)
        success: '#4CAF50',        // Success green
        warning: '#FF9800',        // Warning orange
        error: '#F44336'           // Error red
      },

      // Typography settings
      fonts: {
        primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        heading: "'Playfair Display', serif",
        luxury: "'Cormorant Garamond', serif"
      },

      // Visual style preferences
      style: {
        borderRadius: '12px',      // Rounded corner radius
        shadowIntensity: 'medium', // Shadow depth: light, medium, heavy
        gradientStyle: 'luxury'    // Gradient theme: luxury, modern, minimal
      }
    },

    // ===== BUSINESS CATEGORIZATION =====
    businessCategories: {
      // Primary categories with luxury focus
      primary: [
        {
          id: 'fine-dining',
          name: 'Fine Dining',
          icon: '🍽️',
          description: 'Upscale restaurants and culinary experiences',
          subcategories: ['Steakhouses', 'International Cuisine', 'Wine Bars', 'Chef\'s Table']
        },
        {
          id: 'private-clubs',
          name: 'Private Clubs',
          icon: '🏌️',
          description: 'Exclusive membership clubs and societies',
          subcategories: ['Golf Clubs', 'Country Clubs', 'Business Clubs', 'Social Clubs']
        },
        {
          id: 'wellness-spa',
          name: 'Wellness & Spa',
          icon: '🧘',
          description: 'Premium health, beauty, and wellness services',
          subcategories: ['Day Spas', 'Medical Spas', 'Fitness Studios', 'Wellness Centers']
        },
        {
          id: 'luxury-retail',
          name: 'Luxury Retail',
          icon: '💎',
          description: 'High-end shopping and exclusive boutiques',
          subcategories: ['Fashion', 'Jewelry', 'Art Galleries', 'Antiques']
        },
        {
          id: 'professional-services',
          name: 'Professional Services',
          icon: '💼',
          description: 'Premium business and personal services',
          subcategories: ['Legal', 'Financial', 'Real Estate', 'Consulting']
        }
      ],

      // Business tier system for different service levels
      tiers: {
        signature: {
          name: 'Signature',
          description: 'Premium featured establishments',
          features: ['Hero sections', 'Priority placement', 'Enhanced listings'],
          color: '#D4AF37'
        },
        premier: {
          name: 'Premier',
          description: 'High-quality featured businesses',
          features: ['Featured placement', 'Enhanced visibility'],
          color: '#B8941F'
        },
        curated: {
          name: 'Curated',
          description: 'Vetted quality businesses',
          features: ['Standard listing', 'Quality assured'],
          color: '#8A7A2A'
        }
      }
    },

    // ===== CONTACT & SUPPORT =====
    contact: {
      email: 'info@thehillsguide.com',
      phone: '+1 (248) 555-0123',
      address: 'Bloomfield Hills, MI',
      website: 'https://thehillsguide.com',

      // Support and feedback channels
      support: {
        email: 'support@thehillsguide.com',
        hours: 'Monday - Friday, 9 AM - 6 PM EST'
      }
    },

    // ===== MARKETING & SEO =====
    seo: {
      keywords: [
        'Bloomfield Hills',
        'luxury lifestyle',
        'fine dining',
        'private clubs',
        'premium services',
        'Michigan luxury',
        'upscale directory'
      ],

      // Local SEO optimization
      localSEO: {
        businessType: 'Local Business Directory',
        serviceArea: 'Bloomfield Hills, Michigan',
        targetAudience: 'Affluent residents and visitors'
      }
    }
  },

  /**
   * Template for New Location - Copy and Customize
   * Example configuration for expanding to new markets
   */
  example_new_location: {
    id: 'example_location',
    name: 'New Location Name',
    state: 'State/Province',
    country: 'Country',
    timezone: 'America/New_York', // Update timezone

    branding: {
      appName: 'Location Guide',           // Customize app name
      tagline: 'Your Local Lifestyle',    // Local tagline
      description: 'Local lifestyle guide for residents',
      fullDescription: 'Comprehensive local directory for businesses and services',
      urlSlug: 'location-guide',
      socialHandles: {
        instagram: '@locationguide',
        facebook: 'locationguide',
        twitter: '@locguide'
      }
    },

    geography: {
      center: { lat: 0.0, lng: 0.0 },     // Update coordinates
      defaultZoom: 12,
      maxZoom: 18,
      bounds: {                           // Define local boundaries
        north: 0.0, south: 0.0,
        east: 0.0, west: 0.0
      },
      localAreas: ['Area 1', 'Area 2']    // Local neighborhood names
    },

    theme: {
      colors: {
        primary: '#2563EB',               // Customize brand colors
        primaryDark: '#1D4ED8',
        background: '#FFFFFF',            // Light theme example
        backgroundSecondary: '#F8FAFC',
        text: '#1E293B',
        textSecondary: '#64748B',
        accent: '#2563EB'
      },
      fonts: {
        primary: "'Inter', sans-serif",
        heading: "'Inter', sans-serif",
        luxury: "'Inter', sans-serif"
      }
    },

    businessCategories: {
      primary: [
        // Customize categories for local market
        {
          id: 'restaurants',
          name: 'Restaurants',
          icon: '🍴',
          description: 'Local dining establishments',
          subcategories: ['Casual Dining', 'Fast Food', 'Cafes', 'Bars']
        }
        // Add more categories as needed
      ],
      tiers: {
        featured: { name: 'Featured', color: '#2563EB' },
        standard: { name: 'Standard', color: '#64748B' }
      }
    },

    contact: {
      email: 'info@locationguide.com',    // Update contact info
      phone: '+1 (555) 123-4567',
      address: 'Location, State',
      website: 'https://locationguide.com'
    },

    seo: {
      keywords: ['location', 'local business', 'directory'],
      localSEO: {
        businessType: 'Local Business Directory',
        serviceArea: 'Location Name, State',
        targetAudience: 'Local residents'
      }
    }
  }
}

/**
 * Current Active Location
 * Change this constant to switch the entire application to a different location
 * All components and stores will automatically use the selected location's configuration
 */
export const CURRENT_LOCATION = 'bloomfield_hills'

/**
 * Get Current Location Configuration
 * Returns the complete configuration object for the currently active location
 * This is the primary export used throughout the application
 */
export const getLocationConfig = () => {
  const config = LOCATION_CONFIGS[CURRENT_LOCATION]

  if (!config) {
    console.error(`Location configuration not found for: ${CURRENT_LOCATION}`)
    // Fallback to first available location
    const fallbackKey = Object.keys(LOCATION_CONFIGS)[0]
    console.warn(`Falling back to: ${fallbackKey}`)
    return LOCATION_CONFIGS[fallbackKey]
  }

  return config
}

/**
 * Get All Available Locations
 * Returns list of all configured locations for admin/selection interfaces
 */
export const getAvailableLocations = () => {
  return Object.keys(LOCATION_CONFIGS).map(key => ({
    id: key,
    name: LOCATION_CONFIGS[key].name,
    branding: LOCATION_CONFIGS[key].branding
  }))
}

/**
 * Validate Location Configuration
 * Ensures all required fields are present in a location config
 */
export const validateLocationConfig = (config) => {
  const requiredFields = [
    'id', 'name', 'branding.appName', 'geography.center',
    'theme.colors.primary', 'businessCategories.primary'
  ]

  const errors = []

  requiredFields.forEach(field => {
    const fieldPath = field.split('.')
    let value = config

    for (const key of fieldPath) {
      value = value?.[key]
      if (value === undefined) {
        errors.push(`Missing required field: ${field}`)
        break
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Export individual location configs for development/testing
export { LOCATION_CONFIGS }