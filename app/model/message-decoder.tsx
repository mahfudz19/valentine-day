"use client";

import { useState, useEffect } from "react";

export default function MessageDecoder({ doiName }: { doiName: string }) {
  const secretMessage = `Aku mencintaimu lebih dari kata-kata yang bisa didekodekan, ${doiName}. ❤️`;
  const [sliderValue, setSliderValue] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");
  const targetValue = 100;

  // Characters for the glitch effect
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+-=[]{}|;:,.<>?";

  useEffect(() => {
    if (isUnlocked) return;

    const interval = setInterval(() => {
      const scrambled = secretMessage
        .split("")
        .map((char, index) => {
          if (char === " " || char === "," || char === ".") return char;
          // Reveal characters based on slider progress
          const revealThreshold =
            (sliderValue / targetValue) * secretMessage.length;
          if (index < revealThreshold) {
            return secretMessage[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      setDisplayMessage(scrambled);
    }, 50);

    return () => clearInterval(interval);
  }, [sliderValue, isUnlocked, secretMessage]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    if (val >= targetValue) {
      setIsUnlocked(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 select-none overflow-hidden relative font-mono">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.2)_0%,transparent_70%)]" />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-block border border-rose-500/50 px-4 py-1 rounded-sm mb-4 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          <span className="text-rose-400 text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse">
            System Encrypted
          </span>
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic shadow-rose-500/50 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          LOVE <span className="text-rose-500">DECODER</span>
        </h1>
        <p className="text-rose-500/60 text-[10px] font-bold mt-2 tracking-widest uppercase">
          Geser untuk memecahkan takdir 🔓
        </p>
      </div>

      {/* Decoder Terminal */}
      <div className="relative w-full max-w-lg bg-zinc-900/80 border-2 border-rose-500/30 p-8 rounded-lg shadow-[0_0_40px_rgba(244,63,94,0.15)] z-10 overflow-hidden group">
        {/* Scanner Line Effect */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-rose-500/10 to-transparent h-1/2 w-full animate-scan-slow pointer-events-none" />
        )}

        {/* Display Area */}
        <div className="relative min-h-50 h-full max-h-50 flex items-center justify-center bg-black/60 p-6 border border-rose-500/20 rounded-md">
          <p
            className={`text-xl text-center leading-relaxed transition-all duration-300 ${isUnlocked ? "text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" : "text-zinc-500"}`}
          >
            {isUnlocked ? secretMessage : displayMessage}
          </p>

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-rose-500/50" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-rose-500/50" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-rose-500/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-rose-500/50" />
        </div>

        {/* Slider Section */}
        <div className="mt-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] text-rose-500/50 font-bold uppercase tracking-widest">
              Decryption Progress
            </span>
            <span className="text-rose-400 font-bold tabular-nums">
              {sliderValue}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            disabled={isUnlocked}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
          />

          <div className="mt-6 flex justify-center">
            {isUnlocked ? (
              <div className="animate-bounce text-rose-500 flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                <span>Access Granted</span>
                <span className="text-xl">💖</span>
              </div>
            ) : (
              <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                Slide to decypher message
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-rose-500/30 text-[9px] uppercase tracking-[0.5em] z-10">
        Security Level: Eternal Love
      </div>

      <style jsx global>{`
        @keyframes scan-slow {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
        .animate-scan-slow {
          animation: scan-slow 3s linear infinite;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #f43f5e;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(244, 63, 94, 0.6);
          border: 2px solid white;
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #f43f5e;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(244, 63, 94, 0.6);
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
}
