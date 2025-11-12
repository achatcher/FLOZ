<template>
  <div class="share-view">
    <TopBar :title="`Share ${appName}`" :show-back="true" />

    <main class="share-content">
      <!-- Hero Section -->
      <header class="hero-section">
        <h1 class="hero-title">Share {{ appName }}</h1>
        <p class="hero-subtitle">{{ shareHeroSubtitle }}</p>
      </header>

      <!-- QR Code Section -->
      <section class="qr-section" aria-labelledby="qr-heading">
        <div class="qr-container">
          <div class="qr-glow" aria-hidden="true"></div>
          <div class="qr-wrapper">
            <qrcode-vue
              :value="shareUrl"
              :size="qrSize"
              level="H"
              :margin="2"
              render-as="svg"
              class="qr-code"
              :alt="`QR code linking to ${shareUrl}`"
            />
            <div class="qr-center-logo" aria-hidden="true">
              <div class="logo-circle">
                <img
                  src="/images/green.png"
                  :alt="`${appName} logo`"
                  class="logo-image"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="qr-info">
          <h2 id="qr-heading" class="qr-title">
            <svg class="title-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9.5 6.5V8.5H16V15H14V16.5H16.5V15V8.5V6.5H9.5ZM16.5 6.5H18V8.5V15V16.5H16.5V18H15V16.5H8.5V15V8.5V6.5H15V5H16.5V6.5ZM15 8.5V15H9.5V8.5H15Z"/>
            </svg>
            Scan & Access Instantly
          </h2>
          <p class="qr-description">{{ qrDescription }}</p>

          <div class="share-url">
            <div class="url-container">
              <label for="share-url-input" class="visually-hidden">App URL</label>
              <input
                id="share-url-input"
                type="text"
                readonly
                :value="shareUrl"
                class="url-input"
                aria-label="App URL for sharing"
              />
              <button
                class="copy-btn"
                @click="copyLink"
                :class="{ copied: linkCopied }"
                :aria-label="linkCopied ? 'Link copied to clipboard' : 'Copy link to clipboard'"
              >
                <svg v-if="linkCopied" class="copy-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                </svg>
                <svg v-else class="copy-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
                </svg>
                <span>{{ linkCopied ? 'Copied!' : 'Copy Link' }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Share Methods Section -->
      <section class="share-methods-section" aria-labelledby="share-methods-heading">
        <h2 id="share-methods-heading" class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12S8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5S19.66 2 18 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12S4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92S20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z"/>
          </svg>
          Share With Others
        </h2>
        <div class="share-grid">
          <button
            class="share-card primary"
            @click="handleNativeShare"
            aria-label="Share using device's native sharing"
          >
            <div class="share-card-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12S8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5S19.66 2 18 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12S4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92S20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z"/>
              </svg>
            </div>
            <div class="share-card-content">
              <span class="share-card-title">Quick Share</span>
              <span class="share-card-subtitle">Use your device's share menu</span>
            </div>
          </button>

          <button
            class="share-card email"
            @click="shareViaEmail"
            aria-label="Share via email"
          >
            <div class="share-card-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
              </svg>
            </div>
            <div class="share-card-content">
              <span class="share-card-title">Email</span>
              <span class="share-card-subtitle">Send via email client</span>
            </div>
          </button>

          <button
            class="share-card facebook"
            @click="shareOnFacebook"
            aria-label="Share on Facebook"
          >
            <div class="share-card-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div class="share-card-content">
              <span class="share-card-title">Facebook</span>
              <span class="share-card-subtitle">Share on Facebook</span>
            </div>
          </button>

          <button
            class="share-card twitter"
            @click="shareOnTwitter"
            aria-label="Share on Twitter"
          >
            <div class="share-card-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </div>
            <div class="share-card-content">
              <span class="share-card-title">Twitter</span>
              <span class="share-card-subtitle">Share on Twitter</span>
            </div>
          </button>
        </div>
      </section>

      <!-- Community Stats -->
      <section class="stats-section" aria-labelledby="stats-heading">
        <h2 id="stats-heading" class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
          </svg>
          Join Our Thriving Community
        </h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h2v-2h2v-2h2v8z"/>
              </svg>
            </div>
            <div class="stat-number">{{ dynamicStats.totalBusinesses }}+</div>
            <div class="stat-label">Authentic Local Businesses</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2C5.45 2 5 2.45 5 3V4H4C2.9 4 2 4.9 2 6V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V6C22 4.9 21.1 4 20 4H19V3C19 2.45 18.55 2 18 2S17 2.45 17 3V4H7V3C7 2.45 6.55 2 6 2Z"/>
              </svg>
            </div>
            <div class="stat-number">{{ dynamicStats.categoryCount }}</div>
            <div class="stat-label">Business Categories</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div class="stat-number">100%</div>
            <div class="stat-label">{{ dynamicStats.locationName }} Focused</div>
          </div>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import { useBusinessStore } from '@/stores/businessStore'
import { useAppConfig } from '@/composables/useAppConfig'
import analytics from '@/utils/analytics'

const businessStore = useBusinessStore()
const { initializeApp, getCurrentBusinesses, getConfig, getAppInfo } = useAppConfig()

const shareUrl = computed(() => window.location.origin)
const qrSize = ref(250)
const linkCopied = ref(false)
const canInstall = ref(false)

// Dynamic app content from JSON configuration
const appName = computed(() => {
  return getAppInfo.value?.name || 'The Greenville Social'
})

const appShortName = computed(() => {
  return getAppInfo.value?.shortName || 'Greenville Social'
})

const appLocation = computed(() => {
  return getAppInfo.value?.location || { city: 'Greenville', state: 'South Carolina' }
})

const shareHeroSubtitle = computed(() => {
  const location = appLocation.value
  return `Invite others to discover authentic ${location.city} lifestyle experiences`
})

const qrDescription = computed(() => {
  return `Point your camera at the QR code for immediate access to ${appName.value}`
})

// Logo is now handled via image instead of text
// const logoText = computed(() => {
//   return appShortName.value
//     .split(' ')
//     .map(word => word.charAt(0).toUpperCase())
//     .join('')
//     .slice(0, 2)
// })

// Dynamic stats based on actual business data
const dynamicStats = computed(() => {
  const businesses = getCurrentBusinesses.value || []
  const location = appLocation.value

  // Get unique categories from actual business data
  const categories = [...new Set(businesses.map(b => b.category))].filter(Boolean)

  return {
    totalBusinesses: businesses.length,
    categoryCount: categories.length,
    locationName: location.city || 'Greenville'
  }
})

// Dynamic share content from app configuration
const shareTitle = computed(() => {
  const info = getAppInfo.value
  const location = appLocation.value
  return info?.tagline || `${appName.value} - ${location.city} Community Lifestyle`
})

const shareText = computed(() => {
  const info = getAppInfo.value
  const location = appLocation.value
  return info?.description
    ? `Discover ${info.description.toLowerCase()} in ${location.city} - your guide to dining, exclusive access, and community connections.`
    : `Discover ${location.city} lifestyle experiences - your guide to dining, outdoor adventures, and community connections.`
})

const emailSubject = computed(() => {
  return `Check out ${appName.value} - ${appLocation.value.city} Community Lifestyle`
})

const emailBody = computed(() => {
  const info = getAppInfo.value
  const location = appLocation.value
  const stats = dynamicStats.value

  return `Hello!

I wanted to share ${appName.value} with you - it's a curated guide to ${location.city} community lifestyle.

${appName.value} features:
• ${stats.totalBusinesses}+ local businesses
• ${stats.categoryCount} different categories
• ${info?.description || 'Fine dining establishments'}
• Community events and experiences
• Local services and amenities

Check it out: ${shareUrl.value}

I think you'll find it quite valuable for discovering the best of ${location.city}'s lifestyle.

Best regards!`
})

// PWA Install Prompt
let deferredPrompt = null

onMounted(async () => {
  // Initialize app configuration and load business data
  try {
    await initializeApp()
    await businessStore.loadData()
  } catch (error) {
    console.error('Failed to initialize app data for ShareView:', error)
  }

  // Check if PWA can be installed
  if (window.deferredPrompt) {
    canInstall.value = true
    deferredPrompt = window.deferredPrompt
  }

  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    canInstall.value = true
  })
})

