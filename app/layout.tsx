import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lion & Sun Tech Association",
  description: "Building trust, security, and transparency",
  icons: {
    icon: [
      {
        url: "/images/Logo (2).png",
        sizes: "any",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
