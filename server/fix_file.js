import fs from 'fs';

const filePath = 'd:/VS CODE/KickSphere/server/controller/product-controller.js';
let content = fs.readFileSync(filePath, 'utf8');

// Find the misplaced function and remove it
const misplacedStart = content.indexOf('export const getpricebounds');
const misplacedEnd = content.indexOf('}; // END_OF_FILTERPRODUCT') + '}; // END_OF_FILTERPRODUCT'.length;

if (misplacedStart !== -1 && misplacedEnd !== -1) {
    const misplaced = content.substring(misplacedStart, misplacedEnd);
    content = content.replace(misplaced, '');
}

// Fix the filter.price block if it was doubled or messed up
content = content.replace(/filter\.price = \{\};[\s\S]*?if \(minPrice\) filter\.price\.\$gte = Number\(minPrice\);/g, 'filter.price = {};\n      if (minPrice) filter.price.$gte = Number(minPrice);');

// Find the end of filterproduct function (which ends with sortOption.limit...; \n\n res.status...; \n\n } catch...; \n } \n };)
// Actually, let's just append getpricebounds to the end of the file for now and then we can move it if needed.
// But better to put it after filterproduct.

const filterProductEnd = content.indexOf('export const fetchsingleproduct');
if (filterProductEnd !== -1) {
    const newFunc = `
export const getpricebounds = async (req, res) => {
  try {
    const bounds = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ]);

    if (bounds.length > 0) {
      res.status(200).json({
        success: true,
        minPrice: bounds[0].minPrice || 0,
        maxPrice: bounds[0].maxPrice || 10000
      });
    } else {
      res.status(200).json({ success: true, minPrice: 0, maxPrice: 10000 });
    }
  } catch (error) {
    logger.error("Error fetching price bounds:", error);
    res.status(500).json({ success: false, message: "Error fetching price bounds" });
  }
};
`;
    content = content.substring(0, filterProductEnd) + newFunc + '\n' + content.substring(filterProductEnd);
}

fs.writeFileSync(filePath, content);
console.log('File fixed successfully');
