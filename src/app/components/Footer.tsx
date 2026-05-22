import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-[#56514f] mt-auto">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="flex flex-col items-center gap-3">
          {/* Contact Email */}
          <div className="text-center">
            <a
              href="mailto:infogorgonstone@gmail.com"
              className="text-white/80 hover:text-white transition-colors"
            >
              infogorgonstone@gmail.com
            </a>
          </div>
          
          {/* Social Media */}
          <div className="flex items-center gap-4">
            <span className="text-white/70">Follow Us:</span>
            <a
              href="https://www.instagram.com/gorgonstonemerch/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
            >
              <Instagram size={24} />
              <span>@gorgonstonemerch</span>
            </a>
          </div>
          
          {/* Divider */}
          <div className="w-full max-w-md border-t border-white/20 my-2"></div>
          
          {/* Copyright & Links */}
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-4 justify-center text-white/50 text-sm">
              <Link 
                to="/privacy-policy" 
                className="hover:text-white/70 transition-colors"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <span>•</span>
              <Link 
                to="/terms-of-service" 
                className="hover:text-white/70 transition-colors"
              >
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}