import { db } from '@/lib/db';
import { vehicles } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userVehicles = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.userId, session.user.id!));

    return Response.json(userVehicles);
  } catch (error) {
    console.error('Vehicles fetch error:', error);
    return Response.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const [vehicle] = await db.insert(vehicles).values({
      userId: session.user.id!,
      make: data.make,
      model: data.model,
      year: data.year || null,
      registrationNumber: data.registrationNumber,
      vehicleType: data.vehicleType || 'sedan',
      color: data.color || null,
    }).returning();

    return Response.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Vehicle create error:', error);
    return Response.json({ error: 'Failed to add vehicle' }, { status: 500 });
  }
}
