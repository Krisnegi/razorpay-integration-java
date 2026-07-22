import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products database with 55 catalog items...');

  // Delete dependent rows to avoid FK violations
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});

  const productsData = [
    // --- Electronics (15 Items) ---
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
      name: '34" Ultra-Wide Curved Gaming Monitor',
      description: 'WQHD 144Hz curved display with HDR10 support, 1ms response time, and sRGB 99% color accuracy.',
      price: 24999.00,
      category: 'Electronics',
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    },
    {
      name: '4K Ultra HD Streaming Camera WebCam',
      description: 'Ultra 4K resolution webcam with auto-focus, dual omnidirectional microphones, and privacy shutter.',
      price: 6499.00,
      category: 'Electronics',
      stock: 28,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    },
    {
      name: 'High-Fidelity Studio Monitor Speakers',
      description: 'Active 2-way studio reference monitors with bi-amplified 50W output for audio producers.',
      price: 12999.00,
      category: 'Electronics',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80',
    },
    {
      name: 'Portable USB-C Dual Monitor Docking Station',
      description: '12-in-1 USB-C hub supporting dual 4K HDMI, 100W Power Delivery, Gigabit Ethernet, and SD card reader.',
      price: 4299.00,
      category: 'Electronics',
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
    },
    {
      name: 'Compact Portable Bluetooth Speaker',
      description: 'IPX7 waterproof wireless speaker with 360-degree bass sound and 12-hour playtime.',
      price: 2199.00,
      category: 'Electronics',
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
    },
    {
      name: 'Wireless Charging Desk Pad',
      description: 'Premium felt desk mat with integrated 15W Qi fast wireless phone charging pad.',
      price: 1799.00,
      category: 'Electronics',
      stock: 55,
      imageUrl: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500&q=80',
    },
    {
      name: 'Professional USB Condenser Podcast Microphone',
      description: 'Cardioid studio condenser microphone with zero-latency monitoring and heavy-duty boom arm stand.',
      price: 5499.00,
      category: 'Electronics',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    },
    {
      name: 'Thunderbolt 4 High-Speed External SSD 1TB',
      description: 'Ultra-fast NVMe portable solid state drive with up to 2800MB/s transfer speeds and rugged enclosure.',
      price: 9999.00,
      category: 'Electronics',
      stock: 22,
      imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80',
    },
    {
      name: 'Wireless Noise-Canceling Earbuds Pro',
      description: 'True wireless in-ear earbuds with Active Noise Cancellation, transparency mode, and wireless charging case.',
      price: 7999.00,
      category: 'Electronics',
      stock: 65,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    },
    {
      name: 'High-Precision Graphic Drawing Tablet',
      description: '10x6 inch digital pen tablet with 8192 levels of pressure sensitivity for digital artists.',
      price: 4799.00,
      category: 'Electronics',
      stock: 18,
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80',
    },
    {
      name: 'Smart WiFi Power Strip with Surge Protector',
      description: 'Voice controlled smart power strip with 4 independent AC outlets and 4 USB ports.',
      price: 1599.00,
      category: 'Electronics',
      stock: 90,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    },
    {
      name: 'Dual-Band Wi-Fi 6 Router',
      description: 'Next-gen AX3000 gigabit WiFi 6 router with low latency gaming mode and broad coverage antennas.',
      price: 4999.00,
      category: 'Electronics',
      stock: 32,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    },

    // --- Wearables (14 Items) ---
    {
      name: 'Smart Fitness Tracker Watch',
      description: 'Water-resistant smartwatch featuring continuous heart rate tracking, sleep monitoring, and multi-sport tracking.',
      price: 3499.00,
      category: 'Wearables',
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    },
    {
      name: 'Ultra Fitness Smartwatch with GPS',
      description: 'Rugged titanium case smartwatch with dual-frequency GPS, depth gauge, and 36-hour battery life.',
      price: 18999.00,
      category: 'Wearables',
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80',
    },
    {
      name: 'Smart Health Monitoring Ring',
      description: 'Lightweight titanium smart ring tracking sleep stages, readiness score, heart rate variability, and temperature.',
      price: 14999.00,
      category: 'Wearables',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
    },
    {
      name: 'Smart Audio Glasses with Polarized Lenses',
      description: 'Open-ear Bluetooth audio sunglasses with UV protection and crystal clear micro speakers.',
      price: 8999.00,
      category: 'Wearables',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
    },
    {
      name: 'Minimalist Hybrid Smart Analog Watch',
      description: 'Classic stainless steel analog watch dial with hidden OLED notification display and heart rate sensor.',
      price: 9999.00,
      category: 'Wearables',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80',
    },
    {
      name: 'Advanced Sleep & Recovery Wristband',
      description: 'Screenless continuous biometric tracker monitoring strain, recovery, and sleep efficiency.',
      price: 7499.00,
      category: 'Wearables',
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80',
    },
    {
      name: 'Breathable Sport Band for Smartwatches',
      description: 'Soft, lightweight, and breathable nylon loop band compatible with standard 20mm smartwatch lugs.',
      price: 799.00,
      category: 'Wearables',
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80',
    },
    {
      name: 'Kids GPS Tracking Smartwatch',
      description: 'Safety watch for kids with 4G video calling, GPS location tracking, SOS button, and geofencing.',
      price: 3999.00,
      category: 'Wearables',
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80',
    },
    {
      name: 'Stainless Steel Mesh Watch Strap',
      description: 'Milanese loop magnetic stainless steel strap for formal and daily wear.',
      price: 1299.00,
      category: 'Wearables',
      stock: 85,
      imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80',
    },
    {
      name: 'Active Fitness Heart Rate Chest Strap',
      description: 'High precision ANT+ and Bluetooth chest strap monitor for accurate heart rate tracking during workouts.',
      price: 2999.00,
      category: 'Wearables',
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=500&q=80',
    },
    {
      name: 'Retro Digital Alarm Chronograph Watch',
      description: 'Vintage style gold-plated stainless steel digital watch with stopwatch and backlight.',
      price: 2499.00,
      category: 'Wearables',
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80',
    },
    {
      name: 'Smart Thermometer Patch for Health',
      description: 'Continuous wearable temperature monitoring patch sending real-time fever alerts to phone.',
      price: 1999.00,
      category: 'Wearables',
      stock: 75,
      imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80',
    },
    {
      name: 'Genuine Italian Leather Watch Band',
      description: 'Quick-release handcrafted calfskin leather replacement watch band.',
      price: 1599.00,
      category: 'Wearables',
      stock: 70,
      imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80',
    },
    {
      name: 'Waterproof Swimming Smart Activity Tracker',
      description: '50m water-resistant swimming band tracking stroke count, SWOLF score, and laps.',
      price: 3299.00,
      category: 'Wearables',
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80',
    },

    // --- Accessories (14 Items) ---
    {
      name: 'Minimalist Leather Laptop Sleeve',
      description: 'Handcrafted genuine leather sleeve with soft microfiber lining designed for 14-inch and 16-inch laptops.',
      price: 1999.00,
      category: 'Accessories',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80',
    },
    {
      name: 'Stainless Steel Vacuum Insulated Bottle 750ml',
      description: 'Double-wall insulated flask keeping drinks ice cold for 24h and hot for 12h. Leak-proof lid.',
      price: 899.00,
      category: 'Accessories',
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
    },
    {
      name: 'Water-Resistant Tech Travel Organizer Case',
      description: 'Hard-shell electronic cable organizer bag for chargers, power banks, cables, and hard drives.',
      price: 1299.00,
      category: 'Accessories',
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    },
    {
      name: 'Ergonomic Aluminum Laptop Stand',
      description: 'Foldable ventilated aluminum riser elevating laptop screen to eye level for posture relief.',
      price: 1499.00,
      category: 'Accessories',
      stock: 90,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
    },
    {
      name: 'Magnetic MagSafe Leather Card Wallet',
      description: 'Slim genuine leather wallet holding up to 3 credit cards with strong magnetic snap onto phone.',
      price: 999.00,
      category: 'Accessories',
      stock: 110,
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
    },
    {
      name: 'Anti-Theft Commuter Laptop Backpack 15.6"',
      description: 'Durable water-repellent bag featuring hidden zippers, RFID blocking pockets, and USB charge port.',
      price: 2799.00,
      category: 'Accessories',
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    },
    {
      name: 'Ultra-Fast 65W GaN Dual USB-C Wall Charger',
      description: 'Compact Gallium Nitride fast charger for laptops, tablets, and smartphones simultaneously.',
      price: 1899.00,
      category: 'Accessories',
      stock: 95,
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80',
    },
    {
      name: 'Braided Magnetic Cable Organizer Clips (6 Pack)',
      description: 'Silicone cord holder clips keeping desk cables organized and clutter-free.',
      price: 499.00,
      category: 'Accessories',
      stock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80',
    },
    {
      name: 'Blue Light Blocking Computer Gaming Glasses',
      description: 'TR90 lightweight glasses filtering 90% harmful blue light from monitors to reduce eye strain.',
      price: 1199.00,
      category: 'Accessories',
      stock: 70,
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
    },
    {
      name: 'Adjustable Smartphone & Tablet Desk Mount',
      description: 'Heavy duty aluminum desktop holder with 360 rotation for video calls and streaming.',
      price: 899.00,
      category: 'Accessories',
      stock: 85,
      imageUrl: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500&q=80',
    },
    {
      name: 'Microfiber Screen Cleaning Spray Kit',
      description: 'Alcohol-free screen cleaner with microfiber cloth for TVs, monitors, and laptops.',
      price: 399.00,
      category: 'Accessories',
      stock: 200,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    },
    {
      name: 'Memory Foam Mechanical Keyboard Wrist Rest',
      description: 'Ergonomic soft memory foam wrist support pad relieving typing fatigue.',
      price: 699.00,
      category: 'Accessories',
      stock: 110,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    },
    {
      name: '10,000mAh Magnetic Wireless Power Bank',
      description: 'Slim portable charger with MagSafe snap-on charging and pass-through power.',
      price: 2499.00,
      category: 'Accessories',
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1609592424074-2798f0907ca2?w=500&q=80',
    },
    {
      name: 'Full Desk XXL Stitched Edge Mouse Pad',
      description: 'Large 900x400mm anti-slip rubber base gaming desk mat with water-resistant coating.',
      price: 1099.00,
      category: 'Accessories',
      stock: 130,
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
    },

    // --- Audio & Gaming (12 Items) ---
    {
      name: '7.1 Surround Sound Gaming Headset',
      description: 'Immersive spatial 7.1 audio headset with noise-canceling detachable mic and memory foam earcups.',
      price: 3999.00,
      category: 'Electronics',
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
    },
    {
      name: 'Custom Wireless Gaming Controller',
      description: 'Low-latency Bluetooth game controller with rear paddle buttons and adjustable haptic feedback triggers.',
      price: 4499.00,
      category: 'Electronics',
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&q=80',
    },
    {
      name: 'RGB Headphone Stand with Dual USB Hub',
      description: 'Sleek headphone hanger with 9 dynamic lighting modes and built-in USB pass-through ports.',
      price: 1299.00,
      category: 'Accessories',
      stock: 65,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
    },
    {
      name: 'Hi-Res Audiophile Open-Back Headphones',
      description: 'Reference headphones delivering natural, transparent sound with velour ear cushions.',
      price: 15999.00,
      category: 'Electronics',
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    },
    {
      name: 'Streamer Green Screen Collapsible Panel',
      description: 'Chroma key green screen background for video recording and twitch broadcasting.',
      price: 4999.00,
      category: 'Accessories',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    },
    {
      name: 'RGB LED Smart Key Light Panel',
      description: 'App-controlled Wi-Fi key light panel with adjustable color temperature for desk streaming.',
      price: 5999.00,
      category: 'Electronics',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
    },
    {
      name: 'Custom PBT Dye-Sub Keycap Set (128 Keys)',
      description: 'Thick PBT keycaps with cherry profile compatible with standard MX switches.',
      price: 1899.00,
      category: 'Accessories',
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80',
    },
    {
      name: 'Dual Wireless Lavalier Lapel Microphone',
      description: 'Plug-and-play wireless lapel mic for iPhones and Type-C phones for clear vlog audio.',
      price: 2699.00,
      category: 'Electronics',
      stock: 55,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    },
    {
      name: 'Soundproof Acoustic Foam Panels (12 Pack)',
      description: 'High-density sound dampening foam tiles for home studio dampening and echo control.',
      price: 1499.00,
      category: 'Accessories',
      stock: 70,
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80',
    },
    {
      name: 'Ultra Lightweight Lightweight Honeycomb Gaming Mouse',
      description: '60g ultra-light honeycomb shell gaming mouse with 16,000 DPI sensor and paracord cable.',
      price: 2199.00,
      category: 'Electronics',
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
    },
    {
      name: 'Stereo Audio Mixer & Sound Card Console',
      description: 'All-in-one audio mixing interface with voice changer effects and XLR microphone inputs.',
      price: 6999.00,
      category: 'Electronics',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80',
    },
    {
      name: 'Portable Mini Bluetooth DAC Headphone Amplifier',
      description: 'High resolution wireless DAC and headphone amplifier boosting mobile audio quality.',
      price: 5299.00,
      category: 'Electronics',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
    },
  ];

  for (const product of productsData) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Successfully seeded ${productsData.length} products to database!`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
