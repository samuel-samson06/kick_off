import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KickOff — Match Reminders",
    template: "%s | KickOff",
  },
  description:
    "Get match reminders delivered directly to your inbox. Follow your teams and never miss kickoff.",
  keywords: [
    "World Cup",
    "football reminders",
    "match alerts",
    "soccer notifications",
    "KickOff",
    "2026 World Cup",
    "match schedule",
  ],
  openGraph: {
    title: "KickOff — Match Reminders",
    description:
      "Get match reminders delivered directly to your inbox. Follow your teams and never miss kickoff.",
    siteName: "KickOff",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "KickOff — Match Reminders",
    description:
      "Get match reminders delivered directly to your inbox.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
