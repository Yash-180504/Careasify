import { db } from '@/lib/db';
import { bookings } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const updateData: Record<string, any> = {};
    if (data.status) updateData.status = data.status;
    if (data.staffId) updateData.staffId = data.staffId;
    if (data.scheduledDate) updateData.scheduledDate = data.scheduledDate;
    if (data.scheduledTime) updateData.scheduledTime = data.scheduledTime;
    if (data.notes !== undefined) updateData.notes = data.notes;
    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();

    if (!updated) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    console.error('Booking update error:', error);
    return Response.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const [deleted] = await db
      .update(bookings)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();

    return Response.json(deleted);
  } catch (error) {
    console.error('Booking cancel error:', error);
    return Response.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
