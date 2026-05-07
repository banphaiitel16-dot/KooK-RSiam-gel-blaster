import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Save handleSaveOrder function
const saveOrderStr = `  const handleSaveOrder = (o: any) => {
    if (orders.find((x:any) => x.id === o.id)) {
      setOrders(orders.map((x:any) => x.id === o.id ? o : x));
    } else {
      setOrders([o, ...orders]);
    }
    setEditingOrder(null);
  };`;

if (!code.includes('handleSaveOrder')) {
  // insert after handleSaveProduct
  const findStr1 = 'const handleSaveProduct = (p: any) => {';
  const firstBlockEnd = code.indexOf('};', code.indexOf(findStr1)) + 2;
  code = code.slice(0, firstBlockEnd) + '\n\n' + saveOrderStr + code.slice(firstBlockEnd);
}

// 2. Add button in 'orders' tab
const findOrdersHeader = `{adminTab === 'orders' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">ประวัติการสั่งซื้อ</h2>`;

const replacementOrdersHeader = `{adminTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">ประวัติการสั่งซื้อ</h2>
                      <button onClick={() => setEditingOrder({
                        id: 'ORD-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
                        user: '',
                        items: [],
                        total: 0,
                        status: 'Pending',
                        date: new Date().toISOString().split('T')[0]
                      })} className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer">
                        <Plus className="w-4 h-4" /> เพิ่มการสั่งซื้อใหม่
                      </button>
                    </div>`;

code = code.replace(findOrdersHeader, replacementOrdersHeader);

// 3. Flatten the table rendering
const tbodyContentRegex = /<tbody className="divide-y divide-zinc-800\/50">[\s\S]*?<\/tbody>/;
const newTbody = `<tbody className="divide-y divide-zinc-800/50">
                          {orders.map((o: any) => (
                            <tr key={o.id} className="hover:bg-zinc-800/50 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                              <td className="px-6 py-4 text-white">{o.user}</td>
                              <td className="px-6 py-4">{o.items.join(', ')}</td>
                              <td className="px-6 py-4 text-tactical-red font-bold">฿{o.total.toLocaleString()}</td>
                              <td className="px-6 py-4">{o.date}</td>
                              <td className="px-6 py-4">
                                <span className={\`px-2 py-1 rounded text-xs \${o.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}\`}>{o.status}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button onClick={() => setEditingOrder(o)} className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer" title="แก้ไข">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => setOrders(orders.filter((x:any) => x.id !== o.id))} className="p-2 text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer" title="ลบ">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>`;
code = code.replace(tbodyContentRegex, newTbody);

// 4. Add Order Editing Modal right before Contact Mode Modal
const orderModalHTML = `
      {/* Order Editing Modal */}
      <AnimatePresence>
        {editingOrder && (
          <div className="fixed inset-0 z-[210] flex justify-center items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setEditingOrder(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] z-10 hidden-scrollbar"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 sticky top-0 z-20">
                <h3 className="font-display font-bold text-xl text-white">แก้ไขจัดข้อมูลการสั่งซื้อ (Order)</h3>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Order ID</label>
                    <input 
                      type="text" 
                      value={editingOrder.id}
                      onChange={(e) => setEditingOrder({...editingOrder, id: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Email ผู้สั่งซื้อ (ระบุให้ตรงกับผู้ใช้งานระบบ)</label>
                    <input 
                      type="text" 
                      value={editingOrder.user}
                      onChange={(e) => setEditingOrder({...editingOrder, user: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">รายการสินค้า (คั่นด้วยลูกน้ำ ",")</label>
                  <input 
                    type="text" 
                    value={editingOrder.items ? editingOrder.items.join(', ') : ''}
                    onChange={(e) => setEditingOrder({...editingOrder, items: e.target.value.split(',').map(x => x.trim()).filter(Boolean)})}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">ยอดรวมสุทธิ (บาท)</label>
                    <input 
                      type="number" 
                      value={editingOrder.total}
                      onChange={(e) => setEditingOrder({...editingOrder, total: parseInt(e.target.value) || 0})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">วันที่สั่งซื้อ</label>
                    <input 
                      type="date" 
                      value={editingOrder.date}
                      onChange={(e) => setEditingOrder({...editingOrder, date: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">สถานะ</label>
                    <select 
                      value={editingOrder.status}
                      onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red appearance-none"
                    >
                      <option value="Pending">Pending (รอชำระ)</option>
                      <option value="Completed">Completed (สำเสร็จ)</option>
                      <option value="Shipping">Shipping (กำลังส่ง)</option>
                      <option value="Cancelled">Cancelled (ยกเลิก)</option>
                    </select>
                  </div>
                </div>

              </div>
              <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 flex justify-end gap-3 sticky bottom-0">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="px-6 py-2 text-zinc-400 hover:text-white font-medium transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => handleSaveOrder(editingOrder)}
                  className="bg-tactical-red hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" /> บันทึก
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
`;

const contactModalFind = '{/* Contact Mode Modal */}';
if (code.includes(contactModalFind) && !code.includes('Order Editing Modal')) {
  code = code.replace(contactModalFind, orderModalHTML + '\n      ' + contactModalFind);
}

fs.writeFileSync('src/App.tsx', code);
