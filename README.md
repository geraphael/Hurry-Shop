<div align="center">
  <br />
  <h1>🏪 Hury Shop</h1>
  <p><strong>Campus marketplace — buy, sell, and connect.</strong></p>
  <p>
    <img src="https://img.shields.io/badge/react-18.x-61DAFB?logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/vite-5.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/supabase-js-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/PWA-ready-34d399" alt="PWA" />
  </p>
  <br />
</div>

---

**Hury Shop** is a campus-only marketplace app where students can list items for sale, make offers, chat with sellers, and buy directly — no payment platform needed. Designed as a progressive web app (PWA) with a dark, modern UI.

---

## ✨ Features

### Marketplace
- **Listings** — Post items for sale with title, description, price, images, condition, and category. Each listing goes through admin approval before going live.
- **Search & Filter** — Search by keyword, filter by category across approved listings.
- **Explore** — Browse all approved listings with a responsive card grid.

### Offers & Buying
- **Make an offer** — Send a price offer to the seller with an optional message.
- **Contact seller** — Start a direct conversation with the seller through the built-in chat.
- **Seller inbox** — Sellers see all offers received across their listings and can accept or decline.

### Messaging
- **Real-time chat** — Full message thread view with auto-scroll and 5-second polling.
- **Conversation sidebar** — See all your conversations at a glance with the listing context.
- **Unread badge** — Red notification badge on the Messages nav link, polling every 10 seconds.
- **Keyboard shortcuts** — Press Enter to send, Shift+Enter for newline.

### User System
- **Auth** — Email/password login and registration via Supabase Auth.
- **Profiles** — View profiles with user bio, campus, and joined date.
- **Seller verification** — Request verified seller status. Admins review and approve.
- **My listings** — Owners can view, edit, and delete their own listings from their profile.

### Admin Dashboard
- **Terminal-style UI** — Space Mono monospace aesthetic with a glowing cyan header and blinking cursor.
- **Stats grid** — Users, verified sellers, pending sellers, active/pending listings, reports.
- **Pending listings** — Approve or reject new listings before they go live.
- **Seller verification** — Verify or reject seller requests.
- **Open reports** — View listing reports submitted by the community.

### Safety & Moderation
- **Report listings** — Users can report listings for spam, inappropriate content, misleading info, or duplicates.
- **Admin review** — All reports are visible in the admin dashboard.

### PWA
- **Service worker** — Caches shell assets for offline access.
- **Manifest** — Installable on mobile and desktop with theme-color support.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build** | Vite 5 |
| **Data fetching** | TanStack React Query v5 |
| **Routing** | React Router DOM v6 |
| **Backend** | Supabase (Postgres, Auth, Storage) |
| **Font** | Space Mono (admin), Inter (app) |
| **PWA** | Service Worker + Web Manifest |

---

## 📁 Project Structure

```
hurry-shop/
├── index.html                  # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── manifest.webmanifest    # PWA manifest
│   └── service-worker.js       # Offline caching
├── supabase/
│   └── schema.sql              # Database schema + seed data
└── src/
    ├── main.tsx                # App bootstrap
    ├── App.tsx                 # Route definitions
    ├── index.css               # Global styles
    ├── types.ts                 # TypeScript interfaces
    ├── lib/
    │   ├── supabaseClient.ts   # Supabase client init
    │   ├── auth.ts             # useAuth hook
    │   └── db.ts               # Data access helpers
    ├── components/
    │   ├── Layout.tsx           # Nav header + auth state
    │   └── ProductCard.tsx      # Reusable listing card
    └── pages/
        ├── HomePage.tsx         # Landing, search, featured
        ├── ExplorePage.tsx      # Browse all listings
        ├── LoginPage.tsx        # Auth login
        ├── RegisterPage.tsx     # Auth registration
        ├── ListingDetailsPage.tsx  # Full listing + offers + contact
        ├── ProfilePage.tsx      # User profile + manage listings
        ├── SubmitListingPage.tsx # Create a listing
        ├── MessagesPage.tsx     # Chat thread view
        ├── OffersPage.tsx       # My offers
        ├── SellerOffersPage.tsx # Inbox — offers received
        ├── DashboardPage.tsx    # Admin panel
        └── NotFoundPage.tsx     # 404
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project ([create one free](https://supabase.com))

### 1. Clone and install

```bash
git clone https://github.com/geraphael/Hurry-Shop.git
cd Hurry-Shop
npm install
```

### 2. Database setup

Run the schema in `supabase/schema.sql` against your Supabase project's SQL editor. This creates all tables and seeds the 14 default categories.

### 3. Configure Supabase

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Update `src/lib/supabaseClient.ts` to use these env variables:

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 5. Storage setup

Create a `listing-images` bucket in Supabase Storage (public) for listing cover photos.

### 6. Run

```bash
npm run dev     # Development server on port 4173
npm run build   # Production build
npm run preview # Preview production build
```

### 7. Make yourself admin

In your Supabase SQL editor, run:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## 🗄 Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts, roles, seller verification status |
| `categories` | 14 seeded categories (Electronics, Books, Fashion, etc.) |
| `listings` | Item listings with approval workflow |
| `offers` | Buyer-to-seller price offers |
| `conversations` | Chat threads tied to listings |
| `messages` | Individual messages within conversations |
| `reports` | Listing reports from the community |

---

## 🧪 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## 📸 Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Home (hero, search, categories, featured) | Public |
| `/explore` | Browse all approved listings | Public |
| `/listing/:id` | Listing details, offers, contact seller | Public |
| `/login` | Login | Redirects if logged in |
| `/register` | Register | Redirects if logged in |
| `/sell` | Submit a listing | Required |
| `/profile/:id` | User profile + listings | Public |
| `/profile/me` | Own profile | Required |
| `/messages` | Chat threads | Required |
| `/offers` | My submitted offers | Required |
| `/seller-offers` | Offers received (inbox) | Required |
| `/admin` | Admin dashboard | Admin only |
| `*` | 404 page | Public |

---

## 🤝 Contributing

This is a campus project. Feel free to open issues or submit PRs for improvements.

---

<div align="center">
  <sub>Built with ❤️ for the campus community.</sub>
</div>