"use client";

import { useState, useEffect } from "react";
import ButtonBigger from "./model/button-bigger";
import MovingButton from "./model/moving-button";
import LoveLetter from "./model/love-letter";

export default function Home() {
  // return <LoveLetter />;
  const [modelIndex, setModelIndex] = useState<number | null>(null);

  // Daftar model yang tersedia (tambah model baru di sini)
  const models = [
    <ButtonBigger key="bigger" />,
    <MovingButton key="moving" />,
    <LoveLetter key="letter" />,
  ];

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const lastIndexStr = sessionStorage.getItem("lastValentineModelIndex");
      const lastIndex =
        lastIndexStr !== null ? parseInt(lastIndexStr, 10) : null;

      let nextIndex: number;

      if (lastIndex === null || models.length <= 1) {
        nextIndex = Math.floor(Math.random() * models.length);
      } else {
        do {
          nextIndex = Math.floor(Math.random() * models.length);
        } while (nextIndex === lastIndex);
      }

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
