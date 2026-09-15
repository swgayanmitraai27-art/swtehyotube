import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const viewport: Viewport = {
  themeColor: '#e11d48',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://swgayanbhumi.in'),
  title: {
    default: 'SW Tech Solution — #1 YouTube AI Auto-Reply, Auto-Mention & Comment Automation Tool',
    template: '%s | SW Tech Solution — YouTube AI Automation',
  },
  description:
    'Automate 100% natural YouTube comment replies, @mentions, app download links, and toxic comment auto-deletion with Google Gemma 4 31B AI. Specially designed for Indian creators & EdTech coaching institutes.',
  keywords: [
    'YouTube AI Auto Reply',
    'YouTube AI Comment Responder',
    'Auto reply to YouTube comments AI',
    'YouTube Auto Comment Mention tool',
    'YouTube comment bot AI India',
    'Hinglish AI YouTube reply tool',
    'Google Gemma 4 AI YouTube automation',
    'YouTube toxic comment auto delete tool',
    'EdTech YouTube comment manager',
    'YouTube comment marketing automation',
    'SW Tech Solution',
    'swgayanbhumi',
    'YouTube quota optimization BYOK',
    'YouTube channel growth AI bot',
  ],
  authors: [{ name: 'SW Tech Solution Team', url: 'https://swgayanbhumi.in' }],
  creator: 'SW Tech Solution',
  publisher: 'SW Tech Solution',
  applicationName: 'SW Tech Solution YouTube AI Studio',
  category: 'Technology & Productivity',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://swgayanbhumi.in',
  },
  openGraph: {
    title: 'SW Tech Solution — #1 YouTube AI Auto-Reply & Comment Mention Automation',
    description:
      'Boost YouTube engagement 10x with Google Gemma 4 31B AI. Automatically reply in natural Hinglish, tag students with @mentions, promote your app & clean abusive comments 24/7.',
    url: 'https://swgayanbhumi.in',
    siteName: 'SW Tech Solution',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://swgayanbhumi.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SW Tech Solution YouTube AI Auto-Reply Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SW Tech Solution — YouTube AI Auto-Reply & Mention Automation',
    description:
      'Automate YouTube comment replies, app promotions, and toxic comment cleaning with Google Gemma 4 31B AI.',
    images: ['https://swgayanbhumi.in/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-placeholder',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'SW Tech Solution — YouTube AI Auto-Reply Tool',
        operatingSystem: 'All Web Browsers',
        applicationCategory: 'BusinessApplication',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '148',
        },
        offers: {
          '@type': 'Offer',
          price: '39',
          priceCurrency: 'USD',
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
        },
        description:
          '1-Click automated 140+ language AI comment replies & mentions for YouTube Creators. Powered by Google Gemma 4 31B IT Thinking AI.',
        url: 'https://swgayanbhumi.in',
      },
      {
        '@type': 'Organization',
        name: 'SW Tech Solution',
        url: 'https://swgayanbhumi.in',
        logo: 'https://swgayanbhumi.in/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          areaServed: 'IN',
          availableLanguage: ['Hindi', 'English'],
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is SW Tech Solution YouTube AI Auto-Reply?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SW Tech Solution is an AI-powered SaaS tool that automatically replies to YouTube comments, tags viewers with @mentions, promotes app download links, and deletes toxic comments 24/7 using Google Gemma 4 31B AI.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does it support Hinglish and Indian regional languages?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! It natively understands and generates replies in Hinglish, Hindi, Bengali, Gujarati, Marathi, Tamil, Telugu, Bhojpuri, Punjabi, Urdu, and 140+ international languages.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does the BYOK Multi-Project Quota work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Users can connect their own Google Cloud Project API Keys to get dedicated 10,000 to 30,000 daily quota units (6,000 to 18,000 comment replies per month) with zero server rate limits.',
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased selection:bg-rose-500 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
