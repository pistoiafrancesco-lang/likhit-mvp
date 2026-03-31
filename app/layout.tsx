import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Likhit | La tua storia merita di essere letta',
  description: 'Marketplace letterario AI-powered per autori inediti.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
