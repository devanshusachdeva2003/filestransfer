"use client";

import React from "react";
import FileUploader from "./FileUploader";

const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      <div className="h-130 md:h-160 w-full" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-white">
            Transfer and have your files travel for free
          </h1>

          <p className="mt-3 text-white/90 text-sm md:text-base">
            TransferNow is a simple and free way to securely share your files and folders.
          </p>

          <div className="mt-8 flex flex-col items-center">
            <div className="relative w-40 h-40 md:w-52 md:h-52">
              <svg
                className="absolute inset-0 w-full h-full origin-center animate-spin"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
              

              </svg>

              <FileUploader compact />
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default Hero;