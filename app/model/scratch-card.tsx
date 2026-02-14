"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function ScratchCard({ doiName }: { doiName: string }) {
  const [isScratchedEnough, setIsScratchedEnough] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const scratchThreshold = 70; // Persentase area yang harus digosok (70%)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on parent
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Draw scratch layer (Silver/Grey gradient)
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        gradient.addColorStop(0, "#d1d5db"); // gray-300
        gradient.addColorStop(0.5, "#9ca3af"); // gray-400
        gradient.addColorStop(1, "#6b7280"); // gray-500

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add some "texture" to the scratch card
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        for (let i = 0; i < 100; i++) {
          ctx.beginPath();
          ctx.moveTo(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
          );
          ctx.lineTo(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
          );
          ctx.stroke();
        }

        // Add instruction text on the scratch layer
        ctx.fillStyle = "#4b5563"; // gray-600
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GOSOK DI SINI ✨", canvas.width / 2, canvas.height / 2);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getPos = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    }
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparentPixels++;
    }

    const percentage =
      (transparentPixels / (canvas.width * canvas.height)) * 100;
    if (percentage > scratchThreshold) {
      setIsScratchedEnough(true);
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  const moveNoButton = () => {
    const randomX = Math.random() * 200 - 100; // Melompat antar -100px sampai 100px
    const randomY = Math.random() * 200 - 100;
    setNoButtonPos({ x: randomX, y: randomY });
  };

  const handleYes = () => {
    setIsAccepted(true);
  };

  return (
    <div className="min-h-screen bg-[#fff5f7] flex flex-col items-center justify-center p-6 select-none overflow-hidden relative">
      {/* Animated Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 35.5c-1.5-1.5-10-8.5-10-14.5 0-4 3.5-7 7.5-7 2.5 0 4 1.5 5 2.5 1-1 2.5-2.5 5-2.5 4 0 7.5 3 7.5 7 0 6-8.5 13-10 14.5z' fill='%23ff0000'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="text-center mb-10 relative z-10 animate-float">
        <div className="inline-block bg-rose-100 px-4 py-1 rounded-full mb-4">
          <span className="text-rose-600 text-[10px] font-black uppercase tracking-[0.3em]">
            Hadiah Spesial
          </span>
        </div>
        <h1 className="text-4xl font-black text-rose-600 uppercase tracking-tighter italic">
          Memori{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-orange-400">
            Rahasia
          </span>
        </h1>
        <p className="text-rose-400/80 text-xs font-bold mt-2 tracking-widest uppercase">
          Gosok untuk membuka kenangan ✨
        </p>
      </div>

      <div className="relative w-full max-w-[320px] aspect-3/4 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(251,113,133,0.3)] border-12 border-white bg-white group transition-transform duration-500 hover:scale-[1.02]">
        {/* Golden Gradient Border */}
        <div className="absolute -inset-0.5 bg-linear-to-tr from-rose-200 via-white to-rose-100 pointer-events-none" />

        {/* Background Content (Revealed) */}
        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center bg-linear-to-b from-white to-rose-50">
          <div className="relative w-full h-[70%] rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-700 group-hover:scale-105">
            <Image
              src="/Gemini_Generated_Image_p6q9dhp6q9dhp6q9.png"
              alt="Memori Indah"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-rose-900/40 to-transparent" />
          </div>

          <div className="pb-4">
            <h2 className="text-lg font-black text-rose-600 leading-tight">
              Momen Berharga Kita ❤️
            </h2>
            <p className="text-rose-400/80 text-[10px] font-bold uppercase tracking-widest mt-1">
              Untuk {doiName} • Dari Saya
            </p>
          </div>
        </div>

        {/* Scratch Layer */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className={`absolute inset-0 cursor-crosshair transition-opacity duration-1000 ${
            isScratchedEnough ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />

        {/* Success Overlay */}
        {isScratchedEnough && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="animate-ping absolute w-full h-full bg-rose-400/20 rounded-full" />
          </div>
        )}
      </div>

      {isScratchedEnough && !isAccepted && (
        <div className="mt-10 text-center animate-fade-in relative">
          <p className="text-rose-600 font-black text-lg uppercase tracking-tighter mb-4">
            Mau jadi Valentine aku? 🌹
          </p>
          <div className="flex gap-4 justify-center items-center h-20">
            <button
              onClick={handleYes}
              className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-125 transition-transform z-10"
            >
              MAU! ❤️
            </button>
            <button
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              style={{
                transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
              }}
              className="bg-white text-rose-500 px-8 py-3 rounded-full font-bold shadow-lg border border-rose-100 transition-all duration-200"
            >
              GAK
            </button>
          </div>
        </div>
      )}

      {isAccepted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-500/90 backdrop-blur-md animate-fade-in">
          <div className="text-center p-8">
            <div className="text-8xl mb-6 animate-bounce">💍</div>
            <h1 className="text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">
              SUDAH KUTEBAK! ❤️
            </h1>
            <p className="text-rose-100 text-xl font-medium">
              Sampai jumpa di hari Valentine, {doiName}! ✨
            </p>
            <p className="text-rose-200 text-sm mt-2 font-bold uppercase tracking-widest">
              - Dari Pengagum Rahasiamu -
            </p>
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className="animate-ping text-2xl"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-pop {
          animation: pop 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
