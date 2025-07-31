import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for the e-commerce app
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  profileImageUrl: varchar("profile_image_url"),
  isGuest: boolean("is_guest").default(false),
  preferences: jsonb("preferences"), // for AI recommendations
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  image: varchar("image"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  categoryId: varchar("category_id").references(() => categories.id),
  images: text("images").array(),
  sizes: text("sizes").array(),
  colors: text("colors").array(),
  isNew: boolean("is_new").default(false),
  isTrending: boolean("is_trending").default(false),
  isFeatured: boolean("is_featured").default(false),
  isDeal: boolean("is_deal").default(false),
  stock: integer("stock").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
  tags: text("tags").array(), // for recommendations
  materialInfo: text("material_info"),
  careInstructions: text("care_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Addresses table
export const addresses = pgTable("addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  addressLine1: varchar("address_line_1").notNull(),
  addressLine2: varchar("address_line_2"),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  pincode: varchar("pincode").notNull(),
  country: varchar("country").notNull().default("India"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cart table
export const cart = pgTable("cart", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id"), // For guest users
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  size: varchar("size"),
  color: varchar("color"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wishlist table
export const wishlist = pgTable("wishlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  orderNumber: varchar("order_number").notNull().unique(),
  status: varchar("status").notNull().default("pending"), // pending, confirmed, shipped, delivered, cancelled, returned
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  paymentMethod: varchar("payment_method"),
  paymentStatus: varchar("payment_status").default("pending"), // pending, paid, failed, refunded
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  shippingAddress: jsonb("shipping_address").notNull(),
  trackingNumber: varchar("tracking_number"),
  estimatedDelivery: timestamp("estimated_delivery"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  size: varchar("size"),
  color: varchar("color"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id),
  rating: integer("rating").notNull(), // 1-5
  title: varchar("title"),
  comment: text("comment"),
  images: text("images").array(),
  isVerified: boolean("is_verified").default(false),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Banners table for home page
export const banners = pgTable("banners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  subtitle: varchar("subtitle"),
  image: varchar("image").notNull(),
  buttonText: varchar("button_text"),
  buttonLink: varchar("button_link"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table for push notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // new_arrival, discount, restock, order_update
  isRead: boolean("is_read").default(false),
  data: jsonb("data"), // Additional data for the notification
  createdAt: timestamp("created_at").defaultNow(),
});

// Product recommendations table
export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  productId: varchar("product_id").references(() => products.id).notNull(),
  relatedProductId: varchar("related_product_id").references(() => products.id).notNull(),
  type: varchar("type").notNull(), // also_like, pair_with, similar
  score: decimal("score", { precision: 3, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Collections table (for upcoming drops)
export const collections = pgTable("collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  image: varchar("image"),
  isUpcoming: boolean("is_upcoming").default(false),
  launchDate: timestamp("launch_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product collections junction table
export const productCollections = pgTable("product_collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  collectionId: varchar("collection_id").references(() => collections.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type CartItem = typeof cart.$inferSelect;
export type WishlistItem = typeof wishlist.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type Banner = typeof banners.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type Collection = typeof collections.$inferSelect;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
export const insertCartItemSchema = createInsertSchema(cart).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWishlistItemSchema = createInsertSchema(wishlist).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertAddressSchema = createInsertSchema(addresses).omit({ id: true, createdAt: true });
export const insertBannerSchema = createInsertSchema(banners).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertCollectionSchema = createInsertSchema(collections).omit({ id: true, createdAt: true });

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

// Extended cart item with product details
export type CartItemWithProduct = CartItem & { product: Product };

// Extended order with items
export type OrderWithItems = Order & { items: (OrderItem & { product: Product })[] };

// Product with reviews and recommendations
export type ProductWithDetails = Product & {
  category?: Category;
  reviews?: Review[];
  recommendations?: { alsoLike: Product[]; pairWith: Product[] };
};