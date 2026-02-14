"use client";

import { useState, useEffect } from "react";
import ButtonBigger from "./model/button-bigger";
import MovingButton from "./model/moving-button";
import LoveLetter from "./model/love-letter";
import IgPoll from "./model/ig-poll";
import TinderMatch from "./model/tinder-match";

export default function Home() {
  // return <TinderMatch />;
  const [modelIndex, setModelIndex] = useState<number | null>(null);

  // Daftar model yang tersedia (tambah model baru di sini)
  const models = [
    <ButtonBigger key="bigger" />,
    <MovingButton key="moving" />,
    <LoveLetter key="letter" />,
    <IgPoll key="igpoll" />,
    <TinderMatch key="tinder" />,
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
