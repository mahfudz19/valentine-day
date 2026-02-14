"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function TinderMatch() {
  const doiName = process.env.NEXT_PUBLIC_DOI_NAME || "";
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [matched, setMatched] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Handle Mouse/Touch Down
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startPos.current = { x: clientX - position.x, y: clientY - position.y };
  };

  // Handle Mouse/Touch Move
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || matched) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const newX = clientX - startPos.current.x;
    const newY = clientY - startPos.current.y;

    // Swipe Left Restriction (Magnet Effect)
    // We allow dragging left, but we'll snap it back in handleEnd
    setPosition({ x: newX, y: newY * 0.2 }); // Damping Y movement
  };

  // Handle Mouse/Touch End
  const handleEnd = () => {
    setIsDragging(false);

    if (position.x > 100) {
      // Swipe Right -> Match!
      setMatched(true);
      setPosition({ x: 500, y: 0 }); // Kurangi jarak agar transisi lebih terlihat
    } else {
      // Swipe Left or not far enough -> Snap back
      setPosition({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, position]);

  if (matched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4 animate-in zoom-in duration-500">
        <div className="text-center space-y-6">
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 bg-linear-to-tr from-pink-500 to-rose-400 rounded-full animate-ping opacity-20" />
            <Image
              src="/Gemini_Generated_Image_p6q9dhp6q9dhp6q9.png"
              alt="Match"
              fill
              priority
              className="rounded-full object-cover border-8 border-rose-100 shadow-2xl"
            />
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-600 italic">
            IT&apos;S A MATCH! ❤️
          </h1>
          <p className="text-gray-500 font-medium">
            {doiName ? `${doiName}, k` : "K"}amu gak bisa nolak takdir, kita
            emang cocok! ✨
          </p>
          <div className="pt-4">
            <p className="text-[10px] text-gray-300 uppercase tracking-widest mb-4">
              Handcrafted with ❤️ by Your Secret Admirer
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-rose-500 text-white rounded-full font-bold shadow-lg hover:bg-rose-600 transition-colors"
            >
              Chat Him Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rotation = position.x * 0.1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 overflow-hidden select-none">
      {/* Tinder Logo/Header */}
      <div className="mb-8 flex items-center gap-2 text-rose-500">
        <span className="text-3xl font-black tracking-tighter">tinder</span>
        <div className="w-2 h-2 bg-rose-500 rounded-full mt-2" />
      </div>

      <div className="relative w-full max-w-87.5 aspect-[4/5.5] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Full Screen Overlay Stamp (Radical Solution) */}
        <div
          className={`absolute inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${Math.abs(position.x) > 40 ? "opacity-100" : "opacity-0"}`}
        >
          {position.x > 40 && (
            <div className="border-12 border-green-500 text-green-500 font-black text-6xl px-8 py-4 rounded-2xl uppercase tracking-[0.2em] rotate-[-15deg] bg-white/10 backdrop-blur-[2px]">
              LIKE
            </div>
          )}
          {position.x < -40 && (
            <div className="border-12 border-red-500 text-red-500 font-black text-6xl px-8 py-4 rounded-2xl uppercase tracking-[0.2em] rotate-15 bg-white/10 backdrop-blur-[2px]">
              NOPE
            </div>
          )}
        </div>

        {/* The Draggable Content */}
        <div
          ref={cardRef}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
            transition: isDragging
              ? "none"
              : "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Main Image */}
          <div className="relative h-[60%] w-full shrink-0">
            <Image
              src="/Gemini_Generated_Image_xhfmdixhfmdixhfm.png"
              alt="Profile"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-3xl font-bold">
                {doiName || "Future Partner"}, 99
              </h2>
              <p className="text-lg opacity-90">📍 1km away</p>
            </div>
          </div>

          {/* Bio Section (Scrollable to prevent overflow) */}
          <div className="p-6 flex-1 overflow-y-auto bg-white custom-scrollbar">
            <h3 className="font-bold text-gray-800 mb-1">About Me</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Professional overthinker yang rela begadang buat coding halaman
              ini khusus buat {doiName || "kamu"}... Swipe right if you want a
              free dinner! 🍕
            </p>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-12 flex items-center gap-6">
        <button
          onClick={() => {
            setPosition({ x: -200, y: 0 });
            setTimeout(() => setPosition({ x: 0, y: 0 }), 500);
          }}
          className="w-14 h-14 rounded-full border-4 border-rose-100 flex items-center justify-center text-rose-400 text-2xl hover:bg-rose-50 transition-colors shadow-sm"
        >
          ✖
        </button>
        <button
          onClick={() => {
            setPosition({ x: 300, y: 0 });
            setTimeout(() => {
              setIsDragging(false);
              setMatched(true);
            }, 300);
          }}
          className="w-16 h-16 rounded-full bg-linear-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white text-3xl hover:scale-110 transition-transform shadow-lg shadow-rose-200"
        >
          ❤
        </button>
      </div>
    </div>
  );
}
