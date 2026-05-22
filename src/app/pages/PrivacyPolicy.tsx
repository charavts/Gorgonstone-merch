import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicy() {
  const { language } = useLanguage();

  return (
    <main className="pt-24 pb-8 px-5">
      <div className="max-w-4xl mx-auto bg-[#6a6562] rounded-lg p-8 shadow-lg">
        <h1 className="text-white text-center mb-8">
          {language === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}
        </h1>
        
        <div className="bg-[#56514f] rounded-lg p-8">
          {language === 'el' ? (
            // Greek Content
            <div className="text-white space-y-6">
              <p className="text-white/60 text-sm">
                Τελευταία ενημέρωση: 22 Νοεμβρίου 2025
              </p>

              <section>
                <h2 className="text-white mb-3">1. Εισαγωγή</h2>
                <p className="text-white/90 leading-relaxed">
                  Καλώς ήρθατε στο Gorgonstone. Σεβόμαστε το απόρρητό σας και δεσμευόμαστε να προστατεύσουμε τα προσωπικά σας δεδομένα. Αυτή η πολιτική απορρήτου θα σας ενημερώσει για το πώς χειριζόμαστε τα προσωπικά σας δεδομένα όταν επισκέπτεστε τον ιστότοπό μας και αγοράζετε τα προϊόντα μας.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">2. Δεδομένα που Συλλέγουμε</h2>
                <p className="text-white/90 leading-relaxed mb-2">
                  Μπορεί να συλλέξουμε, να χρησιμοποιήσουμε, να αποθηκεύσουμε και να μεταφέρουμε τους ακόλουθους τύπους προσωπικών δεδομένων:
                </p>
                <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                  <li>Δεδομένα Ταυτότητας: όνομα, όνομα χρήστη</li>
                  <li>Δεδομένα Επικοινωνίας: διεύθυνση email, διεύθυνση παράδοσης, τηλέφωνο</li>
                  <li>Δεδομένα Συναλλαγών: στοιχεία πληρωμής, ιστορικό αγορών</li>
                  <li>Τεχνικά Δεδομένα: διεύθυνση IP, τύπος browser, πληροφορίες συσκευής</li>
                  <li>Δεδομένα Χρήσης: πώς χρησιμοποιείτε τον ιστότοπο και τα προϊόντα μας</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white mb-3">3. Πώς Χρησιμοποιούμε τα Δεδομένα σας</h2>
                <p className="text-white/90 leading-relaxed mb-2">
                  Θα χρησιμοποιήσουμε τα προσωπικά σας δεδομένα μόνο όταν το επιτρέπει ο νόμος. Πιο συχνά, τα χρησιμοποιούμε για:
                </p>
                <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                  <li>Επεξεργασία και παράδοση των παραγγελιών σας</li>
                  <li>Διαχείριση πληρωμών και είσπραξη χρημάτων</li>
                  <li>Επικοινωνία μαζί σας για τις παραγγελίες σας</li>
                  <li>Αποστολή μηνυμάτων μάρκετινγκ (με τη συγκατάθεσή σας)</li>
                  <li>Βελτίωση του ιστοτόπου και της εμπειρίας πελάτη</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white mb-3">4. Διαμοιρασμός Δεδομένων</h2>
                <p className="text-white/90 leading-relaxed">
                  Μπορεί να μοιραστούμε τα προσωπικά σας δεδομένα με παρόχους υπηρεσιών τρίτων που μας βοηθούν να λειτουργήσουμε την επιχείρησή μας, συμπεριλαμβανομένων:
                </p>
                <ul className="list-disc list-inside text-white/90 space-y-2 ml-4 mt-2">
                  <li>Επεξεργαστές πληρωμών (Stripe) για ασφαλή επεξεργασία πληρωμών</li>
                  <li>Εταιρείες αποστολών για παράδοση παραγγελιών</li>
                  <li>Πάροχοι υπηρεσιών email για επιβεβαιώσεις παραγγελιών</li>
                </ul>
                <p className="text-white/90 leading-relaxed mt-3">
                  Δεν θα πουλήσουμε ποτέ τα προσωπικά σας δεδομένα σε τρίτους.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">5. Ασφάλεια Δεδομένων</h2>
                <p className="text-white/90 leading-relaxed">
                  Έχουμε εφαρμόσει κατάλληλα μέτρα ασφαλείας για να αποτρέψουμε την τυχαία απώλεια, χρήση ή πρόσβαση στα προσωπικά σας δεδομένα με μη εξουσιοδοτημένο τρόπο. Οι πληροφορίες πληρωμής υποβάλλονται σε ασφαλή επεξεργασία μέσω της Stripe και δεν αποθηκεύουμε στοιχεία πιστωτικών καρτών.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">6. Τα Δικαιώματά σας (GDPR)</h2>
                <p className="text-white/90 leading-relaxed mb-2">
                  Σύμφωνα με τους νόμους προστασίας δεδομένων, έχετε δικαιώματα που περιλαμβάνουν:
                </p>
                <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                  <li>Δικαίωμα πρόσβασης στα προσωπικά σας δεδομένα</li>
                  <li>Δικαίωμα διόρθωσης εσφαλμένων δεδομένων</li>
                  <li>Δικαίωμα διαγραφής («δικαίωμα στη λήθη»)</li>
                  <li>Δικαίωμα περιορισμού της επεξεργασίας</li>
                  <li>Δικαίωμα φορητότητας δεδομένων</li>
                  <li>Δικαίωμα εναντίωσης στην επεξεργασία</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white mb-3">7. Cookies</h2>
                <p className="text-white/90 leading-relaxed">
                  Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία περιήγησής σας και να διατηρήσουμε το καλάθι αγορών σας. Αυτά είναι απαραίτητα για τη σωστή λειτουργία του ιστότοπου. Χρησιμοποιώντας τον ιστότοπό μας, συναινείτε στη χρήση cookies.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">8. Διατήρηση Δεδομένων</h2>
                <p className="text-white/90 leading-relaxed">
                  Θα διατηρήσουμε τα προσωπικά σας δεδομένα μόνο για όσο χρόνο είναι απαραίτητο για την εκπλήρωση των σκοπών για τους οποίους τα συλλέξαμε, συμπεριλαμβανομένων νομικών, λογιστικών ή απαιτήσεων αναφοράς.
                </p>
              </section>

              <section>
                <h2 className="text-white mb-3">9. Contact Us</h2>
                <p className="text-white/90 leading-relaxed">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
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
                  Αποποίηση ευθύνης: Αυτή η πολιτική απορρήτου είναι πρότυπο και θα πρέπει να αναθεωρηθεί από νομικό επαγγελματία για να διασφαλιστεί η συμμόρφωση με όλους τους ισχύοντες νόμους και κανονισμούς.
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
                  href="mailto:infogorgonstone@gmail.com"
                  className="text-white hover:text-white/80 transition-colors block mt-2"
                >
                  infogorgonstone@gmail.com
                </a>
              </section>

              <section className="pt-4 border-t border-white/20">
                <p className="text-white/60 text-sm italic">
                  Disclaimer: This privacy policy is a template and should be reviewed by a legal professional to ensure compliance with all applicable laws and regulations.
                </p>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
