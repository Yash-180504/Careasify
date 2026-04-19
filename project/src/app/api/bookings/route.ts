import { db } from '@/lib/db';
import { bookings, vehicles, services, staff, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = (session.user as any).role === 'admin';

    let allBookings;
    if (isAdmin) {
      allBookings = await db
        .select({
          id: bookings.id,
          status: bookings.status,
          scheduledDate: bookings.scheduledDate,
          scheduledTime: bookings.scheduledTime,
          address: bookings.address,
          totalPrice: bookings.totalPrice,
          notes: bookings.notes,
          createdAt: bookings.createdAt,
          staffId: bookings.staffId,
          vehicleMake: vehicles.make,
          vehicleModel: vehicles.model,
          vehicleReg: vehicles.registrationNumber,
          vehicleType: vehicles.vehicleType,
          serviceName: services.name,
          serviceCategory: services.category,
          userName: users.name,
          userEmail: users.email,
          userPhone: users.phone,
        })
        .from(bookings)
        .leftJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
        .leftJoin(services, eq(bookings.serviceId, services.id))
        .leftJoin(users, eq(bookings.userId, users.id))
        .orderBy(desc(bookings.createdAt));
    } else {
      allBookings = await db
        .select({
          id: bookings.id,
          status: bookings.status,
          scheduledDate: bookings.scheduledDate,
          scheduledTime: bookings.scheduledTime,
          address: bookings.address,
          totalPrice: bookings.totalPrice,
          notes: bookings.notes,
          createdAt: bookings.createdAt,
          staffId: bookings.staffId,
          vehicleMake: vehicles.make,
          vehicleModel: vehicles.model,
          vehicleReg: vehicles.registrationNumber,
          serviceName: services.name,
          serviceCategory: services.category,
        })
        .from(bookings)
        .leftJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
        .leftJoin(services, eq(bookings.serviceId, services.id))
        .where(eq(bookings.userId, session.user.id!))
        .orderBy(desc(bookings.createdAt));
    }

    return Response.json(allBookings);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const [booking] = await db.insert(bookings).values({
      userId: session.user.id!,
      vehicleId: data.vehicleId,
      serviceId: data.serviceId,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      address: data.address,
      totalPrice: data.totalPrice,
      notes: data.notes || null,
      status: 'pending',
    }).returning();

    return Response.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking create error:', error);
    return Response.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
