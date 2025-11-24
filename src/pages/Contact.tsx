import { Mail, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function Contact() {
  const { t, language } = useLanguage();
  const [contactEmail, setContactEmail] = useState('infogorgonstone@gmail.com');
  const [responseTime, setResponseTime] = useState({ en: '', el: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContactSettings = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/site-settings`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setContactEmail(data.settings.contactEmail || 'infogorgonstone@gmail.com');
            setResponseTime(data.settings.responseTime || {
              en: 'We typically respond in 24-48 hours',
              el: 'Συνήθως απαντάμε εντός 24-48 ωρών'
            });
          }
        }
      } catch (error) {
        console.error('Error loading contact settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContactSettings();
  }, []);

  return (
    <main className="pt-24 pb-16 px-5 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-[#6a6562] rounded-lg shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-white mb-4">{t('contact.title')}</h1>
            <p className="text-white/80">
              {t('contact.description')}
            </p>
          </div>

          <div className="bg-[#56514f] rounded-lg p-8 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail size={32} className="text-white" />
              <h2 className="text-white">{t('contact.email')}</h2>
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="text-white hover:text-white/80 transition-colors block text-center cursor-pointer"
            >
              {contactEmail}
            </a>
          </div>

          <a
            href={`mailto:${contactEmail}`}
            className="w-full bg-black hover:bg-[#444] text-white px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send size={20} />
            <span>{t('contact.send')} Email</span>
          </a>

          <div className="mt-8 text-center">
            <p className="text-white/70">
              {loading ? '...' : (language === 'el' ? responseTime.el : responseTime.en)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}