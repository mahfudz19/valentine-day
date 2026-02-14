"use client";

import { useState, useEffect, useRef } from "react";

export default function HeartbeatMonitor({ doiName }: { doiName: string }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bpm, setBpm] = useState(72);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);

  // Logika EKG Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let offset = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid Background
      ctx.strokeStyle = "rgba(244, 63, 94, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // EKG Line
      ctx.beginPath();
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#f43f5e";

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Tentukan kecepatan dan intensitas detak berdasarkan status
      const speed = isCompleted ? 8 : 4;
      const amplitude = isCompleted ? 60 : 30;

      for (let x = 0; x < width; x++) {
        let y = centerY;
        const phase = (x + offset) % 100;

        if (phase > 40 && phase < 50) {
          // P-wave
          y -= Math.sin(((phase - 40) * Math.PI) / 10) * 5;
        } else if (phase >= 50 && phase < 52) {
          // Q-dip
          y += (phase - 50) * 10;
        } else if (phase >= 52 && phase < 55) {
          // R-peak (The big spike)
          y -= (phase - 52) * amplitude;
        } else if (phase >= 55 && phase < 58) {
          y = centerY - amplitude * 3 + (phase - 55) * amplitude;
        } else if (phase >= 58 && phase < 60) {
          // S-dip
          y += (60 - phase) * 10;
        } else if (phase > 70 && phase < 85) {
          // T-wave
          y -= Math.sin(((phase - 70) * Math.PI) / 15) * 10;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      offset += speed;
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isCompleted]);

  // Handle Scan Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning && scanProgress < 100) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          const next = prev + 1;
          if (next >= 100) {
            setIsCompleted(true);
            setIsScanning(false);
            setBpm(143); // Simbol I Love You (143)
            return 100;
          }
          setBpm(72 + Math.floor(Math.random() * 10));
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isScanning, scanProgress]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden relative">
      {/* Background Glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-rose-500/5 blur-[120px] pointer-events-none transition-opacity duration-1000 ${isCompleted ? "opacity-100" : "opacity-40"}`}
      />

      {/* Title Section */}
      <div className="text-center mb-12 z-10">
        <div className="inline-block bg-rose-500/10 border border-rose-500/20 px-4 py-1 rounded-full mb-4">
          <span className="text-rose-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Biometric Analysis
          </span>
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
          Heartbeat <span className="text-rose-500">Monitor</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-bold mt-2 tracking-widest uppercase">
          Deteksi Getaran Hatimu 💓
        </p>
      </div>

      {/* EKG Display */}
      <div className="relative w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 mb-12 shadow-2xl overflow-hidden">
        <div className="absolute top-4 left-6 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isScanning ? "bg-rose-500 animate-pulse" : "bg-slate-700"}`}
          />
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            {isScanning ? "Live Signal" : "System Ready"}
          </span>
        </div>

        <div className="absolute top-4 right-6 text-right">
          <span className="text-rose-500 text-3xl font-black italic leading-none">
            {bpm}
          </span>
          <span className="text-slate-500 text-[10px] font-bold uppercase ml-1">
            BPM
          </span>
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="w-full h-40 mt-8"
        />
      </div>

      {/* Scanner Interaction */}
      <div className="relative z-10 flex flex-col items-center">
        {!isCompleted ? (
          <div className="flex flex-col items-center">
            <button
              onMouseDown={() => setIsScanning(true)}
              onMouseUp={() => !isCompleted && setIsScanning(false)}
              onMouseLeave={() => !isCompleted && setIsScanning(false)}
              onTouchStart={() => setIsScanning(true)}
              onTouchEnd={() => !isCompleted && setIsScanning(false)}
              className={`relative w-24 h-32 rounded-2xl border-2 transition-all duration-500 flex items-center justify-center overflow-hidden
                ${isScanning ? "border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)] scale-105" : "border-slate-700 bg-slate-900/50"}`}
            >
              {/* Scan Line Animation */}
              {isScanning && (
                <div
                  className="absolute left-0 right-0 h-1 bg-rose-500 shadow-[0_0_15px_#f43f5e] z-10 animate-scan"
                  style={{ top: `${scanProgress}%` }}
                />
              )}

              {/* Fingerprint Icon (Simplified with CSS) */}
              <div
                className={`transition-colors duration-500 ${isScanning ? "text-rose-500" : "text-slate-700"}`}
              >
                <svg
                  width="48"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M12 11c0-1.105-.895-2-2-2s-2 .895-2 2v2m4-2c0-1.105.895-2 2-2s2 .895 2 2v2M8 11v2m8-2v2m-4-6V3m0 18v-3m-7-7H3m18 0h-2" />
                  <path d="M12 7c-2.761 0-5 2.239-5 5v4m10-4c0-2.761-2.239-5-5-5" />
                  <path d="M12 3c-4.97 0-9 4.03-9 9v4m18-4c0-4.97-4.03-9-9-9" />
                </svg>
              </div>

              {/* Fill Background on Scan */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-rose-500/20 transition-all duration-300"
                style={{ height: `${scanProgress}%` }}
              />
            </button>
            <p className="text-slate-500 text-[10px] font-bold mt-6 tracking-widest uppercase animate-pulse">
              {isScanning
                ? "Scanning Heartbeat..."
                : "Tekan & Tahan untuk Scan"}
            </p>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="mb-6 inline-block relative">
              <div className="text-6xl animate-heart-beat">❤️</div>
              <div className="absolute -inset-4 bg-rose-500/20 blur-xl rounded-full -z-10 animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">
              Analisis Selesai!
            </h2>
            <p className="text-rose-400 font-serif italic text-lg max-w-xs mx-auto leading-relaxed">
              &quot;Jantungku berdetak lebih cepat saat bersamamu, {doiName}
              .&quot;
            </p>

            <button
              onClick={() => {
                setIsCompleted(false);
                setScanProgress(0);
                setBpm(72);
              }}
              className="mt-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-rose-400 transition-colors"
            >
              Ulangi Analisis 🔄
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }
        @keyframes heart-beat {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .animate-heart-beat {
          animation: heart-beat 0.4s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
