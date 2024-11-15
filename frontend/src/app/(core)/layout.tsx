"use client";

import { Navbar } from "@/components";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
  <Navbar />
  {children}
  </>;
}