const handleNativeShare = async () => {
  const shareData = {
    title: shareTitle.value,
    text: shareText.value,
    url: shareUrl.value
  }

  analytics.track('share_attempted', { method: 'native' })

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
      analytics.track('share_completed', { method: 'native' })
      if (window.$toast) {
        window.$toast.success(`Thanks for sharing ${appName.value}!`)
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err)
        await copyLink()
      }
    }
  } else {
    await copyLink()
  }
}

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}&quote=${encodeURIComponent(shareText.value)}`

  analytics.track('share_completed', { method: 'facebook' })
  window.open(url, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes')
}

const shareOnTwitter = () => {
  const location = appLocation.value
  const twitterText = `${shareText.value} #${location.city.replace(/\s+/g, '')}Social`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl.value)}`

  analytics.track('share_completed', { method: 'twitter' })
  window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
}

const shareViaEmail = () => {
  analytics.track('share_completed', { method: 'email' })
  window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject.value)}&body=${encodeURIComponent(emailBody.value)}`
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    linkCopied.value = true
    analytics.track('share_completed', { method: 'copy' })

    if (window.$toast) {
      window.$toast.success('Link copied! Ready to share! 📋')
    }

    setTimeout(() => {
      linkCopied.value = false
    }, 3000)
  } catch (err) {
    console.error('Copy failed:', err)
    if (window.$toast) {
      window.$toast.error('Copy failed. Please try again.')
    }
  }
}

const installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice
    analytics.track('pwa_install_prompt', { outcome })

    if (outcome === 'accepted') {
      canInstall.value = false
      if (window.$toast) {
        window.$toast.success(`${appName.value} installed! Check your home screen!`)
      }
    }

    deferredPrompt = null
  }
}
</script>

<style scoped>
/* ===== ACCESSIBILITY UTILITIES ===== */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ===== GLOBAL STYLES ===== */
.share-view {
  min-height: 100vh;
  background: var(--color-bg-luxury);
  padding-bottom: 80px;
  position: relative;
  overflow-x: hidden;
}

.share-content {
  padding: 32px 20px;
  max-width: 600px;
  margin: 0 auto;
}

/* ===== HERO SECTION ===== */
.hero-section {
  text-align: center;
  margin-bottom: 56px;
  position: relative;
  padding: 0;
}

.hero-title {
  color: var(--color-text-primary);
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  line-height: 1.3;
  letter-spacing: -0.25px;
  font-family: var(--font-family-heading);
}

.hero-subtitle {
  color: var(--color-text-secondary);
  font-size: 17px;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

/* ===== QR CODE SECTION ===== */
.qr-section {
  margin-bottom: 64px;
  text-align: center;
}

.qr-container {
  position: relative;
  display: inline-block;
  margin-bottom: 40px;
}

.qr-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.4), rgba(212, 175, 55, 0.15), transparent);
  border-radius: 32px;
  animation: pulse 4s ease-in-out infinite;
  filter: blur(20px);
  opacity: 0.7;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.03);
    opacity: 0.8;
  }
}

.qr-wrapper {
  position: relative;
  background: #ffffff;
  padding: 36px;
  border-radius: 28px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(212, 175, 55, 0.2);
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.qr-code {
  display: block;
  border-radius: 12px;
}

.qr-center-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.logo-circle {
  width: 72px;
  height: 72px;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #ffffff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  padding: 4px;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.logo-text {
  color: #ffffff;
  font-weight: 900;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.qr-title {
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--font-family-heading);
}

.title-icon {
  width: 22px;
  height: 22px;
  color: var(--color-primary);
}

.qr-description {
  color: var(--color-text-secondary);
  font-size: 16px;
  margin: 0 0 32px 0;
  line-height: 1.5;
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 32px;
}

.share-url {
  margin-top: 32px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.url-container {
  display: flex;
  align-items: stretch;
  gap: 0;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.url-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: 14px;
  font-family: var(--font-family-monospace);
  padding: 16px 20px;
  outline: none;
}

.url-input::selection {
  background: var(--color-primary-alpha-20);
}

.url-input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.copy-btn {
  background: var(--color-primary);
  border: none;
  padding: 16px 20px;
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition-all);
  border-radius: 0;
  min-width: 120px;
  justify-content: center;
}

.copy-btn:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-primary);
}

.copy-btn:focus {
  outline: 2px solid var(--color-forest-green);
  outline-offset: 2px;
}

.copy-btn.copied {
  background: var(--color-success);
  color: #ffffff;
}

.copy-icon {
  width: 18px;
  height: 18px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 32px 0;
  font-family: var(--font-family-heading);
}

.section-icon {
  width: 22px;
  height: 22px;
  color: var(--color-primary);
}

/* ===== SHARE SECTION ===== */
.share-methods-section {
  margin-bottom: 64px;
}

.share-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  max-width: 100%;
  margin: 0 auto;
}

.share-card {
  position: relative;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-sm);
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.share-card:hover {
  transform: translateY(-4px);
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-primary);
}

.share-card:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.share-card-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  background: var(--color-primary-alpha-10);
  border-radius: var(--radius-md);
}

.share-card-icon svg {
  width: 20px;
  height: 20px;
}

.share-card-content {
  color: var(--color-text-primary);
}

.share-card-title {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.share-card-subtitle {
  display: none;
}

/* ===== INSTALL SECTION ===== */
.install-section {
  margin-bottom: 50px;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  text-align: center;
  margin: 0 0 30px 0;
}

.install-card {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1));
  border: 1px solid var(--color-primary-alpha-30);
  border-radius: 24px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  backdrop-filter: blur(10px);
}

.install-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.install-content {
  flex: 1;
}

.install-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.install-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 0 0 16px 0;
}

.install-btn {
  background: var(--color-primary);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.install-btn:hover {
  transform: translateY(-2px);
}

.install-arrow {
  transition: transform 0.3s ease;
}

.install-btn:hover .install-arrow {
  transform: translateX(4px);
}

.manual-install {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
}

.install-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.install-step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.step-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 4px;
}

.step-content {
  color: white;
}

.step-content strong {
  display: block;
  margin-bottom: 4px;
  font-size: 16px;
}

.step-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.5;
}

/* ===== STATS SECTION ===== */
.stats-section {
  margin-bottom: 64px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 32px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.stat-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: 28px 20px;
  text-align: center;
  transition: var(--transition-all);
  box-shadow: var(--shadow-sm);
}

.stat-card:hover {
  transform: translateY(-4px);
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-primary);
}

.stat-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  background: var(--color-primary-alpha-10);
  border-radius: var(--radius-lg);
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.stat-number {
  color: var(--color-text-primary);
  font-size: 32px;
  font-weight: 800;
  display: block;
  margin-bottom: 8px;
  font-family: var(--font-family-heading);
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
}


/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 640px) {
  .share-content {
    padding: 24px 16px;
  }

  .hero-section {
    margin-bottom: 48px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 16px;
    max-width: 100%;
  }

  .qr-section {
    margin-bottom: 48px;
  }

  .qr-container {
    margin-bottom: 32px;
  }

  .qr-wrapper {
    padding: 24px;
  }

  .qr-title {
    font-size: 22px;
  }

  .qr-description {
    font-size: 15px;
    max-width: 100%;
  }

  .share-url {
    max-width: 100%;
  }

  .url-input {
    padding: 14px 16px;
    font-size: 13px;
  }

  .copy-btn {
    padding: 14px 16px;
    font-size: 13px;
    min-width: 100px;
  }

  .share-methods-section {
    margin-bottom: 48px;
  }

  .section-title {
    font-size: 22px;
    margin-bottom: 24px;
  }

  .share-grid {
    gap: 12px;
  }

  .share-card {
    width: 70px;
    height: 70px;
    padding: var(--space-3);
  }

  .share-card-icon {
    width: 28px;
    height: 28px;
    margin-bottom: 6px;
  }

  .share-card-icon svg {
    width: 18px;
    height: 18px;
  }

  .share-card-title {
    font-size: 11px;
  }

  .stats-section {
    margin-bottom: 48px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    max-width: 280px;
  }

  .stat-card {
    padding: 20px 16px;
  }

  .stat-number {
    font-size: 28px;
  }

  .stat-label {
    font-size: 13px;
  }

  .install-card {
    flex-direction: column;
    text-align: center;
  }

  .install-step {
    flex-direction: column;
    text-align: center;
  }

  .cta-title {
    font-size: 24px;
  }
}

@media (min-width: 768px) {
  .share-content {
    padding: 40px 20px;
  }

  .qr-wrapper {
    padding: 40px;
  }

  .share-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
