import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { type Metadata } from "next";
// import { CSPostHogProvider } from "./_analytics/provider";
import { cn } from "~/lib/utils";
import Header from "~/components/block/header";

export const metadata: Metadata = {
  title: "How Many LSI",
  description: "Smart planning for gaining skills in EVE Online",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
      )}
    >
      {/* <CSPostHogProvider> */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Header />
        <div className="bg-slate-100 py-5">{children}</div>
      </body>
      {/* </CSPostHogProvider> */}
    </html>
  );
}
