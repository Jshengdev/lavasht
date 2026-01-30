# ONE-SHOT BUILD: Joanie E-Commerce Store

Build a complete full-stack e-commerce application from scratch. Execute all tasks sequentially without stopping for confirmation.

---

## PROJECT OVERVIEW

**Name:** Joanie E-Commerce Store
**Type:** Full-stack e-commerce product listing page
**Design Reference:** Figma-based shoe store with modern animations

---

## TECH STACK

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Auth:** NextAuth.js (Credentials provider)
- **Animations:** Framer Motion + GSAP
- **3D Effects:** Three.js + React Three Fiber
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

---

## DESIGN TOKENS

```
Colors:
- Promo Banner: #4A4C6C (dark slate)
- Footer: #333333 (dark charcoal)
- Page Background: #F4F4F4 (light gray)
- Sale/Wishlist Red: #DB4444
- Button Dark: #333333
- Button Accent: #B5A642 (olive/gold)
- Star Yellow: #FFAD33

Layout:
- Page Width: 1440px
- Promo Banner Height: 41px
- Product Card: 270x350px
- Product Grid: 4 columns, 85px gap
- Footer Height: 451px
- Border Radius (buttons): 5px
```

---

## BUILD INSTRUCTIONS

### PHASE 1: Project Setup

1. Create Next.js 14 project with TypeScript, Tailwind, App Router, src directory
2. Install all dependencies:
```bash
npm install prisma @prisma/client next-auth @auth/prisma-adapter bcryptjs lucide-react framer-motion gsap @gsap/react three @react-three/fiber @react-three/drei
npm install -D @types/bcryptjs @types/three ts-node
```

3. Configure Tailwind with custom colors (design tokens above)

---

### PHASE 2: Database

Create Prisma schema with these models:
- **User:** id, email, name, image, password, cartItems[], wishlistItems[]
- **Product:** id, name, price, salePrice?, image, rating, reviewCount, category, isOnSale, cartItems[], wishlistItems[]
- **CartItem:** id, quantity, userId, productId (unique constraint on userId+productId)
- **WishlistItem:** id, userId, productId (unique constraint on userId+productId)

Create seed script with 8 products:
- 4 "new-arrivals" (1 on sale)
- 4 "trending" (1 on sale)
- Use shoe names like "Nike Air Max 270", "Adidas Ultraboost", etc.
- Prices range $70-$200, ratings 4.0-4.9

Create Prisma client singleton at `/src/lib/prisma.ts`

---

### PHASE 3: Types

Create `/src/types/index.ts` with:
- Product interface
- CartItem interface (with product relation)
- WishlistItem interface (with product relation)
- User interface
- TabCategory type ('new-arrivals' | 'trending')

Create `/src/types/next-auth.d.ts` to extend session with user.id

---

### PHASE 4: Auth

1. Create NextAuth config at `/src/lib/auth.ts`:
   - Credentials provider with email/password
   - Prisma adapter
   - JWT session strategy
   - Callbacks to include user.id in session

2. Create API routes:
   - `/api/auth/[...nextauth]/route.ts`
   - `/api/auth/signup/route.ts` (POST - create user with bcrypt hashed password)

3. Create AuthProvider component wrapping SessionProvider

4. Create auth UI components:
   - `SignInModal.tsx` - email/password form with Framer Motion animations
   - `SignUpModal.tsx` - name/email/password form
   - `UserMenu.tsx` - dropdown with user info, wishlist link, sign out

---

### PHASE 5: API Routes

Create REST endpoints:

**GET /api/products**
- Optional query param: ?category=new-arrivals|trending
- Returns { products: Product[] }

**GET /api/cart** (auth required)
- Returns user's cart items with product details

**POST /api/cart** (auth required)
- Body: { productId }
- Upsert cart item (increment quantity if exists)

**DELETE /api/cart/[id]** (auth required)
- Remove item from cart

**PATCH /api/cart/[id]** (auth required)
- Update quantity

