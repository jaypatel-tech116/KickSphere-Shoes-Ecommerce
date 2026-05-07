import logger from './config/logger.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './model/product-model.js';
import User from './model/user-model.js';
import Order from './model/order-model.js';

dotenv.config();

const products = [
  // SNEAKERS
  { name: 'Air Jordan 1 Retro High OG', brand: 'Nike', price: 15995, category: 'Men', subcategory: 'Sneakers', description: 'The legendary Air Jordan 1 Retro High OG returns with classic color-blocking and premium materials.', material: 'Leather', sole: 'Rubber Cupsole', closure: 'Lace-up' },
  { name: 'Yeezy Boost 350 V2', brand: 'Adidas', price: 22999, category: 'Unisex', subcategory: 'Sneakers', description: 'Featuring a Primeknit upper and signature Boost cushioning for ultimate comfort and style.', material: 'Primeknit', sole: 'Boost Technology', closure: 'Lace-up' },
  { name: 'Air Force 1 \'07', brand: 'Nike', price: 7495, category: 'Men', subcategory: 'Sneakers', description: 'The radiance lives on in the Nike Air Force 1 \'07, the b-ball icon that puts a fresh spin on what you know best.', material: 'Leather', sole: 'Air-Sole', closure: 'Lace-up' },
  { name: 'Dunk Low Panda', brand: 'Nike', price: 8295, category: 'Women', subcategory: 'Sneakers', description: 'Clean and classic, the Dunk Low Panda features a timeless black and white leather construction.', material: 'Leather', sole: 'Rubber', closure: 'Lace-up' },
  { name: 'Chuck 70 High Top', brand: 'Converse', price: 5999, category: 'Unisex', subcategory: 'Sneakers', description: 'The Chuck 70 mixes the best details from the \'70s-era Chuck with impeccable craftsmanship.', material: 'Canvas', sole: 'Rubber', closure: 'Lace-up' },
  { name: 'New Balance 550', brand: 'New Balance', price: 12999, category: 'Men', subcategory: 'Sneakers', description: 'A tribute to the 1989 original, the 550 offers a clean, versatile look for the street.', material: 'Leather & Suede', sole: 'Rubber', closure: 'Lace-up' },
  { name: 'Air Max 270', brand: 'Nike', price: 13995, category: 'Women', subcategory: 'Sneakers', description: 'Nike\'s first lifestyle Air Max brings you style, comfort and big attitude.', material: 'Mesh', sole: 'Max Air 270 Unit', closure: 'Lace-up' },
  { name: 'Forum Low', brand: 'Adidas', price: 8999, category: 'Men', subcategory: 'Sneakers', description: 'More than just a shoe, it\'s a statement. The Forum Low brings back the 84 hardwood energy.', material: 'Leather', sole: 'Rubber', closure: 'Lace-up & Strap' },
  { name: 'Classic Leather', brand: 'Reebok', price: 6599, category: 'Unisex', subcategory: 'Sneakers', description: 'Always classic. These shoes stay true to the original with a soft garment leather upper.', material: 'Leather', sole: 'EVA Midsole', closure: 'Lace-up' },
  { name: 'Old Skool', brand: 'Vans', price: 4999, category: 'Kids', subcategory: 'Sneakers', description: 'The Vans Old Skool, the classic skate shoe and first to bare the iconic sidestripe.', material: 'Suede & Canvas', sole: 'Waffle Rubber', closure: 'Lace-up' },

  // FORMAL
  { name: 'Oxford Brogue Derby', brand: 'Clarks', price: 8999, category: 'Men', subcategory: 'Formal', description: 'Sophisticated leather oxfords with intricate brogue detailing for the modern gentleman.', material: 'Full Grain Leather', sole: 'Leather', closure: 'Lace-up' },
  { name: 'Cap Toe Oxford', brand: 'Allen Edmonds', price: 14999, category: 'Men', subcategory: 'Formal', description: 'Timeless cap-toe oxfords crafted with premium calfskin and traditional Goodyear welt.', material: 'Calfskin Leather', sole: 'Dainite Rubber', closure: 'Lace-up' },
  { name: 'Suede Penny Loafer', brand: 'Hugo Boss', price: 11999, category: 'Men', subcategory: 'Formal', description: 'Elegant penny loafers in soft Italian suede, perfect for business-casual attire.', material: 'Italian Suede', sole: 'Stacked Leather', closure: 'Slip-on' },
  { name: 'Double Monk Strap', brand: 'Magnanni', price: 18999, category: 'Men', subcategory: 'Formal', description: 'Hand-finished double monk strap shoes with a sleek profile and refined silhouette.', material: 'Patina Leather', sole: 'Leather', closure: 'Buckle' },
  { name: 'Pointed Toe Pump', brand: 'Jimmy Choo', price: 45999, category: 'Women', subcategory: 'Formal', description: 'Exquisite pointed-toe pumps in patent leather, designed for high-profile events.', material: 'Patent Leather', sole: 'Leather', closure: 'Slip-on' },
  { name: 'Chelsea Evening Boot', brand: 'Saint Laurent', price: 62999, category: 'Men', subcategory: 'Formal', description: 'Slim-profile Chelsea boots in polished calfskin, the epitome of rock-and-roll elegance.', material: 'Polished Leather', sole: 'Leather', closure: 'Elastic' },
  { name: 'Patent Leather Tuxedo Shoe', brand: 'Gucci', price: 54999, category: 'Men', subcategory: 'Formal', description: 'Formal patent leather lace-ups designed specifically for black-tie occasions.', material: 'Patent Leather', sole: 'Leather', closure: 'Lace-up' },
  { name: 'Classic Wingtip', brand: 'Cole Haan', price: 9999, category: 'Men', subcategory: 'Formal', description: 'Modern wingtips with Grand.OS technology for lightweight comfort during long days.', material: 'Leather', sole: 'Grand.OS Rubber', closure: 'Lace-up' },
  { name: 'Leather Tassel Loafer', brand: 'Dr. Martens', price: 12999, category: 'Unisex', subcategory: 'Formal', description: 'A rebellious take on the classic loafer, featuring high-shine leather and tassel detail.', material: 'Smooth Leather', sole: 'AirWair Bouncing Sole', closure: 'Slip-on' },
  { name: 'Velvet Evening Slipper', brand: 'Ralph Lauren', price: 15999, category: 'Men', subcategory: 'Formal', description: 'Luxurious velvet slippers with embroidered crest, perfect for upscale lounging or formal wear.', material: 'Velvet', sole: 'Quilted Leather', closure: 'Slip-on' },

  // SPORTS
  { name: 'Air Zoom Pegasus 40', brand: 'Nike', price: 11495, category: 'Men', subcategory: 'Sports', description: 'The Pegasus 40 returns with a familiar, personalized fit and responsive cushioning.', material: 'Engineered Mesh', sole: 'Zoom Air', closure: 'Lace-up' },
  { name: 'Ultraboost Light', brand: 'Adidas', price: 18999, category: 'Women', subcategory: 'Sports', description: 'The lightest Ultraboost ever, designed for epic energy return and ultimate comfort.', material: 'Primeknit+', sole: 'Light Boost', closure: 'Lace-up' },
  { name: 'Gel-Kayano 30', brand: 'ASICS', price: 15999, category: 'Men', subcategory: 'Sports', description: 'Advanced stability and comfort for long-distance runners with PureGEL technology.', material: 'Mesh', sole: 'FF BLAST PLUS', closure: 'Lace-up' },
  { name: 'Phantom GX Academy', brand: 'Nike', price: 7495, category: 'Kids', subcategory: 'Sports', description: 'Football boots designed for precise touch and agility on the pitch.', material: 'Synthetic', sole: 'Multi-ground', closure: 'Lace-up' },
  { name: 'Curry 11', brand: 'Under Armour', price: 14999, category: 'Men', subcategory: 'Sports', description: 'Stephen Curry\'s signature basketball shoe with UA Flow for incredible grip and speed.', material: 'Warp Knit', sole: 'UA Flow', closure: 'Lace-up' },
  { name: 'Hovr Phantom 3', brand: 'Under Armour', price: 12999, category: 'Women', subcategory: 'Sports', description: 'Responsive UA HOVR cushioning reduces impact and helps propel you forward.', material: 'Flat Knit', sole: 'HOVR Rubber', closure: 'Lace-up' },
  { name: 'Speedcross 6', brand: 'Salomon', price: 13999, category: 'Men', subcategory: 'Sports', description: 'The legendary trail shoe, redesigned for even better grip and a faster ride.', material: 'Ripstop Fabric', sole: 'Mud Contagrip', closure: 'Quicklace' },
  { name: 'Nano X3', brand: 'Reebok', price: 10999, category: 'Unisex', subcategory: 'Sports', description: 'The most versatile training shoe, built for everything from sprints to squats.', material: 'Flexweave', sole: 'Floatride Energy', closure: 'Lace-up' },
  { name: 'Metcon 9', brand: 'Nike', price: 11995, category: 'Men', subcategory: 'Sports', description: 'The gold standard for training, with an even larger Hyperlift plate and rubber rope wrap.', material: 'Mesh & TPU', sole: 'Rubber', closure: 'Lace-up' },
  { name: 'LeBron XXI', brand: 'Nike', price: 18995, category: 'Men', subcategory: 'Sports', description: 'Engineered for the next generation of greatness, offering lockdown and explosive power.', material: 'Premium Leather & Knit', sole: 'Zoom Air', closure: 'Lace-up' },

  // CASUAL
  { name: 'Stan Smith', brand: 'Adidas', price: 7999, category: 'Unisex', subcategory: 'Casual', description: 'Timeless tennis style with a sustainable twist. The Stan Smith remains an icon.', material: 'Synthetic Leather', sole: 'Rubber', closure: 'Lace-up' },
  { name: 'Cali Star', brand: 'Puma', price: 6999, category: 'Women', subcategory: 'Casual', description: 'West Coast vibes meets high-street style with the sleek and simple Cali Star.', material: 'Leather', sole: 'Rubber', closure: 'Lace-up' },
  { name: 'Gazelle Bold', brand: 'Adidas', price: 10999, category: 'Women', subcategory: 'Casual', description: 'The classic Gazelle, elevated with a triple-stacked platform sole for a bold look.', material: 'Suede', sole: 'Platform Rubber', closure: 'Lace-up' },
  { name: 'Air Max Ishod', brand: 'Nike', price: 9295, category: 'Men', subcategory: 'Casual', description: 'Infused with elements taken from iconic \'90s basketball shoes, built with skate durability.', material: 'Suede & Mesh', sole: 'Cupsole', closure: 'Lace-up' },
  { name: 'Classic Slip-On', brand: 'Vans', price: 4599, category: 'Unisex', subcategory: 'Casual', description: 'The original slip-on shoe. Comfortable, easy to wear, and forever iconic.', material: 'Canvas', sole: 'Waffle Rubber', closure: 'Slip-on' },
  { name: 'Samba OG', brand: 'Adidas', price: 10999, category: 'Unisex', subcategory: 'Casual', description: 'Born on the pitch, the Samba is a timeless icon of street style.', material: 'Leather & Suede', sole: 'Gum Rubber', closure: 'Lace-up' },
  { name: 'Suede Classic XXI', brand: 'Puma', price: 5999, category: 'Men', subcategory: 'Casual', description: 'The shoe that defined a generation. Low-profile, high-impact suede.', material: 'Suede', sole: 'Rubber', closure: 'Lace-up' },
  { name: 'One Star Pro', brand: 'Converse', price: 6499, category: 'Men', subcategory: 'Casual', description: 'The One Star, built for skateboarding with CX foam cushioning and rubber-backed suede.', material: 'Rubber-backed Suede', sole: 'CONS Traction Rubber', closure: 'Lace-up' },
  { name: 'Authentic VR3', brand: 'Vans', price: 5499, category: 'Unisex', subcategory: 'Casual', description: 'A sustainable take on the first Vans shoe, featuring responsibly sourced materials.', material: 'Organic Canvas', sole: 'Natural Rubber', closure: 'Lace-up' },
  { name: 'Club C 85', brand: 'Reebok', price: 7499, category: 'Women', subcategory: 'Casual', description: 'Clean, minimalist sneakers that stay true to their heritage court style.', material: 'Soft Leather', sole: 'Rubber', closure: 'Lace-up' },

  // BOOTS
  { name: '1460 Smooth Leather Boot', brand: 'Dr. Martens', price: 14999, category: 'Unisex', subcategory: 'Boots', description: 'The original Dr. Martens boot. Instant recognition, lifelong durability.', material: 'Smooth Leather', sole: 'AirWair Bouncing Sole', closure: 'Lace-up' },
  { name: '6-Inch Premium Waterproof', brand: 'Timberland', price: 16999, category: 'Men', subcategory: 'Boots', description: 'The original waterproof boot that started it all, built for any weather.', material: 'Nubuck Leather', sole: 'Rubber Lug', closure: 'Lace-up' },
  { name: 'Classic Chelsea Boot', brand: 'Blundstone', price: 15999, category: 'Unisex', subcategory: 'Boots', description: 'Rugged, lightweight, and legendary. The ultimate all-terrain Chelsea boot.', material: 'Premium Leather', sole: 'TPU Outsole', closure: 'Elastic' },
  { name: 'Iron Ranger', brand: 'Red Wing', price: 28999, category: 'Men', subcategory: 'Boots', description: 'A classic American work boot, built with premium leather and a chrome hardware finish.', material: 'Amber Harness Leather', sole: 'Vibram 430 Mini-Lug', closure: 'Lace-up' },
  { name: 'Desert Boot', brand: 'Clarks', price: 9999, category: 'Men', subcategory: 'Boots', description: 'The original cult classic. Often imitated, never bettered.', material: 'Suede', sole: 'Crepe Rubber', closure: 'Lace-up' },
  { name: 'Explorer II Carnival', brand: 'Sorel', price: 11999, category: 'Women', subcategory: 'Boots', description: 'Lightweight and waterproof, designed to keep you cozy and dry in style.', material: 'Waterproof Nylon', sole: 'Rubber', closure: 'Lace-up' },
  { name: 'Wallabee Boot', brand: 'Clarks', price: 12999, category: 'Unisex', subcategory: 'Boots', description: 'The Wallabee has become an iconic classic across the globe thanks to its moccasin construction.', material: 'Suede', sole: 'Crepe Rubber', closure: 'Lace-up' },
  { name: 'Tactical Duty Boot', brand: 'Under Armour', price: 9999, category: 'Men', subcategory: 'Boots', description: 'Lightweight, durable, and ready for any mission.', material: 'Synthetic Leather & Nylon', sole: 'Rubber Lug', closure: 'Lace-up' },
  { name: 'Hiking Adventure Boot', brand: 'Columbia', price: 8499, category: 'Kids', subcategory: 'Boots', description: 'Keep little feet dry and comfortable on the trail.', material: 'Leather & Mesh', sole: 'Omni-Grip Rubber', closure: 'Lace-up' },
  { name: 'Tall Rain Boot', brand: 'Hunter', price: 13999, category: 'Women', subcategory: 'Boots', description: 'Handcrafted from natural rubber, the iconic Hunter tall boot is completely waterproof.', material: 'Natural Vulcanized Rubber', sole: 'Rubber', closure: 'Slip-on' },
];

