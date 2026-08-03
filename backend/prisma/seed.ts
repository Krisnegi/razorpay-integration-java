import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Check if database is already seeded
  const productCount = await prisma.product.count();
  if (productCount > 0) {
    console.log(`ℹ️ Products database already contains ${productCount} items. Skipping seed to prevent overriding live data.`);
    return;
  }

  console.log('🌱 Seeding products database with 55 catalog items...');

  // Delete dependent rows to avoid FK violations (only executes when DB is fresh/empty)
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
      name: '1080p Web Camera with Mic',
      description: 'Full HD video calls, dual noise-reducing microphones, auto light correction, and privacy shutter for secure calls.',
      price: 1999.00,
      category: 'Electronics',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1603184017968-902045e753d4?w=500&q=80',
    },
    {
      name: 'USB Condenser Microphone',
      description: 'Studio-quality cardioid recording mic with tap-to-mute sensor, LED indicator, and pop filter for streaming and podcasts.',
      price: 3499.00,
      category: 'Electronics',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1590608897129-79da98d15969?w=500&q=80',
    },
    {
      name: 'Active Noise-Canceling Earbuds',
      description: 'True wireless in-ear buds with hybrid ANC, touch controls, IPX5 water resistance, and 24-hour playback with case.',
      price: 2499.00,
      category: 'Electronics',
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    },
    {
      name: 'Portable Bluetooth 5.0 Speaker',
      description: 'Waterproof IPX7 outdoor speaker with 360-degree stereo sound, deep bass, and 20-hour continuous play time.',
      price: 1799.00,
      category: 'Electronics',
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
    },
    {
      name: 'Dual-Band Wi-Fi 6 Router',
      description: 'Next-gen gigabit router with MU-MIMO, beamforming, OFDMA technology, and parental control profiles.',
      price: 3999.00,
      category: 'Electronics',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    },
    {
      name: 'Fast Charging 20000mAh Power Bank',
      description: '22.5W Power Delivery, triple output ports (USB-C/USB-A), and LED digital display showing exact battery percentage.',
      price: 1299.00,
      category: 'Electronics',
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=500&q=80',
    },
    {
      name: 'HDMI 2.1 Cable 10ft',
      description: 'Supports 8K @ 60Hz and 4K @ 120Hz resolutions, 48Gbps bandwidth, dynamic HDR, and gold-plated connectors.',
      price: 499.00,
      category: 'Electronics',
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1557002665-c552e183c483?w=500&q=80',
    },
    {
      name: 'Adjustable Metal Laptop Stand',
      description: 'Aluminum heat dissipation riser, foldable design with multi-angle height adjustments, and silicone anti-slip pads.',
      price: 999.00,
      category: 'Electronics',
      stock: 75,
      imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&q=80',
    },
    {
      name: 'External 1TB Portable SSD',
      description: 'Superfast read/write speeds up to 1050MB/s, USB 3.2 Gen 2 connectivity, drop-resistant metal casing.',
      price: 6999.00,
      category: 'Electronics',
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1543165796-5426273eaab3?w=500&q=80',
    },
    {
      name: 'Multi-Device Wireless Keyboard',
      description: 'Compact membrane keys, pair up to 3 devices simultaneously via Bluetooth, and integrated smartphone cradle.',
      price: 1999.00,
      category: 'Electronics',
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    },
    {
      name: 'Smart RGB LED Desk Lamp',
      description: 'App and voice-controlled dimmable task light, eye-friendly diffusion panel, and built-in Qi wireless charger pad.',
      price: 2499.00,
      category: 'Electronics',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
    },

    // --- Footwear (10 Items) ---
    {
      name: 'Mesh Cushion Running Shoes',
      description: 'Breathable lightweight knit mesh, high-elastic cushioning sole, and anti-slip rubber traction for intense workouts.',
      price: 1999.00,
      category: 'Footwear',
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    },
    {
      name: 'Classic White Leather Sneakers',
      description: 'Premium vegan leather upper, minimal low-top design, and padded collar for lifestyle street wear styling.',
      price: 2499.00,
      category: 'Footwear',
      stock: 55,
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80',
    },
    {
      name: 'Waterproof Trail Hiking Boots',
      description: 'Seam-sealed breathable waterproof membrane, ankle support padding, and aggressive multi-directional lug outsole.',
      price: 3499.00,
      category: 'Footwear',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&q=80',
    },
    {
      name: 'Ergonomic Slides Sandal',
      description: 'Super soft EVA compression recovery footbed, textured non-slip sole, and quick-drying athletic design.',
      price: 599.00,
      category: 'Footwear',
      stock: 90,
      imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80',
    },
    {
      name: 'Formal Leather Oxford Shoes',
      description: 'Polished genuine leather dress shoes, classic lace-up design, with durable rubber heel caps for office wear.',
      price: 2999.00,
      category: 'Footwear',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1486308512493-ae6a1e536278?w=500&q=80',
    },
    {
      name: 'Canvas Casual Loafers',
      description: 'Slip-on canvas shoes with elastic side accents, memory foam insoles, and lightweight vulcanized outsoles.',
      price: 1199.00,
      category: 'Footwear',
      stock: 65,
      imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80',
    },
    {
      name: 'Comfort Memory Foam Slippers',
      description: 'Plush fleece lining, high-density memory foam padding, and durable indoor/outdoor hard rubber sole.',
      price: 799.00,
      category: 'Footwear',
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
    },
    {
      name: 'High-Top Basketball Shoes',
      description: 'Excellent ankle lock support, responsive bounce midsole cushioning, and herringbone pattern grip for courts.',
      price: 3999.00,
      category: 'Footwear',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500&q=80',
    },
    {
      name: 'Suede Chelsea Boots',
      description: 'Elegant round-toe boots with elastic side panels, genuine suede finish, and tab pull loops at the collar.',
      price: 3299.00,
      category: 'Footwear',
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80',
    },
    {
      name: 'Breathable Training Trainers',
      description: 'Optimized flat heel base for lifting stability, cross-training side supports, and breathable engineered knit.',
      price: 2199.00,
      category: 'Footwear',
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80',
    },

    // --- Clothing (15 Items) ---
    {
      name: 'Cotton Athletic Crewneck Tee',
      description: 'Pre-shrunk 100% organic cotton lifestyle t-shirt, athletic fit, with robust double-stitched collar seams.',
      price: 499.00,
      category: 'Clothing',
      stock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
    },
    {
      name: 'Stretch Tapered Fit Jeans',
      description: 'Classic 5-pocket denim design with comfort stretch elastane, tapered leg cut, and metal zipper fly.',
      price: 1499.00,
      category: 'Clothing',
      stock: 75,
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80',
    },
    {
      name: 'Fleece Heavyweight Pullover Hoodie',
      description: 'Premium thick cotton-fleece blend, kangaroo front pouch, and double-lined adjustable drawcord hood.',
      price: 1299.00,
      category: 'Clothing',
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80',
    },
    {
      name: 'Quick-Dry Gym Training Shorts',
      description: 'Sweat-wicking performance fabric, built-in compression liner, zipper phone pockets, and elastic waist.',
      price: 699.00,
      category: 'Clothing',
      stock: 110,
      imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80',
    },
    {
      name: 'Windbreaker Hooded Jacket',
      description: 'Water-resistant ripstop nylon shell, lightweight mesh lining, zippered hand pockets, and elastic cuffs.',
      price: 1899.00,
      category: 'Clothing',
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80',
    },
    {
      name: 'Slim Fit Oxford Button-Down',
      description: 'Woven durable cotton oxford weave, structured collar, and adjustable cuffs for smart casual styling.',
      price: 999.00,
      category: 'Clothing',
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80',
    },
    {
      name: 'Cuffed Fleece Jogger Pants',
      description: 'Super-soft interior brushing, secure zipper side storage, rib-knit cuffed ankles, and drawstring waist.',
      price: 899.00,
      category: 'Clothing',
      stock: 70,
      imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80',
    },
    {
      name: 'Seamless High-Waist Yoga Leggings',
      description: 'Squat-proof 4-way stretch fabric, wide compression waistband, with moisture-wicking cooling comfort.',
      price: 1199.00,
      category: 'Clothing',
      stock: 65,
      imageUrl: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500&q=80',
    },
    {
      name: 'Knit Ribbed Winter Beanie',
      description: 'Thick warm acrylic cable knit, fold-over brim detail, stretch fit design to lock out winter winds.',
      price: 299.00,
      category: 'Clothing',
      stock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=500&q=80',
    },
    {
      name: 'Polyester Sports Compression Top',
      description: 'Ultra-tight second-skin fit, flatlock anti-chafing seams, with mesh underarm zones for ventilation.',
      price: 599.00,
      category: 'Clothing',
      stock: 95,
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80',
    },
    {
      name: 'Casual Checkered Flannel Shirt',
      description: 'Double-brushed flannel cotton fabric, button chest pockets, relaxed fit style for layering looks.',
      price: 1199.00,
      category: 'Clothing',
      stock: 55,
      imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80',
    },
    {
      name: 'Puffer Down Winter Vest',
      description: 'Synthetic thermal fill insulation, zippered stand-up collar, water-repellent shell with internal storage.',
      price: 2499.00,
      category: 'Clothing',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80',
    },
    {
      name: 'Pique Cotton Polo Shirt',
      description: 'Textured breathable pique weave, two-button placket, with rib-knit collar and band sleeves.',
      price: 799.00,
      category: 'Clothing',
      stock: 85,
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80',
    },
    {
      name: 'Athletic Quarter Socks 3-Pack',
      description: 'Comfort arch support bands, ventilated mesh insteps, and reinforced impact heel/toe cushions.',
      price: 349.00,
      category: 'Clothing',
      stock: 200,
      imageUrl: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500&q=80',
    },
    {
      name: 'Waterproof Utility Raincoat',
      description: 'Full-length zip and snap closure, adjustable storm hood, with dual front utility flap pockets.',
      price: 2799.00,
      category: 'Clothing',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80',
    },

    // --- Accessories (15 Items) ---
    {
      name: 'Minimalist Slim Leather Wallet',
      description: 'Top-grain genuine leather cardholder with RFID shielding, holds 6 cards plus convenient cash strap.',
      price: 899.00,
      category: 'Accessories',
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
    },
    {
      name: 'Polarized Sport Sunglasses',
      description: 'UVA/UVB 100% protection lenses, lightweight TR90 impact-resistant frames, with secure rubber grip temple pads.',
      price: 1199.00,
      category: 'Accessories',
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
    },
    {
      name: 'Stainless Steel Water Bottle 32oz',
      description: 'Double-wall vacuum insulation, keeps drinks cold 24h/hot 12h, with leakproof straw cap lid.',
      price: 999.00,
      category: 'Accessories',
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
    },
    {
      name: 'Water-Resistant Laptop Backpack',
      description: 'Dedicated padded compartment for 15.6" laptops, USB pass-through port, and anti-theft back pocket.',
      price: 2499.00,
      category: 'Accessories',
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    },
    {
      name: 'Vintage Canvas Messenger Bag',
      description: 'Sturdy pre-washed canvas canvas with genuine leather trim accents, large inner storage compartment.',
      price: 1999.00,
      category: 'Accessories',
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80',
    },
    {
      name: 'Matte Finish RFID Key Organizer',
      description: 'Sleek carbon fiber layout holding up to 10 keys in silent stack, eliminates noisy key rings.',
      price: 699.00,
      category: 'Accessories',
      stock: 90,
      imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&q=80',
    },
    {
      name: 'Leather Belt with Automatic Buckle',
      description: 'Comfort micro-adjust sliding ratchets, no-hole belt strip design, with easy release click lever.',
      price: 799.00,
      category: 'Accessories',
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?w=500&q=80',
    },
    {
      name: 'Travel Neck Pillow and Eye Mask',
      description: 'Responsive memory foam neck support contouring, with zero eye-pressure contoured blackout mask.',
      price: 899.00,
      category: 'Accessories',
      stock: 110,
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80',
    },
    {
      name: 'Grid Design Electronics Organizer',
      description: 'Semi-flexible double compartment pouch with elastic bands, holds chargers, cables, and SD cards.',
      price: 599.00,
      category: 'Accessories',
      stock: 85,
      imageUrl: 'https://images.unsplash.com/photo-1540759786422-c60d5ecd5633?w=500&q=80',
    },
    {
      name: 'Anti-Slip TPE Exercise Yoga Mat',
      description: 'Double-sided textured grip patterns, 1/4" joint cushion density, with quick-carry loop harness strap.',
      price: 1499.00,
      category: 'Accessories',
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&q=80',
    },
    {
      name: 'Compact Windproof Travel Umbrella',
      description: 'Failsafe double canopy wind-deflecting vents, one-touch automatic deploy/retract button.',
      price: 899.00,
      category: 'Accessories',
      stock: 95,
      imageUrl: 'https://images.unsplash.com/photo-1527786356703-4b100091cd50?w=500&q=80',
    },
    {
      name: 'Microfiber Super Absorbent Towel',
      description: 'Fast-drying lightweight sport towel with snap loop hanger, folds ultra-small for fitness gym use.',
      price: 499.00,
      category: 'Accessories',
      stock: 130,
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80',
    },
    {
      name: 'TSA Approved 3-Dial Cable Lock',
      description: 'Flexible woven steel loop fits multiple luggage zippers, heavy-duty alloy body casing design.',
      price: 399.00,
      category: 'Accessories',
      stock: 140,
      imageUrl: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=500&q=80',
    },
    {
      name: 'Ultralight Nylon Packable Daypack',
      description: 'Strong tear-resistant ripstop material, packs down into its internal pocket for space saving.',
      price: 1199.00,
      category: 'Accessories',
      stock: 55,
      imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=500&q=80',
    },
    {
      name: 'Durable Luggage Identifier Tag',
      description: 'Flexible silicone band straps, secure internal address label sleeves, with bright distinct colors.',
      price: 249.00,
      category: 'Accessories',
      stock: 180,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    },
  ];

  console.log(`Clearing and seeding ${productsData.length} products...`);

  for (const p of productsData) {
    await prisma.product.create({
      data: p,
    });
  }

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
