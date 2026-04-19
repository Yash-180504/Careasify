import { db } from '@/lib/db';
import { vehicles } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

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
      .delete(vehicles)
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, session.user.id!)))
      .returning();

    if (!deleted) {
      return Response.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Vehicle delete error:', error);
    return Response.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}
