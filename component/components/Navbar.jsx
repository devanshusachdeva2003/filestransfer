"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const navItems = [
  {
    title: "Solutions",
    href: "#",
    dropdown: [
      { name: "For Individuals", description: "Secure file sharing for everyone.", href: "#" },
      { name: "For Teams", description: "Collaborate and share with your team.", href: "#" },
      { name: "Enterprise", description: "Advanced security for large companies.", href: "#" },
    ],
  },
  {
    title: "Discover",
    href: "#",
    dropdown: [
      { name: "TransferNow Pro", description: "The professional way to send files.", href: "/discover" },
      { name: "Core Features", description: "Everything you can do with AD Transfer.", href: "#" },
      { name: "Free Trial", description: "Try premium features for 7 days.", href: "/register" },
    ],
  },
  {
    title: "Developers",
    href: "#",
    dropdown: [
      { name: "API Reference", description: "Built for seamless integrations.", href: "#" },
      { name: "SDKs & Tools", description: "Open source kits for every language.", href: "#" },
      { name: "Status", description: "Check our system uptime and health.", href: "#" },
    ],
  },
  {
    title: "Resources",
    href: "#",
    dropdown: [
      { name: "Help Center", description: "Guides, tips, and troubleshooting.", href: "#" },
      { name: "Security", description: "Our commitment to your data privacy.", href: "#" },
      { name: "Blog", description: "Latest news and product updates.", href: "#" },
    ],
  },
];

export default function Navbar({ setOpenLogin }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const t = localStorage.getItem('token') || document.cookie.match(/(^|; )token=([^;]+)/)?.[2];
      setLoggedIn(!!t);
    } catch (e) {
      setLoggedIn(false);
    }
  }, []);

  // update login state when other components announce login
  useEffect(() => {
    const onLoggedIn = () => setLoggedIn(true)
    window.addEventListener('logged-in', onLoggedIn)
    return () => window.removeEventListener('logged-in', onLoggedIn)
  }, [])

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
              <div className="absolute left-0 top-full mt-2 rounded-xl bg-white text-gray-800 shadow-2xl border border-gray-100 overflow-hidden z-50 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
                {item.dropdown.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.href}
                    className="group flex flex-col px-5 py-4 transition-all duration-200 hover:bg-slate-50 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[15px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {subItem.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-all transform group-hover:translate-x-1" />
                    </div>
                    {subItem.description && (
                      <p className="text-[12px] text-slate-500 leading-snug group-hover:text-slate-600 transition-colors line-clamp-2">
                        {subItem.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="flex gap-3 items-center">
        {!loggedIn ? (
          <>
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
          </>
        ) : (
          <>
            <Link href="/account" className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100">Account</Link>
            <button
              onClick={() => {
                try { localStorage.removeItem('token') } catch (e) {}
                try { document.cookie = 'token=; Max-Age=0; path=/'; } catch (e) {}
                setLoggedIn(false);
                router.refresh();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}