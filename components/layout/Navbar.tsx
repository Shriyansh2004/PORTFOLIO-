"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { SiteContent } from "@/types/content";

export function Navbar({ site, name }: { site: SiteContent; name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f6f5f2]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="text-sm font-semibold tracking-tight text-stone-900">
          {name}
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-sm text-stone-500 transition hover:text-stone-900"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white md:hidden"
          aria-label={open ? site.ui.closeMenu : site.ui.openMenu}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>
      {open ? (
        <nav className="border-t border-stone-200 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {site.nav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="text-sm text-stone-700"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
