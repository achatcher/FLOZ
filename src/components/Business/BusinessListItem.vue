<template>
  <div class="business-list-item" @click="handleClick">
    <img 
      :src="business.logo" 
      :alt="business.name"
      class="business-logo"
    />
    <div class="business-info">
      <h3 class="business-name">{{ business.name }}</h3>
      <p class="business-category">{{ business.category }}</p>
    </div>
    <span class="chevron">›</span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  business: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.business-list-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: #000;
  cursor: pointer;
  transition: background 0.2s;
}

.business-list-item:active {
  background: #111;
}

.business-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.business-info {
  flex: 1;
  min-width: 0;
}

.business-name {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.business-category {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 0;
}

.chevron {
  color: rgba(255, 255, 255, 0.4);
  font-size: 24px;
  font-weight: 300;
  flex-shrink: 0;
}
</style>

