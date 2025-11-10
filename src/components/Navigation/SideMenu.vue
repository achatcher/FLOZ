<template>
  <div class="side-menu-overlay" @click="handleOverlayClick">
    <div class="side-menu" @click.stop>
      <!-- Menu Header -->
      <div class="side-menu-header">
        <img src="/images/floz-logo.png" alt="FLOZ" class="menu-logo" />
        <h2 class="side-menu-logo">FLOZ APP</h2>
        <button class="side-menu-close" @click="$emit('close')">✕</button>
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
        Install app
      </button>

      <!-- Sign In Button -->
      <button class="btn btn-outline" @click="handleSignIn">
        Sign In
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const emit = defineEmits(['close'])
const router = useRouter()

const menuItems = [
  { name: 'Contact Us', link: '/contact', internal: true },
  { name: 'Ozarks Amphitheater', link: '/amphitheater', internal: false },
  { name: 'Live Stream', link: '/live-stream', internal: false },
  { name: 'Shootout 2025', link: '/shootout', internal: false },
  { name: 'LOZ Podcast Network', link: '/podcast', internal: false }
]

const handleOverlayClick = () => {
  emit('close')
}

const handleMenuClick = (item) => {
  // Handle navigation or external links
  if (item.internal) {
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

const handleSignIn = () => {
  // Handle sign in
  console.log('Sign in clicked')
  emit('close')
}
</script>

<!-- All styles moved to src/assets/styles/components/navigation.css -->
