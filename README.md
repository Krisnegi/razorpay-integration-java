# Razorpay Integration E-Commerce Storefront

A full-stack, next-generation tech gear storefront featuring atomic inventory control, user authentication, and seamless Razorpay payment gateway integration.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS, Lucide Icons, Glassmorphism UI tokens)
* **Backend:** Node.js, Express, TypeScript, Zod (Validation), JWT (Authentication)
* **Database & ORM:** PostgreSQL (Dockerized), Prisma Client
* **Payment Integration:** Razorpay Sandbox SDK

---

## 🚀 Key Features Implemented

1. **Seamless Online Checkout (Razorpay Integration):**
   * Pre-fetches order details and initializes Razorpay orders safely.
   * Integrates the interactive Razorpay Sandbox Checkout modal.
   * Dynamically resolves the true payment instrument (UPI, Card, NetBanking, Wallet) used inside the popup on confirmation and updates database logs.
   * Atomic inventory control: Stock levels are decremented, and shopping carts are cleared *only after* a payment signature is verified or webhook reports success.
   * **Checkout Cancellation Recovery:** Cart items are preserved if a user closes the payment window, allowing them to return and retry payment seamlessly.

2. **Phone Number & Country Code Validation:**
   * Includes a custom, responsive `<PhoneInput />` component with flag selector dropdown (India 🇮🇳, USA 🇺🇸, UK 🇬🇧, etc.).
   * Strict phone validation (accepts numeric keys only and validates standard length between 7-15 digits).
   * Fully persists phone numbers alongside selected country codes across the database (`users`, `orders`, and `payments` tables).
   * Automatically pre-fills checkout fields with the logged-in user's profile details.

3. **Past Order History & Status Tracking:**
   * Added a fully responsive **Past Orders History Modal**.
   * Integrates paginated history lookups (limit 5 entries per page) with status logs and total order cost formatting.

4. **Product Catalog & Interactive Cart Steppers:**
   * Custom seed script with 55 high-quality products.
   * Front-end pagination UI (12 items per page) with category filters.
   * Search input with dedicated click-to-trigger button to optimize API calls.
   * Persistent sliding **Cart Drawer** syncing live quantities with inline steppers (`- QTY +`) directly inside the product card.

5. **100% Mobile Responsive Layouts:**
   * Restructured cart drawer grids and modal columns to align and stack vertically on small phone screens, eliminating horizontal scrollbars.

---

## 📦 Getting Started

### 1. Prerequisites
* Install [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/) (v18+).

### 2. Run the Backend API
1. Navigate to `/backend`.
2. Configure `.env` with the following variables:
   ```env
   PORT=5005
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/razorpay_db?schema=public"
   JWT_SECRET="your_jwt_secret"
   JWT_EXPIRES_IN="7d"
   RAZORPAY_KEY_ID="your_razorpay_key_id"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
   RAZORPAY_WEBHOOK_SECRET="your_optional_webhook_secret"
   ```
3. Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Apply database schema and seed catalog products:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
6. Start development server:
   ```bash
   npm run dev
   ```

### 3. Run the Frontend Storefront
1. Navigate to `/frontend`.
2. Configure `.env.local` (the Razorpay Key ID is fetched dynamically from backend checkout payload):
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5005/api"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` to browse the catalog.
