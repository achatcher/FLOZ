<template>
  <nav class="bottom-nav">
    <div class="bottom-nav-content">
      <button
        v-for="item in navItems"
        :key="item.name"
        class="bottom-nav-item"
        :class="{ active: isActive(item.route) }"
        @click="navigate(item.route)"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" class="bottom-nav-icon">
          <path :d="item.iconPath"/>
        </svg>
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navItems = [
  {
    name: 'home',
    label: 'Home',
    route: '/',
    iconPath: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'
  },
  {
    name: 'explore',
    label: 'Explore',
    route: '/explore',
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
  },
  {
    name: 'search',
    label: 'Search',
    route: '/search',
    iconPath: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
  },
  {
    name: 'share',
    label: 'Share',
    route: '/share',
    iconPath: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'
  }
]

const isActive = (routePath) => {
  return route.path === routePath
}

const navigate = (routePath) => {
  if (route.path !== routePath) {
    router.push(routePath)
  }
}
</script>

<!-- All styles moved to src/assets/styles/components/navigation.css -->
