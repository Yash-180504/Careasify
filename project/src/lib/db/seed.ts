import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { hash } from 'bcryptjs';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is required. Set it in .env.local or export it before running seed.');
  process.exit(1);
}

const DATABASE_URL: string = databaseUrl;

async function seed() {
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPasswordHash = await hash('admin123', 12);
  const [admin] = await db.insert(schema.users).values({
    name: 'Admin',
    email: 'admin@careasify.com',
    passwordHash: adminPasswordHash,
    phone: '+91 9876543210',
    role: 'admin',
    address: 'Careasify HQ, Bangalore',
    city: 'Bangalore',
  }).onConflictDoNothing().returning();
  console.log('✅ Admin user created');

  // Create a demo customer
  const customerPasswordHash = await hash('customer123', 12);
  const [customer] = await db.insert(schema.users).values({
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    passwordHash: customerPasswordHash,
    phone: '+91 9876543211',
    role: 'customer',
    address: '123 MG Road, Koramangala',
    city: 'Bangalore',
  }).onConflictDoNothing().returning();
  console.log('✅ Demo customer created');

  // Create services
  const servicesData = [
    {
      name: 'Exterior Waterless Wash',
      description: 'Eco-friendly waterless exterior cleaning using premium carnauba wax formula. Leaves your car shiny and dust-resistant.',
      basePrice: '499',
      durationMinutes: 30,
      category: 'exterior_wash' as const,
    },
    {
      name: 'Interior Deep Clean',
      description: 'Complete interior vacuum cleaning, dashboard dressing, seat cleaning, and air freshener treatment.',
      basePrice: '699',
      durationMinutes: 45,
      category: 'interior_cleaning' as const,
    },
    {
      name: 'Full Car Wash',
      description: 'Complete exterior and interior cleaning. Includes waterless wash, vacuum, dashboard polish, and tire shine.',
      basePrice: '999',
      durationMinutes: 60,
      category: 'full_wash' as const,
    },
    {
      name: 'Premium Detailing',
      description: 'Deep cleaning with clay bar treatment, machine polish, ceramic coating, and leather conditioning.',
      basePrice: '2499',
      durationMinutes: 120,
      category: 'detailing' as const,
    },
    {
      name: 'Express Wash',
      description: 'Quick exterior wash and wipe down. Perfect for a rapid refresh before meetings or events.',
      basePrice: '299',
      durationMinutes: 15,
      category: 'exterior_wash' as const,
    },
    {
      name: 'Engine Bay Cleaning',
      description: 'Safe degreasing and cleaning of the engine compartment. Improves aesthetics and helps spot leaks.',
      basePrice: '799',
      durationMinutes: 45,
      category: 'detailing' as const,
    },
  ];

  await db.insert(schema.services).values(servicesData).onConflictDoNothing();
  console.log('✅ Services created');

  // Create subscription plans
  const plansData = [
    {
      name: 'Daily Cleaning',
      description: 'Waterless exterior cleaning 6 days a week with weekly interior vacuum cleaning.',
      priceHatchback: '1499',
      priceSedan: '1799',
      priceSuv: '2199',
      frequency: 'daily' as const,
      exteriorCleanings: '6 days per week',
      interiorCleanings: 'Once a week',
      features: 'Waterless exterior cleaning,Vacuum interior cleaning,Dashboard dressing,Tire polish,App tracking,Priority support',
      tier: 'premium',
    },
    {
      name: 'Alternate Day Cleaning',
      description: 'Waterless exterior cleaning 3 days a week with weekly interior vacuum cleaning.',
      priceHatchback: '999',
      priceSedan: '1199',
      priceSuv: '1499',
      frequency: 'alternate_days' as const,
      exteriorCleanings: '3 days per week',
      interiorCleanings: 'Once a week',
      features: 'Waterless exterior cleaning,Vacuum interior cleaning,Dashboard dressing,Tire polish,App tracking',
      tier: 'standard',
    },
    {
      name: 'Weekly Cleaning',
      description: 'Once a week complete exterior and interior cleaning.',
      priceHatchback: '599',
      priceSedan: '749',
      priceSuv: '899',
      frequency: 'weekly' as const,
      exteriorCleanings: 'Once a week',
      interiorCleanings: 'Once a week',
      features: 'Waterless exterior cleaning,Vacuum interior cleaning,Dashboard dressing,App tracking',
      tier: 'basic',
    },
  ];

  await db.insert(schema.subscriptionPlans).values(plansData).onConflictDoNothing();
  console.log('✅ Subscription plans created');

  // Create staff members
  const staffData = [
    { name: 'Suresh Kumar', phone: '+91 9876543001', specialization: 'Exterior Wash', currentArea: 'Koramangala', status: 'available' as const },
    { name: 'Ramesh Patel', phone: '+91 9876543002', specialization: 'Interior Cleaning', currentArea: 'HSR Layout', status: 'available' as const },
    { name: 'Vijay Singh', phone: '+91 9876543003', specialization: 'Full Detailing', currentArea: 'Indiranagar', status: 'available' as const },
    { name: 'Anil Reddy', phone: '+91 9876543004', specialization: 'Exterior Wash', currentArea: 'Whitefield', status: 'busy' as const },
    { name: 'Manoj Gupta', phone: '+91 9876543005', specialization: 'Interior Cleaning', currentArea: 'JP Nagar', status: 'available' as const },
    { name: 'Ravi Verma', phone: '+91 9876543006', specialization: 'Full Detailing', currentArea: 'BTM Layout', status: 'off_duty' as const },
  ];

  await db.insert(schema.staff).values(staffData).onConflictDoNothing();
  console.log('✅ Staff members created');

  // Create a demo vehicle for the customer
  if (customer) {
    await db.insert(schema.vehicles).values({
      userId: customer.id,
      make: 'Hyundai',
      model: 'Creta',
      year: 2023,
      registrationNumber: 'KA-01-AB-1234',
      vehicleType: 'suv',
      color: 'White',
    });
    console.log('✅ Demo vehicle created');
  }

  console.log('🎉 Seed complete!');
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
