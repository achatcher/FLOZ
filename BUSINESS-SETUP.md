# 🏢 Business Setup Guide - The Greenville Social

> **Transform your business visibility with our premium lifestyle directory platform**

## 🎯 Quick Start for Businesses

This guide shows you exactly how to get your business listed and how to choose the perfect tier for your needs.

---

## 💰 Choose Your Advertising Tier

Our three-tier system is designed to fit every business size and budget:

### 👑 SIGNATURE TIER - $999/month
> **🥇 For luxury brands and high-end establishments**

**What you get:**
- 🎯 **Always listed first** - Top placement in every category
- 📸 **Large hero images** - 2x bigger than standard listings + photo gallery (8 images)
- 🏆 **Gold premium badge** - Instantly recognizable luxury status
- 🎨 **Homepage features** - Regular featured placement on main page
- 📱 **Full-screen ads** - Category interstitial advertisements
- 📊 **Premium analytics** - Detailed view tracking & lead generation reports
- ☎️ **VIP support** - Direct phone line + monthly strategy consultation
- ⚡ **Same-day updates** - Instant listing changes

**Perfect for:** Fine dining, luxury spas, high-end real estate, premium services

---

### ⭐ PREMIER TIER - $499/month
> **🥈 For established professional businesses**

**What you get:**
- ⭐ **Second-tier placement** - High visibility after Signature businesses
- 📷 **Professional photos** - Standard card with 4-image gallery
- 🥈 **Silver premier badge** - Professional status recognition
- 🔄 **Occasional homepage features** - Rotational featured spots
- 🎯 **Category banner ads** - Targeted advertising within categories
- 📈 **Analytics & reporting** - Monthly performance reports
- ✉️ **Priority email support** - Fast response times + quarterly check-ins
- 📅 **24-48 hour updates** - Quick listing modifications

**Perfect for:** Established restaurants, professional services, growing brands, popular attractions

---

### ✨ CURATED TIER - $199/month
> **🥉 For small businesses and budget-conscious brands**

**What you get:**
- ✨ **Quality placement** - Professional listing in all relevant categories
- 📱 **Mobile-optimized** - Professional mobile listing with 2 photos
- 🏅 **Bronze curated badge** - Verified business status
- 🔍 **Search inclusion** - Found in all search results
- 📊 **Monthly analytics** - Basic performance summary
- 📧 **Email support** - Standard customer service
- 💼 **Professional profile** - Complete business information display
- 🛠️ **Self-service tools** - Easy-to-use business management portal

**Perfect for:** Local cafes, small businesses, startups, service providers, budget-conscious brands

---

## 🚀 Getting Listed: Step-by-Step

### Step 1: Choose Your Location & Tier

1. **Select your city** (Currently: Greenville, Charleston)
2. **Choose your tier** (Signature, Premier, or Curated)
3. **Select your category** (Dining, Shopping, Spa, etc.)

### Step 2: Prepare Your Business Information

Gather this information before starting:

```json
{
  "business_name": "Your Business Name",
  "category": "Dining",  // See categories below
  "subcategory": "Fine Dining",
  "tier": "signature",   // signature, premier, or curated

  "location": {
    "address": "123 Main Street, Greenville, SC 29601",
    "coordinates": "We'll help you get these",
    "neighborhood": "Downtown"
  },

  "contact": {
    "phone": "(864) 555-0123",
    "website": "https://yourbusiness.com",
    "email": "contact@yourbusiness.com"
  },

  "business_details": {
    "description": "One compelling sentence about what makes you special",
    "price_range": "$$$",  // $ to $$$$
    "features": ["Fine Dining", "Wine Selection", "Private Dining"],
    "hours": {
      "monday": "5:00 PM - 10:00 PM",
      "tuesday": "5:00 PM - 10:00 PM",
      // ... etc
    }
  },

  "images": {
    "logo": "High-quality square logo image",
    "main_photo": "Your best exterior or interior shot",
    "gallery": "2-8 additional photos depending on tier"
  }
}
```

### Step 3: Submit Your Listing

**Option A: Work with Us (Recommended)**
- Email us your information: `listings@greenvillesocial.com`
- We'll create your listing and optimize it for maximum visibility
- Includes professional photo optimization and copywriting

**Option B: Technical Setup (For Developers)**
- Add your business to the JSON configuration file
- Follow the technical integration guide below

---

## 📋 Available Categories

Choose the category that best fits your business:

