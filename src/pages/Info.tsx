import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Info() {
  return (
    <main className="pt-24 pb-8 px-5">
      <div className="max-w-4xl mx-auto bg-[#6a6562] rounded-lg p-8 shadow-lg">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center justify-center">
            <div className="w-64 h-64">
              <ImageWithFallback
                src="https://github.com/charavts/Gorgonstone-merch/blob/main/src/public/logo.png?raw=true"
                alt="Gorgonstone Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#56514f] rounded-lg p-8">
          <div className="text-white space-y-4">
            <p className="text-white/90 leading-relaxed">
              This art-driven T-shirt project is built on a deep sensitivity toward the aesthetics, history, and cultural power of the ancient world. Each design draws inspiration from the myths, heroes, and daemons that shaped early civilizations, celebrating the timeless connection between storytelling and visual art.
            </p>
            <p className="text-white/90 leading-relaxed">
              The core inspiration comes from the legendary tale of Perseus and Medusa—an eternal symbol of courage, transformation, and the blurred line between monster and myth. Along with the broader era of heroes, these narratives fuel a collection that merges ancient symbolism with modern expression.
            </p>
            <p className="text-white/90 leading-relaxed">
              Every piece aims to bring the spirit of antiquity into the present, allowing wearers to carry fragments of myth, sculpture, and history as living forms of art.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}