"use client";

import { useState, useEffect } from "react";
import Navbar from "@/component/components/Navbar";
import Hero from "@/component/components/Hero";
import FileSteps from "@/component/components/file";
import LoginSlider from "@/component/components/LoginSlider";
import ScrollToTop from "@/component/components/ScrollToTop";
export default function Home() {
  const [openLogin, setOpenLogin] = useState(false);
  // allow other components to request opening the login slider
  useEffect(() => {
    const handler = () => setOpenLogin(true)
    window.addEventListener('open-login', handler)
    return () => window.removeEventListener('open-login', handler)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar setOpenLogin={setOpenLogin} />

      <Hero />

      <div className="mt-10">
        <FileSteps />
      </div>

      <LoginSlider
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
      />
      <ScrollToTop />
    </main>
  );
}

