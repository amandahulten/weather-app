import type { Metadata } from "next";
import "./styles/globals.scss";

export const metadata: Metadata = {
  title: "AMHI",
  description: "Se det senaste vädret och prognosen framåt",
  icons: {
    icon: "/sun-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
