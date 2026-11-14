import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GlobalStatsTicker from '@/components/GlobalStatsTicker';
import TechStackMatrix from '@/components/TechStackMatrix';
import GamesBentoGrid from '@/components/GamesBentoGrid';
import StoreSection from '@/components/StoreSection';
import TimelineSection from '@/components/TimelineSection';
import TerminalContact from '@/components/TerminalContact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0b0c10] text-gray-100 overflow-x-hidden relative baseplate-grid">
      {/* Header */}
      <Navbar />

      {/* Hero Section with Interactive 3D Avatar (Angry Walk on Hover, Sleep on Scroll) */}
      <HeroSection />

      {/* About & Live Stats */}
      <GlobalStatsTicker />

      {/* 02 · Skills Matrix */}
      <TechStackMatrix />

      {/* 03 · Work / Games Showcase */}
      <GamesBentoGrid />

      {/* 04 · Services & 05 · Order & Reviews */}
      <StoreSection />

      {/* 06 · Journey / Timeline */}
      <TimelineSection />

      {/* 07 · Contact Hub */}
      <TerminalContact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
