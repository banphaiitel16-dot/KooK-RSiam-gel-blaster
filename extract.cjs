const fs = require('fs');

const appContent = fs.readFileSync('src/App.tsx', 'utf8');
const lines = appContent.split('\n');

const startIdx = lines.findIndex(line => line.includes('{isAdminDashboardOpen && isAdminUser && ('));
const endIdx = lines.findIndex((line, i) => i > startIdx && line.includes(')}')) + 1; // Actually, looking at the grep earlier...

// We know from earlier grep that `AdminDashboard Modal` ends around line 3666.
// Let's find exactly.
let actualEnd = -1;
for(let i = startIdx; i < lines.length; i++) {
   if(lines[i].includes('{/* Contact Mode Modal */}')) {
       actualEnd = i - 2; // the </AnimatePresence> is before this.
       break;
   }
}

const componentContent = lines.slice(startIdx + 1, actualEnd).join('\n');

// Build AdminDashboard.tsx
const adminComponent = `
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, X, LayoutDashboard, Package, Users, ShoppingCart, Settings, 
  BarChart3, Plus, Edit, Trash2, Save 
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
${componentContent}
    </>
  );
}
`;

if (!fs.existsSync('src/components')) {
  fs.mkdirSync('src/components', { recursive: true });
}
fs.writeFileSync('src/components/AdminDashboard.tsx', adminComponent);

// Now remove it from App.tsx and insert the component usage
const before = lines.slice(0, startIdx);
const after = lines.slice(actualEnd + 1);

const replacement = [
  '        {isAdminDashboardOpen && isAdminUser && (',
  '          <React.Suspense fallback={<div className="fixed inset-0 z-[200] bg-tactical-black/80 flex items-center justify-center"><div className="w-10 h-10 border-t-2 border-r-2 border-tactical-red rounded-full animate-spin"></div></div>}>',
  '            <AdminDashboard ',
  '              siteSettings={siteSettings}',
  '              adminTab={adminTab}',
  '              setAdminTab={setAdminTab}',
  '              allUsers={allUsers}',
  '              products={products}',
  '              orders={orders}',
  '              editingProduct={editingProduct}',
  '              setEditingProduct={setEditingProduct}',
  '              handleSaveProduct={handleSaveProduct}',
  '              handleDeleteProduct={handleDeleteProduct}',
  '              editingOrder={editingOrder}',
  '              setEditingOrder={setEditingOrder}',
  '              handleSaveOrder={handleSaveOrder}',
  '              handleDeleteOrder={handleDeleteOrder}',
  '              editingSettings={editingSettings}',
  '              setEditingSettings={setEditingSettings}',
  '              handleSaveSettings={handleSaveSettings}',
  '              userToDelete={userToDelete}',
  '              setUserToDelete={setUserToDelete}',
  '              executeDeleteUser={executeDeleteUser}',
  '              setIsAdminDashboardOpen={setIsAdminDashboardOpen}',
  '              compressImage={compressImage}',
  '            />',
  '          </React.Suspense>',
  '        )}'
];

// Add the import at the top of App.tsx
const importStatement = `const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));`;

// Find where to inject import
const importIdx = before.findIndex(line => line.includes('import { Product } from "./types";'));
before.splice(importIdx + 1, 0, importStatement);

const newAppContent = [...before, ...replacement, ...after].join('\\n');
fs.writeFileSync('src/App.tsx', newAppContent);
console.log('Refactoring successful.');
