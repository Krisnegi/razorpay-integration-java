# Phase 1 Walkthrough: Setup & Razorpay Integration

We have successfully bootstrapped the backend project and implemented Phase 1 (Razorpay integration and project setup).

## What Was Built

1. **Dockerized PostgreSQL:** Created `docker-compose.yml` running on port `5432`.
2. **Database Management (Prisma ORM):** Created the `schema.prisma` file containing the `Payment` schema with `PaymentMethod` and `PaymentStatus` enums.
3. **Core Configurations:**
   * `src/config/prisma.ts`: Exports the Prisma Client connection.
   * `src/config/razorpay.ts`: Initializes the Razorpay SDK using credentials.
4. **Middlewares:**
   * `src/middleware/validate.ts`: Generic Zod request schema validation.
   * `src/middleware/error.ts`: Global error handling and formatting.
5. **Validation Schemas:** `src/schemas/payment.schema.ts` containing Zod schemas for order creation and verification.
6. **Routes, Controllers & Services:**
   * `src/routes/payment.routes.ts`: Maps URLs to controller endpoints.
   * `src/controllers/payment.controller.ts`: Orchestrates endpoint requests and responses.
   * `src/services/payment.service.ts`: Implements business logic (handling digital/COD flows, signature verification, and webhook signature verification).
7. **Main App Bootstrapper:** `src/server.ts` binding the express server, CORS, Morgan logger, JSON raw body hook, and starting the server on port `5005`.

---

## Key Core Concept Explanations

### 1. The Razorpay Order Workflow
Online payments through Razorpay require a double-handshake to prevent client-side payment tampering:
1. **Order Creation:** The backend contacts Razorpay's API to request a payment order (e.g. amount ₹150). Razorpay returns a unique `order_id` (e.g., `order_123`). We record this in our DB as `PENDING`.
2. **Client Checkout:** The frontend presents the Razorpay Checkout Modal to the user using the `order_id` and the amount.
3. **Verification:** Once the user successfully pays, Razorpay returns a `razorpay_payment_id` and a cryptographic `razorpay_signature`. The frontend sends these to our backend `/api/payments/verify` endpoint. We verify the signature locally using HMAC-SHA256 (`order_id + "|" + payment_id` signed with our API Secret). If valid, we mark the payment as `CAPTURED` (Paid).

### 2. Webhook Handling
If a customer completes a payment but their network drops before the frontend can call our verify endpoint, the payment status on our database would remain stuck in `PENDING`. 
To handle this, we listen for a `payment.captured` event sent directly from Razorpay's servers via Webhooks. Since webhook delivery occurs asynchronously, we verify the signature sent in the header `x-razorpay-signature` against the raw webhook body to ensure it originated from Razorpay before transitioning the order to `CAPTURED`.

---

## Verification Test Runs & Output Logs

### 1. COD Order Creation
We created a Cash on Delivery order:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"amount": 299.00, "currency": "INR", "method": "COD", "customerEmail": "customer@example.com", "customerPhone": "9876543210"}' http://localhost:5005/api/payments/order
```
* **Output:**
  ```json
  {"status":"success","data":{"orderId":"COD-CE9F58E2BCF660A6","amount":299,"currency":"INR","method":"COD","status":"PENDING"}}
  ```

### 2. Digital Order Creation (with mock credentials)
We checked how the error handler behaves when Razorpay API credentials fail authorization:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"amount": 150.00, "currency": "INR", "method": "UPI", "customerEmail": "customer@example.com"}' http://localhost:5005/api/payments/order
```
* **Output:**
  ```json
  {"status":"error","message":"Razorpay Order Creation Failed: Authentication failed"}
  ```

### 3. Payment Signature Verification
* Checked failure on bad signature:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"razorpay_order_id": "order_123", "razorpay_payment_id": "pay_123", "razorpay_signature": "invalid_signature"}' http://localhost:5005/api/payments/verify
  ```
  * **Response:** `{"status":"error","message":"Payment verification failed: Signature mismatch"}`

* Checked success path using correct signature (mock data):
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"razorpay_order_id": "order_123", "razorpay_payment_id": "pay_123", "razorpay_signature": "13ff0394a4589c29b029290f44875d071e7e8e8d0f311bcbc038ea623c227a41"}' http://localhost:5005/api/payments/verify
  ```
  * **Response:**
    ```json
    {"status":"success","message":"Payment verified and captured successfully","data":{"id":2,"orderId":"order_123","paymentId":"pay_123","signature":"13ff0394a4589c29b029290f44875d071e7e8e8d0f311bcbc038ea623c227a41","amount":"150","currency":"INR","method":"UPI","status":"CAPTURED","customerEmail":"test@example.com","customerPhone":null}}
    ```

