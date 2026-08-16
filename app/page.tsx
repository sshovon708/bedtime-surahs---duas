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

        {/* Cross-browser PWA install action. Visible whenever the app isn't
            already installed; uses native install where available, otherwise
            shows browser-specific installation instructions. */}
        <InstallButton />

        {/* Surahs & Duas Collapsible Reading List */}
        <ReadingList />
      </main>

      {/* Scroll To Top Button */}
      <ScrollToTopButton />
    </>
  );
}