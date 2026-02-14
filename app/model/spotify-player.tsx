"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function SpotifyPlayer({ doiName }: { doiName: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [visualizerScale, setVisualizerScale] = useState(1);
  const [currentNickname, setCurrentNickname] = useState(doiName);
  const [isLiked, setIsLiked] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
  }>({ message: "", visible: false });

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const audioUrl = "/Laufey_-_Valentine_Official_Audio_128KBPS.mp4";

  // 1 & 6. Audio Visualizer Logic
  const initVisualizer = () => {
    if (audioContextRef.current || !audioRef.current) return;

    const AudioContextClass =
      window.AudioContext || (window as unknown as typeof AudioContext);
    const ctx = new AudioContextClass();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaElementSource(audioRef.current);

    source.connect(analyser);
    analyser.connect(ctx.destination);
    analyser.fftSize = 64;

    audioContextRef.current = ctx;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);

      // Ambil rata-rata frekuensi rendah (bass) untuk efek scale
      const average = dataArray.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
      const scale = 1 + average / 1000; // Sensitivitas visualizer
      setVisualizerScale(scale);

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Gunakan interval untuk update progress agar lebih stabil dan tidak bergantung pada event browser yang kadang skip
    const interval = setInterval(() => {
      if (audio && !audio.paused) {
        const p = (audio.currentTime / audio.duration) * 100;
        setProgress(p || 0);

        const formatTime = (time: number) => {
          if (isNaN(time)) return "0:00";
          const min = Math.floor(time / 60);
          const sec = Math.floor(time % 60);
          return `${min}:${sec.toString().padStart(2, "0")}`;
        };

        setCurrentTime(formatTime(audio.currentTime));
      }
    }, 100);

    const onLoadedMetadata = () => {
      console.log("Metadata loaded, duration:", audio.duration);
      if (audio.duration && !isNaN(audio.duration)) {
        setIsLoading(false);
        const min = Math.floor(audio.duration / 60);
        const sec = Math.floor(audio.duration % 60);
        setDuration(`${min}:${sec.toString().padStart(2, "0")}`);
      }
    };

    const onLoadedData = () => {
      console.log("Data loaded, ready to play");
      setIsLoading(false);
    };

    const onCanPlay = () => {
      console.log("Can play event fired");
      setIsLoading(false);
    };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onError = () => {
      setIsLoading(false);
      setIsError(true);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("loadeddata", onLoadedData);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("error", onError);

    // Force check if metadata is already loaded (for cached files)
    if (audio.readyState >= 2) {
      onLoadedMetadata();
      onLoadedData();
    }

    // Auto-init visualizer on first interaction
    const initOnFirstClick = () => {
      if (!audioContextRef.current) initVisualizer();
      window.removeEventListener("click", initOnFirstClick);
    };
    window.addEventListener("click", initOnFirstClick);

    return () => {
      clearInterval(interval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("loadeddata", onLoadedData);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("error", onError);
      window.removeEventListener("click", initOnFirstClick);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current || isError) return;

    if (!audioContextRef.current) initVisualizer();

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked handling
        console.log("Play failed, waiting for user gesture");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) togglePlay();

      setNotification({
        message: "Mengulang memori indah dari awal... ✨",
        visible: true,
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  const handleShuffle = () => {
    const nicknames = [
      doiName,
      "Sayangku ❤️",
      "Si Paling Cantik ✨",
      "Masa Depanku 💍",
      "Rumahku 🏠",
      "Semestaku 🌌",
      "Moodbooster-ku ⚡",
    ];
    const filtered = nicknames.filter((n) => n !== currentNickname);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentNickname(random);

    setNotification({
      message: `Panggilan sayang diubah jadi: ${random}`,
      visible: true,
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleLike = () => {
    setIsLiked(true);
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setHearts((prev) => [...prev, ...newHearts]);

    // Hapus hearts setelah animasi selesai
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 1000);
  };

  const handleRepeatClick = () => {
    setNotification({
      message: "Cinta aku ke kamu emang gak ada tombol stop-nya! ♾️",
      visible: true,
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const showNextMessage = () => {
    const messages = [
      "Gak bisa di-skip, sayang! ❤️",
      "Cinta kita lagi on loop di hati aku. ♾️",
      "Lagu selanjutnya: Masa depan kita berdua. ✨",
      "Error: Terlalu sayang buat dilewati. 🚫",
      "Kenapa mau skip? Bagian terbaiknya baru mulai! 🎵",
      "Maaf, lagu ini dikhususkan cuma buat kamu. 💌",
      "Eits, dengerin dulu sampai habis! ✋",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Bersihkan timeout lama jika ada klik baru sebelum 3 detik
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotification({ message: randomMessage, visible: true });

    // Auto hide after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
      timeoutRef.current = null;
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 select-none">
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="w-full max-w-sm bg-linear-to-b from-[#400a0a] via-[#1a0505] to-black rounded-3xl p-6 shadow-2xl border border-white/5 relative overflow-hidden">
        {/* Ambient Glow Background */}
        <div
          className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-radial from-rose-900/20 to-transparent pointer-events-none transition-transform duration-700"
          style={{ transform: `scale(${visualizerScale})` }}
        />
        {/* Header */}
        <div className="flex justify-between items-center mb-8 text-white/70">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 16a1 1 0 1 1-1-1 1 1 0 0 1 1 1zm10.157-1.262a.75.75 0 0 0-1.06 0l-9.097 9.097a.75.75 0 0 0 0 1.06l9.097 9.097a.75.75 0 0 0 1.06-1.06l-8.567-8.567 8.567-8.567a.75.75 0 0 0 0-1.06z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Playing from your heart
          </span>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>

        {/* Album Art with Visualizer Effect */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-2xl mb-8 group bg-[#282828]">
          <Image
            src="/Gemini_Generated_Image_p6q9dhp6q9dhp6q9.png"
            alt="Valentine Special"
            fill
            priority
            style={{ transform: `scale(${visualizerScale})` }}
            className="object-cover transition-transform duration-75 ease-out"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {isError && (
            <div className="absolute inset-0 bg-rose-900/60 flex items-center justify-center p-6 text-center backdrop-blur-md">
              <p className="text-white font-bold text-sm">
                Ups, sepertinya lagunya malu untuk berputar, tapi perasaanku
                padamu tetap ada. ✨
              </p>
            </div>
          )}

          {/* Toast Notification */}
          <div
            className={`absolute inset-x-0 bottom-6 flex justify-center px-4 z-30 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              notification.visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-90 pointer-events-none"
            }`}
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center space-x-2">
              <span className="text-[#1DB954] text-xs font-black tracking-wide text-center">
                {notification.message}
              </span>
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Will you be my Valentine?
            </h2>
            <p className="text-white/60 font-medium text-lg">
              {currentNickname || "My Special Someone"}
            </p>
          </div>
          <button
            onClick={handleLike}
            className={`${isLiked ? "text-rose-500 scale-125" : "text-rose-400"} hover:scale-110 transition-all duration-300`}
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        {/* Hearts Explosion */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {hearts.map((heart) => (
            <span
              key={heart.id}
              className="absolute animate-ping text-rose-500"
              style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
            >
              ❤️
            </span>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-8 relative z-10">
          <div
            className="h-1 w-full bg-white/10 rounded-full relative cursor-pointer group"
            onClick={(e) => {
              if (audioRef.current) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const pct = x / rect.width;
                audioRef.current.currentTime = pct * audioRef.current.duration;
              }
            }}
          >
            <div
              className="h-full bg-rose-500 transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
            {/* Heart Knob */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-xs filter drop-shadow-[0_0_5px_rgba(244,63,94,0.8)] transition-all duration-100"
              style={{ left: `${progress}%` }}
            >
              ❤️
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-white/40 font-bold">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center px-2 relative z-10">
          <button
            onClick={handleShuffle}
            className="text-rose-400 hover:text-rose-300 hover:scale-110 transition-all active:rotate-180 duration-500"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v10H7z" />
            </svg>
          </button>

          <div className="flex items-center space-x-8">
            <button
              onClick={resetAudio}
              className="text-white hover:scale-110 transition-transform"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              disabled={isError}
              className={`w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[0_0_20px_rgba(244,63,94,0.4)] ${isError ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={showNextMessage}
              className="text-white/40 hover:text-white transition-colors group relative"
              title="You can't skip this love"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleRepeatClick}
            className="text-rose-400 hover:text-rose-300 hover:scale-110 transition-all active:scale-90"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v10H7z" />
            </svg>
          </button>
        </div>

        {/* Lyrics Button */}
        <div className="mt-8 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 transform transition-all hover:bg-rose-500/20 cursor-pointer group relative z-10">
          <p className="text-rose-400 font-black text-[10px] uppercase mb-2 tracking-widest flex items-center">
            Lyrics <span className="ml-2 animate-pulse">♪</span>
          </p>
          <p className="text-rose-100 font-medium text-sm leading-relaxed italic font-serif">
            &quot;Aku bikin kode ini khusus buat kamu, {doiName}. Mau gak jadi
            Valentine aku?&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
