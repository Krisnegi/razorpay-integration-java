# Razorpay & WhatsApp Cloud API Integration Storefront (Java Spring Boot)

A full-stack, next-generation tech gear storefront featuring atomic inventory control, user authentication, seamless Razorpay Sandbox integration, and automated Meta WhatsApp Cloud API customer notifications powered by **Java 21 & Spring Boot 3.x**.

🌐 **Live Demo:** [https://razorpay-integration-omega.vercel.app/](https://razorpay-integration-omega.vercel.app/)

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS, Lucide Icons, Glassmorphism UI tokens)
* **Backend:** Java 21, Spring Boot 3.x (Spring Web, Spring Data JPA, Spring Security, Bean Validation)
* **Database & ORM:** PostgreSQL (Dockerized), Hibernate / JPA, Auto-Seeding DatabaseSeeder
* **Payment Integration:** Razorpay Java SDK 1.4.7
* **Security & Auth:** JJWT (JSON Web Tokens), BCrypt Password Hashing

---

## 🚀 Key Features Implemented

1. **Seamless Online Checkout (Razorpay Integration):**
   * Pre-fetches order details and initializes Razorpay orders safely.
   * Integrates the interactive Razorpay Sandbox Checkout modal.
   * Dynamically resolves the true payment instrument (UPI, Card, NetBanking, Wallet) used inside the popup on confirmation and updates database logs.
   * Atomic inventory control: Stock levels are decremented, and shopping carts are cleared *only after* a payment signature is verified or webhook reports success.
   * **Checkout Cancellation Recovery:** Cart items are preserved if a user closes the payment window, allowing them to return and retry payment seamlessly.

2. **Meta WhatsApp Cloud API Integration:**
   * Automatically sends transactional order confirmation templates (e.g. `order_confirmation`) on successful checkout.
   * **COD Orders:** Dispatched immediately upon order placement.
   * **Online Payments:** Triggered asynchronously after cryptographic signature verification verifies the payment status as `PAID`.
   * Includes an auto-detecting **Sandbox dry-run mode** that logs structured message templates to the server console if no live credentials are set.

3. **Phone Number & Country Code Validation:**
   * Includes a custom, responsive `<PhoneInput />` component with flag selector dropdown (India 🇮🇳, USA 🇺🇸, UK 🇬🇧, etc.).
   * Strict phone validation (accepts numeric keys only and validates standard length between 7-15 digits).
   * Fully persists phone numbers alongside selected country codes across the database (`users`, `orders`, and `payments` tables).
   * Automatically pre-fills checkout fields with the logged-in user's profile details.

4. **Past Order History & Status Tracking:**
   * Added a fully responsive **Past Orders History Modal**.
   * Integrates paginated history lookups (limit 5 entries per page) with status logs and total order cost formatting.

5. **Product Catalog & Interactive Cart Steppers:**
   * Spring Boot `DatabaseSeeder` with 55 high-quality products automatically populated on initial launch.
   * Front-end pagination UI (12 items per page) with category filters.
   * Search input with dedicated click-to-trigger button to optimize API calls.
   * Persistent sliding **Cart Drawer** syncing live quantities with inline steppers (`- QTY +`) directly inside the product card.

---

## 📦 Getting Started

### 1. Prerequisites
* Install [Docker](https://www.docker.com/), [Java 21](https://openjdk.org/), [Maven](https://maven.apache.org/), and [Node.js](https://nodejs.org/) (v18+).

### 2. Run the PostgreSQL Database & Spring Boot Backend
1. Navigate to `/backend`.
2. Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```
3. Run the Spring Boot application:
   ```bash
   export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
   export PATH="$JAVA_HOME/bin:$PATH"
   mvn spring-boot:run
   ```
   *The Java backend will run on port `5000` (or `8080`), automatically creating PostgreSQL tables and seeding 55 products.*

### 3. Run the Frontend Storefront
1. Navigate to `/frontend`.
2. Configure `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```
3. Install dependencies & start dev server:
   ```bash
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.
