import Image from "next/image";
import { useEffect, useState } from "react";

const Background = () => {
  const [mounted, setMounted] = useState(false);
  const [petals, setPetals] = useState<
    {
      id: number;
      left: string;
      top: string;
      size: string;
      delay: string;
      duration: string;
      symbol: string;
    }[]
  >([]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const symbols = ["🌸", "✨", "❤️", "🌷"];
      const newPetals = [...Array(15)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 20 + 15}px`,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 10 + 10}s`,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      }));
      setPetals(newPetals);
      setMounted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {mounted &&
        petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute animate-float opacity-40"
            style={{
              left: petal.left,
              top: petal.top,
              fontSize: petal.size,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
            }}
          >
            {petal.symbol}
          </div>
        ))}
    </div>
  );
};

const Button = () => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );

  const moveButton = () => {
    const padding = 20;
    const buttonWidth = 144;
    const buttonHeight = 56;

    // Batasan layar
    const maxWidth = window.innerWidth - buttonWidth - padding;
    const maxHeight = window.innerHeight - buttonHeight - padding;

    // Generate posisi acak
    const randomX = Math.max(padding, Math.random() * maxWidth);
    const randomY = Math.max(padding, Math.random() * maxHeight);

    setPosition({ x: randomX, y: randomY });
  };

  return (
    <button
      onMouseEnter={moveButton}
      onClick={moveButton}
      style={
        position
          ? {
              position: "fixed", // Saat bergerak, lepas dari flow dan jadi fixed di layar
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: "144px",
              zIndex: 50,
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }
          : {
              // Posisi default (diam)
              // Tidak perlu absolute/fixed, biarkan browser yang atur posisinya di dalam flex container
              // Ini menjamin posisi awal 100% akurat sesuai layout
            }
      }
      className="w-full sm:w-36 bg-gray-50 text-rose-400 font-bold py-4 rounded-2xl transition-all cursor-pointer hover:bg-rose-50/50 border-4 border-rose-100 shadow-sm whitespace-nowrap z-30"
    >
      Nanti dulu
    </button>
  );
};

export default function MovingButton() {
  const [yesPressed, setYesPressed] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-rose-100 via-pink-50 to-white overflow-hidden">
      {/* Background Decoration: Floating Petals */}
      <Background />

      {/* Main Card: No Border, Soft Shadow */}
      <div className="relative z-10 w-full max-w-sm bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(255,182,193,0.4)] p-10 text-center flex flex-col items-center animate-in fade-in zoom-in duration-700">
        {yesPressed ? (
          <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center">
            <div className="relative w-48 h-48 mb-8">
              <div className="absolute -inset-4 bg-rose-200/50 blur-2xl rounded-full animate-pulse"></div>
              <Image
                src="/Gemini_Generated_Image_p6q9dhp6q9dhp6q9.png"
                alt="Kucing Merayakan"
                fill
                className="relative object-cover rounded-full border-4 border-white shadow-xl"
              />
            </div>
            <h2 className="text-3xl font-serif font-black text-rose-600 mb-4 leading-tight">
              Yippie! <br /> Sampai ketemu nanti ya! ❤️
            </h2>
            <p className="text-rose-400 font-medium">
              Jangan lupa kabari aku! ✨
            </p>
          </div>
        ) : (
          <>
            {/* Image Container with Soft Glow */}
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-rose-100/50 blur-xl rounded-full"></div>
              <div className="relative w-48 h-48 md:w-52 md:h-52">
                <Image
                  src="/Gemini_Generated_Image_xhfmdixhfmdixhfm.png"
                  alt="Kucing Lucu"
                  fill
                  sizes="(max-width: 768px) 192px, 208px"
                  priority
                  className="object-cover rounded-full border-4 border-white shadow-lg"
                />
              </div>
            </div>

            {/* Text Section: Elegant Typography */}
            <div className="space-y-4 mb-10">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-rose-800 leading-tight">
                Hai, ada waktu bentar?
              </h1>
              <p className="text-rose-600/70 text-base font-medium leading-relaxed px-2">
                Kayaknya bakal seru kalau kita jalan pas Valentine nanti.
                Gimana, mau nggak? 😊
              </p>
            </div>

            {/* Buttons Container */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setYesPressed(true)}
                className="w-full sm:w-36 bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-300/50 transition-all hover:scale-105 active:scale-95 cursor-pointer z-30"
              >
                Mau! ✨
              </button>
              <Button />
            </div>

            {/* Footer Note */}
            <div className="mt-10 pt-6 border-t border-rose-50/50 w-full">
              <p className="text-[10px] text-rose-300 font-bold uppercase tracking-[0.4em]">
                No pressure, just fun!
              </p>
            </div>
          </>
        )}
      </div>

      {/* Aesthetic Bottom Wave (SVG) */}
      <div className="absolute bottom-0 left-0 w-full leading-0 rotate-180">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-20 fill-rose-100/50"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.96C25,54.67,57.5,63.15,90,67.12c53.3,6.52,108.44,1.44,161.53-7.58l3.86-3.1Z"></path>
        </svg>
      </div>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
