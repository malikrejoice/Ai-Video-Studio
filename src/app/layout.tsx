import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MotionMint Studio',
  description: 'Create cinematic AI videos from prompts and references with a polished studio workflow.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-950">
        {children}
      </body>
    </html>
  );
}
