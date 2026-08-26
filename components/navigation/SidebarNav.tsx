"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  enabled?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export default function SidebarNav({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation">
      {sections.map((section) => (
        <div className="navsec" key={section.title}>
          <label>{section.title}</label>
          {section.items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            if (item.enabled === false) {
              return (
                <span className="navitem disabled" key={item.name}>
                  <item.icon size={16} />
                  {item.name}
                </span>
              );
            }

            return (
              <Link
                className={active ? "navitem active" : "navitem"}
                href={item.href}
                key={item.name}
              >
                <item.icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
