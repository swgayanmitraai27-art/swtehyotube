import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'SW Tech Solution - YouTube AI Auto-Reply & Auto-Mention Tool',
  description:
    '1-Click automated Hinglish AI comment replies & mentions for Indian YouTube Creators. Maximize retention, engagement and save 10k YouTube quota units with Gemini 1.5 Flash.',
  keywords: ['YouTube AI Reply', 'Hinglish AI', 'YouTube Auto Commenter', 'SW Tech Solution', 'Gemini AI YouTube', 'Indian Creators'],
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
