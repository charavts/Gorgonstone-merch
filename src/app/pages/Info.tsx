import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import gorgonstoneLogoImg from '../../imports/gorgonstone_exact_colors_transparent.png';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function Info() {
  const { t, language } = useLanguage();
  const [logoUrl, setLogoUrl] = useState('');
  const [aboutContent, setAboutContent] = useState({ en: { paragraph1: '', paragraph2: '', paragraph3: '' }, el: { paragraph1: '', paragraph2: '', paragraph3: '' } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAboutContent();
  }, []);

  const loadAboutContent = async () => {
    try {
      console.log('🔍 [Info] Loading site settings...');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/site-settings`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      console.log('[Info] Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[Info] Site settings data:', data);
        
        if (data.settings) {
          if (data.settings.logoUrl) {
            console.log('✅ [Info] Logo URL found:', data.settings.logoUrl);
            setLogoUrl(data.settings.logoUrl);
          } else {
            console.log('⚠️ [Info] No logoUrl in settings');
          }
          if (data.settings.aboutContent) {
            setAboutContent(data.settings.aboutContent);
          }
        }
      } else {
        console.error('❌ [Info] Failed to load settings, status:', response.status);
      }
    } catch (error) {
      console.error('❌ [Info] Error loading about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const content = language === 'el' ? aboutContent.el : aboutContent.en;

  return (
    <main className="pt-24 pb-40 px-5 min-h-screen">
      {/* Logo Section */}
      <div className="mb-6 text-center">
        <div className="flex justify-center">
          <ImageWithFallback
            src={gorgonstoneLogoImg}
            alt="Gorgonstone Logo"
            className="w-[280px] sm:w-[380px] max-w-[90vw] h-auto"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-[#6a6562] rounded-lg p-8 shadow-lg mb-8">
        {/* Title */}
        <h1 className="text-white mb-6">
          {language === 'el' ? 'Σχετικά' : 'About'}
        </h1>
        
        {/* Text section */}
        <div className="bg-[#56514f] rounded-lg p-8">
          <div className="text-white space-y-4">
            {loading ? (
              <p className="text-white/90 leading-relaxed">
                {t('loading')}
              </p>
            ) : (
              <>
                <p className="text-white/90 leading-relaxed">
                  {content.paragraph1}
                </p>
                <p className="text-white/90 leading-relaxed">
                  {content.paragraph2}
                </p>
                <p className="text-white/90 leading-relaxed">
                  {content.paragraph3}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}