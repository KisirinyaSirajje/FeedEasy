import * as SQLite from 'expo-sqlite';

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  userType: 'farmer' | 'seller';
  firstName: string;
  lastName: string;
  location: string;
  profileImage?: string;
  createdAt: string;
}

export interface Product {
  id: number;
  sellerId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  weight: string;
  brand: string;
  ingredients?: string;
  nutritionalInfo?: string;
  quality_certificates?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  farmerId: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: string;
  orderDate: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  orderId?: number;
  message: string;
  messageType: 'text' | 'image';
  isRead: boolean;
  createdAt: string;
}

export interface Rating {
  id: number;
  productId: number;
  farmerId: number;
  rating: number;
  review?: string;
  createdAt: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('feedeasy.db');
    this.initializeTables();
    this.checkAndFixDatabase();
  }

  // Method to reset database (for development/testing)
  resetDatabase() {
    try {
      console.log('Resetting database...');
      this.db.execSync('DROP TABLE IF EXISTS order_items');
      this.db.execSync('DROP TABLE IF EXISTS orders');
      this.db.execSync('DROP TABLE IF EXISTS products');
      this.db.execSync('DROP TABLE IF EXISTS users');
      this.db.execSync('DROP TABLE IF EXISTS messages');
      this.db.execSync('DROP TABLE IF EXISTS ratings');
      this.initializeTables();
      console.log('Database reset successfully');
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  }

  // Method to force database reset (for development)
  forceResetDatabase() {
    console.log('Force resetting database...');
    this.resetDatabase();
  }

  // Method to check and fix database schema
  checkAndFixDatabase() {
    try {
      // Check if orders table has orderNumber column
      const columns = this.db.getAllSync("PRAGMA table_info(orders)") as any[];
      const hasOrderNumber = columns.some(col => col.name === 'orderNumber');
      
      if (!hasOrderNumber) {
        console.log('Orders table missing orderNumber column. Resetting database...');
        this.resetDatabase();
      }
    } catch (error) {
      console.error('Error checking database schema:', error);
      console.log('Attempting to reset database...');
      try {
        this.resetDatabase();
      } catch (resetError) {
        console.error('Failed to reset database:', resetError);
      }
    }
  }

  private initializeTables() {
    // Users table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        userType TEXT NOT NULL CHECK (userType IN ('farmer', 'seller')),
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        location TEXT NOT NULL,
        profileImage TEXT,
        passwordHash TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Products table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sellerId INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        weight TEXT,
        brand TEXT,
        ingredients TEXT,
        nutritionalInfo TEXT,
        quality_certificates TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sellerId) REFERENCES users (id)
      );
    `);

    // Orders table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderNumber TEXT UNIQUE NOT NULL,
        farmerId INTEGER NOT NULL,
        totalAmount REAL NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
        deliveryAddress TEXT NOT NULL,
        paymentMethod TEXT NOT NULL,
        orderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        estimatedDelivery DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmerId) REFERENCES users (id)
      );
    `);

    // Migration: Add orderNumber column to existing orders table if it doesn't exist
    try {
      // Check if orderNumber column exists
      const columns = this.db.getAllSync("PRAGMA table_info(orders)") as any[];
      const hasOrderNumber = columns.some(col => col.name === 'orderNumber');
      
      if (!hasOrderNumber) {
        this.db.execSync(`
          ALTER TABLE orders ADD COLUMN orderNumber TEXT UNIQUE;
        `);
        
        // Update existing orders with generated order numbers
        const existingOrders = this.db.getAllSync('SELECT id FROM orders WHERE orderNumber IS NULL') as any[];
        for (const order of existingOrders) {
          const orderNumber = this.generateOrderNumber();
          this.db.runSync('UPDATE orders SET orderNumber = ? WHERE id = ?', [orderNumber, order.id]);
        }
      }
    } catch (error) {
      console.log('Migration error:', error);
    }

    // Order Items table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        productName TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        totalPrice REAL NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders (id),
        FOREIGN KEY (productId) REFERENCES products (id)
      );
    `);

    // Messages table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        senderId INTEGER NOT NULL,
        receiverId INTEGER NOT NULL,
        orderId INTEGER,
        message TEXT NOT NULL,
        messageType TEXT DEFAULT 'text' CHECK (messageType IN ('text', 'image')),
        isRead BOOLEAN DEFAULT FALSE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES users (id),
        FOREIGN KEY (receiverId) REFERENCES users (id),
        FOREIGN KEY (orderId) REFERENCES orders (id)
      );
    `);

    // Ratings table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        farmerId INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products (id),
        FOREIGN KEY (farmerId) REFERENCES users (id)
      );
    `);

    // Seed some initial data
    this.seedInitialData();
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FE${timestamp}${random}`;
  }

  private seedInitialData() {
    // Check if we already have users
    const userCount = this.db.getFirstSync('SELECT COUNT(*) as count FROM users');
    if (userCount && (userCount as any).count === 0) {
      // Insert sample users
      this.db.execSync(`
        INSERT INTO users (username, email, phone, userType, firstName, lastName, location, passwordHash) VALUES
        ('farmer1', 'farmer1@example.com', '+256700000001', 'farmer', 'John', 'Farmer', 'Kampala', 'hashedpassword'),
        ('seller1', 'seller1@example.com', '+256700000002', 'seller', 'Mary', 'Seller', 'Wakiso', 'hashedpassword'),
        ('farmer2', 'farmer2@example.com', '+256700000003', 'farmer', 'David', 'Mukasa', 'Jinja', 'hashedpassword');
      `);

      // Insert sample products
      this.db.execSync(`
        INSERT INTO products (sellerId, name, description, price, category, stock, image, weight, brand, ingredients) VALUES
        (2, 'Premium Poultry Feed', 'High-quality poultry feed for layers and broilers', 45000, 'poultry', 100, 'https://via.placeholder.com/300x200', '50kg', 'FeedEasy Premium', 'Maize, Soybean meal, Fish meal, Vitamins'),
        (2, 'Pig Grower Feed', 'Nutritious feed for growing pigs', 38000, 'pig', 75, 'https://via.placeholder.com/300x200', '50kg', 'FeedEasy Pro', 'Maize, Soybean meal, Rice bran, Minerals'),
        (2, 'Dairy Cattle Feed', 'High-energy feed for dairy cows', 42000, 'cattle', 50, 'https://via.placeholder.com/300x200', '50kg', 'FeedEasy Dairy', 'Maize, Cotton seed cake, Molasses, Vitamins'),
        (2, 'Fish Feed Pellets', 'Complete nutrition for fish farming', 35000, 'fish', 60, 'https://via.placeholder.com/300x200', '25kg', 'AquaFeed Pro', 'Fish meal, Wheat flour, Vitamins, Minerals');
      `);
    }
  }

  // User methods
  async createUser(user: Omit<User, 'id' | 'createdAt'> & { passwordHash: string }): Promise<number> {
    const result = this.db.runSync(
      'INSERT INTO users (username, email, phone, userType, firstName, lastName, location, profileImage, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user.username, user.email, user.phone, user.userType, user.firstName, user.lastName, user.location, user.profileImage || null, user.passwordHash]
    );
    return result.lastInsertRowId;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.db.getFirstSync('SELECT * FROM users WHERE email = ?', [email]);
    return user as User | null;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = this.db.getFirstSync('SELECT * FROM users WHERE id = ?', [id]);
    return user as User | null;
  }

  async getUserWithPassword(email: string): Promise<(User & { passwordHash: string }) | null> {
    const user = this.db.getFirstSync('SELECT * FROM users WHERE email = ?', [email]);
    return user as (User & { passwordHash: string }) | null;
  }

  // Product methods
  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const result = this.db.runSync(
      'INSERT INTO products (sellerId, name, description, price, category, stock, image, weight, brand, ingredients, nutritionalInfo, quality_certificates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [product.sellerId, product.name, product.description, product.price, product.category, product.stock, product.image, product.weight, product.brand, product.ingredients || null, product.nutritionalInfo || null, product.quality_certificates || null]
    );
    return result.lastInsertRowId;
  }

  async getProducts(): Promise<Product[]> {
    const products = this.db.getAllSync('SELECT * FROM products ORDER BY createdAt DESC');
    return products as Product[];
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    const products = this.db.getAllSync('SELECT * FROM products WHERE sellerId = ? ORDER BY createdAt DESC', [sellerId]);
    return products as Product[];
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = this.db.getAllSync('SELECT * FROM products WHERE category = ? ORDER BY createdAt DESC', [category]);
    return products as Product[];
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = this.db.getFirstSync('SELECT * FROM products WHERE id = ?', [id]);
    return product as Product | null;
  }

  async updateProduct(id: number, updates: Partial<Omit<Product, 'id' | 'sellerId' | 'createdAt'>>): Promise<boolean> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), new Date().toISOString(), id];
    
    const result = this.db.runSync(
      `UPDATE products SET ${setClause}, updatedAt = ? WHERE id = ?`,
      values
    );
    return result.changes > 0;
  }

  async deleteProduct(id: number, sellerId: number): Promise<boolean> {
    const result = this.db.runSync('DELETE FROM products WHERE id = ? AND sellerId = ?', [id, sellerId]);
    return result.changes > 0;
  }

  // Order methods
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>, items: Omit<OrderItem, 'id' | 'orderId'>[]): Promise<number> {
    // Start transaction
    this.db.execSync('BEGIN TRANSACTION');
    
    try {
      // Generate order number if not provided
      const orderNumber = order.orderNumber || this.generateOrderNumber();
      
      // Ensure database schema is correct before inserting
      this.checkAndFixDatabase();
      
      // Create the order
      const orderResult = this.db.runSync(
        'INSERT INTO orders (orderNumber, farmerId, totalAmount, status, deliveryAddress, paymentMethod, orderDate, estimatedDelivery) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [orderNumber, order.farmerId, order.totalAmount, order.status, order.deliveryAddress, order.paymentMethod, order.orderDate, order.estimatedDelivery || null]
      );
      
      const orderId = orderResult.lastInsertRowId;
      
      // Create order items
      for (const item of items) {
        this.db.runSync(
          'INSERT INTO order_items (orderId, productId, productName, quantity, price, totalPrice) VALUES (?, ?, ?, ?, ?, ?)',
          [orderId, item.productId, item.productName, item.quantity, item.price, item.totalPrice]
        );
      }
      
      // Commit transaction
      this.db.execSync('COMMIT');
      return orderId;
    } catch (error) {
      // Rollback on error
      this.db.execSync('ROLLBACK');
      throw error;
    }
  }

  async getOrdersByFarmer(farmerId: number): Promise<Order[]> {
    const orders = this.db.getAllSync('SELECT * FROM orders WHERE farmerId = ? ORDER BY orderDate DESC', [farmerId]);
    return orders as Order[];
  }

  async getOrderWithItems(orderId: number): Promise<(Order & { items: OrderItem[] }) | null> {
    const order = this.db.getFirstSync('SELECT * FROM orders WHERE id = ?', [orderId]) as Order | null;
    if (!order) return null;
    
    const items = this.db.getAllSync('SELECT * FROM order_items WHERE orderId = ?', [orderId]) as OrderItem[];
    return { ...order, items };
  }

  async updateOrderStatus(id: number, status: Order['status']): Promise<boolean> {
    const result = this.db.runSync('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return result.changes > 0;
  }

  async getOrderById(id: number): Promise<Order | null> {
    const order = this.db.getFirstSync('SELECT * FROM orders WHERE id = ?', [id]);
    return order as Order | null;
  }

  async getAllOrders(): Promise<Order[]> {
    const orders = this.db.getAllSync('SELECT * FROM orders ORDER BY orderDate DESC');
    return orders as Order[];
  }

  // Message methods
  async createMessage(message: Omit<Message, 'id' | 'createdAt'>): Promise<number> {
    const result = this.db.runSync(
      'INSERT INTO messages (senderId, receiverId, orderId, message, messageType, isRead) VALUES (?, ?, ?, ?, ?, ?)',
      [message.senderId, message.receiverId, message.orderId || null, message.message, message.messageType, message.isRead]
    );
    return result.lastInsertRowId;
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    const messages = this.db.getAllSync(
      'SELECT * FROM messages WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?) ORDER BY createdAt ASC',
      [user1Id, user2Id, user2Id, user1Id]
    );
    return messages as Message[];
  }

  async getAllMessagesForUser(userId: number): Promise<Message[]> {
    const messages = this.db.getAllSync(
      'SELECT * FROM messages WHERE senderId = ? OR receiverId = ? ORDER BY createdAt DESC',
      [userId, userId]
    );
    return messages as Message[];
  }

  async markMessagesAsRead(senderId: number, receiverId: number): Promise<boolean> {
    const result = this.db.runSync(
      'UPDATE messages SET isRead = TRUE WHERE senderId = ? AND receiverId = ?',
      [senderId, receiverId]
    );
    return result.changes > 0;
  }

  async getUnreadMessageCount(userId: number): Promise<number> {
    const result = this.db.getFirstSync('SELECT COUNT(*) as count FROM messages WHERE receiverId = ? AND isRead = FALSE', [userId]);
    return (result as any)?.count || 0;
  }

  // Rating methods
  async createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<number> {
    const result = this.db.runSync(
      'INSERT INTO ratings (productId, farmerId, rating, review) VALUES (?, ?, ?, ?)',
      [rating.productId, rating.farmerId, rating.rating, rating.review || null]
    );
    return result.lastInsertRowId;
  }

  async getRatingsForProduct(productId: number): Promise<Rating[]> {
    const ratings = this.db.getAllSync('SELECT * FROM ratings WHERE productId = ? ORDER BY createdAt DESC', [productId]);
    return ratings as Rating[];
  }
}

export default new DatabaseService();
