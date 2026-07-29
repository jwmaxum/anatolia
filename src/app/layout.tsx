import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Anatolia | Premium Tile, Stone & Sintered Stone Slabs',
  description:
    'Premium quality tile, stone, sintered stone slabs, mosaics, creative designs, and patented technology represent Anatolia’s leadership in the global architectural market.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0a0a0c] text-stone-100 antialiased selection:bg-[#c5a880] selection:text-black">
        {/* RSC Header with Active Menu Engine */}
        <Header />
        <main className="flex-grow">{children}</main>
        {/* RSC Footer with Active Menu Links */}
        <Footer />
      </body>
    </html>
  );
}
