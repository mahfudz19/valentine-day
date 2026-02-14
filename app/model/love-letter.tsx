"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoveLetter() {
  const doiName = process.env.NEXT_PUBLIC_DOI_NAME || "";
  const [isOpen, setIsOpen] = useState(false);
  const [yesPressed, setYesPressed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  if (!mounted) return null;

  if (yesPressed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center animate-in zoom-in duration-500 max-w-sm w-full">
          <Image
            src="/Gemini_Generated_Image_p6q9dhp6q9dhp6q9.png"
            alt="Success"
            width={300}
            priority
            height={300}
            className="rounded-2xl mb-6 mx-auto"
          />
          <h2 className="text-3xl font-serif font-bold text-rose-600 mb-2">
            Yippie! ❤️
          </h2>
          <p className="text-rose-400 italic">
            Sampai ketemu di hari Valentine! ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5f5] p-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">
          💌
        </div>
        <div className="absolute bottom-10 right-10 text-4xl animate-bounce delay-300">
          💖
        </div>
      </div>

      <div
        className={`relative transition-all duration-1000 ease-in-out transform ${isOpen ? "scale-110" : "scale-100 hover:scale-105"}`}
      >
        {/* The Envelope */}
        <div
          onClick={() => !isOpen && setIsOpen(true)}
          className={`relative w-80 h-55 bg-rose-100 rounded-bl-xl rounded-br-xl shadow-2xl cursor-pointer transition-all duration-700 ${isOpen ? "mt-20" : ""}`}
        >
          {/* Envelope Flap (Top) */}
          <div
            className={`absolute top-0 left-0 w-0 h-0 border-l-160 border-l-transparent border-r-160 border-r-transparent border-t-110 border-t-rose-200 transition-all duration-700 origin-top z-30 ${isOpen ? "rotate-x-180 -translate-y-110" : ""}`}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Envelope Front Sides */}
          <div className="absolute bottom-0 left-0 w-0 h-0 border-l-160 border-l-rose-300/30 border-t-110 border-t-transparent z-20" />
          <div className="absolute bottom-0 right-0 w-0 h-0 border-r-160 border-r-rose-300/30 border-t-110 border-t-transparent z-20" />
          <div className="absolute bottom-0 left-0 w-full h-110 bg-rose-200/50 rounded-bl-xl rounded-br-xl z-10" />

          {/* The Letter (Inside) */}
          <div
            className={`absolute left-4 right-4 bg-white p-6 rounded-lg shadow-md transition-all duration-1000 z-40 ${isOpen ? "-translate-y-45 opacity-100 scale-105" : "translate-y-0 opacity-0 pointer-events-none"}`}
          >
            <div className="text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <Image
                  src="/Gemini_Generated_Image_xhfmdixhfmdixhfm.png"
                  alt="Cute Cat"
                  priority
                  fill
                  className="object-cover rounded-full border-2 border-rose-100"
                />
              </div>
              <h3 className="text-xl font-serif font-bold text-rose-800">
                For {doiName || "You"}...
              </h3>
              <p className="text-rose-600/80 text-sm italic leading-relaxed">
                &quot;Boleh nggak kalau Valentine nanti kita buat kenangan bareng{doiName ? ` sama ${doiName}` : ""}? I promise it will be fun!&quot;
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setYesPressed(true);
                  }}
                  className="w-full bg-rose-500 text-white py-2 rounded-full text-sm font-bold shadow-md hover:bg-rose-600 active:scale-95 transition-all"
                >
                  Yes, I&apos;d love to! ❤️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="w-full bg-rose-50 text-rose-400 py-2 rounded-full text-sm font-medium hover:bg-rose-100 transition-all"
                >
                  Maybe later...
                </button>
              </div>
            </div>
          </div>

          {/* Wax Seal */}
          {!isOpen && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-rose-600 rounded-full shadow-lg z-40 flex items-center justify-center animate-pulse">
              <span className="text-white text-xl">❤️</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .rotate-x-180 {
          transform: rotateX(180deg);
        }
      `}</style>
    </div>
  );
}