### 4. Webhook Signature Verification
* Checked success path by sending signature for `order_webhook_test` payload:
  ```bash
  curl -X POST -H "Content-Type: application/json" -H "x-razorpay-signature: 1c2c2765969fa79d007156ffd77a532437d0bbf1b84bfa8cb1d74e107f79511b" -d '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_webhook_123","order_id":"order_webhook_test"}}}}' http://localhost:5005/api/payments/webhook
  ```
  * **Response:** `{"received":true}`
  * **Database Record Status Check (Prisma output):**
    ```json
    {
      "id": 3,
      "orderId": "order_webhook_test",
      "paymentId": "pay_webhook_123",
      "status": "CAPTURED"
    }
    ```

---

# Phase 2 Walkthrough: Products APIs

We have successfully implemented Phase 2 (Products database schema, seed script, list/filter/search/pagination endpoints, and single product details endpoint).

## What Was Built in Phase 2

1. **Prisma Product Model:** Added `Product` model to `prisma/schema.prisma` (`name`, `description`, `price`, `category`, `stock`, `imageUrl`).
2. **Database Seeding:** Created `prisma/seed.ts` populating 6 sample e-commerce products and configured `npm run db:seed`.
3. **Product Validation Schemas:** `src/schemas/product.schema.ts` for sanitizing page, limit, search, category, and integer ID params.
4. **Service & Controller:** `src/services/product.service.ts` and `src/controllers/product.controller.ts` for case-insensitive search, category filter, and paginated responses.
5. **Product Routes:** `src/routes/product.routes.ts` mounted at `/api/products`.

---

## Verification Test Runs & Output Logs

### 1. List Products (Default Pagination)
```bash
curl -s http://localhost:5005/api/products
```
* **Output:** Returned 6 seeded items with pagination metadata `{ page: 1, limit: 10, totalItems: 6, totalPages: 1 }`.

### 2. Search Products
```bash
curl -s "http://localhost:5005/api/products?search=keyboard"
```
* **Output:**
  ```json
  {"status":"success","data":[{"id":2,"name":"Mechanical RGB Gaming Keyboard","price":"2999","category":"Electronics"}],"pagination":{"page":1,"limit":10,"totalItems":1,"totalPages":1}}
  ```

### 3. Category Filter
```bash
curl -s "http://localhost:5005/api/products?category=Wearables"
```
* **Output:**
  ```json
  {"status":"success","data":[{"id":5,"name":"Smart Fitness Tracker Watch","price":"3499","category":"Wearables"}],"pagination":{"page":1,"limit":10,"totalItems":1,"totalPages":1}}
  ```

### 4. Single Product Fetch & 404 Check
```bash
curl -s "http://localhost:5005/api/products/1"
```
* **Output:** Returned product details for ID 1.

```bash
curl -s "http://localhost:5005/api/products/999"
```
* **Output:** Returned `{"status":"error","message":"Product with ID 999 not found"}` with HTTP 404 status.

---

# Phase 3 Walkthrough: Cart APIs

We have successfully implemented Phase 3 (Cart database models, stock checking, session cart creation via `x-cart-id`, add/update/remove items, and clear cart endpoints).

## What Was Built in Phase 3

1. **Prisma Cart Models:** Added `Cart` and `CartItem` models to `prisma/schema.prisma` with cascading deletion and relation to `Product`.
2. **Cart Request Schemas:** `src/schemas/cart.schema.ts` for validating UUID headers, item quantities, and product IDs.
3. **Cart Service:** `src/services/cart.service.ts` implementing stock verification, automatic cart generation, price & item count calculations.
4. **Cart Controller & Routes:** `src/controllers/cart.controller.ts` and `src/routes/cart.routes.ts` mounted at `/api/cart`.

