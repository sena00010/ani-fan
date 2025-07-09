import React from "react";
import "./globals.css";
import { Providers } from "@/providers";
import type { Metadata } from "next";
// import { preloadSeoSettings, preloadGeneralSettings } from "@/lib/server/preloadData";
import generateMeta from "@/lib/seo/metadataUtils";
import Header from "./components/layouts/header";
import Footer from "./components/layouts/footer";
import { Toaster } from "react-hot-toast";

export async function generateMetadata(): Promise<Metadata> {
  // const seoSettings = await preloadSeoSettings("home", "");
  // return generateMeta(seoSettings);
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
        <Providers>
          <Header />
          <Toaster position="top-right" />
          {children}
          {/*<Footer settings={settings} />*/}
        </Providers>
      </body>
    </html>
  );
}
