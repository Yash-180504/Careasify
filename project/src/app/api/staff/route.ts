import { db } from '@/lib/db';
import { staff } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allStaff = await db.select().from(staff);
    return Response.json(allStaff);
  } catch (error) {
    console.error('Staff fetch error:', error);
    return Response.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const [member] = await db.insert(staff).values({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      specialization: data.specialization || null,
      currentArea: data.currentArea || null,
      status: data.status || 'available',
    }).returning();

    return Response.json(member, { status: 201 });
  } catch (error) {
    console.error('Staff create error:', error);
    return Response.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}
