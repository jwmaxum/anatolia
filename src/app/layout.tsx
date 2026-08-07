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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,400;1,9..40,700&family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAFAF8] text-stone-800 antialiased selection:bg-[#14532D] selection:text-white">
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
