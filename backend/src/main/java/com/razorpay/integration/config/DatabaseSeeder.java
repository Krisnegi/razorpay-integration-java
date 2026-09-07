package com.razorpay.integration.config;

import com.razorpay.integration.model.Product;
import com.razorpay.integration.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        long count = productRepository.count();
        if (count > 0) {
            log.info("ℹ️ Products database already contains {} items. Skipping seed.", count);
            return;
        }

        log.info("🌱 Seeding products database with 55 catalog items...");

        List<Product> seedProducts = List.of(
                // Electronics (15 Items)
                p("Wireless Noise-Canceling Headphones", "Over-ear Bluetooth headphones with active noise cancellation, 30-hour battery life, and premium sound profile.", 4999.00, "Electronics", 35, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"),
                p("Mechanical RGB Gaming Keyboard", "Tactile mechanical keyboard with customizable RGB backlighting, anti-ghosting keys, and durable aluminum frame.", 2999.00, "Electronics", 50, "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80"),
                p("Ergonomic Wireless Mouse", "Precision optical sensor, dual-mode connectivity (Bluetooth/2.4GHz), and ergonomic thumb rest for all-day comfort.", 1499.00, "Electronics", 40, "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80"),
                p("34\" Ultra-Wide Curved Gaming Monitor", "WQHD 144Hz curved display with HDR10 support, 1ms response time, and sRGB 99% color accuracy.", 24999.00, "Electronics", 15, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"),
                p("1080p Web Camera with Mic", "Full HD video calls, dual noise-reducing microphones, auto light correction, and privacy shutter for secure calls.", 1999.00, "Electronics", 30, "https://images.unsplash.com/photo-1603184017968-902045e753d4?w=500&q=80"),
                p("USB Condenser Microphone", "Studio-quality cardioid recording mic with tap-to-mute sensor, LED indicator, and pop filter for streaming and podcasts.", 3499.00, "Electronics", 25, "https://images.unsplash.com/photo-1590608897129-79da98d15969?w=500&q=80"),
                p("Active Noise-Canceling Earbuds", "True wireless in-ear buds with hybrid ANC, touch controls, IPX5 water resistance, and 24-hour playback with case.", 2499.00, "Electronics", 45, "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80"),
                p("Portable Bluetooth 5.0 Speaker", "Waterproof IPX7 outdoor speaker with 360-degree stereo sound, deep bass, and 20-hour continuous play time.", 1799.00, "Electronics", 60, "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"),
                p("Dual-Band Wi-Fi 6 Router", "Next-gen gigabit router with MU-MIMO, beamforming, OFDMA technology, and parental control profiles.", 3999.00, "Electronics", 20, "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80"),
                p("Fast Charging 20000mAh Power Bank", "22.5W Power Delivery, triple output ports (USB-C/USB-A), and LED digital display showing exact battery percentage.", 1299.00, "Electronics", 80, "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=500&q=80"),
                p("HDMI 2.1 Cable 10ft", "Supports 8K @ 60Hz and 4K @ 120Hz resolutions, 48Gbps bandwidth, dynamic HDR, and gold-plated connectors.", 499.00, "Electronics", 120, "https://images.unsplash.com/photo-1557002665-c552e183c483?w=500&q=80"),
                p("Adjustable Metal Laptop Stand", "Aluminum heat dissipation riser, foldable design with multi-angle height adjustments, and silicone anti-slip pads.", 999.00, "Electronics", 75, "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&q=80"),
                p("External 1TB Portable SSD", "Superfast read/write speeds up to 1050MB/s, USB 3.2 Gen 2 connectivity, drop-resistant metal casing.", 6999.00, "Electronics", 35, "https://images.unsplash.com/photo-1543165796-5426273eaab3?w=500&q=80"),
                p("Multi-Device Wireless Keyboard", "Compact membrane keys, pair up to 3 devices simultaneously via Bluetooth, and integrated smartphone cradle.", 1999.00, "Electronics", 40, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80"),
                p("Smart RGB LED Desk Lamp", "App and voice-controlled dimmable task light, eye-friendly diffusion panel, and built-in Qi wireless charger pad.", 2499.00, "Electronics", 30, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80"),

                // Footwear (10 Items)
                p("Mesh Cushion Running Shoes", "Breathable lightweight knit mesh, high-elastic cushioning sole, and anti-slip rubber traction for intense workouts.", 1999.00, "Footwear", 45, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"),
                p("Classic White Leather Sneakers", "Premium vegan leather upper, minimal low-top design, and padded collar for lifestyle street wear styling.", 2499.00, "Footwear", 55, "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80"),
                p("Waterproof Trail Hiking Boots", "Seam-sealed breathable waterproof membrane, ankle support padding, and aggressive multi-directional lug outsole.", 3499.00, "Footwear", 25, "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&q=80"),
                p("Ergonomic Slides Sandal", "Super soft EVA compression recovery footbed, textured non-slip sole, and quick-drying athletic design.", 599.00, "Footwear", 90, "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80"),
                p("Formal Leather Oxford Shoes", "Polished genuine leather dress shoes, classic lace-up design, with durable rubber heel caps for office wear.", 2999.00, "Footwear", 30, "https://images.unsplash.com/photo-1486308512493-ae6a1e536278?w=500&q=80"),
                p("Canvas Casual Loafers", "Slip-on canvas shoes with elastic side accents, memory foam insoles, and lightweight vulcanized outsoles.", 1199.00, "Footwear", 65, "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80"),
                p("Comfort Memory Foam Slippers", "Plush fleece lining, high-density memory foam padding, and durable indoor/outdoor hard rubber sole.", 799.00, "Footwear", 100, "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80"),
                p("High-Top Basketball Shoes", "Excellent ankle lock support, responsive bounce midsole cushioning, and herringbone pattern grip for courts.", 3999.00, "Footwear", 20, "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500&q=80"),
                p("Suede Chelsea Boots", "Elegant round-toe boots with elastic side panels, genuine suede finish, and tab pull loops at the collar.", 3299.00, "Footwear", 35, "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80"),
                p("Breathable Training Trainers", "Optimized flat heel base for lifting stability, cross-training side supports, and breathable engineered knit.", 2199.00, "Footwear", 40, "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80"),

                // Clothing (15 Items)
                p("Cotton Athletic Crewneck Tee", "Pre-shrunk 100% organic cotton lifestyle t-shirt, athletic fit, with robust double-stitched collar seams.", 499.00, "Clothing", 150, "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80"),
                p("Stretch Tapered Fit Jeans", "Classic 5-pocket denim design with comfort stretch elastane, tapered leg cut, and metal zipper fly.", 1499.00, "Clothing", 75, "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80"),
                p("Fleece Heavyweight Pullover Hoodie", "Premium thick cotton-fleece blend, kangaroo front pouch, and double-lined adjustable drawcord hood.", 1299.00, "Clothing", 60, "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"),
                p("Quick-Dry Gym Training Shorts", "Sweat-wicking performance fabric, built-in compression liner, zipper phone pockets, and elastic waist.", 699.00, "Clothing", 110, "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80"),
                p("Windbreaker Hooded Jacket", "Water-resistant ripstop nylon shell, lightweight mesh lining, zippered hand pockets, and elastic cuffs.", 1899.00, "Clothing", 40, "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80"),
                p("Slim Fit Oxford Button-Down", "Woven durable cotton oxford weave, structured collar, and adjustable cuffs for smart casual styling.", 999.00, "Clothing", 80, "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80"),
                p("Cuffed Fleece Jogger Pants", "Super-soft interior brushing, secure zipper side storage, rib-knit cuffed ankles, and drawstring waist.", 899.00, "Clothing", 70, "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80"),
                p("Seamless High-Waist Yoga Leggings", "Squat-proof 4-way stretch fabric, wide compression waistband, with moisture-wicking cooling comfort.", 1199.00, "Clothing", 65, "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500&q=80"),
                p("Knit Ribbed Winter Beanie", "Thick warm acrylic cable knit, fold-over brim detail, stretch fit design to lock out winter winds.", 299.00, "Clothing", 150, "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=500&q=80"),
                p("Polyester Sports Compression Top", "Ultra-tight second-skin fit, flatlock anti-chafing seams, with mesh underarm zones for ventilation.", 599.00, "Clothing", 95, "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80"),
                p("Casual Checkered Flannel Shirt", "Double-brushed flannel cotton fabric, button chest pockets, relaxed fit style for layering looks.", 1199.00, "Clothing", 55, "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80"),
                p("Puffer Down Winter Vest", "Synthetic thermal fill insulation, zippered stand-up collar, water-repellent shell with internal storage.", 2499.00, "Clothing", 30, "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80"),
                p("Pique Cotton Polo Shirt", "Textured breathable pique weave, two-button placket, with rib-knit collar and band sleeves.", 799.00, "Clothing", 85, "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80"),
                p("Athletic Quarter Socks 3-Pack", "Comfort arch support bands, ventilated mesh insteps, and reinforced impact heel/toe cushions.", 349.00, "Clothing", 200, "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500&q=80"),
                p("Waterproof Utility Raincoat", "Full-length zip and snap closure, adjustable storm hood, with dual front utility flap pockets.", 2799.00, "Clothing", 25, "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80"),

                // Accessories (15 Items)
                p("Minimalist Slim Leather Wallet", "Top-grain genuine leather cardholder with RFID shielding, holds 6 cards plus convenient cash strap.", 899.00, "Accessories", 80, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80"),
                p("Polarized Sport Sunglasses", "UVA/UVB 100% protection lenses, lightweight TR90 impact-resistant frames, with secure rubber grip temple pads.", 1199.00, "Accessories", 50, "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80"),
                p("Stainless Steel Water Bottle 32oz", "Double-wall vacuum insulation, keeps drinks cold 24h/hot 12h, with leakproof straw cap lid.", 999.00, "Accessories", 120, "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80"),
                p("Water-Resistant Laptop Backpack", "Dedicated padded compartment for 15.6\" laptops, USB pass-through port, and anti-theft back pocket.", 2499.00, "Accessories", 45, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"),
                p("Vintage Canvas Messenger Bag", "Sturdy pre-washed canvas canvas with genuine leather trim accents, large inner storage compartment.", 1999.00, "Accessories", 40, "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80"),
                p("Matte Finish RFID Key Organizer", "Sleek carbon fiber layout holding up to 10 keys in silent stack, eliminates noisy key rings.", 699.00, "Accessories", 90, "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&q=80"),
                p("Leather Belt with Automatic Buckle", "Comfort micro-adjust sliding ratchets, no-hole belt strip design, with easy release click lever.", 799.00, "Accessories", 100, "https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?w=500&q=80"),
                p("Travel Neck Pillow and Eye Mask", "Responsive memory foam neck support contouring, with zero eye-pressure contoured blackout mask.", 899.00, "Accessories", 110, "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80"),
                p("Grid Design Electronics Organizer", "Semi-flexible double compartment pouch with elastic bands, holds chargers, cables, and SD cards.", 599.00, "Accessories", 85, "https://images.unsplash.com/photo-1540759786422-c60d5ecd5633?w=500&q=80"),
                p("Anti-Slip TPE Exercise Yoga Mat", "Double-sided textured grip patterns, 1/4\" joint cushion density, with quick-carry loop harness strap.", 1499.00, "Accessories", 60, "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&q=80"),
                p("Compact Windproof Travel Umbrella", "Failsafe double canopy wind-deflecting vents, one-touch automatic deploy/retract button.", 899.00, "Accessories", 95, "https://images.unsplash.com/photo-1527786356703-4b100091cd50?w=500&q=80"),
                p("Microfiber Super Absorbent Towel", "Fast-drying lightweight sport towel with snap loop hanger, folds ultra-small for fitness gym use.", 499.00, "Accessories", 130, "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80"),
                p("TSA Approved 3-Dial Cable Lock", "Flexible woven steel loop fits multiple luggage zippers, heavy-duty alloy body casing design.", 399.00, "Accessories", 140, "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=500&q=80"),
                p("Ultralight Nylon Packable Daypack", "Strong tear-resistant ripstop material, packs down into its internal pocket for space saving.", 1199.00, "Accessories", 55, "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=500&q=80"),
                p("Durable Luggage Identifier Tag", "Flexible silicone band straps, secure internal address label sleeves, with bright distinct colors.", 249.00, "Accessories", 180, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80")
        );

        productRepository.saveAll(seedProducts);
        log.info("🎉 Seeding successfully completed with {} products!", seedProducts.size());
    }

    private Product p(String name, String description, double price, String category, int stock, String imageUrl) {
        return Product.builder()
                .name(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .category(category)
                .stock(stock)
                .imageUrl(imageUrl)
                .build();
    }
}
