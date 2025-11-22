import { Mail, Send } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Contact() {
  const email = 'infogorgestone@gmail.com';

  return (
    <main className="pt-24 pb-16 px-5 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-[#6a6562] rounded-lg shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-white mb-4">Contact Us</h1>
            <p className="text-white/80">
              Have a question or want to get in touch? We'd love to hear from you!
            </p>
          </div>

          <div className="bg-[#56514f] rounded-lg p-8 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail size={32} className="text-white" />
              <h2 className="text-white">Email Us</h2>
            </div>
            <a
              href={`mailto:${email}`}
              className="text-white hover:text-white/80 transition-colors block text-center"
            >
              {email}
            </a>
          </div>

          <a
            href={`mailto:${email}`}
            className="w-full bg-black hover:bg-[#444] text-white px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Send size={20} />
            <span>Send Email</span>
          </a>

          <div className="mt-8 text-center">
            <p className="text-white/70">
              We typically respond within 24-48 hours
            </p>
          </div>
        </div>

        {/* Bottom center logo - same as Home page */}
        <div className="mt-16 mb-8 flex justify-center w-full opacity-80">
          <ImageWithFallback
            src="https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/logo.png"
            alt="Gorgonstone Logo"
            className="w-[450px] max-w-[90vw] h-auto"
          />
        </div>
      </div>
    </main>
  );
}