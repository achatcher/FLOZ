<template>
  <div class="share-view">
    <TopBar title="Share FLOZ" :show-back="true" />

    <div class="share-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-animation">
          <div class="floating-icons">
            <span class="floating-icon" style="--delay: 0s">🚤</span>
            <span class="floating-icon" style="--delay: 0.5s">🎣</span>
            <span class="floating-icon" style="--delay: 1s">☀️</span>
            <span class="floating-icon" style="--delay: 1.5s">🏖️</span>
          </div>
        </div>
        <h1 class="hero-title">Spread the Lake Love! 💙</h1>
        <p class="hero-subtitle">Help others discover the magic of Lake of the Ozarks</p>
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
                <span class="logo-text">FLOZ</span>
              </div>
            </div>
          </div>
        </div>

        <div class="qr-info">
          <h3 class="qr-title">📱 Scan & Go!</h3>
          <p class="qr-description">Point your camera here for instant access</p>

          <div class="share-url">
            <div class="url-container">
              <span class="url-text">{{ shareUrl }}</span>
              <button class="copy-btn" @click="copyLink" :class="{ copied: linkCopied }">
                <span class="copy-icon">{{ linkCopied ? '✓' : '📋' }}</span>
                {{ linkCopied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Share Actions -->
      <div class="quick-share">
        <h3 class="section-title">✨ Quick Share</h3>
        <div class="share-grid">
          <button class="share-card primary" @click="handleNativeShare">
            <div class="share-card-icon">📤</div>
            <div class="share-card-content">
              <span class="share-card-title">Share App</span>
              <span class="share-card-subtitle">Native sharing</span>
            </div>
            <div class="share-card-shine"></div>
          </button>

          <button class="share-card facebook" @click="shareOnFacebook">
            <div class="share-card-icon">📘</div>
            <div class="share-card-content">
              <span class="share-card-title">Facebook</span>
              <span class="share-card-subtitle">Post to timeline</span>
            </div>
            <div class="share-card-shine"></div>
          </button>

          <button class="share-card twitter" @click="shareOnTwitter">
            <div class="share-card-icon">🐦</div>
            <div class="share-card-content">
              <span class="share-card-title">Twitter</span>
              <span class="share-card-subtitle">Tweet about us</span>
            </div>
            <div class="share-card-shine"></div>
          </button>

          <button class="share-card email" @click="shareViaEmail">
            <div class="share-card-icon">📧</div>
            <div class="share-card-content">
              <span class="share-card-title">Email</span>
              <span class="share-card-subtitle">Send to friends</span>
            </div>
            <div class="share-card-shine"></div>
          </button>
        </div>
      </div>

      <!-- Install Section -->
      <div class="install-section">
        <h3 class="section-title">🚀 Get the App</h3>
        <p class="section-subtitle">Install FLOZ for the ultimate Lake experience</p>

        <!-- PWA Install Card -->
        <div class="install-card" v-if="canInstall">
          <div class="install-icon">📱</div>
          <div class="install-content">
            <h4 class="install-title">Install FLOZ App</h4>
            <p class="install-description">• Works offline • Lightning fast • No app store needed</p>
            <button class="install-btn" @click="installPWA">
              Install Now
              <span class="install-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- Manual Install Instructions -->
        <div class="manual-install" v-else>
          <div class="install-steps">
            <div class="install-step">
              <div class="step-icon">📱</div>
              <div class="step-content">
                <strong>On Mobile:</strong>
                <p>Tap the share button in your browser → "Add to Home Screen"</p>
              </div>
            </div>
            <div class="install-step">
              <div class="step-icon">💻</div>
              <div class="step-content">
                <strong>On Desktop:</strong>
                <p>Look for the install icon in your address bar or bookmark this page</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Community Stats -->
      <div class="stats-section">
        <h3 class="section-title">🌊 Join Our Community</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏢</div>
            <div class="stat-number">500+</div>
            <div class="stat-label">Local Businesses</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎉</div>
            <div class="stat-number">50+</div>
            <div class="stat-label">Monthly Events</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">❤️</div>
            <div class="stat-number">10K+</div>
            <div class="stat-label">Happy Users</div>
          </div>
        </div>
      </div>

      <!-- Final CTA -->
      <div class="cta-section">
        <div class="cta-background">
          <div class="cta-waves"></div>
          <h3 class="cta-title">🏖️ Love Lake of the Ozarks?</h3>
          <p class="cta-description">Help us grow the community by sharing FLOZ with fellow lake lovers!</p>
          <button class="cta-button" @click="handleNativeShare">
            <span class="cta-sparkle">✨</span>
            Share the Love
            <span class="cta-sparkle">✨</span>
          </button>
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
    title: 'FLOZ - Lake of the Ozarks Guide',
    text: '🌊 Discover the best of Lake of the Ozarks! Find businesses, events, dining, and more with FLOZ - your ultimate lake companion! 🚤',
    url: shareUrl.value
  }

  analytics.track('share_attempted', { method: 'native' })

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
      analytics.track('share_completed', { method: 'native' })
      if (window.$toast) {
        window.$toast.success('Thanks for sharing FLOZ! 🎉')
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
  const text = '🌊 Discover the best of Lake of the Ozarks with FLOZ! Your ultimate guide to local businesses, events, dining, and lake life! 🚤'
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}&quote=${encodeURIComponent(text)}`

  analytics.track('share_completed', { method: 'facebook' })
  window.open(url, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes')
}

const shareOnTwitter = () => {
  const text = '🌊 Just found the perfect Lake of the Ozarks guide! FLOZ has everything - local businesses, events, dining spots, and more! 🚤 #LakeOfTheOzarks #FLOZ'
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl.value)}`

  analytics.track('share_completed', { method: 'twitter' })
  window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
}

