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
   * Greenville, South Carolina - Mountain Community Social Directory
   * Current primary market focusing on upscale mountain community lifestyle
   */
  bloomfield_hills: {
    // ===== BASIC LOCATION INFO =====
    id: 'greenville_sc',
    name: 'Greenville',
    state: 'South Carolina',
    country: 'United States',
    timezone: 'America/New_York',

    // ===== BRANDING & IDENTITY =====
    branding: {
      appName: 'The Greenville Social',
      tagline: 'Mountain Community Lifestyle',
      description: 'Curated lifestyle guide for Greenville\'s discerning community',
      fullDescription: 'Your guide to Greenville\'s finest dining, outdoor adventures, and premium services - where mountain charm meets refined living',

      // URL-friendly identifier for marketing and SEO
      urlSlug: 'greenville-social',

      // Social media and marketing handles
      socialHandles: {
        instagram: '@thegreenvillesocial',
        facebook: 'thegreenvillesocial',
        twitter: '@greenvillesocial'
      }
    },

    // ===== GEOGRAPHIC SETTINGS =====
    geography: {
      // Map center coordinates
      center: {
        lat: 34.8526,
        lng: -82.3940
      },

      // Default zoom level for map view
      defaultZoom: 12,

      // Maximum zoom for detailed street view
      maxZoom: 18,

      // Bounding box for location-based searches
      bounds: {
        north: 34.9000,
        south: 34.8000,
        east: -82.3000,
        west: -82.5000
      },

      // Local area names for address parsing
      localAreas: [
        'Greenville',
        'Travelers Rest',
        'Greer',
        'Mauldin',
        'Simpsonville',
        'Taylors'
      ]
    },

    // ===== VISUAL THEME =====
    theme: {
      // Primary brand colors (mountain/old south theme)
      colors: {
        primary: '#2F5233',        // Forest green
        primaryDark: '#1E3521',    // Darker forest green for hover states
        background: '#FFFFFF',     // Clean white background
        backgroundSecondary: '#F8F9FA', // Light gray secondary background
        text: '#1E3521',           // Dark forest green primary text (high contrast on white)
        textSecondary: '#2F5233',  // Forest green secondary text
        accent: '#D4AF37',         // Gold accent
        success: '#2F5233',        // Forest green for success
        warning: '#D4AF37',        // Gold for warnings
        error: '#DC3545'           // Red for errors
      },

      // Typography settings
      fonts: {
        primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        heading: "'Playfair Display', serif",
        luxury: "'Cormorant Garamond', serif"
      },

      // Visual style preferences
      style: {
        borderRadius: '8px',       // Slightly less rounded for mountain aesthetic
        shadowIntensity: 'light',  // Subtle shadows for refined feel
        gradientStyle: 'natural'   // Natural gradient theme
      }
    },

    // ===== BUSINESS CATEGORIZATION =====
    businessCategories: {
      // Primary categories with mountain community focus
      primary: [
        {
          id: 'fine-dining',
          name: 'Fine Dining',
          icon: '🍽️',
          description: 'Upscale restaurants and culinary experiences',
          subcategories: ['Steakhouses', 'International Cuisine', 'Wine Bars', 'Chef\'s Table']
        },
        {
          id: 'hiking-outdoor',
          name: 'Hiking & Outdoor',
          icon: '🏞️',
          description: 'Mountain trails, outdoor recreation, and adventure services',
          subcategories: ['Trail Guides', 'Outdoor Gear', 'Hiking Clubs', 'Adventure Tours', 'Rock Climbing', 'Camping']
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
          color: '#2F5233'
        },
        curated: {
          name: 'Curated',
          description: 'Vetted quality businesses',
          features: ['Standard listing', 'Quality assured'],
          color: '#495057'
        }
      }
    },

    // ===== CONTACT & SUPPORT =====
    contact: {
      email: 'info@thegreenvillesocial.com',
      phone: '+1 (864) 555-0123',
      address: 'Greenville, SC',
      website: 'https://thegreenvillesocial.com',

      // Support and feedback channels
      support: {
        email: 'support@thegreenvillesocial.com',
        hours: 'Monday - Friday, 9 AM - 6 PM EST'
      }
    },

    // ===== MARKETING & SEO =====
    seo: {
      keywords: [
        'Greenville SC',
        'mountain lifestyle',
        'hiking trails',
        'fine dining',
        'outdoor recreation',
        'South Carolina lifestyle',
        'upscale directory',
        'Blue Ridge Mountains'
      ],

      // Local SEO optimization
      localSEO: {
        businessType: 'Local Business Directory',
        serviceArea: 'Greenville, South Carolina',
        targetAudience: 'Mountain community residents and outdoor enthusiasts'
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