**GET /api/wishlist** (auth required)
- Returns user's wishlist with product details

**POST /api/wishlist** (auth required)
- Toggle: add if not exists, remove if exists
- Returns { success, action: 'added'|'removed' }

---

### PHASE 6: Layout Components

**PromoBanner.tsx**
- Full width, bg-promo-banner (#4A4C6C)
- Centered white text: "New here? Save 20% with code: YES4"
- Height: 41px, padding: 12px vertical

**Header.tsx**
- White background with subtle shadow
- Left: Logo (bird SVG) + "Joanie" text
- Center: Nav links (Women, Men, Kids, Sale, New, Brands)
- Right: Heart icon, Cart icon (with count badge), User icon
- Icons from Lucide React

**Footer.tsx**
- Dark background (#333333)
- Logo, Address (USA, California), Contact info
- 4 column grid: Brand, Shop links, Help links, About links
- Social icons row (Facebook, Instagram, Twitter, LinkedIn, YouTube)
- Copyright: "© 2029 Joanie. All rights reserved."

**ValueProps.tsx**
- 3 columns centered
- Each: icon in dark circle, title, description
- FREE AND FAST DELIVERY, 24/7 CUSTOMER SERVICE, MONEY BACK GUARANTEE

**Store Layout** at `/src/app/(store)/layout.tsx`
- PromoBanner → Header → {children} → Footer
- Min-height screen, flex column, bg-page-bg

---

### PHASE 7: UI Components

**Button.tsx**
- Variants: dark, accent, outline
- Framer Motion hover scale (1.02), tap scale (0.98)
- Border radius: 5px

**Badge.tsx**
- Variants: sale (red), new (green)
- Small rounded pill

**StarRating.tsx**
- Props: rating (number), reviewCount
- Render 5 stars (filled based on rating) + "(count)" text
- Star color: #FFAD33

**HeartIcon.tsx**
- Props: filled (boolean), onClick
- Empty: gray outline
- Filled: red fill (#DB4444)
- Framer Motion pop animation on fill

---

### PHASE 8: Product Components

**TabFilter.tsx**
- Two tabs: "NEW ARRIVALS", "WHAT'S TRENDING"
- Active tab: filled dark (#333333)
- Inactive tab: outlined with accent color (#B5A642)
- Framer Motion layoutId for sliding indicator
- Props: activeTab, onTabChange

**ProductCard.tsx**
- Props: product, isWishlisted, onAddToCart, onToggleWishlist
- Layout: image container (aspect-square), info below
- Image container features:
  - Sale badge top-left (if isOnSale)
  - Heart icon top-right (toggleable)
  - "Add to Cart" button slides up on hover (Framer Motion AnimatePresence)
- Info: product name, price (red if sale + strikethrough original), star rating
- Dimensions: 270x350px

**ProductGrid.tsx**
- Props: products, loading, wishlistedIds, onAddToCart, onToggleWishlist
- 4-column grid (responsive: 2 mobile, 3 tablet, 4 desktop)
- Gap: ~24px
- Loading state: 8 skeleton cards with pulse animation
- Framer Motion stagger animation on load

---

### PHASE 9: Hero Section

**Hero.tsx**
- Large "SHOP" text as background (very faded, huge font)
- Decorative green border frame
- "sania" purple badge top-left
- "ADJUSTABLE" label top area
- "SOFT PAD" label bottom area
- Center: HeroShoe3D component
- Framer Motion entrance animations

**HeroShoe3D.tsx** (Three.js)
- Use React Three Fiber
- Load shoe image as texture on plane geometry
- Mouse tracking for subtle parallax movement
- Floating animation (gentle up/down bob)
- Fallback to static image if WebGL not supported
- SIMPLER ALTERNATIVE: Use Framer Motion 3D transforms (rotateX, rotateY based on mouse position) if Three.js is too complex

---

### PHASE 10: Hooks

**useProducts.ts**
- Fetch from /api/products
- Optional category filter
- Returns { products, loading, error }

**useCart.ts**
- Requires session
- Fetch cart, addToCart, removeFromCart, updateQuantity
- Returns { items, loading, itemCount, total, addToCart, removeFromCart }

**useWishlist.ts**
- Requires session
- Fetch wishlist, toggleWishlist, isWishlisted helper
- Returns { items, loading, toggleWishlist, isWishlisted }

---

### PHASE 11: Home Page

Create `/src/app/(store)/page.tsx`:

```tsx
'use client';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('new-arrivals');
  const { products, loading } = useProducts(activeTab);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted, items: wishlistItems } = useWishlist();

  return (
    <div>
      <Hero />

      <section className="py-16 max-w-7xl mx-auto px-6">
        <TabFilter activeTab={activeTab} onTabChange={setActiveTab} />
        <ProductGrid
          products={products}
          loading={loading}
          wishlistedIds={wishlistItems.map(i => i.productId)}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
        />
      </section>

      <ValueProps />
    </div>
  );
}
```

---

### PHASE 12: Animations

**Page Load Sequence (GSAP)**
- Promo banner fades in
- Header slides down
- Hero fades in, shoe floats up
- Tabs slide in from left
- Products stagger in from bottom

**Scroll Animations**
- ValueProps fade in when scrolled into view

**Micro-interactions**
- Button hover: scale + shadow
- Heart click: pop with particle burst
- Cart icon: bounce when item added
- Tab switch: smooth indicator slide

---

### PHASE 13: Final Setup

1. Update root layout to wrap with AuthProvider
2. Create placeholder images in /public/images/ (or use placeholder URLs)
3. Set up .env with DATABASE_URL and NEXTAUTH_SECRET
4. Run prisma db push and prisma db seed
5. Test all flows:
   - Browse products
   - Switch tabs
   - Sign up / Sign in
   - Add to cart (when signed in)
   - Toggle wishlist (when signed in)

---

## FILE STRUCTURE

```
/src
  /app
    /api
      /auth/[...nextauth]/route.ts
      /auth/signup/route.ts
      /products/route.ts
      /cart/route.ts
      /cart/[id]/route.ts
      /wishlist/route.ts
      /wishlist/[id]/route.ts
    /(store)
      layout.tsx
      page.tsx
    layout.tsx
    globals.css
  /components
    /layout
      PromoBanner.tsx
      Header.tsx
      Footer.tsx
    /home
      Hero.tsx
      HeroShoe3D.tsx
      TabFilter.tsx
      ProductGrid.tsx
      ProductCard.tsx
      ValueProps.tsx
    /ui
      Button.tsx
      Badge.tsx
      StarRating.tsx
      HeartIcon.tsx
    /auth
      AuthProvider.tsx
      SignInModal.tsx
      SignUpModal.tsx
      UserMenu.tsx
  /hooks
    useProducts.ts
    useCart.ts
    useWishlist.ts
  /lib
    prisma.ts
    auth.ts
  /types
    index.ts
    next-auth.d.ts
/prisma
  schema.prisma
  seed.ts
/public
  /images
    hero-shoe.png
    shoe-1.png through shoe-8.png
```

---

## EXECUTION NOTES

1. Build everything in order (Phases 1-13)
2. Don't stop for confirmation - execute continuously
3. If you hit an error, fix it and continue
4. Use placeholder images (gray boxes or placeholder.com URLs) if needed
5. Ensure TypeScript compiles at each phase
6. The goal is a WORKING application, not perfection
7. Prioritize functionality over polish if time-constrained

---

## SUCCESS CRITERIA

- [ ] App runs on localhost:3000
- [ ] Products display in grid
- [ ] Tab filtering works
- [ ] Sign up creates user
- [ ] Sign in works
- [ ] Add to cart works (authenticated)
- [ ] Wishlist toggle works (authenticated)
- [ ] Animations are smooth
- [ ] Hero section renders (3D or fallback)
- [ ] Ready for Vercel deployment

---

**START BUILDING NOW. Execute all phases sequentially. Do not stop until the app is complete and running.**
