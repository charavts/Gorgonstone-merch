import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function PrivacyPolicy() {
  return (
    <main className="pt-24 pb-8 px-5">
      <div className="max-w-4xl mx-auto bg-[#6a6562] rounded-lg p-8 shadow-lg">
        <h1 className="text-white text-center mb-8">Privacy Policy</h1>
        
        <div className="bg-[#56514f] rounded-lg p-8">
          <div className="text-white space-y-6">
            <p className="text-white/60 text-sm">
              Last updated: November 22, 2025
            </p>

            <section>
              <h2 className="text-white mb-3">1. Introduction</h2>
              <p className="text-white/90 leading-relaxed">
                Welcome to Gorgonstone. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you visit our website and purchase our products.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">2. Data We Collect</h2>
              <p className="text-white/90 leading-relaxed mb-2">
                We may collect, use, store and transfer the following types of personal data:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                <li>Identity Data: name, username</li>
                <li>Contact Data: email address, delivery address, phone number</li>
                <li>Transaction Data: payment details, purchase history</li>
                <li>Technical Data: IP address, browser type, device information</li>
                <li>Usage Data: how you use our website and products</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white mb-3">3. How We Use Your Data</h2>
              <p className="text-white/90 leading-relaxed mb-2">
                We will only use your personal data when the law allows us to. Most commonly, we use it to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                <li>Process and deliver your orders</li>
                <li>Manage payments and collect money owed to us</li>
                <li>Communicate with you about your orders</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and customer experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white mb-3">4. Data Sharing</h2>
              <p className="text-white/90 leading-relaxed">
                We may share your personal data with third-party service providers who help us operate our business, including:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 ml-4 mt-2">
                <li>Payment processors (Stripe) for secure payment processing</li>
                <li>Shipping companies for order delivery</li>
                <li>Email service providers for order confirmations</li>
              </ul>
              <p className="text-white/90 leading-relaxed mt-3">
                We will never sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">5. Data Security</h2>
              <p className="text-white/90 leading-relaxed">
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. Payment information is processed securely through Stripe and we do not store credit card details.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">6. Your Rights (GDPR)</h2>
              <p className="text-white/90 leading-relaxed mb-2">
                Under data protection laws, you have rights including:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                <li>Right to access your personal data</li>
                <li>Right to rectification of incorrect data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white mb-3">7. Cookies</h2>
              <p className="text-white/90 leading-relaxed">
                We use cookies to improve your browsing experience and maintain your shopping cart. These are essential for the website to function properly. By using our website, you consent to our use of cookies.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">8. Data Retention</h2>
              <p className="text-white/90 leading-relaxed">
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for legal, accounting, or reporting requirements.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">9. Contact Us</h2>
              <p className="text-white/90 leading-relaxed">
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
              </p>
              <a
                href="mailto:infogorgestone@gmail.com"
                className="text-white hover:text-white/80 transition-colors block mt-2"
              >
                infogorgestone@gmail.com
              </a>
            </section>

            <section className="pt-4 border-t border-white/20">
              <p className="text-white/60 text-sm italic">
                Disclaimer: This privacy policy is a template and should be reviewed by a legal professional to ensure compliance with all applicable laws and regulations.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Bottom center logo */}
      <div className="mt-16 mb-8 flex justify-center w-full opacity-80">
        <ImageWithFallback
          src="https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/logo.png"
          alt="Gorgonstone Logo"
          className="w-[450px] max-w-[90vw] h-auto"
        />
      </div>
    </main>
  );
}
