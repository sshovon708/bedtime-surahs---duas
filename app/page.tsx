import HeroSection from "@/components/HeroSection";
import ReadingList from "@/components/ReadingList";
import ProgressBar from "@/components/ProgressBar";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import InstallButton from "@/components/InstallButton";

export default function Home() {
  return (
    <>
      {/* Reading Progress Bar */}
      <ProgressBar />

      <main className="reading-container">
        {/* Top Hero Title */}
        <HeroSection />

        {/* Subtle, self-hiding PWA install action (renders nothing unless the
            browser offers an install prompt and the app isn't already installed). */}
        <InstallButton />

        {/* Surahs & Duas Collapsible Reading List */}
        <ReadingList />
      </main>

      {/* Scroll To Top Button */}
      <ScrollToTopButton />
    </>
  );
}