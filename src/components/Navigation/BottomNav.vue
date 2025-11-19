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
    label: 'Guide',
    route: '/',
    iconPath: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'
  },
  {
    name: 'search',
    label: 'Search',
    route: '/search',
    iconPath: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
  },
  {
    name: 'explore',
    label: 'Map',
    route: '/explore',
    iconPath: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z'
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
