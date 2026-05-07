import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Icons
const iconImportPattern = /import {\s*([^}]+)\s*} from "lucide-react";/;
const iconImportMatch = code.match(iconImportPattern);
if (iconImportMatch) {
  let icons = iconImportMatch[1];
  const newIcons = ["ShoppingCart", "Settings", "Save"];
  newIcons.forEach(icon => {
    if (!icons.includes(icon)) {
      icons += ", " + icon;
    }
  });
  code = code.replace(iconImportPattern, "import { " + icons + " } from 'lucide-react';");
}

// 1. Sidebar Buttons
const usersSidebarButton = `<button
                  onClick={() => setAdminTab("users")}
                  className={\`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors \${adminTab === 'users' ? 'text-tactical-red border-r-2 border-tactical-red bg-tactical-red/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}\`}
                >
                  <Users className="w-5 h-5" />
                  จัดการผู้ใช้
                </button>`;

const extraSidebarButtons = `
                <button
                  onClick={() => setAdminTab("orders")}
                  className={\`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors \${adminTab === 'orders' ? 'text-tactical-red border-r-2 border-tactical-red bg-tactical-red/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}\`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  ประวัติการสั่งซื้อ
                </button>
                <button
                  onClick={() => { setAdminTab("settings"); setEditingSettings(siteSettings); }}
                  className={\`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors \${adminTab === 'settings' ? 'text-tactical-red border-r-2 border-tactical-red bg-tactical-red/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}\`}
                >
                  <Settings className="w-5 h-5" />
                  การตั้งค่าทั่วไป
                </button>`;

code = code.replace(usersSidebarButton, usersSidebarButton + extraSidebarButtons);

// 2. Orders & Settings Content
const usersTabContentStr = "{adminTab === 'users' && (";
const usersTabIndex = code.indexOf(usersTabContentStr);

// Let's replace the whole usersTabContent until we find the next section, but wait, it's safer to just inject after it.
const findClosingBraceIndexOfUsers = (text: string, startIndex: number) => {
  let openBrances = 0;
  let firstBraceFound = false;
  for (let i = startIndex; i < text.length; i++) {
    if (text[i] === '{') {
      openBrances++;
      firstBraceFound = true;
    } else if (text[i] === '}') {
      openBrances--;
    }
    if (firstBraceFound && openBrances === 0) {
      if (text.substring(i + 1).trim().startsWith(')')) {
        return text.indexOf(')', i + 1) + 1;
      }
      return i + 1; // might be wrong
    }
  }
  return -1;
};

// Actually, I can just replace `{adminTab === 'users' && (` simply by matching the entire block.
// Wait, I can just use a simpler find/replace string approach since I know the exact code from earlier.
const endOfUsersTab = `                      </table>
                    </div>
                  </div>
                )}`;

