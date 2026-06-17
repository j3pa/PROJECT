"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector = [
  "main > *",
  "section",
  "article",
  "form",
  "table",
  "[class*='rounded']",
  "[class*='shadow']",
  "[class*='border']",
].join(",");

export default function PageEffects({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector)).filter(
      (element) =>
        !element.closest("[data-no-reveal]") &&
        !element.classList.contains("reveal-ready") &&
        element.offsetParent !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    elements.forEach((element, index) => {
      element.classList.add("reveal-ready");
      element.style.setProperty("--reveal-delay", `${Math.min(index * 35, 280)}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
