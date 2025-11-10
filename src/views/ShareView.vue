<template>
  <div class="share-view">
    <TopBar title="Share" :show-back="true" />

    <div class="share-content">
      <!-- Back Link -->
      <router-link to="/" class="back-link">
        ← Back
      </router-link>

      <!-- QR Code -->
      <div class="qr-container">
        <qrcode-vue
          :value="appUrl"
          :size="qrSize"
          level="H"
          :margin="2"
          render-as="svg"
          class="qr-code"
        />
      </div>

      <!-- Share Button -->
      <button class="share-btn" @click="handleShare">
        <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        Tap to Share
      </button>

      <!-- App Store Badges -->
      <div class="store-badges">
        <a 
          href="https://play.google.com/store" 
          target="_blank" 
          class="store-badge"
        >
          <img 
            src="/images/google-play-badge.png" 
            alt="Get it on Google Play"
            class="badge-image"
          />
        </a>
        <a 
          href="https://apps.apple.com" 
          target="_blank" 
          class="store-badge"
        >
          <img 
            src="/images/app-store-badge.png" 
            alt="Download on the App Store"
            class="badge-image"
          />
        </a>
      </div>

      <!-- Social Share Buttons -->
      <div class="social-share">
        <h3 class="social-title">Share on Social Media</h3>
        <div class="social-buttons">
          <button class="social-btn facebook" @click="shareOnFacebook">
            <span class="social-icon">f</span>
          </button>
          <button class="social-btn twitter" @click="shareOnTwitter">
            <span class="social-icon">𝕏</span>
          </button>
          <button class="social-btn email" @click="shareViaEmail">
            <span class="social-icon">✉</span>
          </button>
          <button class="social-btn copy" @click="copyLink">
            <span class="social-icon">🔗</span>
          </button>
        </div>
      </div>
    </div>

    <BottomNav />

    <!-- Copy Confirmation Toast -->
    <transition name="fade">
      <div v-if="showCopyToast" class="copy-toast">
        Link copied to clipboard! 📋
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { copyToClipboard } from '@/utils/helpers'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'

const appUrl = computed(() => window.location.origin)
const qrSize = ref(300)
const showCopyToast = ref(false)

const handleShare = async () => {
  const shareData = {
    title: 'FLOZ App',
    text: 'Check out FLOZ - Your guide to the Lake of the Ozarks!',
    url: appUrl.value
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err)
      }
    }
  } else {
    // Fallback to copy link
    await copyLink()
  }
}

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareOnTwitter = () => {
  const text = 'Check out FLOZ - Your guide to the Lake of the Ozarks!'
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(appUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareViaEmail = () => {
  const subject = 'Check out FLOZ App'
  const body = `I thought you might be interested in FLOZ - Your guide to the Lake of the Ozarks!\n\n${appUrl.value}`
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const copyLink = async () => {
  const success = await copyToClipboard(appUrl.value)
  if (success) {
    showCopyToast.value = true
    setTimeout(() => {
      showCopyToast.value = false
    }, 3000)
  } else {
    alert('Failed to copy link. Please try again.')
  }
}
</script>

<style scoped>
.share-view {
  min-height: 100vh;
  background: #000;
  padding-bottom: 80px;
}

.share-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back-link {
  align-self: flex-start;
  color: var(--primary-cyan);
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.qr-container {
  background: white;
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.2);
}

.qr-code {
  display: block;
}

.share-btn {
  background: var(--primary-cyan);
  border: none;
  border-radius: 12px;
  padding: 18px 40px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
  transition: transform 0.2s;
}

.share-btn:active {
  transform: scale(0.98);
}

.share-icon {
  width: 24px;
  height: 24px;
}

.store-badges {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 40px;
}

.store-badge {
  display: block;
  width: 100%;
}

.badge-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  transition: transform 0.2s;
}

.badge-image:active {
  transform: scale(0.98);
}

.social-share {
  width: 100%;
  max-width: 400px;
}

.social-title {
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 20px 0;
}

.social-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.social-btn {
  aspect-ratio: 1;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  transition: transform 0.2s;
  color: white;
}

.social-btn:active {
  transform: scale(0.95);
}

.social-btn.facebook {
  background: #1877F2;
}

.social-btn.twitter {
  background: #000;
  border: 2px solid #fff;
}

.social-btn.email {
  background: #EA4335;
}

.social-btn.copy {
  background: var(--primary-cyan);
}

.social-icon {
  font-size: 28px;
}

.copy-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-cyan);
  color: white;
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .qr-container {
    padding: 40px;
  }
  
  .social-buttons {
    grid-template-columns: repeat(4, 80px);
    justify-content: center;
  }
}
</style>
