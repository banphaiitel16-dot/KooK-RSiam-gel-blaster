import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Change products from const to state
code = code.replace(
  'const products: Product[] = productsData;',
  `const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : productsData;
  });`
);

// 2. Add extra states for Admin: siteSettings, orders, editing product, etc.
const userPasswordsDef = `const [userPasswords, setUserPasswords] = useState`;
const statesToAdd = `
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('siteSettings');
    return saved ? JSON.parse(saved) : { logo: '/logo.jpg', title: 'KooK-RSiam' };
  });
  
  const [orders, setOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [
      { id: 'ORD-001', user: 'Somchai K.', items: ['gb-001'], total: 2990, status: 'Completed', date: '2026-05-01' },
      { id: 'ORD-002', user: 'Weerayut T.', items: ['acc-001'], total: 450, status: 'Pending', date: '2026-05-05' }
    ];
  });

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingSettings, setEditingSettings] = useState<{logo: string, title: string} | null>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);
  
  const handleSaveProduct = (p: any) => {
    if (products.find(x => x.id === p.id)) {
      setProducts(products.map(x => x.id === p.id ? p : x));
    } else {
      setProducts([p, ...products]);
    }
    setEditingProduct(null);
  };
`;

code = code.replace(userPasswordsDef, statesToAdd + '\n  ' + userPasswordsDef);

// 3. Update Footer
code = code.replace(
  '<img\n              src="/logo.jpg"\n              alt="Logo"',
  '<img\n              src={siteSettings.logo}\n              alt="Logo"'
);
code = code.replace(
  '© {new Date().getFullYear()} KooK-RSiam. All rights reserved.',
  '© {new Date().getFullYear()} {siteSettings.title}. All rights reserved.'
);

// Write to file
fs.writeFileSync('src/App.tsx', code);
