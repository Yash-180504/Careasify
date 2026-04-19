import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allServices = await db.select().from(services).where(eq(services.isActive, true));
    return Response.json(allServices);
  } catch (error) {
    console.error('Services fetch error:', error);
    return Response.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const [service] = await db.insert(services).values(data).returning();
    return Response.json(service, { status: 201 });
  } catch (error) {
    console.error('Service create error:', error);
    return Response.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
