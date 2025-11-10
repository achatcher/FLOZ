# FLOZ CSS Framework Documentation

A comprehensive, modular CSS framework built specifically for the FLOZ app with easy customization through CSS variables.

## 📁 File Structure

```
src/assets/styles/
├── main.css                    # Main import file
├── variables.css               # Design system variables
├── base.css                   # Reset and base styles
├── utilities.css              # Atomic utility classes
├── components/
│   ├── buttons.css            # Button component styles
│   ├── cards.css              # Card component styles
│   ├── forms.css              # Form component styles
│   ├── modals.css             # Modal component styles
│   └── navigation.css         # Navigation component styles
└── layout/
    ├── grid.css               # Grid layout system
    └── containers.css         # Page layout containers
```

## 🎨 Design System Variables

All customizable variables are defined in `variables.css`. Update these values to rebrand or modify the design system:

### Brand Colors
```css
--color-primary: #00D9FF;           /* Main brand cyan */
--color-primary-dark: #0099CC;      /* Darker cyan for gradients */
--color-primary-light: #33E1FF;     /* Lighter cyan for accents */
```

### Background Colors
```css
--color-bg-primary: #000000;        /* Main app background */
--color-bg-secondary: #0a0a0a;      /* Card/modal backgrounds */
--color-bg-tertiary: #111111;       /* Elevated surfaces */
--color-bg-surface: #1a1a1a;        /* Interactive surfaces */
```

### Typography Scale
```css
--font-size-xs: 11px;
--font-size-sm: 12px;
--font-size-base: 14px;
--font-size-md: 15px;
--font-size-lg: 16px;
--font-size-xl: 18px;
--font-size-2xl: 24px;
--font-size-3xl: 28px;
--font-size-4xl: 32px;
```

### Spacing Scale (8px Grid System)
```css
--space-1: 4px;     /* 0.5 * 8px */
--space-2: 8px;     /* 1 * 8px */
--space-3: 12px;    /* 1.5 * 8px */
--space-4: 16px;    /* 2 * 8px */
--space-5: 20px;    /* 2.5 * 8px */
--space-6: 24px;    /* 3 * 8px */
--space-8: 32px;    /* 4 * 8px */
--space-10: 40px;   /* 5 * 8px */
```

## 🧩 Component Classes

### Buttons

Use these predefined button classes for consistent styling:

```html
<!-- Primary button -->
<button class="btn btn-primary">Primary Action</button>

<!-- Secondary button -->
<button class="btn btn-secondary">Secondary Action</button>

<!-- Ghost button -->
<button class="btn btn-ghost">Subtle Action</button>

<!-- Close button -->
<button class="btn-close">×</button>

<!-- Different sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Cards

#### Business Listing Cards

```html
<!-- Signature Tier (Premium) -->
<div class="card-signature">
  <div class="card-signature-image">
    <img src="business-hero.jpg" alt="Business" class="card-signature-image img">
  </div>
  <div class="card-signature-body">
    <div class="card-signature-header">
      <h3 class="card-signature-title">Business Name</h3>
      <span class="card-signature-price">$$$$</span>
    </div>
    <p class="card-signature-description">Description text...</p>
    <div class="card-signature-features">
      <span class="card-signature-feature">Valet</span>
      <span class="card-signature-feature">Waterfront</span>
    </div>
  </div>
</div>

<!-- Premier Tier (Featured) -->
<div class="card-premier">
  <img src="business-logo.jpg" alt="Business" class="card-premier-image">
  <div class="card-premier-info">
    <h3 class="card-premier-title">Business Name</h3>
    <p class="card-premier-description">Short description...</p>
    <div class="card-premier-meta">
      <span class="card-premier-price">$$$</span>
      <span class="card-premier-badge">Award Winner</span>
    </div>
  </div>
</div>

<!-- Curated Tier (List item) -->
<div class="card-curated">
  <img src="business-logo.jpg" alt="Business" class="card-curated-image">
  <div class="card-curated-body">
    <h4 class="card-curated-title">Business Name</h4>
    <p class="card-curated-description">Brief description...</p>
  </div>
  <div class="card-curated-meta">
    <span class="card-curated-price">$$</span>
    <span class="card-curated-arrow">→</span>
  </div>
