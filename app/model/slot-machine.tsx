"use client";

import { useState } from "react";

const ICONS = ["💖", "💍", "🌹", "🍫", "💌", "✨"];
const JACKPOT_ICON = "💖";

export default function SlotMachine({ doiName }: { doiName: string }) {
  const [reels, setReels] = useState(["✨", "✨", "✨"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [isJackpot, setIsJackpot] = useState(false);
  const [message, setMessage] = useState("Coba keberuntunganmu! ✨");
  const [confetti, setConfetti] = useState<{ left: string; delay: string }[]>(
    [],
  );

  const spin = () => {
    if (isSpinning || isJackpot) return;

    setIsSpinning(true);
    setSpinCount((prev) => prev + 1);
    setMessage("Sedang memutar takdir... 🤞");

    const duration = 2000;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < duration) {
        setReels([
          ICONS[Math.floor(Math.random() * ICONS.length)],
          ICONS[Math.floor(Math.random() * ICONS.length)],
          ICONS[Math.floor(Math.random() * ICONS.length)],
        ]);
        requestAnimationFrame(animate);
      } else {
        finishSpin();
      }
    };

    requestAnimationFrame(animate);
  };

  const finishSpin = () => {
    setIsSpinning(false);

    // Putaran ke-3 selalu Jackpot
    if (spinCount >= 2) {
      setReels([JACKPOT_ICON, JACKPOT_ICON, JACKPOT_ICON]);
      setIsJackpot(true);
      setMessage("JACKPOT! Kamu adalah takdirku! ❤️");

      // Generate confetti data once
      const newConfetti = Array.from({ length: 20 }).map(() => ({
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
      }));
      setConfetti(newConfetti);
    } else {
      // Hampir menang (2 sama, 1 beda)
      const randomIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
      let differentIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
      while (differentIcon === randomIcon) {
        differentIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
      }

      setReels([randomIcon, randomIcon, differentIcon]);
      setMessage(
        spinCount === 1
          ? "Hampir saja! Sekali lagi? 🥺"
          : "Yah, belum hoki. Coba lagi! 🔄",
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-900 via-rose-800 to-rose-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden relative">
      {/* Dynamic Ambient Glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-radial from-rose-500/30 to-transparent pointer-events-none transition-transform duration-1000 ${isSpinning ? "scale-125 opacity-60" : "scale-100 opacity-40"}`}
      />

      <div className="text-center mb-10 relative z-10 animate-float">
        <div className="inline-block bg-white/10 border border-white/20 px-5 py-1.5 rounded-full mb-4 backdrop-blur-md shadow-lg">
          <span className="text-rose-200 text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-sm">
            Destiny Game
          </span>
        </div>
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Love{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 via-white to-rose-400 animate-pulse">
            Jackpot
          </span>
        </h1>
        <p className="text-rose-300 text-[10px] font-bold mt-2 tracking-widest uppercase opacity-80">
          Apakah kita ditakdirkan bersama? 🎰
        </p>
      </div>

      {/* Slot Machine Body - Vibrant Red Glass */}
      <div className="relative bg-rose-500/20 backdrop-blur-2xl p-8 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6),inset_0_0_40px_rgba(255,255,255,0.1)] border border-white/20 max-w-sm w-full z-10 overflow-visible">
        {/* Casino Lights - Glowing Gold */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-white/30 ${isSpinning ? "bg-amber-400 shadow-[0_0_20px_#fbbf24] scale-125" : "bg-rose-900/60"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* Reels Container - Deep Velvet Background */}
        <div className="bg-rose-950/80 rounded-[2.5rem] p-6 flex gap-4 justify-between items-center overflow-hidden border-2 border-rose-400/30 shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] h-48 relative">
          {/* Reel Shadow Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/40 pointer-events-none z-10" />

          {reels.map((icon, i) => (
            <div
              key={i}
              className={`flex-1 h-full bg-linear-to-b from-rose-100 to-white border-x border-rose-200 rounded-2xl flex items-center justify-center text-5xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300 ${isSpinning ? "blur-[2px] scale-95" : "blur-0 scale-100"}`}
            >
              <span className="drop-shadow-md">{icon}</span>
            </div>
          ))}
        </div>

        {/* Info Screen - Neon Pink Text */}
        <div className="mt-8 text-center px-4">
          <p className="text-rose-100 font-bold text-sm italic font-serif leading-relaxed drop-shadow-[0_0_10px_rgba(255,150,150,0.5)]">
            &quot;{message}&quot;
          </p>
        </div>

        {/* Spin Button - Glowing Red/Gold */}
        <button
          onClick={spin}
          disabled={isSpinning || isJackpot}
          className={`mt-10 w-full py-5 rounded-2xl font-black text-xl uppercase tracking-[0.25em] transition-all duration-300 relative overflow-hidden group
            ${
              isSpinning || isJackpot
                ? "bg-rose-900/40 text-rose-500/40 cursor-not-allowed border border-rose-500/20"
                : "bg-linear-to-r from-rose-600 to-rose-500 text-white hover:scale-[1.03] active:scale-95 shadow-[0_20px_40px_rgba(225,29,72,0.4)] border-t border-rose-400"
            }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isJackpot
              ? "JACKPOT! ❤️"
              : isSpinning
                ? "SPINNING..."
                : "SPIN LUCK"}
          </span>
          {!isSpinning && !isJackpot && (
            <>
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
            </>
          )}
        </button>
      </div>

      {/* Jackpot Modal - Pure Valentine Joy */}
      {isJackpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/90 backdrop-blur-2xl animate-fade-in">
          <div className="text-center p-8 max-w-xs relative">
            {/* Modal Glow */}
            <div className="absolute inset-0 bg-rose-500/20 blur-[100px] -z-10" />

            <div className="text-9xl mb-8 animate-bounce drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              🎰
            </div>
            <h1 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">
              YOU WON <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-rose-200">
                MY HEART! ❤️
              </span>
            </h1>
            <p className="text-rose-100 text-xl font-medium mb-10 opacity-90">
              Takdir berkata kita berjodoh, {doiName}! ✨
            </p>

            <div className="space-y-4">
              <button className="w-full bg-white text-rose-600 py-5 rounded-full font-black text-xl shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all">
                BE MY VALENTINE? 💍
              </button>
            </div>
          </div>

          {/* Confetti Hati */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confetti.map((c, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-float-up"
                style={{
                  left: c.left,
                  bottom: `-10%`,
                  animationDelay: c.delay,
                  opacity: 0.6,
                }}
              >
                💖
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 4s linear infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
