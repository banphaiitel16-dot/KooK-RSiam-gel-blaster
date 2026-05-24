/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  onSnapshot,
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { motion, AnimatePresence } from "motion/react";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}
interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}
function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: { userId: auth.currentUser?.uid },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  // Not throwing error to prevent app crash and instability from unhandled promises/observers
}

import {
  Crosshair,
  MessageCircle,
  PiggyBank,
  ShieldCheck,
  ShoppingCart,
  Zap,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Package,
  FileText,
  Wallet,
  Search,
  Facebook,
  Settings,
  User,
  LogOut,
  Heart,
  Check,
  Clock,
  Users,
  LayoutDashboard,
  BarChart3,
  Edit,
  Plus,
  Trash2,
  ShieldAlert,
  Save,
  Copy,
} from "lucide-react";
import { Product } from "./types";
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));

// link directly to the provided LINE OA
const handleLineAction = () => {
  window.open("https://lin.ee/ZlByXPo", "_blank");
};

// Facebook link for testing
const handleFacebookAction = () => {
  window.open("https://m.facebook.com/profile.php?id=61589357668189", "_blank");
};

const ProductCard = React.memo(
  ({
    product,
    onSelect,
    isFavorite,
    onFavorite,
    onContact,
    onCopyId,
    isHot = false,
  }: {
    product: Product;
    onSelect: (p: Product) => void;
    isFavorite: boolean;
    onFavorite: (p: Product) => void;
    onContact: (mode: "buy" | "save", p: Product) => void;
    onCopyId: (id: string, e: React.MouseEvent) => void;
    isHot?: boolean;
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
        {isHot && (
          <div className="absolute top-0 left-0 z-40 overflow-hidden w-[80px] h-[80px] pointer-events-none">
            <div className="absolute top-4 -left-6 w-[100px] h-[24px] bg-red-600 text-white text-[10px] font-bold tracking-wider flex items-center justify-center -rotate-45 shadow-md">
              HOT
            </div>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(product);
          }}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? "fill-tactical-red text-tactical-red" : ""}`}
          />
        </button>

        <div className="relative aspect-square overflow-hidden bg-zinc-900">
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
              {Array.from(new Set(product.tags)).map((tag) => (
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

        <div className="p-2 sm:p-4 flex flex-col flex-grow">
          <div className="mb-0.5 sm:mb-1 flex items-center gap-2">
            <span className="text-zinc-500 text-[9px] sm:text-[10px]">
              รหัสสินค้า SKU-{product.id.slice(0, 5).toUpperCase()}
            </span>
            <button
              onClick={(e) => onCopyId(product.id, e)}
              className="text-zinc-500 hover:text-white transition-colors"
              title="คัดลอกรหัสสินค้า"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
          <div className="flex justify-between items-start mb-1 sm:mb-2">
            <h3 className="font-display text-xs sm:text-base font-medium sm:font-bold text-white group-hover:text-tactical-red transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </div>
          {product.isPublished === false && (
            <span className="text-[10px] sm:text-xs font-bold text-orange-500 mb-1">
              ซ่อนจากหน้าร้าน
            </span>
          )}

          <div className="text-sm sm:text-lg font-display font-bold text-tactical-red mb-1 sm:mb-2 mt-auto">
            ฿{product.price.toLocaleString()}
          </div>

          <p className="text-zinc-500 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-4 flex-grow line-clamp-1 sm:line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-col xl:flex-row gap-1.5 sm:gap-2 mt-1 sm:mt-auto relative z-20">
            {product.isComingSoon ? (
              <button
                disabled
                className="flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-md font-bold text-[10px] sm:text-xs bg-blue-900/40 text-blue-400 border border-blue-800/50 cursor-not-allowed flex items-center justify-center gap-1"
              >
                <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70" />
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
                  className={`flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-md font-bold text-[10px] sm:text-xs transition-colors flex items-center justify-center gap-1 ${product.isOffSale ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50" : "bg-tactical-red hover:bg-tactical-red-hover text-white shadow-[0_0_10px_rgba(225,29,72,0.2)] cursor-pointer"}`}
                >
                  <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {product.isOffSale ? "สินค้าหมด" : "สั่งซื้อ"}
                </button>
                {!product.isOffSale && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onContact("save", product);
                    }}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 py-1.5 sm:py-2 px-1 sm:px-2 rounded-md font-bold text-[10px] sm:text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <PiggyBank className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    ออมเงิน
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  },
);

export const GUN_SUBCATEGORIES = ["ปืนพก", "ปืนไรเฟิลจู่โจม", "ลูกซอง", "ปืนกลมือ"];

export const ACCESSORY_SUBCATEGORIES = [
  "กริปมือจับ",
  "ขาทราย",
  "ศูนย์เล็ง",
  "ด้ามจับปืน",
  "เลเซอร์",
  "ไฟฉาย",
  "แม็กกาซีน",
  "อะไหล่ภายในปืน",
  "ปากกระบอกปืนแต่ง",
];

export const BATTERY_SUBCATEGORIES = ["แบต 7.4v", "แบต 11.1v", "สายชาร์จ"];

export const GEL_BALL_SUBCATEGORIES = ["แบบมาตรฐาน", "แบบแข็ง"];

const PRICE_CATEGORIES = [
  { id: "ทั้งหมด", label: "ทุกระดับราคา" },
  { id: "<1000", label: "ต่ำกว่า 1,000 บาท" },
  { id: "1000-3000", label: "1,000 - 3,000 บาท" },
  { id: ">3000", label: "มากกว่า 3,000 บาท" },
];

