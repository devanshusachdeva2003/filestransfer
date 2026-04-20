"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    title: "Discover",
    href: "#",
    dropdown: [
      { name: "How it works", href: "/how-it-works" },
      { name: "Features", href: "/features" },
      { name: "Why choose us", href: "/why-us" },
      { name: "Why choose us", href: "/why-us" },
      { name: "Why choose us", href: "/why-us" },
      { name: "Why choose us", href: "/why-us" },
      { name: "Why choose us", href: "/why-us" },
    ],
  },
  {
    title: "Offers and prices",
    href: "#",
    dropdown: [
      { name: "Personal", href: "/pricing/personal" },
      { name: "Business", href: "/pricing/business" },
      { name: "Enterprise", href: "/pricing/enterprise" },
    ],
  },
  {
    title: "Apps",
    href: "#",
    dropdown: [
      { name: "Desktop App", href: "/apps/desktop" },
      { name: "Mobile App", href: "/apps/mobile" },
      { name: "Web App", href: "/apps/web" },
    ],
  },
  {
    title: "Developers",
    href: "#",
    dropdown: [
      { name: "API Docs", href: "/developers/api-docs" },
      { name: "SDKs", href: "/developers/sdks" },
      { name: "Integration Guide", href: "/developers/integrations" },
    ],
  },
  {
    title: "Resources",
    href: "#",
    dropdown: [
      { name: "Blog", href: "/blog" },
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-8 py-2 flex items-center justify-between">
      {/* Logo */}
      <h1 className="text-2xl font-bold italic">AD Transfer</h1>

      {/* Menu */}
      <ul className="flex items-center gap-10 h-14">
        {navItems.map((item, index) => (
          <li
            key={index}
            className="relative"
            onMouseEnter={() => setOpenDropdown(index)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1 text-[17px] font-medium hover:text-gray-100 transition duration-200">
              {item.title}
              <ChevronDown size={16} className="mt-[2px]" />
            </button>

            {openDropdown === index && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-white text-gray-800 shadow-xl border border-gray-100 overflow-hidden z-50">
                {item.dropdown.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.href}
                    className="block px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Buttons */}
      <div className="flex gap-3 items-center">
        <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
          Sign in
        </button>
        <button className="bg-indigo-800 px-4 py-2 rounded-lg font-medium hover:bg-indigo-900">
          Try for free
        </button>
      </div>
    </nav>
  );
}