const extraTabsContent = `
                {adminTab === 'orders' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">ประวัติการสั่งซื้อ</h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
                      <table className="w-full text-left text-sm text-zinc-400 min-w-[600px]">
                        <thead className="bg-zinc-950/50 text-zinc-300 uppercase font-medium border-b border-zinc-800">
                          <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">ผู้สั่งซื้อ</th>
                            <th className="px-6 py-4">สินค้า</th>
                            <th className="px-6 py-4">ยอดรวม</th>
                            <th className="px-6 py-4">วันที่</th>
                            <th className="px-6 py-4">สถานะ</th>
                            <th className="px-6 py-4 text-right">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          {orders.map((o: any) => (
                            <tr key={o.id} className="hover:bg-zinc-800/50 transition-colors">
                              {editingOrder?.id === o.id ? (
                                <td colSpan={7} className="p-4">
                                  <div className="flex gap-4 items-center flex-wrap">
                                    <input type="text" className="bg-zinc-950 border border-zinc-700 text-white px-3 py-1.5 rounded" value={editingOrder.id} onChange={e => setEditingOrder({...editingOrder, id: e.target.value})} />
                                    <input type="text" className="bg-zinc-950 border border-zinc-700 text-white px-3 py-1.5 rounded" value={editingOrder.user} onChange={e => setEditingOrder({...editingOrder, user: e.target.value})} />
                                    <input type="number" className="bg-zinc-950 border border-zinc-700 text-white px-3 py-1.5 rounded" value={editingOrder.total} onChange={e => setEditingOrder({...editingOrder, total: Number(e.target.value)})} />
                                    <input type="date" className="bg-zinc-950 border border-zinc-700 text-white px-3 py-1.5 rounded" value={editingOrder.date} onChange={e => setEditingOrder({...editingOrder, date: e.target.value})} />
                                    <select className="bg-zinc-950 border border-zinc-700 text-white px-3 py-1.5 rounded" value={editingOrder.status} onChange={e => setEditingOrder({...editingOrder, status: e.target.value})}>
                                      <option value="Pending">Pending</option>
                                      <option value="Completed">Completed</option>
                                      <option value="Shipping">Shipping</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button onClick={() => {
                                      setOrders(orders.map(x => x.id === o.id ? editingOrder : x));
                                      setEditingOrder(null);
                                    }} className="bg-tactical-red text-white px-4 py-1.5 rounded">บันทึก</button>
                                    <button onClick={() => setEditingOrder(null)} className="bg-zinc-700 text-white px-4 py-1.5 rounded">ยกเลิก</button>
                                  </div>
                                </td>
                              ) : (
                                <>
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
                                    <button onClick={() => setOrders(orders.filter(x => x.id !== o.id))} className="p-2 text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer" title="ลบ">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {adminTab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">ตั้งค่าทั่วไป (โลโก้ / คำอธิบาย)</h2>
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-xl">
                      {editingSettings && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-zinc-400 text-sm mb-2">URL ของโลโก้ (Website Logo URL)</label>
                            <input 
                              type="text" 
                              value={editingSettings.logo}
                              onChange={(e) => setEditingSettings({...editingSettings, logo: e.target.value})}
                              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                              placeholder="/logo.jpg หรือ http://..."
                            />
                            {editingSettings.logo && <img src={editingSettings.logo} alt="Preview" className="h-16 mt-2 object-contain" />}
                          </div>
                          <div>
                            <label className="block text-zinc-400 text-sm mb-2">ชื่อร้านค้า (Store Name)</label>
                            <input 
                              type="text" 
                              value={editingSettings.title}
                              onChange={(e) => setEditingSettings({...editingSettings, title: e.target.value})}
                              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                            />
                          </div>
                          <div className="pt-4 flex gap-4">
                            <button 
                              onClick={() => {
                                setSiteSettings(editingSettings);
                                alert("บันทึกการตั้งค่าเรียบร้อย");
                              }}
                              className="bg-tactical-red hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <Save className="w-4 h-4" /> บันทึก
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
`;

code = code.replace(endOfUsersTab, endOfUsersTab + '\n' + extraTabsContent);

// 3. Products Edit Functionality
// Find the button "เพิ่มสินค้าใหม่"
const newProductBtn = `<button className="bg-tactical-red hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer">
                        <Plus className="w-4 h-4" />
                        เพิ่มสินค้าใหม่
                      </button>`;
const newProductBtnActual = `<button onClick={() => setEditingProduct({
                        id: 'new-' + Date.now(),
                        name: '',
                        price: 0,
                        description: '',
                        image: '',
                        images: [],
                        tags: [],
                        category: '',
                        isOffSale: false,
                        isComingSoon: false
                      })} className="bg-tactical-red hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer">
                        <Plus className="w-4 h-4" />
                        เพิ่มสินค้าใหม่
                      </button>`;
code = code.replace(newProductBtn, newProductBtnActual);

// Replace mapping TR inside products table
// First, find the whole tbody inside adminTab === 'products'
const mapProductPattern = /{products\.map\(p => \(\n\s*<tr key=\{p\.id\} className="hover:bg-zinc-800\/50 transition-colors">([\s\S]*?)<\/tr>\n\s*\)\)}/m;

const editableProductTr = `{products.map((p: any) => (
                            <tr key={p.id} className="hover:bg-zinc-800/50 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs text-zinc-500">{p.id}</td>
                              <td className="px-6 py-4 flex flex-col gap-1">
                                <span className="text-white font-medium">{p.name}</span>
                                <div className="flex gap-2">
                                  {p.isOffSale && <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400">หมดชั่วคราว</span>}
                                  {p.isComingSoon && <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400">เร็วๆ นี้</span>}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-zinc-800 rounded-md text-xs">{p.category}</span>
                              </td>
                              <td className="px-6 py-4 text-tactical-red font-bold">฿{p.price.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right">
                                <button onClick={() => setEditingProduct(p)} className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer" title="แก้ไข">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-2 text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer ml-1" title="ลบ">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}`;

