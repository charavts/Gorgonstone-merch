import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function TermsOfService() {
  return (
    <main className="pt-24 pb-8 px-5">
      <div className="max-w-4xl mx-auto bg-[#6a6562] rounded-lg p-8 shadow-lg">
        <h1 className="text-white text-center mb-8">Terms of Service</h1>
        
        <div className="bg-[#56514f] rounded-lg p-8">
          <div className="text-white space-y-6">
            <p className="text-white/60 text-sm">
              Last updated: November 22, 2025
            </p>

            <section>
              <h2 className="text-white mb-3">1. Agreement to Terms</h2>
              <p className="text-white/90 leading-relaxed">
                By accessing and using the Gorgonstone website and purchasing our products, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our website or purchase our products.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">2. Products and Pricing</h2>
              <p className="text-white/90 leading-relaxed">
                All products are subject to availability. We reserve the right to limit quantities or discontinue any product at any time. Prices are listed in Euros (€) and are subject to change without notice. We strive to display accurate product images and descriptions, but cannot guarantee that colors will appear exactly as shown on your screen.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">3. Orders and Payment</h2>
              <p className="text-white/90 leading-relaxed mb-2">
                By placing an order, you agree to:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Pay the full amount for your order</li>
                <li>Accept responsibility for payment authorization</li>
              </ul>
              <p className="text-white/90 leading-relaxed mt-3">
                Payment is processed securely through Stripe. We reserve the right to refuse or cancel any order at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">4. Shipping and Delivery</h2>
              <p className="text-white/90 leading-relaxed">
                Shipping times and costs vary depending on your location. Once your order is shipped, you will receive a confirmation email with tracking information. We are not responsible for delays caused by shipping carriers or customs procedures. Risk of loss passes to you upon delivery to the shipping carrier.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">5. Returns and Refunds</h2>
              <p className="text-white/90 leading-relaxed">
                We want you to be satisfied with your purchase. If you are not completely satisfied, you may return unused items in their original condition within 14 days of delivery for a refund or exchange. Shipping costs are non-refundable. Custom or personalized items cannot be returned unless defective.
              </p>
              <p className="text-white/90 leading-relaxed mt-3">
                To initiate a return, please contact us at infogorgestone@gmail.com with your order number.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">6. Intellectual Property</h2>
              <p className="text-white/90 leading-relaxed">
                All content on this website, including designs, logos, text, graphics, and images, is the property of Gorgonstone and is protected by copyright and trademark laws. You may not reproduce, distribute, or use any content without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">7. Product Use</h2>
              <p className="text-white/90 leading-relaxed">
                Our products are inspired by ancient mythology and are intended for personal use only. The designs are artistic interpretations and are not intended to offend any cultural or religious beliefs.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">8. Limitation of Liability</h2>
              <p className="text-white/90 leading-relaxed">
                To the fullest extent permitted by law, Gorgonstone shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid for the product in question.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">9. Indemnification</h2>
              <p className="text-white/90 leading-relaxed">
                You agree to indemnify and hold Gorgonstone harmless from any claims, damages, or expenses arising from your use of our website or products, or your violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">10. Governing Law</h2>
              <p className="text-white/90 leading-relaxed">
                These Terms of Service are governed by and construed in accordance with the laws of Greece and the European Union. Any disputes shall be resolved in the courts of Greece.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">11. Changes to Terms</h2>
              <p className="text-white/90 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-white mb-3">12. Contact Information</h2>
              <p className="text-white/90 leading-relaxed">
                For questions about these Terms of Service, please contact us at:
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
                Disclaimer: These terms of service are a template and should be reviewed by a legal professional to ensure compliance with all applicable laws and regulations.
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