</div>
```

#### Category Cards

```html
<div class="card-category">
  <img src="category-image.jpg" alt="Category" class="card-category-image">
  <div class="card-category-placeholder">
    <span class="icon">🍽️</span>
  </div>
  <div class="card-category-overlay">
    <div class="card-category-subtitle">NEW ARRIVALS</div>
    <h3 class="card-category-title">Dining Out</h3>
  </div>
</div>
```

### Forms

```html
<form class="form">
  <div class="form-group">
    <label class="form-label form-label-required">Business Name</label>
    <input type="text" class="form-input" placeholder="Enter business name">
    <div class="form-error">This field is required</div>
  </div>

  <div class="form-group">
    <label class="form-label">Category</label>
    <select class="form-input form-select">
      <option>Select category</option>
      <option>Dining Out</option>
    </select>
  </div>

  <div class="form-actions">
    <button type="button" class="btn btn-secondary">Cancel</button>
    <button type="submit" class="btn btn-primary">Save</button>
  </div>
</form>
```

### Modals

```html
<div class="modal-overlay">
  <div class="modal-container">
    <button class="modal-close">×</button>

    <div class="modal-header">
      <img src="hero-image.jpg" alt="Business" class="modal-header-image">
    </div>

    <div class="modal-body">
      <h2 class="modal-title">Business Name</h2>
      <p class="modal-description">Business description...</p>
      <span class="modal-price">$$$$</span>

      <div class="modal-actions">
        <button class="modal-action-btn">🌐 Website</button>
        <button class="modal-action-btn">📞 Call</button>
        <button class="modal-action-btn">🗺️ Directions</button>
      </div>

      <div class="modal-contact">
        <h3 class="modal-contact-title">Contact</h3>
        <div class="modal-contact-item">📞 555-0123</div>
        <div class="modal-contact-item">📧 info@business.com</div>
      </div>
    </div>
  </div>
</div>
```

## 🔧 Utility Classes

The framework includes atomic utility classes for rapid development:

### Layout
```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
<div class="flex flex-col gap-4">

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">
<div class="grid-auto-fit">
```

### Spacing
```html
<!-- Padding -->
<div class="p-4 px-6 py-3">

<!-- Margin -->
<div class="mb-4 mx-auto">
```

### Typography
```html
<!-- Font sizes -->
<h1 class="text-2xl font-bold">
<p class="text-base text-secondary">

<!-- Text alignment -->
<div class="text-center uppercase tracking-wide">
```

### Colors
```html
<!-- Text colors -->
<span class="text-brand">
<p class="text-muted">

<!-- Backgrounds -->
<div class="bg-primary-10">
<div class="bg-surface">
```

## 📱 Grid System

### FLOZ Specific Grids

```html
<!-- Category Grid (6-column system) -->
<div class="category-grid">
  <!-- Large cards (3 columns each = 2 side by side) -->
  <div class="category-card-large">...</div>
  <div class="category-card-large">...</div>

  <!-- Medium cards (2 columns each = 3 per row) -->
  <div class="category-card-medium">...</div>
  <div class="category-card-medium">...</div>
  <div class="category-card-medium">...</div>
</div>

<!-- Subcategory Grid (3 columns) -->
<div class="subcategory-grid">
  <div class="subcategory-card">...</div>
  <div class="subcategory-card">...</div>
  <div class="subcategory-card">...</div>
</div>

<!-- Business Listing Grids -->
<div class="signature-grid">
  <div class="card-signature">...</div>
</div>

<div class="premier-grid">
  <div class="card-premier">...</div>
  <div class="card-premier">...</div>
</div>

<div class="curated-list">
  <div class="card-curated">...</div>
  <div class="card-curated">...</div>
</div>
```

### Generic Grid System

```html
<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div class="col-span-2">Wide Item</div>
</div>

<!-- Auto-fit grid -->
<div class="grid-auto-fit">
  <div>Auto-sized item</div>
  <div>Auto-sized item</div>
</div>
```

## 📏 Layout Containers

### Page Containers

```html
<!-- Full page layout -->
<div class="page-container">
  <div class="page-content">
    <!-- Your content -->
  </div>
</div>

<!-- Content containers -->
<div class="container container-lg">
  <!-- Constrained content -->
