import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { ArrowRight, Hammer, Leaf, Heart, MapPin } from 'lucide-react';
import { useSEO } from '../lib/seo';

export function AboutPage() {
  const { language, isRTL } = useI18n();

  useSEO({
    title: language === 'ar' ? 'من نحن' : 'About Us',
    description:
      language === 'ar'
        ? 'تعرف على قصة كلاركس بورسعيد وحرفتنا في صناعة الأحذية الجلدية الفاخرة'
        : "Learn about Clarks Port Said's story and our craft in premium leather footwear",
    url: '/about',
  });
  const Arrow = () => <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />;

  const values = [
    {
      icon: Hammer,
      title: language === 'ar' ? 'حِرفة يدوية' : 'Hand craft',
      text: language === 'ar'
        ? 'كل قطعة تمر بأيادٍ حرفية تتفقّد كل غرزة قبل أن تصل إليك'
        : 'Every pair passes through skilled hands that check each stitch before it reaches you',
    },
    {
      icon: Leaf,
      title: language === 'ar' ? 'جلد طبيعي' : 'Genuine materials',
      text: language === 'ar'
        ? 'نختار الجلد الطبيعي بعناية ليدوم معك لسنوات لا لمواسم'
        : 'We select genuine leather to last you for years, not just seasons',
    },
    {
      icon: Heart,
      title: language === 'ar' ? 'راحة أولاً' : 'Comfort first',
      text: language === 'ar'
        ? 'كل مقاس مدروس ليلائم قدمك طوال اليوم بدون تنازل عن الأناقة'
        : 'Every size is engineered to fit your foot all day, without compromising on style',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <section className="relative bg-ink overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[55vh]">
          <div className="relative z-10 flex items-center px-6 md:px-14 py-20">
            <div className="max-w-lg">
              <span className="eyebrow text-gold-light">
                {language === 'ar' ? 'بورسعيد · منذ سنوات' : 'Port Said · Since day one'}
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-white mt-6 mb-6 leading-tight">
                {language === 'ar' ? 'من نحن' : 'About Us'}
              </h1>
              <p className="text-white/65 text-lg leading-relaxed">
                {language === 'ar'
                  ? 'كلاركس بورسعيد بدأت بفكرة بسيطة: أحذية تستحق الثقة، مصنوعة بعناية حقيقية، ومتاحة لكل بيت مصري.'
                  : 'Clarks Port Said began with a simple idea: footwear worth trusting, made with real care, accessible to every Egyptian home.'}
              </p>
            </div>
          </div>
          <div className="relative min-h-[30vh]">
            <img loading="lazy" decoding="async"
              src="https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1200"
              alt={language === 'ar' ? 'ورشة كلاركس بورسعيد' : 'Clarks Port Said workshop'}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-ink via-ink/10 to-transparent" />
          </div>
        </div>
        <div className="sole-curve" style={{ background: '#FAFAFA' }} />
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <span className="eyebrow justify-center">
            {language === 'ar' ? 'حكايتنا' : 'Our story'}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mt-3 mb-6">
            {language === 'ar' ? 'بدأت من سوق صغير في بورسعيد' : 'It started in a small Port Said market'}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            {language === 'ar'
              ? 'نحن نؤمن بأن الأحذية الجيدة تستحق أن تُصنع بعناية واهتمام. منذ سنوات ونحن نسعى لتقديم أرقى أنواع الأحذية لعملائنا في بورسعيد ومصر، معتمدين على الجلد الطبيعي والخياطة اليدوية في كل قطعة.'
              : "We believe great footwear deserves to be crafted with care. For years we've worked with genuine leather and hand-stitching to bring our customers in Port Said and across Egypt footwear that earns its place in daily life."}
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            {language === 'ar'
              ? 'اليوم نقدّم تشكيلة متنوعة من أحذية الرجال والنساء والشباب، مع التركيز الدائم على الجودة والراحة والأناقة.'
              : 'Today we offer a diverse collection for men, women, and youth — always centered on quality, comfort, and style.'}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-white border-t border-hairline">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="eyebrow justify-center">
              {language === 'ar' ? 'مبادئنا' : 'What guides us'}
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {values.map((v, i) => (
              <div key={i} className="text-center px-4">
                <div className="w-16 h-16 rounded-full border border-[#B8956E]/30 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-7 h-7 text-[#B8956E]" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink mb-2">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location + CTA */}
      <section className="py-16 md:py-20 bg-ink">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <MapPin className="h-7 w-7 text-[#B8956E] mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mb-3">
            {language === 'ar' ? 'تفضّل بزيارتنا في بورسعيد' : 'Visit us in Port Said'}
          </h2>
          <p className="text-white/55 mb-8">
            {language === 'ar' ? 'بورسعيد، مصر' : 'Port Said, Egypt'}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#B8956E] text-ink font-semibold rounded-sm hover:bg-[#D9BB96] transition-colors"
          >
            {language === 'ar' ? 'تسوق المجموعة' : 'Shop the collection'}
            <Arrow />
          </Link>
        </div>
      </section>
    </div>
  );
}