const getCategories = (bestSellerTitle?: string) => [
  { id: "ทั้งหมด", label: "ทั้งหมด" },
  { id: "สินค้าขายดี", label: `🔥 ${bestSellerTitle || "สินค้าขายดี"}` },
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
  if (title.includes("-")) {
    const parts = title.split("-");
    const firstPart = parts[0];
    const rest = parts.slice(1).join("-");

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
        const canvas = document.createElement("canvas");
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
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.8)); // 0.8 quality jpeg
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

export const checkIsAdmin = (email: string | null | undefined) => {
  if (!email) return false;
  const e = email.toLowerCase();
  return (
    e === "admin@kook.com" ||
    e === "assistant@kook.com"
  );
};

export const getCategoryPrefix = (category: string) => {
  if (category === "ปืนเจลไฟฟ้า" || GUN_SUBCATEGORIES.includes(category)) return "GB";
  if (category === "อุปกรณ์เสริม" || ACCESSORY_SUBCATEGORIES.includes(category)) return "AC";
  if (category === "ชุดที่ชาร์จและแบตเตอรี่" || BATTERY_SUBCATEGORIES.includes(category)) return "BT";
  if (category === "ลูกกระสุนเจล" || GEL_BALL_SUBCATEGORIES.includes(category)) return "GL";
  return "PR";
};

