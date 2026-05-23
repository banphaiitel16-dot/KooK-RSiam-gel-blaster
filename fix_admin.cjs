const fs = require('fs');

let adminContent = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Replace the rogue closing tags
adminContent = adminContent.replace('          )}\n      </AnimatePresence>', '');

fs.writeFileSync('src/components/AdminDashboard.tsx', adminContent);
console.log('Fixed AdminDashboard');
