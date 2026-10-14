import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, AssistanceRequest } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/initialData';
import i18n from '../utils/i18n';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  favorites: string[];
  theme: 'dark' | 'light';
  lang: 'pt' | 'en';
  orders: Order[];
  assistanceRequests: AssistanceRequest[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Favorites
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Theme & Language
  toggleTheme: () => void;
  setLanguage: (lang: 'pt' | 'en') => void;

  // Products CRUD (Admin)
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetCatalog: () => void;

  // Orders & Requests
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  submitAssistanceRequest: (data: Omit<AssistanceRequest, 'id' | 'date' | 'status'>) => AssistanceRequest;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('nachartech-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Lang state
  const [lang, setLang] = useState<'pt' | 'en'>(() => {
    const saved = localStorage.getItem('nachartech-lang');
    return (saved === 'en' || saved === 'pt') ? saved : 'pt';
  });

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('nachartech-shop-products');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Categories state
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('nachartech-shop-categories');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CATEGORIES;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nachartech-cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Seed with 1 item for initial demo (as shown with badge 1 in screenshots)
    return [{ product: INITIAL_PRODUCTS[0], quantity: 1 }];
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nachartech-favorites');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nachartech-orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Assistance requests state
  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>(() => {
    try {
      const saved = localStorage.getItem('nachartech-assistance-requests');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nachartech-theme', theme);
  }, [theme]);

  // Sync lang
  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem('nachartech-lang', lang);
  }, [lang]);

  // Persist products
  useEffect(() => {
    localStorage.setItem('nachartech-shop-products', JSON.stringify(products));
  }, [products]);

  // Persist categories
  useEffect(() => {
    localStorage.setItem('nachartech-shop-categories', JSON.stringify(categories));
  }, [categories]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('nachartech-cart', JSON.stringify(cart));
  }, [cart]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('nachartech-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist orders
  useEffect(() => {
    localStorage.setItem('nachartech-orders', JSON.stringify(orders));
  }, [orders]);

  // Persist assistance requests
  useEffect(() => {
    localStorage.setItem('nachartech-assistance-requests', JSON.stringify(assistanceRequests));
  }, [assistanceRequests]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLanguage = (newLang: 'pt' | 'en') => {
    setLang(newLang);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`${product.name} adicionado ao carrinho`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        showToast('Removido dos favoritos');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Guardado nos favoritos');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Produto criado com sucesso');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('Produto atualizado');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produto removido');
  };

  const resetCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    localStorage.setItem('nachartech-shop-products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('nachartech-shop-categories', JSON.stringify(INITIAL_CATEGORIES));
    showToast('Catálogo restaurado para valores de fábrica');
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('pt-MZ', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const submitAssistanceRequest = (data: Omit<AssistanceRequest, 'id' | 'date' | 'status'>) => {
    const newReq: AssistanceRequest = {
      ...data,
      id: `AST-${Date.now().toString().slice(-5)}`,
      date: new Date().toLocaleDateString('pt-MZ', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'pending',
    };
    setAssistanceRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        favorites,
        theme,
        lang,
        orders,
        assistanceRequests,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        showToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        toggleFavorite,
        isFavorite,
        toggleTheme,
        setLanguage,
        addProduct,
        updateProduct,
        deleteProduct,
        resetCatalog,
        createOrder,
        submitAssistanceRequest,
      }}
    >
      {children}
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[9990] bg-surface border border-neutral-700/40 text-text px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm animate-fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
