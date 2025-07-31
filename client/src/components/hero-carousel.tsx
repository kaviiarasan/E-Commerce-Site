import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonVariant: "default" | "outline";
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    title: "SNITCH NEW DROP",
    subtitle: "Redefine Your Street Style",
    buttonText: "Shop Now",
    buttonVariant: "default"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    title: "WORTH THE WAIT",
    subtitle: "Exclusive Preview Collection",
    buttonText: "Preview Now",
    buttonVariant: "outline"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    title: "TRENDING FITS",
    subtitle: "What Everyone's Wearing",
    buttonText: "Explore Trends",
    buttonVariant: "default"
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Carousel Container */}
      <div 
        className="flex transition-transform duration-1000 ease-in-out h-full hero-carousel-slide"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full relative">
            <img
              src={slide.image}
              alt={`${slide.title} - ${slide.subtitle}`}
              className="w-full h-full object-cover"
              loading={slide.id === 1 ? "eager" : "lazy"}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 hero-overlay" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white mb-8 font-light">
                  {slide.subtitle}
                </p>
                <Button
                  size="lg"
                  variant={slide.buttonVariant}
                  className={`px-8 py-6 text-lg font-semibold transition-all duration-300 hover-scale ${
                    slide.buttonVariant === "default" 
                      ? "bg-snitch-black hover:bg-snitch-gray text-white border-0" 
                      : "bg-white text-black hover:bg-gray-100 border-2 border-white"
                  }`}
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white active"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-brand-orange transition-all duration-5000 ease-linear"
          style={{ 
            width: isAutoPlaying ? '100%' : '0%',
            transitionDuration: isAutoPlaying ? '5000ms' : '0ms'
          }}
          key={currentSlide}
        />
      </div>
    </section>
  );
}
