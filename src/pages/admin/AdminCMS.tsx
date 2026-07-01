import React, { useEffect, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { supabase } from '../../lib/supabase';
import { Banner } from '../../types';
import { Button } from '../../components/ui/Button';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import toast from 'react-hot-toast';
import {
  Image as ImageIcon,
  Save,
  Video,
  Monitor,
  Upload,
} from 'lucide-react';

export function AdminCMS() {
  const { language } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [heroData, setHeroData] = useState({
    hero_title: '',
    hero_title_ar: '',
    hero_subtitle: '',
    hero_subtitle_ar: '',
    hero_video_url: '',
    hero_image_url: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'default')
        .single();

      if (settingsData) {
        setHeroData({
          hero_title: settingsData.hero_title,
          hero_title_ar: settingsData.hero_title_ar,
          hero_subtitle: settingsData.hero_subtitle,
          hero_subtitle_ar: settingsData.hero_subtitle_ar,
          hero_video_url: settingsData.hero_video_url || '',
          hero_image_url: settingsData.hero_image_url || '',
        });
      }

      const { data: bannersData } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order');
      setBanners(bannersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .update(heroData)
        .eq('id', 'default');

      if (error) throw error;

      toast.success(
        language === 'ar' ? 'تم الحفظ بنجاح' : 'Settings saved successfully'
      );
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleBannerUpdate = async (
    bannerId: string,
    field: string,
    value: string | boolean
  ) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ [field]: value })
        .eq('id', bannerId);

      if (error) throw error;

      toast.success(
        language === 'ar' ? 'تم التحديث بنجاح' : 'Banner updated'
      );
      fetchData();
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleAddBanner = async () => {
    try {
      const { error } = await supabase.from('banners').insert({
        title: 'New Banner',
        title_ar: 'بانر جديد',
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        position: 'promo',
      });

      if (error) throw error;

      toast.success(language === 'ar' ? 'تمت الإضافة' : 'Banner added');
      fetchData();
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) return;

    try {
      await supabase.from('banners').delete().eq('id', bannerId);
      toast.success(language === 'ar' ? 'تم الحذف' : 'Banner deleted');
      fetchData();
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8956E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'إدارة المحتوى والواجهة' : 'Content Management (CMS)'}
        </h1>
        <p className="text-gray-500 mt-1">
          {language === 'ar'
            ? 'إدارة الفيديو الترويجي، البانرات، والنصوص'
            : 'Manage promotional video, banners, and text content'}
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center gap-2 p-6 border-b border-gray-100">
          <Monitor className="h-5 w-5 text-[#B8956E]" />
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'ar' ? 'قسم البطل (Hero Section)' : 'Hero Section'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Input
                label={language === 'ar' ? 'العنوان الرئيسي (EN)' : 'Main Title (EN)'}
                value={heroData.hero_title}
                onChange={(e) =>
                  setHeroData({ ...heroData, hero_title: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                label={language === 'ar' ? 'العنوان الرئيسي (AR)' : 'Main Title (AR)'}
                value={heroData.hero_title_ar}
                onChange={(e) =>
                  setHeroData({ ...heroData, hero_title_ar: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Textarea
                label={language === 'ar' ? 'العنوان الفرعي (EN)' : 'Subtitle (EN)'}
                value={heroData.hero_subtitle}
                onChange={(e) =>
                  setHeroData({ ...heroData, hero_subtitle: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Textarea
                label={language === 'ar' ? 'العنوان الفرعي (AR)' : 'Subtitle (AR)'}
                value={heroData.hero_subtitle_ar}
                onChange={(e) =>
                  setHeroData({ ...heroData, hero_subtitle_ar: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  {language === 'ar'
                    ? 'رابط الفيديو الترويجي'
                    : 'Promotional Video URL'}
                </label>
              </div>
              <input
                type="text"
                value={heroData.hero_video_url}
                onChange={(e) =>
                  setHeroData({ ...heroData, hero_video_url: e.target.value })
                }
                placeholder="https://youtube.com/..."
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B8956E]"
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'ar'
                  ? 'أدخل رابط YouTube أو Vimeo'
                  : 'Enter YouTube or Vimeo URL'}
              </p>
            </div>

            <div>
              <ImageUploader
                bucket="site-media"
                label={language === 'ar' ? 'صورة الخلفية' : 'Background Image'}
                multiple={false}
                value={heroData.hero_image_url ? [heroData.hero_image_url] : []}
                onChange={(urls) => setHeroData({ ...heroData, hero_image_url: urls[0] || '' })}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleSaveHero} isLoading={saving}>
              <Save className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Banners Section */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-[#B8956E]" />
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'ar' ? 'البانرات' : 'Banners'}
            </h2>
          </div>
          <Button onClick={handleAddBanner}>
            <Upload className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'إضافة بانر' : 'Add Banner'}
          </Button>
        </div>

        <div className="p-6">
          {banners.length > 0 ? (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={banner.title}
                        onChange={(e) =>
                          handleBannerUpdate(banner.id, 'title', e.target.value)
                        }
                        placeholder="Title (EN)"
                      />
                      <Input
                        value={banner.title_ar}
                        onChange={(e) =>
                          handleBannerUpdate(banner.id, 'title_ar', e.target.value)
                        }
                        placeholder="العنوان (AR)"
                      />
                    </div>

                    <ImageUploader
                      bucket="site-media"
                      multiple={false}
                      value={banner.image_url ? [banner.image_url] : []}
                      onChange={(urls) => handleBannerUpdate(banner.id, 'image_url', urls[0] || '')}
                    />

                    <div className="flex items-center gap-4">
                      <select
                        value={banner.position}
                        onChange={(e) =>
                          handleBannerUpdate(banner.id, 'position', e.target.value)
                        }
                        className="h-9 px-3 rounded border border-gray-200 text-sm"
                      >
                        <option value="hero">Hero</option>
                        <option value="promo">Promo</option>
                        <option value="category">Category</option>
                      </select>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={banner.is_active}
                          onChange={(e) =>
                            handleBannerUpdate(banner.id, 'is_active', e.target.checked)
                          }
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600">
                          {language === 'ar' ? 'نشط' : 'Active'}
                        </span>
                      </label>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="text-red-600"
                      >
                        {language === 'ar' ? 'حذف' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              {language === 'ar' ? 'لا توجد بانرات' : 'No banners yet'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}