import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial products data...');

  // Clean existing products table
  await prisma.product.deleteMany({});

  const products = [
    {
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Over-ear Bluetooth headphones with active noise cancellation, 30-hour battery life, and premium sound profile.',
      price: 4999.00,
      category: 'Electronics',
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    },
    {
      name: 'Mechanical RGB Gaming Keyboard',
      description: 'Tactile mechanical keyboard with customizable RGB backlighting, anti-ghosting keys, and durable aluminum frame.',
      price: 2999.00,
      category: 'Electronics',
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80',
    },
    {
      name: 'Ergonomic Wireless Mouse',
      description: 'Precision optical sensor, dual-mode connectivity (Bluetooth/2.4GHz), and ergonomic thumb rest for all-day comfort.',
      price: 1499.00,
      category: 'Electronics',
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
    },
    {
      name: '34" Ultra-Wide Curved Monitor',
      description: 'WQHD 144Hz curved display with HDR10 support, 1ms response time, and sRGB 99% color accuracy.',
      price: 24999.00,
      category: 'Electronics',
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    },
    {
      name: 'Smart Fitness Tracker Watch',
      description: 'Water-resistant smartwatch featuring continuous heart rate tracking, sleep monitoring, and multi-sport tracking.',
      price: 3499.00,
      category: 'Wearables',
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    },
    {
      name: 'Minimalist Leather Laptop Sleeve',
      description: 'Handcrafted genuine leather sleeve with soft microfiber lining designed for 14-inch and 16-inch laptops.',
      price: 1999.00,
      category: 'Accessories',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80',
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Successfully seeded ${products.length} products!`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
