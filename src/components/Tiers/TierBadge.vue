<template>
  <div v-if="tier !== 'curated'" class="tier-badge" :class="tierType">
    <slot>{{ badgeText }}</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tier: {
    type: String,
    required: true,
    validator: (value) => ['signature', 'premier', 'curated'].includes(value)
  },
  customText: {
    type: String,
    default: ''
  }
})

const tierType = computed(() => props.tier)

const badgeText = computed(() => {
  if (props.customText) return props.customText

  const tierLabels = {
    signature: 'SIGNATURE',
    premier: 'PREMIER',
    curated: 'CURATED'
  }

  return tierLabels[props.tier] || ''
})
</script>

<style scoped>
.tier-badge {
  display: inline-block;
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
}

.tier-badge.signature {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-bg-primary);
  box-shadow: 0 2px 8px var(--color-primary-alpha-30);
}

.tier-badge.premier {
  background: var(--color-platinum);
  color: var(--color-forest-green-dark);
  box-shadow: 0 2px 8px rgba(229, 228, 226, 0.3);
}

</style>