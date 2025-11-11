<template>
  <div class="share-view">
    <TopBar title="Share The Hills Guide" :show-back="true" />

    <div class="share-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <h1 class="hero-title">Share The Hills Guide</h1>
        <p class="hero-subtitle">Invite others to discover luxury lifestyle experiences in The Hills</p>
      </div>

      <!-- QR Code Section -->
      <div class="qr-section">
        <div class="qr-container">
          <div class="qr-glow"></div>
          <div class="qr-wrapper">
            <qrcode-vue
              :value="shareUrl"
              :size="qrSize"
              level="H"
              :margin="2"
              render-as="svg"
              class="qr-code"
            />
            <div class="qr-center-logo">
              <div class="logo-circle">
                <span class="logo-text">THG</span>
              </div>
            </div>
          </div>
        </div>

        <div class="qr-info">
          <h3 class="qr-title">
            <svg class="title-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5 6.5V8.5H16V15H14V16.5H16.5V15V8.5V6.5H9.5ZM16.5 6.5H18V8.5V15V16.5H16.5V18H15V16.5H8.5V15V8.5V6.5H15V5H16.5V6.5ZM15 8.5V15H9.5V8.5H15Z"/>
            </svg>
            Scan & Access
          </h3>
          <p class="qr-description">Point your camera here for instant access</p>

          <div class="share-url">
            <div class="url-container">
              <span class="url-text">{{ shareUrl }}</span>
              <button class="copy-btn" @click="copyLink" :class="{ copied: linkCopied }">
                <svg v-if="linkCopied" class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                </svg>
                <svg v-else class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
                </svg>
                {{ linkCopied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>
      </div>


      <!-- Community Stats -->
      <div class="stats-section">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
          </svg>
          Join Our Community
        </h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h2v-2h2v-2h2v8z"/>
              </svg>
            </div>
            <div class="stat-number">500+</div>
            <div class="stat-label">Local Businesses</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2C5.45 2 5 2.45 5 3V4H4C2.9 4 2 4.9 2 6V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V6C22 4.9 21.1 4 20 4H19V3C19 2.45 18.55 2 18 2S17 2.45 17 3V4H7V3C7 2.45 6.55 2 6 2Z"/>
              </svg>
            </div>
            <div class="stat-number">50+</div>
            <div class="stat-label">Monthly Events</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div class="stat-number">10K+</div>
            <div class="stat-label">Happy Users</div>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import analytics from '@/utils/analytics'

const shareUrl = computed(() => window.location.origin)
const qrSize = ref(250)
const linkCopied = ref(false)
const canInstall = ref(false)

// PWA Install Prompt
let deferredPrompt = null

onMounted(() => {
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
    title: 'The Hills Guide - Luxury Lifestyle Directory',
    text: 'Discover luxury lifestyle experiences in The Hills - your curated guide to fine dining, private clubs, and exclusive establishments.',
    url: shareUrl.value
  }

  analytics.track('share_attempted', { method: 'native' })

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
      analytics.track('share_completed', { method: 'native' })
      if (window.$toast) {
        window.$toast.success('Thanks for sharing The Hills Guide!')
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
  const text = 'Discover luxury lifestyle experiences in The Hills - your curated guide to fine dining, private clubs, and exclusive establishments.'
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}&quote=${encodeURIComponent(text)}`

  analytics.track('share_completed', { method: 'facebook' })
  window.open(url, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes')
}

const shareOnTwitter = () => {
  const text = 'Discover luxury lifestyle experiences in The Hills - your curated guide to fine dining, private clubs, and exclusive establishments. #TheHillsGuide'
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl.value)}`

  analytics.track('share_completed', { method: 'twitter' })
  window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
}

const shareViaEmail = () => {
  const subject = 'Check out The Hills Guide - Luxury Lifestyle Directory'
  const body = `Hello!\n\nI wanted to share The Hills Guide with you - it's a curated directory of luxury lifestyle experiences.\n\nThe Hills Guide features:\n• Fine dining establishments\n• Private clubs and exclusive venues\n• Luxury services and amenities\n• Curated events and experiences\n\nCheck it out: ${shareUrl.value}\n\nI think you'll find it quite valuable for discovering premium experiences in the area.\n\nBest regards!`

  analytics.track('share_completed', { method: 'email' })
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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
        window.$toast.success('The Hills Guide installed! Check your home screen!')
      }
    }

    deferredPrompt = null
  }
}
</script>

