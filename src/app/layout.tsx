import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'GENESIS — The Human Body Discovery Engine',
  description: 'Understand the body. Decode disease. Discover the cure. A Vilmure Ventures Company.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-void text-text-primary min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
