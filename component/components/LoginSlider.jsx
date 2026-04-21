"use client";

import { X } from "lucide-react";

export default function LoginSlider({ openLogin, setOpenLogin }) {
  return (
    <>
      <div
        onClick={() => setOpenLogin(false)}
        className={`fixed inset-0 bg-black/30 z-60 transition-opacity duration-300 ${
          openLogin
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-white z-70 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          openLogin ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center px-6 py-5 border-b">
            <button
              onClick={() => setOpenLogin(false)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-8 mt-10">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                Sign in your account
              </h2>

              <div className="mb-4">
                <label className="block text-sm text-gray-500 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
                Continue
              </button>

              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-3 text-sm text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="space-y-3">
                <button className="w-full border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition">
                  Sign in with Google
                </button>

                <button className="w-full border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition">
                 <img width="48" height="48" src="https://img.icons8.com/color/48/microsoft.png" alt="microsoft"/> Sign in with Microsoft 
                </button>

                <button className="w-full border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition">
                  Sign in with Apple
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}