import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import HeroCarousel from "@/components/hero-carousel";
import Navigation from "@/components/navigation";
import ProductGrid from "@/components/product-grid";
import DealBanner from "@/components/deal-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ChevronRight, Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { Product, Category, Banner } from "@shared/schema";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userId] = useState<string | undefined>(undefined); // Will be replaced with actual auth
  const [sessionId] = useState<string>(() => `guest-${Date.now()}`);

  // Fetch all the data needed for the homepage
  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", { isFeatured: true, limit: 8 }],
    retry: false,
  });

  const { data: newArrivals = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", { isNew: true, limit: 8 }],
    retry: false,
  });

  const { data: trendingProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", { isTrending: true, limit: 6 }],
    retry: false,
  });

  const { data: dealProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", { isDeal: true, limit: 4 }],
    retry: false,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    retry: false,
  });

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
    retry: false,
  });

  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    // Initialize dark mode from localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedMode ? JSON.parse(savedMode) : systemDark;
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <Navigation isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold snitch-black dark:snitch-white mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our curated collections designed for the modern man
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 product-hover border-0">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden rounded-lg">
                      <img
                        src={category.image || "/placeholder-category.png"}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-white font-bold text-xl text-center px-4">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Deal of the Day */}
        <section className="py-16">
          <DealBanner
            endTime={new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()} // 8 hours from now
          />
        </section>

        {/* New Arrivals */}
        <ProductGrid
          products={newArrivals}
          title="New Arrivals"
          userId={userId}
          sessionId={sessionId}
        />

        {/* Trending Section */}
        {trendingProducts.length > 0 && (
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold snitch-black dark:snitch-white mb-4">
                Trending Now
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                What everyone's talking about
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProducts.slice(0, 6).map((product) => (
                <Card key={product.id} className="group product-hover border-0 shadow-sm">
                  <CardContent className="p-0">
                    <Link href={`/products/${product.slug}`}>
                      <div className="aspect-[4/5] relative overflow-hidden rounded-lg">
                        <img
                          src={product.images?.[0] || "/placeholder-product.png"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <Badge className="absolute top-3 left-3 bg-snitch-accent text-white">
                          TRENDING
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-xl font-bold">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/trending">
                <Button variant="outline" size="lg" className="px-8">
                  View All Trending
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* Featured Products */}
        <ProductGrid
          products={featuredProducts}
          title="Featured Collection"
          userId={userId}
          sessionId={sessionId}
        />

        {/* Worth the Wait Preview */}
        <section className="py-16">
          <Card className="bg-gradient-to-r from-gray-900 to-black text-white overflow-hidden">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Worth the Wait</h2>
              <p className="text-xl mb-8 opacity-90">
                Get exclusive early access to our upcoming collection
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/collections/worth-the-wait">
                  <Button size="lg" className="bg-snitch-gold hover:bg-yellow-500 text-black font-bold px-8">
                    Preview Collection
                  </Button>
                </Link>
                <Link href="/notify-me">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8">
                    Notify Me
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-snitch-light-gray dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 snitch-black dark:snitch-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                On orders above ₹999
              </p>
            </div>

            <div className="text-center">
              <div className="bg-snitch-light-gray dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 snitch-black dark:snitch-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                30-day hassle-free returns
              </p>
            </div>

            <div className="text-center">
              <div className="bg-snitch-light-gray dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 snitch-black dark:snitch-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                100% secure transactions
              </p>
            </div>

            <div className="text-center">
              <div className="bg-snitch-light-gray dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 snitch-black dark:snitch-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Customer support always ready
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-snitch-black text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">SNITCH</h3>
              <p className="text-gray-300 mb-4">
                Redefining men's fashion with style, quality, and innovation.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Facebook
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Shop</h4>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/category/${category.slug}`}>
                      <span className="text-gray-300 hover:text-white transition-colors">
                        {category.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Relove (Thrift)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2024 SNITCH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
