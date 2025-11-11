#!/usr/bin/env node

/**
 * Multi-Location Deployment Script
 *
 * This script automates the deployment process for different geographic locations
 * by managing environment configurations, building location-specific assets,
 * and preparing deployments with the correct branding and settings.
 *
 * Usage:
 *   npm run deploy:location bloomfield_hills production
 *   npm run deploy:location new_location staging
 *   node scripts/deploy-location.js <location_id> <environment>
 *
 * Features:
 * - Validates location configuration before deployment
 * - Generates location-specific PWA manifest
 * - Updates meta tags and SEO information
 * - Builds optimized assets for the target location
 * - Creates deployment-ready output with correct branding
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

/**
 * Console logging utilities with colors
 */
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}🚀${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.magenta}=== ${msg} ===${colors.reset}\n`)
}

/**
 * Main deployment function
 */
async function deployLocation() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2)
    const locationId = args[0]
    const environment = args[1] || 'production'

    if (!locationId) {
      log.error('Location ID is required')
      log.info('Usage: node scripts/deploy-location.js <location_id> <environment>')
      log.info('Example: node scripts/deploy-location.js bloomfield_hills production')
      process.exit(1)
    }

    log.header(`Deploying ${locationId} to ${environment}`)

    // Step 1: Validate location configuration
    log.step('Step 1: Validating location configuration')
    const locationConfig = await validateLocationConfig(locationId)
    log.success(`Location configuration validated for: ${locationConfig.name}`)

    // Step 2: Set up environment variables
    log.step('Step 2: Setting up environment variables')
    await setupEnvironment(locationId, environment)
    log.success('Environment variables configured')

    // Step 3: Generate location-specific assets
    log.step('Step 3: Generating location-specific assets')
    await generateLocationAssets(locationConfig)
    log.success('Location-specific assets generated')

    // Step 4: Update PWA manifest
    log.step('Step 4: Updating PWA manifest')
    await updatePWAManifest(locationConfig, environment)
    log.success('PWA manifest updated')

    // Step 5: Build application
    log.step('Step 5: Building application')
    await buildApplication(environment)
    log.success('Application built successfully')

    // Step 6: Generate deployment package
    log.step('Step 6: Creating deployment package')
    await createDeploymentPackage(locationId, environment)
    log.success('Deployment package created')

    log.header('Deployment Complete!')
    log.success(`${locationConfig.branding.appName} is ready for ${environment} deployment`)
    log.info(`Deployment package: dist/${locationId}-${environment}.zip`)
    log.info(`PWA URL: ${getBaseUrl(environment)}`)

  } catch (error) {
    log.error(`Deployment failed: ${error.message}`)
    process.exit(1)
  }
}

/**
 * Validate location configuration exists and is complete
 */
async function validateLocationConfig(locationId) {
  const configPath = path.join(__dirname, '../src/config/locations.js')

  if (!fs.existsSync(configPath)) {
    throw new Error('Location configuration file not found')
  }

  // Dynamically import the location configuration
  const { LOCATION_CONFIGS, validateLocationConfig } = require('../src/config/locations.js')

  if (!LOCATION_CONFIGS[locationId]) {
    const availableLocations = Object.keys(LOCATION_CONFIGS).join(', ')
    throw new Error(`Location '${locationId}' not found. Available: ${availableLocations}`)
  }

  const locationConfig = LOCATION_CONFIGS[locationId]
  const validation = validateLocationConfig(locationConfig)

  if (!validation.isValid) {
    throw new Error(`Location configuration invalid: ${validation.errors.join(', ')}`)
  }

  return locationConfig
}

/**
 * Set up environment variables for the deployment
 */
async function setupEnvironment(locationId, environment) {
  const envFile = `.env.${environment}`
  const envContent = generateEnvironmentFile(locationId, environment)

  // Write environment file
  fs.writeFileSync(envFile, envContent)
  log.info(`Created ${envFile}`)

  // Also create .env.local for build process
  fs.writeFileSync('.env.local', envContent)
  log.info('Created .env.local for build process')
}

/**
 * Generate environment file content
 */
function generateEnvironmentFile(locationId, environment) {
  const baseUrl = getBaseUrl(environment)

  return `# Auto-generated environment configuration for ${locationId} ${environment} deployment
# Generated on: ${new Date().toISOString()}

# Location Configuration
VITE_LOCATION_ID=${locationId}
VITE_APP_ENV=${environment}
VITE_BASE_URL=${baseUrl}

# Build Configuration
VITE_BUILD_TIMESTAMP=${Date.now()}
VITE_BUILD_VERSION=1.0.0

