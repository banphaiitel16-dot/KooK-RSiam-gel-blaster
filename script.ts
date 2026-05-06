import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');
const start = code.indexOf('if (!user) {');
const endStr = '    );\n  }';
const end = code.indexOf(endStr, start);

if (start !== -1 && end !== -1) {
  const finalCode = code.substring(0, start) + code.substring(end + endStr.length + 1);
  fs.writeFileSync('src/App.tsx', finalCode);
  console.log('Removed if (!user) block successfully');
} else {
  console.log('Block not found');
}