export const generateNextProductId = (category: string, existingProducts: Product[]) => {
  const prefix = getCategoryPrefix(category);
  const existingIds = existingProducts
    .map(p => p.id)
    .filter(id => id.toUpperCase().startsWith(`${prefix}-`))
    .map(id => parseInt(id.split('-')[1]) || 0);

  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  return `${prefix}-${(maxId + 1).toString().padStart(3, "0")}`;
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [priceCategory, setPriceCategory] = useState("ทั้งหมด");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "ทั้งหมด",
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

  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("overview");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, priceCategory, searchQuery]);
  const [authMode, setAuthMode] = useState<
    "login" | "register" | "forgot_password" | "email_sent"
  >("login");
  const [captchaNum1, setCaptchaNum1] = useState(
    Math.floor(Math.random() * 9) + 1,
  );
  const [captchaNum2, setCaptchaNum2] = useState(
    Math.floor(Math.random() * 9) + 1,
  );
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("siteSettingsCache");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { logo: "/logo.jpg", title: "KooK-RSiam" };
  });
  const [orders, setOrders] = useState<any[]>([]); // No mock data
  const [products, setProducts] = useState<Product[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const isAdminUser = checkIsAdmin(user?.email);

  useEffect(() => {
    let unsubs: any[] = [];

    // Auth Listener
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && fbUser.email) {
        // Only show transition if going from no user to user (logging in)
        setUser((prev) => {
          if (!prev) {
            setShowLoadingTransition(true);
            setTimeout(() => {
              setShowLoadingTransition(false);
            }, 2500);
          }
          return { email: fbUser.email! };
        });
      } else {
        setUser(null);
      }
    });
    unsubs.push(unsubAuth);

    setIsDataLoaded(true);

    // Setup Listeners
    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snap) => {
        setProducts(snap.docs.map((d) => d.data() as Product));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "products"),
    );
    unsubs.push(unsubProducts);

    const unsubSettings = onSnapshot(
      doc(db, "settings", "global"),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSiteSettings(data as any);
          localStorage.setItem("siteSettingsCache", JSON.stringify(data));
        }
      },
      (err) =>
        handleFirestoreError(err, OperationType.GET, "settings/global"),
    );
    unsubs.push(unsubSettings);

    return () => {
      unsubs.forEach((u) => u());
    };
  }, []);

  useEffect(() => {
    let unsubs: any[] = [];
    if (user) {
      const ordersRef = collection(db, "orders");
      const ordersQuery = isAdminUser
        ? ordersRef
        : query(ordersRef, where("user", "==", user.email));

      const unsubOrders = onSnapshot(
        ordersQuery,
        (snap) => {
          setOrders(snap.docs.map((d) => d.data() as any));
        },
        (err) => {
          if (err.message.includes("permission")) {
            setOrders([]);
          } else {
            handleFirestoreError(err, OperationType.LIST, "orders");
          }
        },
      );
      unsubs.push(unsubOrders);

      if (isAdminUser) {
        const unsubUsers = onSnapshot(
          collection(db, "users"),
          (snap) => {
            setAllUsers(
              snap.docs.map((d) => ({
                ...(d.data() as any),
                id: d.id,
              }) as { email: string; id: string }),
            );
          },
          (err) => {
            if (err.message.includes("permission")) {
              setAllUsers([]);
            } else {
              handleFirestoreError(err, OperationType.LIST, "users");
            }
          },
        );
        unsubs.push(unsubUsers);
      } else {
        setAllUsers([]);
      }
    } else {
      setOrders([]);
      setAllUsers([]);
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [user, isAdminUser]);

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingSettings, setEditingSettings] = useState<{
    logo: string;
    title: string;
    savingsPlanEnabled?: boolean;
    savingsPlanHeadline?: string;
    savingsPlanDesc?: string;
    bestSellerTitle?: string;
  } | null>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Migrate the user's latest products from localStorage to Firebase
  useEffect(() => {
    if (!isAdminUser || !isDataLoaded) return;
    
    const restoreLocalData = async () => {
      try {
        const restored = localStorage.getItem("restoredLocalData2");
        if (restored) return;

        console.log("Restoring products from local storage to Firebase...");
        const savedProducts = localStorage.getItem("products");
        if (savedProducts) {
          const localProducts = JSON.parse(savedProducts);
          if (Array.isArray(localProducts) && localProducts.length > 0) {
            for (const p of localProducts) {
              if (p.id) {
                await setDoc(doc(db, "products", p.id), p);
                console.log("Restored product:", p.id);
              }
            }
          }
        }
        localStorage.setItem("restoredLocalData2", "true");
      } catch (err) {
        console.error("Restore failed:", err);
      }
    };
    
    restoreLocalData();
  }, [isAdminUser, isDataLoaded]);


  const handleSaveProduct = async (p: any) => {
    try {
      if (!p.id) p.id = "PROD-" + Date.now();
      
      const isIdChanged = p.originalId && p.originalId !== p.id;
      
      if (isIdChanged) {
        // delete original document
        await deleteDoc(doc(db, "products", p.originalId));
      }
      
      const dataToSave = { ...p };
      delete dataToSave.originalId;
      delete dataToSave.isNew;

      await setDoc(doc(db, "products", p.id), dataToSave);
      setEditingProduct(null);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `products/${p.id}`);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setUserToDelete(id);
  };

  const executeDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${id}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `products/${id}`);
    }
  };

  const handleSaveOrder = async (o: any) => {
    try {
      if (!o.id) o.id = "ORD-" + Date.now();
      await setDoc(doc(db, "orders", o.id), o);
      setEditingOrder(null);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `orders/${o.id}`);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "orders", id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `orders/${id}`);
    }
  };

  const handleSaveSettings = async () => {
    if (editingSettings) {
      try {
        await setDoc(doc(db, "settings", "global"), editingSettings);
        // Do not clear editingSettings so the form remains visible
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `settings/global`);
      }
    }
  };

  const [allUsers, setAllUsers] = useState<{ email: string; id: string }[]>([]);
  useEffect(() => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer("");
    setCaptchaError(false);
  }, [authMode]);

  useEffect(() => {
    if (user) {
      const existingSession = localStorage.getItem("userSession");
      if (rememberMe || existingSession) {
        const expiresAt = Date.now() + 21 * 24 * 60 * 60 * 1000; // 3 weeks
        localStorage.setItem(
          "userSession",
          JSON.stringify({ email: user.email, expiresAt }),
        );
      }
    } else {
      localStorage.removeItem("userSession");
    }
  }, [user, rememberMe]);

  const handleLoginSuccess = (email: string) => {
    setUser((prev) => {
      if (!prev) {
        setShowLoadingTransition(true);
        setTimeout(() => {
          setShowLoadingTransition(false);
        }, 2500);
      }
      return { email: email.toLowerCase() };
    });
  };

  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMode, setContactMode] = useState<"buy" | "save" | "general">(
    "general",
  );
  const [contactProduct, setContactProduct] = useState<Product | null>(null);

  const handleContactClick = React.useCallback(
    (mode: "buy" | "save" | "general", product?: Product) => {
      setContactMode(mode);
      if (product) setContactProduct(product);
      else setContactProduct(selectedProduct);
      setIsContactModalOpen(true);
    },
    [selectedProduct],
  );

  const showToast = React.useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const toggleFavorite = React.useCallback(
    (productId: string) => {
      setFavorites((prev) => {
        if (prev.includes(productId)) {
          return prev.filter((id) => id !== productId);
        } else {
          showToast("เพิ่มลงรายการโปรดแล้ว");
          return [...prev, productId];
        }
      });
    },
    [showToast],
  );

  const handleCopyId = React.useCallback(
    (id: string, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      navigator.clipboard.writeText(id).then(() => {
        showToast("คัดลอกรหัสสินค้าเรียบร้อย");
      });
    },
    [showToast]
  );

  const handleFavoriteToggle = React.useCallback(
    (product: Product) => {
      toggleFavorite(product.id);
    },
    [toggleFavorite],
  );

  const handleProductSelect = React.useCallback((product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  }, []);

  const handleGlobalClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (chickenEffectEnabled && !isSettingsOpen) {
        const audio = new Audio(
          "https://actions.google.com/sounds/v1/animals/chicken_clucking.ogg",
        );
        audio.volume = 0.5;
        audio.play().catch((err) => console.log("Audio playback failed", err));

        for (let i = 0; i < 6; i++) {
          const el = document.createElement("div");
          el.textContent = "🐔";
          el.style.position = "fixed";
          el.style.left = "-12px";
          el.style.top = "-12px";
          el.style.fontSize = "1.25rem";
          el.style.pointerEvents = "none";
          el.style.zIndex = "9999";
          el.style.transition = "all 0.8s cubic-bezier(0, 0, 0.2, 1)";
          el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(0) rotate(0deg)`;
          el.style.opacity = "1";

          document.body.appendChild(el);

          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 80 + 40;
          const endX = e.clientX + Math.cos(angle) * distance;
          const endY = e.clientY + Math.sin(angle) * distance + 30; // slight gravity
          const rotation = Math.random() * 360;

          // Trigger reflow
          el.getBoundingClientRect();

          el.style.transform = `translate(${endX}px, ${endY}px) scale(0.5) rotate(${rotation}deg)`;
          el.style.opacity = "0";

          setTimeout(() => {
            if (document.body.contains(el)) {
              document.body.removeChild(el);
            }
          }, 800);
        }
      }
    },
    [chickenEffectEnabled, isSettingsOpen],
  );

  const deferredSearchQuery = React.useDeferredValue(searchQuery);

  const displayedProducts = React.useMemo(() => {
    return isAdminUser
      ? products
      : products.filter((p) => p.isPublished !== false);
  }, [isAdminUser, products]);

  const searchDropdownProducts = React.useMemo(() => {
    return deferredSearchQuery
      ? displayedProducts.filter(
          (p) =>
            (p.name || "").toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
            (p.description || "")
              .toLowerCase()
              .includes(deferredSearchQuery.toLowerCase()),
        )
      : [];
  }, [deferredSearchQuery, displayedProducts]);

  const filteredProducts = React.useMemo(() => {
    return displayedProducts.filter((p) => {
      const matchesCategory =
        activeCategory === "ทั้งหมด"
          ? true
          : activeCategory === "สินค้าขายดี"
            ? p.tags?.some((t) => t.toLowerCase().includes("ขายดี") || t.toLowerCase().includes("best seller") || t.toLowerCase().includes("bestseller"))
          : activeCategory === "ปืนเจลไฟฟ้า"
            ? GUN_SUBCATEGORIES.includes(p.category) || p.category === "ปืนเจลไฟฟ้า"
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
        priceCategory === "ทั้งหมด"
          ? true
          : priceCategory === "<1000"
            ? p.price < 1000
            : priceCategory === "1000-3000"
              ? p.price >= 1000 && p.price <= 3000
              : priceCategory === ">3000"
                ? p.price > 3000
                : true;

      const matchesSearch =
        (p.name || "").toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(deferredSearchQuery.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [displayedProducts, activeCategory, priceCategory, deferredSearchQuery]);

  const finalProducts = React.useMemo(() => {
    let result = filteredProducts;
      
    // Deduplicate by ID just in case
    const uniqueProducts = Array.from(new Map(result.map(p => [p.id, p])).values());
    return uniqueProducts;
  }, [activeCategory, priceCategory, deferredSearchQuery, filteredProducts]);

  const bestSellerProducts = React.useMemo(() => {
    return Array.from(
      new Map(
        displayedProducts
          .filter((p) =>
            p.tags?.some(
              (tag) =>
                tag.toLowerCase().includes("ขายดี") ||
                tag.toLowerCase().includes("best seller") ||
                tag.toLowerCase().includes("bestseller"),
            ),
          )
          .map((p) => [p.id, p]),
      ).values(),
    );
  }, [displayedProducts]);

  const totalPages = Math.ceil(finalProducts.length / 16);

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
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="w-40 h-40 md:w-56 md:h-56 rounded-[2rem] overflow-hidden flex items-center justify-center bg-black border border-zinc-800 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
          >
            <img
              key={`img-${siteSettings.logo}`}
              src={siteSettings.logo || undefined}
              alt="Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const helperText = (e.target as HTMLImageElement).nextElementSibling;
                if (helperText) {
                  helperText.classList.remove("hidden");
                }
              }}
            />
            {/* Fallback text if logo image is missing */}
            <div key={`text-${siteSettings.logo}`} className="hidden text-white font-bold text-3xl text-center">
              {siteSettings.title}
            </div>
          </motion.div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-10 h-10 border-t-2 border-r-2 border-tactical-red rounded-full"
            />
            <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase animate-pulse">
              กำลังเตรียมระบบ...
            </p>
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
              {authMode === "login"
                ? "เข้าสู่ระบบ"
                : authMode === "register"
                  ? "สมัครสมาชิก"
                  : authMode === "forgot_password"
                    ? "ลืมรหัสผ่าน"
                    : "ตรวจสอบอีเมล"}
            </h3>
            <p className="text-zinc-400 text-sm text-center">
              {authMode === "login"
                ? "กรุณาเข้าสู่ระบบเพื่อใช้งาน KooK-RSiam"
                : authMode === "register"
                  ? "สมัครสมาชิกเพื่อเริ่มต้นใช้งานระบบ"
                  : authMode === "forgot_password"
                    ? "กรุณากรอกอีเมลที่ใช้สมัครสมาชิก"
                    : "เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณแล้ว"}
            </p>
          </div>

          {authError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-medium px-4 py-3 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
              {authError.includes("operation-not-allowed") && (
                <div className="mt-2 text-xs text-zinc-400 leading-relaxed border-t border-red-500/20 pt-2">
                  <p className="font-bold text-white mb-1">วิธีแก้ไข:</p>
                  1. ไปที่{" "}
                  <a
                    href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline"
                  >
                    Firebase Console
                  </a>
                  <br />
                  2. คลิก "Add new provider"
                  <br />
                  3. เลือก "Email/Password" และเปิดใช้งาน (Enable) จากนั้นกด
                  Save
                </div>
              )}
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (authMode === "login" || authMode === "register") {
                if (parseInt(captchaAnswer) !== captchaNum1 + captchaNum2) {
                  setCaptchaError(true);
                  setAuthError("คำตอบ CAPTCHA ไม่ถูกต้อง");
                  return;
                }
                setCaptchaError(false);
              }

              if (authMode === "forgot_password") {
                if (loginEmail) {
                  sendPasswordResetEmail(auth, loginEmail)
                    .then(() => {
                      setAuthMode("email_sent");
                    })
                    .catch((error) => {
                      if (error.code === "auth/network-request-failed") {
                        setAuthError(
                          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต",
                        );
                      } else {
                        setAuthError(error.message);
                      }
                    });
                  return;
                }
              }

              if (loginEmail && loginPassword) {
                const cleanedInput = loginEmail.trim().toLowerCase();
                let actualEmail = cleanedInput;
                if (cleanedInput === "admin") actualEmail = "admin@kook.com";
                if (cleanedInput === "assistant") actualEmail = "assistant@kook.com";

                try {
                  if (authMode === "login") {
                    try {
                      await signInWithEmailAndPassword(
                        auth,
                        actualEmail,
                        loginPassword,
                      );
                      handleLoginSuccess(actualEmail);
                    } catch (error: any) {
                      if (
                        error.code === "auth/user-not-found" ||
                        error.code === "auth/invalid-credential" ||
                        error.code === "auth/invalid-email"
                      ) {
                        if (
                          [
                            "admin@kook.com",
                            "assistant@kook.com",
                          ].includes(actualEmail)
                        ) {
                          // Auto-register admin if they log in for the first time
                          try {
                            const userCredential =
                              await createUserWithEmailAndPassword(
                                auth,
                                actualEmail,
                                loginPassword,
                              );
                            try {
                              await setDoc(
                                doc(db, "users", userCredential.user.uid),
                                {
                                  email: actualEmail,
                                  id: userCredential.user.uid,
                                },
                              );
                            } catch (e) {}
                            handleLoginSuccess(actualEmail);
                            return;
                          } catch (err: any) {
                            if (err.code === "auth/weak-password") {
                              setAuthError(
                                "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
                              );
                            } else if (
                              err.code === "auth/email-already-in-use"
                            ) {
                              setAuthError("รหัสผ่านไม่ถูกต้อง");
                            } else if (
                              err.code === "auth/network-request-failed"
                            ) {
                              setAuthError(
                                "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต",
                              );
                            } else {
                              setAuthError(
                                "เข้าสู่ระบบไม่สำเร็จ: " + err.message,
                              );
                            }

                            return;
                          }
                        }
                        setAuthError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
                      } else if (error.code === "auth/network-request-failed") {
                        setAuthError(
                          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต",
                        );
                      } else {
                        setAuthError("ข้อผิดพลาด: " + error.code);
                      }
                    }
                  } else if (authMode === "register") {
                    if (loginPassword.length < 6) {
                      setAuthError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
                      return;
                    }

                    const isAdminSignup = checkIsAdmin(actualEmail);
                    if (!isAdminSignup) {
                      const hasRegistered = localStorage.getItem("hasRegisteredDevice");
                      if (hasRegistered === "true") {
                        setAuthError("อุปกรณ์นี้มีการสมัครสมาชิกไปแล้ว ไม่สามารถสมัครเพิ่มได้");
                        return;
                      }
                    }

                    try {
                      const userCredential =
                        await createUserWithEmailAndPassword(
                          auth,
                          actualEmail,
                          loginPassword,
                        );
                      
                      if (!isAdminSignup) {
                        localStorage.setItem("hasRegisteredDevice", "true");
                      }

                      try {
                        await setDoc(
                          doc(db, "users", userCredential.user.uid),
                          {
                            email: actualEmail,
                            id: userCredential.user.uid,
                          },
                        );
                      } catch (e) {
                        console.error("Failed to create user record", e);
                      }
                      handleLoginSuccess(actualEmail);
                    } catch (error: any) {
                      if (error.code === "auth/email-already-in-use") {
                        setAuthError("อีเมลนี้ถูกใช้งานแล้ว");
                      } else if (error.code === "auth/network-request-failed") {
                        setAuthError(
                          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต",
                        );
                      } else {
                        setAuthError(error.message);
                      }
                    }
                  }

                  if (!authError) {
                    setLoginEmail("");
                    setLoginPassword("");
                  }
                } catch (e) {
                  console.error(e);
                  setAuthError("เกิดข้อผิดพลาดในการดำเนินการ");
                }
              }
            }}
            className="flex flex-col gap-4"
          >
            {authMode !== "email_sent" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-300">
                  อีเมล
                </label>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:outline-none focus:border-tactical-red focus:ring-1 focus:ring-tactical-red transition-all"
                  placeholder="กรอกอีเมลของคุณ"
                />
              </div>
            )}

            {(authMode === "login" || authMode === "register") && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-300">
                    รหัสผ่าน
                  </label>
                  {authMode === "login" && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setAuthMode("forgot_password");
                        setAuthError("");
                      }}
                      className="flex-shrink-0 text-xs text-tactical-red hover:underline"
                    >
                      ลืมรหัสผ่าน?
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:outline-none focus:border-tactical-red focus:ring-1 focus:ring-tactical-red transition-all"
                  placeholder="รหัสผ่านของคุณ"
                />
              </div>
            )}

            {(authMode === "login" || authMode === "register") && (
              <>
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-sm font-medium text-zinc-300">
                    ยืนยันว่าคุณไม่ใช่บอท: {captchaNum1} + {captchaNum2} = ?
                  </label>
                  <input
                    type="number"
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className={`w-full px-4 py-3 bg-zinc-900 border ${captchaError ? 'border-red-500' : 'border-zinc-800'} rounded-xl text-white outline-none focus:outline-none focus:border-tactical-red focus:ring-1 focus:ring-tactical-red transition-all`}
                    placeholder="ใส่ผลลัพธ์ที่นี่"
                  />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-tactical-red focus:ring-tactical-red focus:ring-offset-zinc-900"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-zinc-400 select-none cursor-pointer"
                >
                  จดจำการเข้าสู่ระบบ
                </label>
              </div>
              </>
            )}

            {authMode === "email_sent" ? (
              <div className="flex flex-col gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                  className="w-full text-zinc-400 hover:text-white font-medium py-2 transition-colors cursor-pointer"
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            ) : (
              <>
                <button
                  type="submit"
                  className="mt-2 w-full bg-tactical-red hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_15px_rgba(230,57,70,0.3)] hover:shadow-[0_0_25px_rgba(230,57,70,0.5)] transition-all active:scale-[0.98] cursor-pointer"
                >
                  {authMode === "login"
                    ? "เข้าสู่ระบบ"
                    : authMode === "register"
                      ? "สมัครสมาชิก"
                      : "ส่งลิงก์ยืนยัน"}
                </button>

                <div className="text-center mt-2">
                  <p className="text-sm text-zinc-500">
                    {authMode === "login" ? (
                      <>
                        ยังไม่มีบัญชีใช่หรือไม่?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("register");
                            setAuthError("");
                          }}
                          className="text-tactical-red hover:underline focus:outline-none font-medium ml-1 cursor-pointer"
                        >
                          สมัครสมาชิก
                        </button>
                      </>
                    ) : authMode === "register" ? (
                      <>
                        มีบัญชีอยู่แล้วใช่หรือไม่?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("login");
                            setAuthError("");
                          }}
                          className="text-tactical-red hover:underline focus:outline-none font-medium ml-1 cursor-pointer"
                        >
                          เข้าสู่ระบบ
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("login");
                          setAuthError("");
                        }}
                        className="text-zinc-400 hover:text-white hover:underline focus:outline-none font-medium mt-2 cursor-pointer"
                      >
                        กลับไปหน้าเข้าสู่ระบบ
                      </button>
                    )}
                  </p>
                </div>
              </>
            )}
          </form>

          {authMode === "login" && (
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

              <button className="text-zinc-400 hover:text-tactical-red transition-colors cursor-pointer relative">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-tactical-red text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-tactical-red text-white font-bold cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsAccountMenuOpen(false)}
                        />
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
                            onClick={() => {
                              setIsAccountMenuOpen(false);
                              setIsProfileOpen(true);
                            }}
                            className="w-full flex items-center gap-2 p-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                          >
                            <User className="w-4 h-4" />
                            โปรไฟล์ของฉัน
                          </button>
                          {isAdminUser && (
                            <button
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                setIsAdminDashboardOpen(true);
                              }}
                              className="w-full flex items-center gap-2 p-3 text-sm text-tactical-red hover:bg-zinc-800 transition-colors text-left cursor-pointer border-t border-zinc-800/50"
                            >
                              <ShieldAlert className="w-4 h-4" />
                              ระบบหลังบ้าน
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setIsAccountMenuOpen(false);
                              setUser(null);
                            }}
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
                {getCategories(siteSettings.bestSellerTitle).map((category) => (
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

      {/* Best Seller Section */}
      {bestSellerProducts.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="flex items-center justify-center mb-8 gap-4">
            <div className="h-[1px] bg-zinc-600 flex-1 max-w-[100px] md:max-w-[200px]" />
            <h2 className="font-display text-xl md:text-2xl font-semibold text-white uppercase flex items-center justify-center gap-2 text-center break-words">
              {siteSettings.bestSellerTitle || "สินค้าขายดี"}
            </h2>
            <div className="h-[1px] bg-zinc-600 flex-1 max-w-[100px] md:max-w-[200px]" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hidden-scrollbar">
            {bestSellerProducts.map((product) => (
              <div key={`bestseller-${product.id}`} className="min-w-[180px] md:min-w-[240px] w-[180px] md:w-[240px] snap-start flex-shrink-0">
                <ProductCard
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onFavorite={handleFavoriteToggle}
                  onContact={handleContactClick}
                  onSelect={handleProductSelect}
                  onCopyId={handleCopyId}
                  isHot={true}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setActiveCategory("สินค้าขายดี");
                const el = document.getElementById("product-grid");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 rounded-full px-6 py-2 transition-colors text-sm"
            >
              ดูสินค้ามาแรงทั้งหมด
            </button>
          </div>
        </section>
      )}

      {/* Product Grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4 w-full">
          <div className="flex-shrink-0">
            <h2 className="font-display text-3xl font-bold text-white mb-2 uppercase flex items-center gap-3">
              <div className="w-2 h-8 bg-tactical-red rounded-sm" />
              Arsenal
            </h2>
            <p className="text-zinc-400">เลือกอาวุธคู่กายของคุณ</p>
          </div>
          <div className="flex flex-col xl:flex-row gap-4 w-full md:w-auto xl:ml-auto overflow-hidden">
            {/* Categories */}
            <div className="flex flex-col gap-3 overflow-hidden w-full">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 hidden-scrollbar w-full">
                {getCategories(siteSettings.bestSellerTitle).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                      activeCategory === category.id ||
                      getCategories(siteSettings.bestSellerTitle).find(
                        (c) => c.id === category.id,
                      )?.sub?.includes(activeCategory)
                        ? "bg-tactical-red text-white"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Subcategories */}
              {getCategories(siteSettings.bestSellerTitle).find(
                (c) =>
                  c.id === activeCategory || c.sub?.includes(activeCategory),
              )?.sub && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 hidden-scrollbar w-full xl:justify-end">
                  {getCategories(siteSettings.bestSellerTitle).find(
                    (c) =>
                      c.id === activeCategory ||
                      c.sub?.includes(activeCategory),
                  )?.sub?.map((sub) => (
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
              <span className="text-zinc-500 text-sm font-medium px-2">
                ช่วงราคา:
              </span>
              <select
                value={priceCategory}
                onChange={(e) => setPriceCategory(e.target.value)}
                className="bg-zinc-950 text-white text-sm rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-tactical-red transition-colors cursor-pointer border-none"
              >
                {PRICE_CATEGORIES.map((cp) => (
                  <option key={cp.id} value={cp.id}>
                    {cp.label}
                  </option>
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
            <h3 className="text-xl font-bold text-white mb-2">
              ยังไม่มีสินค้าในขณะนี้
            </h3>
            <p className="text-zinc-500 max-w-sm">
              รอแอดมินอัพโหลดสินค้าเข้าระบบ
              ผู้ใช้งานจะสามารถเลือกชมและสั่งซื้อได้ที่นี่
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
          <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {finalProducts
              .slice((currentPage - 1) * 16, currentPage * 16)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onFavorite={handleFavoriteToggle}
                  onContact={handleContactClick}
                  onSelect={handleProductSelect}
                  onCopyId={handleCopyId}
                />
              ))}
          </div>
          {totalPages > 0 && (
            <div className="flex flex-col items-center mt-12 mb-4 gap-2">
              <div className="flex justify-center flex-wrap gap-2">
                <button
                  onClick={() => {
                    setCurrentPage(Math.max(1, currentPage - 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer flex-shrink-0"
                >
                  ก่อนหน้า
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                       setCurrentPage(i + 1);
                       window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-lg flex justify-center items-center font-bold transition-all cursor-pointer flex-shrink-0 ${currentPage === i + 1 ? 'bg-tactical-red text-white shadow-[0_0_15px_rgba(230,57,70,0.4)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer flex-shrink-0"
                >
                  หน้าถัดไป
                </button>
              </div>
              <p className="text-zinc-500 text-sm mt-4 text-center px-4">
                กดปุ่ม 3 ขีดซ้ายบนสุดเพื่อเปิดหมวดหมู่สินค้า
              </p>
            </div>
          )}
          </>
        )}

        {/* Savings Plan Section */}
        {siteSettings.savingsPlanEnabled !== false && (
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
              <span>{siteSettings.savingsPlanHeadline || "ระบบออมเงิน"}</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto px-4 leading-relaxed whitespace-pre-wrap">
              {siteSettings.savingsPlanDesc || "อยากได้ปืนเจลแต่งบยังไม่พอ? ออมกับเราได้ง่ายๆ\\nผ่าน LINE"}
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
        )}
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
            © {new Date().getFullYear()} {siteSettings.title}. All rights
            reserved.
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
          onClick={() => handleContactClick("general")}
          className="bg-[#06C755] hover:bg-[#05b34c] text-white rounded-full w-14 h-14 shadow-[0_5px_20px_rgba(6,199,85,0.4)] hover:shadow-[0_8px_25px_rgba(6,199,85,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer group relative"
        >
          <MessageCircle className="w-7 h-7" />

          {/* Tooltip */}
          <div className="absolute right-[calc(100%+16px)] bg-zinc-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700 shadow-xl">
            ติดต่อผ่าน LINE
          </div>
        </motion.button>
      </div>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-4xl bg-tactical-gray border md:border-zinc-800 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[100dvh] md:h-auto max-h-[100dvh] md:max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-tactical-red text-white p-2 rounded-full backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-y-auto flex flex-col md:flex-row w-full bg-tactical-gray items-start relative scroll-smooth overscroll-y-contain">
                {/* Image Section */}
                <div className="w-full md:w-1/2 relative bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800 flex-shrink-0 flex flex-col items-center md:sticky md:top-0 z-10 pb-2 md:pb-0">
                  <div className="relative aspect-square w-full sm:w-3/4 md:w-full md:flex-1 md:min-h-0 overflow-hidden flex items-center justify-center bg-black">
                    <img
                      src={
                        (selectedProduct.images &&
                        selectedProduct.images.length > 0
                          ? selectedProduct.images[activeImageIndex]
                          : selectedProduct.image) || undefined
                      }
                      alt={selectedProduct.name}
                      className={`w-full h-full object-contain ${selectedProduct.isOffSale || selectedProduct.isComingSoon ? "grayscale opacity-70" : ""}`}
                    />
                    {selectedProduct.isOffSale &&
                      !selectedProduct.isComingSoon && (
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
                    {/* Carousel Controls */}
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) =>
                              prev === 0 ? (selectedProduct.images?.length || 1) - 1 : prev - 1
                            );
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-tactical-red text-white p-2 rounded-full backdrop-blur-md transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) =>
                              prev === (selectedProduct.images?.length || 1) - 1 ? 0 : prev + 1
                            );
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-tactical-red text-white p-2 rounded-full backdrop-blur-md transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60 md:hidden pointer-events-none" />
                    {selectedProduct.tags &&
                      selectedProduct.tags.length > 0 && (
                        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                          {Array.from(new Set(selectedProduct.tags)).map((tag) => (
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
                    const displayImages =
                      selectedProduct.images &&
                      selectedProduct.images.length > 0
                        ? selectedProduct.images
                        : [selectedProduct.image];

                    return (
                      <div className="h-20 bg-zinc-950 p-2 border-t border-zinc-900 flex gap-2 overflow-x-auto w-full max-w-full z-20">
                        {displayImages.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-16 h-full flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${activeImageIndex === idx ? "border-tactical-red opacity-100" : "border-zinc-800 opacity-50 hover:opacity-100 hover:border-zinc-600"}`}
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
                <div className="w-full md:w-1/2 flex flex-col z-0">
                  <div className="p-4 md:p-6 pb-[100px] flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <div className="uppercase tracking-widest text-[10px] sm:text-xs font-bold text-tactical-red">
                        {selectedProduct.category}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] sm:text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                          ID: {selectedProduct.id}
                        </div>
                        <button
                          onClick={(e) => handleCopyId(selectedProduct.id, e)}
                          className="text-zinc-500 hover:text-white transition-colors"
                          title="คัดลอกรหัสสินค้า"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2 leading-tight">
                      {selectedProduct.name}
                    </h2>

                    <div className="text-2xl md:text-3xl font-display font-bold text-tactical-red mb-4">
                      ฿{selectedProduct.price.toLocaleString()}
                    </div>

                    <div className="prose prose-invert max-w-none shadow-sm mb-6 flex-shrink-0">
                      <p className="text-zinc-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6 flex-shrink-0">
                      <div className="bg-zinc-900/50 border border-zinc-800/50 p-3 rounded-lg">
                        <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <ShieldCheck className="w-3 h-3 text-tactical-red" />
                          การรับประกัน
                        </div>
                        <div className="text-white font-medium text-xs">
                          รับประกัน 5 วัน
                        </div>
                      </div>
                      <div className="bg-zinc-900/50 border border-zinc-800/50 p-3 rounded-lg">
                        <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-tactical-red" />{" "}
                          การจัดส่ง
                        </div>
                        <div className="text-white font-medium text-xs">
                          ธรรมดา
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 md:left-auto md:w-1/2 z-50 flex flex-row gap-2.5 p-3 md:p-6 bg-tactical-gray md:bg-tactical-gray/95 md:backdrop-blur-md border-t border-zinc-800 shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.5)]">
                {selectedProduct.isComingSoon ? (
                  <button
                    disabled
                    className="flex-1 py-3 px-6 rounded-md font-bold bg-blue-900/40 text-blue-400 border border-blue-800/50 cursor-not-allowed flex items-center justify-center gap-1.5 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 opacity-70" />
                    เร็วๆนี้...
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (!selectedProduct.isOffSale)
                          handleContactClick("buy");
                      }}
                      disabled={selectedProduct.isOffSale}
                      className={`flex-1 py-3 px-6 rounded-md font-bold transition-all duration-300 flex items-center justify-center gap-1.5 text-sm ${selectedProduct.isOffSale ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50" : "bg-tactical-red hover:bg-tactical-red-hover text-white shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] cursor-pointer active:scale-95"}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {selectedProduct.isOffSale
                        ? "สินค้าหมด"
                        : "สั่งซื้อสินค้า"}
                    </button>
                    {!selectedProduct.isOffSale && (
                      <button
                        onClick={() => handleContactClick("save")}
                        className="w-1/3 md:flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-500 flex items-center justify-center gap-1.5 cursor-pointer py-3 px-6 rounded-md font-bold transition-all duration-300 active:scale-95 text-sm"
                      >
                        <PiggyBank className="w-4 h-4" />
                        <span className="hidden sm:inline">ออมเงิน</span>
                        <span className="sm:hidden">ออม</span>
                      </button>
                    )}
                  </>
                )}
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
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {user.email}
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    สมาชิก Kook-RSiam กองทัพสายซุ่ม
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3 max-h-64 overflow-y-auto hidden-scrollbar">
                  {orders.filter((o) => o.user === user.email).length > 0 ? (
                    orders
                      .filter((o) => o.user === user.email)
                      .map((o: any) => (
                        <div
                          key={o.id}
                          className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-left"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-zinc-300 font-mono text-xs">
                              {o.id}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${o.status === "Completed" ? "bg-emerald-500/20 text-emerald-500" : "bg-yellow-500/20 text-yellow-500"}`}
                            >
                              {o.status}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-white mb-1">
                            {o.items.join(", ")}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-500 text-xs">
                              {o.date}
                            </span>
                            <span className="text-tactical-red font-bold text-sm">
                              ฿{o.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="flex justify-center text-center p-4">
                      <p className="text-zinc-500 text-sm">
                        ไม่มีประวัติการสั่งซื้อ หรือ
                        อยู่ระหว่างรอการอัปเดตจากผู้ดูแลระบบ
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
          <React.Suspense fallback={<div className="fixed inset-0 z-[200] bg-tactical-black/80 flex items-center justify-center"><div className="w-10 h-10 border-t-2 border-r-2 border-tactical-red rounded-full animate-spin"></div></div>}>
            <AdminDashboard 
              siteSettings={siteSettings}
              adminTab={adminTab}
              setAdminTab={setAdminTab}
              allUsers={allUsers}
              products={products}
              orders={orders}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              handleSaveProduct={handleSaveProduct}
              handleDeleteProduct={handleDeleteProduct}
              editingOrder={editingOrder}
              setEditingOrder={setEditingOrder}
              handleSaveOrder={handleSaveOrder}
              handleDeleteOrder={handleDeleteOrder}
              editingSettings={editingSettings}
              setEditingSettings={setEditingSettings}
              handleSaveSettings={handleSaveSettings}
              userToDelete={userToDelete}
              setUserToDelete={setUserToDelete}
              executeDeleteUser={executeDeleteUser}
              setIsAdminDashboardOpen={setIsAdminDashboardOpen}
              compressImage={compressImage}
            />
          </React.Suspense>
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
                    <img
                      src={contactProduct.image || undefined}
                      alt={contactProduct.name}
                      className="w-12 h-12 rounded bg-zinc-800 object-cover"
                    />
                    <div>
                      <div className="text-xs text-zinc-500 font-bold mb-0.5">
                        {contactMode === "buy"
                          ? "สั่งซื้อสินค้า"
                          : contactMode === "save"
                            ? "แจ้งออมเงิน"
                            : "สอบถาม"}
                      </div>
                      <div className="text-white text-sm font-medium line-clamp-1">
                        {contactProduct.name}
                      </div>
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
