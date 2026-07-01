import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategorySection } from '../components/home/CategorySection';
import { ProductsSection } from '../components/home/ProductsSection';
import { PromoBanner } from '../components/home/PromoBanner';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { Category, Product } from '../types';
import { supabase } from '../lib/supabase';
import { useI18n } from '../lib/i18n';
import { useSEO, useJsonLd, buildOrganizationSchema, buildWebsiteSchema } from '../lib/seo';

export function HomePage() {
  const { language } = useI18n();

  useSEO({
    title: language === 'ar' ? 'الرئيسية' : 'Home',
    description:
      language === 'ar'
        ? 'تسوق أرقى تشكيلات الأحذية الفاخرة في كلاركس بورسعيد — جلد طبيعي، خياطة يدوية، وتوصيل لكل محافظات مصر'
        : 'Shop premium, hand-stitched leather footwear at Clarks Port Said — delivered across Egypt',
    url: '/',
  });
  useJsonLd([buildOrganizationSchema(), buildWebsiteSchema()]);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, featuredRes, newRes, bestsellerRes] = await Promise.all([
          supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .is('parent_id', null)
            .order('sort_order')
            .limit(4),
          supabase
            .from('products')
            .select('*, categories(*)')
            .eq('is_active', true)
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(8),
          supabase
            .from('products')
            .select('*, categories(*)')
            .eq('is_active', true)
            .eq('is_new', true)
            .order('created_at', { ascending: false })
            .limit(8),
          supabase
            .from('products')
            .select('*, categories(*)')
            .eq('is_active', true)
            .eq('is_bestseller', true)
            .order('created_at', { ascending: false })
            .limit(8),
        ]);

        setCategories(categoriesRes.data || []);
        setFeaturedProducts(featuredRes.data || []);
        setNewProducts(newRes.data || []);
        setBestsellerProducts(bestsellerRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />

      {loading ? (
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <ProductGridSkeleton count={8} />
          </div>
        </div>
      ) : (
        <>
          <ProductsSection
            eyebrow={language === 'ar' ? 'مختارة بعناية' : 'Hand-picked'}
            title={language === 'ar' ? 'منتجات مميزة' : 'Featured Products'}
            products={featuredProducts}
            viewAllLink="/shop?filter=featured"
          />

          <CategorySection categories={categories} />

          <PromoBanner />

          <ProductsSection
            eyebrow={language === 'ar' ? 'الموسم الجديد' : 'Just in'}
            title={language === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}
            products={newProducts}
            viewAllLink="/shop?filter=new"
          />

          <ProductsSection
            eyebrow={language === 'ar' ? 'يفضّلها عملاؤنا' : 'Customer favorites'}
            title={language === 'ar' ? 'الأكثر مبيعاً' : 'Bestsellers'}
            products={bestsellerProducts}
            viewAllLink="/shop?filter=bestseller"
          />
        </>
      )}

      {/* Brand Story Section */}
      <section className="py-16 md:py-24 bg-ink">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <span className="eyebrow text-[#D9BB96]">
                {language === 'ar' ? 'حكايتنا' : 'Our craft'}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mt-3 mb-6">
                {language === 'ar' ? 'قصتنا' : 'Our Story'}
              </h2>
              <p className="text-white/60 text-lg mb-6 leading-relaxed">
                {language === 'ar'
                  ? 'نحن نؤمن بأن الأحذية الجيدة تستحق أن تُصنع بعناية واهتمام. منذ سنوات ونحن نسعى لتقديم أرقى أنواع الأحذية لعملائنا في بورسعيد ومصر.'
                  : "We believe that great footwear deserves to be crafted with care and attention. For years, we've been dedicated to delivering the finest footwear to our customers in Port Said and across Egypt."}
              </p>
              <p className="text-white/60 text-lg mb-10 leading-relaxed">
                {language === 'ar'
                  ? 'نسعى دائماً لتقديم تشكيلة متنوعة من أحذية الرجال والنساء والشباب، مع التركيز على الجودة والراحة والأناقة.'
                  : 'We constantly strive to offer a diverse collection of footwear for men, women, and youth, focusing on quality, comfort, and style.'}
              </p>
              <div className="stitch-divider--dark mb-8" />
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="font-display text-3xl text-[#D9BB96] font-semibold">+15</p>
                  <p className="text-white/45 text-sm mt-1">{language === 'ar' ? 'سنة خبرة' : 'Years of craft'}</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-[#D9BB96] font-semibold">+20k</p>
                  <p className="text-white/45 text-sm mt-1">{language === 'ar' ? 'عميل سعيد' : 'Happy customers'}</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-[#D9BB96] font-semibold">100%</p>
                  <p className="text-white/45 text-sm mt-1">{language === 'ar' ? 'جلد طبيعي' : 'Genuine leather'}</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
              <img loading="lazy" decoding="async"
                src="https://images.unsplash.com/photo-1556906981-64e486786cc2?q=80&w=800"
                alt={language === 'ar' ? 'حرفة كلاركس بورسعيد' : 'Clarks Port Said craftsmanship'}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-5 left-5 rtl:left-auto rtl:right-5 tag-badge">
                {language === 'ar' ? 'خياطة يدوية' : 'Hand-stitched'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="eyebrow justify-center">
              {language === 'ar' ? 'لماذا نحن' : 'Why shop with us'}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 text-center">
            {[
              {
                path: 'M5 13l4 4L19 7',
                title: language === 'ar' ? 'جودة عالية' : 'Premium Quality',
                text: language === 'ar' ? 'منتجات أصلية 100%' : '100% authentic products',
              },
              {
                path: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: language === 'ar' ? 'توصيل سريع' : 'Fast Delivery',
                text: language === 'ar' ? 'توصيل خلال 2-5 أيام' : 'Delivery in 2-5 days',
              },
              {
                path: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 3a8.001 8.001 0 01-15.357-2m15.357 2H15',
                title: language === 'ar' ? 'استرجاع سهل' : 'Easy Returns',
                text: language === 'ar' ? 'استرجاع خلال 14 يوم' : '14-day return policy',
              },
              {
                path: 'M18.364 5.636l-3.536 3.536m0 0l-3.536-3.536m3.536 3.536V3m-3.536 3.536l-3.536-3.536m6.364 6.364l3.536 3.536m-3.536-3.536v7.778m3.536-3.536l3.536 3.536',
                title: language === 'ar' ? 'دعم فني' : 'Customer Support',
                text: language === 'ar' ? 'دعم على مدار الساعة' : '24/7 support available',
              },
            ].map((item, i) => (
              <div key={i} className="relative px-2">
                {i > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-10 w-px bg-hairline" />
                )}
                <div className="w-14 h-14 rounded-full border border-[#B8956E]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#B8956E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.path} />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-ink mb-1.5">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