---

## Verification Test Runs & Output Logs

### 1. Get Cart (Auto-generates new Cart UUID)
```bash
curl -s -X GET http://localhost:5005/api/cart
```
* **Output:** `{"status":"success","data":{"cartId":"fe17fce7-814b-4534-8fa7-2466c2e869dc","items":[],"itemCount":0,"totalAmount":0}}`

### 2. Add Products to Cart & Calculate Totals
```bash
curl -s -X POST -H "Content-Type: application/json" -H "x-cart-id: fe17fce7-814b-4534-8fa7-2466c2e869dc" -d '{"productId": 1, "quantity": 2}' http://localhost:5005/api/cart/items
```
* **Output:** Added 2 Wireless Headphones (₹4,999 each) -> `totalAmount: 9998`.

```bash
curl -s -X POST -H "Content-Type: application/json" -H "x-cart-id: fe17fce7-814b-4534-8fa7-2466c2e869dc" -d '{"productId": 2, "quantity": 1}' http://localhost:5005/api/cart/items
```
* **Output:** Added 1 Gaming Keyboard (₹2,999) -> `totalAmount: 12997`.

### 3. Update Item Quantity
```bash
curl -s -X PATCH -H "Content-Type: application/json" -H "x-cart-id: fe17fce7-814b-4534-8fa7-2466c2e869dc" -d '{"quantity": 3}' http://localhost:5005/api/cart/items/1
```
* **Output:** Updated Headphones quantity to 3 -> `itemTotal: 14997`, `totalAmount: 17996`.

### 4. Remove Specific Item
```bash
curl -s -X DELETE -H "x-cart-id: fe17fce7-814b-4534-8fa7-2466c2e869dc" http://localhost:5005/api/cart/items/2
```
* **Output:** Removed Keyboard -> `totalAmount: 14997`.

### 5. Clear Cart
```bash
curl -s -X DELETE -H "x-cart-id: fe17fce7-814b-4534-8fa7-2466c2e869dc" http://localhost:5005/api/cart
```
* **Output:** `{"status":"success","message":"Cart cleared","data":{"cartId":"fe17fce7-814b-4534-8fa7-2466c2e869dc","items":[],"itemCount":0,"totalAmount":0}}`

---

# Phase 4 Walkthrough: Orders Flow

We have successfully implemented Phase 4 (Order & OrderItem database models, atomic checkout `$transaction`, stock reservation/deduction, item price snapshots, payment linkage, and status synchronization).

## What Was Built in Phase 4

1. **Prisma Order Models:** Added `Order`, `OrderItem`, and `OrderStatus` enum (`PENDING`, `PAID`, `CANCELLED`, `FAILED`) to `prisma/schema.prisma` and linked `Order` to `Payment`.
2. **Order Request Schemas:** `src/schemas/order.schema.ts` for validating checkout payload and integer order IDs.
3. **Order Service & Atomic Transaction:** `src/services/order.service.ts` implementing a Prisma `$transaction` that:
   * Validates stock for all cart items.
   * Generates a unique readable `orderNumber` (e.g. `ORD-1784551228450-B9C03A`).
   * Saves fixed price and quantity snapshots in `OrderItem`.
   * Decrements product inventory stock.
   * Clears cart items.
   * Creates Razorpay / COD payment and links `orderRefId`.
4. **Payment & Order Sync:** Updated `src/services/payment.service.ts` to automatically update connected `Order` status to `PAID` when a payment signature is verified or Razorpay webhook fires `payment.captured`.
5. **Order Controller & Routes:** `src/controllers/order.controller.ts` and `src/routes/order.routes.ts` mounted at `/api/orders`.

---

## Verification Test Runs & Output Logs

### 1. Checkout Cart into Order (`POST /api/orders/checkout`)
```bash
curl -s -X POST -H "Content-Type: application/json" -H "x-cart-id: 4029950e-c602-4337-99a7-5698fb0c4ab5" -d '{"paymentMethod": "COD", "customerEmail": "buyer@example.com", "customerPhone": "9876543210", "shippingAddress": "123 Tech Park, Bengaluru"}' http://localhost:5005/api/orders/checkout
```
* **Output:** Created Order `ORD-1784551228450-B9C03A` for ₹9,998 with COD payment.

