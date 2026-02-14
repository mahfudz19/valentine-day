"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ButtonBigger from "./model/button-bigger";
import MovingButton from "./model/moving-button";
import LoveLetter from "./model/love-letter";
import IgPoll from "./model/ig-poll";
import TinderMatch from "./model/tinder-match";

function ValentineContent() {
  const searchParams = useSearchParams();
  const [modelIndex, setModelIndex] = useState<number | null>(null);

  // Ambil nama dari query parameter ?doi=, jika tidak ada pakai env
  const doiName =
    searchParams.get("doi") || process.env.NEXT_PUBLIC_DOI_NAME || "";

  // Daftar model yang tersedia (tambah model baru di sini)
  const models = [
    <ButtonBigger key="bigger" doiName={doiName} />,
    <MovingButton key="moving" doiName={doiName} />,
    <LoveLetter key="letter" doiName={doiName} />,
    <IgPoll key="igpoll" doiName={doiName} />,
    <TinderMatch key="tinder" doiName={doiName} />,
  ];

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const lastIndexStr = sessionStorage.getItem("lastValentineModelIndex");
      const lastIndex = lastIndexStr !== null ? parseInt(lastIndexStr, 10) : -1;

      // Logika Sequence: Ambil index berikutnya, jika sudah di akhir kembali ke 0
      const nextIndex = (lastIndex + 1) % models.length;

      sessionStorage.setItem("lastValentineModelIndex", nextIndex.toString());
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
  return (
    <Suspense fallback={<div className="min-h-screen bg-pink-50" />}>
      <ValentineContent />
    </Suspense>
  );
}
