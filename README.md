# FLOZ App

Your complete guide to the Lake of the Ozarks - A Vue 3 Progressive Web App

## 🚀 Features

- **Business Directory**: Browse local businesses by category
- **Interactive Map**: View businesses on an interactive map with custom markers
- **Search**: Find businesses quickly with real-time search
- **Business Details**: View detailed information, contact, and directions
- **Share**: Share the app via QR code or social media
- **PWA Support**: Install as a native app on mobile devices
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Vue 3** - Composition API
- **Vite** - Build tool
- **Pinia** - State management
- **Vue Router** - Routing
- **Mapbox GL JS** - Interactive maps
- **QRCode.vue** - QR code generation
- **Vite PWA Plugin** - Progressive Web App support

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/floz-app.git
cd floz-app

# Install dependencies
npm install

# Set up environment variables
# Create a .env file and add your Mapbox token:
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview


floz-app/
├── public/              # Static assets
│   ├── images/         # Images and logos
│   └── ads/            # Advertisement images
├── src/
│   ├── components/     # Reusable components
│   ├── views/          # Page components
│   ├── stores/         # Pinia stores
│   ├── router/         # Vue Router config
│   ├── utils/          # Helper functions
│   ├── App.vue         # Root component
│   └── main.js         # Entry point
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies

App Architecture
FLOZ is a local business directory Progressive Web App (PWA) for the Lake of the Ozarks region. It's essentially a mobile-first platform that connects tourists and locals with businesses, services, and activities in the area.

Core Functionality
1. Business Discovery

Category-based navigation (Dining, Lake Services, Real Estate, Events, etc.)
Search functionality with real-time filtering
Interactive map view showing business locations
Featured vs. Standard listings (monetization tiers)

2. User Journey Flow
Home → Category Selection → Interstitial Ad → Business Listing → Business Detail
The app uses interstitial ads as a monetization strategy - when users click a category, they see a full-screen ad before accessing the business list.
3. Business Listing Tiers

Premium: Full interstitial ads + featured grid placement
Featured: Appears in featured section (2x2 grid with large cards)
Standard: Listed in "Additional Choices" section


Technical Stack Summary
Frontend: Vue 3 (Composition API)
State Management: Pinia
Routing: Vue Router
Build Tool: Vite
Maps: Mapbox GL JS
UI: Custom CSS with mobile-first responsive design
PWA: Installable with offline capabilities

Key Features Breakdown
Navigation System

Top Bar: Page title with hamburger menu
Bottom Nav: 4 main tabs (Home, Explore, Search, Share)
Side Menu: Additional links and "Install App" prompt

Monetization Model

Interstitial Ads: Full-screen ads before category listings
Featured Placements: Businesses pay for premium positioning
Banner Ads: Sticky ads within category pages
Inline Ads: Additional ad units between content

Location Features

GPS Integration: "Show Current Location" on map
Distance Calculation: Shows how far businesses are from user
Directions: Direct integration with Google Maps
On The Water Badge: Special indicator for waterfront businesses


Data Structure
Each business has:
{
  name, category, location (lat/lng), 
  contact (phone/website/email),
  listing_tier, badges, hours, description,
  ads (promotional content)
}

User Actions
From the home screen, users can:

Browse by category → See featured businesses
Search → Find specific businesses/services
View map → See all locations visually
Share app → QR code + social sharing

From business detail page:

Call → Direct phone dial
Directions → Open in maps app
Share → Share specific business
Visit Website → External link


Why This Architecture?
Progressive Web App Benefits:

Works on any device (iOS, Android, Desktop)
No app store approval needed
Installable to home screen
Works offline (with service workers)
Single codebase for all platforms

Vue 3 + Vite Benefits:

Fast development with hot module replacement
Component-based architecture (reusable UI)
Reactive data binding (UI updates automatically)
Small bundle size
Modern JavaScript features

Pinia State Management:

Centralized business data
Easy search/filter functionality
User location persistence
Ad management


Revenue Model
This is essentially a digital Yellow Pages with:

Subscription tiers for businesses (Premium/Featured/Standard)
Advertising revenue from interstitials and banners
Lead generation (calls, website visits, directions)


Similar Apps
Think of it like:

Yelp (business discovery)
TripAdvisor (local guide)
Chamber of Commerce Directory (business listings)
Google Maps (location-based)

But hyper-focused on a specific geographic region (Lake of the Ozarks).

Target Users

Tourists: Looking for restaurants, activities, services
Locals: Finding nearby businesses
Business Owners: Advertising their services


Competitive Advantages

Geo-specific: Deep focus on one area
Mobile-first: Optimized for on-the-go use
Free to use: Users don't pay
No app store: Instant access via web
Local partnerships: Direct relationships with businesses