import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useShop } from '../../context/ShopContext';

interface NavProps {
  variant?: 'overlay' | 'solid';
}

export const Nav: React.FC<NavProps> = ({ variant = 'overlay' }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    cartCount,
    favorites,
    theme,
    toggleTheme,
    lang,
    setLanguage,
    setIsCartOpen,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.75;
      setIsScrolled(window.scrollY > threshold);
    };

    if (variant === 'overlay') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [variant]);

  // Determine styling: on home hero it sits over light cream banner (dark text), on scroll it turns dark solid
  const isSolid = variant === 'solid' || isScrolled || !isHome;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/loja?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.shop'), href: '/loja' },
    { label: t('nav.services'), href: isHome ? '#servicos' : '/#servicos' },
    { label: t('nav.about'), href: isHome ? '#sobre' : '/#sobre' },
    { label: t('nav.gallery'), href: isHome ? '#galeria' : '/#galeria' },
    { label: t('nav.contact'), href: isHome ? '#contacto' : '/#contacto' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between transition-all duration-[300ms] text-[#f4f1ec] ${
          isSolid
            ? 'bg-[#0f1115]/95 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-transparent border-b border-white/[0.06] backdrop-blur-[2px]'
        }`}
        style={{
          padding: '12px clamp(14px, 2vw, 28px)',
        }}
      >
        {/* Brand Area */}
        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline text-inherit group shrink-0"
        >
          {/* Logo Icon */}
          <div
            className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center font-bold text-white shadow-sm shrink-0"
            style={{
              background: 'linear-gradient(135deg, #2f4f92 0%, #ff7a1a 100%)',
            }}
          >
            <span className="text-[15px] leading-none font-bold">N</span>
          </div>

          {/* Wordmark */}
          <div className="flex items-baseline gap-2">
            <span className="text-[16px] font-bold tracking-[-0.01em] text-white">
              Nachar<span className="text-[#ff7a1a]">Tech</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-medium tracking-[0.06em] uppercase border-l pl-2 text-[#5fc9bd] border-white/20">
              Multisserviços
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (900px+) */}
        <nav className="hidden min-[900px]:flex items-center gap-6">
          {navLinks.map((item) => {
            const isAnchor = item.href.startsWith('#') || item.href.includes('#');
            if (isAnchor) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-link text-[12px] tracking-[0.06em] uppercase hover:text-[#ff7a1a] transition-colors"
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-link text-[12px] tracking-[0.06em] uppercase hover:text-[#ff7a1a] transition-colors ${
                  location.pathname === item.href ? 'active text-[#ff7a1a]' : ''
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Tools Actions Area */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="pill-icon-btn border-white/20 bg-white/5 hover:bg-white/10 text-[#f4f1ec]"
            title={t('nav.searchPlaceholder')}
            aria-label="Pesquisar"
          >
            <i className="ri-search-line text-[15px]" />
          </button>

          {/* Wishlist */}
          <Link
            to="/favoritos"
            className="pill-icon-btn relative no-underline border-white/20 bg-white/5 hover:bg-white/10 text-[#f4f1ec]"
            title={t('nav.favorites')}
            aria-label="Favoritos"
          >
            <i className="ri-heart-line text-[15px]" />
            {favorites.length > 0 && (
              <span className="nav-count">{favorites.length}</span>
            )}
          </Link>

          {/* Cart Trigger with orange count badge */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="pill-icon-btn relative border-white/20 bg-white/5 hover:bg-white/10 text-[#f4f1ec]"
            title={t('nav.cart')}
            aria-label="Carrinho"
          >
            <i className="ri-shopping-cart-2-line text-[15px]" />
            {cartCount > 0 && <span className="nav-count">{cartCount}</span>}
          </button>

          {/* User Account / Login */}
          <Link
            to="/conta"
            className="pill-btn hidden sm:inline-flex items-center gap-1.5 no-underline border-white/20 bg-white/5 hover:bg-white/10 text-[#f4f1ec]"
          >
            <i className="ri-user-3-line text-[13px]" />
            <span className="text-[12px]">{t('nav.login')}</span>
          </Link>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLanguage(lang === 'pt' ? 'en' : 'pt')}
            className="pill-btn flex items-center gap-1 border-white/20 bg-white/5 hover:bg-white/10 text-[#f4f1ec]"
            title="Mudar idioma"
          >
            <i className="ri-translate-2 text-[13px]" />
            <span className="text-[11px] font-bold">{lang === 'pt' ? 'EN' : 'PT'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="pill-icon-btn border-white/20 bg-white/5 hover:bg-white/10 text-[#f4f1ec]"
            title={t('nav.toggleTheme')}
            aria-label="Mudar tema"
          >
            <i className={theme === 'dark' ? 'ri-sun-line text-[15px]' : 'ri-moon-line text-[15px]'} />
          </button>

          {/* Mobile Menu Hamburger (<900px) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="pill-icon-btn min-[900px]:hidden border-white/20 bg-white/5 text-[#f4f1ec]"
            aria-label="Abrir menu"
          >
            <i className="ri-menu-3-line text-[16px]" />
          </button>
        </div>
      </header>

      {/* Fullscreen Search Overlay (.nav-search) */}
      {isSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] bg-[#0f1115]/96 backdrop-blur-[18px] flex flex-col items-center justify-center p-6 text-[#f4f1ec]"
        >
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-6 right-6 pill-icon-btn border-white/20 text-[#f4f1ec]"
            aria-label="Fechar pesquisa"
          >
            <i className="ri-close-line text-[20px]" />
          </button>

          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl flex flex-col gap-4"
          >
            <div className="relative flex items-center border-b-2 border-[#ff7a1a] pb-3">
              <i className="ri-search-line text-[28px] text-[#ff7a1a] mr-4" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full bg-transparent border-none text-[clamp(20px,3.5vw,36px)] text-white outline-none p-0 focus:ring-0 placeholder:text-neutral-500"
              />
            </div>
            <p className="text-[13px] text-neutral-400 flex items-center gap-2">
              <i className="ri-keyboard-line text-[14px]" />
              {t('nav.pressEnter')}
            </p>
          </form>
        </div>
      )}

      {/* Mobile Menu Sheet (.nav-sheet) */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] bg-[#0f1115] text-[#f4f1ec] p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 no-underline text-inherit"
            >
              <div
                className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #2f4f92 0%, #ff7a1a 100%)',
                }}
              >
                N
              </div>
              <span className="text-[18px] font-bold">
                Nachar<span className="text-[#ff7a1a]">Tech</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="pill-icon-btn border-white/20 text-white"
              aria-label="Fechar menu"
            >
              <i className="ri-close-line text-[20px]" />
            </button>
          </div>

          <div className="flex flex-col gap-4 my-auto">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[clamp(28px,8vw,46px)] font-semibold tracking-tight text-white hover:text-[#ff7a1a] transition-colors no-underline"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <Link
                to="/conta"
                onClick={() => setIsMobileMenuOpen(false)}
                className="pill-btn flex items-center gap-2 border-white/20 text-white no-underline"
              >
                <i className="ri-user-3-line" />
                <span>{t('nav.login')}</span>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage(lang === 'pt' ? 'en' : 'pt')}
                  className="pill-btn border-white/20 text-white"
                >
                  {lang === 'pt' ? 'English' : 'Português'}
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="pill-icon-btn border-white/20 text-white"
                >
                  <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'} />
                </button>
              </div>
            </div>

            <Link
              to="/#contacto"
              onClick={() => setIsMobileMenuOpen(false)}
              className="cta w-full text-center py-3.5 bg-[#ff7a1a] text-[#14100b]"
            >
              <span>{t('hero.ctaAssistance')}</span>
              <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
