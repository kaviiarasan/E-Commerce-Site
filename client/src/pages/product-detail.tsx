import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import Navigation from "@/components/navigation";
import ProductGrid from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  RotateCcw, 
  Shield, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Product, Review } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [location] = useLocation();
  const slug = location.split('/').pop();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userId] = useState<string | undefined>(undefined); // Replace with actual auth
  const [sessionId] = useState<string>(() => `guest-${Date.now()}`);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch product details
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/slug/${slug}`],
    retry: false,
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", { categoryId: product?.categoryId, limit: 4 }],
    enabled: !!product?.categoryId,
    retry: false,
  });

  // Fetch product reviews
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: [`/api/products/${product?.id}/reviews`],
    enabled: !!product?.id,
    retry: false,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("Product not found");
      
      return apiRequest("POST", "/api/cart", {
        productId: product.id,
        userId,
        sessionId: sessionId || `guest-${Date.now()}`,
        quantity,
        selectedSize: selectedSize || undefined,
        selectedColor: selectedColor || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: `${product?.name} has been added to your cart.`,
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

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("Product not found");
      if (!userId) throw new Error("Please log in to add items to wishlist");
      
      return apiRequest("POST", "/api/wishlist", {
        productId: product.id,
        userId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to Wishlist",
        description: `${product?.name} has been added to your wishlist.`,
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

  const handleAddToCart = () => {
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    addToCartMutation.mutate();
  };

  const handleAddToWishlist = () => {
    addToWishlistMutation.mutate();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
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

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={product.images?.[currentImageIndex] || "/placeholder-product.png"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {product.images && product.images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
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
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-snitch-black dark:border-snitch-white"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold snitch-black dark:snitch-white mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              {parseFloat(product.rating || "0") > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {renderStars(product.rating || "0")}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold snitch-black dark:snitch-white">
                  ₹{parseFloat(product.price).toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{parseFloat(product.compareAtPrice).toLocaleString('en-IN')}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedSize === size
                          ? "border-snitch-black bg-snitch-black text-white dark:border-snitch-white dark:bg-snitch-white dark:text-black"
                          : "border-gray-300 dark:border-gray-600 hover:border-snitch-black dark:hover:border-snitch-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedColor === color
                          ? "border-snitch-black bg-snitch-black text-white dark:border-snitch-white dark:bg-snitch-white dark:text-black"
                          : "border-gray-300 dark:border-gray-600 hover:border-snitch-black dark:hover:border-snitch-white"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center border rounded-lg w-fit">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-snitch-black hover:bg-snitch-gray text-white"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleAddToWishlist}
                  disabled={addToWishlistMutation.isPending}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              <Button size="lg" variant="outline" className="w-full">
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Free shipping on orders above ₹999</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-green-600" />
                <span>30-day easy returns</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-green-600" />
                <span>100% authentic products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="care">Care Instructions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Product Description</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {product.description}
                      </p>
                    </div>
                    
                    {product.materialInfo && (
                      <div>
                        <h3 className="font-semibold mb-2">Material</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {product.materialInfo}
                        </p>
                      </div>
                    )}

                    {product.tags && product.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="care" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Care Instructions</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {product.careInstructions || "Follow care label instructions for best results."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Customer Reviews</h3>
                  {reviews.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">
                      No reviews yet. Be the first to review this product!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {renderStars(review.rating.toString())}
                            </div>
                            <span className="font-medium">{review.userName}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ProductGrid
            products={relatedProducts.filter(p => p.id !== product.id).slice(0, 4)}
            title="You Might Also Like"
            userId={userId}
            sessionId={sessionId}
          />
        )}
      </div>
    </div>
  );
}