import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "./context/GameContext";

export const metadata: Metadata = {
  title: "Hedgie Number Dash",
  description: "An educational math game where you help a hedgehog jump over hurdles by solving math problems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
