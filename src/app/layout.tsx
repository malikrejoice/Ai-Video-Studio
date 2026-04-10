import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Video Studio - Professional Video Generator',
  description: 'Create stunning AI-generated videos with advanced features and beautiful UI',
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
