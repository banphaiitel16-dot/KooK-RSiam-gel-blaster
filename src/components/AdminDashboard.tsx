
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, X, LayoutDashboard, Package, Users, ShoppingCart, Settings, 
  BarChart3, Plus, Edit, Trash2, Save, Copy 
} from 'lucide-react';
import { Product } from '../types';

export default function AdminDashboard({
  siteSettings,
  adminTab,
  setAdminTab,
  allUsers,
  products,
  orders,
  editingProduct,
  setEditingProduct,
  handleSaveProduct,
  handleDeleteProduct,
  editingOrder,
  setEditingOrder,
  handleSaveOrder,
  handleDeleteOrder,
  editingSettings,
  setEditingSettings,
  handleSaveSettings,
  userToDelete,
  setUserToDelete,
  executeDeleteUser,
  setIsAdminDashboardOpen,
  compressImage
}: any) {
  return (
    <>
          <div className="fixed inset-0 z-[200] bg-tactical-black flex flex-col overflow-hidden">
            {/* Admin Header */}
            <div className="h-16 border-b border-zinc-800 bg-zinc-950 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tactical-red rounded-xl flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold font-display leading-tight">
                    Admin Console
                  </h1>
                  <p className="text-xs text-zinc-400">
                    {siteSettings.title} Management
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAdminDashboardOpen(false)}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Admin Sidebar */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950/50 flex flex-row md:flex-col py-2 md:py-6 gap-2 shrink-0 overflow-x-auto md:overflow-y-auto whitespace-nowrap">
                <button
                  onClick={() => setAdminTab("overview")}
                  className={`flex flex-shrink-0 items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm font-medium transition-colors ${adminTab === "overview" ? "text-tactical-red border-b-2 md:border-b-0 md:border-r-2 border-tactical-red bg-tactical-red/10" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}
                >
                  <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
                  ภาพรวมระบบ
                </button>
                <button
                  onClick={() => setAdminTab("products")}
                  className={`flex flex-shrink-0 items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm font-medium transition-colors ${adminTab === "products" ? "text-tactical-red border-b-2 md:border-b-0 md:border-r-2 border-tactical-red bg-tactical-red/10" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}
                >
                  <Package className="w-4 h-4 md:w-5 md:h-5" />
                  จัดการสินค้า
                </button>
                <button
                  onClick={() => setAdminTab("users")}
                  className={`flex flex-shrink-0 items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm font-medium transition-colors ${adminTab === "users" ? "text-tactical-red border-b-2 md:border-b-0 md:border-r-2 border-tactical-red bg-tactical-red/10" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}
                >
                  <Users className="w-4 h-4 md:w-5 md:h-5" />
                  จัดการผู้ใช้
                </button>
                <button
                  onClick={() => setAdminTab("orders")}
                  className={`flex flex-shrink-0 items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm font-medium transition-colors ${adminTab === "orders" ? "text-tactical-red border-b-2 md:border-b-0 md:border-r-2 border-tactical-red bg-tactical-red/10" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                  ประวัติการสั่งซื้อ
                </button>
                <button
                  onClick={() => {
                    setAdminTab("settings");
                    setEditingSettings(siteSettings);
                  }}
                  className={`flex flex-shrink-0 items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm font-medium transition-colors ${adminTab === "settings" ? "text-tactical-red border-b-2 md:border-b-0 md:border-r-2 border-tactical-red bg-tactical-red/10" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                  การตั้งค่าทั่วไป
                </button>
              </div>

              {/* Admin Content */}
              <div className="flex-1 overflow-y-auto bg-tactical-black p-4 md:p-6 lg:p-10">
                {adminTab === "overview" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      ภาพรวมระบบ (Dashboard)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-zinc-400 text-sm">
                              ผู้ใช้ทั้งหมด
                            </p>
                            <h3 className="text-2xl font-bold text-white">
                              {allUsers.length}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-tactical-red/10 text-tactical-red rounded-xl">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-zinc-400 text-sm">
                              สินค้าในระบบ
                            </p>
                            <h3 className="text-2xl font-bold text-white">
                              {products.length}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                            <BarChart3 className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-zinc-400 text-sm">ยอดสั่งซื้อ</p>
                            <h3 className="text-2xl font-bold text-white">
                              {orders.length}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {adminTab === "products" && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">
                        จัดการสินค้า
                      </h2>
                      <button
                        onClick={() =>
                          setEditingProduct({
                            id: "",
                            isNew: true,
                            name: "",
                            price: 0,
                            description: "",
                            image: "",
                            images: [],
                            tags: [],
                            category: "",
                            isOffSale: false,
                            isComingSoon: false,
                            isPublished: false,
                          })
                        }
                        className="bg-tactical-red hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        เพิ่มสินค้าใหม่
                      </button>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
                      <table className="w-full text-left text-sm text-zinc-400 min-w-[600px]">
                        <thead className="bg-zinc-950/50 text-zinc-300 uppercase font-medium border-b border-zinc-800">
                          <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">ชื่อสินค้า</th>
                            <th className="px-6 py-4">หมวดหมู่</th>
                            <th className="px-6 py-4">ราคา</th>
                            <th className="px-6 py-4 text-right">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          {products.map((p: any) => (
                            <tr
                              key={p.id}
                              className="hover:bg-zinc-800/50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs">{p.id}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(p.id);
                                    }}
                                    className="text-zinc-500 hover:text-white transition-colors"
                                    title="คัดลอกรหัสสินค้า"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.image || undefined}
                                    alt={p.name}
                                    className="w-10 h-10 rounded object-cover bg-zinc-800"
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-white font-medium">
                                      {p.name}
                                    </span>
                                    {p.isPublished === false && (
                                      <span className="text-xs text-orange-500">
                                        ซ่อนจากหน้าร้าน
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-zinc-300">
                                {p.category}
                              </td>
                              <td className="px-6 py-4 text-tactical-red font-bold">
                                ฿{p.price.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => setEditingProduct({ ...p, originalId: p.id })}
                                  className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                  title="แก้ไข"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-2 text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer"
                                  title="ลบ"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {adminTab === "orders" && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">
                        ประวัติการสั่งซื้อ
                      </h2>
                      <button
                        onClick={() =>
                          setEditingOrder({
                            id:
                              "ORD-" +
                              Math.floor(Math.random() * 10000)
                                .toString()
                                .padStart(4, "0"),
                            user: "",
                            items: [],
                            total: 0,
                            status: "Pending",
                            date: new Date().toISOString().split("T")[0],
                          })
                        }
                        className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> เพิ่มการสั่งซื้อใหม่
                      </button>
                    </div>
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
                            <tr
                              key={o.id}
                              className="hover:bg-zinc-800/50 transition-colors"
                            >
                              {editingOrder?.id === o.id ? (
                                <td colSpan={7} className="p-4">
                                  <div className="flex gap-4 items-center flex-wrap">
                                    <input
                                      type="text"
                                      className="bg-zinc-950 border border-zinc-700 text-white px-3 py-1.5 rounded"
                                      value={editingOrder.id}
                                      onChange={(e) =>
                                        setEditingOrder({
                                          ...editingOrder,
                                          id: e.target.value,
                                        })
                                      }
                                    />
                                    <input
                                      type="text"
                                      className="bg-zinc-950 border border-zinc-700 text-white px-3 py-1.5 rounded"
                                      value={editingOrder.user}
                                      onChange={(e) =>
                                        setEditingOrder({
                                          ...editingOrder,
                                          user: e.target.value,
                                        })
                                      }
                                    />
                                    <input
                                      type="number"
                                      className="bg-zinc-950 border border-zinc-700 text-white px-3 py-1.5 rounded"
                                      value={editingOrder.total}
                                      onChange={(e) =>
                                        setEditingOrder({
                                          ...editingOrder,
                                          total: Number(e.target.value),
                                        })
                                      }
                                    />
                                    <input
                                      type="date"
                                      className="bg-zinc-950 border border-zinc-700 text-white px-3 py-1.5 rounded"
                                      value={editingOrder.date}
                                      onChange={(e) =>
                                        setEditingOrder({
                                          ...editingOrder,
                                          date: e.target.value,
                                        })
                                      }
                                    />
                                    <select
                                      className="bg-zinc-950 border border-zinc-700 text-white px-3 py-1.5 rounded"
                                      value={editingOrder.status}
                                      onChange={(e) =>
                                        setEditingOrder({
                                          ...editingOrder,
                                          status: e.target.value,
                                        })
                                      }
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Completed">
                                        Completed
                                      </option>
                                      <option value="Shipping">Shipping</option>
                                      <option value="Cancelled">
                                        Cancelled
                                      </option>
                                    </select>
                                    <button
                                      onClick={() => {
                                        setOrders(
                                          orders.map((x) =>
                                            x.id === o.id ? editingOrder : x,
                                          ),
                                        );
                                        setEditingOrder(null);
                                      }}
                                      className="bg-tactical-red text-white px-4 py-1.5 rounded"
                                    >
                                      บันทึก
                                    </button>
                                    <button
                                      onClick={() => setEditingOrder(null)}
                                      className="bg-zinc-700 text-white px-4 py-1.5 rounded"
                                    >
                                      ยกเลิก
                                    </button>
                                  </div>
                                </td>
                              ) : (
                                <>
                                  <td className="px-6 py-4 font-mono text-xs">
                                    {o.id}
                                  </td>
                                  <td className="px-6 py-4 text-white">
                                    {o.user}
                                  </td>
                                  <td className="px-6 py-4">
                                    {o.items.join(", ")}
                                  </td>
                                  <td className="px-6 py-4 text-tactical-red font-bold">
                                    ฿{o.total.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4">{o.date}</td>
                                  <td className="px-6 py-4">
                                    <span
                                      className={`px-2 py-1 rounded text-xs ${o.status === "Completed" ? "bg-emerald-500/20 text-emerald-500" : "bg-yellow-500/20 text-yellow-500"}`}
                                    >
                                      {o.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() => setEditingOrder(o)}
                                      className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                      title="แก้ไข"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteOrder(o.id)}
                                      className="p-2 text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer"
                                      title="ลบ"
                                    >
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

                {adminTab === "settings" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      ตั้งค่าทั่วไป (โลโก้แอพ / ชื่อร้านค้า)
                    </h2>
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-xl">
                      {editingSettings && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-zinc-400 text-sm mb-2">
                              อัพโหลดโลโก้ (App / Loading Logo)
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  compressImage(file).then((compressedUrl) => {
                                    setEditingSettings({
                                      ...editingSettings,
                                      logo: compressedUrl,
                                    });
                                  });
                                }
                              }}
                              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tactical-red file:text-white hover:file:bg-tactical-red-hover cursor-pointer"
                            />
                            {editingSettings.logo && (
                              <img
                                src={editingSettings.logo || undefined}
                                alt="Logo preview"
                                className="mt-4 h-16 object-contain rounded bg-zinc-800 p-1"
                              />
                            )}
                          </div>
                          <div>
                            <label className="block text-zinc-400 text-sm mb-2">
                              ชื่อร้านค้า (Store Name)
                            </label>
                            <input
                              type="text"
                              value={editingSettings.title}
                              onChange={(e) =>
                                setEditingSettings({
                                  ...editingSettings,
                                  title: e.target.value,
                                })
                              }
                              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-400 text-sm mb-2">
                              แสดงแบนเนอร์ระบบออมเงิน
                            </label>
                            <input
                              type="checkbox"
                              checked={editingSettings.savingsPlanEnabled !== false}
                              onChange={(e) =>
                                setEditingSettings({
                                  ...editingSettings,
                                  savingsPlanEnabled: e.target.checked,
                                })
                              }
                              className="w-5 h-5 bg-zinc-950 border border-zinc-800 rounded focus:ring-tactical-red text-tactical-red"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-400 text-sm mb-2">
                              หัวข้อระบบออมเงิน
                            </label>
                            <input
                              type="text"
                              value={editingSettings.savingsPlanHeadline || ""}
                              onChange={(e) =>
                                setEditingSettings({
                                  ...editingSettings,
                                  savingsPlanHeadline: e.target.value,
                                })
                              }
                              placeholder="ระบบออมเงิน"
                              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-400 text-sm mb-2">
                              รายละเอียดระบบออมเงิน
                            </label>
                            <textarea
                              value={editingSettings.savingsPlanDesc || ""}
                              onChange={(e) =>
                                setEditingSettings({
                                  ...editingSettings,
                                  savingsPlanDesc: e.target.value,
                                })
                              }
                              rows={2}
                              placeholder="อยากได้ปืนเจลแต่งบยังไม่พอ?..."
                              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-400 text-sm mb-2">
                              หัวข้อสินค้าขายดี
                            </label>
                            <input
                              type="text"
                              value={editingSettings.bestSellerTitle || ""}
                              onChange={(e) =>
                                setEditingSettings({
                                  ...editingSettings,
                                  bestSellerTitle: e.target.value,
                                })
                              }
                              placeholder="สินค้าขายดี / Best Sellers"
                              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                            />
                          </div>
                          <div className="pt-4 flex gap-4">
                            <button
                              onClick={async () => {
                                await handleSaveSettings();
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

                {adminTab === "users" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      จัดการผู้ใช้
                    </h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
                      <table className="w-full text-left text-sm text-zinc-400 min-w-[500px]">
                        <thead className="bg-zinc-950/50 text-zinc-300 uppercase font-medium border-b border-zinc-800">
                          <tr>
                            <th className="px-6 py-4">ผู้ใช้</th>
                            <th className="px-6 py-4">สถานะ</th>
                            <th className="px-6 py-4">ประเภทผู้ใช้</th>
                            <th className="px-6 py-4 text-right">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          {allUsers.map(({ email, id }) => (
                            <tr
                              key={id || email}
                              className="hover:bg-zinc-800/50 transition-colors"
                            >
                              <td className="px-6 py-4 text-white font-medium flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-tactical-red uppercase border border-zinc-700">
                                  {email?.charAt(0) || "U"}
                                </div>
                                {email}
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  ใช้งานได้
                                </span>
                              </td>
                              <td className="px-6 py-4 text-white font-medium">
                                {checkIsAdmin(email) ? (
                                  <span className="text-tactical-red">Admin (ผู้ดูแลระบบ)</span>
                                ) : (
                                  <span className="text-zinc-400">User (ผู้ใช้งาน)</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleDeleteUser(id)}
                                  className="p-2 text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer"
                                  title="ลบบัญชี"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {allUsers.length === 0 && (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-6 py-8 text-center text-zinc-500"
                              >
                                ไม่มีผู้ใช้ในระบบ
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      {/* Product Editing Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[210] flex justify-center items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setEditingProduct(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] z-10 hidden-scrollbar"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 sticky top-0 z-20">
                <h3 className="font-display font-bold text-xl text-white">
                  แก้ไขสินค้า (Edit Product)
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      รหัสสินค้า (Product ID)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.id}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          id: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      ชื่อสินค้า
                    </label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      ราคา (บาท)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    หมวดหมู่
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      let newId = editingProduct.id;
                      if (editingProduct.isNew && newCategory) {
                        newId = generateNextProductId(newCategory, products);
                      }
                      setEditingProduct({
                        ...editingProduct,
                        category: newCategory,
                        id: newId,
                      });
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red appearance-none"
                  >
                    <option value="" disabled>
                      -- หมวดหมู่เพนท์บอลไฟฟ้า --
                    </option>
                    <option value="ปืนเจลไฟฟ้า">ปืนเจลไฟฟ้า (ทั่วไป)</option>
                    {GUN_SUBCATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        - {c}
                      </option>
                    ))}

                    <option value="" disabled>
                      -- อุปกรณ์ตกแต่งและอื่นๆ --
                    </option>
                    <option value="อุปกรณ์เสริม">อุปกรณ์เสริม (ทั่วไป)</option>
                    {ACCESSORY_SUBCATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        - {c}
                      </option>
                    ))}

                    <option value="ชุดที่ชาร์จและแบตเตอรี่">
                      ชุดที่ชาร์จและแบตเตอรี่ (ทั่วไป)
                    </option>
                    {BATTERY_SUBCATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        - {c}
                      </option>
                    ))}

                    <option value="ลูกกระสุนเจล">ลูกกระสุนเจล (ทั่วไป)</option>
                    {GEL_BALL_SUBCATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        - {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-zinc-400 text-sm mb-2">
                    แท็กสินค้า (พิมพ์แท็กแล้วกด Enter หรือกด +, เช่น PISTOL, COMPACT, ขายดี)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(editingProduct.tags || []).map((tag: string, idx: number) => (
                      <span key={idx} className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = [...(editingProduct.tags || [])];
                            newTags.splice(idx, 1);
                            setEditingProduct({ ...editingProduct, tags: newTags });
                          }}
                          className="text-zinc-500 hover:text-tactical-red transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      id="tag-input"
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value) {
                            const newTags = Array.from(new Set([
                              ...(editingProduct.tags || []),
                              ...value.split(",").map((v: string) => v.trim()).filter(Boolean)
                            ]));
                            setEditingProduct({ ...editingProduct, tags: newTags });
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                      className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                      placeholder="พิมพ์แท็กแล้วกด Enter หรือกด + ..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const inputEl = document.getElementById("tag-input") as HTMLInputElement;
                        if (inputEl) {
                          const value = inputEl.value.trim();
                          if (value) {
                            const newTags = Array.from(new Set([
                              ...(editingProduct.tags || []),
                              ...value.split(",").map((v: string) => v.trim()).filter(Boolean)
                            ]));
                            setEditingProduct({ ...editingProduct, tags: newTags });
                            inputEl.value = '';
                          }
                        }
                      }}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors border border-zinc-700 flex items-center justify-center shrink-0"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    รายละเอียดสินค้า
                  </label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    อัพโหลดรูปภาพหลัก
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        compressImage(file).then((compressedUrl) => {
                          setEditingProduct({
                            ...editingProduct,
                            image: compressedUrl,
                          });
                        });
                      }
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tactical-red file:text-white hover:file:bg-tactical-red-hover cursor-pointer"
                  />
                  {editingProduct.image && (
                    <img
                      src={editingProduct.image || undefined}
                      alt="Preview"
                      className="h-16 mt-2 object-cover rounded bg-zinc-800"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    อัพโหลดรูปภาพเพิ่มเติม (เลือกได้หลายรูป)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        Promise.all(
                          files.map((file) => compressImage(file as File)),
                        ).then((base64Images) => {
                          setEditingProduct({
                            ...editingProduct,
                            images: [
                              ...(editingProduct.images || []),
                              ...base64Images,
                            ],
                          });
                        });
                      }
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                  />
                  {editingProduct.images &&
                    editingProduct.images.length > 0 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                        {editingProduct.images.map(
                          (img: string, idx: number) => (
                            <div
                              key={idx}
                              className="relative inline-block flex-shrink-0 group"
                            >
                              <img
                                src={img || undefined}
                                alt={`Preview ${idx}`}
                                className="h-16 w-16 object-cover rounded bg-zinc-800"
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newImages = [...editingProduct.images!];
                                  newImages.splice(idx, 1);
                                  setEditingProduct({
                                    ...editingProduct,
                                    images: newImages,
                                  });
                                }}
                                className="absolute -top-1 -right-1 bg-tactical-red rounded-full w-5 h-5 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                </div>

                <div className="flex gap-6 pt-4 border-t border-zinc-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isPublished !== false}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isPublished: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-tactical-red focus:ring-tactical-red focus:ring-offset-zinc-900"
                    />
                    <span className="text-zinc-300 text-sm font-medium">
                      แสดงสินค้าบนหน้าร้าน
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isOffSale}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isOffSale: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-tactical-red focus:ring-tactical-red focus:ring-offset-zinc-900"
                    />
                    <span className="text-zinc-300 text-sm font-medium">
                      หมดชั่วคราว
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isComingSoon}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isComingSoon: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-tactical-red focus:ring-tactical-red focus:ring-offset-zinc-900"
                    />
                    <span className="text-zinc-300 text-sm font-medium">
                      เร็วๆ นี้
                    </span>
                  </label>
                </div>
              </div>
              <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 flex justify-end gap-3 sticky bottom-0">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-6 py-2 text-zinc-400 hover:text-white font-medium transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => handleSaveProduct(editingProduct)}
                  className="bg-tactical-red hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" /> บันทึก
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Delete Modal */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-[220] flex justify-center items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setUserToDelete(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                <h3 className="font-display font-bold text-xl text-white">
                  ยืนยันการลบผู้ใช้
                </h3>
                <button
                  onClick={() => setUserToDelete(null)}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-zinc-400 text-sm mb-6">
                  คุณกำลังจะลบผู้ใช้รายนี้ การกระทำนี้ไม่สามารถย้อนกลับได้
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setUserToDelete(null)}
                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => {
                      executeDeleteUser(userToDelete);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-2 bg-tactical-red hover:bg-red-600 text-white rounded-lg transition-colors font-bold"
                  >
                    ยืนยันการลบ
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                <h3 className="font-display font-bold text-xl text-white">
                  แก้ไขจัดข้อมูลการสั่งซื้อ (Order)
                </h3>
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
                    <label className="block text-zinc-400 text-sm mb-2">
                      Order ID
                    </label>
                    <input
                      type="text"
                      value={editingOrder.id}
                      onChange={(e) =>
                        setEditingOrder({ ...editingOrder, id: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      Email ผู้สั่งซื้อ (ระบุให้ตรงกับผู้ใช้งานระบบ)
                    </label>
                    <input
                      type="text"
                      value={editingOrder.user}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          user: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    รายการสินค้า
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(editingOrder.items || []).map((item: string, idx: number) => (
                      <span key={idx} className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...(editingOrder.items || [])];
                            newItems.splice(idx, 1);
                            setEditingOrder({ ...editingOrder, items: newItems });
                          }}
                          className="text-zinc-500 hover:text-tactical-red transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <select
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                           const newItems = [...(editingOrder.items || []), value];
                           setEditingOrder({ ...editingOrder, items: newItems });
                           e.target.value = "";
                        }
                      }}
                      className="bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red appearance-none"
                    >
                      <option value="">+ เลือกสินค้าจากในระบบ...</option>
                      {products.map(p => (
                        <option key={p.id} value={`${p.name} (${p.id})`}>
                          [{p.id}] {p.name}
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex gap-2">
                      <input
                        id="order-item-input"
                        type="text"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (value) {
                              const newItems = [
                                ...(editingOrder.items || []),
                                ...value.split(",").map((v: string) => v.trim()).filter(Boolean)
                              ];
                              setEditingOrder({ ...editingOrder, items: newItems });
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                        className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                        placeholder="หรือพิมพ์ชื่อสินค้าเองแล้วกด Enter / ลูกน้ำ..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const inputEl = document.getElementById("order-item-input") as HTMLInputElement;
                          if (inputEl) {
                            const value = inputEl.value.trim();
                            if (value) {
                              const newItems = [
                                ...(editingOrder.items || []),
                                ...value.split(",").map((v: string) => v.trim()).filter(Boolean)
                              ];
                              setEditingOrder({ ...editingOrder, items: newItems });
                              inputEl.value = '';
                            }
                          }
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors border border-zinc-700 flex items-center justify-center shrink-0"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      ยอดรวมสุทธิ (บาท)
                    </label>
                    <input
                      type="number"
                      value={editingOrder.total}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          total: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      วันที่สั่งซื้อ
                    </label>
                    <input
                      type="date"
                      value={editingOrder.date}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          date: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      สถานะ
                    </label>
                    <select
                      value={editingOrder.status}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          status: e.target.value,
                        })
                      }
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
    </>
  );
}
