<template>
  <header class="top-bar">
    <button
      v-if="showBack"
      class="top-bar-btn back-btn"
      @click="goBack"
    >
      ←
    </button>
    <button
      v-else
      class="top-bar-btn menu-btn"
      @click="toggleMenu"
    >
      ☰
    </button>

    <h1 class="top-bar-title">{{ title }}</h1>

    <div class="spacer"></div>
  </header>
</template>

<script setup>
// defineProps and defineEmits are compiler macros in Vue 3 - no import needed
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: 'FLOZ'
  },
  showBack: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-menu'])
const router = useRouter()

const goBack = () => {
  // Simple and reliable: always go to home
  router.push({ name: 'Home' })
}

const toggleMenu = () => {
  emit('toggle-menu')
}
</script>

<!-- All styles moved to src/assets/styles/components/navigation.css -->
