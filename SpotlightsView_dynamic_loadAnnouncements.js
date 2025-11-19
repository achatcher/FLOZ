const loadAnnouncements = async () => {
  try {
    // Initialize app configuration
    await initializeApp()
    await businessStore.loadData()

    const businesses = getCurrentBusinesses.value || []
    const config = getConfig.value || {}
    const locationName = config.location || 'Greenville'

    // Generate dynamic announcements based on available businesses and location
    const generatedAnnouncements = []

    // Create signature tier announcements from signature businesses
    const signatureBusinesses = businesses.filter(b => b.tier === 'signature').slice(0, 2)
    signatureBusinesses.forEach((business, index) => {
      generatedAnnouncements.push({
        id: `sig-${business.id}`,
        title: `Featured Partner: ${business.name}`,
        excerpt: business.description || `Discover the exceptional experience at ${business.name}, one of ${locationName}'s premier destinations.`,
        category: business.category,
        subcategory: business.subcategory || 'Featured Business',
        author: business.name,
        publishDate: new Date().toISOString().split('T')[0],
        image: business.heroImage || business.image || business.logo || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop&crop=center',
        tier: 'signature',
        featured: true,
        priority: 'high',
        price_range: business.priceRange || 'Contact for pricing',
        contact: business.contact || {},
        features: business.features ? Object.fromEntries(business.features.map(f => [f.toLowerCase().replace(/\s+/g, '_'), true])) : {},
        content: `
          <p>${business.description || `Experience the best that ${locationName} has to offer at ${business.name}.`}</p>

          ${business.features ? `<h3>Features</h3><ul>${business.features.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}

          ${business.hours ? `<h3>Hours</h3><p>Visit us during our regular business hours for the best experience.</p>` : ''}

          <h3>Contact Information</h3>
          <p>For more information, please contact ${business.name} directly.</p>
        `
      })
    })

    // Create premier tier announcements from premier businesses
    const premierBusinesses = businesses.filter(b => b.tier === 'premier').slice(0, 2)
    premierBusinesses.forEach((business, index) => {
      generatedAnnouncements.push({
        id: `prem-${business.id}`,
        title: `Now Featured: ${business.name}`,
        excerpt: business.description || `${business.name} brings exceptional ${business.category.toLowerCase()} to ${locationName}.`,
        category: business.category,
        subcategory: business.subcategory || 'Premier Business',
        author: business.name,
        publishDate: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        image: business.heroImage || business.image || business.logo || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop&crop=center',
        tier: 'premier',
        featured: true,
        priority: 'medium',
        price_range: business.priceRange || 'Varies',
        contact: business.contact || {},
        features: business.features ? Object.fromEntries(business.features.map(f => [f.toLowerCase().replace(/\s+/g, '_'), true])) : {},
        content: `
          <p>Discover what makes ${business.name} a standout destination in ${locationName}'s ${business.category.toLowerCase()} scene.</p>

          ${business.features ? `<h3>What We Offer</h3><ul>${business.features.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}

          <h3>Visit Us</h3>
          <p>Located in ${business.location?.neighborhood || locationName}, ${business.name} welcomes you to experience our ${business.subcategory || business.category.toLowerCase()}.</p>
        `
      })
    })

    // Create curated tier announcements from curated businesses
    const curatedBusinesses = businesses.filter(b => b.tier === 'curated').slice(0, 1)
    curatedBusinesses.forEach((business, index) => {
      generatedAnnouncements.push({
        id: `cur-${business.id}`,
        title: `Community Spotlight: ${business.name}`,
        excerpt: business.description || `${business.name} is a valued part of the ${locationName} community.`,
        category: business.category,
        subcategory: business.subcategory || 'Community Business',
        author: business.name,
        publishDate: new Date(Date.now() - (index + 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        image: business.heroImage || business.image || business.logo || 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=400&fit=crop&crop=center',
        tier: 'curated',
        featured: false,
        priority: 'low',
        price_range: business.priceRange || 'Affordable',
        contact: business.contact || {},
        features: business.features ? Object.fromEntries(business.features.map(f => [f.toLowerCase().replace(/\s+/g, '_'), true])) : {},
        content: `
          <p>${business.name} represents the best of ${locationName}'s local ${business.category.toLowerCase()} offerings.</p>

          <h3>About ${business.name}</h3>
          <p>${business.description || `Located in ${business.location?.neighborhood || locationName}, we're committed to serving our community.`}</p>

          <h3>Visit Us Today</h3>
          <p>Experience what makes ${business.name} special in the ${locationName} community.</p>
        `
      })
    })

    announcements.value = generatedAnnouncements

  } catch (error) {
    console.error('Failed to load dynamic announcements:', error)
    // Fallback to empty array if dynamic loading fails
    announcements.value = []
  }
}