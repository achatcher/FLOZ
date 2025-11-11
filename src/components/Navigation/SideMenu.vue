<template>
  <div class="side-menu-overlay" @click="handleOverlayClick">
    <div class="side-menu" @click.stop>
      <!-- Menu Header -->
      <div class="side-menu-header">
        <div class="logo-section">
          <svg class="menu-logo-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
          </svg>
          <h2 class="side-menu-logo">The Greenville Social</h2>
        </div>
        <button class="side-menu-close" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
        </button>
      </div>

      <!-- Menu Items -->
      <nav class="side-menu-nav">
        <div class="side-menu-item" v-for="item in menuItems" :key="item.name">
          <a
            :href="item.link"
            class="side-menu-link"
            @click="handleMenuClick(item)"
          >
            {{ item.name }}
          </a>
        </div>
      </nav>

      <!-- Install App Button -->
      <button class="btn btn-secondary" @click="handleInstall">
        Install App
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const emit = defineEmits(['close', 'show-community-modal'])
const router = useRouter()

const menuItems = [
  { name: 'Community Website', link: '#', internal: false, action: 'community' },
  { name: 'Business Advertising Tiers', link: '/tiers', internal: true },
  { name: 'Announcements', link: '/spotlights', internal: true },
  { name: 'Events', link: '/events', internal: true },
  { name: 'Contact Us', link: '/contact', internal: true }
]

const handleOverlayClick = () => {
  emit('close')
}

const handleMenuClick = (item) => {
  // Handle navigation or external links
  if (item.action === 'community') {
    // Emit event for community website modal
    emit('show-community-modal')
  } else if (item.internal) {
    // Use Vue Router for internal navigation
    router.push(item.link)
  } else if (item.link.startsWith('http')) {
    window.open(item.link, '_blank')
  } else {
    // For other internal routes that aren't implemented yet
    console.log('Navigate to:', item.link)
  }
  emit('close')
}

const handleInstall = () => {
  // PWA install prompt
  if (window.deferredPrompt) {
    window.deferredPrompt.prompt()
    window.deferredPrompt.userChoice.then((choiceResult) => {
      window.deferredPrompt = null
    })
  } else {
    alert('App is already installed or browser doesn\'t support installation')
  }
  emit('close')
}

</script>

<!-- All styles moved to src/assets/styles/components/navigation.css -->
