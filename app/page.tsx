"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ButtonBigger from "./model/button-bigger";
import MovingButton from "./model/moving-button";
import LoveLetter from "./model/love-letter";
import IgPoll from "./model/ig-poll";
import TinderMatch from "./model/tinder-match";
import SpotifyPlayer from "./model/spotify-player";
import ScratchCard from "./model/scratch-card";

function ValentineContent() {
  const searchParams = useSearchParams();
  const doiName =
    searchParams.get("doi") || process.env.NEXT_PUBLIC_DOI_NAME || "";
  const [modelIndex, setModelIndex] = useState<number | null>(null);

  // Ambil nama dari query parameter ?doi=, jika tidak ada pakai env

  // Daftar model yang tersedia (tambah model baru di sini)
  const models = [
    <ButtonBigger key="bigger" doiName={doiName} />,
    <MovingButton key="moving" doiName={doiName} />,
    <LoveLetter key="letter" doiName={doiName} />,
    <IgPoll key="igpoll" doiName={doiName} />,
    <TinderMatch key="tinder" doiName={doiName} />,
    <SpotifyPlayer key="spotify" doiName={doiName} />,
    <ScratchCard key="scratch" doiName={doiName} />,
  ];

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const storageKey = "valentine_model_pool";
      let pool: number[] = [];

      try {
        const savedPool = sessionStorage.getItem(storageKey);
        if (savedPool) {
          pool = JSON.parse(savedPool);
        }
      } catch (e) {
        console.error("Failed to parse pool", e);
      }

      // Jika pool kosong atau panjangnya tidak sesuai dengan jumlah model saat ini, buat pool baru
      if (pool.length === 0 || Math.max(...pool) >= models.length) {
        // Buat array index [0, 1, 2, 3, 4]
        pool = Array.from({ length: models.length }, (_, i) => i);
        // Shuffle array tersebut
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
      }

      // Ambil index pertama dari pool (ini yang akan ditampilkan)
      const nextIndex = pool.shift()!;

      // Simpan sisa pool kembali ke session storage
      sessionStorage.setItem(storageKey, JSON.stringify(pool));
      setModelIndex(nextIndex);
    });
    return () => cancelAnimationFrame(frameId);
  }, [models.length]);

  if (modelIndex === null) {
    return <div className="min-h-screen bg-pink-50" />;
  }

  return <main>{models[modelIndex]}</main>;
}

export default function Home() {
  // const searchParams = useSearchParams();
  // const doiName =
  //   searchParams.get("doi") || process.env.NEXT_PUBLIC_DOI_NAME || "";

  // return <SpotifyPlayer doiName={doiName} />;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-pink-50 flex items-center justify-center">
          <div className="animate-pulse text-rose-400 font-medium">
            Memuat kejutan...
          </div>
        </div>
      }
    >
      <ValentineContent />
    </Suspense>
  );
}
