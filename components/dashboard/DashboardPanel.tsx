import type { ReactNode } from "react";

export default function DashboardPanel({
  title,
  link,
  children,
}: {
  title: string;
  link?: string;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      <div className="head">
        <span>{title}</span>
        {link ? <b>{link}</b> : null}
      </div>
      {children}
    </section>
  );
}
