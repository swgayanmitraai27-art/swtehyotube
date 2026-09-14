import LandingView from '@/components/LandingView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function HomePage() {
  return <LandingView />;
}
