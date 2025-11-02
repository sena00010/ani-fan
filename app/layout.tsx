import React from "react";
import "./globals.css";
import type { Metadata } from "next";
// import { preloadSeoSettings, preloadGeneralSettings } from "@/lib/server/preloadData";
import generateMeta from "@/lib/seo/metadataUtils";
import Header from "./components/layouts/header";
import Footer from "./components/layouts/footer";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import Providers from "./providers";
export async function generateMetadata(): Promise<Metadata> {
  // const seoSettings = await preloadSeoSettings("home", "");
  // return generateMeta(seoSettings);
  return {
    title: "AniFan",
    description: "Anime and manga fan community",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const settings = await preloadGeneralSettings();
  //
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Header />
          <Toaster position="top-right" />
          <Providers>{children}</Providers>
          {/*<Footer settings={settings} />*/}
        </ThemeProvider>
      </body>
    </html>
  );
}
