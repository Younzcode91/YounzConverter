import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
export const metadata: Metadata = { title: "YounzConverter - Ubah File Tanpa Ribet", description: "Converter file serbaguna untuk gambar, PDF, Word, Excel, stiker, dan GIF." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body className={`${body.variable} ${display.variable}`}>{children}</body></html>; }