<style scoped>
/* ===== GLOBAL STYLES ===== */
.share-view {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding-bottom: 80px;
  position: relative;
  overflow-x: hidden;
}

.share-content {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

/* ===== HERO SECTION ===== */
.hero-section {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}


.hero-title {
  color: white;
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 12px 0;
  background: linear-gradient(45deg, var(--color-primary), var(--color-primary-light), var(--color-primary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  margin: 0;
  font-weight: 400;
}

/* ===== QR CODE SECTION ===== */
.qr-section {
  margin-bottom: 50px;
  text-align: center;
}

.qr-container {
  position: relative;
  display: inline-block;
  margin-bottom: 30px;
}

.qr-glow {
  position: absolute;
  inset: -15px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1), transparent);
  border-radius: 30px;
  animation: pulse 3s ease-in-out infinite;
  filter: blur(15px);
  opacity: 0.6;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.qr-wrapper {
  position: relative;
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.qr-code {
  display: block;
  border-radius: 8px;
}

.qr-center-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.logo-circle {
  width: 60px;
  height: 60px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.logo-text {
  color: white;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 1px;
}

.qr-info h3 {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.qr-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin: 0 0 25px 0;
}

.share-url {
  margin-top: 20px;
}

.url-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px 20px;
  backdrop-filter: blur(10px);
}

.url-text {
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-family: 'Monaco', monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-btn {
  background: var(--color-primary);
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px var(--color-primary-alpha-30);
}

.copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
}

.copy-btn.copied {
  background: linear-gradient(135deg, #10b981, #059669);
}

.copy-icon, .title-icon, .section-icon {
  width: 16px;
  height: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

/* ===== SHARE SECTION ===== */
.quick-share {
  margin-bottom: 50px;
}

.section-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 25px 0;
}

.share-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
}

.share-card {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: var(--radius-xl);
  padding: var(--space-6) var(--space-4);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-all);
  backdrop-filter: blur(10px);
}

.share-card:hover {
  transform: translateY(-4px);
  background: rgba(212, 175, 55, 0.1);
  border-color: var(--color-primary);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.2);
}

.share-card.primary {
  border-color: var(--color-primary);
}

.share-card.facebook {
  border-color: rgba(24, 119, 242, 0.3);
}

.share-card.facebook:hover {
  border-color: rgba(24, 119, 242, 0.8);
}

.share-card.twitter {
  border-color: rgba(29, 161, 242, 0.3);
}

.share-card.twitter:hover {
  border-color: rgba(29, 161, 242, 0.8);
}

.share-card.email {
  border-color: rgba(234, 67, 53, 0.3);
}

.share-card.email:hover {
  border-color: rgba(234, 67, 53, 0.8);
}


.share-card-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.share-card-icon svg {
  width: 24px;
  height: 24px;
}

.share-card-content {
  color: white;
}

.share-card-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.share-card-subtitle {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
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
  margin-bottom: 50px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-top: 25px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px 16px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-number {
  color: white;
  font-size: 24px;
  font-weight: 800;
  display: block;
  margin-bottom: 4px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
}


/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 640px) {
  .share-content {
    padding: 16px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .floating-icon {
    font-size: 24px;
  }

  .qr-wrapper {
    padding: 20px;
  }

  .url-container {
    flex-direction: column;
    gap: 8px;
  }

  .copy-btn {
    width: 100%;
    justify-content: center;
  }

  .share-grid {
    grid-template-columns: repeat(2, 1fr);
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
