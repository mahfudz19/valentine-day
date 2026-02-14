"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ButtonBigger() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hearts, setHearts] = useState<
    {
      id: number;
      left: string;
      top: string;
      size: string;
      delay: string;
      duration: string;
    }[]
  >([]);

  useEffect(() => {
    // Menggunakan requestAnimationFrame untuk memindahkan setState ke frame berikutnya,
    // menghindari sinkronisasi langsung di dalam effect body yang memicu peringatan ESLint.
    const frameId = requestAnimationFrame(() => {
      const newHearts = [...Array(15)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 20 + 10}px`,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 10 + 10}s`,
      }));

      setHearts(newHearts);
      setMounted(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const yesButtonFontSize = Math.min(noCount * 5 + 16, 40); // Batasi ukuran teks agar tidak meluap
  const yesButtonPaddingX = noCount * 15 + 32; // Tombol tetap membesar secara fisik melalui padding
  const yesButtonPaddingY = noCount * 8 + 16;

  const handleNoClick = () => {
    setNoCount(noCount + 1);
  };

  const getNoButtonText = () => {
    const phrases = [
      "Enggak",
      "Yakin?",
      "Coba pikir dulu...",
      "Yah, kok gitu?",
      "Nanti nyesel lho..",
      "Kasih kesempatan dong",
      "Beneran nih? 🥺",
      "Aku bakal sedih dikit :(",
      "Yah, ditolak mentah-mentah 💔",
      "Sedih banget lho ini..",
      "Ok, aku nyerah... tapi boong",
      "Sekali aja pliss...",
      ":((((",
      "Beneran nggak mau?",
      "Enggak :(",
    ];

    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  const isFullPageYes = noCount >= 10;

  // Komponen hasil sukses yang disatukan
  if (yesPressed) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-linear-to-br from-pink-100 to-rose-200 selection:bg-rose-600 selection:text-white">
        <div className="absolute inset-0 pointer-events-none">
          {mounted &&
            hearts.map((heart) => (
              <div
                key={heart.id}
                className="absolute animate-float text-rose-300/40"
                style={{
                  left: heart.left,
                  top: heart.top,
                  fontSize: heart.size,
                  animationDelay: heart.delay,
                  animationDuration: heart.duration,
                }}
              >
                ❤️
              </div>
            ))}
        </div>

        <div className="z-10 w-full max-w-md p-8 mx-4 transition-all duration-700 bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 text-center animate-in fade-in zoom-in">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-rose-400/30 blur-2xl rounded-full animate-pulse"></div>
            <Image
              src="/Gemini_Generated_Image_p6q9dhp6q9dhp6q9.png"
              alt="Kucing merayakan"
              width={400}
              height={400}
              priority
              className="relative rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h2 className="text-4xl font-extrabold my-6 bg-linear-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            Yeeayyy!!! Makasih ya! 😊 ❤️
          </h2>
          <p className="text-rose-700/80 font-medium italic">
            Kabari ya buat Valentine nanti! ✨
          </p>
        </div>

        <style jsx global>{`
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0;
            }
            20% {
              opacity: 1;
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

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-linear-to-br from-pink-100 to-rose-200 selection:bg-rose-600 selection:text-white">
      {/* Animasi Hati Melayang di Latar Belakang */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted &&
          hearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute animate-float text-rose-300/40"
              style={{
                left: heart.left,
                top: heart.top,
                fontSize: heart.size,
                animationDelay: heart.delay,
                animationDuration: heart.duration,
              }}
            >
              ❤️
            </div>
          ))}
      </div>

      {/* Full Page "Yes" Button Overlay */}
      {mounted && !yesPressed && isFullPageYes && (
        <button
          onClick={() => setYesPressed(true)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-rose-500/95 backdrop-blur-md animate-in fade-in zoom-in duration-500 cursor-pointer group px-4"
        >
          <div className="relative mb-8 transform group-hover:scale-110 transition-transform duration-500">
            <div className="absolute -inset-12 bg-white/30 blur-3xl rounded-full animate-pulse"></div>
            <Image
              src="/Gemini_Generated_Image_xhfmdixhfmdixhfm.png"
              alt="Kucing memohon"
              width={280}
              priority
              height={280}
              className="relative rounded-3xl shadow-2xl border-4 border-white/50"
            />
          </div>
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl animate-bounce">
              MAU DONG! ✨
            </h1>
            <p className="text-white/90 text-xl font-bold tracking-[0.2em] uppercase bg-white/10 py-2 px-6 rounded-full backdrop-blur-sm">
              Klik di mana aja ya!
            </p>
          </div>
        </button>
      )}

      <div className="z-10 w-full max-w-md p-8 mx-4 transition-all duration-500 bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Image
            src="/Gemini_Generated_Image_xhfmdixhfmdixhfm.png"
            alt="Kucing memohon"
            width={400}
            priority
            height={400}
            className="rounded-2xl shadow-lg mb-8 mx-auto"
          />
          <h1 className="text-3xl font-bold mb-8 text-rose-700 leading-tight">
            Mau jadi Valentine-ku? 🌹
          </h1>
          <div className="flex flex-col items-center gap-4">
            <button
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-full shadow-lg shadow-rose-300/50 transition-all duration-300 hover:scale-105 active:scale-95 z-20"
              style={{
                fontSize: yesButtonFontSize,
                paddingLeft: yesButtonPaddingX,
                paddingRight: yesButtonPaddingX,
                paddingTop: yesButtonPaddingY,
                paddingBottom: yesButtonPaddingY,
              }}
              onClick={() => setYesPressed(true)}
            >
              Mau! ✨
            </button>
            <button
              onClick={handleNoClick}
              className="text-rose-600 hover:text-rose-800 font-semibold py-2 px-6 rounded-full border border-rose-200 bg-white/50 hover:bg-white/80 transition-all duration-300 text-sm"
            >
              {noCount === 0 ? "Enggak" : getNoButtonText()}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
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
