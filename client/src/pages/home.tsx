import HeroCarousel from "@/components/hero-carousel";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroCarousel />
      
      {/* Additional sections can be added here */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">
            Welcome to Snitch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of men's fashion. From casual wear to formal attire, 
            we have everything you need to elevate your style game.
          </p>
        </div>
      </section>
    </div>
  );
}
