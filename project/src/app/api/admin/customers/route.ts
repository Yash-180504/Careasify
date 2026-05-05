import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        city: users.city,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, 'customer'));

    return Response.json(customers);
  } catch (error) {
    console.error('Customers fetch error:', error);
    return Response.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
