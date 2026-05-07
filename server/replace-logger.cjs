const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          if (file.includes('node_modules')) return next();
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.js')) results.push(file);
          next();
        }
      });
    })();
  });
};

walk(__dirname, (err, results) => {
  if (err) throw err;
  results.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (file.includes('logger.js')) return; // Skip the logger itself

    let needsImport = false;
    let newContent = content.replace(/console\.log/g, 'logger.info').replace(/console\.error/g, 'logger.error');
    
    if (newContent !== content) {
      needsImport = true;
      // Figure out relative path to logger.js
      const relativePath = path.relative(path.dirname(file), path.join(__dirname, 'config', 'logger.js')).replace(/\\/g, '/');
      const importPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;
      
      // Add import at the top
      newContent = `import logger from '${importPath}';\n` + newContent;
      
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated', file);
    }
  });
});
