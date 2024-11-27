import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Keeping up with LLIS",
  description: "The LLIS newssite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto">{children}</div>
    </>
  );
}
