import { VideoSection } from './sections/VideoSection';
import { HeroSection } from './sections/HeroSection';
import { LineupSection } from './sections/LineupSection';

export const Landing = () => {
  return (
    <div className="bg-atlantis-white text-atlantis-bg-main min-h-screen">
      <VideoSection />
      <HeroSection />
      <LineupSection />
    </div>
  );
};
