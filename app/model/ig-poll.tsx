"use client";

import { useState } from "react";
import Image from "next/image";

export default function IgPoll() {
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);
  const [shake, setShake] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiItems, setConfettiItems] = useState<
    Array<{ left: string; delay: string; duration: string; emoji: string }>
  >([]);

  const handleVote = (option: "yes" | "no") => {
    if (option === "no") {
      setShake(true);
      setTimeout(() => setShake(false), 500);

      // Paksa pilih YES setelah efek getar selesai
      setTimeout(() => {
        setVoted("yes");
        generateConfetti();
        setShowConfetti(true);
      }, 600);
    } else {
      setVoted("yes");
      generateConfetti();
      setShowConfetti(true);
    }
  };

  const generateConfetti = () => {
    const items = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 3}s`,
      emoji: ["🎉", "💖", "🌹", "✨", "😻"][Math.floor(Math.random() * 5)],
    }));
    setConfettiItems(items);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 font-sans overflow-hidden">
      {/* Background Blur Image (Optional, simulates IG story bg) */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 opacity-80" />

      {/* Main Story Container */}
      <div className="relative w-full max-w-md aspect-9/16 bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header (Profile & Time) */}
        <div className="absolute top-6 left-4 flex items-center space-x-3 z-20">
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative">
            <Image
              src="/Gemini_Generated_Image_xhfmdixhfmdixhfm.png"
              alt="Profile"
              priority
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold drop-shadow-md">
              your_crush_name
            </span>
            <span className="text-xs text-gray-200 drop-shadow-md">2h ago</span>
          </div>
        </div>

        {/* Story Content Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Gemini_Generated_Image_p6q9dhp6q9dhp6q9.png"
            alt="Story Background"
            priority
            fill
            className="object-cover opacity-90"
          />
        </div>

        {/* Poll Widget */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 z-30">
          <div className="bg-white text-black rounded-xl p-6 shadow-xl text-center transform -rotate-2">
            <h2 className="text-xl font-bold mb-6 font-serif">
              Valentine nanti jalan yuk? 🥺👉👈
            </h2>

            <div className="flex flex-col gap-3">
              {/* Option A (YES) */}
              <button
                onClick={() => handleVote("yes")}
                className={`relative h-12 rounded-lg border-2 border-gray-200 overflow-hidden transition-all duration-500 ${voted ? "border-green-500" : "hover:bg-gray-50"}`}
              >
                {/* Progress Bar Background */}
                <div
                  className="absolute top-0 left-0 h-full bg-green-100 transition-all duration-1000 ease-out"
                  style={{ width: voted ? "100%" : "0%" }}
                />

                <div className="relative flex justify-between items-center px-4 h-full z-10">
                  <span className="font-bold text-lg">MAU BANGET! 😍</span>
                  {voted && (
                    <span className="font-bold text-green-600 animate-in fade-in zoom-in">
                      100%
                    </span>
                  )}
                </div>
              </button>

              {/* Option B (NO) */}
              <button
                onClick={() => handleVote("no")}
                className={`relative h-12 rounded-lg border-2 border-gray-200 overflow-hidden transition-all duration-200 ${shake ? "animate-shake border-red-500 bg-red-50" : ""} ${voted ? "opacity-50" : "hover:bg-gray-50"}`}
                disabled={voted === "yes"}
              >
                {/* Progress Bar Background (Always 0%) */}
                <div
                  className="absolute top-0 left-0 h-full bg-red-100 transition-all duration-500"
                  style={{ width: "0%" }}
                />

                <div className="relative flex justify-between items-center px-4 h-full z-10">
                  <span className="font-bold text-lg">Gak dulu skip 🤮</span>
                  {voted && <span className="font-bold text-red-500">0%</span>}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Confetti Effect (CSS Only) */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {confettiItems.map((item, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-fall"
                style={{
                  left: item.left,
                  top: `-10%`,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                }}
              >
                {item.emoji}
              </div>
            ))}
          </div>
        )}

        {/* Message Input (Cosmetic) */}
        <div className="absolute bottom-6 left-4 right-4 h-12 bg-transparent border border-white/50 rounded-full flex items-center px-4 z-20 backdrop-blur-sm">
          <span className="text-white/80 text-sm">Send message...</span>
          <span className="ml-auto text-xl">❤️</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px) rotate(-5deg);
          }
          75% {
            transform: translateX(8px) rotate(5deg);
          }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(800px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}
