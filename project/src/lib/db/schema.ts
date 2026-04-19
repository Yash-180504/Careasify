import { pgTable, text, timestamp, integer, boolean, decimal, uuid, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'admin']);
export const vehicleTypeEnum = pgEnum('vehicle_type', ['hatchback', 'sedan', 'suv', 'luxury']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'paused', 'cancelled', 'expired']);
export const serviceCategoryEnum = pgEnum('service_category', ['exterior_wash', 'interior_cleaning', 'full_wash', 'detailing', 'subscription_wash']);
export const frequencyEnum = pgEnum('frequency', ['daily', 'alternate_days', 'weekly']);
export const staffStatusEnum = pgEnum('staff_status', ['available', 'busy', 'off_duty']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  phone: text('phone'),
  role: userRoleEnum('role').default('customer').notNull(),
  address: text('address'),
  city: text('city'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Vehicles table
export const vehicles = pgTable('vehicles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year'),
  registrationNumber: text('registration_number').notNull(),
  vehicleType: vehicleTypeEnum('vehicle_type').default('sedan').notNull(),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Services table
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  durationMinutes: integer('duration_minutes').default(30),
  category: serviceCategoryEnum('category').notNull(),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Subscription plans
export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  priceHatchback: decimal('price_hatchback', { precision: 10, scale: 2 }).notNull(),
  priceSedan: decimal('price_sedan', { precision: 10, scale: 2 }).notNull(),
  priceSuv: decimal('price_suv', { precision: 10, scale: 2 }).notNull(),
  frequency: frequencyEnum('frequency').notNull(),
  exteriorCleanings: text('exterior_cleanings').notNull(),
  interiorCleanings: text('interior_cleanings').notNull(),
  features: text('features'),
  tier: text('tier').default('premium'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Bookings table
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id, { onDelete: 'cascade' }).notNull(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  status: bookingStatusEnum('status').default('pending').notNull(),
  scheduledDate: text('scheduled_date').notNull(),
  scheduledTime: text('scheduled_time').notNull(),
  address: text('address').notNull(),
  staffId: uuid('staff_id'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User subscriptions
export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  planId: uuid('plan_id').references(() => subscriptionPlans.id).notNull(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id, { onDelete: 'cascade' }).notNull(),
  status: subscriptionStatusEnum('status').default('active').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  nextCleaningDate: text('next_cleaning_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Staff table
export const staff = pgTable('staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  phone: text('phone').notNull(),
  specialization: text('specialization'),
  status: staffStatusEnum('status').default('available').notNull(),
  currentArea: text('current_area'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('5.00'),
  totalJobs: integer('total_jobs').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Reviews
export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