### 2. Verified Automatic Inventory Stock Deduction
* Checked product 1 stock after ordering 2 units:
```bash
curl -s http://localhost:5005/api/products/1
```
* **Output:** Product stock was successfully decremented from **35 down to 33**.

### 3. Verified Automatic Cart Cleanup
```bash
curl -s -X GET -H "x-cart-id: 4029950e-c602-4337-99a7-5698fb0c4ab5" http://localhost:5005/api/cart
```
* **Output:** Cart was automatically cleared (`items: []`, `totalAmount: 0`).

### 4. Verified Payment Signature -> Order Status `PAID` Sync
* Created digital order (`paymentMethod: CARD`), verified payment signature via `/api/payments/verify`:
```bash
curl -s http://localhost:5005/api/orders/2
```
* **Output:**
```json
  {
    "status": "success",
    "data": {
      "id": 2,
      "orderNumber": "ORD-1784551399759-F47D32",
      "totalAmount": 4999,
      "status": "PAID",
      "paymentMethod": "CARD",
      "payment": {
        "orderId": "order_TFlFMmlGhqwhtb",
        "paymentId": "pay_test_card_123",
        "status": "CAPTURED"
      }
    }
  }
  ```

---

# Phase 5 Walkthrough: User Authentication

We have successfully implemented Phase 5 (User database model with roles, password hashing using `bcryptjs`, JWT token authentication, authentication middleware guard, and user endpoints).

## What Was Built in Phase 5

1. **Prisma User Model & Relations:** Added `User` model and `Role` enum (`CUSTOMER`, `ADMIN`) to `prisma/schema.prisma`. Linked optional `userId` foreign keys to `Cart` and `Order` models to support both Guest and Authenticated flows.
2. **Auth Request Schemas:** `src/schemas/auth.schema.ts` for validating register payloads (name, email, password min length) and login credentials.
3. **Password Hashing & JWT Signing:** `src/services/auth.service.ts` using `bcryptjs` (salt rounds: 12) for secure password hashing/comparison, and `jsonwebtoken` for issuing signed JWT access tokens (`JWT_EXPIRES_IN=7d`).
4. **JWT Auth Guard Middleware:** `src/middleware/auth.ts` to extract `Authorization: Bearer <token>`, verify tokens, and attach `req.user` payload to incoming request contexts.
5. **Auth Controller & Routes:** `src/controllers/auth.controller.ts` and `src/routes/auth.routes.ts` mounted at `/api/auth`.

---

## Verification Test Runs & Output Logs

### 1. User Registration (`POST /api/auth/register`)
```bash
curl -s -X POST -H "Content-Type: application/json" -d '{"name": "Alice Cooper", "email": "alice@example.com", "password": "securepassword123", "phone": "9876543210"}' http://localhost:5005/api/auth/register
```
* **Output:** User created successfully with `role: CUSTOMER` and returned signed JWT token.

### 2. Duplicate Registration Rejection
```bash
curl -s -X POST -H "Content-Type: application/json" -d '{"name": "Alice Cooper", "email": "alice@example.com", "password": "securepassword123"}' http://localhost:5005/api/auth/register
```
* **Output:** Returned `{"status":"error","message":"Email address is already registered"}` with HTTP 400 status.

### 3. User Login (`POST /api/auth/login`)
```bash
curl -s -X POST -H "Content-Type: application/json" -d '{"email": "alice@example.com", "password": "securepassword123"}' http://localhost:5005/api/auth/login
```
* **Output:** Returned `{"status":"success","message":"Login successful","data":{ user: {...}, token: "..." }}`.

### 4. Protected Route Unauthorized Rejection (`GET /api/auth/me` without Token)
```bash
curl -s http://localhost:5005/api/auth/me
```
* **Output:** Returned `{"status":"error","message":"Authentication token missing or invalid format (Bearer token required)"}` with HTTP 401 status.

### 5. Protected Route Authenticated Access (`GET /api/auth/me` with Bearer Token)
```bash
curl -s -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:5005/api/auth/me
```
* **Output:** Returned user profile `{"status":"success","data":{"id":1,"name":"Alice Cooper","email":"alice@example.com","role":"CUSTOMER"}}`.




