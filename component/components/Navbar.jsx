"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const navItems = [
  {
    title: "Solutions",
    href: "#",
    dropdown: [
      { name: "For Individuals", description: "Secure file sharing for everyone.", href: "/forindivisual" },
      { name: "For Teams", description: "Collaborate and share with your team.", href: "/teams" },
      { name: "Enterprise", description: "Advanced security for large companies.", href: "/enterprise" },
    ],
  },
  {
    title: "Discover",
    href: "#",
    dropdown: [
      { name: "TransferNow Pro", description: "The professional way to send files.", href: "/transfernow" },
      { name: "Core Features", description: "Everything you can do with AD Transfer.", href: "/corefeature" },
      { name: "Free Trial", description: "Try premium features for 7 days.", href: "/freetrial" },
    ],
  },
  {
    title: "Developers",
    href: "#",
    dropdown: [
      { name: "API Reference", description: "Built for seamless integrations.", href: "/reference" },
      { name: "SDKs & Tools", description: "Open source kits for every language.", href: "/tools" },
      { name: "Status", description: "Check our system uptime and health.", href: "/status" },
    ],
  },
  {
    title: "Resources",
    href: "#",
    dropdown: [
      { name: "Help Center", description: "Guides, tips, and troubleshooting.", href: "help" },
      { name: "Security", description: "Our commitment to your data privacy.", href: "security" },
      { name: "Blog", description: "Latest news and product updates.", href: "blog" },
    ],
  },
];

export default function Navbar({ setOpenLogin }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false)
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between">
      <h1 className="text-xl sm:text-2xl font-bold italic">AD Transfer</h1>

      <ul className="hidden md:flex items-center gap-5 h-14 ml-8" >
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

      {/* mobile hamburger */}
      <div className="md:hidden flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen} className="p-2">
          <Menu />
        </button>
      </div>

      <div className="hidden md:flex gap-3 items-center">
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
                try { localStorage.removeItem('user') } catch (e) {}
                try { document.cookie = 'token=; Max-Age=0; path=/'; } catch (e) {}
                setLoggedIn(false);
                try { window.dispatchEvent(new Event('logged-out')) } catch (e) {}
                router.refresh();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
            >
              Sign out
            </button>
          </>
        )}
      </div>

      {/* Mobile menu overlay (click backdrop to close) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-60 bg-white text-slate-900 p-4 overflow-auto md:hidden max-h-screen"
          role="dialog"
          aria-modal="true"
          onClick={() => setMobileOpen(false)}
        >
          <div className="max-w-lg mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">AD Transfer</h2>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
                <X />
              </button>
            </div>

            <div className="space-y-4">
              {navItems.map((group, i) => (
                <div key={i} className="border-b pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{group.title}</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    {group.dropdown?.map((s, si) => (
                      <a key={si} href={s.href} onClick={() => setMobileOpen(false)} className="block text-slate-700 px-1 py-2 rounded hover:bg-slate-100">{s.name}</a>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-4">
                {!loggedIn ? (
                  <div className="space-y-3">
                    <button onClick={() => { if (typeof setOpenLogin === 'function') setOpenLogin(true); else router.push('/login'); setMobileOpen(false) }} className="w-full bg-indigo-600 text-white px-4 py-3 rounded">Sign in</button>
                    <a href="/register" onClick={() => setMobileOpen(false)} className="block text-center border border-indigo-600 text-indigo-600 px-4 py-3 rounded">Try for free</a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <a href="/account" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-white text-slate-900 px-4 py-3 rounded">Account</a>
                    <button onClick={() => { try { localStorage.removeItem('token') } catch (e){} try { document.cookie = 'token=; Max-Age=0; path=/'; } catch (e){} setLoggedIn(false); try { window.dispatchEvent(new Event('logged-out')) } catch (e) {} setMobileOpen(false); router.refresh(); }} className="w-full bg-red-500 text-white px-4 py-3 rounded">Sign out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}