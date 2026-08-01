import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AppProviders } from '@/components/providers/AppProviders';
import CartDrawer from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'Anatolia Gourmet | Premium Artisanal Ingredients & Fine Foods',
  description:
    'Hand-selected extra virgin olive oils, 36-month DOP cheeses, truffle products, and organic gourmet ingredients imported directly from heritage producers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#1a1a1a] text-stone-100 antialiased selection:bg-[#c5a880] selection:text-black">
        <AppProviders>
          {/* RSC Header with Active Menu Engine & Multi-language Selector */}
          <Header />
          <CartDrawer />
          <main className="flex-grow">{children}</main>
          {/* RSC Footer */}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
