import { useLanguage } from '../context/LanguageContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Info() {
  const { language } = useLanguage();

  return (
    <main className="pt-24 pb-40 px-5">{/* Increased bottom padding from pb-8 to pb-40 to match Home and Contact pages */}
      {/* Logo Section */}
      <div className="mb-3">
        <div className="py-0">
          <div className="max-w-[320px] mx-auto px-5 flex justify-center">
            <ImageWithFallback
              src="https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/logo.png"
              alt="Gorgonstone Logo"
              className="w-[300px] max-w-[80vw] h-auto opacity-90"
            />
          </div>
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
            {language === 'el' ? (
              <>
                <p className="text-white/90 leading-relaxed">
                  Αυτό το art-driven T-shirt project βασίζεται σε μια βαθιά ευαισθησία απένατι στην αισθητική, την ιστορία και τη πολιτιστική δύναμη του αρχαίου κόσμου. Κάθε σχέδιο εμπνέεται από τους μύθους, τους ήρωες και τους δαίμονες που διαμόρφωσαν τους πρώτους πολιτισμούς, γιορτάζοντας την αιώνια σύνδεση μεταξύ αφήγησης και οπτικής τέχνης.
                </p>
                <p className="text-white/90 leading-relaxed">
                  Η βασική έμπνευση προέρχεται από τον θρυλικό μύθο του Περσέα και της Μέδουσας—ένα αιώνιο σύμβολο θάρρους, μεταμόρφωσης και της θολής γραμμής μεταξύ τέρατος και μύθου. Μαζί με την ευρύτερη εποχή των ηρώων, αυτές οι αφηγήσεις τροφοδοτούν μια συλλογή που συνδυάζει τον αρχαίο συμβολισμό με τη σύγχρονη έκφραση.
                </p>
                <p className="text-white/90 leading-relaxed">
                  Κάθε κομμάτι στοχεύει να φέρει το πνεύμα της αρχαιότητας στο παρόν, επιτρέποντας στους φορείς να εταφέρουν θραύσματα μύθου, γλυπτικής και ιστορίας ως ζωντανές μορφές τέχνης.
                </p>
              </>
            ) : (
              <>
                <p className="text-white/90 leading-relaxed">
                  This art-driven T-shirt project is built on a deep sensitivity toward the aesthetics, history, and cultural power of the ancient world. Each design draws inspiration from the myths, heroes, and daemons that shaped early civilizations, celebrating the timeless connection between storytelling and visual art.
                </p>
                <p className="text-white/90 leading-relaxed">
                  The core inspiration comes from the legendary tale of Perseus and Medusa—an eternal symbol of courage, transformation, and the blurred line between monster and myth. Along with the broader era of heroes, these narratives fuel a collection that merges ancient symbolism with modern expression.
                </p>
                <p className="text-white/90 leading-relaxed">
                  Every piece aims to bring the spirit of antiquity into the present, allowing wearers to carry fragments of myth, sculpture, and history as living forms of art.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}