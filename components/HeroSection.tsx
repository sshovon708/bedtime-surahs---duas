import Image from "next/image";

export default function HeroSection() {
  return (
    <header className="top-title-section">
      <div className="moon-symbol">
        <Image
          src="/icons/icon-192.png"
          alt="ঘুমানোর পূর্বের সূরা ও দোয়া লোগো"
          width={96}
          height={96}
          className="hero-logo"
          priority
        />
      </div>
      <h1 className="title-bn">ঘুমানোর পূর্বের সূরা ও দোয়া</h1>
      <h2 className="title-en">Bedtime Surahs & Duas</h2>
      <p className="subtitle">
        "আল্লাহর সন্তুষ্টি ও বরকতের আশায় প্রতিরাতে পাঠের জন্য একটি ব্যক্তিগত
        সংগ্রহ"
      </p>
    </header>
  );
}
