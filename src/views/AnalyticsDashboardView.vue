<template>
  <div class="analytics-view">
    <TopBar title="Analytics Dashboard" :show-back="true" />
    <BusinessAnalyticsDashboard />
    <BottomNav />
  </div>
</template>

<script setup>
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessAnalyticsDashboard from '@/components/Analytics/BusinessAnalyticsDashboard.vue'
</script>

<style scoped>
.analytics-view {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding-bottom: var(--bottom-nav-height);
}
</style>