import type { Metadata } from "next";
import Header from "@/components/Header";
import Link from "next/link";

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
    <div className="max-w-6xl mx-auto">
      <header>
        <div className='p-10 items-center'>
          <Link href='/' prefetch={false}>
            <div className='font-ttFors text-4xl text-center'>
              <h1>KEEPING UP</h1>
              <h1>W!TH LLIS</h1>
            </div>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
}
