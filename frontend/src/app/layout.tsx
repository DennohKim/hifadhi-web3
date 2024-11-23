import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import localFont from "next/font/local";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
export const metadata: Metadata = {
  title: "VunaVault",
  description:
    "Set personalized savings goals, automate your contributions, and watch your savings grow through Aave lending pools while Gelato handles all the automation.",
  publisher: "Hifadhi Finance",
  authors: [{ name: "Hifadhi Finance", url: "https://hifadhi.finance" }],
  metadataBase: new URL("https://vunavault.hifadhi.finance"),
  openGraph: {
    title: "VunaVault",
    description:
      "Set personalized savings goals, automate your contributions, and watch your savings grow through Aave lending pools while Gelato handles all the automation.",
    url: "https://www.vunavault.hifadhi.finance",
    siteName: "VunaVault",
    images: [
      {
        url: "/images/og-image.png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    card: "summary_large_image",
    title: "VunaVault",
    description:
      "Set personalized savings goals, automate your contributions, and watch your savings grow through Aave lending pools while Gelato handles all the automation.",
    creator: "@paycrest",
    images: ["/images/og-image.png"],
  },
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});
const cabinet = localFont({
  src: [
    {
      path: "/fonts/CabinetGrotesk-Medium.woff2",
      weight: "500",
    },
    {
      path: "/fonts/CabinetGrotesk-Bold.woff2",
      weight: "700",
    },
    {
      path: "/fonts/CabinetGrotesk-Extrabold.woff2",
      weight: "800",
    },
  ],
  variable: "--font-cabinet-grotesk",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const delay = Number(cookieStore.get("apollo-x-custom-delay")?.value ?? 1000);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${cabinet.variable}`}>
        <ApolloWrapper delay={delay}>
          <Toaster position="top-right" />
          <Providers>{children}</Providers>
        </ApolloWrapper>
      </body>
    </html>
  );
}
