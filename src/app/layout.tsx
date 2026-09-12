import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'SW Tech Solution - YouTube AI Auto-Reply & Auto-Mention Tool',
  description:
    '1-Click automated 140+ language AI comment replies & mentions for YouTube Creators. Powered by Google Gemma 4 31B IT Thinking AI.',
  keywords: ['YouTube AI Reply', 'Gemma 4 31B', 'YouTube Auto Commenter', 'SW Tech Solution', 'Google AI YouTube', 'Content Creators'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased selection:bg-rose-500 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