</div>
```

### FLOZ View Layouts

```html
<!-- Home view -->
<div class="home-view">
  <div class="home-content">
    <div class="hero-banner">
      <img src="hero.jpg" class="hero-image" alt="Hero">
    </div>
    <div class="category-grid">
      <!-- Categories -->
    </div>
  </div>
</div>

<!-- Category listing view -->
<div class="category-listing-view">
  <div class="listing-content">
    <!-- Content -->
  </div>
</div>
```

## 🎯 Customization Guide

### 1. Rebranding

To rebrand the app, update these key variables in `variables.css`:

```css
:root {
  /* Update brand colors */
  --color-primary: #your-brand-color;
  --color-primary-dark: #darker-shade;
  --color-primary-light: #lighter-shade;

  /* Update backgrounds if needed */
  --color-bg-primary: #your-bg-color;

  /* Update fonts */
  --font-family-primary: 'Your Font', sans-serif;
}
```

### 2. Adding New Components

Create new component stylesheets in `src/assets/styles/components/`:

```css
/* components/your-component.css */
.your-component {
  /* Use existing variables */
  background: var(--color-bg-surface);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
}
```

Then import in `main.css`:

```css
@import './components/your-component.css';
```

### 3. Responsive Breakpoints

The framework uses these breakpoints:

- **Mobile**: Default (320px+)
- **Small Mobile**: 375px+
- **Tablet**: 640px+
- **Desktop**: 1024px+

Add responsive styles:

```css
.your-class {
  font-size: var(--font-size-sm);
}

@media (min-width: 640px) {
  .your-class {
    font-size: var(--font-size-base);
  }
}

@media (min-width: 1024px) {
  .your-class {
    font-size: var(--font-size-lg);
  }
}
```

## 🚀 Usage in Vue Components

### Option 1: Use Utility Classes

```vue
<template>
  <div class="flex flex-col gap-4 p-6">
    <h1 class="text-2xl font-bold text-brand uppercase">Title</h1>
    <p class="text-base text-secondary leading-relaxed">Content</p>
    <button class="btn btn-primary">Action</button>
  </div>
</template>

<script setup>
// No additional styles needed
</script>
```

### Option 2: Use Component Classes

```vue
<template>
  <div class="card-signature">
    <div class="card-signature-body">
      <h3 class="card-signature-title">{{ business.name }}</h3>
      <p class="card-signature-description">{{ business.description }}</p>
    </div>
  </div>
</template>

<script setup>
// Component classes handle all styling
</script>
```

### Option 3: Custom Styles with Variables

```vue
<template>
  <div class="custom-component">
    <h2>Custom Component</h2>
  </div>
</template>

<style scoped>
.custom-component {
  background: var(--color-bg-surface);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
  transition: var(--transition-all);
}

.custom-component:hover {
  border-color: var(--color-primary-alpha-30);
  box-shadow: var(--shadow-primary);
}

.custom-component h2 {
  color: var(--color-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-4);
}
</style>
```

## 📋 Best Practices

### 1. Use the Design System
- Always use CSS variables instead of hardcoded values
- Follow the 8px spacing grid system
- Use the predefined color palette

### 2. Mobile-First Approach
- Write mobile styles first
- Add desktop enhancements with media queries
- Test on various screen sizes

### 3. Component Organization
- Use semantic class names (e.g., `.card-signature` not `.blue-card`)
- Group related styles in the same file
- Document component usage with comments

### 4. Performance
- Leverage utility classes to avoid duplicate CSS
- Use CSS variables for dynamic theming
- Minimize custom styles when possible

## 🔄 Migration from Old Styles

To migrate existing components to use the framework:

1. **Remove inline styles** and replace with utility classes
2. **Replace hardcoded colors** with CSS variables
3. **Use component classes** for common patterns
4. **Update spacing** to use the 8px grid system

### Before:
```vue
<style scoped>
.business-card {
  background: #111;
  padding: 20px;
  border-radius: 12px;
  color: #00D9FF;
  margin-bottom: 16px;
}
</style>
```

### After:
```vue
<template>
  <div class="card-signature">
    <!-- Use component classes -->
  </div>
</template>

<!-- No scoped styles needed -->
```

Or with utilities:
```vue
<template>
  <div class="bg-tertiary p-5 rounded-lg text-brand mb-4">
    <!-- Content -->
  </div>
</template>
```

This framework provides a solid foundation for consistent, maintainable, and easily customizable styles throughout the FLOZ application.