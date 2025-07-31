import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertProductSchema,
  insertCategorySchema,
  insertCartItemSchema,
  insertWishlistItemSchema,
  insertOrderSchema,
  insertReviewSchema,
  insertAddressSchema,
  insertBannerSchema,
  insertNotificationSchema,
  insertCollectionSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const {
        categoryId,
        isNew,
        isTrending,
        isFeatured,
        isDeal,
        search,
        limit = 20,
        offset = 0,
      } = req.query;

      const filters = {
        categoryId: categoryId as string,
        isNew: isNew === "true",
        isTrending: isTrending === "true",
        isFeatured: isFeatured === "true",
        isDeal: isDeal === "true",
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined || filters[key] === false) {
          delete filters[key];
        }
      });

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Cart operations (guest support with sessionId)
  app.get("/api/cart", async (req, res) => {
    try {
      const { userId, sessionId } = req.query;
      if (!userId && !sessionId) {
        return res.status(400).json({ message: "userId or sessionId required" });
      }
      
      const cartItems = await storage.getCartItems(userId as string, sessionId as string);
      res.json(cartItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const { userId, sessionId } = req.query;
      if (!userId && !sessionId) {
        return res.status(400).json({ message: "userId or sessionId required" });
      }
      
      await storage.clearCart(userId as string, sessionId as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Wishlist operations
  app.get("/api/wishlist/:userId", async (req, res) => {
    try {
      const wishlistItems = await storage.getWishlistItems(req.params.userId);
      res.json(wishlistItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const validatedData = insertWishlistItemSchema.parse(req.body);
      const wishlistItem = await storage.addToWishlist(validatedData);
      res.status(201).json(wishlistItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/wishlist/:userId/:productId", async (req, res) => {
    try {
      await storage.removeFromWishlist(req.params.userId, req.params.productId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Orders
  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const orders = await storage.getOrders(req.params.userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/detail/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await storage.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Reviews
  app.get("/api/reviews/:productId", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.productId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/reviews/:id/helpful", async (req, res) => {
    try {
      const { helpful } = req.body;
      if (typeof helpful !== "boolean") {
        return res.status(400).json({ message: "helpful must be boolean" });
      }
      
      const review = await storage.updateReviewHelpfulness(req.params.id, helpful);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Addresses
  app.get("/api/addresses/:userId", async (req, res) => {
    try {
      const addresses = await storage.getUserAddresses(req.params.userId);
      res.json(addresses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/addresses", async (req, res) => {
    try {
      const validatedData = insertAddressSchema.parse(req.body);
      const address = await storage.createAddress(validatedData);
      res.status(201).json(address);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/addresses/:id", async (req, res) => {
    try {
      const validatedData = insertAddressSchema.partial().parse(req.body);
      const address = await storage.updateAddress(req.params.id, validatedData);
      res.json(address);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/addresses/:id", async (req, res) => {
    try {
      await storage.deleteAddress(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Banners
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getBanners();
      res.json(banners);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/banners", async (req, res) => {
    try {
      const validatedData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(validatedData);
      res.status(201).json(banner);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Notifications
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.params.userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Recommendations
  app.get("/api/recommendations/:productId", async (req, res) => {
    try {
      const { type = "also_like" } = req.query;
      const recommendations = await storage.getProductRecommendations(
        req.params.productId,
        type as string
      );
      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Collections
  app.get("/api/collections", async (req, res) => {
    try {
      const { upcoming } = req.query;
      const upcomingFilter = upcoming === "true" ? true : upcoming === "false" ? false : undefined;
      const collections = await storage.getCollections(upcomingFilter);
      res.json(collections);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/collections/:id", async (req, res) => {
    try {
      const collection = await storage.getCollection(req.params.id);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.json(collection);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/collections", async (req, res) => {
    try {
      const validatedData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(validatedData);
      res.status(201).json(collection);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User operations (basic for now)
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}