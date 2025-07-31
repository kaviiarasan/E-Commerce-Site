import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductGridProps {
  products: Product[];
  title?: string;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  userId?: string;
  sessionId?: string;
}

export default function ProductGrid({ 
  products, 
  title, 
  showAddToCart = true, 
  showWishlist = true, 
  userId,
  sessionId 
}: ProductGridProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      return apiRequest("POST", "/api/cart", {
        productId,
        userId,
        sessionId: sessionId || `guest-${Date.now()}`,
        quantity: 1,
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: "Product has been added to your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add product to cart.",
        variant: "destructive",
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!userId) {
        throw new Error("Please log in to add items to wishlist");
      }
      return apiRequest("POST", "/api/wishlist", {
        productId,
        userId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to Wishlist",
        description: "Product has been added to your wishlist.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist", userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add product to wishlist.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate(productId);
  };

  const handleAddToWishlist = (productId: string) => {
    addToWishlistMutation.mutate(productId);
  };

  const formatPrice = (price: string) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= ratingNum ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <section className="py-16">
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold snitch-black dark:snitch-white mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-snitch-accent mx-auto"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group product-hover border-0 shadow-sm hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <Link href={`/products/${product.slug}`}>
                  <div className="aspect-[3/4] relative">
                    <img
                      src={product.images?.[0] || "/placeholder-product.png"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Second image on hover */}
                    {product.images?.[1] && (
                      <img
                        src={product.images[1]}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                          hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}
                  </div>
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-snitch-accent text-white">NEW</Badge>
                  )}
                  {product.isDeal && (
                    <Badge className="bg-snitch-gold text-black">DEAL</Badge>
                  )}
                  {product.isTrending && (
                    <Badge className="bg-snitch-black text-white">TRENDING</Badge>
                  )}
                </div>

                {/* Action buttons on hover */}
                <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
                  hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                }`}>
                  {showWishlist && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 bg-white/90 hover:bg-white text-black"
                      onClick={() => handleAddToWishlist(product.id)}
                      disabled={addToWishlistMutation.isPending}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  )}
                  {showAddToCart && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 bg-white/90 hover:bg-white text-black"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addToCartMutation.isPending}
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Quick shop on hover */}
                <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
                  hoveredProduct === product.id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}>
                  <Link href={`/products/${product.slug}`}>
                    <Button className="w-full bg-snitch-black hover:bg-snitch-gray text-white">
                      Quick Shop
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 snitch-black dark:snitch-white group-hover:snitch-accent transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                {parseFloat(product.rating || "0") > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {renderStars(product.rating || "0")}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviewCount})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold snitch-black dark:snitch-white">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        {Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100)}% OFF
                      </Badge>
                    </>
                  )}
                </div>

                {/* Sizes preview */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    <span className="text-xs text-gray-500">Sizes:</span>
                    {product.sizes.slice(0, 4).map((size) => (
                      <Badge key={size} variant="outline" className="text-xs">
                        {size}
                      </Badge>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="text-xs text-gray-500">+{product.sizes.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}