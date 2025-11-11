<template>
  <div v-if="isVisible" class="base-modal-overlay" @click="handleOverlayClick">
    <div class="base-modal-container" @click.stop>
      <!-- Close Button -->
      <button class="base-modal-close" @click="closeModal" aria-label="Close modal">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
        </svg>
      </button>

      <!-- Header with Hero Image -->
      <div v-if="heroImage" class="base-modal-header">
        <img
          :src="heroImage"
          :alt="title"
          class="base-modal-header-image"
          @error="handleImageError"
        />
      </div>

      <!-- Modal Body -->
      <div class="base-modal-body">
        <!-- Title -->
        <h1 v-if="title" class="base-modal-title">{{ title }}</h1>

        <!-- Subtitle -->
        <p v-if="subtitle" class="base-modal-subtitle">{{ subtitle }}</p>

        <!-- Description -->
        <p v-if="description" class="base-modal-description">{{ description }}</p>

        <!-- Custom Content Slot -->
        <div class="base-modal-content">
          <slot name="content"></slot>
        </div>

        <!-- Action Buttons -->
        <div v-if="actions.length > 0" class="base-modal-actions">
          <button
            v-for="action in actions"
            :key="action.label"
            @click="action.handler"
            class="base-modal-action-btn"
            :class="action.variant || 'primary'"
            :title="action.tooltip"
          >
            <svg v-if="action.icon" class="action-icon" viewBox="0 0 24 24" fill="currentColor">
              <path :d="action.icon"/>
            </svg>
            {{ action.label }}
          </button>
        </div>

        <!-- Additional Content Slot -->
        <div class="base-modal-additional">
          <slot name="additional"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  heroImage: {
    type: String,
    default: null
  },
  actions: {
    type: Array,
    default: () => []
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    closeModal()
  }
}

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'
}
</script>

<style scoped>
/* Base Modal Overlay */
.base-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
  backdrop-filter: blur(4px);
}

/* Modal Container */
.base-modal-container {
  position: relative;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-2xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--color-border-primary);
}

/* Close Button */
.base-modal-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: var(--transition-all);
  backdrop-filter: blur(8px);
}

.base-modal-close:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.05);
}

.base-modal-close svg {
  width: 20px;
  height: 20px;
}

/* Header with Hero Image */
.base-modal-header {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.base-modal-header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Modal Body */
.base-modal-body {
  padding: var(--space-6);
  overflow-y: auto;
  max-height: calc(90vh - 200px);
}

/* Typography */
.base-modal-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
  line-height: var(--line-height-tight);
}

.base-modal-subtitle {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin: 0 0 var(--space-3);
}

.base-modal-description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0 0 var(--space-6);
}

/* Content Sections */
.base-modal-content {
  margin-bottom: var(--space-6);
}

.base-modal-additional {
  margin-top: var(--space-6);
}

/* Action Buttons */
.base-modal-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.base-modal-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  border: none;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-all);
  font-family: var(--font-family-primary);
}

/* Action Button Variants */
.base-modal-action-btn.primary {
  background: var(--color-primary);
  color: var(--color-bg-primary);
}

.base-modal-action-btn.primary:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-primary);
}

.base-modal-action-btn.secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}

.base-modal-action-btn.secondary:hover {
  background: var(--color-bg-surface);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-modal-action-btn.ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-secondary);
}

.base-modal-action-btn.ghost:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

/* Action Icons */
.action-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .base-modal-overlay {
    padding: var(--space-2);
  }

  .base-modal-container {
    max-height: 95vh;
  }

  .base-modal-body {
    padding: var(--space-5);
    max-height: calc(95vh - 200px);
  }

  .base-modal-actions {
    grid-template-columns: 1fr;
  }

  .base-modal-title {
    font-size: var(--font-size-xl);
  }
}

/* Animation */
.base-modal-overlay {
  animation: modalFadeIn 0.2s ease-out;
}

.base-modal-container {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>