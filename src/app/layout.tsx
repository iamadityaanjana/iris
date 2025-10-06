import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IRIS - Interactive Roadmap and Information System",
  description: "Generate interactive learning roadmaps for any topic using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
