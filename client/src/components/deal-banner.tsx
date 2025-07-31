import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Zap } from "lucide-react";

interface DealBannerProps {
  title?: string;
  subtitle?: string;
  discount?: string;
  productImage?: string;
  productName?: string;
  originalPrice?: string;
  dealPrice?: string;
  endTime?: string;
  link?: string;
}

export default function DealBanner({
  title = "Deal of the Day",
  subtitle = "Limited Time Offer",
  discount = "50% OFF",
  productImage = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
  productName = "Premium Graphic Tee",
  originalPrice = "₹2,499",
  dealPrice = "₹1,249",
  endTime,
  link = "/deals"
}: DealBannerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      return "00:00:00";
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <Card className="bg-gradient-to-r from-snitch-black to-snitch-gray text-white overflow-hidden animate-pulse-border">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side - Text content */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-snitch-gold animate-pulse" />
              <span className="text-snitch-gold font-semibold text-sm uppercase tracking-wide">
                {subtitle}
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {title}
            </h2>
            
            <div className="text-6xl lg:text-7xl font-black text-snitch-gold mb-6">
              {discount}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{productName}</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-snitch-gold">{dealPrice}</span>
                <span className="text-lg text-gray-400 line-through">{originalPrice}</span>
              </div>
            </div>

            {timeLeft && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-snitch-accent" />
                  <span className="text-sm font-medium">Ends in:</span>
                </div>
                <div className="text-3xl font-mono font-bold text-snitch-accent">
                  {timeLeft}
                </div>
              </div>
            )}

            <Link href={link}>
              <Button 
                size="lg" 
                className="bg-snitch-gold hover:bg-yellow-500 text-black font-bold px-8 py-4 text-lg transition-all duration-300 hover-scale"
              >
                Shop Now
              </Button>
            </Link>
          </div>

          {/* Right side - Product image */}
          <div className="flex-1 relative h-64 lg:h-96 w-full">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-snitch-black/50 lg:to-snitch-black/80"></div>
            
            {/* Floating discount badge */}
            <div className="absolute top-4 right-4 bg-snitch-accent text-white px-4 py-2 rounded-full font-bold animate-bounce">
              {discount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}