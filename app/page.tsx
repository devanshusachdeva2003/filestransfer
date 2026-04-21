"use client";

import { useState } from "react";
import Navbar from "@/component/components/Navbar";
import Hero from "@/component/components/Hero";
import FileSteps from "@/component/components/file";
import LoginSlider from "@/component/components/LoginSlider";
import ScrollToTop from "@/component/components/ScrollToTop";
export default function Home() {
  const [openLogin, setOpenLogin] = useState(false);

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