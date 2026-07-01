import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/i18n';
import { useCart } from '../lib/cart-context';
import { useWishlist } from '../lib/wishlist-context';
import { useWhatsAppNumber } from '../lib/settings-context';
import { Product, ProductVariant, Review } from '../types';
import { supabase } from '../lib/supabase';
import { formatPrice, getDiscountPercentage, getWhatsAppUrl } from '../lib/utils';
import { useSEO, useJsonLd, buildProductSchema, buildBreadcrumbSchema } from '../lib/seo';
import { ProductCard } from '../components/product/ProductCard';
import { ReviewForm } from '../components/product/ReviewForm';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import {
  Heart,
  Share2,
  Minus,
  Plus,
  Star,
  Truck,
  RotateCcw,
  Shield,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export function ProductPage() {
  const { slug } = useParams();
  const { language, t } = useI18n();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const whatsappNumber = useWhatsAppNumber();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specs'>('description');

  const displayName = product ? (language === 'ar' ? product.name_ar : product.name) : '';
  const displayDescription = product
    ? (language === 'ar' ? product.description_ar : product.description) || ''
    : '';

  useSEO({
    title: displayName || (language === 'ar' ? 'منتج' : 'Product'),
    description:
      displayDescription.slice(0, 160) ||
      (language === 'ar' ? 'تسوق هذا المنتج من كلاركس بورسعيد' : 'Shop this product at Clarks Port Said'),
    image: product?.images?.[0],
    url: slug ? `/product/${slug}` : undefined,
    type: 'product',
  });

  useJsonLd(
    product
      ? [
          buildProductSchema({
            name: displayName,
            description: displayDescription,
            images: product.images,
            price: product.price,
            sku: product.sku,
            rating: product.rating,
            reviews_count: product.reviews_count,
            stock_quantity: product.stock_quantity,
            slug: product.slug,
          }),
          buildBreadcrumbSchema([
            { name: language === 'ar' ? 'الرئيسية' : 'Home', url: '/' },
            { name: language === 'ar' ? 'المتجر' : 'Shop', url: '/shop' },
            { name: displayName, url: `/product/${product.slug}` },
          ]),
        ]
      : []
  );

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const { data: productData, error } = await supabase
          .from('products')
          .select('*, categories(*)')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (error || !productData) {
          console.error('Product not found');
          return;
        }

        setProduct(productData);

        const { data: variantsData } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productData.id);
        setVariants(variantsData || []);

        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*, profiles(*)')
          .eq('product_id', productData.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });
        setReviews(reviewsData || []);

        if (productData.category_id) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*, categories(*)')
            .eq('category_id', productData.category_id)
            .eq('is_active', true)
            .neq('id', productData.id)
            .limit(4);
          setRelatedProducts(relatedData || []);
        }

        if (variantsData && variantsData.length > 0) {
          const uniqueColors = variantsData.filter(
            (v, i, arr) => arr.findIndex((item) => item.color === v.color) === i
          );
          setSelectedColor(uniqueColors[0]?.color || null);
          const firstVariant = variantsData[0];
          setSelectedSize(firstVariant?.size || null);
          setSelectedVariant(firstVariant || null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!selectedColor || !variants.length) return;

    const colorVariants = variants.filter((v) => v.color === selectedColor);
    if (colorVariants.length > 0) {
      if (!selectedSize || !colorVariants.find((v) => v.size === selectedSize)) {
        setSelectedSize(colorVariants[0]?.size || null);
      }
    }

    const variant = variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    setSelectedVariant(variant || colorVariants[0] || null);
  }, [selectedColor, selectedSize, variants]);

  const availableColors = variants.length > 0
    ? variants.filter(
        (v, i, arr) => arr.findIndex((item) => item.color === v.color) === i
      )
    : [];

  const availableSizes = selectedColor
    ? variants.filter((v) => v.color === selectedColor)
    : [];

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedVariant) {
      toast.error(language === 'ar' ? 'يرجى اختيار المقاس واللون' : 'Please select size and color');
      return;
    }

    if (selectedVariant.stock_quantity <= 0) {
      toast.error(language === 'ar' ? 'المنتج غير متوفر' : 'Product is out of stock');
      return;
    }

    await addItem(product, selectedVariant, quantity);
    toast.success(language === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const url = getWhatsAppUrl(
      whatsappNumber,
      { name: product.name, name_ar: product.name_ar },
      selectedVariant,
      quantity,
      product.price,
      language
    );
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <ProductGridSkeleton count={1} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
          </h1>
          <Link to="/shop" className="text-[#B8956E] hover:underline">
            {language === 'ar' ? 'العودة للمتجر' : 'Back to Shop'}
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.compare_at_price
    ? getDiscountPercentage(product.price, product.compare_at_price)
    : 0;

  const name = language === 'ar' ? product.name_ar : product.name;
  const description = language === 'ar' ? product.description_ar : product.description;

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 pt-6">
          <Link to="/" className="hover:text-[#B8956E]">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/shop" className="hover:text-[#B8956E]">
            {language === 'ar' ? 'المتجر' : 'Shop'}
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link
                to={`/shop?category=${product.category.slug}`}
                className="hover:text-[#B8956E]"
              >
                {language === 'ar' ? product.category.name_ar : product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden mb-4">
              <img loading="eager" decoding="async" fetchPriority="high"
                src={product.images?.[currentImage] || product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'}
                alt={name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                  -{discount}%
                </span>
              )}
              {product.is_new && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-[#111111] text-white text-sm font-medium rounded-full">
                  {language === 'ar' ? 'جديد' : 'NEW'}
                </span>
              )}

              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImage === index ? 'border-[#B8956E]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img loading="lazy" decoding="async"
                      src={image}
                      alt={`${name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            {product.category && (
              <Link
                to={`/shop?category=${product.category.slug}`}
                className="text-sm text-gray-500 hover:text-[#B8956E] uppercase tracking-wide"
              >
                {language === 'ar' ? product.category.name_ar : product.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink mt-2 mb-4">
              {name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-500">
                ({product.reviews_count} {language === 'ar' ? 'تقييم' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-[#111111]">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
              {discount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                  {language === 'ar' ? `وفر ${discount}%` : `Save ${discount}%`}
                </span>
              )}
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('product.selectColor')}: <span className="text-gray-900">{selectedColor}</span>
                </label>
                <div className="flex gap-3">
                  {availableColors.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedColor(variant.color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === variant.color
                          ? 'border-[#B8956E] ring-2 ring-[#B8956E]/30'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{
                        backgroundColor: variant.color_code || variant.color.toLowerCase(),
                      }}
                      title={variant.color}
                    >
                      {selectedColor === variant.color && (
                        <svg className="w-6 h-6 mx-auto text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('product.selectSize')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedSize(variant.size)}
                      disabled={variant.stock_quantity <= 0}
                      className={`min-w-[48px] h-12 px-4 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === variant.size
                          ? 'border-[#B8956E] bg-[#B8956E] text-white'
                          : variant.stock_quantity <= 0
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-[#B8956E]'
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('product.quantity')}
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <span className="text-gray-500 text-sm">
                  {selectedVariant?.stock_quantity || product.stock_quantity}{' '}
                  {language === 'ar' ? 'متوفر' : 'available'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={selectedVariant?.stock_quantity === 0}
                fullWidth
              >
                {t('product.addToCart')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWhatsApp}
                className="min-w-[56px]"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => product && toggleWishlist(product)}
                className={`min-w-[56px] ${product && isWishlisted(product.id) ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-5 w-5 ${product && isWishlisted(product.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* WhatsApp Button */}
            <Button
              size="lg"
              variant="secondary"
              fullWidth
              onClick={handleWhatsApp}
              className="mb-8 bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {t('product.orderWhatsApp')}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="h-6 w-6 text-[#B8956E] mx-auto mb-2" />
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'توصيل مجاني' : 'Free Shipping'}
                </span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <RotateCcw className="h-6 w-6 text-[#B8956E] mx-auto mb-2" />
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'استرجاع 14 يوم' : '14 Day Returns'}
                </span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="h-6 w-6 text-[#B8956E] mx-auto mb-2" />
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'border-[#B8956E] text-[#B8956E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('product.description')}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-[#B8956E] text-[#B8956E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('product.reviews')} ({reviews.length})
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {product && <ReviewForm productId={product.id} />}

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-[#B8956E] rounded-full flex items-center justify-center text-white font-bold">
                            {(review.user?.full_name || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{review.user?.full_name || 'User'}</p>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    {language === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <span className="eyebrow">
              {language === 'ar' ? 'قد يعجبك أيضاً' : "You'll also like"}
            </span>
            <h2 className="font-display text-2xl font-semibold text-ink mt-2 mb-8">
              {t('products.relatedProducts')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
