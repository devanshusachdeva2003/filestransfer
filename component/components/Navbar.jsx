"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
const navItems = [
  {
    title: "Discover",
    href: "#",
    dropdown: [
        { name: "TransferNow Premium – 1 user", href: "#", arrow: false },
  { name: "TransferNow Team – 10 users", href: "#", arrow: false },
  { name: "TransferNow Enterprise – Custom plan", href: "#", arrow: false },

  { name: "Discover TransferNow", href: "/discover", arrow: true },
  { name: "TransferNow Fundamentals", href: "#", arrow: true },
  { name: "Try for free for 7 days", href: "#", arrow: true },
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

export default function Navbar({ setOpenLogin }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold italic">AD Transfer</h1>

      <ul className="flex items-center gap-5 h-14 ml-8" >
        {navItems.map((item, index) => (
          <li
            key={index}
            className="relative"
            onMouseEnter={() => setOpenDropdown(index)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1 text-[17px] font-medium hover:text-gray-100 transition duration-200">
              {item.title}
              <ChevronDown size={16} className="mt-0.5" />
            </button>

            {openDropdown === index && (
              <div className="absolute left-0 top-full mt-2 rounded-xl bg-white text-gray-800 shadow-xl border border-gray-100 overflow-hidden z-50 w-56">
              {item.dropdown.map((subItem, subIndex) => (
  <Link
    key={subIndex}
    href={subItem.href}
    className={`group flex items-center justify-between px-5 py-4 text-[17px] font-medium transition-all duration-200
      ${subItem.arrow 
        ? "text-[#2f2f35] hover:bg-blue-50 hover:text-[#5963d5]" 
        : "text-gray-500 cursor-default"}
    `}
  >
    <span>{subItem.name}</span>

    {/* Show arrow ONLY if arrow = true */}
    {subItem.arrow && (
      <ChevronRight className="h-5 w-5 text-[#2f2f35] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#5963d5]" />
    )}
  </Link>
))}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="flex gap-3 items-center">
        <button
          onClick={() => {
            if (typeof setOpenLogin === "function") setOpenLogin(true);
            else router.push("/login");
          }}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
        >
          Sign in
        </button>

        <Link href="/register" className="bg-indigo-800 px-4 py-2 rounded-lg font-medium hover:bg-indigo-900">
          Try for free
        </Link>
      </div>
    </nav>
  );
}