import Link from 'next/link';
import RoughButton from './components/RoughButton';
import PageLayout from './components/PageLayout';

export default function Home() {
  return (
    <PageLayout backgroundImage="/images/home_background.png">
      <div style={{ height: '170px' }} />
      <div className="home-buttons">
        <Link href="/difficulty" style={{ textDecoration: 'none' }}>
          <RoughButton className="btn-green btn-large">Start</RoughButton>
        </Link>
        <Link href="/instructions" style={{ textDecoration: 'none' }}>
          <RoughButton className="btn-yellow btn-large">How to play</RoughButton>
        </Link>
      </div>
      <div className="copyright-text">
        &copy; Hedgie Game Studio
      </div>
    </PageLayout>
  );
}