const shareViaEmail = () => {
  const subject = '🌊 Check out FLOZ - Lake of the Ozarks Guide!'
  const body = `Hey!\n\nI found this amazing app for Lake of the Ozarks and thought you'd love it!\n\nFLOZ has everything you need:\n🏢 Local businesses & services\n🎉 Live events & entertainment\n🍽️ Best dining spots\n🚤 Lake activities & marinas\n\nCheck it out: ${shareUrl.value}\n\nIt's become my go-to guide for everything at the lake!\n\nCheers! 🏖️`

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
        window.$toast.success('FLOZ installed! Check your home screen! 🎉')
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
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e  50%, #16213e 100%);
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

.hero-animation {
  height: 120px;
  position: relative;
  margin-bottom: 20px;
}

.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-icon {
  position: absolute;
  font-size: 32px;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(6, 182, 212, 0.3));
}

.floating-icon:nth-child(1) {
  left: 10%;
  top: 20%;
  animation-delay: 0s;
}

.floating-icon:nth-child(2) {
  right: 15%;
  top: 10%;
  animation-delay: 1.5s;
}

.floating-icon:nth-child(3) {
  left: 20%;
  bottom: 10%;
  animation-delay: 3s;
}

.floating-icon:nth-child(4) {
  right: 10%;
  bottom: 20%;
  animation-delay: 4.5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(5deg); }
  50% { transform: translateY(-10px) rotate(-3deg); }
  75% { transform: translateY(-20px) rotate(3deg); }
}

.hero-title {
  color: white;
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 12px 0;
  background: linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6);
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
  inset: -20px;
  background: linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4);
  border-radius: 30px;
  animation: rotate 4s linear infinite;
  filter: blur(20px);
  opacity: 0.7;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
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
  background: linear-gradient(135deg, #06b6d4, #0891b2);
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
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
}

.copy-btn.copied {
  background: linear-gradient(135deg, #10b981, #059669);
}

.copy-icon {
  font-size: 16px;
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
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.share-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.share-card.primary {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
  border-color: rgba(6, 182, 212, 0.4);
}

.share-card.facebook {
  background: linear-gradient(135deg, rgba(24, 119, 242, 0.2), rgba(24, 119, 242, 0.1));
  border-color: rgba(24, 119, 242, 0.4);
}

.share-card.twitter {
  background: linear-gradient(135deg, rgba(15, 20, 25, 0.3), rgba(0, 0, 0, 0.2));
  border-color: rgba(255, 255, 255, 0.3);
}

.share-card.email {
  background: linear-gradient(135deg, rgba(234, 67, 53, 0.2), rgba(234, 67, 53, 0.1));
  border-color: rgba(234, 67, 53, 0.4);
}

.share-card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.share-card:hover .share-card-shine {
  opacity: 1;
  animation: shine 1.5s ease-in-out;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.share-card-icon {
  font-size: 32px;
  margin-bottom: 12px;
  display: block;
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
  border: 1px solid rgba(6, 182, 212, 0.3);
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
  background: linear-gradient(135deg, #06b6d4, #0891b2);
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
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
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

/* ===== CTA SECTION ===== */
.cta-section {
  margin-bottom: 20px;
}

.cta-background {
  position: relative;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 24px;
  padding: 40px 30px;
  text-align: center;
  overflow: hidden;
}

.cta-waves {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" fill="%23ffffff08"><path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"/></svg>') repeat-x;
  animation: wave 10s linear infinite;
  opacity: 0.3;
}

@keyframes wave {
  0% { background-position: 0 0; }
  100% { background-position: 1200px 0; }
}

.cta-title {
  color: white;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 12px 0;
  position: relative;
  z-index: 1;
}

.cta-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin: 0 0 30px 0;
  position: relative;
  z-index: 1;
}

.cta-button {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border: none;
  border-radius: 16px;
  padding: 16px 32px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.4);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(6, 182, 212, 0.5);
}

.cta-sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

.cta-sparkle:last-child {
  animation-delay: 1s;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
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