code = code.replace(mapProductPattern, editableProductTr);

// Now the product editing modal!
const closingTagForProductArea = `</div>
                  </div>
                )}

                {adminTab === 'users'`;

const editProductModalStr = `</div>
                    
                    {/* Add Product Edit Modal form here */}
                    {editingProduct && (
                      <div className="fixed inset-0 z-[250] bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-8">
                          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                            <h3 className="text-xl font-bold text-white">แก้ไขสินค้า (Edit Product)</h3>
                            <button onClick={() => setEditingProduct(null)} className="text-zinc-400 hover:text-white">
                              <X className="w-6 h-6" />
                            </button>
                          </div>
                          
                          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                             <div className="grid grid-cols-2 gap-4">
                               <div>
                                 <label className="block text-zinc-400 text-sm mb-1">รหัสสินค้า (ID)</label>
                                 <input value={editingProduct.id} onChange={e => setEditingProduct({...editingProduct, id: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded" />
                               </div>
                               <div>
                                 <label className="block text-zinc-400 text-sm mb-1">ชื่อสินค้า (Name)</label>
                                 <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded" />
                               </div>
                               <div>
                                 <label className="block text-zinc-400 text-sm mb-1">ราคา (Price)</label>
                                 <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded" />
                               </div>
                               <div>
                                 <label className="block text-zinc-400 text-sm mb-1">หมวดหมู่ (Category)</label>
                                 <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded">
                                   <option value="">เลือกหมวดหมู่...</option>
                                   <option value="ปืนเจลไฟฟ้า">ปืนเจลไฟฟ้า</option>
                                   <option value="อุปกรณ์แต่งปืน">อุปกรณ์แต่งปืน</option>
                                   <option value="ลูกกระสุนเจล">ลูกกระสุนเจล</option>
                                   <option value="ชุดที่ชาร์จและแบตเตอรี่">ชุดที่ชาร์จและแบตเตอรี่</option>
                                 </select>
                               </div>
                             </div>
                             
                             <div>
                               <label className="block text-zinc-400 text-sm mb-1">รายละเอียด (Description)</label>
                               <textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} rows={3} className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded" />
                             </div>
                             
                             <div>
                               <label className="block text-zinc-400 text-sm mb-1">รูปหลัก (Cover Image URL)</label>
                               <input value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded" placeholder="https://..." />
                             </div>
                             
                             <div>
                               <label className="block text-zinc-400 text-sm mb-1">รูปอื่นๆ (Additional Images comma separated)</label>
                               <input value={(editingProduct.images || []).join(', ')} onChange={e => setEditingProduct({...editingProduct, images: e.target.value.split(',').map((x: string) => x.trim()).filter(Boolean)})} className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded" placeholder="https://..., https://..." />
                             </div>
                             
                             <div className="flex gap-6 mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                               <label className="flex items-center gap-2 text-white cursor-pointer select-none">
                                 <input type="checkbox" checked={editingProduct.isOffSale || false} onChange={e => setEditingProduct({...editingProduct, isOffSale: e.target.checked})} className="w-5 h-5 accent-tactical-red" />
                                 สินค้าหมดชั่วคราว (Out of Stock)
                               </label>
                               <label className="flex items-center gap-2 text-white cursor-pointer select-none">
                                 <input type="checkbox" checked={editingProduct.isComingSoon || false} onChange={e => setEditingProduct({...editingProduct, isComingSoon: e.target.checked})} className="w-5 h-5 accent-tactical-red" />
                                 สินค้าเตรียมจำหน่าย (Coming Soon)
                               </label>
                             </div>
                          </div>
                          
                          <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex justify-end gap-3">
                            <button onClick={() => setEditingProduct(null)} className="px-6 py-2 rounded-lg font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition">ยกเลิก</button>
                            <button onClick={() => handleSaveProduct(editingProduct)} className="px-6 py-2 rounded-lg font-bold text-white bg-tactical-red hover:bg-red-600 transition flex items-center gap-2"><Save className="w-4 h-4"/> บันทึกข้อมูล</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {adminTab === 'users'`;

code = code.replace(closingTagForProductArea, editProductModalStr);

fs.writeFileSync('src/App.tsx', code);
