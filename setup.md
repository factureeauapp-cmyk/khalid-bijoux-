# Shalby Jewels - Setup Guide

A premium luxury jewellery e-commerce website built with Next.js 15, Tailwind CSS v4, and Framer Motion.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.17.0 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v8.0.0 or higher) - Install via `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd shalby-jewels
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## Project Structure

```
shalby-jewels/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles & Tailwind config
│   ├── about/page.tsx            # About page
│   ├── shop/page.tsx             # Shop page with filters
│   ├── product/[id]/page.tsx     # Product detail page
│   ├── gallery/page.tsx          # Gallery page
│   ├── contact/page.tsx          # Contact page
│   ├── checkout/page.tsx         # Checkout page
│   └── wishlist/page.tsx         # Wishlist page
├── components/
│   ├── animations/               # Animation components
│   │   ├── gold-particles.tsx    # Gold sparkle effect
│   │   └── scroll-progress.tsx   # Scroll progress bar
│   ├── cart/
│   │   └── cart-slide-over.tsx   # Cart drawer
│   ├── home/                     # Home page sections
│   │   ├── hero-section.tsx
│   │   ├── featured-collections.tsx
│   │   ├── bestsellers-section.tsx
│   │   ├── why-choose-us.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── instagram-section.tsx
│   │   └── cta-banner.tsx
│   ├── layout/                   # Layout components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── whatsapp-button.tsx
│   ├── products/                 # Product components
│   │   ├── product-card.tsx
│   │   └── quick-view-modal.tsx
│   ├── shop/
│   │   └── shop-filters.tsx
│   └── ui/                       # shadcn/ui components
├── data/
│   └── products.ts               # Product data (20 items)
├── hooks/
│   └── use-store.tsx             # Global store (cart, wishlist)
├── lib/
│   ├── config.ts                 # Site configuration
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
├── package.json
├── next.config.mjs
├── tsconfig.json
└── setup.md                      # This file
```

---

## Configuration

### Site Configuration

Edit `/lib/config.ts` to customize:

```typescript
export const siteConfig = {
  name: "Shalby Jewels",
  tagline: "Where Tradition Meets Timeless Elegance",
  description: "Your description here",
  location: "Ahmedabad, Gujarat, India",
  phone: "+91 79 2657 1234",
  whatsapp: "+919876543210",
  email: "contact@shalbyjewels.com",
  address: "123, Manek Chowk, Old City, Ahmedabad - 380001",
  storeHours: {
    weekdays: "10:00 AM - 8:00 PM",
    saturday: "10:00 AM - 9:00 PM",
    sunday: "11:00 AM - 7:00 PM",
  },
  social: {
    instagram: "https://instagram.com/shalbyjewels",
    facebook: "https://facebook.com/shalbyjewels",
    pinterest: "https://pinterest.com/shalbyjewels",
  },
  currency: "INR",
  currencySymbol: "₹",
}
```

### Adding Products

Edit `/data/products.ts` to add or modify products:

```typescript
export const products: Product[] = [
  {
    id: "unique-id",
    name: "Product Name",
    category: "Necklaces",
    price: 125000,
    karat: "22K",
    gender: "women",
    images: [
      "https://images.example.com/product1.jpg",
      "https://images.example.com/product2.jpg"
    ],
    description: "Product description",
    weight: "45g",
    sizes: ["16 inch", "18 inch", "20 inch"],
    featured: true,
    bestseller: true,
  },
  // ... more products
]
```

**Product Fields:**
- `id` - Unique identifier
- `name` - Product name
- `category` - One of: Necklaces, Rings, Earrings, Bangles, Bracelets, Pendants, Wedding Sets, Temple Jewellery
- `price` - Price in INR
- `karat` - 18K, 22K, Platinum, Pure Silver
- `gender` - "women", "men", or "unisex"
- `images` - Array of image URLs (uses external URLs, not local files)
- `description` - Product description
- `weight` - Weight with unit (e.g., "45g")
- `sizes` - Array of available sizes
- `featured` - Boolean (optional) - mark as featured product
- `bestseller` - Boolean (optional) - mark as bestseller

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## Adding Images

This project uses external image URLs (e.g., from Unsplash). Images are not stored locally.

**To add product images:**

1. Get image URLs from:
   - [Unsplash](https://unsplash.com) - Free high-quality images
   - [Pexels](https://pexels.com) - Free stock photos
   - Your own hosted image server
   - CDN service

2. Add URLs to the `images` array in product data:
   ```typescript
   images: [
     "https://images.unsplash.com/photo-xxxxx?w=800&q=80",
     "https://images.unsplash.com/photo-yyyyy?w=800&q=80"
   ]
   ```

3. Recommended image sizes:
   - Product images: 800x800px (square)
   - Hero images: 1920x1080px
   - Gallery images: 600x600px

---

## Deployment

### Production Build

First, create an optimized production build:

```bash
pnpm build
```

This generates the `.next` folder containing all optimized assets and server code.

### Run Production Server Locally

To test the production build locally:

```bash
pnpm start
```

The app will be available at `http://localhost:3000`

### Deploy to Cloud Platforms

This Next.js application can be deployed to any modern hosting platform:

**Popular Options:**
- [Vercel](https://vercel.com) - Push to GitHub, auto-deploys
- [Netlify](https://netlify.com) - Connect GitHub repository
- [AWS Amplify](https://aws.amazon.com/amplify/) - AWS-based deployment
- [Railway](https://railway.app) - Rapid deployment
- [Heroku](https://www.heroku.com/) - Simple PaaS
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)
- [Render](https://render.com) - Modern cloud platform

**Self-Hosted:**
- Linux server with Node.js
- Docker container
- Any VPS provider (Linode, AWS EC2, etc.)

Each platform has built-in Next.js support and will detect the `next.config.mjs` automatically.

---

## Environment Variables (Optional)

Create a `.env.local` file for environment-specific variables:

```env
# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Contact form backend (if implementing)
CONTACT_FORM_API=your-api-endpoint
```

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Particles**: tsParticles
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Inter (body), Playfair Display (headings)

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
pnpm dev -- -p 3001
```

**Clear Next.js cache:**
```bash
rm -rf .next
pnpm dev
```

**Dependency issues:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## License

This project is proprietary. All rights reserved.

---

## Support

For questions or support, contact:
- Email: info@shalbyjewels.com
- WhatsApp: +91 98765 43210
