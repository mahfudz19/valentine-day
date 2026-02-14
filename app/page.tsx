"use client";
"use client";

import { useState, useEffect } from "react";
import ButtonBigger from "./model/button-bigger";
import MovingButton from "./model/moving-button";

export default function Home() {
  // return <MovingButton />;
  const [modelIndex, setModelIndex] = useState<number | null>(null);

  // Daftar model yang tersedia (tambah model baru di sini)
  const models = [<ButtonBigger key="bigger" />, <MovingButton key="moving" />];

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const lastIndexStr = sessionStorage.getItem("lastValentineModelIndex");
      const lastIndex =
        lastIndexStr !== null ? parseInt(lastIndexStr, 10) : null;

      let nextIndex: number;

      if (lastIndex === null || models.length <= 1) {
        // Jika pertama kali atau hanya ada 1 model, pilih acak
        nextIndex = Math.floor(Math.random() * models.length);
      } else {
        // Pilih index yang berbeda dari sebelumnya secara dinamis
        do {
          nextIndex = Math.floor(Math.random() * models.length);
        } while (nextIndex === lastIndex);
      }

      sessionStorage.setItem("lastValentineModelIndex", nextIndex.toString());
      setModelIndex(nextIndex);
    });
    return () => cancelAnimationFrame(frameId);
  }, [models.length]);

  // Tampilkan loading sebentar atau placeholder saat menentukan model
  if (modelIndex === null) {
    return <div className="min-h-screen bg-pink-50" />;
  }

  return <main>{models[modelIndex]}</main>;
}
