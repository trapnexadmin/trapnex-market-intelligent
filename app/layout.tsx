// The global stylesheet is loaded by Next.js; suppress TypeScript's missing
// declaration warning when the CSS module declaration is not discovered.
// @ts-expect-error -- CSS side-effect imports are handled by Next.js.
import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "TRAPNEX — Market Intelligence",
  description: "AI-powered market intelligence for Indian investors.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
