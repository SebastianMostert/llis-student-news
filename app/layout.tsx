import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/Providers/Providers";
import { SessionProvider } from "next-auth/react";

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
        <html lang="en" suppressHydrationWarning>
            <body
                className='bg-primaryBg-light dark:bg-primaryBg-dark transition-all duration-700'
            >
                <SessionProvider>
                    <Providers>
                        <div className="max-w-6xl mx-auto">{children}</div>
                    </Providers>
                </SessionProvider>
            </body>
        </html>
    );
}
