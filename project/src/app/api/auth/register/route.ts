import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, address, city } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    // Check if user exists
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return Response.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    const [user] = await db.insert(users).values({
      name,
      email,
      passwordHash,
      phone: phone || null,
      address: address || null,
      city: city || null,
      role: 'customer',
    }).returning();

    return Response.json({
      id: user.id,
      name: user.name,
      email: user.email,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Registration failed' }, { status: 500 });
  }
}
