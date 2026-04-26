import { HeroSection } from './sections/HeroSection';
import { LineupSection } from './sections/LineupSection';

export const Landing = () => {
  return (
    <div className="bg-atlantis-white text-atlantis-bg-main min-h-screen flex flex-col w-full">
      <HeroSection />
      <div className="container mx-auto max-w-7xl px-8 md:px-24">
        <LineupSection />
      </div>
    </div>
  );
};
