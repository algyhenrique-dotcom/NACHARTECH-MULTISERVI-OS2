import React from 'react';
import { Nav } from '../components/layout/Nav';
import { Chapter } from '../components/home/Chapter';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { ProductCategories } from '../components/home/ProductCategories';
import { ServicesSection } from '../components/home/ServicesSection';
import { AboutSection } from '../components/home/AboutSection';
import { GallerySection } from '../components/home/GallerySection';
import { ContactSection } from '../components/home/ContactSection';
import { Footer } from '../components/layout/Footer';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <Nav variant="overlay" />
      <main className="flex-1 w-full">
        <Chapter />
        <FeaturedProducts />
        <ProductCategories />
        <ServicesSection />
        <AboutSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