const unsplashImages = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1512374382149-4332c6c021f1?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1515347619252-60a4bdad858a?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=1000'
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Connected to MongoDB for seeding...');

    // 1. Clear existing data
    await Product.deleteMany({});
    await Order.deleteMany({});
    // Remove all users except admin
    await User.deleteMany({ email: { $ne: process.env.ADMIN_EMAIL } });
    logger.info('Cleared existing data (except admin user).');

    // 2. Prepare product data
    const finalProducts = products.map((p, index) => {
      // Rotate through unsplash images for variety
      const mainImg = unsplashImages[index % unsplashImages.length];
      const altImg = unsplashImages[(index + 3) % unsplashImages.length];
      
      return {
        ...p,
        sizes: [6, 7, 8, 9, 10, 11],
        image1: mainImg,
        image2: altImg,
        image3: unsplashImages[(index + 7) % unsplashImages.length],
        image4: unsplashImages[(index + 10) % unsplashImages.length],
        date: Date.now(),
        bestseller: false,
        numberofproducts: {
          '6': 10,
          '7': 15,
          '8': 20,
          '9': 20,
          '10': 15,
          '11': 10
        },
        colors: ['Black', 'White', 'Red'],
        ratings: [],
        avgrating: 0,
        soldCount: 0
      };
    });

    // 3. Insert products
    await Product.insertMany(finalProducts);
    logger.info(`Successfully seeded ${finalProducts.length} products!`);

    process.exit(0);
  } catch (error) {
    logger.error('Seed Error:', error);
    process.exit(1);
  }
}

seed();