- **🍽️ Dining** - Restaurants, fine dining, casual dining
- **🍸 Cocktail Hour** - Bars, cocktail lounges, wine bars
- **🛍️ Shopping** - Retail stores, boutiques, luxury shopping
- **💆 Spa** - Day spas, wellness centers, beauty services
- **🏠 Real Estate** - Luxury real estate, property services
- **⛪ Faith** - Churches, religious organizations
- **🥾 Hiking** - Outdoor activities, parks, nature
- **🎨 Arts & Culture** - Museums, galleries, theaters
- **👶 Children** - Family activities, children's services
- **⚽ Athletics** - Fitness, sports venues, recreational activities
- **🏛️ Private Clubs** - Exclusive clubs, country clubs

*Don't see your category? Contact us to discuss adding it.*

---

## 📸 Photo Requirements

### All Tiers
- **Format:** JPG or PNG
- **Minimum Resolution:** 800x800 pixels
- **Aspect Ratio:** Square preferred, 16:9 acceptable
- **File Size:** Under 2MB per image
- **Quality:** High resolution, professional lighting

### Signature Tier (8 photos)
1. **Hero Image** - Your absolute best shot (exterior, interior, or signature dish)
2. **Interior** - Showcase your atmosphere
3. **Exterior** - Street view or building facade
4. **Product/Service** - Your specialty (dish, service, product)
5. **Staff/Action** - People enjoying your business
6. **Details** - Close-up of unique features
7. **Ambiance** - Evening/mood shots
8. **Logo/Branding** - Clean logo on white background

### Premier Tier (4 photos)
1. **Hero Image** - Your best shot
2. **Interior/Product** - What you're known for
3. **Exterior** - Building/location
4. **Logo** - Clean branding

### Curated Tier (2 photos)
1. **Hero Image** - Your best representation
2. **Logo** - Professional logo

---

## 🛠️ Technical Integration Guide

For developers who want to add businesses directly to the configuration:

### File Location
```
/public/config/locations/{city}/businesses.json
```

### Business Object Structure
```json
{
  "id": 1,
  "name": "Your Business Name",
  "category": "Dining",
  "subcategory": "Fine Dining",
  "tier": "signature",
  "description": "Compelling one-sentence description highlighting what makes you unique and special to customers.",
  "logo": "https://your-cdn.com/logo.jpg",
  "image": "https://your-cdn.com/main-image.jpg",
  "heroImage": "https://your-cdn.com/hero-image.jpg",
  "priceRange": "$$$",
  "location": {
    "address": "123 Main Street, Greenville, SC 29601",
    "lat": 34.8526,
    "lng": -82.3940,
    "neighborhood": "Downtown"
  },
  "contact": {
    "phone": "(864) 555-0123",
    "website": "https://yourbusiness.com",
    "email": "contact@yourbusiness.com"
  },
  "hours": {
    "monday": "5:00 PM - 10:00 PM",
    "tuesday": "5:00 PM - 10:00 PM",
    "wednesday": "5:00 PM - 10:00 PM",
    "thursday": "5:00 PM - 10:00 PM",
    "friday": "5:00 PM - 11:00 PM",
    "saturday": "5:00 PM - 11:00 PM",
    "sunday": "5:00 PM - 10:00 PM"
  },
  "features": ["Fine Dining", "Wine Selection", "Private Dining", "Valet Parking"],
  "tags": ["upscale", "romantic", "special-occasion", "wine"],
  "rating": 4.8,
  "reviewCount": 247
}
```

### Required Fields
- `id` - Unique number (increment from last business)
- `name` - Business name
- `category` - Must match available categories
- `tier` - "signature", "premier", or "curated"
- `description` - Compelling description
- `location.address` - Full address
- `contact.phone` - Phone number

### Optional But Recommended
- `logo`, `image`, `heroImage` - Professional photos
- `website` - Business website
- `hours` - Operating hours
- `features` - Key amenities/features
- `rating` - Customer rating (1-5)

---

## 📞 Get Started Today

Ready to boost your business visibility?

### Contact Information
- **Email:** listings@greenvillesocial.com
- **Phone:** (864) 555-SOCIAL
- **Website:** https://greenvillesocial.com/business

### What Happens Next
1. **Consultation** - We discuss your goals and recommend the best tier
2. **Setup** - We create your optimized listing
3. **Review** - You approve the listing before it goes live
4. **Launch** - Your business goes live in the app
5. **Analytics** - Start receiving performance reports

### Questions?
- **Tier comparison:** Not sure which tier is right for you? We'll help you decide.
- **Photo help:** Need professional photos? We can recommend local photographers.
- **Technical support:** Having issues? Our team provides ongoing support.

---

**Transform your business presence in the Greenville community. Get listed today!**

*The Greenville Social - Where mountain charm meets refined living.*