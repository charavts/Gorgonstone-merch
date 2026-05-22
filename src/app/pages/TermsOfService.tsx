import { useLanguage } from '../context/LanguageContext';

export default function TermsOfService() {
  const { language } = useLanguage();

  return (
    <main className="pt-24 pb-8 px-5">
      <div className="max-w-4xl mx-auto bg-[#6a6562] rounded-lg p-8 shadow-lg">
        <h1 className="text-white text-center mb-8">
          {language === 'el' ? 'Όροι Χρήσης' : 'Terms of Service'}
        </h1>
        
        <div className="bg-[#56514f] rounded-lg p-8">
          {language === 'el' ? (
            // Greek Content
            <div className="text-white space-y-6">
              <p className="text-white/60 text-sm">
                Τελευταία ενημέρωση: 22 Νοεμβρίου 2025
              </p>

              <section>
                <h2 className="text-white mb-3">1. Συμφωνία Όρων</h2>
                <p className="text-white/90 leading-relaxed">
                  Με την πρόσβαση και τη χρήση του ιστότοπου Gorgonstone και την αγορά των προϊόντων μας, συμφωνείτε να δεσμεύεστε από αυτούς τους Όρους Χρήσης. Εάν διαφωνείτε με οποιοδήποτε μέρος αυτών των όρων, δεν μπορείτε να έχετε πρόσβαση στον ιστότοπό μας ή να αγοράσετε τα προϊόντα μας.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">2. Προϊόντα και Τιμολόγηση</h2>
                <p className="text-white/90 leading-relaxed">
                  Όλα τα προϊόντα υπόκεινται σε διαθεσιμότητα. Διατηρούμε το δικαίωμα να περιορίσουμε τις ποσότητες ή να διακόψουμε οποιοδήποτε προϊόν ανά πάσα στιγμή. Οι τιμές αναφέρονται σε Ευρώ (€) και υπόκεινται σε αλλαγή χωρίς προειδοποίηση. Προσπαθούμε να εμφανίζουμε ακριβείς εικόνες και περιγραφές προϊόντων, αλλά δεν μπορούμε να εγγυηθούμε ότι τα χρώματα θα εμφανίζονται ακριβώς όπως φαίνονται στην οθόνη σας.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">3. Παραγγελίες και Πληρωμή</h2>
                <p className="text-white/90 leading-relaxed mb-2">
                  Κάνοντας μια παραγγελία, συμφωνείτε να:
                </p>
                <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                  <li>Παρέχετε ακριβείς και πλήρεις πληροφορίες</li>
                  <li>Πληρώσετε το πλήρες ποσό για την παραγγελία σας</li>
                  <li>Αναλάβετε την ευθύνη για την εξουσιοδότηση πληρωμής</li>
                </ul>
                <p className="text-white/90 leading-relaxed mt-3">
                  Η πληρωμή υποβάλλεται σε ασφαλή επεξεργασία μέσω της Stripe. Διατηρούμε το δικαίωμα να αρνηθούμε ή να ακυρώσουμε οποιαδήποτε παραγγελία κατά την κρίση μας.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">4. Αποστολή και Παράδοση</h2>
                <p className="text-white/90 leading-relaxed">
                  Οι χρόνοι και τα κόστη αποστολής ποικίλλουν ανάλογα με την τοποθεσία σας. Μόλις η παραγγελία σας αποσταλεί, θα λάβετε ένα email επιβεβαίωσης με ληροφορίες παρακολούθησης. Δεν είμαστε υπεύθυνοι για καθυστερήσεις που προκαλούνται από εταιρείες αποστολών ή τελωνειακές διαδικασίες. Ο κίνδυνος απώλειας μεταβιβάζεται σε εσάς μετά την παράδοση στον μεταφορέα.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">5. Επιστροφές και Επιστροφές Χρημάτων</h2>
                <p className="text-white/90 leading-relaxed">
                  Θέλουμε να είστε ικανοποιημένοι με την αγορά σας. Εάν δεν είστε απόλυτα ικανοποιημένοι, μπορείτε να επιστρέψετε αχρησιμοποίητα αντικείμενα στην αρχική τους κατάσταση εντός 14 ημερών από την παράδοση για επιστροφή χρημάτων ή ανταλλαγή. Τα έξοδα αποστολής δεν επιστρέφονται. Προσαρμοσμένα ή εξατομικευμένα αντικείμενα δεν μπορούν να επιστραφούν εκτός εάν είναι ελαττωματικά.
                </p>
                <p className="text-white/90 leading-relaxed mt-3">
                  Για να ξεκινήσετε μια επιστροφή, επικοινωνήστε μαζί μας στο infogorgonstone@gmail.com με τον αριθμό παραγγελίας σας.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">6. Πνευματική Ιδιοκτησία</h2>
                <p className="text-white/90 leading-relaxed">
                  Όλο το περιεχόμενο αυτού του ιστότοπου, συμπεριλαμβανομένων των σχεδίων, λογοτύπων, κειμένων, γραφικών και εικόνων, είναι ιδιοκτησία της Gorgonstone και προστατεύεται από νόμους περί πνευματικών δικαιωμάτων και εμπορικών σημάτων. Δεν επιτρέπεται να αναπαράγετε, να διανέμετε ή να χρησιμοποιείτε οποιοδήποτε περιεχόμενο χωρίς την ρητή γραπτή μας άδεια.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">7. Χρήση Προϊόντων</h2>
                <p className="text-white/90 leading-relaxed">
                  Τα προϊόντα μας εμπέονται από την αρχαία μυθολογία και προορίζονται μόνο για προσωπική χρήση. Τα σχέδια είναι καλλιτεχνικές ερμηνείες και δεν αποσκοπούν στην προσβολή οποιωνδήποτε πολιτιστικών ή θρησκευτικών πεποιθήσεων.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">8. Περιορισμός Ευθύνης</h2>
                <p className="text-white/90 leading-relaxed">
                  Στο μέγιστο βαθμό που επιτρέπεται από το νόμο, η Gorgonstone δεν φέρει ευθύνη για οποιεσδήποτε έμμεσες, τυχαίες, ειδικές ή επακόλουθες ζημίες που προκύπτουν από τη χρήση του ιστότοπου ή των προϊόντων μας. Η συνολική ευθύνη μας δεν θα υπερβαίνει το ποσό που καταβλήθηκε για το εν λόγω προϊόν.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">9. Αποζημίωση</h2>
                <p className="text-white/90 leading-relaxed">
                  Συμφωνείτε να αποζημιώσετε και να κρατήσετε την Gorgonstone αβ��αβή από οποιεσδήποτε αξιώσεις, ζημίες ή έξοδα που προκύπτουν από τη χρήση του ιστότοπου ή των προϊόντων μας, ή από την παραβίαση αυτών των όρων.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">10. Εφαρμοστέο Δίκαιο</h2>
                <p className="text-white/90 leading-relaxed">
                  Αυτοί οι Όροι Χρήσης διέπονται και ερμηνεύονται σύμφωνα με τους νόμους της Ελλάδας και της Ευρωπαϊκής Ένωσης. Τυχόν διαφορές θα επιλύονται στα δικαστήρια της Ελλάδας.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">11. Αλλαγές στους Όρους</h2>
                <p className="text-white/90 leading-relaxed">
                  Διατηρούμε το δικαίωμα να τροποποιήσουμε αυτούς τους όρους ανά πάσα στιγμή. Οι αλλαγές θα τεθούν σε ισχύ αμέσως μετά την ανάρτησή τους στον ιστότοπο. Η συνεχιζόμενη χρήση του ιστότοπου μετά από αλλαγές συνιστά αποδοχή των νέων όρων.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">12. Contact Information</h2>
                <p className="text-white/90 leading-relaxed">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <a
                  href="mailto:infogorgonstone@gmail.com"
                  className="text-white hover:text-white/80 transition-colors block mt-2"
                >
                  infogorgonstone@gmail.com
                </a>
              </section>

              <section className="pt-4 border-t border-white/20">
                <p className="text-white/60 text-sm italic">
                  Αποποίηση ευθύνης: Αυτοί οι όροι χρήσης είναι πρότυπο και θα πρέπει να αναθεωρηθούν από νομικό επαγγελματία για να διασφαλιστεί η συμμόρφωση με όλους τους ισχύοντες νόμους και κανονισμούς.
                </p>
              </section>
            </div>
          ) : (
            // English Content
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
                  To initiate a return, please contact us at infogorgonstone@gmail.com with your order number.
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
                  href="mailto:infogorgonstone@gmail.com"
                  className="text-white hover:text-white/80 transition-colors block mt-2"
                >
                  infogorgonstone@gmail.com
                </a>
              </section>

              <section className="pt-4 border-t border-white/20">
                <p className="text-white/60 text-sm italic">
                  Disclaimer: These terms of service are a template and should be reviewed by a legal professional to ensure compliance with all applicable laws and regulations.
                </p>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}