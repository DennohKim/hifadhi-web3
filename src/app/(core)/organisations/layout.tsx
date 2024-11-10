"use client";

import { Navbar } from "@/components";

export default function OrganisationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
  <Navbar />
  {children}
  </>;
}
