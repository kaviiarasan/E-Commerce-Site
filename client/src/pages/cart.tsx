import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { CartItem, Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userId] = useState<string | undefined>(undefined); // Replace with actual auth
  const [sessionId] = useState<string>(() => `guest-${Date.now()}`);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery<(CartItem & { product: Product })[]>({
    queryKey: ["/api/cart", { userId: userId || undefined, sessionId }],
    retry: false,
  });

  // Update cart item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity.",
        variant: "destructive",
      });
    },
  });

  // Remove item from cart
  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
      return;
    }
    updateQuantityMutation.mutate({ id, quantity: newQuantity });
  };

  const handleRemoveItem = (id: string) => {
    removeItemMutation.mutate(id);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.product.price) * item.quantity);
  }, 0);

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-8" />
            <h1 className="text-3xl font-bold snitch-black dark:snitch-white mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. 
              Start exploring our collections!
            </p>
            <Link href="/">
              <Button size="lg" className="bg-snitch-black hover:bg-snitch-gray text-white px-8">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold snitch-black dark:snitch-white">
            Shopping Cart ({cartItems.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link href={`/products/${item.product.slug}`}>
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.product.images?.[0] || "/placeholder-product.png"}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.slug}`}>
                        <h3 className="font-semibold text-lg mb-1 snitch-black dark:snitch-white hover:snitch-accent transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.selectedSize && (
                          <Badge variant="outline">Size: {item.selectedSize}</Badge>
                        )}
                        {item.selectedColor && (
                          <Badge variant="outline">Color: {item.selectedColor}</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold snitch-black dark:snitch-white">
                            ₹{parseFloat(item.product.price).toLocaleString('en-IN')}
                          </span>
                          {item.product.compareAtPrice && parseFloat(item.product.compareAtPrice) > parseFloat(item.product.price) && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{parseFloat(item.product.compareAtPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updateQuantityMutation.isPending}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updateQuantityMutation.isPending}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeItemMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-2 text-right">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Subtotal: ₹{(parseFloat(item.product.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 snitch-black dark:snitch-white">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for FREE shipping
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link href="/checkout">
                    <Button size="lg" className="w-full bg-snitch-black hover:bg-snitch-gray text-white">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <Link href="/">
                    <Button size="lg" variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Free shipping on orders above ₹999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>30-day easy returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure payment gateway</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}