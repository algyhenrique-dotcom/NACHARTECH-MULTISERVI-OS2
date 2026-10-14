import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { TermsPage } from './pages/TermsPage';
import './utils/i18n';

// Support potential __BASE_PATH__ injected or standard root
declare global {
  interface Window {
    __BASE_PATH__?: string;
  }
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: '#f4f1ec', background: '#0f1115', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#ff7a1a' }}>Ocorreu um erro ao carregar a página</h2>
          <pre style={{ background: '#171a20', padding: 20, borderRadius: 8, overflow: 'auto' }}>
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            style={{
              marginTop: 20,
              background: '#ff7a1a',
              color: '#14100b',
              padding: '12px 24px',
              borderRadius: 999,
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Limpar cache e recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const basePath = typeof window !== 'undefined' && window.__BASE_PATH__ ? window.__BASE_PATH__ : undefined;

  return (
    <ErrorBoundary>
      <ShopProvider>
        <BrowserRouter basename={basePath}>
          {/* Slide-over quick cart drawer (must be inside BrowserRouter for useNavigate/Link) */}
          <CartDrawer />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loja" element={<ShopPage />} />
            <Route path="/produto/:id" element={<ProductDetailPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/conta" element={<AccountPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/termos" element={<TermsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </ShopProvider>
    </ErrorBoundary>
  );
}
