# Razorpay & WhatsApp Cloud API Integration Storefront

A full-stack, next-generation tech gear storefront featuring atomic inventory control, user authentication, seamless Razorpay Sandbox integration, and automated Meta WhatsApp Cloud API customer notifications.

🌐 **Live Demo:** [https://razorpay-integration-omega.vercel.app/](https://razorpay-integration-omega.vercel.app/)

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
   * Custom seed script with 55 high-quality products.
   * Front-end pagination UI (12 items per page) with category filters.
   * Search input with dedicated click-to-trigger button to optimize API calls.
   * Persistent sliding **Cart Drawer** syncing live quantities with inline steppers (`- QTY +`) directly inside the product card.

6. **100% Mobile Responsive Layouts:**
   * Restructured cart drawer grids and modal columns to align and stack vertically on small phone screens, eliminating horizontal scrollbars.

---

## 🔗 API Reference & Documentation

All requests use `/api` as the base route. Authenticated endpoints require an `Authorization: Bearer <jwt_token>` header.

### 🔑 Authentication API

#### `POST /auth/register`
Creates a new customer profile.
* **Request Body:**
  ```json
  {
    "name": "Sam Billings",
    "email": "sam@gmail.com",
    "password": "password123",
    "countryCode": "+91",
    "phone": "9999999999"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "id": 3,
        "name": "Sam Billings",
        "email": "sam@gmail.com",
        "countryCode": "+91",
        "phone": "9999999999",
        "role": "CUSTOMER"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5..."
    }
  }
  ```

#### `POST /auth/login`
Authenticates a user and returns a session token.
* **Request Body:**
  ```json
  {
    "email": "sam@gmail.com",
    "password": "password123"
  }
  ```

---

### 🛒 Shopping Cart API

#### `GET /cart`
Fetches or initializes the current cart items. Supports guest carts using `x-cart-id` header.
* **Headers:**
  * `x-cart-id` (UUID string, optional/created by client)

#### `POST /cart/items`
Adds or updates an item in the cart.
* **Request Body:**
  ```json
  {
    "productId": 2,
    "quantity": 1
  }
  ```

---

### 📦 Orders & Payments API

#### `POST /orders/checkout`
Creates a pending order and registers a COD or Razorpay transaction.
* **Headers:**
  * `x-cart-id`: `57fa8191-76c4-45ea-b4ff-e20cd4bcb6aa`
* **Request Body:**
  ```json
  {
    "paymentMethod": "CARD",
    "customerEmail": "sam@gmail.com",
    "customerCountryCode": "+91",
    "customerPhone": "9999999999",
    "shippingAddress": "House 42, Green Street, New Delhi"
  }
  ```
* **Response (201 Created):**
  * For COD orders:
    ```json
    {
      "status": "success",
      "data": {
        "orderId": 12,
        "orderNumber": "ORD-1784723146-8C3",
        "status": "PENDING",
        "paymentMethod": "COD"
      }
    }
    ```
  * For online payments (initiates Razorpay transaction details):
    ```json
    {
      "status": "success",
      "data": {
        "orderId": 13,
        "orderNumber": "ORD-1784723150-12A",
        "status": "PENDING",
        "paymentMethod": "CARD",
        "payment": {
          "orderId": "order_OrEwE2xJkLP2k1",
          "amount": 149900,
          "currency": "INR",
          "keyId": "rzp_test_TFeobP2tefkrtc"
        }
      }
    }
    ```

#### `POST /payments/verify`
Verifies Razorpay's cryptographic signature and updates order status.
* **Request Body:**
  ```json
  {
    "razorpay_order_id": "order_OrEwE2xJkLP2k1",
    "razorpay_payment_id": "pay_OrExZ3xOpLK123",
    "razorpay_signature": "e5c7a52f9b8c0d12e..."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Payment verified and order finalized successfully"
  }
  ```

#### `GET /orders/my-orders`
Retrieves a paginated list of past orders for the authenticated user.
* **Query Parameters:**
  * `page`: `1` (default)
  * `limit`: `5` (default)
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 13,
        "orderNumber": "ORD-1784723150-12A",
        "totalAmount": "1499.00",
        "status": "PAID",
        "createdAt": "2026-08-03T05:20:00.000Z",
        "items": [
          {
            "id": 20,
            "quantity": 1,
            "price": "1499.00",
            "product": {
              "name": "Full Desk XXL Mouse Pad"
            }
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "totalItems": 1,
      "totalPages": 1
    }
  }
  ```

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
   
   # Meta WhatsApp Cloud API (Expose your Meta Business Credentials)
   META_ACCESS_TOKEN="your_meta_access_token"
   META_PHONE_NUMBER_ID="your_whatsapp_phone_number_id"
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
