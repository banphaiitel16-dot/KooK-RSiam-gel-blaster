/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import localforage from "localforage";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, onSnapshot, collection, doc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { motion, AnimatePresence } from "motion/react";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: { userId: auth.currentUser?.uid },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

import { Crosshair,
  MessageCircle,
  PiggyBank,
  ShieldCheck,
  ShoppingCart,
  Zap,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Package,
  FileText,
  Wallet,
  Search,
  Facebook,
  Settings,
  User,
  LogOut,
  Heart,
  Star,
  Check,
  Clock
, Users, LayoutDashboard, BarChart3, Edit, Plus, Trash2, ShieldAlert, Save } from 'lucide-react';
import { Product, Review } from "./types";

// link directly to the provided LINE OA
const handleLineAction = () => {
  window.open("https://lin.ee/ZlByXPo", "_blank");
};

// Facebook link for testing
const handleFacebookAction = () => {
  window.open("https://m.facebook.com/profile.php?id=61589357668189", "_blank");
};

const ProductCard = ({
  product,
  onSelect,
  isFavorite,
  onFavorite,
  onContact,
}: {
  product: Product;
  onSelect: (p: Product) => void;
  isFavorite: boolean;
  onFavorite: (p: Product) => void;
  onContact: (mode: "buy" | "save", p: Product) => void;
  key?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-tactical-gray border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-600 transition-colors duration-300 flex flex-col cursor-pointer relative"
      onClick={() => onSelect(product)}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onFavorite(product); }}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all"
      >
        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-tactical-red text-tactical-red' : ''}`} />
      </button>

      <div className="relative h-40 sm:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-tactical-gray via-transparent to-transparent z-10" />
        <img
          src={product.image || undefined}
          alt={product.name}
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ${product.isOffSale || product.isComingSoon ? "grayscale opacity-70" : ""}`}
        />
        {product.isOffSale && !product.isComingSoon && (
          <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-red-600/90 text-white font-black px-4 py-1.5 sm:px-6 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-base tracking-[0.15em] sm:tracking-[0.2em] shadow-2xl transform -rotate-12 border border-red-500/50 uppercase">
              สินค้าหมดชั่วคราว
            </div>
          </div>
        )}
        {product.isComingSoon && (
          <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-blue-600/90 text-white font-black px-4 py-1.5 sm:px-6 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-base tracking-[0.15em] sm:tracking-[0.2em] shadow-2xl transform -rotate-12 border border-blue-500/50 uppercase">
              เร็วๆนี้...
            </div>
          </div>
        )}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 flex flex-wrap gap-1 sm:gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-tactical-red text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-sm uppercase tracking-widest"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 sm:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-base sm:text-xl font-bold text-white group-hover:text-tactical-red transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>
        {product.isPublished === false && (
          <span className="text-xs font-bold text-orange-500 mb-2">ซ่อนจากหน้าร้าน</span>
        )}

        <div className="text-lg sm:text-3xl font-display font-bold text-white mb-2 sm:mb-4">
          ฿{product.price.toLocaleString()}
        </div>

        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-grow line-clamp-2 sm:line-clamp-3">
          {product.description}
        </p>

        <div className="flex flex-col xl:flex-row gap-2 sm:gap-3 mt-auto relative z-20">
          {product.isComingSoon ? (
            <button
              disabled
              className="flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm bg-blue-900/40 text-blue-400 border border-blue-800/50 cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" />
              เร็วๆนี้...
            </button>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!product.isOffSale) onContact("buy", product);
                }}
                disabled={product.isOffSale}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 sm:gap-2 ${product.isOffSale ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50" : "bg-tactical-red hover:bg-tactical-red-hover text-white shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] cursor-pointer"}`}
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {product.isOffSale ? "สินค้าหมด" : "ซื้อเลย"}
              </button>
              {!product.isOffSale && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onContact("save", product);
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-500 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
                >
                  <PiggyBank className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ออมเงิน
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const GUN_SUBCATEGORIES = [
  "ปืนพก",
  "ปืนไรเฟิลจู่โจม",
  "ลูกซอง",
  "ปืนกลมือ",
];

const ACCESSORY_SUBCATEGORIES = [
  "กริปมือจับ",
  "ขาทราย",
  "ศูนย์เล็ง",
  "ด้ามจับปืน",
  "เลเซอร์",
  "ไฟฉาย",
  "อะไหล่ภายในปืน",
  "ปากกระบอกปืนแต่ง",
];

const BATTERY_SUBCATEGORIES = ["แบต 7.4v", "แบต 11.1v", "สายชาร์จ"];

const GEL_BALL_SUBCATEGORIES = ["แบบมาตรฐาน", "แบบแข็ง"];


const PRICE_CATEGORIES = [
  { id: "ทั้งหมด", label: "ทุกระดับราคา" },
  { id: "<1000", label: "ต่ำกว่า 1,000 บาท" },
  { id: "1000-3000", label: "1,000 - 3,000 บาท" },
  { id: ">3000", label: "มากกว่า 3,000 บาท" },
];

const CATEGORIES = [
  { id: "ทั้งหมด", label: "ทั้งหมด" },
  { id: "ปืนเจลไฟฟ้า", label: "ปืนเจลไฟฟ้า", sub: GUN_SUBCATEGORIES },
  { id: "อุปกรณ์เสริม", label: "อุปกรณ์เสริม", sub: ACCESSORY_SUBCATEGORIES },
  {
    id: "ชุดที่ชาร์จและแบตเตอรี่",
    label: "ชุดที่ชาร์จและแบตเตอรี่",
    sub: BATTERY_SUBCATEGORIES,
  },
  { id: "ลูกกระสุนเจล", label: "ลูกกระสุนเจล", sub: GEL_BALL_SUBCATEGORIES },
];


const renderTitle = (title: string, navbar: boolean = false) => {
  if (title.includes('-')) {
    const parts = title.split('-');
    const firstPart = parts[0];
    const rest = parts.slice(1).join('-');
    
    if (navbar) {
      return (
        <>
          {firstPart}-
          <span className="text-tactical-red group-hover:text-white transition-colors">
            {rest}
          </span>
        </>
      );
    }
    
    return (
      <>
        {firstPart}-<span className="text-tactical-red">{rest}</span>
      </>
    );
  }
  return title;
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max = 800; // max size to prevent localStorage quota issues

        if (width > height) {
          if (width > max) {
            height = Math.round(height * (max / width));
            width = max;
          }
        } else {
          if (height > max) {
            width = Math.round(width * (max / height));
            height = max;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8)); // 0.8 quality jpeg
        } else {
          // Fallback if canvas context fails
          resolve(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [priceCategory, setPriceCategory] = useState("ทั้งหมด");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "ปืนเจลไฟฟ้า",
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [chickenEffectEnabled, setChickenEffectEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLoadingTransition, setShowLoadingTransition] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          return { email: parsed.email };
        } else {
          localStorage.removeItem('userSession');
        }
      } catch (e) {
      }
    }
    return null;
  });
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("overview");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot_password" | "email_sent">("login");
  const [captchaNum1, setCaptchaNum1] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaNum2, setCaptchaNum2] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('siteSettingsCache');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return { logo: '/logo.jpg', title: 'KooK-RSiam' };
  });
  const [orders, setOrders] = useState<any[]>([]); // No mock data
  const [products, setProducts] = useState<Product[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const isAdminUser = user?.email?.toLowerCase() === 'admin@kook.com' || user?.email?.toLowerCase() === 'banphaiitel16@gmail.com' || user?.email?.toLowerCase() === 'admin2@kook.com' || user?.email?.toLowerCase() === 'admin99@kook.com' || user?.email?.toLowerCase() === 'assistant@kook.com';

  useEffect(() => {
    // Auto-create default admin account to prevent password issues
    import('firebase/auth').then(({ createUserWithEmailAndPassword }) => {
      createUserWithEmailAndPassword(auth, 'admin99@kook.com', '123456')
        .then(async (userCredential) => {
          try {
            await setDoc(doc(db, "users", userCredential.user.uid), {
              email: 'admin99@kook.com',
              id: userCredential.user.uid
            });
          } catch (e) {}
        })
        .catch(() => {}); // Ignore error if it already exists

      createUserWithEmailAndPassword(auth, 'assistant@kook.com', '123456')
        .then(async (userCredential) => {
          try {
            await setDoc(doc(db, "users", userCredential.user.uid), {
              email: 'assistant@kook.com',
              id: userCredential.user.uid
            });
          } catch (e) {}
        })
        .catch(() => {}); // Ignore error if it already exists
    });
  }, []);

  useEffect(() => {
    let unsubs: any[] = [];
    
    // Auth Listener
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && fbUser.email) {
        setUser({ email: fbUser.email });
        loadAndMigrateData(); // Trigger migration if they just logged in
      } else {
        setUser(null);
      }
    });
    unsubs.push(unsubAuth);

    const loadAndMigrateData = async () => {
      try {
        const hasMigrated = localStorage.getItem('fb_migrated');
        
        if (!hasMigrated && auth.currentUser) {
          // Migration from localforage to Firestore
          let savedProducts = await localforage.getItem<Product[]>('products');
          if (!savedProducts) {
             const lsProducts = localStorage.getItem('products');
             if (lsProducts) savedProducts = JSON.parse(lsProducts);
          }
          if (savedProducts && savedProducts.length > 0) {
             await Promise.all(savedProducts.map(p => setDoc(doc(db, "products", p.id), p)));
               
             let savedSettings = await localforage.getItem<any>('siteSettings');
             if (!savedSettings) {
               const lsSettings = localStorage.getItem('siteSettings');
               if (lsSettings) savedSettings = JSON.parse(lsSettings);
             }
             if (savedSettings) await setDoc(doc(db, "settings", "global"), savedSettings);

             let savedOrders = await localforage.getItem<any[]>('orders');
             if (!savedOrders) {
               const lsOrders = localStorage.getItem('orders');
               if (lsOrders) {
                  savedOrders = JSON.parse(lsOrders);
                  if(savedOrders) savedOrders = savedOrders.filter(o => o.id !== 'ORD-001' && o.id !== 'ORD-002');
               }
             }
             if (savedOrders && savedOrders.length > 0) {
                await Promise.all(savedOrders.map(o => setDoc(doc(db, "orders", o.id), o)));
             }
             localStorage.setItem('fb_migrated', 'true');
             alert('ข้อมูลเก่าถูกอัปโหลดไปยังระบบ Firestore สำเร็จแล้ว!');
          } else {
             localStorage.setItem('fb_migrated', 'true'); // Nothing to migrate
          }
        }
      } catch (e) {
         console.error("Migration check failed", e);
      }
      setIsDataLoaded(true);

      // Setup Listeners
      const unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
        if (!snap.empty) {
          setProducts(snap.docs.map(d => d.data() as Product));
        } else {
          setProducts([]);
        }
      }, (err) => handleFirestoreError(err, OperationType.LIST, "products"));
      unsubs.push(unsubProducts);

      const unsubSettings = onSnapshot(doc(db, "settings", "global"), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSiteSettings(data as any);
          localStorage.setItem('siteSettingsCache', JSON.stringify(data));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, "settings/global"));
      unsubs.push(unsubSettings);

      const unsubReviews = onSnapshot(collection(db, "reviews"), (snap) => {
        setReviews(snap.docs.map(d => d.data() as Review));
      }, (err) => handleFirestoreError(err, OperationType.LIST, "reviews"));
      unsubs.push(unsubReviews);
    };

    loadAndMigrateData();

    return () => {
      unsubs.forEach(u => u());
    };
  }, []);

  useEffect(() => {
    let unsubs: any[] = [];
    if (user) {
      const ordersRef = collection(db, "orders");
      const ordersQuery = isAdminUser ? ordersRef : query(ordersRef, where("user", "==", user.email));
      
      const unsubOrders = onSnapshot(ordersQuery, (snap) => {
        setOrders(snap.docs.map(d => d.data() as any));
      }, (err) => {
        if (err.message.includes('permission')) {
          setOrders([]);
        } else {
          handleFirestoreError(err, OperationType.LIST, "orders");
        }
      });
      unsubs.push(unsubOrders);

      if (isAdminUser) {
        const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
          setAllUsers(snap.docs.map(d => d.data() as {email: string, id: string}));
        }, (err) => {
          if (err.message.includes('permission')) {
            setAllUsers([]);
          } else {
            handleFirestoreError(err, OperationType.LIST, "users");
          }
        });
        unsubs.push(unsubUsers);
      } else {
        setAllUsers([]);
      }
    } else {
      setOrders([]);
      setAllUsers([]);
    }

    return () => {
      unsubs.forEach(u => u());
    };
  }, [user, isAdminUser]);

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingSettings, setEditingSettings] = useState<{logo: string, title: string} | null>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  
  // We remove localforage `useEffect` saving.
  
  const handleSaveProduct = async (p: any) => {
    try {
      if (!p.id) p.id = 'PROD-' + Date.now();
      await setDoc(doc(db, "products", p.id), p);
      setEditingProduct(null);
    } catch(e) {
      handleFirestoreError(e, OperationType.WRITE, `products/${p.id}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch(e) {
      handleFirestoreError(e, OperationType.DELETE, `products/${id}`);
    }
  };

  const handleSaveOrder = async (o: any) => {
    try {
      if (!o.id) o.id = 'ORD-' + Date.now();
      await setDoc(doc(db, "orders", o.id), o);
      setEditingOrder(null);
    } catch(e) {
      handleFirestoreError(e, OperationType.WRITE, `orders/${o.id}`);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "orders", id));
    } catch(e) {
      handleFirestoreError(e, OperationType.DELETE, `orders/${id}`);
    }
  };

  const handleSaveSettings = async () => {
    if (editingSettings) {
      try {
        await setDoc(doc(db, "settings", "global"), editingSettings);
        // Do not clear editingSettings so the form remains visible
      } catch(e) {
        handleFirestoreError(e, OperationType.WRITE, `settings/global`);
      }
    }
  };

  const [allUsers, setAllUsers] = useState<{email: string, id: string}[]>([]);
  useEffect(() => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer("");
    setCaptchaError(false);
  }, [authMode]);


  useEffect(() => {
    if (user) {
      const existingSession = localStorage.getItem('userSession');
      if (rememberMe || existingSession) {
        const expiresAt = Date.now() + 21 * 24 * 60 * 60 * 1000; // 3 weeks
        localStorage.setItem('userSession', JSON.stringify({ email: user.email, expiresAt }));
      }
    } else {
      localStorage.removeItem('userSession');
    }
  }, [user, rememberMe]);

  const handleLoginSuccess = (email: string) => {
    setShowLoadingTransition(true);
    setTimeout(() => {
      setUser({ email: email.toLowerCase() });
      setShowLoadingTransition(false);
    }, 2500);
  };

  const [chickens, setChickens] = useState<
    { id: number; x: number; y: number; endX: number; endY: number; rotation: number }[]
  >([]);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMode, setContactMode] = useState<"buy" | "save" | "general">("general");
  const [contactProduct, setContactProduct] = useState<Product | null>(null);

  const handleContactClick = (mode: "buy" | "save" | "general", product?: Product) => {
    setContactMode(mode);
    if (product) setContactProduct(product);
    else setContactProduct(selectedProduct);
    setIsContactModalOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        showToast("เพิ่มลงรายการโปรดแล้ว");
        return [...prev, productId];
      }
    });
  };



  const handleGlobalClick = (e: React.MouseEvent) => {
    if (chickenEffectEnabled && !isSettingsOpen) {
      const audio = new Audio(
        "https://actions.google.com/sounds/v1/animals/chicken_clucking.ogg",
      );
      audio.volume = 0.5;
      audio.play().catch((err) => console.log("Audio playback failed", err));

      const newChickens = Array.from({ length: 6 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 40;
        return {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          endX: e.clientX + Math.cos(angle) * distance,
          endY: e.clientY + Math.sin(angle) * distance + 30, // slight gravity effect
          rotation: Math.random() * 360,
        };
      });
      
      setChickens((prev) => [...prev, ...newChickens]);

      setTimeout(() => {
        const newIds = newChickens.map((c) => c.id);
        setChickens((prev) => prev.filter((c) => !newIds.includes(c.id)));
      }, 800);
    }
  };

  const displayedProducts = isAdminUser ? products : products.filter(p => p.isPublished !== false);

  const searchDropdownProducts = searchQuery
    ? displayedProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const filteredProducts = displayedProducts.filter((p) => {
    const matchesCategory =
      activeCategory === "ทั้งหมด"
        ? true
        : activeCategory === "ปืนเจลไฟฟ้า"
          ? GUN_SUBCATEGORIES.includes(p.category)
          : activeCategory === "อุปกรณ์เสริม"
            ? ACCESSORY_SUBCATEGORIES.includes(p.category) ||
              p.category === "อุปกรณ์เสริม"
            : activeCategory === "ชุดที่ชาร์จและแบตเตอรี่"
              ? BATTERY_SUBCATEGORIES.includes(p.category) ||
                p.category === "ชุดที่ชาร์จและแบตเตอรี่"
              : activeCategory === "ลูกกระสุนเจล"
                ? GEL_BALL_SUBCATEGORIES.includes(p.category) ||
                  p.category === "ลูกกระสุนเจล"
                : p.category === activeCategory;

    
    const matchesPrice = 
      priceCategory === "ทั้งหมด" ? true :
      priceCategory === "<1000" ? p.price < 1000 :
      priceCategory === "1000-3000" ? p.price >= 1000 && p.price <= 3000 :
      priceCategory === ">3000" ? p.price > 3000 : true;

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesPrice && matchesSearch;
  });

  if (showLoadingTransition) {
    return (
      <div className="min-h-screen bg-tactical-black font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-tactical-black to-tactical-black pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center gap-8"
        >
          {/* Logo with pulsating effect */}
          <motion.div 
            animate={{ 
              opacity: [0.7, 1, 0.7],
              scale: [0.98, 1.02, 0.98]
            }} 
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
            className="w-40 h-40 md:w-56 md:h-56 rounded-[2rem] overflow-hidden flex items-center justify-center bg-black border border-zinc-800 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
          >
            <img 
              src={siteSettings.logo || undefined} 
              alt="Logo" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }} 
            />
            {/* Fallback text if logo image is missing */}
            <div className="hidden text-white font-bold text-3xl text-center">{siteSettings.title}</div>
          </motion.div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-10 h-10 border-t-2 border-r-2 border-tactical-red rounded-full"
            />
            <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase animate-pulse">กำลังเตรียมระบบ...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-tactical-black font-sans selection:bg-tactical-red selection:text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-tactical-black to-tactical-black pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md bg-tactical-gray border border-zinc-800 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col z-10"
        >
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-16 h-16 bg-tactical-red rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-display font-bold text-white mb-2">
              {authMode === 'login' ? 'เข้าสู่ระบบ' : 
               authMode === 'register' ? 'สมัครสมาชิก' : 
               authMode === 'forgot_password' ? 'ลืมรหัสผ่าน' : 
               'ตรวจสอบอีเมล'}
            </h3>
            <p className="text-zinc-400 text-sm text-center">
              {authMode === 'login' ? 'กรุณาเข้าสู่ระบบเพื่อใช้งาน KooK-RSiam' : 
               authMode === 'register' ? 'สมัครสมาชิกเพื่อเริ่มต้นใช้งานระบบ' : 
               authMode === 'forgot_password' ? 'กรุณากรอกอีเมลที่ใช้สมัครสมาชิก' :
               'เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณแล้ว'}
            </p>
          </div>

            {authError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-medium px-4 py-3 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
              {authError.includes('operation-not-allowed') && (
                <div className="mt-2 text-xs text-zinc-400 leading-relaxed border-t border-red-500/20 pt-2">
                  <p className="font-bold text-white mb-1">วิธีแก้ไข:</p>
                  1. ไปที่ <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`} target="_blank" rel="noreferrer" className="text-blue-400 underline">Firebase Console</a><br />
                  2. คลิก "Add new provider"<br />
                  3. เลือก "Email/Password" และเปิดใช้งาน (Enable) จากนั้นกด Save
                </div>
              )}
            </div>
          )}

          
          <form onSubmit={async (e) => {
            e.preventDefault();
            
            const resetCurrentCaptcha = () => {
              setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
              setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
              setCaptchaAnswer("");
            };

            if (authMode !== 'email_sent') {
              if (parseInt(captchaAnswer) !== captchaNum1 + captchaNum2) {
                setCaptchaError(true);
                resetCurrentCaptcha();
                return;
              }
            }
            
            if (authMode === 'forgot_password') {
              if (loginEmail) {
                sendPasswordResetEmail(auth, loginEmail)
                  .then(() => {
                    setAuthMode('email_sent');
                  })
                  .catch((error) => {
                    if (error.code === 'auth/network-request-failed') {
                      setAuthError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต");
                    } else {
                      setAuthError(error.message);
                    }
                    resetCurrentCaptcha();
                  });
                return;
              }
            }
            
            if (loginEmail && loginPassword) {
              const cleanedInput = loginEmail.trim().toLowerCase();
              let actualEmail = cleanedInput;
              if (cleanedInput === 'admin') actualEmail = 'admin@kook.com';
              if (cleanedInput === 'admin2') actualEmail = 'admin2@kook.com';
              if (cleanedInput === 'admin99') actualEmail = 'admin99@kook.com';

              try {
                if (authMode === 'login') {
                  try {
                    await signInWithEmailAndPassword(auth, actualEmail, loginPassword);
                    handleLoginSuccess(actualEmail);
                  } catch (error: any) {
                    if ((error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email')) {
                      if (['admin@kook.com', 'banphaiitel16@gmail.com', 'admin2@kook.com', 'admin99@kook.com'].includes(actualEmail)) {
                        // Auto-register admin if they log in for the first time
                        try {
                          const userCredential = await createUserWithEmailAndPassword(auth, actualEmail, loginPassword);
                          try {
                            await setDoc(doc(db, "users", userCredential.user.uid), {
                              email: actualEmail,
                              id: userCredential.user.uid
                            });
                          } catch (e) {}
                          handleLoginSuccess(actualEmail);
                          return;
                        } catch (err: any) {
                          if (err.code === 'auth/weak-password') {
                             setAuthError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
                          } else if (err.code === 'auth/email-already-in-use') {
                             setAuthError("รหัสผ่านไม่ถูกต้อง");
                          } else if (err.code === 'auth/network-request-failed') {
                             setAuthError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต");
                          } else {
                             setAuthError("เข้าสู่ระบบไม่สำเร็จ: " + err.message);
                          }
                          resetCurrentCaptcha();
                          return;
                        }
                      }
                      setAuthError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
                    } else if (error.code === 'auth/network-request-failed') {
                      setAuthError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต");
                    } else {
                      setAuthError("ข้อผิดพลาด: " + error.code);
                    }
                    resetCurrentCaptcha();
                  }
                } else if (authMode === 'register') {
                  if (loginPassword.length < 6) {
                    setAuthError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
                    resetCurrentCaptcha();
                    return;
                  }
                  
                  try {
                    const userCredential = await createUserWithEmailAndPassword(auth, actualEmail, loginPassword);
                    try {
                      await setDoc(doc(db, "users", userCredential.user.uid), {
                        email: actualEmail,
                        id: userCredential.user.uid
                      });
                    } catch (e) {
                      console.error('Failed to create user record', e);
                    }
                    handleLoginSuccess(actualEmail);
                  } catch (error: any) {
                    if (error.code === 'auth/email-already-in-use') {
                      setAuthError("อีเมลนี้ถูกใช้งานแล้ว");
                    } else if (error.code === 'auth/network-request-failed') {
                      setAuthError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต");
                    } else {
                      setAuthError(error.message);
                    }
                    resetCurrentCaptcha();
                  }
                }
                
                if (!authError) {
                  setLoginEmail("");
                  setLoginPassword("");
                }
              } catch (e) {
                console.error(e);
                setAuthError("เกิดข้อผิดพลาดในการดำเนินการ");
                resetCurrentCaptcha();
              }
            }
          }} className="flex flex-col gap-4">

            {authMode !== 'email_sent' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-300">อีเมล</label>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:outline-none focus:border-tactical-red focus:ring-1 focus:ring-tactical-red transition-all"
                  placeholder="กรอกอีเมลของคุณ"
                />
              </div>
            )}
            
            {(authMode === 'login' || authMode === 'register') && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-300">
                    รหัสผ่าน
                  </label>
                  {authMode === 'login' && <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('forgot_password'); setAuthError(''); }} className="flex-shrink-0 text-xs text-tactical-red hover:underline">ลืมรหัสผ่าน?</a>}
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:outline-none focus:border-tactical-red focus:ring-1 focus:ring-tactical-red transition-all"
                  placeholder="รหัสผ่านของคุณ"
                />
              </div>
            )}
            
            {(authMode === 'login' || authMode === 'register') && (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-tactical-red focus:ring-tactical-red focus:ring-offset-zinc-900"
                />
                <label htmlFor="rememberMe" className="text-sm text-zinc-400 select-none cursor-pointer">
                  จดจำการเข้าสู่ระบบ
                </label>
              </div>
            )}

            {authMode !== 'email_sent' && (
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-sm font-medium text-zinc-300">ยืนยันตัวตน (บวกเลข)</label>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono font-bold flex items-center justify-center min-w-[80px]">
                    {captchaNum1} + {captchaNum2}
                  </div>
                  <input
                    type="number"
                    required
                    value={captchaAnswer}
                    onChange={e => {
                      setCaptchaAnswer(e.target.value);
                      setCaptchaError(false);
                    }}
                    className={`w-full px-4 py-3 bg-zinc-900 border ${captchaError ? 'border-red-500' : 'border-zinc-800'} rounded-xl text-white outline-none focus:outline-none focus:border-tactical-red focus:ring-1 focus:ring-tactical-red transition-all font-mono`}
                    placeholder="="
                  />
                </div>
                {captchaError && (
                  <span className="text-xs text-red-500 font-medium">คำตอบไม่ถูกต้อง กรุณาลองใหม่</span>
                )}
              </div>
            )}

            {authMode === 'email_sent' ? (
              <div className="flex flex-col gap-3 mt-2">
                <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className="w-full text-zinc-400 hover:text-white font-medium py-2 transition-colors cursor-pointer">
                  กลับไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            ) : (
              <>
                <button
                  type="submit"
                  className="mt-2 w-full bg-tactical-red hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_15px_rgba(230,57,70,0.3)] hover:shadow-[0_0_25px_rgba(230,57,70,0.5)] transition-all active:scale-[0.98] cursor-pointer"
                >
                  {authMode === 'login' ? 'เข้าสู่ระบบ' : 
                   authMode === 'register' ? 'สมัครสมาชิก' : 
                   'ส่งลิงก์ยืนยัน'}
                </button>
                
                <div className="text-center mt-2">
                  <p className="text-sm text-zinc-500">
                    {authMode === 'login' ? (
                      <>ยังไม่มีบัญชีใช่หรือไม่? <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className="text-tactical-red hover:underline focus:outline-none font-medium ml-1 cursor-pointer">สมัครสมาชิก</button></>
                    ) : authMode === 'register' ? (
                      <>มีบัญชีอยู่แล้วใช่หรือไม่? <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-tactical-red hover:underline focus:outline-none font-medium ml-1 cursor-pointer">เข้าสู่ระบบ</button></>
                    ) : (
                      <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-zinc-400 hover:text-white hover:underline focus:outline-none font-medium mt-2 cursor-pointer">กลับไปหน้าเข้าสู่ระบบ</button>
                    )}
                  </p>
                </div>
              </>
            )}
          </form>

          {authMode === 'login' && (
            <div className="mt-6 border-t border-zinc-800/50 pt-4 text-center opacity-0 pointer-events-none">
              {/* Login hint removed */}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-tactical-black font-sans selection:bg-tactical-red selection:text-white"
      onClick={handleGlobalClick}
    >
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-tactical-black/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white hover:text-tactical-red transition-colors cursor-pointer"
              >
                <Menu className="w-8 h-8" />
              </button>
              <button
                onClick={() => {
                  setActiveCategory("ทั้งหมด");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span className="font-display font-bold text-2xl tracking-tighter text-white group-hover:text-tactical-red transition-colors">
                  {renderTitle(siteSettings.title, true)}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-400 mr-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-tactical-red" />{" "}
                  ประกันศูนย์
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-tactical-red" /> ส่งด่วนพิเศษ
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-tactical-red" />{" "}
                  สั่งผ่าน LINE
                </span>
              </div>
              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchExpanded ? (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="relative"
                    >
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="ค้นหาสินค้า..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => {
                          setTimeout(() => setIsSearchFocused(false), 200);
                          if (!searchQuery) setIsSearchExpanded(false);
                        }}
                        autoFocus
                        className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-white text-sm focus:outline-none focus:border-tactical-red focus:ring-1 focus:ring-tactical-red transition-all w-[180px] sm:w-[240px] placeholder:text-zinc-600"
                      />
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsSearchExpanded(true)}
                      className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors mx-2 cursor-pointer"
                    >
                      <Search className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {isSearchFocused && searchQuery.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-3 right-0 w-[280px] sm:w-[350px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-[100] flex flex-col max-h-[400px]"
                    >
                      {searchDropdownProducts.length > 0 ? (
                        <div className="overflow-y-auto p-2">
                          {searchDropdownProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors"
                              onMouseDown={() => {
                                setSelectedProduct(product);
                                setActiveImageIndex(0);
                                setSearchQuery("");
                              }}
                            >
                              <img
                                src={product.image || undefined}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                              />
                              <div className="flex-col overflow-hidden w-full">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="text-sm font-bold text-white truncate max-w-[180px]">
                                    {product.name}
                                  </div>
                                  {product.isOffSale && (
                                    <span className="text-[9px] bg-red-600 border border-red-500 font-bold text-white px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap">
                                      สินค้าหมด
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-tactical-red font-medium">
                                  ฿{product.price.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-zinc-500">
                          ไม่พบสินค้าที่ค้นหา
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <button
                className="text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer relative"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-tactical-red text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-tactical-red text-white font-bold cursor-pointer hover:bg-red-600 transition-colors">
                    {user.email.charAt(0).toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsAccountMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 pointer-events-auto"
                        >
                          <div className="p-3 border-b border-zinc-800 text-sm text-white truncate bg-zinc-950/50">
                            {user.email}
                          </div>
                          <button
                            onClick={() => { setIsAccountMenuOpen(false); setIsProfileOpen(true); }}
                            className="w-full flex items-center gap-2 p-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                          >
                            <User className="w-4 h-4" />
                            โปรไฟล์ของฉัน
                          </button>
                          {isAdminUser && (
                            <button
                              onClick={() => { setIsAccountMenuOpen(false); setIsAdminDashboardOpen(true); }}
                              className="w-full flex items-center gap-2 p-3 text-sm text-tactical-red hover:bg-zinc-800 transition-colors text-left cursor-pointer border-t border-zinc-800/50"
                            >
                              <ShieldAlert className="w-4 h-4" />
                              ระบบหลังบ้าน
                            </button>
                          )}
                          <button
                            onClick={() => { setIsAccountMenuOpen(false); setUser(null); }}
                            className="w-full flex items-center gap-2 p-3 text-sm text-red-400 hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            ออกจากระบบ
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-[300px] max-w-full bg-tactical-gray border-r border-zinc-800 shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-zinc-800">
              <span className="font-display font-bold text-xl tracking-tighter text-white">
                หมวดหมู่สินค้า
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((category) => (
                  <div key={category.id} className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        if (category.sub) {
                          setExpandedCategory(
                            expandedCategory === category.id
                              ? null
                              : category.id,
                          );
                          setActiveCategory(category.id);
                        } else {
                          setActiveCategory(category.id);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className={`px-4 py-3 rounded-lg font-bold text-left transition-colors flex items-center justify-between ${
                        activeCategory === category.id
                          ? "bg-tactical-red text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                          : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{category.label}</span>
                      </div>
                      {category.sub ? (
                        expandedCategory === category.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )
                      ) : (
                        activeCategory === category.id && (
                          <Crosshair className="w-4 h-4" />
                        )
                      )}
                    </button>
                    {category.sub && expandedCategory === category.id && (
                      <div className="flex flex-col gap-1 pl-4 ml-2 mt-1 border-l-2 border-zinc-800">
                        {category.sub.map((subItem) => (
                          <button
                            key={subItem}
                            onClick={() => {
                              setActiveCategory(subItem);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium text-sm text-left transition-colors flex items-center justify-between ${
                              activeCategory === subItem
                                ? "text-tactical-red bg-zinc-900/80 shadow-sm"
                                : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                            }`}
                          >
                            <span>{subItem}</span>
                            {activeCategory === subItem && (
                              <Crosshair className="w-3 h-3 text-tactical-red" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 tactical-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-tactical-red/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight uppercase"
          >
            Tactical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tactical-red to-orange-500">
              Gel Blasters
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium"
          >
            คลังแสงเจลบลาสเตอร์ที่ครบที่สุด สินค้าคุณภาพสูง พร้อมลงสนามจริง
            ตอบโจทย์ทั้งสายลุยและสายสะสม สั่งซื้อ หรือ ทยอยออมเงินได้เลย
          </motion.p>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-2 uppercase flex items-center gap-3">
              <div className="w-2 h-8 bg-tactical-red rounded-sm" />
              Arsenal
            </h2>
            <p className="text-zinc-400">เลือกอาวุธคู่กายของคุณ</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 ml-auto">
            {/* Desktop Categories */}
            <div className="hidden lg:flex flex-col gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                 {CATEGORIES.map(category => (
                   <button
                     key={category.id}
                     onClick={() => setActiveCategory(category.id)}
                     className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                       activeCategory === category.id || CATEGORIES.find(c => c.id === category.id)?.sub?.includes(activeCategory)
                         ? "bg-tactical-red text-white" 
                         : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                     }`}
                   >
                     {category.label}
                   </button>
                 ))}
              </div>
              
              {/* Desktop Subcategories */}
              {CATEGORIES.find(c => c.id === activeCategory || c.sub?.includes(activeCategory))?.sub && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide justify-end">
                  {CATEGORIES.find(c => c.id === activeCategory || c.sub?.includes(activeCategory))?.sub?.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setActiveCategory(sub)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeCategory === sub 
                          ? "bg-zinc-700 text-white border border-zinc-600" 
                          : "bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
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
        </div>

        {products.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-tactical-gray border border-zinc-800 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">ยังไม่มีสินค้าในขณะนี้</h3>
            <p className="text-zinc-500 max-w-sm">
              รอแอดมินอัพโหลดสินค้าเข้าระบบ ผู้ใช้งานจะสามารถเลือกชมและสั่งซื้อได้ที่นี่
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-tactical-gray border border-zinc-800 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">ไม่พบสินค้า</h3>
            <p className="text-zinc-500">
              ไม่พบสินค้าที่คุณกำลังค้นหา ลองเปลี่ยนคำค้นหาหรือหมวดหมู่
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onFavorite={() => toggleFavorite(product.id)}
                onContact={handleContactClick}
                onSelect={(product) => {
                  setSelectedProduct(product);
                  setActiveImageIndex(0);
                }}
              />
            ))}
          </div>
        )}

        {/* Savings Plan Section */}
        <div id="savings-plan" className="mt-24 mb-8 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="text-center mb-10 relative z-10">
            <div className="text-green-500 font-mono text-sm sm:text-base tracking-widest font-bold mb-2 uppercase">
              // Savings Plan
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tighter space-x-1"
              style={{ textShadow: "0 0 20px rgba(74,222,128,0.3)" }}
            >
              <span>ระบบ</span>
              <span className="text-green-400">ออมเงิน</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto px-4 leading-relaxed">
              อยากได้ปืนเจลแต่งบยังไม่พอ? ออมกับเราได้ง่ายๆ
              <br className="hidden sm:block" />
              ผ่าน LINE
            </p>
          </div>

          <div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 relative z-10">
            {[
              {
                icon: (
                  <Package
                    className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-3"
                    strokeWidth={1.5}
                  />
                ),
                title: "เลือกสินค้า",
                description: "เลือกปืนเจลที่ต้องการจากหน้าเว็บ",
              },
              {
                icon: (
                  <MessageCircle
                    className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-3"
                    strokeWidth={1.5}
                  />
                ),
                title: "ทัก LINE",
                description: "แอดไลน์ร้านเพื่อแจ้งความประสงค์",
              },
              {
                icon: (
                  <FileText
                    className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-3"
                    strokeWidth={1.5}
                  />
                ),
                title: "กรอกข้อมูล",
                description: "กรอกข้อมูลออมเงิน เลือกระยะเวลา",
              },
              {
                icon: (
                  <Wallet
                    className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-3"
                    strokeWidth={1.5}
                  />
                ),
                title: "โอนสะสม",
                description: "ทยอยโอนตามจำนวนวันที่ตกลง",
              },
              {
                icon: (
                  <PiggyBank
                    className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-3"
                    strokeWidth={1.5}
                  />
                ),
                title: "ครบยอด → จัดส่ง",
                description: "ครบยอดเมื่อไหร่ จัดส่งทันที",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-[#121212] border ${index === 0 ? "border-tactical-red/50" : "border-zinc-800"} rounded-xl p-6 sm:p-8 relative overflow-hidden text-center flex flex-col items-center cursor-pointer hover:border-tactical-red/80 hover:bg-[#161616] transition-colors duration-300 group shadow-lg`}
              >
                <div className="absolute top-0 left-0 w-12 h-12 sm:w-14 sm:h-14 bg-tactical-red flex items-start justify-start pl-2.5 pt-1.5 sm:pl-3 sm:pt-2 font-black text-white text-sm sm:text-base [clip-path:polygon(0_0,100%_0,0_100%)] z-10">
                  {index + 1}
                </div>
                <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-white font-bold text-lg sm:text-xl mb-1 sm:mb-2 relative z-10 group-hover:text-green-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm md:text-base relative z-10 group-hover:text-zinc-400 transition-colors">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-tactical-gray/50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
            <span className="font-display font-bold text-xl tracking-tighter text-white">
              {renderTitle(siteSettings.title)}
            </span>
          </div>
          <p className="text-zinc-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} {siteSettings.title}. All rights reserved.
            <br />
            Gel Blaster Tactical Store
          </p>
        </div>
      </footer>

      {/* Floating Contact Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* Facebook Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          onClick={handleFacebookAction}
          className="bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full w-14 h-14 shadow-[0_5px_20px_rgba(24,119,242,0.4)] hover:shadow-[0_8px_25px_rgba(24,119,242,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer group relative"
        >
          <Facebook className="w-7 h-7" />

          {/* Tooltip */}
          <div className="absolute right-[calc(100%+16px)] bg-zinc-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700 shadow-xl">
            ติดต่อผ่าน Facebook
          </div>
        </motion.button>

        {/* LINE Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          onClick={() => handleContactClick('general')}
          className="bg-[#06C755] hover:bg-[#05b34c] text-white rounded-full w-14 h-14 shadow-[0_5px_20px_rgba(6,199,85,0.4)] hover:shadow-[0_8px_25px_rgba(6,199,85,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer group relative"
        >
          <MessageCircle className="w-7 h-7" />

          {/* Tooltip */}
          <div className="absolute right-[calc(100%+16px)] bg-zinc-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700 shadow-xl">
            ติดต่อผ่าน LINE
          </div>
        </motion.button>
      </div>

      {/* Chicken Effect Layer */}
      {chickens.map((chicken) => (
        <motion.div
          key={chicken.id}
          initial={{
            opacity: 1,
            scale: 0,
            x: chicken.x,
            y: chicken.y,
            rotate: 0,
          }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1, 0.5],
            x: [chicken.x, chicken.endX],
            y: [chicken.y, chicken.endY],
            rotate: chicken.rotation,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed z-[9999] pointer-events-none text-xl mix-blend-normal"
          style={{ 
            left: "-12px", 
            top: "-12px" 
          }}
        >
          🐔
        </motion.div>
      ))}

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsSettingsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-tactical-gray border border-zinc-800 rounded-2xl shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-white">
                  ตั้งค่า (Settings)
                </h3>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors p-2 bg-zinc-900 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">
                      เอฟเฟคไก่ตอนกด (Chicken Effect)
                    </span>
                    <span className="text-zinc-500 text-xs mt-1">
                      มีเสียงไก่และเอฟเฟคตอนกดหน้าจอ
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setChickenEffectEnabled(!chickenEffectEnabled)
                    }
                    className={`w-14 h-7 rounded-full flex items-center transition-colors px-1 cursor-pointer outline-none flex-shrink-0 ${chickenEffectEnabled ? "bg-tactical-red" : "bg-zinc-700"}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform shadow-md ${chickenEffectEnabled ? "translate-x-7" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-4xl bg-tactical-gray border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-tactical-red text-white p-2 rounded-full backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-1/2 relative bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex-shrink-0 flex flex-col">
                <div className="relative flex-grow h-64 sm:h-80 md:h-[calc(100%-80px)]">
                  <img
                    src={
                      (selectedProduct.images &&
                      selectedProduct.images.length > 0
                        ? selectedProduct.images[activeImageIndex]
                        : selectedProduct.image) || undefined
                    }
                    alt={selectedProduct.name}
                    className={`w-full h-full object-cover ${selectedProduct.isOffSale || selectedProduct.isComingSoon ? "grayscale opacity-70" : ""}`}
                  />
                  {selectedProduct.isOffSale && !selectedProduct.isComingSoon && (
                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-red-600/90 text-white font-black px-6 py-2 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl text-lg sm:text-2xl tracking-[0.2em] shadow-2xl transform -rotate-12 border border-red-500/50 uppercase">
                        สินค้าหมดชั่วคราว
                      </div>
                    </div>
                  )}
                  {selectedProduct.isComingSoon && (
                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-blue-600/90 text-white font-black px-6 py-2 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl text-lg sm:text-2xl tracking-[0.2em] shadow-2xl transform -rotate-12 border border-blue-500/50 uppercase">
                        เร็วๆนี้...
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80 md:hidden" />
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-tactical-red text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest shadow-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {(() => {
                  // Fallback to array with just the main image if images array is not provided or empty
                  // For demonstration, we'll repeat the main image to show the layout if no other images are available
                  const displayImages =
                    selectedProduct.images && selectedProduct.images.length > 0
                      ? selectedProduct.images.slice(0, 4)
                      : [
                          selectedProduct.image,
                          selectedProduct.image,
                          selectedProduct.image,
                          selectedProduct.image,
                        ].slice(0, 4);

                  return (
                    <div className="h-20 bg-zinc-950 p-2 flex gap-2 overflow-x-auto">
                      {displayImages.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-16 h-16 sm:w-20 sm:h-full flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${activeImageIndex === idx ? "border-tactical-red opacity-100" : "border-zinc-800 opacity-50 hover:opacity-100 hover:border-zinc-600"}`}
                        >
                          <img
                            src={img || undefined}
                            alt={`thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <div className="uppercase tracking-widest text-xs font-bold text-tactical-red">
                    {selectedProduct.category}
                  </div>
                  <div className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                    รหัสสินค้า: {selectedProduct.id}
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                  {selectedProduct.name}
                </h2>

                <div className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                  ฿{selectedProduct.price.toLocaleString()}
                </div>

                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl">
                    <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-tactical-red" />{" "}
                      การรับประกัน
                    </div>
                    <div className="text-white font-medium text-sm">
                      รับประกัน 1 ปี
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl">
                    <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-tactical-red" /> การจัดส่ง
                    </div>
                    <div className="text-white font-medium text-sm">
                      จัดส่งด่วนพิเศษ
                    </div>
                  </div>
                </div>

                {/* Mock Reviews Section */}
                <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 text-sm">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-tactical-red fill-tactical-red" />
                    รีวิวจากผู้ซื้อ (4.8/5)
                  </h4>
                  <div className="space-y-4">
                    {reviews.filter(r => r.product_id === selectedProduct.id).map((review, i) => (
                      <div key={review.id + i} className="border-b border-zinc-800 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">{review.user.charAt(0)}</div>
                            <span className="text-zinc-300 font-medium text-sm">{review.user}</span>
                          </div>
                          <div className="flex text-tactical-red space-x-0.5">
                            {[1,2,3,4,5].map(star => <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-tactical-red' : 'text-zinc-700'}`} />)}
                          </div>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  {user ? (
                    <div className="mt-6 pt-4 border-t border-tactical-red/20">
                      <h4 className="text-white font-bold mb-3 text-sm">เขียนรีวิวของคุณ</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-zinc-400 text-sm">ให้คะแนน:</span>
                        <div className="flex text-tactical-red cursor-pointer">
                           {[1,2,3,4,5].map(star => (
                             <Star 
                               key={star} 
                               onClick={() => setNewReviewRating(star)}
                               className={`w-5 h-5 transition-transform hover:scale-110 ${star <= newReviewRating ? 'fill-tactical-red' : 'text-zinc-700'}`} 
                             />
                           ))}
                        </div>
                      </div>
                      <textarea
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="พิมพ์รีวิวของคุณที่นี่..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-tactical-red mb-3 min-h-[80px]"
                      />
                      <button
                        onClick={async () => {
                          if (!newReviewComment.trim()) return;
                          
                          const newReview = {
                            id: Date.now().toString(),
                            product_id: selectedProduct.id,
                            user: user.email.split('@')[0],
                            rating: newReviewRating,
                            comment: newReviewComment,
                            date: "เมื่อสักครู่",
                          };
                          
                          try {
                            await setDoc(doc(db, "reviews", newReview.id), newReview);
                            setNewReviewComment("");
                            setNewReviewRating(5);
                          } catch(e) {
                            handleFirestoreError(e, OperationType.WRITE, `reviews/${newReview.id}`);
                          }
                        }}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                      >
                        ส่งรีวิว
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 pt-4 border-t border-zinc-800">
                      <p className="text-zinc-500 text-sm text-center">กรุณาเข้าสู่ระบบเพื่อเขียนรีวิว</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  {selectedProduct.isComingSoon ? (
                    <button
                      disabled
                      className="flex-1 py-4 px-6 rounded-xl font-bold bg-blue-900/40 text-blue-400 border border-blue-800/50 cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5 opacity-70" />
                      เร็วๆนี้...
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (!selectedProduct.isOffSale) handleContactClick('buy');
                        }}
                        disabled={selectedProduct.isOffSale}
                        className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${selectedProduct.isOffSale ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50" : "bg-tactical-red hover:bg-tactical-red-hover text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transform hover:-translate-y-1 cursor-pointer"}`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {selectedProduct.isOffSale
                          ? "สินค้าหมดชั่วคราว"
                          : "สั่งซื้อสินค้า"}
                      </button>
                      {!selectedProduct.isOffSale && (
                        <button
                          onClick={() => handleContactClick('save')}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-500 flex items-center justify-center gap-2 cursor-pointer py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <PiggyBank className="w-5 h-5" />
                          ออมเงิน
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && user && (
          <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsProfileOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-tactical-red" />
                  โปรไฟล์ของฉัน
                </h3>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 flex-1">
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-tactical-red flex items-center justify-center text-4xl font-bold text-white border-4 border-zinc-900 shadow-xl mb-4">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">{user.email}</h2>
                  <p className="text-zinc-400 text-sm">สมาชิก Kook-RSiam กองทัพสายซุ่ม</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3 max-h-64 overflow-y-auto hidden-scrollbar">
                  {orders.filter(o => o.user === user.email).length > 0 ? (
                    orders.filter(o => o.user === user.email).map((o: any) => (
                      <div key={o.id} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-left">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-zinc-300 font-mono text-xs">{o.id}</span>
                          <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${o.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{o.status}</span>
                        </div>
                        <div className="text-sm font-medium text-white mb-1">{o.items.join(', ')}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 text-xs">{o.date}</span>
                          <span className="text-tactical-red font-bold text-sm">฿{o.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center text-center p-4">
                      <p className="text-zinc-500 text-sm">
                        ไม่มีประวัติการสั่งซื้อ หรือ อยู่ระหว่างรอการอัปเดตจากผู้ดูแลระบบ
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      {/* Admin Dashboard Modal */}
      <AnimatePresence>
        {isAdminDashboardOpen && isAdminUser && (
          <div className="fixed inset-0 z-[200] bg-tactical-black flex flex-col overflow-hidden">
            {/* Admin Header */}
            <div className="h-16 border-b border-zinc-800 bg-zinc-950 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tactical-red rounded-xl flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold font-display leading-tight">Admin Console</h1>
                  <p className="text-xs text-zinc-400">{siteSettings.title} Management</p>
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
                  className={`flex flex-shrink-0 items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm font-medium transition-colors ${adminTab === 'overview' ? 'text-tactical-red border-b-2 md:border-b-0 md:border-r-2 border-tactical-red bg-tactical-red/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                >
                  <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
                  ภาพรวมระบบ
                </button>
                <button
                  onClick={() => setAdminTab("products")}
                  className={`flex flex-shrink-0 items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm font-medium transition-colors ${adminTab === 'products' ? 'text-tactical-red border-b-2 md:border-b-0 md:border-r-2 border-tactical-red bg-tactical-red/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                >
                  <Package className="w-4 h-4 md:w-5 md:h-5" />
                  จัดการสินค้า
                </button>
                <button
                  onClick={() => setAdminTab("users")}
                  className={`flex flex-shrink-0 items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm font-medium transition-colors ${adminTab === 'users' ? 'text-tactical-red border-b-2 md:border-b-0 md:border-r-2 border-tactical-red bg-tactical-red/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                >
                  <Users className="w-4 h-4 md:w-5 md:h-5" />
                  จัดการผู้ใช้
                </button>
                <button
                  onClick={() => setAdminTab("orders")}
                  className={`flex flex-shrink-0 items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm font-medium transition-colors ${adminTab === 'orders' ? 'text-tactical-red border-b-2 md:border-b-0 md:border-r-2 border-tactical-red bg-tactical-red/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                  ประวัติการสั่งซื้อ
                </button>
                <button
                  onClick={() => { setAdminTab("settings"); setEditingSettings(siteSettings); }}
                  className={`flex flex-shrink-0 items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm font-medium transition-colors ${adminTab === 'settings' ? 'text-tactical-red border-b-2 md:border-b-0 md:border-r-2 border-tactical-red bg-tactical-red/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                  การตั้งค่าทั่วไป
                </button>
              </div>

              {/* Admin Content */}
              <div className="flex-1 overflow-y-auto bg-tactical-black p-4 md:p-6 lg:p-10">
                {adminTab === 'overview' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">ภาพรวมระบบ (Dashboard)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-zinc-400 text-sm">ผู้ใช้ทั้งหมด</p>
                            <h3 className="text-2xl font-bold text-white">{allUsers.length}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-tactical-red/10 text-tactical-red rounded-xl">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-zinc-400 text-sm">สินค้าในระบบ</p>
                            <h3 className="text-2xl font-bold text-white">{products.length}</h3>
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
                            <h3 className="text-2xl font-bold text-white">{orders.length}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {adminTab === 'products' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">จัดการสินค้า</h2>
                      <button onClick={() => setEditingProduct({
                        id: 'PROD-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0'),
                        name: '',
                        price: 0,
                        description: '',
                        image: '',
                        images: [],
                        tags: [],
                        category: '',
                        isOffSale: false,
                        isComingSoon: false,
                        isPublished: false
                      })} className="bg-tactical-red hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer">
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
                            <tr key={p.id} className="hover:bg-zinc-800/50 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs">{p.id}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img src={p.image || undefined} alt={p.name} className="w-10 h-10 rounded object-cover bg-zinc-800" />
                                  <div className="flex flex-col">
                                    <span className="text-white font-medium">{p.name}</span>
                                    {p.isPublished === false && <span className="text-xs text-orange-500">ซ่อนจากหน้าร้าน</span>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-zinc-300">{p.category}</td>
                              <td className="px-6 py-4 text-tactical-red font-bold">฿{p.price.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right">
                                <button onClick={() => setEditingProduct(p)} className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer" title="แก้ไข">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer" title="ลบ">
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

                {adminTab === 'orders' && (
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
                                    <span className={`px-2 py-1 rounded text-xs ${o.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{o.status}</span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button onClick={() => setEditingOrder(o)} className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer" title="แก้ไข">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeleteOrder(o.id)} className="p-2 text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer" title="ลบ">
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
                    <h2 className="text-2xl font-bold text-white mb-6">ตั้งค่าทั่วไป (โลโก้แอพ / ชื่อร้านค้า)</h2>
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-xl">
                      {editingSettings && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-zinc-400 text-sm mb-2">อัพโหลดโลโก้ (App / Loading Logo)</label>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  compressImage(file).then(compressedUrl => {
                                    setEditingSettings({...editingSettings, logo: compressedUrl});
                                  });
                                }
                              }}
                              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tactical-red file:text-white hover:file:bg-tactical-red-hover cursor-pointer"
                            />
                            {editingSettings.logo && <img src={editingSettings.logo || undefined} alt="Logo preview" className="mt-4 h-16 object-contain rounded bg-zinc-800 p-1" />}
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


                {adminTab === 'users' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">จัดการผู้ใช้</h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
                      <table className="w-full text-left text-sm text-zinc-400 min-w-[500px]">
                        <thead className="bg-zinc-950/50 text-zinc-300 uppercase font-medium border-b border-zinc-800">
                          <tr>
                            <th className="px-6 py-4">ผู้ใช้</th>
                            <th className="px-6 py-4">สถานะ</th>
                            <th className="px-6 py-4 text-right">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          {allUsers.map(({email, id}) => (
                            <tr key={email} className="hover:bg-zinc-800/50 transition-colors">
                              <td className="px-6 py-4 text-white font-medium flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-tactical-red uppercase border border-zinc-700">
                                  {email?.charAt(0) || 'U'}
                                </div>
                                {email}
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  ใช้งานได้
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button onClick={() => alert("ไม่สามารถลบผู้ใช้ได้")} className="p-2 text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer" title="ลบบัญชี">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                              </td>
                            </tr>
                          ))}
                          {allUsers.length === 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
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
        )}
      </AnimatePresence>
\n      {/* Product Editing Modal */}
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
                <h3 className="font-display font-bold text-xl text-white">แก้ไขสินค้า (Edit Product)</h3>
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
                    <label className="block text-zinc-400 text-sm mb-2">รหัสสินค้า (Product ID)</label>
                    <input 
                      type="text" 
                      value={editingProduct.id}
                      onChange={(e) => setEditingProduct({...editingProduct, id: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">ชื่อสินค้า</label>
                    <input 
                      type="text" 
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">ราคา (บาท)</label>
                    <input 
                      type="number" 
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value) || 0})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">หมวดหมู่</label>
                  <select 
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red appearance-none"
                  >
                    <option value="" disabled>-- หมวดหมู่เพนท์บอลไฟฟ้า --</option>
                    <option value="ปืนเจลไฟฟ้า">ปืนเจลไฟฟ้า (ทั่วไป)</option>
                    {GUN_SUBCATEGORIES.map(c => <option key={c} value={c}>- {c}</option>)}
                    
                    <option value="" disabled>-- อุปกรณ์ตกแต่งและอื่นๆ --</option>
                    <option value="อุปกรณ์เสริม">อุปกรณ์เสริม (ทั่วไป)</option>
                    {ACCESSORY_SUBCATEGORIES.map(c => <option key={c} value={c}>- {c}</option>)}
                    
                    <option value="ชุดที่ชาร์จและแบตเตอรี่">ชุดที่ชาร์จและแบตเตอรี่ (ทั่วไป)</option>
                    {BATTERY_SUBCATEGORIES.map(c => <option key={c} value={c}>- {c}</option>)}
                    
                    <option value="ลูกกระสุนเจล">ลูกกระสุนเจล (ทั่วไป)</option>
                    {GEL_BALL_SUBCATEGORIES.map(c => <option key={c} value={c}>- {c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">รายละเอียดสินค้า</label>
                  <textarea 
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-tactical-red h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">อัพโหลดรูปภาพหลัก</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        compressImage(file).then(compressedUrl => {
                          setEditingProduct({...editingProduct, image: compressedUrl});
                        });
                      }
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tactical-red file:text-white hover:file:bg-tactical-red-hover cursor-pointer"
                  />
                  {editingProduct.image && <img src={editingProduct.image || undefined} alt="Preview" className="h-16 mt-2 object-cover rounded bg-zinc-800" />}
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2">อัพโหลดรูปภาพเพิ่มเติม (เลือกได้หลายรูป)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        Promise.all(files.map(file => compressImage(file as File))).then(base64Images => {
                          setEditingProduct({...editingProduct, images: [...(editingProduct.images || []), ...base64Images]});
                        });
                      }
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                  />
                  {editingProduct.images && editingProduct.images.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                       {editingProduct.images.map((img: string, idx: number) => (
                         <div key={idx} className="relative inline-block flex-shrink-0 group">
                           <img src={img || undefined} alt={`Preview ${idx}`} className="h-16 w-16 object-cover rounded bg-zinc-800" />
                           <button 
                             onClick={(e) => { e.preventDefault(); const newImages = [...editingProduct.images!]; newImages.splice(idx, 1); setEditingProduct({...editingProduct, images: newImages}); }}
                             className="absolute -top-1 -right-1 bg-tactical-red rounded-full w-5 h-5 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <X className="w-3 h-3" />
                           </button>
                         </div>
                       ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-6 pt-4 border-t border-zinc-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingProduct.isPublished !== false}
                      onChange={(e) => setEditingProduct({...editingProduct, isPublished: e.target.checked})}
                      className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-tactical-red focus:ring-tactical-red focus:ring-offset-zinc-900"
                    />
                    <span className="text-zinc-300 text-sm font-medium">แสดงสินค้าบนหน้าร้าน</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingProduct.isOffSale}
                      onChange={(e) => setEditingProduct({...editingProduct, isOffSale: e.target.checked})}
                      className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-tactical-red focus:ring-tactical-red focus:ring-offset-zinc-900"
                    />
                    <span className="text-zinc-300 text-sm font-medium">หมดชั่วคราว</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingProduct.isComingSoon}
                      onChange={(e) => setEditingProduct({...editingProduct, isComingSoon: e.target.checked})}
                      className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-tactical-red focus:ring-tactical-red focus:ring-offset-zinc-900"
                    />
                    <span className="text-zinc-300 text-sm font-medium">เร็วๆ นี้</span>
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

      {/* Contact Mode Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-[120] flex justify-center items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsContactModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                <h3 className="font-display font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-tactical-red" />
                  เลือกช่องทางการติดต่อ
                </h3>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                {contactProduct && (
                  <div className="mb-6 bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
                    <img src={contactProduct.image || undefined} alt={contactProduct.name} className="w-12 h-12 rounded bg-zinc-800 object-cover" />
                    <div>
                      <div className="text-xs text-zinc-500 font-bold mb-0.5">
                        {contactMode === 'buy' ? 'สั่งซื้อสินค้า' : contactMode === 'save' ? 'แจ้งออมเงิน' : 'สอบถาม'}
                      </div>
                      <div className="text-white text-sm font-medium line-clamp-1">{contactProduct.name}</div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsContactModalOpen(false);
                      handleLineAction();
                    }}
                    className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg cursor-pointer"
                  >
                    <MessageCircle className="w-6 h-6" />
                    ติดต่อผ่าน LINE
                  </button>

                  <button
                    onClick={() => {
                      setIsContactModalOpen(false);
                      handleFacebookAction();
                    }}
                    className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg cursor-pointer"
                  >
                    <Facebook className="w-6 h-6" />
                    ติดต่อผ่าน Facebook
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-tactical-gray border border-zinc-700 shadow-2xl rounded-full px-6 py-3 flex items-center gap-3 w-max"
          >
            <div className="w-6 h-6 rounded-full bg-tactical-red text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(225,29,72,0.4)]">
              <Check className="w-3.5 h-3.5" />
            </div>
            <p className="text-white font-medium text-sm">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
