const fs = require('fs');

// Patch index.js
let indexContent = fs.readFileSync('index.js', 'utf8');
indexContent = indexContent.replace(
  /connectDB\(\);\s*\(app\.listen\(port,\(\)=>{\s*logger\.info\(`hello server \$\{port\}`\)\s*}\)\)/s,
`connectDB().then(async () => {
  try {
    await Product.createIndexes([
      { key: { category: 1 } },
      { key: { brand: 1 } },
      { key: { bestseller: 1 } },
      { key: { avgrating: -1 } },
      { key: { soldCount: -1 } },
      { key: { price: 1 } },
      { key: { createdAt: -1 } }
    ]);
    await Order.createIndexes([
      { key: { userId: 1 } },
      { key: { status: 1 } },
      { key: { date: -1 } }
    ]);
    await User.createIndexes([
      { key: { email: 1 }, unique: true }
    ]);
    logger.info("MongoDB indexes verified.");
  } catch (err) {
    logger.error("Error creating indexes", err);
  }
});

app.listen(port, () => {
  logger.info(\`KickSphere server running on port \${port} [\${process.env.NODE_ENV || 'development'}]\`);
});`
);
fs.writeFileSync('index.js', indexContent, 'utf8');

// Patch product-controller.js
let productContent = fs.readFileSync('controller/product-controller.js', 'utf8');
productContent = productContent.replace(
  /export const listproduct = async \(req, res\) => \{\s*try \{\s*const products = await Product\.find\(\)\s*return res\.status\(200\)\.json\(\{ success: true, products \}\);/s,
`export const listproduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments()
    ]);

    return res.status(200).json({ 
      success: true, 
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });`
);
fs.writeFileSync('controller/product-controller.js', productContent, 'utf8');

// Patch ordercontroller.js
let orderContent = fs.readFileSync('controller/ordercontroller.js', 'utf8');
orderContent = orderContent.replace(
  /export const adminallorder = async \(req, res\) => \{\s*try \{\s*const orders = await Order\.find\(\{\}\)\s*return res\.status\(200\)\.json\(\{ success: true, orders \}\)/s,
`export const adminallorder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find({}).skip(skip).limit(limit).sort({ date: -1 }),
      Order.countDocuments()
    ]);
    return res.status(200).json({ success: true, orders, pagination: { page, limit, total } })`
);
fs.writeFileSync('controller/ordercontroller.js', orderContent, 'utf8');

console.log("Patched successfully");
