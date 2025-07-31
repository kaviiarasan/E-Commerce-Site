import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Moon, 
  Sun,
  X 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface NavigationProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function Navigation({ isDarkMode, onToggleDarkMode }: NavigationProps) {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Fetch categories for navigation
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    retry: false,
  });

  // Mock cart count for now - will be replaced with real cart data
  useEffect(() => {
    setCartCount(3); // Mock cart count
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/">
                  <Button variant="ghost" className="w-full justify-start text-left">
                    Home
                  </Button>
                </Link>
                {categories.map((category) => (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      {category.name}
                    </Button>
                  </Link>
                ))}
                <Link href="/collections/worth-the-wait">
                  <Button variant="ghost" className="w-full justify-start text-left snitch-accent">
                    Worth the Wait
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold snitch-black dark:snitch-white tracking-tight">
                YOUR BRAND
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.slice(0, 4).map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Button 
                  variant="ghost" 
                  className={`hover:snitch-accent transition-colors ${
                    location.includes(category.slug) ? "snitch-accent" : ""
                  }`}
                >
                  {category.name}
                </Button>
              </Link>
            ))}
            <Link href="/collections/worth-the-wait">
              <Button 
                variant="ghost" 
                className="snitch-accent hover:bg-snitch-accent hover:text-white transition-all"
              >
                Worth the Wait
              </Button>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-800 dark:border-gray-600"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Dark mode toggle */}
            {onToggleDarkMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleDarkMode}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Shopping cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-snitch-accent text-white text-xs min-w-[1.2rem] h-5 flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User profile */}
            <Link href="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}