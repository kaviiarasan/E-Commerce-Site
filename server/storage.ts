import {
  users,
  products,
  categories,
  cart,
  wishlist,
  orders,
  orderItems,
  reviews,
  addresses,
  banners,
  notifications,
  recommendations,
  collections,
  productCollections,
  type User,
  type Product,
  type Category,
  type CartItem,
  type WishlistItem,
  type Order,
  type OrderItem,
  type Review,
  type Address,
  type Banner,
  type Notification,
  type Recommendation,
  type Collection,
  type InsertUser,
  type InsertProduct,
  type InsertCategory,
  type InsertCartItem,
  type InsertWishlistItem,
  type InsertOrder,
  type InsertReview,
  type InsertAddress,
  type InsertBanner,
  type InsertNotification,
  type InsertCollection,
  type CartItemWithProduct,
  type OrderWithItems,
  type ProductWithDetails,
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  
  // Product operations
  getProducts(filters?: {
    categoryId?: string;
    isNew?: boolean;
    isTrending?: boolean;
    isFeatured?: boolean;
    isDeal?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<ProductWithDetails | undefined>;
  getProductBySlug(slug: string): Promise<ProductWithDetails | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Cart operations
  getCartItems(userId?: string, sessionId?: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId?: string, sessionId?: string): Promise<void>;
  
  // Wishlist operations
  getWishlistItems(userId: string): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: string, productId: string): Promise<void>;
  
  // Order operations
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  
  // Review operations
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewHelpfulness(id: string, helpful: boolean): Promise<Review>;
  
  // Address operations
  getUserAddresses(userId: string): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: string, address: Partial<InsertAddress>): Promise<Address>;
  deleteAddress(id: string): Promise<void>;
  
  // Banner operations
  getBanners(): Promise<Banner[]>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  
  // Notification operations
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<void>;
  
  // Recommendation operations
  getProductRecommendations(productId: string, type: string): Promise<Product[]>;
  
  // Collection operations
  getCollections(upcoming?: boolean): Promise<Collection[]>;
  getCollection(id: string): Promise<Collection | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private categories: Map<string, Category> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private wishlistItems: Map<string, WishlistItem> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();
  private reviews: Map<string, Review> = new Map();
  private addresses: Map<string, Address> = new Map();
  private banners: Map<string, Banner> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private recommendations: Map<string, Recommendation> = new Map();
  private collections: Map<string, Collection> = new Map();

  constructor() {
    this.seedData();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private seedData() {
    // Seed categories
    const categoryData = [
      { id: "cat1", name: "Shirts", slug: "shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300", description: "Premium shirts collection", isActive: true, sortOrder: 1, createdAt: new Date() },
      { id: "cat2", name: "Jeans", slug: "jeans", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300", description: "Stylish jeans collection", isActive: true, sortOrder: 2, createdAt: new Date() },
      { id: "cat3", name: "T-Shirts", slug: "t-shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300", description: "Casual t-shirts collection", isActive: true, sortOrder: 3, createdAt: new Date() },
      { id: "cat4", name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", description: "Fashion accessories", isActive: true, sortOrder: 4, createdAt: new Date() },
    ];
    categoryData.forEach(cat => this.categories.set(cat.id, cat));

    // Seed products
    const productData = [
      {
        id: "prod1",
        name: "Classic White Shirt",
        slug: "classic-white-shirt",
        description: "Premium cotton white shirt perfect for any occasion",
        price: "2499.00",
        compareAtPrice: "3499.00",
        categoryId: "cat1",
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
          "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Light Blue", "Navy"],
        isNew: true,
        isTrending: false,
        isFeatured: true,
        isDeal: false,
        stock: 50,
        rating: "4.50",
        reviewCount: 28,
        isActive: true,
        tags: ["formal", "cotton", "premium"],
        materialInfo: "100% Premium Cotton",
        careInstructions: "Machine wash cold, hang dry",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prod2",
        name: "Slim Fit Jeans",
        slug: "slim-fit-jeans",
        description: "Comfortable slim fit jeans with stretch fabric",
        price: "3999.00",
        compareAtPrice: "4999.00",
        categoryId: "cat2",
        images: [
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600"
        ],
        sizes: ["28", "30", "32", "34", "36", "38"],
        colors: ["Dark Blue", "Black", "Light Blue"],
        isNew: false,
        isTrending: true,
        isFeatured: false,
        isDeal: true,
        stock: 35,
        rating: "4.20",
        reviewCount: 45,
        isActive: true,
        tags: ["casual", "stretch", "slim-fit"],
        materialInfo: "98% Cotton, 2% Elastane",
        careInstructions: "Machine wash cold, tumble dry low",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prod3",
        name: "Graphic T-Shirt",
        slug: "graphic-t-shirt",
        description: "Trendy graphic t-shirt with modern design",
        price: "1299.00",
        compareAtPrice: "1599.00",
        categoryId: "cat3",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
          "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=600",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Navy", "Maroon"],
        isNew: true,
        isTrending: true,
        isFeatured: false,
        isDeal: false,
        stock: 75,
        rating: "4.80",
        reviewCount: 92,
        isActive: true,
        tags: ["casual", "graphic", "trendy"],
        materialInfo: "100% Cotton",
        careInstructions: "Machine wash cold, inside out",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prod4",
        name: "Leather Watch",
        slug: "leather-watch",
        description: "Elegant leather strap watch with chronograph",
        price: "5999.00",
        compareAtPrice: "7999.00",
        categoryId: "cat4",
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
          "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600",
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"
        ],
        sizes: ["One Size"],
        colors: ["Brown", "Black", "Tan"],
        isNew: false,
        isTrending: false,
        isFeatured: true,
        isDeal: true,
        stock: 15,
        rating: "4.70",
        reviewCount: 23,
        isActive: true,
        tags: ["luxury", "leather", "chronograph"],
        materialInfo: "Genuine Leather Strap, Stainless Steel Case",
        careInstructions: "Wipe with dry cloth, avoid water exposure",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    productData.forEach(prod => this.products.set(prod.id, prod));

    // Seed banners
    const bannerData = [
      {
        id: "banner1",
        title: "NEW COLLECTION",
        subtitle: "Elevate Your Style Game",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        buttonText: "Shop Now",
        buttonLink: "/products",
        isActive: true,
        sortOrder: 1,
        startDate: new Date(),
        endDate: null,
        createdAt: new Date()
      },
      {
        id: "banner2",
        title: "SUMMER SALE",
        subtitle: "Up to 50% Off",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        buttonText: "Shop Sale",
        buttonLink: "/sale",
        isActive: true,
        sortOrder: 2,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      }
    ];
    bannerData.forEach(banner => this.banners.set(banner.id, banner));

    // Seed collections
    const collectionData = [
      {
        id: "col1",
        name: "Worth the Wait",
        slug: "worth-the-wait",
        description: "Upcoming premium collection dropping soon",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
        isUpcoming: true,
        launchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date()
      }
    ];
    collectionData.forEach(col => this.collections.set(col.id, col));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.generateId();
    const newUser: User = {
      id,
      email: user.email ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      phone: user.phone ?? null,
      profileImageUrl: user.profileImageUrl ?? null,
      isGuest: user.isGuest ?? false,
      preferences: user.preferences ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) throw new Error("User not found");
    
    const updated: User = {
      ...existing,
      ...user,
      updatedAt: new Date(),
    };
    this.users.set(id, updated);
    return updated;
  }

  // Product operations
  async getProducts(filters: {
    categoryId?: string;
    isNew?: boolean;
    isTrending?: boolean;
    isFeatured?: boolean;
    isDeal?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(p => p.isActive);

    if (filters.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.isNew) {
      products = products.filter(p => p.isNew);
    }
    if (filters.isTrending) {
      products = products.filter(p => p.isTrending);
    }
    if (filters.isFeatured) {
      products = products.filter(p => p.isFeatured);
    }
    if (filters.isDeal) {
      products = products.filter(p => p.isDeal);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created date (newest first)
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (filters.offset) {
      products = products.slice(filters.offset);
    }
    if (filters.limit) {
      products = products.slice(0, filters.limit);
    }

    return products;
  }

  async getProduct(id: string): Promise<ProductWithDetails | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const category = product.categoryId ? this.categories.get(product.categoryId) : undefined;
    const reviews = Array.from(this.reviews.values()).filter(r => r.productId === id);
    
    return {
      ...product,
      category,
      reviews,
      recommendations: {
        alsoLike: Array.from(this.products.values()).slice(0, 4),
        pairWith: Array.from(this.products.values()).slice(0, 3)
      }
    };
  }

  async getProductBySlug(slug: string): Promise<ProductWithDetails | undefined> {
    const product = Array.from(this.products.values()).find(p => p.slug === slug);
    if (!product) return undefined;
    return this.getProduct(product.id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.generateId();
    const newProduct: Product = {
      id,
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) throw new Error("Product not found");
    
    const updated: Product = {
      ...existing,
      ...product,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values())
      .filter(c => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(c => c.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.generateId();
    const newCategory: Category = {
      id,
      ...category,
      createdAt: new Date(),
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Cart operations
  async getCartItems(userId?: string, sessionId?: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => 
      (userId && item.userId === userId) || (sessionId && item.sessionId === sessionId)
    );

    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) throw new Error("Product not found");
      return { ...item, product };
    });
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = this.generateId();
    const newItem: CartItem = {
      id,
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const existing = this.cartItems.get(id);
    if (!existing) throw new Error("Cart item not found");
    
    const updated: CartItem = {
      ...existing,
      quantity,
      updatedAt: new Date(),
    };
    this.cartItems.set(id, updated);
    return updated;
  }

  async removeFromCart(id: string): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(userId?: string, sessionId?: string): Promise<void> {
    for (const [id, item] of this.cartItems.entries()) {
      if ((userId && item.userId === userId) || (sessionId && item.sessionId === sessionId)) {
        this.cartItems.delete(id);
      }
    }
  }

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(item => item.userId === userId);
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const id = this.generateId();
    const newItem: WishlistItem = {
      id,
      ...item,
      createdAt: new Date(),
    };
    this.wishlistItems.set(id, newItem);
    return newItem;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    for (const [id, item] of this.wishlistItems.entries()) {
      if (item.userId === userId && item.productId === productId) {
        this.wishlistItems.delete(id);
        break;
      }
    }
  }

  // Order operations
  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrder(id: string): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === id)
      .map(item => {
        const product = this.products.get(item.productId);
        if (!product) throw new Error("Product not found");
        return { ...item, product };
      });

    return { ...order, items };
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.generateId();
    const orderNumber = `SNT${Date.now()}`;
    const newOrder: Order = {
      id,
      orderNumber,
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const existing = this.orders.get(id);
    if (!existing) throw new Error("Order not found");
    
    const updated: Order = {
      ...existing,
      status,
      updatedAt: new Date(),
    };
    this.orders.set(id, updated);
    return updated;
  }

  // Review operations
  async getProductReviews(productId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.generateId();
    const newReview: Review = {
      id,
      ...review,
      createdAt: new Date(),
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async updateReviewHelpfulness(id: string, helpful: boolean): Promise<Review> {
    const existing = this.reviews.get(id);
    if (!existing) throw new Error("Review not found");
    
    const updated: Review = {
      ...existing,
      helpfulCount: existing.helpfulCount + (helpful ? 1 : -1),
    };
    this.reviews.set(id, updated);
    return updated;
  }

  // Address operations
  async getUserAddresses(userId: string): Promise<Address[]> {
    return Array.from(this.addresses.values()).filter(addr => addr.userId === userId);
  }

  async createAddress(address: InsertAddress): Promise<Address> {
    const id = this.generateId();
    const newAddress: Address = {
      id,
      ...address,
      createdAt: new Date(),
    };
    this.addresses.set(id, newAddress);
    return newAddress;
  }

  async updateAddress(id: string, address: Partial<InsertAddress>): Promise<Address> {
    const existing = this.addresses.get(id);
    if (!existing) throw new Error("Address not found");
    
    const updated: Address = {
      ...existing,
      ...address,
    };
    this.addresses.set(id, updated);
    return updated;
  }

  async deleteAddress(id: string): Promise<void> {
    this.addresses.delete(id);
  }

  // Banner operations
  async getBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values())
      .filter(banner => banner.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const id = this.generateId();
    const newBanner: Banner = {
      id,
      ...banner,
      createdAt: new Date(),
    };
    this.banners.set(id, newBanner);
    return newBanner;
  }

  // Notification operations
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.generateId();
    const newNotification: Notification = {
      id,
      ...notification,
      createdAt: new Date(),
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markNotificationRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      this.notifications.set(id, { ...notification, isRead: true });
    }
  }

  // Recommendation operations
  async getProductRecommendations(productId: string, type: string): Promise<Product[]> {
    // For demo purposes, return some products
    return Array.from(this.products.values()).slice(0, 4);
  }

  // Collection operations
  async getCollections(upcoming?: boolean): Promise<Collection[]> {
    let collections = Array.from(this.collections.values()).filter(c => c.isActive);
    
    if (upcoming !== undefined) {
      collections = collections.filter(c => c.isUpcoming === upcoming);
    }
    
    return collections.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCollection(id: string): Promise<Collection | undefined> {
    return this.collections.get(id);
  }
}

export const storage = new MemStorage();