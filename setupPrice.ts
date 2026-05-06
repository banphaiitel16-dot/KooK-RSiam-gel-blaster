import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add PRICE_CATEGORIES
const priceCatArray = `
const PRICE_CATEGORIES = [
  { id: "ทั้งหมด", label: "ทุกระดับราคา" },
  { id: "<1000", label: "ต่ำกว่า 1,000 บาท" },
  { id: "1000-3000", label: "1,000 - 3,000 บาท" },
  { id: ">3000", label: "มากกว่า 3,000 บาท" },
];
`;
code = code.replace('const CATEGORIES = [', priceCatArray + '\nconst CATEGORIES = [');

// Add state
const statePattern = /const \[activeCategory, setActiveCategory\] = useState\("ทั้งหมด"\);/;
code = code.replace(statePattern, `const [activeCategory, setActiveCategory] = useState("ทั้งหมด");\n  const [priceCategory, setPriceCategory] = useState("ทั้งหมด");`);

// Update logic
const priceLogic = `
    const matchesPrice = 
      priceCategory === "ทั้งหมด" ? true :
      priceCategory === "<1000" ? p.price < 1000 :
      priceCategory === "1000-3000" ? p.price >= 1000 && p.price <= 3000 :
      priceCategory === ">3000" ? p.price > 3000 : true;

    const matchesSearch =`;
code = code.replace('const matchesSearch =', priceLogic);
code = code.replace('return matchesCategory && matchesSearch;', 'return matchesCategory && matchesPrice && matchesSearch;');

const uiPattern = `<div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-2 uppercase flex items-center gap-3">
              <div className="w-2 h-8 bg-tactical-red rounded-sm" />
              Arsenal
            </h2>
            <p className="text-zinc-400">เลือกอาวุธคู่กายของคุณ</p>
          </div>
        </div>`;

const newUI = `<div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-2 uppercase flex items-center gap-3">
              <div className="w-2 h-8 bg-tactical-red rounded-sm" />
              Arsenal
            </h2>
            <p className="text-zinc-400">เลือกอาวุธคู่กายของคุณ</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 ml-auto">
            {/* Desktop Categories */}
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
               {CATEGORIES.map(category => (
                 <button
                   key={category.id}
                   onClick={() => setActiveCategory(category.id)}
                   className={\`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors \${activeCategory === category.id ? "bg-tactical-red text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"}\`}
                 >
                   {category.label}
                 </button>
               ))}
            </div>
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg">
              <span className="text-zinc-500 text-sm font-medium px-2">ช่วงราคา:</span>
              <select 
                value={priceCategory}
                onChange={(e) => setPriceCategory(e.target.value)}
                className="bg-zinc-950 text-white text-sm rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-tactical-red transition-colors cursor-pointer border-none"
              >
                {PRICE_CATEGORIES.map(cp => (
                  <option key={cp.id} value={cp.id}>{cp.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>`;
code = code.replace(uiPattern, newUI);

fs.writeFileSync('src/App.tsx', code);
