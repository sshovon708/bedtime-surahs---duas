import HeroSection from "@/components/HeroSection";
import ReadingList from "@/components/ReadingList";
import ProgressBar from "@/components/ProgressBar";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function Home() {
  return (
    <>
      {/* Reading Progress Bar */}
      <ProgressBar />

      <main className="reading-container">
        {/* Top Hero Title */}
        <HeroSection />

        {/* Surahs & Duas Collapsible Reading List */}
        <ReadingList />
      </main>

      {/* Scroll To Top Button */}
      <ScrollToTopButton />
    </>
  );
}