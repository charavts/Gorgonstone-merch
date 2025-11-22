import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#6a6562] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="flex flex-col items-center gap-3">
          {/* Brand Name */}
          <h3 className="text-white">GORGONSTONE</h3>
          
          {/* Contact Email */}
          <div className="text-center">
            <a
              href="mailto:infogorgestone@gmail.com"
              className="text-white/80 hover:text-white transition-colors"
            >
              infogorgestone@gmail.com
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
              © 2025 Gorgonstone. All rights reserved.
            </p>
            <div className="flex gap-4 justify-center text-white/50 text-sm">
              <Link 
                to="/privacy-policy" 
                className="hover:text-white/70 transition-colors"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link 
                to="/terms-of-service" 
                className="hover:text-white/70 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}