# Environment-specific settings
${environment === 'production' ? 'VITE_ENABLE_DEBUG_MODE=false' : 'VITE_ENABLE_DEBUG_MODE=true'}
VITE_ENABLE_PERFORMANCE_MONITORING=${environment === 'production' ? 'true' : 'false'}
VITE_ENABLE_OFFLINE_MODE=true
`
}

/**
 * Get base URL for environment
 */
function getBaseUrl(environment) {
  switch (environment) {
    case 'production':
      return 'https://yourdomain.com'
    case 'staging':
      return 'https://staging.yourdomain.com'
    case 'development':
    default:
      return 'http://localhost:3000'
  }
}

/**
 * Generate location-specific assets
 */
async function generateLocationAssets(locationConfig) {
  // Update index.html meta tags
  await updateIndexHtml(locationConfig)

  // Generate location-specific CSS if needed
  await generateLocationCSS(locationConfig)

  log.info('Location-specific assets generated')
}

/**
 * Update index.html with location-specific meta tags
 */
async function updateIndexHtml(locationConfig) {
  const indexPath = path.join(__dirname, '../index.html')
  let indexContent = fs.readFileSync(indexPath, 'utf8')

  // Update meta tags
  const metaUpdates = {
    title: locationConfig.branding.appName,
    description: locationConfig.branding.fullDescription,
    'theme-color': locationConfig.theme.colors.primary
  }

  Object.entries(metaUpdates).forEach(([key, value]) => {
    if (key === 'title') {
      indexContent = indexContent.replace(/<title>.*?<\/title>/, `<title>${value}</title>`)
    } else {
      const metaRegex = new RegExp(`<meta name="${key}" content="[^"]*">`)
      if (indexContent.match(metaRegex)) {
        indexContent = indexContent.replace(metaRegex, `<meta name="${key}" content="${value}">`)
      } else {
        // Add meta tag if it doesn't exist
        const headEnd = indexContent.indexOf('</head>')
        const newMeta = `  <meta name="${key}" content="${value}">\n`
        indexContent = indexContent.slice(0, headEnd) + newMeta + indexContent.slice(headEnd)
      }
    }
  })

  fs.writeFileSync(indexPath, indexContent)
  log.info('Updated index.html meta tags')
}

/**
 * Generate location-specific CSS variables
 */
async function generateLocationCSS(locationConfig) {
  const cssPath = path.join(__dirname, '../src/assets/styles/location-variables.css')
  const { theme } = locationConfig

  const cssContent = `/* Auto-generated location-specific CSS variables */
/* Generated for: ${locationConfig.name} */
/* Generated on: ${new Date().toISOString()} */

:root {
  /* Location Brand Colors */
  --location-primary: ${theme.colors.primary};
  --location-primary-dark: ${theme.colors.primaryDark};
  --location-background: ${theme.colors.background};
  --location-background-secondary: ${theme.colors.backgroundSecondary};
  --location-text: ${theme.colors.text};
  --location-text-secondary: ${theme.colors.textSecondary};
  --location-accent: ${theme.colors.accent || theme.colors.primary};

  /* Location Typography */
  --location-font-primary: ${theme.fonts.primary};
  --location-font-heading: ${theme.fonts.heading};
  --location-font-luxury: ${theme.fonts.luxury};

  /* Location Style Preferences */
  --location-border-radius: ${theme.style?.borderRadius || '8px'};
}
`

  fs.writeFileSync(cssPath, cssContent)
  log.info('Generated location-specific CSS variables')
}

/**
 * Update PWA manifest with location-specific information
 */
async function updatePWAManifest(locationConfig, environment) {
  const baseUrl = getBaseUrl(environment)

  const manifest = {
    name: locationConfig.branding.appName,
    short_name: locationConfig.branding.tagline,
    description: locationConfig.branding.fullDescription,
    start_url: '/',
    display: 'standalone',
    theme_color: locationConfig.theme.colors.primary,
    background_color: locationConfig.theme.colors.background,
    orientation: 'portrait',
    scope: '/',
    categories: ['lifestyle', 'travel', 'entertainment', 'business'],
    icons: [
      {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png'
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }

  const manifestPath = path.join(__dirname, '../public/manifest.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  log.info('PWA manifest updated')
}

/**
 * Build the application
 */
async function buildApplication(environment) {
  log.info('Starting build process...')

  try {
    // Run Vite build
    execSync('npm run build', { stdio: 'inherit' })
  } catch (error) {
    throw new Error(`Build failed: ${error.message}`)
  }
}

/**
 * Create deployment package
 */
async function createDeploymentPackage(locationId, environment) {
  const packageName = `${locationId}-${environment}`
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

  // Create deployment info file
  const deploymentInfo = {
    locationId,
    environment,
    buildTime: new Date().toISOString(),
    version: '1.0.0',
    buildHash: Date.now().toString(36)
  }

  const deploymentInfoPath = path.join(__dirname, '../dist/deployment-info.json')
  fs.writeFileSync(deploymentInfoPath, JSON.stringify(deploymentInfo, null, 2))

  // Create zip package (if zip is available)
  try {
    execSync(`cd dist && zip -r ${packageName}.zip ./*`, { stdio: 'inherit' })
    log.info(`Created deployment package: dist/${packageName}.zip`)
  } catch (error) {
    log.warn('Could not create zip package (zip not available)')
    log.info('Deployment files are ready in the dist/ directory')
  }
}

/**
 * Clean up temporary files
 */
function cleanup() {
  // Remove temporary environment files
  const tempFiles = ['.env.local', '.env.production', '.env.staging']

  tempFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
  })
}

// Handle process interruption
process.on('SIGINT', () => {
  log.warn('Deployment interrupted')
  cleanup()
  process.exit(1)
})

process.on('SIGTERM', () => {
  log.warn('Deployment terminated')
  cleanup()
  process.exit(1)
})

// Run deployment if called directly
if (require.main === module) {
  deployLocation().finally(cleanup)
}

module.exports = { deployLocation }